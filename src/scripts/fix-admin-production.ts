/**
 * Fix Admin Role in Production Database
 *
 * This script:
 * 1. Checks if the role column exists in the user table
 * 2. Checks current user role
 * 3. Sets admin role for the configured admin email
 *
 * Run with: npx tsx src/scripts/fix-admin-production.ts
 */

import { db } from "@/lib/db";
import { user } from "@/lib/schema";
import { eq, sql } from "drizzle-orm";

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "nir.dvm@gmail.com";

async function fixAdminRole() {
  console.log("🔍 Admin Role Fix Script Starting...");
  console.log(`📧 Admin email: ${ADMIN_EMAIL}\n`);

  try {
    // Step 1: Check if role column exists by trying to select from user table
    console.log("Step 1: Checking if 'role' column exists...");
    try {
      await db.execute(sql`SELECT role FROM "user" LIMIT 1`);
      console.log("✅ Role column exists\n");
    } catch (error: unknown) {
      if (error instanceof Error && error.message?.includes("column") && error.message?.includes("role")) {
        console.log("❌ ERROR: 'role' column does not exist in user table!");
        console.log("\n💡 Solution: Run database migration:");
        console.log("   POSTGRES_URL='your-production-url' pnpm db:migrate");
        console.log("\n   Or add the column manually via SQL:");
        console.log("   ALTER TABLE \"user\" ADD COLUMN \"role\" text DEFAULT 'user' NOT NULL;");
        process.exit(1);
      }
      // If it's a different error, continue (table might be empty)
      console.log("✅ Role column appears to exist (table may be empty)\n");
    }

    // Step 2: Find user by email
    console.log("Step 2: Looking up user by email...");
    const [targetUser] = await db
      .select()
      .from(user)
      .where(eq(user.email, ADMIN_EMAIL))
      .limit(1);

    if (!targetUser) {
      console.log(`❌ ERROR: No user found with email: ${ADMIN_EMAIL}`);
      console.log("\n💡 Solution: Sign in to the app first with this email address:");
      console.log(`   https://vlm-notebook.vercel.app/`);
      process.exit(1);
    }

    console.log(`✅ Found user: ${targetUser.email}`);
    console.log(`   User ID: ${targetUser.id}`);
    console.log(`   Current role: ${targetUser.role || "null"}\n`);

    // Step 3: Check if already admin
    if (targetUser.role === "admin") {
      console.log("✅ User is already an admin! No changes needed.");
      console.log("\n🤔 If you still can't see admin features, check:");
      console.log("   1. Clear browser cache and cookies");
      console.log("   2. Sign out and sign in again");
      console.log("   3. Check Vercel environment variables:");
      console.log(`      ADMIN_EMAIL should be: ${ADMIN_EMAIL}`);
      return;
    }

    // Step 4: Set admin role
    console.log("Step 3: Setting admin role...");
    await db
      .update(user)
      .set({ role: "admin" })
      .where(eq(user.id, targetUser.id));

    console.log("✅ Successfully set admin role!\n");

    // Step 5: Verify
    console.log("Step 4: Verifying changes...");
    const [updatedUser] = await db
      .select()
      .from(user)
      .where(eq(user.id, targetUser.id))
      .limit(1);

    console.log(`✅ Verified! User role is now: ${updatedUser.role}`);
    console.log("\n🎉 Success! Next steps:");
    console.log("   1. Sign out of https://vlm-notebook.vercel.app/");
    console.log("   2. Sign in again");
    console.log("   3. You should now see:");
    console.log("      - 'Documents' link in the header");
    console.log("      - Upload button in chat interface");
    console.log("      - 'Admin' badge in your profile");

  } catch (error) {
    console.error("\n❌ Error:", error);
    console.log("\n💡 If you see a connection error, make sure:");
    console.log("   1. POSTGRES_URL is set in .env");
    console.log("   2. Database is accessible");
    console.log("   3. You're connected to the internet");
    process.exit(1);
  }
}

fixAdminRole();
