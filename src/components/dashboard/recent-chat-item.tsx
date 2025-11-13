import { ChatConversation } from "@/lib/types";
import { getAgentById } from "@/lib/mock-data/agents";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

interface RecentChatItemProps {
  chat: ChatConversation;
}

export function RecentChatItem({ chat }: RecentChatItemProps) {
  const agent = getAgentById(chat.agentId);

  if (!agent) return null;

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1 min-w-0">
            {/* Agent Icon */}
            <div className="text-2xl flex-shrink-0">{agent.icon}</div>

            {/* Chat Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-sm mb-1">{agent.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                {chat.preview}
              </p>
              <span className="text-xs text-muted-foreground">
                {chat.lastMessageAt || chat.timestamp
                  ? formatDistanceToNow(chat.lastMessageAt || chat.timestamp || new Date(), { addSuffix: true })
                  : "Recently"}
              </span>
            </div>
          </div>

          {/* Action Button */}
          <Button size="sm" variant="ghost" asChild className="flex-shrink-0">
            <Link href={`/chat/${agent.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
