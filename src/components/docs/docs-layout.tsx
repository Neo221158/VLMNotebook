import { ReactNode } from "react";

interface DocsLayoutProps {
  children: ReactNode;
  tableOfContents: ReactNode;
}

export function DocsLayout({ children, tableOfContents }: DocsLayoutProps) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-8">
        {/* Table of Contents - Top on mobile, sidebar on desktop */}
        <aside className="lg:sticky lg:top-20 lg:self-start order-1">
          <div className="lg:max-h-[calc(100vh-6rem)] lg:overflow-y-auto">
            {tableOfContents}
          </div>
        </aside>

        {/* Main Content */}
        <main className="order-2 min-w-0">
          {children}
        </main>
      </div>
    </div>
  );
}
