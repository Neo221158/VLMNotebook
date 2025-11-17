"use client";

import { useState } from "react";
import { Agent } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft, MoreVertical, FileText } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DocumentManagerSheet } from "@/components/files/document-manager-sheet";

interface ChatHeaderProps {
  agent: Agent;
  userId: string;
  isAdmin: boolean;
}

export function ChatHeader({ agent, userId, isAdmin }: ChatHeaderProps) {
  const [documentsSheetOpen, setDocumentsSheetOpen] = useState(false);

  // Debug logging
  console.log("[ChatHeader] isAdmin prop:", isAdmin);
  console.log("[ChatHeader] Should show upload button:", isAdmin);

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
            {/* Document manager - admin only */}
            {isAdmin && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setDocumentsSheetOpen(true)}
                aria-label="Manage documents"
              >
                <FileText className="h-5 w-5" />
                <span className="sr-only">Manage documents</span>
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
      {/* Document manager sheet - only rendered for admin */}
      {isAdmin && (
        <DocumentManagerSheet
          open={documentsSheetOpen}
          onOpenChange={setDocumentsSheetOpen}
          agentId={agent.id}
          agentName={agent.name}
          userId={userId}
        />
      )}
    </header>
  );
}
