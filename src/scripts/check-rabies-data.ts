import { db } from "../lib/db";
import { rabiesAuthorities } from "../lib/schema";

async function checkData() {
  try {
    console.log("🔍 Checking rabies authorities data...\n");

    const records = await db.select().from(rabiesAuthorities);

    console.log(`📊 Total records: ${records.length}`);

    if (records.length > 0) {
      console.log("\n✅ Sample record:");
      console.log(JSON.stringify(records[0], null, 2));

      console.log("\n📍 First 5 cities:");
      records.slice(0, 5).forEach((r, i) => {
        console.log(`${i + 1}. ${r.city} - ${r.veterinarianName}`);
      });
    } else {
      console.log("\n❌ NO RECORDS FOUND IN DATABASE");
      console.log("You need to run: pnpm tsx src/scripts/import-rabies-data.ts");
    }
  } catch (error) {
    console.error("❌ Error:", error);
  }
  process.exit(0);
}

checkData();
