import { GoogleGenAI } from "@google/genai";
import type { CoreMessage } from "ai";
import type { Citation, GroundingChunk } from "@/lib/types";
import { getStoreByAgentId } from "@/lib/gemini-file-search";
import { logger } from "@/lib/logger";

/**
 * Extract citations from a conversation using Google Gemini File Search
 *
 * This function uses the native Google SDK to access grounding metadata that
 * is not currently exposed by the Vercel AI SDK.
 *
 * @param messages - Array of conversation messages (CoreMessage format)
 * @param agentId - ID of the agent (to get associated File Search store)
 * @param modelName - Gemini model to use (default: gemini-2.5-flash)
 * @param storeId - Optional pre-fetched store ID to avoid duplicate database queries
 * @returns Array of citations, or empty array on error/no citations
 */
export async function extractCitations(
  messages: CoreMessage[],
  agentId: string,
  modelName: string = "gemini-2.5-flash",
  storeId?: string
): Promise<Citation[]> {
  const startTime = Date.now();

  try {
    logger.debug("Extracting citations for agent:", { agentId, messageCount: messages.length });

    // Initialize Google GenAI client
    const ai = new GoogleGenAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
    });

    // Get File Search store for this agent (or use provided storeId)
    let storeIdToUse = storeId;
    if (!storeIdToUse) {
      const store = await getStoreByAgentId(agentId);
      storeIdToUse = store.storeId;
    }

    // Convert CoreMessage format to Google's format
    const contents = messages.map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [
        {
          text: typeof msg.content === "string" ? msg.content : "",
        },
      ],
    }));

    // Call native SDK with File Search tool
    // Using type assertion as the Google SDK types may not be fully up-to-date
    const response = await ai.models.generateContent({
      model: modelName,
      contents,
      config: {
        tools: [
          {
            file_search: {
              file_search_store_names: [storeIdToUse],
            },
          },
        ] as any, // eslint-disable-line @typescript-eslint/no-explicit-any
      },
    });

    // Extract grounding metadata from response
    const candidate = response.candidates?.[0];
    const groundingMetadata = candidate?.groundingMetadata;

    if (!groundingMetadata || !groundingMetadata.groundingChunks) {
      logger.debug("No grounding metadata found in response");
      return [];
    }

    // Parse grounding chunks into Citation objects
    const citations = parseCitations(groundingMetadata.groundingChunks);

    const duration = Date.now() - startTime;
    logger.debug("Citations extracted successfully", {
      citationCount: citations.length,
      duration: `${duration}ms`,
    });

    return citations;
  } catch (error) {
    const duration = Date.now() - startTime;
    logger.error("Citation extraction failed", {
      error: error instanceof Error ? error.message : String(error),
      agentId,
      duration: `${duration}ms`,
    });

    // Graceful degradation - return empty array instead of throwing
    return [];
  }
}

/**
 * Parse Google's grounding chunks into our Citation format
 *
 * @param chunks - Raw grounding chunks from Google API
 * @returns Array of parsed citations
 */
function parseCitations(chunks: GroundingChunk[]): Citation[] {
  const citations: Citation[] = [];

  for (const chunk of chunks) {
    // Extract document name from either web or retrievedContext
    const documentName =
      chunk.retrievedContext?.title ||
      chunk.web?.title ||
      chunk.retrievedContext?.uri ||
      chunk.web?.uri ||
      "Unknown Document";

    // Extract chunk text
    const chunkText = chunk.retrievedContext?.text || chunk.web?.uri || "";

    // Only include citations with actual text content
    if (chunkText.trim().length === 0) {
      continue;
    }

    citations.push({
      documentName,
      chunkText,
      // Note: startIndex, endIndex, and confidence are optional and may not be available
      // from all grounding chunk types. They can be added if Google provides them.
    });
  }

  // Deduplicate citations with identical text
  const uniqueCitations = deduplicateCitations(citations);

  return uniqueCitations;
}

/**
 * Remove duplicate citations based on document name and chunk text
 *
 * @param citations - Array of citations to deduplicate
 * @returns Deduplicated array of citations
 */
function deduplicateCitations(citations: Citation[]): Citation[] {
  const seen = new Set<string>();
  const unique: Citation[] = [];

  for (const citation of citations) {
    const key = `${citation.documentName}:${citation.chunkText}`;

    if (!seen.has(key)) {
      seen.add(key);
      unique.push(citation);
    }
  }

  return unique;
}
