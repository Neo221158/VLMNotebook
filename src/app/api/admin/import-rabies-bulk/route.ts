import { z } from "zod";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { logger } from "@/lib/logger";

// Mark this route as dynamic
export const dynamic = "force-dynamic";

// Schema for validating import records
const importRecordSchema = z.object({
  city: z.string().min(1, "City is required"),
  region: z.string().nullable(),
  veterinarianName: z.string().min(1, "Veterinarian name is required"),
  reportingSoftware: z.string().min(1, "Reporting software is required"),
  softwareUrl: z.string().url().nullable(),
  contactEmail: z.string().email("Invalid email format"),
  phoneNumber: z.string().nullable(),
  notes: z.string().nullable(),
});

const bulkImportSchema = z.object({
  records: z.array(importRecordSchema).min(1, "At least one record required"),
  replaceExisting: z.boolean().optional().default(false),
});

/**
 * POST /api/admin/import-rabies-bulk
 *
 * Admin-only endpoint to bulk import rabies authority records to the database.
 * Validates all records before importing. Optionally replaces existing data.
 *
 * Authentication: Admin role required
 * Request: JSON with array of records
 * Response: Import summary with success/error counts
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

    // 2. Parse and validate request body
    const body = await req.json();
    const parseResult = bulkImportSchema.safeParse(body);

    if (!parseResult.success) {
      logger.warn("Invalid bulk import request", {
        error: parseResult.error.flatten(),
        userId: user.id,
      });
      return new Response(
        JSON.stringify({
          error: "Invalid request data",
          details: parseResult.error.flatten().fieldErrors,
        }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    const { records, replaceExisting } = parseResult.data;

    logger.info("Bulk import started", {
      recordCount: records.length,
      replaceExisting,
      userId: user.id,
    });

    // 3. If replaceExisting, delete all existing records first
    if (replaceExisting) {
      logger.info("Deleting existing records", { userId: user.id });
      await db.delete(rabiesAuthorities);
    }

    // 4. Batch insert records (Drizzle ORM handles this efficiently)
    const insertedRecords = await db
      .insert(rabiesAuthorities)
      .values(
        records.map((record) => ({
          city: record.city,
          region: record.region,
          veterinarianName: record.veterinarianName,
          reportingSoftware: record.reportingSoftware,
          softwareUrl: record.softwareUrl,
          contactEmail: record.contactEmail,
          phoneNumber: record.phoneNumber,
          notes: record.notes,
        }))
      )
      .returning();

    logger.info("Bulk import completed", {
      recordsInserted: insertedRecords.length,
      userId: user.id,
    });

    // 5. Return success summary
    return new Response(
      JSON.stringify({
        success: true,
        imported: insertedRecords.length,
        message: `Successfully imported ${insertedRecords.length} records${replaceExisting ? " (replaced existing data)" : ""}.`,
      }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    logger.error("Bulk import error", {
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    // Check for duplicate key errors (city might have unique constraint)
    const errorMessage =
      error instanceof Error && error.message.includes("unique")
        ? "Some records already exist. Consider using 'Replace Existing' option."
        : "Failed to import records. Please try again.";

    return new Response(
      JSON.stringify({
        error: errorMessage,
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
