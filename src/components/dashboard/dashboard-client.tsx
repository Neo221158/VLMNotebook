"use client"

import { RecentChatsList } from "@/components/dashboard/recent-chats-list"
import { AgentCardCompact } from "@/components/agents/agent-card-compact"
import { agents } from "@/lib/mock-data/agents"

interface DashboardClientProps {
  session: {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}

export function DashboardClient({ session }: DashboardClientProps) {
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
  )
}
