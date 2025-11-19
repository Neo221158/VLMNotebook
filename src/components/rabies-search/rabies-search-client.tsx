"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Search, Loader2, ExternalLink, Mail, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RabiesAuthority {
  id: string;
  city: string;
  region: string | null;
  veterinarianName: string;
  reportingSoftware: string;
  softwareUrl: string | null;
  contactEmail: string;
  phoneNumber: string | null;
  notes: string | null;
}

export function RabiesSearchClient() {
  const [searchQuery, setSearchQuery] = useState("");
  const [authorities, setAuthorities] = useState<RabiesAuthority[]>([]);
  const [filteredAuthorities, setFilteredAuthorities] = useState<RabiesAuthority[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load all authorities on mount
    fetchAuthorities();
  }, []);

  useEffect(() => {
    // Filter authorities based on search query
    if (!searchQuery.trim()) {
      setFilteredAuthorities(authorities);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = authorities.filter(
        (auth) =>
          auth.city.toLowerCase().includes(query) ||
          auth.region?.toLowerCase().includes(query) ||
          auth.veterinarianName.toLowerCase().includes(query) ||
          auth.reportingSoftware.toLowerCase().includes(query)
      );
      setFilteredAuthorities(filtered);
    }
  }, [searchQuery, authorities]);

  const fetchAuthorities = async () => {
    try {
      const response = await fetch("/api/rabies-search");
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setAuthorities(data.authorities || []);
      setFilteredAuthorities(data.authorities || []);
    } catch (error) {
      console.error("Error fetching authorities:", error);
    } finally {
      setLoading(false);
    }
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
    <div className="container mx-auto py-8 px-4 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">חיפוש רשויות כלבת</h1>
        <p className="text-muted-foreground">
          מצא מידע על רשויות דיווח כלבת, וטרינרים אזוריים ותוכנות דיווח ({authorities.length} רשויות)
        </p>
      </div>

      {/* Search */}
      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="text"
              placeholder="חפש לפי עיר, אזור, וטרינר או תוכנה..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 text-lg"
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            נמצאו {filteredAuthorities.length} תוצאות
          </p>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="grid gap-4">
        {filteredAuthorities.length === 0 ? (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">לא נמצאו תוצאות עבור &quot;{searchQuery}&quot;</p>
              <p className="text-sm text-muted-foreground mt-2">נסה לחפש עיר אחרת או נקה את החיפוש</p>
            </CardContent>
          </Card>
        ) : (
          filteredAuthorities.map((authority) => (
            <Card key={authority.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-xl">{authority.city}</CardTitle>
                    {authority.region && (
                      <CardDescription className="mt-1">{authority.region}</CardDescription>
                    )}
                  </div>
                  <Badge variant="secondary">{authority.reportingSoftware}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Veterinarian */}
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">וטרינר אזורי</p>
                    <p className="text-base font-medium">{authority.veterinarianName}</p>
                  </div>

                  {/* Software */}
                  {authority.softwareUrl ? (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">תוכנת דיווח</p>
                      <a
                        href={authority.softwareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-base text-primary hover:underline inline-flex items-center gap-1"
                      >
                        {authority.reportingSoftware}
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                  ) : (
                    <div>
                      <p className="text-sm font-medium text-muted-foreground">תוכנת דיווח</p>
                      <p className="text-base">{authority.reportingSoftware}</p>
                    </div>
                  )}

                  {/* Contact Info */}
                  <div className="flex flex-wrap gap-4 pt-2">
                    <a
                      href={`mailto:${authority.contactEmail}`}
                      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <Mail className="h-4 w-4" />
                      {authority.contactEmail}
                    </a>
                    {authority.phoneNumber && (
                      <a
                        href={`tel:${authority.phoneNumber}`}
                        className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {authority.phoneNumber}
                      </a>
                    )}
                  </div>

                  {/* Notes */}
                  {authority.notes && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-muted-foreground">{authority.notes}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
