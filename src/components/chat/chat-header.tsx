import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, FileText } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  agent: Agent;
  documentCount?: number;
  onOpenDocuments?: () => void;
}

export function ChatHeader({ agent, documentCount, onOpenDocuments }: ChatHeaderProps) {
  return (
    <header className="sticky top-16 z-40 border-b bg-background">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" asChild aria-label="Back to dashboard">
              <Link href="/dashboard">
                <ArrowLeft className="h-5 w-5" />
                <span className="sr-only">Back to dashboard</span>
              </Link>
            </Button>
            <div className="text-2xl" role="img" aria-label={`${agent.name} icon`}>
              {agent.icon}
            </div>
            <div>
              <h1 className="font-semibold">{agent.name}</h1>
              <p className="text-xs text-muted-foreground">{agent.category}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Document Manager Button */}
            {onOpenDocuments && (
              <Button
                variant="outline"
                size="sm"
                onClick={onOpenDocuments}
                className="gap-2"
              >
                <FileText className="h-4 w-4" />
                <span className="hidden sm:inline">Documents</span>
                {documentCount !== undefined && documentCount > 0 && (
                  <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
                    {documentCount}
                  </Badge>
                )}
              </Button>
            )}

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Chat options">
                  <MoreVertical className="h-5 w-5" />
                  <span className="sr-only">Chat options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem disabled>Clear Chat</DropdownMenuItem>
                <DropdownMenuItem disabled>Export Chat</DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/dashboard">Back to Dashboard</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
