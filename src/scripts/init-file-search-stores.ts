/**
 * Script to initialize File Search stores for all agents
 *
 * This script creates a File Search store for each agent in the system.
 * Run this once during initial setup or when adding new agents.
 *
 * Usage: pnpm tsx src/scripts/init-file-search-stores.ts
 */

import { agents } from "@/lib/mock-data/agents";
import { createFileSearchStore, listStores } from "@/lib/gemini-file-search";

async function initializeStores() {
  console.log("🚀 Initializing File Search stores for all agents...\n");

  try {
    // Get existing stores
    const existingStores = await listStores();
    const existingAgentIds = new Set(existingStores.map((s) => s.agentId));

    console.log(`Found ${existingStores.length} existing stores`);
    if (existingStores.length > 0) {
      console.log(
        "Existing stores:",
        existingStores.map((s) => s.agentId).join(", ")
      );
    }
    console.log();

    // Create stores for agents that don't have one
    let createdCount = 0;
    let skippedCount = 0;

    for (const agent of agents) {
      if (existingAgentIds.has(agent.id)) {
        console.log(`⏭️  Skipping ${agent.id} - store already exists`);
        skippedCount++;
        continue;
      }

      console.log(`📁 Creating store for ${agent.id}...`);

      try {
        const store = await createFileSearchStore(
          agent.id,
          `${agent.name} Store`,
          `File Search store for ${agent.name} agent - ${agent.description}`
        );

        console.log(
          `✅ Created store: ${store.name} (ID: ${store.storeId.substring(0, 20)}...)`
        );
        createdCount++;
      } catch (error) {
        console.error(`❌ Failed to create store for ${agent.id}:`, error);
        throw error;
      }

      console.log();
    }

    console.log("\n✨ Initialization complete!");
    console.log(`   Created: ${createdCount} stores`);
    console.log(`   Skipped: ${skippedCount} stores (already existed)`);
    console.log(`   Total: ${agents.length} agents`);
  } catch (error) {
    console.error("\n❌ Initialization failed:", error);
    process.exit(1);
  }
}

// Run the script
initializeStores()
  .then(() => {
    console.log("\n👋 Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n💥 Unexpected error:", error);
    process.exit(1);
  });
