import { GoogleGenAI } from "@google/genai";
import { db } from "@/lib/db";
import { fileSearchStores, documents } from "@/lib/schema";
import { eq } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

/**
 * Upload veterinary documents to the research-assistant agent's File Search store
 *
 * Usage: pnpm upload:vet-docs
 *
 * Place PDF or DOCX files in ./vet-documents/ directory before running
 */
async function uploadVetDocuments() {
  const agentId = "research-assistant"; // Change this to your veterinary agent ID
  const documentsPath = path.join(process.cwd(), "vet-documents");
  const adminUserId = "admin"; // This should match your admin user ID from database

  console.log("🐾 Starting veterinary document upload...");
  console.log(`📁 Scanning directory: ${documentsPath}`);

  // Check if directory exists
  if (!fs.existsSync(documentsPath)) {
    console.error(`❌ Error: Directory ${documentsPath} does not exist`);
    console.log("💡 Create it with: mkdir vet-documents");
    process.exit(1);
  }

  // Get or verify File Search store for agent
  console.log(`🔍 Looking up File Search store for agent: ${agentId}`);

  const [store] = await db
    .select()
    .from(fileSearchStores)
    .where(eq(fileSearchStores.agentId, agentId))
    .limit(1);

  if (!store) {
    console.error(`❌ Error: No File Search store found for agent ${agentId}`);
    console.log("💡 Run: pnpm init:stores to create File Search stores");
    process.exit(1);
  }

  console.log(`✅ Found store: ${store.name} (${store.storeId})`);

  // Read files from directory
  const files = fs.readdirSync(documentsPath);
  const supportedExtensions = [".pdf", ".docx", ".txt", ".json", ".md"];
  const filesToUpload = files.filter((filename) =>
    supportedExtensions.some((ext) => filename.toLowerCase().endsWith(ext))
  );

  if (filesToUpload.length === 0) {
    console.log("⚠️  No supported files found in vet-documents/");
    console.log(`💡 Supported formats: ${supportedExtensions.join(", ")}`);
    process.exit(0);
  }

  console.log(`📚 Found ${filesToUpload.length} file(s) to upload:\n`);

  let successCount = 0;
  let failCount = 0;

  // Upload each file
  for (const filename of filesToUpload) {
    const filePath = path.join(documentsPath, filename);
    const stats = fs.statSync(filePath);
    const fileSizeMB = (stats.size / (1024 * 1024)).toFixed(2);

    console.log(`📄 Uploading: ${filename} (${fileSizeMB} MB)`);

    try {
      // Determine document type/category from filename
      const metadata: Record<string, string> = {
        category: "veterinary-vaccination",
        uploadedVia: "batch-script",
      };

      // Add species-specific tag based on filename
      if (filename.toLowerCase().includes("canine") || filename.toLowerCase().includes("dog")) {
        metadata.type = "canine";
      } else if (filename.toLowerCase().includes("feline") || filename.toLowerCase().includes("cat")) {
        metadata.type = "feline";
      }

      // Create document record in database
      const [doc] = await db
        .insert(documents)
        .values({
          storeId: store.id,
          userId: adminUserId,
          filename,
          fileId: "", // Will be updated after upload
          mimeType: getMimeType(filename),
          sizeBytes: stats.size,
          status: "uploading",
        })
        .returning();

      // Read file as buffer for upload
      const fileBuffer = fs.readFileSync(filePath);

      // Create a File-like object for Node.js
      const file = new File([fileBuffer], filename, {
        type: getMimeType(filename),
      });

      // Upload to Gemini File Search
      const uploadConfig: {
        file: File;
        fileSearchStoreName: string;
        config: {
          displayName: string;
          customMetadata?: Array<{ key: string; stringValue: string }>;
        };
      } = {
        file,
        fileSearchStoreName: store.storeId,
        config: {
          displayName: filename,
          customMetadata: Object.entries(metadata).map(([key, value]) => ({
            key,
            stringValue: value,
          })),
        },
      };

      let uploadOp = await ai.fileSearchStores.uploadToFileSearchStore(uploadConfig);

      // Poll until the document is fully processed
      process.stdout.write("   ⏳ Processing");
      while (!uploadOp.done) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        uploadOp = await ai.operations.get({ operation: uploadOp });
        process.stdout.write(".");
      }
      process.stdout.write("\n");

      // Check if operation was successful
      if (uploadOp.error) {
        throw new Error(`Upload failed: ${JSON.stringify(uploadOp.error)}`);
      }

      if (!uploadOp.response || !uploadOp.response.documentName) {
        throw new Error("Upload failed: no document name returned");
      }

      // Update document with file ID and status
      await db
        .update(documents)
        .set({
          fileId: uploadOp.response.documentName,
          status: "ready",
        })
        .where(eq(documents.id, doc.id));

      console.log(`   ✅ Success! File ID: ${uploadOp.response.documentName}`);
      successCount++;
    } catch (error) {
      console.error(`   ❌ Failed: ${error instanceof Error ? error.message : String(error)}`);
      failCount++;
    }

    console.log(""); // Empty line for readability
  }

  // Summary
  console.log("═".repeat(50));
  console.log(`📊 Upload Summary:`);
  console.log(`   ✅ Success: ${successCount}`);
  console.log(`   ❌ Failed:  ${failCount}`);
  console.log(`   📁 Total:   ${filesToUpload.length}`);
  console.log("═".repeat(50));

  if (successCount > 0) {
    console.log("\n💡 Documents are now available for File Search queries!");
    console.log(`   Agent: ${agentId}`);
    console.log(`   You can now ask veterinary vaccination questions in the chat.`);
  }
}

/**
 * Get MIME type from filename extension
 */
function getMimeType(filename: string): string {
  const ext = path.extname(filename).toLowerCase();
  const mimeTypes: Record<string, string> = {
    ".pdf": "application/pdf",
    ".docx": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ".txt": "text/plain",
    ".json": "application/json",
    ".md": "text/markdown",
  };
  return mimeTypes[ext] || "application/octet-stream";
}

// Run the upload
uploadVetDocuments()
  .then(() => {
    console.log("\n✨ Upload complete!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Fatal error:", error);
    process.exit(1);
  });
