import { FileText, ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import type { Citation } from "@/lib/types";

interface CitationsListProps {
  citations: Citation[];
}

export function CitationsList({ citations }: CitationsListProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!citations || citations.length === 0) {
    return null;
  }

  return (
    <div className="mt-4 border border-border rounded-lg overflow-hidden bg-muted/50">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between px-4 py-2 hover:bg-muted/80 transition-colors"
      >
        <div className="flex items-center gap-2 text-sm font-medium">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span>
            {citations.length} {citations.length === 1 ? "Source" : "Sources"}
          </span>
        </div>
        {isExpanded ? (
          <ChevronDown className="h-4 w-4 text-muted-foreground" />
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        )}
      </button>

      {/* Citations List */}
      {isExpanded && (
        <div className="border-t border-border">
          {citations.map((citation, index) => (
            <div
              key={index}
              className={cn(
                "px-4 py-3 text-sm",
                index !== citations.length - 1 && "border-b border-border"
              )}
            >
              <div className="flex items-start gap-2">
                <span className="font-mono text-xs text-muted-foreground mt-0.5">
                  [{index + 1}]
                </span>
                <div className="flex-1 space-y-1">
                  {citation.documentName && (
                    <p className="font-medium text-foreground">
                      {citation.documentName}
                      {citation.confidence && (
                        <span className="text-xs text-muted-foreground ml-2">
                          (Confidence: {(citation.confidence * 100).toFixed(0)}%)
                        </span>
                      )}
                    </p>
                  )}
                  {citation.chunkText && (
                    <p className="text-muted-foreground italic line-clamp-3">
                      &quot;{citation.chunkText.substring(0, 300)}
                      {citation.chunkText.length > 300 ? "..." : ""}&quot;
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
