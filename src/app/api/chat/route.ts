import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText, UIMessage, convertToModelMessages } from "ai";
import { getSystemPromptText } from "@/lib/agent-prompts";
import { getStoreByAgentId } from "@/lib/gemini-file-search";

export async function POST(req: Request) {
  try {
    // Validate request body
    const body = await req.json();
    const { messages, agentId }: { messages: UIMessage[]; agentId?: string } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "Invalid request: messages array required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Validate API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
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

    if (agentId) {
      systemPrompt = getSystemPromptText(agentId);

      // TODO: Integrate File Search once we understand the correct API
      // Get File Search store for the agent
      try {
        const store = await getStoreByAgentId(agentId);
        console.log("File Search store available:", store.storeId);
        // File Search integration will be added in a future update
      } catch (error) {
        console.error("Error getting File Search store:", error);
      }
    }

    // Configure streamText with system prompt
    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: convertToModelMessages(messages),
      system: systemPrompt || undefined,
    });

    return (
      result as unknown as { toUIMessageStreamResponse: () => Response }
    ).toUIMessageStreamResponse();
  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to process chat request",
        message: error instanceof Error ? error.message : "Unknown error"
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
