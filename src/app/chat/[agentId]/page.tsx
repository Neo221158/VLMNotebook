import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAgentById } from "@/lib/mock-data/agents";
import { ChatInterface } from "@/components/chat/chat-interface";
import { isAdmin } from "@/lib/auth-helpers";
import type { User } from "@/lib/types";

interface ChatPageProps {
  params: Promise<{ agentId: string }>;
}

export default async function ChatPage({ params }: ChatPageProps) {
  // Server-side auth check
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Redirect to home if not authenticated
  if (!session?.user) {
    redirect("/");
  }

  // Get agent from params
  const { agentId } = await params;
  const agent = getAgentById(agentId);

  // Agent not found - redirect to dashboard
  if (!agent) {
    redirect("/dashboard");
  }

  // Debug logging
  const adminStatus = isAdmin(session.user);
  console.log("[Chat Page] User:", session.user.email);
  console.log("[Chat Page] User role:", (session.user as User).role);
  console.log("[Chat Page] isAdmin result:", adminStatus);

  return <ChatInterface agentId={agentId} userId={session.user.id} agent={agent} isAdmin={adminStatus} />;
}
