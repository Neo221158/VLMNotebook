"use client";

import { useChat } from "@ai-sdk/react";
import { useParams } from "next/navigation";
import { getAgentById } from "@/lib/mock-data/agents";
import { ChatHeader } from "@/components/chat/chat-header";
import { ChatMessage } from "@/components/chat/chat-message";
import { ChatInput } from "@/components/chat/chat-input";
import { TypingIndicator } from "@/components/chat/typing-indicator";
import { StarterPrompts } from "@/components/chat/starter-prompts";
import { DocumentManagerSheet } from "@/components/files/document-manager-sheet";
import { ChatMessageSkeletonList } from "@/components/chat/chat-message-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useEffect, useRef, useState } from "react";
import { useSession } from "@/lib/auth-client";
import { Lock, AlertCircle } from "lucide-react";
import { UserProfile } from "@/components/auth/user-profile";
import { redirect } from "next/navigation";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";

export default function ChatPage() {
  const params = useParams();
  const agentId = params.agentId as string;
  const agent = getAgentById(agentId);
  const { data: session, isPending } = useSession();
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const [input, setInput] = useState("");
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [isLoadingConversation, setIsLoadingConversation] = useState(true);
  const [documentSheetOpen, setDocumentSheetOpen] = useState(false);
  const [documentCount, setDocumentCount] = useState<number>(0);
  const [savedMessageIds, setSavedMessageIds] = useState<Set<string>>(new Set());

  const { messages, sendMessage, status, error, setMessages } = useChat();

  // Fetch document count for this agent
  useEffect(() => {
    if (!session?.user || !agentId) return;

    async function fetchDocumentCount() {
      if (!session?.user) return;

      try {
        const response = await fetch(
          `/api/files?agentId=${agentId}&userId=${session.user.id}`
        );
        if (response.ok) {
          const data = await response.json();
          setDocumentCount(data.documents?.length || 0);
        }
      } catch (error) {
        console.error("Error fetching document count:", error);
      }
    }

    fetchDocumentCount();
  }, [session, agentId]);

  // Load or create conversation on mount
  useEffect(() => {
    if (!session?.user || !agentId) return;

    async function loadOrCreateConversation() {
      try {
        // Fetch existing conversations for this agent
        const response = await fetch(`/api/conversations?agentId=${agentId}`);
        if (!response.ok) throw new Error("Failed to fetch conversations");

        const conversations = await response.json();

        if (conversations.length > 0) {
          // Load most recent conversation
          const latestConversation = conversations[0];
          setConversationId(latestConversation.id);

          // Fetch full conversation with messages
          const detailResponse = await fetch(
            `/api/conversations/${latestConversation.id}`
          );
          if (!detailResponse.ok) throw new Error("Failed to fetch conversation");

          const conversationData = await detailResponse.json();

          // Convert database messages to UI format
          const uiMessages = conversationData.messages.map((msg: {
            id: string;
            role: string;
            content: string;
            parts: unknown;
          }) => ({
            id: msg.id,
            role: msg.role,
            content: msg.content,
            parts: msg.parts || [{ type: "text", text: msg.content }],
          }));

          setMessages(uiMessages);

          // Mark all loaded messages as already saved
          setSavedMessageIds(new Set(uiMessages.map((msg: { id: string }) => msg.id)));
        } else {
          // Create new conversation
          const createResponse = await fetch("/api/conversations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ agentId }),
          });

          if (!createResponse.ok) throw new Error("Failed to create conversation");

          const newConversation = await createResponse.json();
          setConversationId(newConversation.id);
        }
      } catch (error) {
        console.error("Error loading conversation:", error);
      } finally {
        setIsLoadingConversation(false);
      }
    }

    loadOrCreateConversation();
  }, [session, agentId, setMessages]);

  // Save messages to database after they're sent (only when not streaming)
  useEffect(() => {
    if (!conversationId || messages.length === 0) return;

    // Don't save during streaming to avoid duplicate saves
    if (status === "streaming") return;

    async function saveMessage() {
      const lastMessage = messages[messages.length - 1];

      // Skip if this message was already saved
      if (savedMessageIds.has(lastMessage.id)) return;

      // Extract content from message parts
      const content = lastMessage.parts
        ?.map((p: { type: string; text?: string }) =>
          p.type === "text" ? p.text : ""
        )
        .join("") || "";

      try {
        await fetch(`/api/conversations/${conversationId}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            role: lastMessage.role,
            content,
            parts: lastMessage.parts,
          }),
        });

        // Mark message as saved
        setSavedMessageIds(prev => new Set(prev).add(lastMessage.id));
      } catch (error) {
        console.error("Error saving message:", error);
        // Don't block the UI if saving fails
      }
    }

    saveMessage();
  }, [messages, conversationId, status, savedMessageIds]);

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
  if (isPending || isLoadingConversation) {
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
    <>
      <div className="flex flex-col h-[calc(100vh-64px)]">
        {/* Header */}
        <ChatHeader
          agent={agent}
          documentCount={documentCount}
          onOpenDocuments={() => setDocumentSheetOpen(true)}
        />

        {/* Messages Area */}
        <ScrollArea ref={scrollAreaRef} className="flex-1">
          {error && (
            <div className="p-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription className="flex items-center justify-between">
                  <span>Failed to send message: {error.message}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Retry sending the last message
                      const lastUserMessage = [...messages]
                        .reverse()
                        .find((m) => m.role === "user");
                      if (lastUserMessage) {
                        const text = lastUserMessage.parts
                          ?.map((p: { type: string; text?: string }) =>
                            p.type === "text" ? p.text : ""
                          )
                          .join("") || "";
                        if (text) {
                          sendMessage({ text });
                        }
                      }
                    }}
                    className="ml-4"
                  >
                    Retry
                  </Button>
                </AlertDescription>
              </Alert>
            </div>
          )}
          {isLoadingConversation ? (
            <ChatMessageSkeletonList count={3} />
          ) : messages.length === 0 ? (
            <StarterPrompts agent={agent} onSelectPrompt={handleSelectPrompt} />
          ) : (
            <div>
              {messages.map((message) => (
                <ChatMessage key={message.id} message={message} />
              ))}
              {status === "streaming" && <TypingIndicator />}
            </div>
          )}
        </ScrollArea>

        {/* Input Area */}
        <ChatInput
          input={input}
          handleInputChange={(e) => setInput(e.target.value)}
          handleSubmit={(e) => {
            e.preventDefault();
            const text = input.trim();
            if (!text) return;
            // TODO: Pass agentId to API once we integrate File Search properly
            sendMessage({ text });
            setInput("");
          }}
          isLoading={status === "streaming"}
        />
      </div>

      {/* Document Manager Sheet */}
      {session && (
        <DocumentManagerSheet
          open={documentSheetOpen}
          onOpenChange={setDocumentSheetOpen}
          agentId={agentId}
          agentName={agent.name}
          userId={session.user.id}
        />
      )}
    </>
  );
}
