import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { logger } from "@/lib/logger";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

// Schema for a single extracted authority record
const extractedAuthoritySchema = z.object({
  city: z.string().describe("City name as it appears in the document"),
  region: z.string().nullable().describe("Region name if specified"),
  veterinarianName: z.string().describe("Full name of the regional veterinarian"),
  reportingSoftware: z.string().describe("Name of the reporting software used"),
  softwareUrl: z.string().url().nullable().describe("URL for the reporting software if available"),
  contactEmail: z.string().email().describe("Contact email address"),
  phoneNumber: z.string().nullable().describe("Phone number if available"),
  notes: z.string().nullable().describe("Any additional notes or information"),
});

// Schema for the complete extraction result (array of authorities)
const pdfExtractionSchema = z.object({
  authorities: z.array(extractedAuthoritySchema).describe("Array of all rabies authorities found in the document"),
  totalRecords: z.number().describe("Total number of records extracted"),
});

/**
 * POST /api/admin/import-rabies-pdf
 *
 * Admin-only endpoint to extract rabies authority data from an uploaded PDF.
 * Uses AI to parse the document and return structured data for review before import.
 *
 * Authentication: Admin role required
 * Request: multipart/form-data with 'file' field (PDF)
 * Response: JSON array of extracted records
 */
export async function POST(req: Request) {
  try {
    // 1. Authenticate user and verify admin role
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { "Content-Type": "application/json" } }
      );
    }

    const user = session.user as User;
    if (user.role !== "admin") {
      return new Response(
        JSON.stringify({ error: "Admin access required" }),
        { status: 403, headers: { "Content-Type": "application/json" } }
      );
    }

    // 2. Parse multipart form data
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return new Response(
        JSON.stringify({ error: "No file provided" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 3. Validate file type (PDF only)
    if (file.type !== "application/pdf") {
      return new Response(
        JSON.stringify({ error: "Only PDF files are supported" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 4. Validate file size (max 100MB)
    const maxSize = 100 * 1024 * 1024; // 100MB
    if (file.size > maxSize) {
      return new Response(
        JSON.stringify({ error: `File size must be less than 100MB` }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    logger.info("PDF import started", {
      filename: file.name,
      size: file.size,
      userId: user.id,
    });

    // 5. Initialize Google Gemini
    if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
      logger.error("GOOGLE_GENERATIVE_AI_API_KEY is not set");
      return new Response(
        JSON.stringify({ error: "AI service configuration error" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const google = createGoogleGenerativeAI({
      apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
    });

    // 6. Convert file to base64 for AI processing
    const arrayBuffer = await file.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");

    // 7. Use Gemini to extract structured data from PDF
    logger.debug("Starting AI extraction from PDF", { filename: file.name });

    const { object } = await generateObject({
      model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
      schema: pdfExtractionSchema,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: `Extract all rabies reporting authority information from this PDF document.

For each entry, extract:
- City name (required)
- Region name (if specified)
- Regional veterinarian full name (required)
- Reporting software name (required)
- Software URL (if available - look for links or web addresses)
- Contact email address (required)
- Phone number (if available)
- Any additional notes or information (if relevant)

Return all records found in the document. Be thorough and extract every entry.
Ensure email addresses and URLs are valid format.`,
            },
            {
              type: "file" as const,
              data: base64,
              mediaType: "application/pdf",
            },
          ],
        },
      ],
    });

    logger.info("AI extraction completed", {
      filename: file.name,
      recordsExtracted: object.totalRecords,
      userId: user.id,
    });

    // 8. Validate extraction results
    if (object.totalRecords === 0) {
      return new Response(
        JSON.stringify({
          error: "No records found in PDF. Please verify the document format.",
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // 9. Return extracted data for preview
    return new Response(
      JSON.stringify({
        success: true,
        data: object.authorities,
        totalRecords: object.totalRecords,
        message: `Successfully extracted ${object.totalRecords} records. Please review and confirm before importing.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error("PDF import extraction error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return new Response(
      JSON.stringify({
        error: "Failed to extract data from PDF. Please try again.",
        details:
          process.env.NODE_ENV === "development"
            ? error instanceof Error
              ? error.message
              : String(error)
            : undefined,
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
