import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq } from "drizzle-orm";

async function seedAdmin() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    console.error("Error: ADMIN_EMAIL environment variable is not set");
    console.log("Please set ADMIN_EMAIL in your .env file to grant admin privileges");
    process.exit(1);
  }

  try {
    // Check if user exists
    const existingUser = await db
      .select()
      .from(user)
      .where(eq(user.email, adminEmail))
      .limit(1);

    if (existingUser.length === 0) {
      console.error(`Error: User with email '${adminEmail}' not found`);
      console.log("Please make sure the user has signed in at least once before granting admin role");
      process.exit(1);
    }

    // Update user role to admin
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.email, adminEmail));

    console.log(`✓ Admin role granted to ${adminEmail}`);
    console.log("The user now has access to admin-only features like document management");
  } catch (error) {
    console.error("Error granting admin role:", error);
    process.exit(1);
  }

  process.exit(0);
}

seedAdmin();
