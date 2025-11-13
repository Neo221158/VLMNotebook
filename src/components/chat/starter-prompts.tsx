import { Agent } from "@/lib/types";
import { Card } from "@/components/ui/card";
import { MessageSquare } from "lucide-react";

interface StarterPromptsProps {
  agent: Agent;
  onSelectPrompt: (prompt: string) => void;
}

export function StarterPrompts({ agent, onSelectPrompt }: StarterPromptsProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4">
      <div className="max-w-3xl w-full space-y-6">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="text-6xl mb-4">{agent.icon}</div>
          <h2 className="text-2xl font-bold">{agent.name}</h2>
          <p className="text-muted-foreground">{agent.description}</p>
        </div>

        {/* Starter Prompts */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-muted-foreground flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Try asking:
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {agent.sampleQuestions.map((question, index) => (
              <Card
                key={index}
                className="p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => onSelectPrompt(question)}
              >
                <p className="text-sm">{question}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Or type your own */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Or type your own message below to get started
          </p>
        </div>
      </div>
    </div>
  );
}
