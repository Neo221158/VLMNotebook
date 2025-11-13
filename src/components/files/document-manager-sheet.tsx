"use client";

import { useState, useEffect } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { FileUploadButton } from "@/components/files/file-upload-button";
import { DocumentCard } from "@/components/files/document-card";
import { DocumentDetailsModal } from "@/components/files/document-details-modal";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText } from "lucide-react";
import { toast } from "sonner";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
}

interface DocumentManagerSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agentId: string;
  agentName: string;
  userId: string;
}

export function DocumentManagerSheet({
  open,
  onOpenChange,
  agentId,
  agentName,
  userId,
}: DocumentManagerSheetProps) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedDocumentId, setSelectedDocumentId] = useState<string | null>(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);

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
    if (open) {
      fetchDocuments();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, agentId]);

  const handleDelete = async (documentId: string) => {
    try {
      const response = await fetch(`/api/files/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      toast.success("Document deleted successfully");
      fetchDocuments();
    } catch (error) {
      console.error("Failed to delete document:", error);
      toast.error("Failed to delete document");
    }
  };

  const handleViewDetails = (documentId: string) => {
    setSelectedDocumentId(documentId);
    setDetailsModalOpen(true);
  };

  const handleUploadSuccess = () => {
    toast.success("Document uploaded successfully");
    fetchDocuments();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full sm:max-w-lg">
          <SheetHeader>
            <SheetTitle>Documents for {agentName}</SheetTitle>
            <SheetDescription>
              Manage documents that provide context for this agent
            </SheetDescription>
          </SheetHeader>

          <div className="mt-6 space-y-4">
            {/* Upload Button */}
            <div className="flex justify-center">
              <FileUploadButton
                agentId={agentId}
                onUploadSuccess={handleUploadSuccess}
              />
            </div>

            {/* Documents List */}
            <div className="space-y-2">
              <h3 className="font-medium text-sm text-muted-foreground">
                Uploaded Documents ({documents.length})
              </h3>

              <ScrollArea className="h-[calc(100vh-280px)]">
                {isLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-24 w-full" />
                    ))}
                  </div>
                ) : documents.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
                      <FileText className="h-6 w-6 text-muted-foreground" />
                    </div>
                    <p className="text-sm font-medium mb-1">No documents yet</p>
                    <p className="text-xs text-muted-foreground max-w-xs">
                      Upload documents to enhance {agentName}&apos;s knowledge and responses
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3 pr-4">
                    {documents.map((document) => (
                      <DocumentCard
                        key={document.id}
                        document={{
                          ...document,
                          agentName,
                        }}
                        onDelete={handleDelete}
                        onViewDetails={handleViewDetails}
                      />
                    ))}
                  </div>
                )}
              </ScrollArea>
            </div>
          </div>
        </SheetContent>
      </Sheet>

      {/* Details Modal */}
      <DocumentDetailsModal
        documentId={selectedDocumentId}
        open={detailsModalOpen}
        onOpenChange={setDetailsModalOpen}
      />
    </>
  );
}
