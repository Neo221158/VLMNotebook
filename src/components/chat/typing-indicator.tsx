import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  variant?: "typing" | "thinking";
}

export function TypingIndicator({ variant = "typing" }: TypingIndicatorProps) {
  return (
    <div className="flex gap-3 px-4 py-6 bg-muted/30 animate-in fade-in duration-300">
      <div className="flex w-full max-w-3xl mx-auto gap-3">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
          <Bot className="h-4 w-4" />
        </div>

        {/* Typing Animation */}
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium leading-none">Assistant</p>
          {variant === "thinking" ? (
            <div className="flex items-center gap-2 h-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.2s]" />
                <div className="w-1.5 h-1.5 rounded-full bg-primary/60 animate-pulse [animation-delay:0.4s]" />
              </div>
              <span>Thinking...</span>
            </div>
          ) : (
            <div className="flex items-center gap-1 h-6">
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.3s]" />
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce [animation-delay:-0.15s]" />
              <div className="w-2 h-2 rounded-full bg-primary/60 animate-bounce" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
