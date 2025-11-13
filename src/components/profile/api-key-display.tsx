"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Copy, RefreshCw, Eye, EyeOff, Key, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export function ApiKeyDisplay() {
  const [showKey, setShowKey] = useState(false);
  // Mock API key for UI demonstration
  const mockApiKey = "sk_rag_1234567890abcdefghijklmnopqrstuvwxyz";
  const maskedKey = "sk_rag_••••••••••••••••••••••••••••••••";

  const handleCopy = () => {
    // UI only - would copy actual API key
    navigator.clipboard.writeText(mockApiKey);
    toast.success("API key copied to clipboard");
  };

  const handleRegenerate = () => {
    // UI only - would regenerate API key
    toast.info("API key regeneration coming soon");
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>API Access</CardTitle>
            <CardDescription>
              Your personal API key for programmatic access
            </CardDescription>
          </div>
          <Badge variant="outline" className="gap-2">
            <Key className="h-3 w-3" />
            Active
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* API Key Display */}
        <div className="space-y-3">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Input
                type="text"
                value={showKey ? mockApiKey : maskedKey}
                readOnly
                className="font-mono text-sm pr-10"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
                onClick={() => setShowKey(!showKey)}
              >
                {showKey ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleCopy}
              className="shrink-0"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="destructive"
              size="sm"
              onClick={handleRegenerate}
              disabled
              className="gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Regenerate Key
            </Button>
          </div>
        </div>

        {/* Warning Message */}
        <div className="flex gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
          <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="space-y-1 text-sm">
            <p className="font-medium text-amber-900 dark:text-amber-200">
              Keep your API key secure
            </p>
            <p className="text-amber-700 dark:text-amber-300">
              Never share your API key in publicly accessible areas. If you believe your key has been compromised, regenerate it immediately.
            </p>
          </div>
        </div>

        {/* Usage Instructions */}
        <div className="space-y-3">
          <h4 className="text-sm font-medium">How to use your API key</h4>
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <p className="text-xs text-muted-foreground">
              Include your API key in the authorization header:
            </p>
            <pre className="text-xs bg-background p-3 rounded border overflow-x-auto">
              <code>{`Authorization: Bearer YOUR_API_KEY`}</code>
            </pre>
          </div>

          <div className="space-y-2">
            <h5 className="text-xs font-medium">Rate Limits</h5>
            <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
              <li>1,000 requests per hour</li>
              <li>10,000 requests per day</li>
              <li>Upgrade your plan for higher limits</li>
            </ul>
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          API access functionality coming soon.
        </p>
      </CardContent>
    </Card>
  );
}
