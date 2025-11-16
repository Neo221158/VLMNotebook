import { GoogleGenAI } from "@google/genai";
import { db } from "./db";
import { fileSearchStores, documents } from "./schema";
import { eq, and } from "drizzle-orm";
import { logger } from "./logger";
import { fileSearchStoreCache } from "./file-search-cache";

// Initialize Google GenAI client
const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

/**
 * Create a new File Search store for an agent
 */
export async function createFileSearchStore(
  agentId: string,
  name: string,
  description?: string
) {
  try {
    // Create store in Gemini
    const fileStore = await ai.fileSearchStores.create({
      config: {
        displayName: name,
      },
    });

    if (!fileStore || !fileStore.name) {
      throw new Error("Failed to create File Search store");
    }

    // Save to database
    const [dbStore] = await db
      .insert(fileSearchStores)
      .values({
        agentId,
        storeId: fileStore.name,
        name,
        description,
      })
      .returning();

    return {
      id: dbStore.id,
      agentId: dbStore.agentId,
      storeId: dbStore.storeId,
      name: dbStore.name,
      description: dbStore.description,
      createdAt: dbStore.createdAt,
    };
  } catch (error) {
    logger.error("Error creating File Search store", { error, agentId, name });
    throw error;
  }
}

/**
 * Get File Search store for an agent (or create if doesn't exist)
 * Uses in-memory cache to reduce database queries
 */
export async function getStoreByAgentId(agentId: string) {
  try {
    // Check cache first
    const cached = fileSearchStoreCache.get(agentId);
    if (cached) {
      logger.debug("File Search store found in cache", { agentId, storeId: cached.storeId });
      return cached;
    }

    // Check if store exists in database
    const [existingStore] = await db
      .select()
      .from(fileSearchStores)
      .where(eq(fileSearchStores.agentId, agentId))
      .limit(1);

    if (existingStore) {
      const store = {
        id: existingStore.id,
        agentId: existingStore.agentId,
        storeId: existingStore.storeId,
        name: existingStore.name,
        description: existingStore.description,
        createdAt: existingStore.createdAt,
      };

      // Cache the result
      fileSearchStoreCache.set(store);
      logger.debug("File Search store cached from database", { agentId, storeId: store.storeId });

      return store;
    }

    // Create new store if doesn't exist
    const newStore = await createFileSearchStore(
      agentId,
      `${agentId}-store`,
      `File Search store for ${agentId} agent`
    );

    // Cache the newly created store
    fileSearchStoreCache.set(newStore);

    return newStore;
  } catch (error) {
    logger.error("Error getting File Search store", { error, agentId });
    throw error;
  }
}

/**
 * List all File Search stores from database
 */
export async function listStores() {
  try {
    const stores = await db.select().from(fileSearchStores);
    return stores.map((store) => ({
      id: store.id,
      agentId: store.agentId,
      storeId: store.storeId,
      name: store.name,
      description: store.description,
      createdAt: store.createdAt,
    }));
  } catch (error) {
    logger.error("Error listing File Search stores", { error });
    throw error;
  }
}

/**
 * Delete a File Search store
 */
export async function deleteStore(storeId: string) {
  try {
    // Delete from Gemini
    await ai.fileSearchStores.delete({
      name: storeId,
      config: { force: true },
    });

    // Delete from database (cascade will delete associated documents)
    await db.delete(fileSearchStores).where(eq(fileSearchStores.storeId, storeId));

    return { success: true };
  } catch (error) {
    logger.error("Error deleting File Search store", { error, storeId });
    throw error;
  }
}

/**
 * Upload a file to a File Search store
 */
export async function uploadDocument(
  storeUuid: string,
  userId: string,
  file: File,
  metadata?: Record<string, string>
) {
  try {
    // Get store from database
    const [store] = await db
      .select()
      .from(fileSearchStores)
      .where(eq(fileSearchStores.id, storeUuid))
      .limit(1);

    if (!store) {
      throw new Error("File Search store not found");
    }

    // Save document to database with "uploading" status
    const [doc] = await db
      .insert(documents)
      .values({
        storeId: storeUuid,
        userId,
        filename: file.name,
        fileId: "", // Will be updated after upload
        mimeType: file.type,
        sizeBytes: file.size,
        status: "uploading",
      })
      .returning();

    try {
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
          displayName: file.name,
        },
      };

      // Add metadata if provided
      if (metadata) {
        uploadConfig.config.customMetadata = Object.entries(metadata).map(
          ([key, value]) => ({
            key,
            stringValue: value,
          })
        );
      }

      let uploadOp = await ai.fileSearchStores.uploadToFileSearchStore(uploadConfig);

      // Poll until the document is fully processed
      while (!uploadOp.done) {
        await new Promise((resolve) => setTimeout(resolve, 1000)); // wait 1s
        uploadOp = await ai.operations.get({ operation: uploadOp });
      }

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

      return {
        id: doc.id,
        filename: doc.filename,
        fileId: uploadOp.response.documentName,
        status: "ready" as const,
        uploadedAt: doc.uploadedAt,
      };
    } catch (error) {
      // Update status to failed if upload fails
      await db
        .update(documents)
        .set({
          status: "failed",
        })
        .where(eq(documents.id, doc.id));

      throw error;
    }
  } catch (error) {
    logger.error("Error uploading document", { error, storeUuid, userId, filename: file.name });
    throw error;
  }
}

/**
 * List documents in a store
 */
export async function listDocuments(storeUuid: string, userId?: string) {
  try {
    const conditions = userId
      ? and(eq(documents.storeId, storeUuid), eq(documents.userId, userId))
      : eq(documents.storeId, storeUuid);

    const docs = await db.select().from(documents).where(conditions);

    return docs.map((doc) => ({
      id: doc.id,
      storeId: doc.storeId,
      userId: doc.userId,
      filename: doc.filename,
      fileId: doc.fileId,
      mimeType: doc.mimeType,
      sizeBytes: doc.sizeBytes,
      status: doc.status,
      uploadedAt: doc.uploadedAt,
    }));
  } catch (error) {
    logger.error("Error listing documents", { error, storeUuid, userId });
    throw error;
  }
}

/**
 * Delete a document from File Search store
 */
export async function deleteDocument(documentId: string, userId: string) {
  try {
    // Get document from database
    const [doc] = await db
      .select()
      .from(documents)
      .where(eq(documents.id, documentId))
      .limit(1);

    if (!doc) {
      throw new Error("Document not found");
    }

    // Verify ownership
    if (doc.userId !== userId) {
      throw new Error("Unauthorized: You don't own this document");
    }

    // Delete from Gemini (if fileId exists)
    if (doc.fileId) {
      try {
        // Get store
        const [store] = await db
          .select()
          .from(fileSearchStores)
          .where(eq(fileSearchStores.id, doc.storeId))
          .limit(1);

        if (store) {
          // Note: The actual deletion from Gemini may vary based on API
          // For now we're just deleting from our database
          // Gemini files in stores are managed separately
        }
      } catch (error) {
        logger.error("Error deleting file from Gemini", { error, documentId, fileId: doc.fileId });
        // Continue with database deletion even if Gemini deletion fails
      }
    }

    // Delete from database
    await db.delete(documents).where(eq(documents.id, documentId));

    return { success: true };
  } catch (error) {
    logger.error("Error deleting document", { error, documentId, userId });
    throw error;
  }
}
