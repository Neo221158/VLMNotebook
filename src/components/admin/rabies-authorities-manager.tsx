"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

interface Authority {
  id: string;
  city: string;
  region: string | null;
  veterinarianName: string;
  reportingSoftware: string;
  softwareUrl: string | null;
  contactEmail: string;
  phoneNumber: string | null;
  notes: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export function RabiesAuthoritiesManager() {
  const [authorities, setAuthorities] = useState<Authority[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    city: "",
    region: "",
    veterinarianName: "",
    reportingSoftware: "",
    softwareUrl: "",
    contactEmail: "",
    phoneNumber: "",
    notes: "",
  });

  useEffect(() => {
    fetchAuthorities();
  }, []);

  const fetchAuthorities = async () => {
    try {
      const response = await fetch("/api/admin/rabies-authorities");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAuthorities(data.authorities);
    } catch {
      toast.error("Failed to load authorities");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const url = editingId
        ? `/api/admin/rabies-authorities/${editingId}`
        : "/api/admin/rabies-authorities";

      const response = await fetch(url, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          region: formData.region || null,
          softwareUrl: formData.softwareUrl || null,
          phoneNumber: formData.phoneNumber || null,
          notes: formData.notes || null,
        }),
      });

      if (!response.ok) throw new Error("Failed to save");

      toast.success(editingId ? "Updated successfully" : "Created successfully");
      setIsAddDialogOpen(false);
      setEditingId(null);
      resetForm();
      fetchAuthorities();
    } catch {
      toast.error("Failed to save authority");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this authority?")) return;

    try {
      const response = await fetch(`/api/admin/rabies-authorities/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete");

      toast.success("Deleted successfully");
      fetchAuthorities();
    } catch {
      toast.error("Failed to delete authority");
    }
  };

  const handleEdit = (authority: Authority) => {
    setFormData({
      city: authority.city,
      region: authority.region || "",
      veterinarianName: authority.veterinarianName,
      reportingSoftware: authority.reportingSoftware,
      softwareUrl: authority.softwareUrl || "",
      contactEmail: authority.contactEmail,
      phoneNumber: authority.phoneNumber || "",
      notes: authority.notes || "",
    });
    setEditingId(authority.id);
    setIsAddDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      city: "",
      region: "",
      veterinarianName: "",
      reportingSoftware: "",
      softwareUrl: "",
      contactEmail: "",
      phoneNumber: "",
      notes: "",
    });
  };

  if (loading) {
    return (
      <div className="container mx-auto py-8 px-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold mb-2">Manage Rabies Authorities</h1>
          <p className="text-muted-foreground">
            View and manage rabies authority records ({authorities.length} total)
          </p>
        </div>
        <Button
          onClick={() => {
            resetForm();
            setEditingId(null);
            setIsAddDialogOpen(true);
          }}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Authority
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Authorities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>City</TableHead>
                  <TableHead>Region</TableHead>
                  <TableHead>Veterinarian</TableHead>
                  <TableHead>Software</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {authorities.map((authority) => (
                  <TableRow key={authority.id}>
                    <TableCell className="font-medium">{authority.city}</TableCell>
                    <TableCell>{authority.region || "-"}</TableCell>
                    <TableCell>{authority.veterinarianName}</TableCell>
                    <TableCell>
                      {authority.softwareUrl ? (
                        <a
                          href={authority.softwareUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {authority.reportingSoftware}
                        </a>
                      ) : (
                        authority.reportingSoftware
                      )}
                    </TableCell>
                    <TableCell>{authority.contactEmail}</TableCell>
                    <TableCell>{authority.phoneNumber || "-"}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEdit(authority)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(authority.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingId ? "Edit" : "Add"} Authority</DialogTitle>
            <DialogDescription>
              {editingId ? "Update" : "Enter"} the rabies authority information
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  placeholder="Tel Aviv"
                />
              </div>
              <div>
                <Label htmlFor="region">Region</Label>
                <Input
                  id="region"
                  value={formData.region}
                  onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                  placeholder="Central District"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="veterinarianName">Veterinarian Name *</Label>
              <Input
                id="veterinarianName"
                value={formData.veterinarianName}
                onChange={(e) =>
                  setFormData({ ...formData, veterinarianName: e.target.value })
                }
                placeholder="Dr. Sarah Cohen"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="reportingSoftware">Reporting Software *</Label>
                <Input
                  id="reportingSoftware"
                  value={formData.reportingSoftware}
                  onChange={(e) =>
                    setFormData({ ...formData, reportingSoftware: e.target.value })
                  }
                  placeholder="VetReport Pro"
                />
              </div>
              <div>
                <Label htmlFor="softwareUrl">Software URL</Label>
                <Input
                  id="softwareUrl"
                  type="url"
                  value={formData.softwareUrl}
                  onChange={(e) =>
                    setFormData({ ...formData, softwareUrl: e.target.value })
                  }
                  placeholder="https://vetreport.com"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="contactEmail">Contact Email *</Label>
                <Input
                  id="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={(e) =>
                    setFormData({ ...formData, contactEmail: e.target.value })
                  }
                  placeholder="sarah.cohen@health.gov.il"
                />
              </div>
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input
                  id="phoneNumber"
                  type="tel"
                  value={formData.phoneNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, phoneNumber: e.target.value })
                  }
                  placeholder="+972-3-1234567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="notes">Notes</Label>
              <Input
                id="notes"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                placeholder="Additional information..."
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingId(null);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
