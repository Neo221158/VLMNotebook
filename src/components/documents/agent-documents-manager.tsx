"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileUploadButton } from "@/components/files/file-upload-button";
import { DocumentListFetcher } from "@/components/files/document-list-fetcher";

interface Agent {
  id: string;
  name: string;
  icon: string;
  description: string;
  suggestedDocuments?: string[];
}

interface AgentDocumentsManagerProps {
  agent: Agent;
  userId: string;
}

export function AgentDocumentsManager({ agent, userId }: AgentDocumentsManagerProps) {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUploadSuccess = () => {
    // Trigger a refresh by updating the key
    setRefreshKey((prev) => prev + 1);
  };

  return (
    <div className="space-y-6">
      {/* Agent Info Card */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <span className="text-4xl">{agent.icon}</span>
              <div>
                <CardTitle className="text-2xl">{agent.name}</CardTitle>
                <CardDescription className="mt-1">
                  {agent.description}
                </CardDescription>
              </div>
            </div>
            <FileUploadButton
              agentId={agent.id}
              onUploadSuccess={handleUploadSuccess}
            />
          </div>
        </CardHeader>

        {agent.suggestedDocuments && (
          <CardContent>
            <div className="rounded-lg bg-muted p-4">
              <p className="text-sm font-medium mb-2">Suggested document types:</p>
              <div className="flex flex-wrap gap-2">
                {agent.suggestedDocuments.map((docType, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-md bg-background px-2.5 py-1 text-xs font-medium text-foreground ring-1 ring-inset ring-border"
                  >
                    {docType}
                  </span>
                ))}
              </div>
            </div>
          </CardContent>
        )}
      </Card>

      {/* Documents List */}
      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
          <CardDescription>
            Documents uploaded for {agent.name}. These files are used to provide context and knowledge for this agent.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DocumentListFetcher
            key={refreshKey}
            agentId={agent.id}
            userId={userId}
          />
        </CardContent>
      </Card>
    </div>
  );
}
