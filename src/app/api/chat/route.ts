import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { getSystemPromptText } from "@/lib/agent-prompts";
import { getStoreByAgentId } from "@/lib/gemini-file-search";
import { extractCitations } from "@/lib/extract-citations";
import { rateLimit, RateLimitPresets, createRateLimitResponse } from "@/lib/rate-limit";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { logger } from "@/lib/logger";

// Mark this route as dynamic (don't evaluate during build)
export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // 1. Authenticate user (for rate limiting)
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    // 2. Rate limiting: 30 messages per minute (use IP if not authenticated)
    const rateLimitIdentifier = session?.user?.id || req.headers.get("x-forwarded-for") || "anonymous";
    const rateLimitResult = rateLimit(
      `chat:${rateLimitIdentifier}`,
      RateLimitPresets.chatMessage
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(RateLimitPresets.chatMessage, rateLimitResult);
    }

    // 3. Validate request body
    const body = await req.json();
    logger.debug("Received chat request", { body });
    const { messages, agentId }: { messages: UIMessage[]; agentId?: string } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      logger.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "AI service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    // Initialize Google Gemini
    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // Get system prompt for agent (if agentId provided)
    let systemPrompt = "";
    let fileSearchTool = undefined;
    let fileSearchStore = undefined; // Store reference for citation extraction

    if (agentId) {
      systemPrompt = getSystemPromptText(agentId);

      // Configure File Search tool for document-grounded responses
      try {
        fileSearchStore = await getStoreByAgentId(agentId);
        logger.info("File Search store available", { storeId: fileSearchStore.storeId, agentId });

        fileSearchTool = {
          file_search: google.tools.fileSearch({
            fileSearchStoreNames: [fileSearchStore.storeId],
            topK: 10,
          }),
        };
      } catch (error) {
        logger.error("Error getting File Search store", { error, agentId });
        // Continue without File Search if store retrieval fails
      }
    }

    // Configure streamText with system prompt and File Search tool
    logger.debug("Converting messages to model format", {
      messagesCount: messages.length,
      firstMessage: messages[0],
    });

    let convertedMessages;
    try {
      convertedMessages = convertToModelMessages(messages);
    } catch (error) {
      logger.error("Error converting messages", { error, messages });
      throw new Error(`Message conversion failed: ${error instanceof Error ? error.message : String(error)}`);
    }

    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: convertedMessages,
      system: systemPrompt || undefined,
      tools: fileSearchTool || undefined,
      // Extract citations after streaming completes (non-blocking)
      onFinish: async ({ text, finishReason }) => {
        // Only extract citations if we have an agentId and File Search is enabled
        if (!agentId || !fileSearchTool) {
          return;
        }

        try {
          logger.debug("Extracting citations post-stream", {
            agentId,
            finishReason,
            responseLength: text.length,
          });

          // Extract citations using native Google SDK
          // Pass storeId to avoid duplicate database query
          const citations = await extractCitations(
            convertToModelMessages(messages),
            agentId,
            process.env.GEMINI_MODEL || "gemini-2.5-flash",
            fileSearchStore?.storeId // Pass pre-fetched storeId to avoid duplicate lookup
          );

          if (citations.length > 0) {
            logger.info("Citations extracted successfully", {
              agentId,
              citationCount: citations.length,
              documentNames: citations.map(c => c.documentName),
            });

            // TODO: Send citations to frontend via data stream
            // Current AI SDK version doesn't support StreamData in the expected way
            // Citations will be added in a future update when SDK supports it
            // For now, citations are logged for backend verification
          } else {
            logger.debug("No citations found in response", { agentId });
          }
        } catch (error) {
          // Non-critical error - don't fail the request
          logger.error("Citation extraction failed in onFinish", {
            error: error instanceof Error ? error.message : String(error),
            agentId,
          });
        }
      },
    });

    // Return standard text stream response
    return result.toTextStreamResponse();
  } catch (error) {
    logger.error("Chat API error", { error });
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
