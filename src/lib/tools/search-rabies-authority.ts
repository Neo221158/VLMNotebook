import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { ilike, or } from "drizzle-orm";
import { z } from "zod";

/**
 * Tool for AI to search rabies authority database by city or region
 */
export const searchRabiesAuthorityTool = {
  description: "Search for rabies reporting authority information by city or region name. Use this when the user asks about a specific location in Israel.",

  inputSchema: z.object({
    query: z.string().describe("The city or region name to search for (can be in Hebrew or English)")
  }),

  execute: async ({ query }: { query: string }) => {
    try {
      // Search database with case-insensitive matching on both city and region
      const results = await db
        .select()
        .from(rabiesAuthorities)
        .where(
          or(
            ilike(rabiesAuthorities.city, `%${query}%`),
            ilike(rabiesAuthorities.region, `%${query}%`)
          )
        )
        .limit(5);

      if (results.length === 0) {
        return {
          found: false,
          message: `No rabies authority found for "${query}". The city or region may not be in our database. Please check the spelling or try a nearby city.`
        };
      }

      // Return formatted results
      return {
        found: true,
        count: results.length,
        authorities: results.map(r => ({
          city: r.city,
          region: r.region,
          veterinarianName: r.veterinarianName,
          reportingSoftware: r.reportingSoftware,
          softwareUrl: r.softwareUrl,
          contactEmail: r.contactEmail,
          phoneNumber: r.phoneNumber,
          notes: r.notes
        }))
      };
    } catch (error) {
      console.error("Error searching rabies authorities:", error);
      return {
        found: false,
        error: true,
        message: "Failed to search database. Please try again."
      };
    }
  }
};
