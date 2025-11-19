import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { z } from "zod";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET - List all authorities
export async function GET() {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authorities = await db
      .select()
      .from(rabiesAuthorities)
      .orderBy(desc(rabiesAuthorities.createdAt));

    return new Response(JSON.stringify({ authorities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching rabies authorities:", error);
    return new Response(
      JSON.stringify({ error: "Failed to fetch authorities" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST - Create new authority
const createSchema = z.object({
  city: z.string().min(1),
  region: z.string().nullable(),
  veterinarianName: z.string().min(1),
  reportingSoftware: z.string().min(1),
  softwareUrl: z.string().url().nullable(),
  contactEmail: z.string().email(),
  phoneNumber: z.string().nullable(),
  notes: z.string().nullable(),
});

export async function POST(req: Request) {
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
    const validatedData = createSchema.parse(body);

    const [created] = await db
      .insert(rabiesAuthorities)
      .values(validatedData)
      .returning();

    return new Response(JSON.stringify({ authority: created }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid data", details: error.issues }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    console.error("Error creating rabies authority:", error);
    return new Response(
      JSON.stringify({ error: "Failed to create authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
