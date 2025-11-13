"use client";

import { Progress } from "@/components/ui/progress";
import { X, FileIcon, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FileUploadProgressProps {
  filename: string;
  progress: number; // 0-100
  status: "uploading" | "processing" | "ready" | "failed";
  onCancel?: () => void;
  sizeBytes?: number;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function FileUploadProgress({
  filename,
  progress,
  status,
  onCancel,
  sizeBytes,
}: FileUploadProgressProps) {
  const getStatusIcon = () => {
    switch (status) {
      case "uploading":
      case "processing":
        return null; // Show progress bar
      case "ready":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case "uploading":
        return `Uploading... ${progress}%`;
      case "processing":
        return "Processing...";
      case "ready":
        return "Upload complete";
      case "failed":
        return "Upload failed";
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case "ready":
        return "text-green-600 dark:text-green-400";
      case "failed":
        return "text-red-600 dark:text-red-400";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="rounded-lg border bg-card p-4">
      <div className="flex items-start gap-3">
        <FileIcon className="h-8 w-8 text-muted-foreground mt-1 flex-shrink-0" />

        <div className="flex-1 min-w-0">
          {/* Filename */}
          <div className="flex items-center justify-between gap-2 mb-1">
            <p className="text-sm font-medium truncate">{filename}</p>
            {onCancel && (status === "uploading" || status === "processing") && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 flex-shrink-0"
                onClick={onCancel}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>

          {/* File size */}
          {sizeBytes && (
            <p className="text-xs text-muted-foreground mb-2">
              {formatFileSize(sizeBytes)}
            </p>
          )}

          {/* Progress bar or status icon */}
          {status === "uploading" || status === "processing" ? (
            <Progress value={progress} className="h-2 mb-1" />
          ) : (
            <div className="flex items-center gap-2 mb-1">
              {getStatusIcon()}
            </div>
          )}

          {/* Status text */}
          <p className={`text-xs ${getStatusColor()}`}>
            {getStatusText()}
          </p>
        </div>
      </div>
    </div>
  );
}
