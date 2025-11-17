import { db } from "@/lib/db";
import { fileSearchStores } from "@/lib/schema";

async function checkStores() {
  console.log("Checking File Search stores in database...\n");

  try {
    const stores = await db.select().from(fileSearchStores);

    if (stores.length === 0) {
      console.log("❌ No File Search stores found in database!");
      console.log("\nTo create stores, run: pnpm init:stores");
      process.exit(1);
    }

    console.log(`✅ Found ${stores.length} File Search store(s):\n`);

    stores.forEach((store, index) => {
      console.log(`${index + 1}. Agent ID: ${store.agentId}`);
      console.log(`   Store ID: ${store.storeId}`);
      console.log(`   Name: ${store.name}`);
      console.log(`   Created: ${store.createdAt}\n`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking stores:", error);
    process.exit(1);
  }
}

checkStores();
