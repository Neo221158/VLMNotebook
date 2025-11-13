"use client";

import { useEffect, useState } from "react";
import { DocumentList } from "./document-list";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
}

interface DocumentListFetcherProps {
  agentId: string;
  userId: string;
}

export function DocumentListFetcher({ agentId, userId }: DocumentListFetcherProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDocuments = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/files?agentId=${agentId}&userId=${userId}`);
      if (!response.ok) {
        throw new Error("Failed to fetch documents");
      }
      const data = await response.json();
      setDocuments(data.documents || []);
    } catch (error) {
      console.error("Failed to fetch documents:", error);
      toast.error("Failed to load documents");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [agentId, userId]);

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/files/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast.success("Document deleted successfully");
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  return <DocumentList documents={documents} onDelete={handleDelete} isLoading={isLoading} />;
}
