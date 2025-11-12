"use client";

import { Agent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, MessageSquare } from "lucide-react";
import Link from "next/link";

interface AgentPreviewDialogProps {
  agent: Agent;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AgentPreviewDialog({
  agent,
  open,
  onOpenChange,
}: AgentPreviewDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="text-4xl">{agent.icon}</div>
            <div>
              <DialogTitle className="text-2xl">{agent.name}</DialogTitle>
              <DialogDescription className="text-base mt-1">
                {agent.category}
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <ScrollArea className="max-h-[50vh] pr-4">
          <div className="space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-sm font-semibold mb-2">About</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
            </div>

            <Separator />

            {/* Tags */}
            <div>
              <h3 className="text-sm font-semibold mb-2">Capabilities</h3>
              <div className="flex flex-wrap gap-2">
                {agent.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            <Separator />

            {/* Use Cases */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Perfect For</h3>
              <ul className="space-y-2">
                {agent.useCases.map((useCase, index) => (
                  <li
                    key={index}
                    className="text-sm text-muted-foreground flex items-start gap-2"
                  >
                    <span className="text-primary mt-0.5">✓</span>
                    <span className="flex-1">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            <Separator />

            {/* Sample Questions */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Try Asking</h3>
              <div className="space-y-2">
                {agent.sampleQuestions.map((question, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 text-sm"
                  >
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{question}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </ScrollArea>

        {/* Action */}
        <div className="flex gap-2 pt-4">
          <Button asChild className="flex-1 gap-2">
            <Link href={`/chat/${agent.id}`} onClick={() => onOpenChange(false)}>
              Start Chatting
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
