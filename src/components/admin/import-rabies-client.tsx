"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Upload, FileText, CheckCircle2, Loader2, AlertCircle, Download } from "lucide-react";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

interface ExtractedRecord {
  city: string;
  region: string | null;
  veterinarianName: string;
  reportingSoftware: string;
  softwareUrl: string | null;
  contactEmail: string;
  phoneNumber: string | null;
  notes: string | null;
}

export function ImportRabiesClient() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isExtracting, setIsExtracting] = useState(false);
  const [extractedData, setExtractedData] = useState<ExtractedRecord[]>([]);
  const [isImporting, setIsImporting] = useState(false);
  const [importComplete, setImportComplete] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.type !== "application/pdf") {
        toast.error("Please select a PDF file");
        return;
      }
      if (file.size > 100 * 1024 * 1024) {
        toast.error("File size must be less than 100MB");
        return;
      }
      setSelectedFile(file);
      setExtractedData([]);
      setImportComplete(false);
    }
  };

  const handleExtract = async () => {
    if (!selectedFile) return;

    setIsExtracting(true);

    try {
      const formData = new FormData();
      formData.append("file", selectedFile);

      const response = await fetch("/api/admin/import-rabies-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Extraction failed");
      }

      const data = await response.json();
      setExtractedData(data.data);
      toast.success(`Extracted ${data.totalRecords} records. Please review before importing.`);
    } catch (error) {
      console.error("Extraction error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to extract data from PDF");
    } finally {
      setIsExtracting(false);
    }
  };

  const handleImport = async (replaceExisting: boolean = false) => {
    if (extractedData.length === 0) return;

    setIsImporting(true);

    try {
      const response = await fetch("/api/admin/import-rabies-bulk", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          records: extractedData,
          replaceExisting,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Import failed");
      }

      const data = await response.json();
      toast.success(data.message);
      setImportComplete(true);
      setSelectedFile(null);
      setExtractedData([]);
    } catch (error) {
      console.error("Import error:", error);
      toast.error(error instanceof Error ? error.message : "Failed to import records");
    } finally {
      setIsImporting(false);
    }
  };

  const handleEditCell = (index: number, field: keyof ExtractedRecord, value: string) => {
    const updated = [...extractedData];
    updated[index] = { ...updated[index], [field]: value };
    setExtractedData(updated);
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Import Rabies Authority Data</h1>
        <p className="text-muted-foreground text-lg">
          Upload a PDF to extract and import rabies authority records using AI
        </p>
      </div>

      {/* Upload Section */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Step 1: Upload PDF
          </CardTitle>
          <CardDescription>
            Select a PDF file containing rabies authority information (max 100MB)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Input
              type="file"
              accept="application/pdf"
              onChange={handleFileSelect}
              disabled={isExtracting || isImporting}
              className="max-w-md"
            />
            {selectedFile && (
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{selectedFile.name}</span>
                <span>({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
              </div>
            )}
          </div>
          <Button
            onClick={handleExtract}
            disabled={!selectedFile || isExtracting || isImporting}
            size="lg"
          >
            {isExtracting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Extracting Data...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Extract Data
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Extraction Progress */}
      {isExtracting && (
        <Card className="mb-8">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-primary" />
              <p className="text-lg font-medium">Extracting data from PDF...</p>
              <p className="text-sm text-muted-foreground mt-2">
                This may take a minute depending on the file size
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {extractedData.length > 0 && !importComplete && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Step 2: Review Extracted Data ({extractedData.length} records)
            </CardTitle>
            <CardDescription>
              Review and edit the extracted data before importing. Click on any cell to edit.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">#</TableHead>
                    <TableHead>City</TableHead>
                    <TableHead>Region</TableHead>
                    <TableHead>Veterinarian</TableHead>
                    <TableHead>Software</TableHead>
                    <TableHead>Software URL</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {extractedData.map((record, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          value={record.city}
                          onChange={(e) => handleEditCell(index, "city", e.target.value)}
                          className="min-w-[120px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={record.region || ""}
                          onChange={(e) => handleEditCell(index, "region", e.target.value)}
                          placeholder="Optional"
                          className="min-w-[120px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={record.veterinarianName}
                          onChange={(e) => handleEditCell(index, "veterinarianName", e.target.value)}
                          className="min-w-[180px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={record.reportingSoftware}
                          onChange={(e) =>
                            handleEditCell(index, "reportingSoftware", e.target.value)
                          }
                          className="min-w-[150px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="url"
                          value={record.softwareUrl || ""}
                          onChange={(e) => handleEditCell(index, "softwareUrl", e.target.value)}
                          placeholder="https://..."
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="email"
                          value={record.contactEmail}
                          onChange={(e) => handleEditCell(index, "contactEmail", e.target.value)}
                          className="min-w-[200px]"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          value={record.phoneNumber || ""}
                          onChange={(e) => handleEditCell(index, "phoneNumber", e.target.value)}
                          placeholder="Optional"
                          className="min-w-[140px]"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="mt-6 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Badge variant="outline" className="text-base py-2 px-4">
                  {extractedData.length} records ready to import
                </Badge>
              </div>
              <div className="flex gap-3">
                <Button
                  onClick={() => handleImport(false)}
                  disabled={isImporting}
                  size="lg"
                  variant="outline"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Add to Existing
                    </>
                  )}
                </Button>
                <Button
                  onClick={() => handleImport(true)}
                  disabled={isImporting}
                  size="lg"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    <>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Replace All Data
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Success Message */}
      {importComplete && (
        <Card className="bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center">
              <CheckCircle2 className="h-16 w-16 text-green-600 dark:text-green-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-green-900 dark:text-green-100 mb-2">
                Import Successful!
              </h3>
              <p className="text-green-700 dark:text-green-300 mb-6">
                All records have been imported to the database.
              </p>
              <Button
                onClick={() => {
                  setImportComplete(false);
                  setSelectedFile(null);
                }}
                variant="outline"
              >
                Import Another File
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      {extractedData.length === 0 && !isExtracting && !importComplete && (
        <Card>
          <CardHeader>
            <CardTitle>How to Use</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div className="flex gap-3">
              <div className="font-bold text-primary">1.</div>
              <p>
                Upload a PDF file containing rabies authority information (city, veterinarian, software,
                email)
              </p>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary">2.</div>
              <p>
                Click &quot;Extract Data&quot; to use AI to automatically extract structured information from the
                PDF
              </p>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary">3.</div>
              <p>Review the extracted data in the table and make any necessary corrections</p>
            </div>
            <div className="flex gap-3">
              <div className="font-bold text-primary">4.</div>
              <p>
                Choose &quot;Add to Existing&quot; to append records or &quot;Replace All Data&quot; to clear and reimport
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
