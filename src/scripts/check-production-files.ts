/**
 * Check Production Files and Stores
 *
 * This script checks what files and File Search stores exist in production
 *
 * Run with: POSTGRES_URL='production-url' npx tsx src/scripts/check-production-files.ts
 */

import { db } from "@/lib/db";
import { documents, fileSearchStores } from "@/lib/schema";

async function checkProductionFiles() {
  console.log("🔍 Checking Production Files and Stores...\n");

  try {
    // Check File Search stores
    console.log("📦 File Search Stores:");
    console.log("━".repeat(60));
    const stores = await db.select().from(fileSearchStores);

    if (stores.length === 0) {
      console.log("❌ No File Search stores found in production database");
      console.log("\n💡 This means you need to:");
      console.log("   1. Upload documents via the Documents page");
      console.log("   2. Or run the upload script for production");
    } else {
      stores.forEach((store, index) => {
        console.log(`\n${index + 1}. ${store.agentId}`);
        console.log(`   Store ID: ${store.storeId}`);
        console.log(`   Name: ${store.name || "N/A"}`);
        console.log(`   Created: ${store.createdAt}`);
      });
    }

    // Check documents
    console.log("\n\n📄 Documents:");
    console.log("━".repeat(60));
    const docs = await db.select().from(documents);

    if (docs.length === 0) {
      console.log("❌ No documents found in production database");
      console.log("\n💡 You need to upload documents to production:");
      console.log("   Option 1: Use the Documents page at https://vlm-notebook.vercel.app/documents");
      console.log("   Option 2: Run upload script with production env vars");
    } else {
      console.log(`\n✅ Found ${docs.length} document(s):\n`);
      docs.forEach((doc, index) => {
        console.log(`${index + 1}. ${doc.filename}`);
        console.log(`   File ID: ${doc.fileId}`);
        console.log(`   Store ID: ${doc.storeId}`);
        console.log(`   Size: ${doc.sizeBytes ? `${(doc.sizeBytes / 1024).toFixed(2)} KB` : "N/A"}`);
        console.log(`   Status: ${doc.status}`);
        console.log(`   Uploaded: ${doc.uploadedAt}`);
        console.log("");
      });
    }

    console.log("\n" + "━".repeat(60));
    console.log("📊 Summary:");
    console.log(`   Stores: ${stores.length}`);
    console.log(`   Documents: ${docs.length}`);

    if (docs.length > 0) {
      console.log("\n✅ Files exist in database!");
      console.log("   They should appear in the Documents page.");
      console.log("   If they don't appear in chat, try:");
      console.log("   1. Refresh the chat page");
      console.log("   2. Check that the agent ID matches the store");
    } else {
      console.log("\n⚠️  No files in production database.");
      console.log("   Upload new files via: https://vlm-notebook.vercel.app/documents");
    }

  } catch (error) {
    console.error("\n❌ Error:", error);
    console.log("\n💡 Make sure:");
    console.log("   1. POSTGRES_URL is set correctly");
    console.log("   2. Database is accessible");
    process.exit(1);
  }
}

checkProductionFiles();
