import { Agent } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface AgentCardCompactProps {
  agent: Agent;
}

export function AgentCardCompact({ agent }: AgentCardCompactProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            {/* Agent Icon */}
            <div className="text-3xl flex-shrink-0">{agent.icon}</div>

            {/* Agent Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium mb-1">{agent.name}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
                {agent.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {agent.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          {/* Action Button */}
          <Button asChild className="flex-shrink-0">
            <Link href={`/chat/${agent.id}`}>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
