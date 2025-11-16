import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
import { getSystemPromptText } from "@/lib/agent-prompts";
import { getStoreByAgentId } from "@/lib/gemini-file-search";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

async function testFileSearch() {
  console.log("=== File Search Test ===\n");

  const agentId = "research-assistant";
  const testQuestion = "What are the core vaccines for dogs according to the WSAVA guidelines?";

  console.log(`Agent: ${agentId}`);
  console.log(`Question: ${testQuestion}\n`);

  try {
    // Get system prompt
    const systemPrompt = getSystemPromptText(agentId);
    console.log(`System Prompt: ${systemPrompt.substring(0, 100)}...\n`);

    // Get File Search store
    const store = await getStoreByAgentId(agentId);
    console.log(`Store ID: ${store.storeId}`);
    console.log(`Store Name: ${store.name}\n`);

    // Configure File Search tool
    const fileSearchTool = {
      file_search: google.tools.fileSearch({
        fileSearchStoreNames: [store.storeId],
        topK: 8,
      }),
    };

    console.log("File Search Tool Configuration:");
    console.log(JSON.stringify(fileSearchTool, null, 2));
    console.log();

    // Call streamText
    console.log("Calling AI model with File Search...\n");

    const result = streamText({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      messages: [
        {
          role: "user",
          content: testQuestion,
        },
      ],
      system: systemPrompt,
      tools: fileSearchTool,
      // Note: experimental_providerMetadata not fully supported in AI SDK v5
      // Citations are extracted separately using native Google SDK
    });

    console.log("=== Response ===\n");

    // Stream the response
    for await (const textPart of result.textStream) {
      process.stdout.write(textPart);
    }

    console.log("\n\n=== Response Metadata ===\n");

    // Get the full result
    const finalResult = await result;

    // Await promises
    const usage = await finalResult.usage;
    const finishReason = await finalResult.finishReason;

    console.log("Usage:", usage);
    console.log("Finish Reason:", finishReason);

    // Check for sources (if available)
    if ("sources" in finalResult && finalResult.sources) {
      console.log("\n=== Sources/Citations ===");
      console.log(JSON.stringify(finalResult.sources, null, 2));
    } else {
      console.log("\n⚠️  No sources found in response");
    }

    // Check provider metadata
    if ("experimental_providerMetadata" in finalResult) {
      console.log("\n=== Provider Metadata ===");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const metadata = (finalResult as any).experimental_providerMetadata;
      console.log(JSON.stringify(metadata, null, 2));

      // Check for Google grounding metadata specifically
      if (metadata?.google?.groundingMetadata) {
        console.log("\n=== Google Grounding Metadata (Citations) ===");
        console.log(JSON.stringify(metadata.google.groundingMetadata, null, 2));
      }
    } else {
      console.log("\n⚠️  No experimental_providerMetadata found");
    }

    // Check all properties of the result
    console.log("\n=== All Result Properties ===");
    console.log(Object.keys(finalResult));

    // Check if there are tool calls/results
    if ("toolCalls" in finalResult) {
      console.log("\n=== Tool Calls ===");
      console.log(JSON.stringify(finalResult.toolCalls, null, 2));
    }

    if ("toolResults" in finalResult) {
      console.log("\n=== Tool Results ===");
      console.log(JSON.stringify(finalResult.toolResults, null, 2));
    }

    // Check response
    if ("response" in finalResult) {
      console.log("\n=== Response Object Keys ===");
      console.log(Object.keys(finalResult.response));
    }

    // Check steps - this is where tool information might be
    if ("_steps" in finalResult) {
      console.log("\n=== Steps (with tool calls) ===");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const steps = (finalResult as any)._steps;
      console.log(`Number of steps: ${steps.length}`);

      for (let i = 0; i < steps.length; i++) {
        console.log(`\nStep ${i + 1}:`);
        console.log(JSON.stringify(steps[i], null, 2));
      }
    }

    console.log("\n✅ Test complete");
    // Play success sound (terminal bell)
    process.stdout.write("\x07"); // Bell character
  } catch (error) {
    console.error("❌ Test failed:", error);
    // Play error sound (double bell)
    process.stdout.write("\x07\x07");
    throw error;
  }
}

// Run test
testFileSearch()
  .then(() => {
    console.log("\n🎉 ✅ All tests passed! 🎉");
    // Play celebratory sound (triple bell)
    process.stdout.write("\x07");
    setTimeout(() => process.stdout.write("\x07"), 100);
    setTimeout(() => process.stdout.write("\x07"), 200);
    setTimeout(() => process.exit(0), 400);
  })
  .catch((error) => {
    console.error("\n💥 ❌ Test error:", error);
    process.stdout.write("\x07\x07");
    setTimeout(() => process.exit(1), 300);
  });
