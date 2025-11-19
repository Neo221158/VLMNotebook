/**
 * Import Rabies Authority Data from Hebrew CSV
 *
 * This script imports 169 rabies authority records from the CSV file
 * and inserts them into the Neon PostgreSQL database.
 *
 * Usage: npx tsx src/scripts/import-rabies-data.ts
 */

import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import * as fs from "fs";
import * as path from "path";

// Software URL mapping
const SOFTWARE_URL_MAP: Record<string, string | null> = {
  "דוקטורט": "https://www.shvav.org/user/login",
  "וטקליק": "https://vetclick.co.il/Login.aspx?ReturnUrl=%2f",
  "סורין": null,
  "פריזה": null,
};

async function importRabiesData() {
  console.log("🚀 Rabies Authority Data Import Starting...\n");

  // Read the CSV file
  const csvFilePath = path.join(process.cwd(), "docs/implementation/Rabies list final.csv");

  if (!fs.existsSync(csvFilePath)) {
    console.error("❌ Error: CSV file not found at", csvFilePath);
    process.exit(1);
  }

  console.log("📁 Reading file:", csvFilePath);
  const fileContent = fs.readFileSync(csvFilePath, "utf-8");

  // Extract all the list entries manually
  const lines = fileContent.split("\n");
  const dataLines = lines.filter(line => line.trim().startsWith("[") && line.includes(","));

  const rawData: string[][] = [];

  for (const line of dataLines) {
    // Extract content between brackets
    const match = line.match(/\[(.*)\]/);
    if (match) {
      // Split by comma but preserve quoted strings
      const parts = match[1].split('", "').map(p =>
        p.replace(/^"/, "").replace(/"$/, "").trim()
      );
      rawData.push(parts);
    }
  }

  console.log(`📊 Found ${rawData.length} rows (including header)\n`);

  // Skip header row and map data
  const records = rawData.slice(1)
    .map((row: string[]) => {
      const [city, veterinarianName, reportingSoftware, contactEmail] = row;

      // Determine software URL based on software name
      const softwareUrl = SOFTWARE_URL_MAP[reportingSoftware] || null;

      const email = contactEmail?.trim();

      return {
        city: city.trim(),
        region: null,
        veterinarianName: veterinarianName.trim(),
        reportingSoftware: reportingSoftware.trim(),
        softwareUrl,
        contactEmail: email && email.length > 0 ? email : `no-email-${city.trim().replace(/\s+/g, '-')}@placeholder.local`,
        phoneNumber: null,
        notes: email && email.length > 0 ? null : "Original data had no email address",
      };
    });

  console.log(`✅ Parsed ${records.length} valid records\n`);

  // Show sample record
  console.log("📋 Sample Record:");
  console.log(JSON.stringify(records[0], null, 2));
  console.log("");

  // Count software types
  const softwareCount: Record<string, number> = {};
  records.forEach((r: { reportingSoftware: string }) => {
    softwareCount[r.reportingSoftware] = (softwareCount[r.reportingSoftware] || 0) + 1;
  });

  console.log("📊 Software Distribution:");
  Object.entries(softwareCount).forEach(([software, count]) => {
    const url = SOFTWARE_URL_MAP[software];
    console.log(`   ${software}: ${count} authorities ${url ? `(${url})` : "(no URL)"}`);
  });
  console.log("");

  // Clear existing data first
  console.log("🗑️  Clearing existing data...");
  await db.delete(rabiesAuthorities);
  console.log("✅ Existing data cleared\n");

  // Insert all records
  console.log("💾 Inserting records into database...");
  const inserted = await db.insert(rabiesAuthorities).values(records).returning();

  console.log(`✅ Successfully inserted ${inserted.length} records!\n`);

  // Summary
  console.log("=" .repeat(60));
  console.log("✨ Import Complete!");
  console.log("=" .repeat(60));
  console.log(`Total Records: ${inserted.length}`);
  console.log(`Database: Neon PostgreSQL`);
  console.log(`Table: rabies_authorities`);
  console.log("");
  console.log("Next Steps:");
  console.log("1. View data: pnpm db:studio");
  console.log("2. Test search: Query a city in the chat interface");
  console.log("3. Continue with Phase 4: Implement the chat search tool");
  console.log("");
}

// Run the import
importRabiesData()
  .then(() => {
    console.log("✅ Import script completed successfully");
    process.exit(0);
  })
  .catch((error) => {
    console.error("❌ Import failed:", error);
    process.exit(1);
  });
