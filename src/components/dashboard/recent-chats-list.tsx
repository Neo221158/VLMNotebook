import { RecentChatItem } from "./recent-chat-item";
import { getRecentChats } from "@/lib/mock-data/chats";
import { MessageSquare } from "lucide-react";

interface RecentChatsListProps {
  limit?: number;
}

export function RecentChatsList({ limit = 5 }: RecentChatsListProps) {
  const recentChats = getRecentChats(limit);

  if (recentChats.length === 0) {
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
      {recentChats.map((chat) => (
        <RecentChatItem key={chat.id} chat={chat} />
      ))}
    </div>
  );
}
