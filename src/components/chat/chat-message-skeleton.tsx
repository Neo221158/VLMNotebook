import { Skeleton } from "@/components/ui/skeleton";
import { Bot, User } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatMessageSkeletonProps {
  isUser?: boolean;
}

export function ChatMessageSkeleton({ isUser = false }: ChatMessageSkeletonProps) {
  return (
    <div
      className={cn(
        "flex gap-3 px-4 py-6",
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

        {/* Content Skeleton */}
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-16" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-4/6" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChatMessageSkeletonList({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, index) => (
        <ChatMessageSkeleton key={index} isUser={index % 2 === 0} />
      ))}
    </>
  );
}
