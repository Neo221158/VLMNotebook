"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, FileCode, FileJson, File, Calendar, HardDrive, FileType } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
  fileId?: string;
  storeId?: string;
  agentName?: string;
}

interface DocumentDetailsModalProps {
  documentId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getFileIcon(mimeType: string, filename: string) {
  if (mimeType.includes("pdf")) return FileText;
  if (mimeType.includes("json")) return FileJson;
  if (
    mimeType.includes("javascript") ||
    mimeType.includes("typescript") ||
    mimeType.includes("python") ||
    mimeType.includes("text/x-")
  ) {
    return FileCode;
  }

  const ext = filename.split(".").pop()?.toLowerCase();
  if (
    [
      "js",
      "jsx",
      "ts",
      "tsx",
      "py",
      "java",
      "cpp",
      "c",
      "h",
      "cs",
      "go",
      "rs",
      "rb",
      "php",
    ].includes(ext || "")
  ) {
    return FileCode;
  }

  if (ext === "json") return FileJson;
  if (["pdf", "doc", "docx", "txt", "md"].includes(ext || ""))
    return FileText;

  return File;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getStatusColor(status: string): string {
  switch (status.toLowerCase()) {
    case "ready":
      return "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20";
    case "processing":
      return "bg-yellow-500/10 text-yellow-700 dark:text-yellow-400 border-yellow-500/20";
    case "uploading":
      return "bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20";
    case "failed":
      return "bg-red-500/10 text-red-700 dark:text-red-400 border-red-500/20";
    default:
      return "bg-gray-500/10 text-gray-700 dark:text-gray-400 border-gray-500/20";
  }
}

export function DocumentDetailsModal({
  documentId,
  open,
  onOpenChange,
}: DocumentDetailsModalProps) {
  const [document, setDocument] = useState<Document | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      if (!documentId) return;

      setIsLoading(true);
      try {
        // TODO: Replace with actual API call
        // const response = await fetch(`/api/files/${documentId}`);
        // const data = await response.json();
        // setDocument(data);

        // Mock data for now
        setDocument({
          id: documentId,
          filename: "sample-document.pdf",
          mimeType: "application/pdf",
          sizeBytes: 2048576,
          status: "ready",
          uploadedAt: new Date(),
          fileId: "file_abc123",
          storeId: "store_xyz789",
          agentName: "Research Assistant",
        });
      } catch (error) {
        console.error("Failed to fetch document details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (open && documentId) {
      fetchDocumentDetails();
    }
  }, [open, documentId]);

  const FileIcon = document
    ? getFileIcon(document.mimeType, document.filename)
    : File;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Document Details</DialogTitle>
          <DialogDescription>
            View detailed information about this document
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="space-y-4 py-4">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-32 w-full" />
          </div>
        ) : document ? (
          <div className="space-y-6 py-4">
            {/* File Header */}
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <FileIcon className="h-8 w-8 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-lg break-all">{document.filename}</h3>
                <div className="flex items-center gap-2 mt-2">
                  <Badge
                    variant="outline"
                    className={`text-xs ${getStatusColor(document.status)}`}
                  >
                    {document.status}
                  </Badge>
                  {document.agentName && (
                    <Badge variant="secondary" className="text-xs">
                      {document.agentName}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            {/* File Metadata */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground">File Information</h4>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <HardDrive className="h-4 w-4" />
                    <span>File Size</span>
                  </div>
                  <p className="text-sm font-medium">{formatFileSize(document.sizeBytes)}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <FileType className="h-4 w-4" />
                    <span>File Type</span>
                  </div>
                  <p className="text-sm font-medium">{document.mimeType}</p>
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded</span>
                  </div>
                  <p className="text-sm font-medium">
                    {formatDistanceToNow(new Date(document.uploadedAt), {
                      addSuffix: true,
                    })}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(document.uploadedAt).toLocaleString()}
                  </p>
                </div>

                {document.fileId && (
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <File className="h-4 w-4" />
                      <span>File ID</span>
                    </div>
                    <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                      {document.fileId}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {document.storeId && (
              <>
                <Separator />
                <div className="space-y-2">
                  <h4 className="font-medium text-sm text-muted-foreground">Storage Information</h4>
                  <p className="text-xs text-muted-foreground">
                    This document is stored in the Gemini File Search store for this agent and is used to provide context for conversations.
                  </p>
                  <p className="text-xs font-mono bg-muted px-2 py-1 rounded break-all">
                    Store ID: {document.storeId}
                  </p>
                </div>
              </>
            )}
          </div>
        ) : (
          <div className="py-8 text-center text-muted-foreground">
            No document selected
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
