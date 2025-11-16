import { GoogleGenAI } from "@google/genai";
import { db } from "../lib/db";
import { fileSearchStores, documents } from "../lib/schema";
import { eq } from "drizzle-orm";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

async function diagnoseFileSearch() {
  console.log("=== File Search Diagnostic Tool ===\n");

  try {
    // 1. Check database stores
    console.log("📊 Checking database stores...");
    const dbStores = await db.select().from(fileSearchStores);
    console.log(`Found ${dbStores.length} store(s) in database:\n`);

    for (const store of dbStores) {
      console.log(`Store: ${store.name}`);
      console.log(`  - Agent ID: ${store.agentId}`);
      console.log(`  - Store ID: ${store.storeId}`);
      console.log(`  - Created: ${store.createdAt}`);

      // Check documents in database for this store
      const dbDocs = await db
        .select()
        .from(documents)
        .where(eq(documents.storeId, store.id));

      console.log(`  - Documents in DB: ${dbDocs.length}`);

      if (dbDocs.length > 0) {
        for (const doc of dbDocs) {
          console.log(`    • ${doc.filename}`);
          console.log(`      - Status: ${doc.status}`);
          console.log(`      - File ID: ${doc.fileId || "none"}`);
          console.log(`      - Size: ${(doc.sizeBytes / 1024).toFixed(2)} KB`);
          console.log(`      - Uploaded: ${doc.uploadedAt}`);
        }
      }

      // Try to query Gemini File Search API for this store
      console.log(`\n  🔍 Checking Gemini File Search API...`);
      try {
        const geminiStore = await ai.fileSearchStores.get({
          name: store.storeId,
        });

        console.log(`  ✅ Store exists in Gemini`);
        console.log(`    - Name: ${geminiStore.name}`);
        console.log(`    - Display Name: ${geminiStore.displayName || "none"}`);
        console.log(`    - Create Time: ${geminiStore.createTime || "unknown"}`);

        // Note: Document listing via Google SDK is not implemented in this diagnostic
        // Documents can be verified via the database query above
        console.log(`    - Gemini document listing: Not implemented (check database instead)`);
      } catch (storeError: unknown) {
        const error = storeError as Error;
        console.log(`  ❌ Store NOT found in Gemini: ${error.message}`);
      }

      console.log("\n" + "─".repeat(60) + "\n");
    }

    // 2. Summary
    console.log("\n=== Summary ===");
    const totalDbDocs = await db.select().from(documents);
    const readyDocs = totalDbDocs.filter((d) => d.status === "ready");
    const uploadingDocs = totalDbDocs.filter((d) => d.status === "uploading");
    const failedDocs = totalDbDocs.filter((d) => d.status === "failed");

    console.log(`Total Documents in Database: ${totalDbDocs.length}`);
    console.log(`  - Ready: ${readyDocs.length}`);
    console.log(`  - Uploading: ${uploadingDocs.length}`);
    console.log(`  - Failed: ${failedDocs.length}`);

    if (readyDocs.length === 0) {
      console.log("\n⚠️  WARNING: No documents in 'ready' status!");
      console.log("   Documents must be in 'ready' status to be searchable.");
    }

    console.log("\n=== Recommendations ===");
    if (dbStores.length === 0) {
      console.log("❌ No File Search stores found. Run: pnpm init:stores");
    } else if (totalDbDocs.length === 0) {
      console.log("❌ No documents uploaded. Upload documents via the Documents page or admin script.");
    } else if (readyDocs.length === 0) {
      console.log("⚠️  Documents exist but none are 'ready'. They may still be processing.");
      console.log("   Wait a few moments and run this diagnostic again.");
    } else {
      console.log("✅ File Search setup looks good!");
      console.log("   Try asking a question in the chat interface.");
    }

    // Play success sound (terminal bell)
    process.stdout.write("\x07");
  } catch (error) {
    console.error("❌ Diagnostic failed:", error);
    // Play error sound (double bell)
    process.stdout.write("\x07\x07");
    throw error;
  }
}

// Run diagnostic
diagnoseFileSearch()
  .then(() => {
    console.log("\n🎉 ✅ Diagnostic complete! 🎉");
    // Play celebratory sound (triple bell)
    process.stdout.write("\x07");
    setTimeout(() => process.stdout.write("\x07"), 100);
    setTimeout(() => process.stdout.write("\x07"), 200);
    setTimeout(() => process.exit(0), 400);
  })
  .catch((error) => {
    console.error("\n💥 ❌ Diagnostic error:", error);
    process.stdout.write("\x07\x07");
    setTimeout(() => process.exit(1), 300);
  });
