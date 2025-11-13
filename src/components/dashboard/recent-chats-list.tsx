"use client";

import { useState, useEffect } from "react";
import { RecentChatItem } from "./recent-chat-item";
import { RecentChatSkeleton } from "./recent-chat-skeleton";
import { MessageSquare } from "lucide-react";
import { getAgentById } from "@/lib/mock-data/agents";

interface RecentChatsListProps {
  limit?: number;
}

interface Conversation {
  id: string;
  userId: string;
  agentId: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messageCount: number;
  lastMessage: {
    content: string;
    role: string;
    createdAt: Date;
  } | null;
}

export function RecentChatsList({ limit = 5 }: RecentChatsListProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await fetch("/api/conversations");
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const data = await response.json();
        setConversations(data.slice(0, limit));
      } catch (error) {
        console.error("Error fetching conversations:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchConversations();
  }, [limit]);

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <RecentChatSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
        </div>
        <h3 className="text-lg font-medium mb-2">No conversations yet</h3>
        <p className="text-sm text-muted-foreground">
          Start chatting with an agent to see your conversation history here
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {conversations.map((conversation) => {
        const agent = getAgentById(conversation.agentId);
        if (!agent) return null;

        return (
          <RecentChatItem
            key={conversation.id}
            chat={{
              id: conversation.id,
              agentId: conversation.agentId,
              agentName: agent.name,
              agentIcon: agent.icon,
              preview: conversation.lastMessage?.content || "No messages yet",
              timestamp: new Date(conversation.updatedAt),
            }}
          />
        );
      })}
    </div>
  );
}
