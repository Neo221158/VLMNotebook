import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { uploadDocument, getStoreByAgentId } from "@/lib/gemini-file-search";
import {
  rateLimit,
  RateLimitPresets,
  createRateLimitResponse,
  createRateLimitHeaders,
} from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

// Mark this route as dynamic (don't evaluate during build)
export const dynamic = "force-dynamic";

// Maximum file size: 100MB (Gemini API limit)
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB in bytes

// Supported file types
const SUPPORTED_MIME_TYPES = [
  // Documents
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
  "application/msword", // .doc
  "text/plain",
  "text/markdown",
  "text/csv",

  // Data files
  "application/json",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", // .xlsx
  "application/vnd.ms-excel", // .xls

  // Code files
  "text/javascript",
  "application/javascript",
  "text/typescript",
  "application/typescript",
  "text/x-python",
  "application/x-python",
  "text/html",
  "text/css",
  "application/xml",
  "text/xml",
];

// File extensions for code files (when MIME type is not specific enough)
const SUPPORTED_CODE_EXTENSIONS = [
  ".js", ".jsx", ".ts", ".tsx", ".py", ".java", ".cpp", ".c", ".h",
  ".cs", ".go", ".rs", ".rb", ".php", ".swift", ".kt", ".scala",
  ".sh", ".bash", ".yml", ".yaml", ".json", ".xml", ".sql"
];

/**
 * Validate file type based on MIME type and extension
 */
function isFileTypeSupported(file: File): boolean {
  // Check MIME type
  if (SUPPORTED_MIME_TYPES.includes(file.type)) {
    return true;
  }

  // For text/plain or unknown types, check file extension
  const extension = "." + file.name.split(".").pop()?.toLowerCase();
  if (SUPPORTED_CODE_EXTENSIONS.includes(extension)) {
    return true;
  }

  return false;
}

/**
 * POST /api/files/upload
 * Upload a file to Gemini File Search
 */
export async function POST(request: NextRequest) {
  try {
    // 1. Authenticate user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized. Please sign in to upload files." },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // 2. Rate limiting: 10 uploads per 10 minutes
    const rateLimitResult = rateLimit(
      `file-upload:${userId}`,
      RateLimitPresets.fileUpload
    );

    if (!rateLimitResult.allowed) {
      return createRateLimitResponse(
        RateLimitPresets.fileUpload,
        rateLimitResult
      );
    }

    // 3. Parse multipart form data
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const agentId = formData.get("agentId") as string | null;

    // 4. Validate required fields
    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (!agentId) {
      return NextResponse.json(
        { error: "Agent ID is required" },
        { status: 400 }
      );
    }

    // 4. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum limit of 100MB. Your file is ${(file.size / (1024 * 1024)).toFixed(2)}MB.`
        },
        { status: 400 }
      );
    }

    // 5. Validate file type
    if (!isFileTypeSupported(file)) {
      return NextResponse.json(
        {
          error: `File type '${file.type}' is not supported. Please upload PDF, DOCX, TXT, JSON, CSV, code files, or other supported formats.`
        },
        { status: 400 }
      );
    }

    // 6. Get or create File Search store for agent
    let store;
    try {
      store = await getStoreByAgentId(agentId);
    } catch (error) {
      logger.error("Failed to get File Search store:", error);
      return NextResponse.json(
        { error: "Failed to access agent's document storage. Please try again later." },
        { status: 500 }
      );
    }

    // 7. Upload to Gemini File Search
    let document;
    try {
      // Extract metadata from form data (optional)
      const metadata: Record<string, string> = {};
      const metadataStr = formData.get("metadata") as string | null;
      if (metadataStr) {
        try {
          Object.assign(metadata, JSON.parse(metadataStr));
        } catch {
          // Ignore invalid metadata JSON
        }
      }

      document = await uploadDocument(store.id, userId, file, metadata);
    } catch (error) {
      logger.error("Failed to upload document:", error);
      return NextResponse.json(
        {
          error: error instanceof Error ? error.message : "Failed to upload file. Please try again."
        },
        { status: 500 }
      );
    }

    // 8. Return success response with rate limit headers
    return NextResponse.json(
      {
        success: true,
        document: {
          id: document.id,
          filename: document.filename,
          mimeType: file.type,
          sizeBytes: file.size,
          status: document.status,
          uploadedAt: document.uploadedAt,
        },
      },
      {
        status: 201,
        headers: createRateLimitHeaders(
          RateLimitPresets.fileUpload,
          rateLimitResult
        ),
      }
    );
  } catch (error) {
    logger.error("Upload error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
