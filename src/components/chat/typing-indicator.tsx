import { Bot } from "lucide-react";

export function TypingIndicator() {
  return (
    <div className="flex gap-3 px-4 py-6 bg-muted/30">
      <div className="flex w-full max-w-3xl mx-auto gap-3">
        {/* Avatar */}
        <div className="flex h-8 w-8 shrink-0 select-none items-center justify-center rounded-md bg-muted">
          <Bot className="h-4 w-4" />
        </div>

        {/* Typing Animation */}
        <div className="flex-1 space-y-2">
          <p className="text-sm font-medium leading-none">Assistant</p>
          <div className="flex items-center gap-1 h-6">
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.3s]" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce [animation-delay:-0.15s]" />
            <div className="w-2 h-2 rounded-full bg-muted-foreground/40 animate-bounce" />
          </div>
        </div>
      </div>
    </div>
  );
}
