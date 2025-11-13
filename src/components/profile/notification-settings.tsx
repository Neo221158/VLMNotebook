"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail, ShieldAlert } from "lucide-react";

export function NotificationSettings() {
  // UI only - these states don't persist
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [chatNotifications, setChatNotifications] = useState(true);
  const [securityAlerts, setSecurityAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [productUpdates, setProductUpdates] = useState(true);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how you receive notifications and updates
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Email Notifications</h3>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="email-notifications" className="cursor-pointer">
                  Email Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Receive email notifications for important updates
                </p>
              </div>
              <Switch
                id="email-notifications"
                checked={emailNotifications}
                onCheckedChange={setEmailNotifications}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="weekly-digest" className="cursor-pointer">
                  Weekly Digest
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get a weekly summary of your activity
                </p>
              </div>
              <Switch
                id="weekly-digest"
                checked={weeklyDigest}
                onCheckedChange={setWeeklyDigest}
                disabled
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="product-updates" className="cursor-pointer">
                  Product Updates
                </Label>
                <p className="text-xs text-muted-foreground">
                  News about new features and improvements
                </p>
              </div>
              <Switch
                id="product-updates"
                checked={productUpdates}
                onCheckedChange={setProductUpdates}
                disabled
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* In-App Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">In-App Notifications</h3>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="chat-notifications" className="cursor-pointer">
                  Chat Notifications
                </Label>
                <p className="text-xs text-muted-foreground">
                  Get notified when agents respond to your messages
                </p>
              </div>
              <Switch
                id="chat-notifications"
                checked={chatNotifications}
                onCheckedChange={setChatNotifications}
                disabled
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Security Alerts */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <ShieldAlert className="h-5 w-5 text-muted-foreground" />
            <h3 className="text-base font-medium">Security & Privacy</h3>
          </div>

          <div className="space-y-4 pl-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="security-alerts" className="cursor-pointer">
                  Security Alerts
                </Label>
                <p className="text-xs text-muted-foreground">
                  Important security and login notifications
                </p>
              </div>
              <Switch
                id="security-alerts"
                checked={securityAlerts}
                onCheckedChange={setSecurityAlerts}
                disabled
              />
            </div>
          </div>
        </div>

        <p className="text-xs text-muted-foreground pt-4">
          Notification preferences will be available soon.
        </p>
      </CardContent>
    </Card>
  );
}
