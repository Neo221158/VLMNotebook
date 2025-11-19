import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { ilike, or } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET - Search rabies authorities by city or region
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";

    // If no query, return all authorities
    if (!query.trim()) {
      const allAuthorities = await db
        .select()
        .from(rabiesAuthorities)
        .orderBy(rabiesAuthorities.city);

      return Response.json({ authorities: allAuthorities });
    }

    // Search with case-insensitive matching on city and region
    const results = await db
      .select()
      .from(rabiesAuthorities)
      .where(
        or(
          ilike(rabiesAuthorities.city, `%${query}%`),
          ilike(rabiesAuthorities.region, `%${query}%`)
        )
      )
      .orderBy(rabiesAuthorities.city);

    return Response.json({ authorities: results });
  } catch (error) {
    console.error("Error searching rabies authorities:", error);
    return Response.json(
      { error: "Failed to search authorities" },
      { status: 500 }
    );
  }
}
