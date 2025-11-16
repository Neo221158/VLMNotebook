import { UIMessage } from "ai";
import { cn } from "@/lib/utils";
import ReactMarkdown from "react-markdown";
import { Bot, User } from "lucide-react";
import { CitationsList } from "./citations-list";
import type { Citation } from "@/lib/types";

interface ChatMessageProps {
  message: UIMessage;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";
  // Extract text from message parts
  const content = message.parts
    ?.map((p) => (p.type === "text" ? p.text : ""))
    .join("") || "";

  // Extract citations from message (multiple possible sources)
  const citations: Citation[] = [];

  // Priority 1: Check if message has citations from database
  const messageCitations = (message as unknown as {citations?: Citation[]}).citations;
  if (messageCitations && Array.isArray(messageCitations)) {
    citations.push(...messageCitations);
  }

  // Priority 2: Check if message has experimental_providerMetadata with citations
  const metadata = (message as unknown as {experimental_providerMetadata?: {citations?: Citation[]}}).experimental_providerMetadata;
  if (metadata?.citations) {
    citations.push(...metadata.citations);
  }

  // Priority 3: Also check toolInvocations for File Search results
  const toolInvocations = (message as {toolInvocations?: Array<{toolName?: string; result?: {citations?: Citation[]}}>}).toolInvocations;
  if (toolInvocations && Array.isArray(toolInvocations)) {
    toolInvocations.forEach((invocation) => {
      if (invocation?.toolName === "fileSearch" && invocation.result?.citations) {
        citations.push(...invocation.result.citations);
      }
    });
  }

  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-6 animate-in fade-in slide-in-from-bottom-2 duration-300",
        isUser ? "bg-background" : "bg-muted/30"
      )}
    >
      <div className="flex w-full max-w-3xl mx-auto gap-3">
        {/* Avatar */}
        <div
          className={cn(
            "flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md",
            isUser ? "bg-primary text-primary-foreground" : "bg-muted"
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Message Content */}
        <div className="flex-1 space-y-2 overflow-hidden">
          <p className="text-sm font-medium leading-none">
            {isUser ? "You" : "Assistant"}
          </p>
          <div className="prose prose-sm dark:prose-invert max-w-none">
            <ReactMarkdown
              components={{
                // Paragraph
                p: ({ children }) => (
                  <p className="mb-2 last:mb-0">{children}</p>
                ),
                // Headings
                h1: ({ children }) => (
                  <h1 className="text-2xl font-bold mb-2 mt-4">{children}</h1>
                ),
                h2: ({ children }) => (
                  <h2 className="text-xl font-bold mb-2 mt-3">{children}</h2>
                ),
                h3: ({ children }) => (
                  <h3 className="text-lg font-bold mb-2 mt-3">{children}</h3>
                ),
                // Lists
                ul: ({ children }) => (
                  <ul className="list-disc list-inside mb-2 space-y-1">
                    {children}
                  </ul>
                ),
                ol: ({ children }) => (
                  <ol className="list-decimal list-inside mb-2 space-y-1">
                    {children}
                  </ol>
                ),
                li: ({ children }) => <li className="ml-2">{children}</li>,
                // Code
                code: ({ className, children }) => {
                  const isInline = !className;
                  return isInline ? (
                    <code className="bg-muted px-1.5 py-0.5 rounded text-sm">
                      {children}
                    </code>
                  ) : (
                    <code className="block bg-muted p-3 rounded-lg text-sm overflow-x-auto mb-2">
                      {children}
                    </code>
                  );
                },
                // Blockquote
                blockquote: ({ children }) => (
                  <blockquote className="border-l-4 border-muted-foreground/30 pl-4 italic my-2">
                    {children}
                  </blockquote>
                ),
                // Links
                a: ({ href, children }) => (
                  <a
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    {children}
                  </a>
                ),
              }}
            >
              {content}
            </ReactMarkdown>
            {/* Citations */}
            {!isUser && citations.length > 0 && (
              <CitationsList citations={citations} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
