"use client";

import { useState } from "react";
import {
  FileText,
  FileCode,
  FileJson,
  File,
  Trash2,
  Info,
  MoreVertical,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow } from "date-fns";

interface Document {
  id: string;
  filename: string;
  mimeType: string;
  sizeBytes: number;
  status: string;
  uploadedAt: Date;
  agentName?: string;
}

interface DocumentCardProps {
  document: Document;
  onDelete?: (documentId: string) => void;
  onViewDetails?: (documentId: string) => void;
}

function getFileIcon(mimeType: string, filename: string) {
  // Check by MIME type
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

  // Check by extension
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

function getFileExtension(filename: string): string {
  return filename.split(".").pop()?.toUpperCase() || "FILE";
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

export function DocumentCard({
  document,
  onDelete,
  onViewDetails,
}: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const FileIcon = getFileIcon(document.mimeType, document.filename);

  const handleDelete = async () => {
    if (!onDelete) return;
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Card className="group hover:shadow-md transition-all duration-200 hover:border-primary/50">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          {/* File Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
              <FileIcon className="h-6 w-6 text-primary" />
            </div>
          </div>

          {/* File Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h3 className="font-medium text-sm truncate" title={document.filename}>
                  {document.filename}
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(document.sizeBytes)}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {getFileExtension(document.filename)}
                  </span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNow(new Date(document.uploadedAt), {
                      addSuffix: true,
                    })}
                  </span>
                </div>
              </div>

              {/* Actions Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  {onViewDetails && (
                    <DropdownMenuItem onClick={() => onViewDetails(document.id)}>
                      <Info className="h-4 w-4 mr-2" />
                      View Details
                    </DropdownMenuItem>
                  )}
                  {onDelete && (
                    <DropdownMenuItem
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="text-destructive focus:text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      {isDeleting ? "Deleting..." : "Delete"}
                    </DropdownMenuItem>
                  )}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Status Badge */}
            <div className="mt-2 flex items-center gap-2">
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
      </CardContent>
    </Card>
  );
}
