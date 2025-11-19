import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET - Get single authority
export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resolvedParams = await params;
    const [authority] = await db
      .select()
      .from(rabiesAuthorities)
      .where(eq(rabiesAuthorities.id, resolvedParams.id));

    if (!authority) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ authority }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching rabies authority:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PATCH - Update authority
const updateSchema = z.object({
  city: z.string().min(1).optional(),
  region: z.string().nullable().optional(),
  veterinarianName: z.string().min(1).optional(),
  reportingSoftware: z.string().min(1).optional(),
  softwareUrl: z.string().url().nullable().optional(),
  contactEmail: z.string().email().optional(),
  phoneNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const resolvedParams = await params;
    const [updated] = await db
      .update(rabiesAuthorities)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(rabiesAuthorities.id, resolvedParams.id))
      .returning();

    if (!updated) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ authority: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid data", details: error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.error("Error updating rabies authority:", error);
    return new Response(
      JSON.stringify({ error: "Failed to update authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE - Delete authority
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const resolvedParams = await params;
    const [deleted] = await db
      .delete(rabiesAuthorities)
      .where(eq(rabiesAuthorities.id, resolvedParams.id))
      .returning();

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error deleting rabies authority:", error);
    return new Response(
      JSON.stringify({ error: "Failed to delete authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
