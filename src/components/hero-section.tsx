import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      {/* Background gradient */}
      <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
      <div className="absolute inset-0 -z-10 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-3xl text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/60 px-4 py-1.5 text-sm backdrop-blur">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-muted-foreground">
              Powered by Advanced AI
            </span>
          </div>

          {/* Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            Chat with Specialized{" "}
            <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              RAG Agents
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mb-8 text-lg text-muted-foreground md:text-xl">
            Choose from curated AI agents designed for specific tasks. Get intelligent, context-aware responses powered by retrieval-augmented generation.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild className="gap-2">
              <Link href="/dashboard">
                Get Started
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/docs">View Documentation</Link>
            </Button>
          </div>

          {/* Stats or Trust Indicators (optional) */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
            <div>
              <span className="block text-2xl font-bold text-foreground">
                5+
              </span>
              <span>Specialized Agents</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-foreground">
                24/7
              </span>
              <span>Availability</span>
            </div>
            <div>
              <span className="block text-2xl font-bold text-foreground">
                Instant
              </span>
              <span>Responses</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
