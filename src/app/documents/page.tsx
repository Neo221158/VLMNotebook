import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { agents } from "@/lib/mock-data/agents";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AgentDocumentsManager } from "@/components/documents/agent-documents-manager";

export default async function DocumentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/");
  }

  const user = session.user;

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-2">
          Document Management
        </h1>
        <p className="text-muted-foreground">
          Upload and manage documents for each agent. Files are used to enhance agent responses with your specific knowledge.
        </p>
      </div>

      {/* Agent Tabs */}
      <Tabs defaultValue={agents[0].id} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 h-auto gap-2 bg-transparent">
          {agents.map((agent) => (
            <TabsTrigger
              key={agent.id}
              value={agent.id}
              className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              <span className="text-lg">{agent.icon}</span>
              <span className="hidden sm:inline">{agent.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {agents.map((agent) => (
          <TabsContent key={agent.id} value={agent.id}>
            <AgentDocumentsManager agent={agent} userId={user.id} />
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
