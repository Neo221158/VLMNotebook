import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

async function setAdminRole() {
  const adminEmail = process.env.ADMIN_EMAIL || "nir.dvm@gmail.com";

  console.log(`Setting admin role for: ${adminEmail}`);

  try {
    const result = await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, adminEmail))
      .returning();

    if (result.length === 0) {
      console.error(`❌ User not found with email: ${adminEmail}`);
      process.exit(1);
    }

    console.log("✅ Successfully updated user role to admin:");
    console.log(JSON.stringify(result[0], null, 2));
    process.exit(0);
  } catch (error) {
    console.error("❌ Error updating user role:", error);
    process.exit(1);
  }
}

setAdminRole();
