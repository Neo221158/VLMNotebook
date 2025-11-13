"use client";

import { useSession } from "@/lib/auth-client";
import { UserProfile } from "@/components/auth/user-profile";
import { RecentChatsList } from "@/components/dashboard/recent-chats-list";
import { AgentCardCompact } from "@/components/agents/agent-card-compact";
import { RecentChatSkeleton } from "@/components/dashboard/recent-chat-skeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { agents } from "@/lib/mock-data/agents";
import { Lock } from "lucide-react";

export default function DashboardPage() {
  const { data: session, isPending } = useSession();

  if (isPending) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Welcome Header Skeleton */}
          <div className="mb-8">
            <Skeleton className="h-9 w-64 mb-2" />
            <Skeleton className="h-5 w-96" />
          </div>

          {/* Recent Chats Skeleton */}
          <div className="mb-12">
            <Skeleton className="h-8 w-48 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <RecentChatSkeleton key={i} />
              ))}
            </div>
          </div>

          {/* All Agents Skeleton */}
          <div>
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <Skeleton className="h-12 w-12 rounded-md shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-full" />
                      <div className="flex gap-2">
                        <Skeleton className="h-5 w-16" />
                        <Skeleton className="h-5 w-20" />
                        <Skeleton className="h-5 w-18" />
                      </div>
                    </div>
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              ))}
            </div>
          </div>
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
