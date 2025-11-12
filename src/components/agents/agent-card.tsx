"use client";

import { Agent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Info } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { AgentPreviewDialog } from "./agent-preview-dialog";

interface AgentCardProps {
  agent: Agent;
}

export function AgentCard({ agent }: AgentCardProps) {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      <Card className="relative overflow-hidden transition-all hover:shadow-lg">
        {/* Colored accent bar */}
        <div
          className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${
            agent.color === "blue" ? "from-blue-500 to-blue-600" :
            agent.color === "green" ? "from-green-500 to-green-600" :
            agent.color === "purple" ? "from-purple-500 to-purple-600" :
            agent.color === "orange" ? "from-orange-500 to-orange-600" :
            agent.color === "pink" ? "from-pink-500 to-pink-600" :
            "from-primary to-primary/70"
          }`}
        />

        <CardHeader className="pb-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="text-4xl">{agent.icon}</div>
              <div>
                <CardTitle className="text-xl">{agent.name}</CardTitle>
                <CardDescription className="mt-1">{agent.category}</CardDescription>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setShowPreview(true)}
            >
              <Info className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Description */}
          <p className="text-sm text-muted-foreground leading-relaxed">
            {agent.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {agent.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          {/* Use Cases */}
          <div>
            <h4 className="text-sm font-medium mb-2">Key Use Cases:</h4>
            <ul className="space-y-1.5">
              {agent.useCases.slice(0, 3).map((useCase, index) => (
                <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  <span className="flex-1">{useCase}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button asChild className="flex-1 gap-2">
              <Link href={`/chat/${agent.id}`}>
                Start Chat
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowPreview(true)}
            >
              Preview
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Preview Dialog */}
      <AgentPreviewDialog
        agent={agent}
        open={showPreview}
        onOpenChange={setShowPreview}
      />
    </>
  );
}
