import { HeroSection } from "@/components/hero-section";
import { AgentCard } from "@/components/agents/agent-card";
import { agents } from "@/lib/mock-data/agents";

export default function Home() {
  return (
    <main className="flex-1">
      {/* Hero Section */}
      <HeroSection />

      {/* Agents Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {/* Section Header */}
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-3">
                Choose Your AI Agent
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Select from our curated collection of specialized agents, each designed for specific tasks and domains
              </p>
            </div>

            {/* Agent List */}
            <div className="space-y-6">
              {agents.map((agent) => (
                <AgentCard key={agent.id} agent={agent} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
