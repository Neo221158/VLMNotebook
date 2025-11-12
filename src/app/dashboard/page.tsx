"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { RecentChatsList } from "@/components/dashboard/recent-chats-list";
import { AgentCardCompact } from "@/components/agents/agent-card-compact";
import { agents } from "@/lib/mock-data/agents";
import { Lock } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Sign in Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to access your dashboard and chat with agents
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Welcome back, {session.user.name?.split(" ")[0] || "there"}!
          </h1>
          <p className="text-muted-foreground">
            Continue your conversations or start chatting with a new agent
          </p>
        </div>

        {/* Recent Chats Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold mb-4">Recent Conversations</h2>
          <RecentChatsList limit={5} />
        </div>

        {/* All Agents Section */}
        <div>
          <h2 className="text-2xl font-semibold mb-4">All Agents</h2>
          <div className="space-y-3">
            {agents.map((agent) => (
              <AgentCardCompact key={agent.id} agent={agent} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
