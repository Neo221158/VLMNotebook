"use client";

import { useState, useEffect } from "react";
import { FileUploadButton } from "./file-upload-button";
import { DocumentList } from "./document-list";
import { Separator } from "@/components/ui/separator";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
}

interface DocumentManagerProps {
  agentId: string;
  agentName?: string;
}

export function DocumentManager({
  agentId,
  agentName,
}: DocumentManagerProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/files?agentId=${agentId}`);

      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }

      const data = await response.json();
      setDocuments(
        data.documents.map((doc: Document) => ({
          ...doc,
          uploadedAt: new Date(doc.uploadedAt),
        }))
      );
    } catch (error) {
      console.error("Failed to fetch documents:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId]);

  const handleUploadSuccess = () => {
    fetchDocuments();
  };

  const handleDelete = () => {
    fetchDocuments();
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Documents</h3>
          {agentName && (
            <p className="text-sm text-muted-foreground">
              Upload documents for {agentName} to reference
            </p>
          )}
        </div>
        <FileUploadButton
          agentId={agentId}
          onUploadSuccess={handleUploadSuccess}
        />
      </div>

      <Separator />

      {/* Document List */}
      <DocumentList
        documents={documents}
        onDelete={handleDelete}
        isLoading={isLoading}
      />

      {/* Document count */}
      {!isLoading && documents.length > 0 && (
        <p className="text-xs text-muted-foreground text-center pt-2">
          {documents.length} {documents.length === 1 ? "document" : "documents"}{" "}
          uploaded
        </p>
      )}
    </div>
  );
}
