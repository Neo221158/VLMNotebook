"use client";

import { useChat } from "ai/react";
import { useParams } from "next/navigation";
import { getAgentById } from "@/lib/mock-data/agents";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { StarterPrompts } from "@/components/chat/starter-prompts";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef } from "react";
import { useSession } from "@/lib/auth-client";
import { Lock } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { redirect } from "next/navigation";

export default function ChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId);
  const { data: session, isPending } = useSession();
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput } =
    useChat({
      api: "/api/chat",
    });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector(
        "[data-radix-scroll-area-viewport]"
      ) as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [messages]);

  // Handle starter prompt selection
  const handleSelectPrompt = (prompt: string) => {
    setInput(prompt);
    // Focus on textarea (optional)
    setTimeout(() => {
      const textarea = document.querySelector("textarea");
      if (textarea) {
        textarea.focus();
      }
    }, 100);
  };

  // Loading state
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

  // Auth check
  if (!session) {
    return (
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="mb-8">
            <Lock className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
            <h1 className="text-2xl font-bold mb-2">Sign in Required</h1>
            <p className="text-muted-foreground mb-6">
              You need to sign in to chat with agents
            </p>
          </div>
          <UserProfile />
        </div>
      </div>
    );
  }

  // Agent not found
  if (!agent) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <ChatHeader agent={agent} />

      {/* Messages Area */}
      <ScrollArea ref={scrollAreaRef} className="flex-1">
        {messages.length === 0 ? (
          <StarterPrompts agent={agent} onSelectPrompt={handleSelectPrompt} />
        ) : (
          <div>
            {messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            {isLoading && <TypingIndicator />}
          </div>
        )}
      </ScrollArea>

      {/* Input Area */}
      <ChatInput
        input={input}
        handleInputChange={handleInputChange}
        handleSubmit={handleSubmit}
        isLoading={isLoading}
      />
    </div>
  );
}
