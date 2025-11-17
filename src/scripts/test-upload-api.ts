import { getStoreByAgentId } from "@/lib/gemini-file-search";

async function testUploadAPI() {
  console.log("Testing File Upload API prerequisites...\n");

  try {
    // 1. Check Gemini API key
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      console.log("❌ GOOGLE_GENERATIVE_AI_API_KEY is not set!");
      console.log("Add it to your .env file");
      process.exit(1);
    }
    console.log("✅ Gemini API key is configured");

    // 2. Check if research-assistant store exists
    const agentId = "research-assistant";
    console.log(`\nChecking File Search store for: ${agentId}`);

    const store = await getStoreByAgentId(agentId);
    console.log(`✅ Store found:`);
    console.log(`   Database ID: ${store.id}`);
    console.log(`   Gemini Store ID: ${store.storeId}`);
    console.log(`   Name: ${store.name}`);

    console.log("\n✅ All prerequisites are met!");
    console.log("\nIf uploads are still failing:");
    console.log("1. Check browser console for errors");
    console.log("2. Check Network tab for failed requests");
    console.log("3. Verify you're signed in as admin");

    process.exit(0);
  } catch (error) {
    console.error("\n❌ Error:", error);
    console.log("\nPlease run: pnpm init:stores");
    process.exit(1);
  }
}

testUploadAPI();
