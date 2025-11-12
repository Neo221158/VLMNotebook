import Link from "next/link";
import { UserProfile } from "@/components/auth/user-profile";
import { ModeToggle } from "./ui/mode-toggle";
import { Bot } from "lucide-react";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">
            <Link
              href="/"
              className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors"
            >
              <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10">
                <Bot className="h-5 w-5" />
              </div>
              <span className="bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                RAG Agents
              </span>
            </Link>
          </h1>
          <nav className="hidden md:flex items-center gap-6 text-sm">
            <Link
              href="/"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Home
            </Link>
            <Link
              href="/docs"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
            <Link
              href="/about"
              className="text-foreground/60 hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <UserProfile />
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
