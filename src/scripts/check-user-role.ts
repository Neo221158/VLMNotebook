import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

async function checkUserRole() {
  const adminEmail = process.env.ADMIN_EMAIL || "nir.dvm@gmail.com";

  console.log(`Checking user role for: ${adminEmail}`);

  try {
    const result = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (result.length === 0) {
      console.error(`❌ User not found with email: ${adminEmail}`);
      process.exit(1);
    }

    console.log("\n✅ User found in database:");
    console.log(JSON.stringify(result[0], null, 2));
    console.log(`\nCurrent role: ${result[0].role}`);

    if (result[0].role === "admin") {
      console.log("✅ User has admin role!");
    } else {
      console.log("❌ User does NOT have admin role. Run 'pnpm seed:admin' to fix.");
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Error checking user role:", error);
    process.exit(1);
  }
}

checkUserRole();
