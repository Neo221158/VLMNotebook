import { auth } from "@/lib/auth";

async function debugSession() {
  console.log("Fetching session for debugging...\n");

  try {
    // This simulates what happens in the chat page
    const session = await auth.api.getSession({
      headers: new Headers(),
    });

    if (!session) {
      console.log("❌ No session found");
      process.exit(1);
    }

    console.log("✅ Session found:");
    console.log(JSON.stringify(session, null, 2));

    console.log("\n📝 User object:");
    console.log(JSON.stringify(session.user, null, 2));

    const role = (session.user as { role?: string }).role;
    console.log(`\n🔐 Role: ${role}`);
    console.log(`Is Admin: ${role === "admin"}`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

debugSession();
