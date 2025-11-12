import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="border-t py-8 text-sm text-muted-foreground">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <p>&copy; {new Date().getFullYear()} RAG Agents. All rights reserved.</p>
          </div>
          <nav className="flex flex-wrap justify-center gap-4 md:gap-6">
            <Link
              href="/privacy"
              className="hover:text-foreground transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="hover:text-foreground transition-colors"
            >
              Terms of Service
            </Link>
            <Link
              href="/cookies"
              className="hover:text-foreground transition-colors"
            >
              Cookie Policy
            </Link>
            <Link
              href="/about"
              className="hover:text-foreground transition-colors"
            >
              About Us
            </Link>
            <Link
              href="/docs"
              className="hover:text-foreground transition-colors"
            >
              Documentation
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
