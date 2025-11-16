import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getAgentById } from "@/lib/mock-data/agents";
import { ChatInterface } from "@/components/chat/chat-interface";

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

  return <ChatInterface agentId={agentId} userId={session.user.id} agent={agent} />;
}
