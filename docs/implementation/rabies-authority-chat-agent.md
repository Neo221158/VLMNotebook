# Rabies Authority Search System - Implementation Guide

**Version:** 2.0 (Simple Search Implementation)
**Last Updated:** 2025-11-19
**Status:** ✅ FULLY COMPLETE - Simple Search Page Deployed

---

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Completed Work](#completed-work)
4. [Implementation Summary](#implementation-summary)
5. [Testing Guide](#testing-guide)
6. [Admin Management](#admin-management)

---

## Overview

### What This Feature Does

A fast, reliable search page that helps users find rabies reporting authorities by city or region. Users type to search and get instant results from a PostgreSQL database with:

1. Veterinarian name
2. Reporting software (with clickable URL)
3. Contact email (clickable to send)
4. Phone number (clickable to call)
5. Additional notes

### User Flow

1. User navigates to `/rabies-search` page
2. Types city name in Hebrew or English (e.g., "תל אביב" or "Tel Aviv")
3. Gets instant filtered results as they type
4. Clicks on email/phone to contact directly
5. Clicks software link to access reporting system

### Admin Flow

1. Admin can bulk import data via `/admin/import-rabies` (CSV upload)
2. Admin manages individual records via `/admin/rabies-authorities`
3. Admin can add/edit/delete authorities with full CRUD interface

---

## Architecture

### Implementation Choice: Simple Search (No AI)

**Why we chose this approach:**
- ✅ **100% Reliable** - No AI uncertainty or function calling issues
- ✅ **Instant Results** - No API latency, direct database query
- ✅ **Zero Cost** - No AI API calls needed
- ✅ **Better UX** - Real-time filtering as user types
- ✅ **Hebrew Support** - Native support, no translation issues

**Alternatives considered:**
- ❌ AI Chat Agent with function calling - Type incompatibility with Google Gemini
- ❌ Embedding data in system prompt - Too expensive (16,500+ tokens per request)
- ❌ Switching to OpenAI - Requires different setup, still uncertain

### Current Architecture

### Data Flow

```
User Types → Client-Side Filter → Display Results
         ↓
    API Call (on load) → PostgreSQL Query → All Authorities → Client
```

**Admin Data Management:**
```
CSV Import → Parse → Preview → Bulk Insert → Database
Manual CRUD → API Routes → Database Updates
```

### Database Schema

**Table:** `rabies_authorities`

```sql
CREATE TABLE rabies_authorities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  city TEXT NOT NULL,
  region TEXT,
  veterinarian_name TEXT NOT NULL,
  reporting_software TEXT NOT NULL,
  software_url TEXT,  -- NEEDS TO BE ADDED
  contact_email TEXT NOT NULL,
  phone_number TEXT,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

CREATE INDEX rabies_authorities_city_idx ON rabies_authorities(city);
CREATE INDEX rabies_authorities_region_idx ON rabies_authorities(region);
```

### Component Architecture

```
/rabies-search (User-facing search page)
  └─ RabiesSearchClient (Client component)
      ├─ Search input with real-time filtering
      ├─ API call to fetch all authorities (on load)
      ├─ Client-side filtering as user types
      └─ Card-based results display
          ├─ Clickable software URLs
          ├─ Clickable email (mailto:)
          └─ Clickable phone (tel:)

/api/rabies-search (Public API)
  └─ GET: Fetch all authorities from PostgreSQL
  └─ Supports optional ?q= query parameter
  └─ Returns JSON with authorities array

/admin/rabies-authorities (Admin CRUD interface)
  └─ RabiesAuthoritiesManager (Client component)
      ├─ List all 165 authorities in table
      ├─ Add new authority
      ├─ Edit existing authority
      └─ Delete authority

/api/admin/rabies-authorities (Admin API)
  ├─ GET: List all authorities
  ├─ POST: Create new authority
  ├─ PATCH /[id]: Update authority
  └─ DELETE /[id]: Delete authority
```

---

## Completed Work

### ✅ Phase 1: Database Setup (DONE)

**Files Modified:**
- `src/lib/schema.ts` - Added `rabiesAuthorities` table definition

**Database Status:**
- Table created: `rabies_authorities`
- Migration applied: `drizzle/0005_plain_meteorite.sql`
- Indexes created: `city_idx`, `region_idx`

**What's Working:**
- Database table is ready to receive data
- Indexes will make city/region searches fast

**⚠️ Missing:** `software_url` column not yet added

---

### ✅ Phase 2: PDF Import System (DONE)

**Files Created:**

1. **`src/app/api/admin/import-rabies-pdf/route.ts`**
   - POST endpoint for PDF upload
   - Uses Gemini AI to extract structured data
   - Admin-only (checks user role)
   - Returns extracted records as JSON
   - Max file size: 100MB

2. **`src/app/api/admin/import-rabies-bulk/route.ts`**
   - POST endpoint to save extracted records
   - Validates all fields before inserting
   - Option to replace existing data
   - Admin-only
   - Batch insert for performance

3. **`src/app/admin/import-rabies/page.tsx`**
   - Server component wrapper
   - Requires admin authentication

4. **`src/components/admin/import-rabies-client.tsx`**
   - Full-featured import UI
   - File upload with validation
   - AI extraction with progress indicator
   - Editable preview table
   - Two import options: "Add to Existing" or "Replace All Data"

**What's Working:**
- Admin can upload PDF
- AI extracts data automatically
- Admin can review/edit before importing
- Data saves to database successfully

**Known Issues:**
- Software URL field not in schema yet (will be null)

---

### ✅ Phase 3: Add Software URL Field (DONE)

**What Was Completed:**

1. **Updated Database Schema** - Added `softwareUrl` field to `rabiesAuthorities` table in `src/lib/schema.ts`
2. **Generated Migration** - Created migration `drizzle/0006_lonely_la_nuit.sql`
3. **Applied Migration** - Successfully migrated database to add the new column
4. **Updated API Schemas**:
   - Added `softwareUrl` to PDF extraction schema in `src/app/api/admin/import-rabies-pdf/route.ts`
   - Added `softwareUrl` to bulk import schema in `src/app/api/admin/import-rabies-bulk/route.ts`
   - Updated AI extraction prompt to look for software URLs in PDFs
5. **Updated UI Component**:
   - Added "Software URL" column to preview table in `src/components/admin/import-rabies-client.tsx`
   - Added editable URL input field for manual corrections
6. **Additional Fixes**:
   - Added missing `table` component from shadcn/ui
   - Fixed FilePart structure (changed `mimeType` to `mediaType` for AI SDK v5)
   - Fixed TypeScript issues in check-production-files.ts

**Status:** All lint and typecheck validations pass ✅

---

### ✅ Data Import Completed (2025-11-19)

**Alternative Approach:** Instead of using the web UI PDF import, we created a direct CSV import script.

**What Was Done:**

1. **CSV Data Prepared:** `/home/nir_ohana/VLMNotebook/docs/implementation/Rabies list final.csv`
   - Contains 165 rabies authorities across Israel
   - Hebrew text data with 4 columns: רשות, רופא רשותי, תוכנת דיווח, מייל מחלקה
   - Python data structure format

2. **Import Script Created:** `src/scripts/import-rabies-data.ts`
   - Parses Hebrew CSV data
   - Maps columns to database schema:
     - רשות → city
     - רופא רשותי → veterinarianName
     - תוכנת דיווח → reportingSoftware
     - מייל מחלקה → contactEmail
   - Auto-generates software URLs:
     - דוקטורט → `https://www.shvav.org/user/login` (108 authorities)
     - וטקליק → `https://vetclick.co.il/Login.aspx?ReturnUrl=%2f` (49 authorities)
     - פריזה → null (5 authorities)
     - סורין → null (1 authority)
   - Handles missing emails with placeholder format
   - Clears existing data before import

3. **Production Database Migration:**
   - Ran migrations on Neon PostgreSQL production database
   - Created `rabies_authorities` table with all required fields including `software_url`

4. **Data Successfully Imported:**
   - **165 records** imported into production Neon database
   - All Hebrew city names preserved
   - Software URLs automatically mapped
   - 3 records with missing emails got placeholder emails with notes

**Usage:**
```bash
POSTGRES_URL="your-neon-url" npx tsx src/scripts/import-rabies-data.ts
```

**Database Summary:**
- Table: `rabies_authorities`
- Records: 165
- Software Distribution:
  - דוקטורט (Doctorת): 108 authorities with link
  - וטקליק (VetClick): 49 authorities with link
  - פריזה (Freeza): 5 authorities, no link
  - סורין (Surin): 1 authority, no link
  - Empty: 2 authorities, no link

---

### ✅ Phase 4: Simple Search Page Implementation (DONE)

**Date Completed:** 2025-11-19

**Decision:** After attempting AI chat agent integration, we chose a simple, reliable search page for better UX and reliability.

**Files Created:**

1. **`src/app/api/rabies-search/route.ts`** - Public search API
   - GET endpoint returns all authorities from database
   - Supports optional `?q=` query parameter
   - Orders results by city name
   - No authentication required (public data)

2. **`src/app/rabies-search/page.tsx`** - Search page wrapper
   - Server component that renders client component
   - Public route (no auth required)

3. **`src/components/rabies-search/rabies-search-client.tsx`** - Main search UI
   - Loads all 165 authorities on mount
   - Real-time client-side filtering as user types
   - Searches across city, region, veterinarian, and software fields
   - Card-based results display with:
     - City name and region
     - Veterinarian name
     - Software badge with clickable URL
     - Clickable email (mailto:)
     - Clickable phone (tel:)
     - Notes display if present
   - Fully responsive, supports Hebrew text
   - Dark mode compatible

**Navigation Updated:**
- Added "Rabies Search" link to main site header (`src/components/site-header.tsx`)
- Visible to all users (not admin-only)

**Features:**
- ⚡ **Instant Results** - Client-side filtering, no server round-trips
- 🔍 **Smart Search** - Filters by city, region, vet name, or software
- 🌐 **Hebrew Support** - Native Hebrew text, RTL-aware
- 📱 **Mobile Friendly** - Responsive design
- 🎨 **Beautiful UI** - Card-based layout with badges and icons
- 🔗 **Clickable Actions** - Email, phone, and software URLs all clickable

**Testing:**
- ✅ All lint rules pass
- ✅ TypeScript validation passes
- ✅ Tested with Hebrew queries (e.g., "תל אביב")
- ✅ Tested with English queries (e.g., "Jerusalem")
- ✅ Verified 165 authorities loaded correctly

---

## Implementation Summary

### All Completed Phases

**Phase 1:** Database Setup ✅
- Created `rabies_authorities` table with all required fields
- Added indexes for fast city/region search
- Includes `software_url` field

**Phase 2:** Data Import System ✅
- CSV import script created
- 165 records imported successfully
- Hebrew city names preserved
- Software URLs auto-mapped

**Phase 3:** Admin CRUD Interface ✅
- Full table view of all authorities
- Add/Edit/Delete functionality
- Admin-only access control

**Phase 4:** Simple Search Page ✅
- Fast, reliable search interface
- Real-time filtering
- Beautiful, responsive UI
- Hebrew support

---

## Legacy Section: Original AI Chat Plan (Not Implemented)

The following sections document the original plan to build an AI chat agent. This approach was **not implemented** due to:
- Type incompatibilities between AI SDK and Google Gemini
- Function calling complexity
- Unreliable AI responses
- Higher costs and latency

**Instead, we built a simple search page (Phase 4 above) which provides:**
- 100% reliability
- Instant results
- Zero AI costs
- Better user experience

### 🚫 Original Phase 4 Plan: Create Database Query Tool (NOT DONE)

**Step 1: Update Database Schema**

**File:** `src/lib/schema.ts`

Find the `rabiesAuthorities` table definition and add:

```typescript
export const rabiesAuthorities = pgTable("rabies_authorities", {
  id: uuid("id").defaultRandom().primaryKey(),
  city: text("city").notNull(),
  region: text("region"),
  veterinarianName: text("veterinarian_name").notNull(),
  reportingSoftware: text("reporting_software").notNull(),
  softwareUrl: text("software_url"), // ADD THIS LINE
  contactEmail: text("contact_email").notNull(),
  phoneNumber: text("phone_number"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at")
    .defaultNow()
    .$onUpdate(() => new Date())
    .notNull(),
}, (table) => ({
  cityIdx: index("rabies_authorities_city_idx").on(table.city),
  regionIdx: index("rabies_authorities_region_idx").on(table.region),
}));
```

**Step 2: Generate Migration**

```bash
pnpm db:generate
```

**Step 3: Apply Migration**

```bash
pnpm db:migrate
```

**Step 4: Update Import API Schema**

**File:** `src/app/api/admin/import-rabies-pdf/route.ts`

Add to `extractedAuthoritySchema`:

```typescript
const extractedAuthoritySchema = z.object({
  city: z.string().describe("City name as it appears in the document"),
  region: z.string().nullable().describe("Region name if specified"),
  veterinarianName: z.string().describe("Full name of the regional veterinarian"),
  reportingSoftware: z.string().describe("Name of the reporting software used"),
  softwareUrl: z.string().url().nullable().describe("URL for the reporting software"), // ADD THIS
  contactEmail: z.string().email().describe("Contact email address"),
  phoneNumber: z.string().nullable().describe("Phone number if available"),
  notes: z.string().nullable().describe("Any additional notes or information"),
});
```

**File:** `src/app/api/admin/import-rabies-bulk/route.ts`

Add to `importRecordSchema`:

```typescript
const importRecordSchema = z.object({
  city: z.string().min(1, "City is required"),
  region: z.string().nullable(),
  veterinarianName: z.string().min(1, "Veterinarian name is required"),
  reportingSoftware: z.string().min(1, "Reporting software is required"),
  softwareUrl: z.string().url().nullable(), // ADD THIS
  contactEmail: z.string().email("Invalid email format"),
  phoneNumber: z.string().nullable(),
  notes: z.string().nullable(),
});
```

Add to insert statement:

```typescript
const insertedRecords = await db
  .insert(rabiesAuthorities)
  .values(
    records.map((record) => ({
      city: record.city,
      region: record.region,
      veterinarianName: record.veterinarianName,
      reportingSoftware: record.reportingSoftware,
      softwareUrl: record.softwareUrl, // ADD THIS
      contactEmail: record.contactEmail,
      phoneNumber: record.phoneNumber,
      notes: record.notes,
    }))
  )
  .returning();
```

**File:** `src/components/admin/import-rabies-client.tsx`

Add to `ExtractedRecord` interface:

```typescript
interface ExtractedRecord {
  city: string;
  region: string | null;
  veterinarianName: string;
  reportingSoftware: string;
  softwareUrl: string | null; // ADD THIS
  contactEmail: string;
  phoneNumber: string | null;
  notes: string | null;
}
```

Add column to table:

```tsx
<TableHeader>
  <TableRow>
    <TableHead className="w-[100px]">#</TableHead>
    <TableHead>City</TableHead>
    <TableHead>Region</TableHead>
    <TableHead>Veterinarian</TableHead>
    <TableHead>Software</TableHead>
    <TableHead>Software URL</TableHead> {/* ADD THIS */}
    <TableHead>Email</TableHead>
    <TableHead>Phone</TableHead>
  </TableRow>
</TableHeader>
```

Add cell in tbody map:

```tsx
<TableCell>
  <Input
    type="url"
    value={record.softwareUrl || ""}
    onChange={(e) => handleEditCell(index, "softwareUrl", e.target.value)}
    placeholder="https://..."
    className="min-w-[200px]"
  />
</TableCell>
```

---

### 🚧 Phase 4: Create Database Query Tool

**New File:** `src/lib/tools/search-rabies-authority.ts`

```typescript
import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { ilike, or } from "drizzle-orm";
import { z } from "zod";

/**
 * Tool for AI to search rabies authority database by city or region
 */
export const searchRabiesAuthorityTool = {
  description: "Search for rabies reporting authority information by city or region name. Use this when the user asks about a specific location.",

  parameters: z.object({
    query: z.string().describe("The city or region name to search for")
  }),

  execute: async ({ query }: { query: string }) => {
    try {
      // Search database with case-insensitive matching
      const results = await db
        .select()
        .from(rabiesAuthorities)
        .where(
          or(
            ilike(rabiesAuthorities.city, `%${query}%`),
            ilike(rabiesAuthorities.region, `%${query}%`)
          )
        )
        .limit(5);

      if (results.length === 0) {
        return {
          found: false,
          message: `No rabies authority found for "${query}". The city or region may not be in our database. Please check the spelling or try a nearby city.`
        };
      }

      // Return formatted results
      return {
        found: true,
        count: results.length,
        authorities: results.map(r => ({
          city: r.city,
          region: r.region,
          veterinarianName: r.veterinarianName,
          reportingSoftware: r.reportingSoftware,
          softwareUrl: r.softwareUrl,
          contactEmail: r.contactEmail,
          phoneNumber: r.phoneNumber,
          notes: r.notes
        }))
      };
    } catch (error) {
      return {
        found: false,
        error: true,
        message: "Failed to search database. Please try again."
      };
    }
  }
};
```

---

### 🚧 Phase 5: Update Agent Configuration

**File:** `src/lib/mock-data/agents.ts`

Find the rabies-auth-finder entry and update it:

```typescript
{
  id: "rabies-auth-finder",
  name: "Rabies Authority Finder",
  description: "Chat with an AI assistant to find rabies reporting authorities, veterinarians, and contact information by city or region. Get instant access to reporting software, email contacts, and phone numbers.",
  icon: "🏛️",
  category: "Veterinary & Public Health",
  tags: ["Rabies", "Veterinary", "Public Health", "Authorities", "Database"],
  useCases: [
    "Find rabies reporting authority for any city in Israel",
    "Get regional veterinarian contact information",
    "Find out which reporting software is used in your area",
    "Access email and phone contacts for rabies authorities"
  ],
  sampleQuestions: [
    "What's the rabies authority in Tel Aviv?",
    "Who handles rabies reporting in Jerusalem?",
    "How do I contact the veterinarian for Haifa?",
    "What software does Be'er Sheva use for rabies reporting?",
    "Give me the contact info for the Eilat rabies authority"
  ],
  color: "blue",
  fileSearchEnabled: false, // This is database-backed, not File Search
}
```

---

### 🚧 Phase 6: Update Agent System Prompt

**File:** `src/lib/agent-prompts.ts`

Replace the entire rabies-auth-finder prompt with:

```typescript
"rabies-auth-finder": {
  agentId: "rabies-auth-finder",
  persona: "Helpful Public Health Information Assistant",
  capabilities: [
    "Search rabies authority database by city or region",
    "Provide veterinarian contact information",
    "Share reporting software details with links",
    "Give email and phone contacts"
  ],
  tone: "Friendly, helpful, informative",
  instructions: `You are a helpful assistant that helps users find rabies reporting authorities in Israel.

When a user asks about a specific city or region, use the searchRabiesAuthority tool to look up information from the database.

Key Responsibilities:
- Search the database when users ask about a city or region
- Provide clear, formatted responses with all available information
- Include clickable software links when available
- Be helpful even when data is not found (suggest checking spelling or nearby cities)
- Handle follow-up questions naturally

Communication Style:
- Be friendly and conversational
- Format responses clearly with the doctor's name, software (with link), and contact info
- If multiple results found, present them clearly
- If no results found, be helpful and suggest alternatives`,

  systemPrompt: `You are a helpful assistant for finding rabies reporting authorities in Israel.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔧 TOOL USAGE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

You have access to the searchRabiesAuthority tool that queries a PostgreSQL database.

When to use the tool:
- User asks about a specific city (e.g., "Tel Aviv", "Jerusalem")
- User asks about a region (e.g., "Central District")
- User wants contact information for an area
- User asks "what software does [city] use?"

How to use the tool:
- Extract the city/region name from the user's question
- Call searchRabiesAuthority with the query parameter
- The tool returns authority information or "not found" message

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💬 RESPONSE FORMATTING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

When you receive results from the tool:

**Single Result:**
"The rabies authority in [City] is **[Veterinarian Name]**.

They use [Software Name] for reporting ([link to software](url)).

📧 Email: [email@example.com]
📱 Phone: [phone number] (if available)

[Include any additional notes if present]"

**Multiple Results:**
"I found [X] authorities matching '[query]':

**1. [City 1]**
- Veterinarian: [Name]
- Software: [Software Name] ([link](url))
- Contact: [email] | [phone]

**2. [City 2]**
- Veterinarian: [Name]
- Software: [Software Name] ([link](url))
- Contact: [email] | [phone]

Which one would you like more details about?"

**No Results:**
"I couldn't find a rabies authority for '[query]' in our database.

This could mean:
- The city name might be spelled differently
- The area might be covered by a nearby city
- The data hasn't been added yet

Try searching for a nearby city or region, or contact the Ministry of Health."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✅ BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DO:
- Always use the tool when asked about a specific location
- Format software links as Markdown: [Software Name](url)
- Include all available contact information
- Be conversational and helpful
- Offer to search for other cities if the user needs

DON'T:
- Make up information not returned by the tool
- Provide general rabies information unless asked
- Ignore the tool results
- Skip formatting the response nicely

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 EXAMPLE INTERACTIONS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

User: "What's the rabies authority in Tel Aviv?"
Assistant: *Calls searchRabiesAuthority with query="Tel Aviv"*
Assistant: "The rabies authority in Tel Aviv is **Dr. Sarah Cohen**.

They use VetReport Pro for reporting ([VetReport Pro](https://vetreport.com)).

📧 Email: sarah.cohen@health.gov.il
📱 Phone: +972-3-1234567"

User: "Thanks! What about Jerusalem?"
Assistant: *Calls searchRabiesAuthority with query="Jerusalem"*
...

Target Audience: Veterinarians, public health officials, pet owners, and anyone needing to report rabies cases.`
}
```

---

### 🚧 Phase 7: Integrate Tool with Chat API

**File:** `src/app/api/chat/route.ts`

**Step 1:** Import the tool at the top of the file:

```typescript
import { searchRabiesAuthorityTool } from "@/lib/tools/search-rabies-authority";
```

**Step 2:** Find where tools are configured (around line 60-80). Update the tool configuration section:

```typescript
// Get system prompt for agent (if agentId provided)
let systemPrompt = "";
let tools = undefined;
let fileSearchStore = undefined;

if (agentId) {
  systemPrompt = getSystemPromptText(agentId);

  // Special handling for rabies authority agent
  if (agentId === "rabies-auth-finder") {
    // Database-backed agent uses custom tool
    tools = {
      searchRabiesAuthority: searchRabiesAuthorityTool
    };

    logger.info("Rabies authority agent with database tool", { agentId });
  } else {
    // Other agents may use File Search
    try {
      fileSearchStore = await getStoreByAgentId(agentId);
      logger.info("File Search store available", { storeId: fileSearchStore.storeId, agentId });

      tools = {
        file_search: google.tools.fileSearch({
          fileSearchStoreNames: [fileSearchStore.storeId],
          topK: 10,
        }),
      };
    } catch (error) {
      logger.error("Error getting File Search store", { error, agentId });
    }
  }
}
```

**Step 3:** Ensure tools are passed to streamText (should already be there):

```typescript
const result = streamText({
  model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
  messages: convertedMessages,
  system: systemPrompt || undefined,
  tools: tools || undefined, // This passes our database tool
  // ... rest of config
});
```

---

### 🚧 Phase 8: Remove Old Search Form Implementation

Delete these files:

```bash
rm src/app/rabies-search/page.tsx
rm -r src/components/rabies-search/
rm src/lib/schemas/rabies-authority.ts
rm src/app/api/rabies-search/route.ts
rm docs/setup/rabies-pdf-upload.md
```

**File:** `src/components/site-header.tsx`

Remove the "Rabies Search" nav link:

```typescript
// REMOVE THIS BLOCK:
{session && (
  <Link
    href="/rabies-search"
    className="text-foreground/60 hover:text-foreground transition-colors"
  >
    Rabies Search
  </Link>
)}
```

---

### 🚧 Phase 9: Add Admin CRUD Interface (Optional but Recommended)

This allows admins to edit individual records, add software URLs manually, and manage the database without re-importing.

**Step 1: Create List API**

**New File:** `src/app/api/admin/rabies-authorities/route.ts`

```typescript
import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { z } from "zod";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET - List all authorities
export async function GET(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const authorities = await db
      .select()
      .from(rabiesAuthorities)
      .orderBy(desc(rabiesAuthorities.createdAt));

    return new Response(JSON.stringify({ authorities }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch authorities" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// POST - Create new authority
const createSchema = z.object({
  city: z.string().min(1),
  region: z.string().nullable(),
  veterinarianName: z.string().min(1),
  reportingSoftware: z.string().min(1),
  softwareUrl: z.string().url().nullable(),
  contactEmail: z.string().email(),
  phoneNumber: z.string().nullable(),
  notes: z.string().nullable(),
});

export async function POST(req: Request) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validatedData = createSchema.parse(body);

    const [created] = await db
      .insert(rabiesAuthorities)
      .values(validatedData)
      .returning();

    return new Response(JSON.stringify({ authority: created }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid data", details: error.errors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to create authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
```

**Step 2: Create Single Record API**

**New File:** `src/app/api/admin/rabies-authorities/[id]/route.ts`

```typescript
import { db } from "@/lib/db";
import { rabiesAuthorities } from "@/lib/schema";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import type { User } from "@/lib/types";
import { z } from "zod";
import { eq } from "drizzle-orm";

export const dynamic = "force-dynamic";

// GET - Get single authority
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [authority] = await db
      .select()
      .from(rabiesAuthorities)
      .where(eq(rabiesAuthorities.id, params.id));

    if (!authority) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ authority }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to fetch authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// PATCH - Update authority
const updateSchema = z.object({
  city: z.string().min(1).optional(),
  region: z.string().nullable().optional(),
  veterinarianName: z.string().min(1).optional(),
  reportingSoftware: z.string().min(1).optional(),
  softwareUrl: z.string().url().nullable().optional(),
  contactEmail: z.string().email().optional(),
  phoneNumber: z.string().nullable().optional(),
  notes: z.string().nullable().optional(),
});

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const validatedData = updateSchema.parse(body);

    const [updated] = await db
      .update(rabiesAuthorities)
      .set({ ...validatedData, updatedAt: new Date() })
      .where(eq(rabiesAuthorities.id, params.id))
      .returning();

    if (!updated) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ authority: updated }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(
        JSON.stringify({ error: "Invalid data", details: error.errors }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }
    return new Response(
      JSON.stringify({ error: "Failed to update authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}

// DELETE - Delete authority
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth.api.getSession({ headers: await headers() });
    const user = session?.user as User;

    if (!user || user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    const [deleted] = await db
      .delete(rabiesAuthorities)
      .where(eq(rabiesAuthorities.id, params.id))
      .returning();

    if (!deleted) {
      return new Response(JSON.stringify({ error: "Authority not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Failed to delete authority" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
```

**Step 3: Create Management Page**

**New File:** `src/app/admin/rabies-authorities/page.tsx`

```typescript
import { requireAdmin } from "@/lib/auth-helpers";
import { RabiesAuthoritiesManager } from "@/components/admin/rabies-authorities-manager";

export default async function RabiesAuthoritiesPage() {
  await requireAdmin();
  return <RabiesAuthoritiesManager />;
}
```

**Step 4: Create Manager Component**

**New File:** `src/components/admin/rabies-authorities-manager.tsx`

```typescript
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
    } catch (error) {
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
    } catch (error) {
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
    } catch (error) {
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
```

---

### 🚧 Phase 10: Update Navigation

**File:** `src/components/site-header.tsx`

Add admin link for managing authorities:

```typescript
{/* Documents link - admin only */}
{isAdmin && (
  <>
    <Link
      href="/documents"
      className="text-foreground/60 hover:text-foreground transition-colors"
    >
      Documents
    </Link>
    <Link
      href="/admin/rabies-authorities"
      className="text-foreground/60 hover:text-foreground transition-colors"
    >
      Rabies Authorities
    </Link>
  </>
)}
```

---

## Testing Guide

### Test 1: Search Page Functionality

1. Go to `/rabies-search`
2. Verify page loads with all 165 authorities displayed
3. Try searching for a city (e.g., "תל אביב" or "Jerusalem")
4. Verify results filter in real-time as you type
5. Check that results show:
   - City name and region
   - Veterinarian name
   - Reporting software (with clickable link if URL exists)
   - Contact email (clickable mailto link)
   - Phone number (clickable tel link if exists)
   - Notes (if any)

**Expected Result:** Instant filtering with matching results

### Test 2: Hebrew Text Support

1. In search box, type Hebrew text: "תל אביב"
2. Verify Hebrew displays correctly (RTL)
3. Check that search works with Hebrew characters
4. Try mixed Hebrew/English search

**Expected Result:** Proper Hebrew rendering and search functionality

### Test 3: Empty State

1. Search for a non-existent city: "Atlantis"
2. Verify "no results" message appears in Hebrew
3. Check that suggestion to try another search is shown

**Expected Result:** Helpful empty state message

### Test 4: Database Verification

1. Open PostgreSQL client or Drizzle Studio
2. Run: `SELECT * FROM rabies_authorities;`
3. Verify 165 records are present with all fields

**Expected Result:** See all imported data

### Test 5: Admin CRUD Operations

1. Go to `/admin/rabies-authorities` (must be admin)
2. View list of all authorities in table format
3. Click "Edit" on a record
4. Change software URL or notes
5. Save changes
6. Go back to `/rabies-search`
7. Search for that city
8. Verify updated information appears

**Expected Result:** Changes immediately visible in search page

### Test 6: Navigation

1. Verify "Rabies Search" link appears in site header
2. Click the link
3. Verify it navigates to `/rabies-search`
4. Check that link is visible to all users (not admin-only)

**Expected Result:** Public access to search page

---

## Troubleshooting

### Issue: Search page shows no results

**Symptoms:** Search page is empty or shows 0 authorities

**Solutions:**
1. Check database has data: `SELECT COUNT(*) FROM rabies_authorities;`
2. Check API endpoint returns data: Open `/api/rabies-search` in browser
3. Check browser console for errors
4. Verify `POSTGRES_URL` environment variable is set correctly
5. Run `pnpm db:migrate` to ensure schema is up to date

### Issue: Search not filtering correctly

**Symptoms:** Search doesn't find cities that exist

**Solutions:**
1. Check spelling matches database records
2. Try searching in Hebrew if city name is Hebrew
3. Clear search box and start fresh
4. Check browser console for JavaScript errors
5. Verify `filteredAuthorities` state is updating (React DevTools)

### Issue: Hebrew text displays incorrectly

**Symptoms:** Hebrew characters appear as boxes or question marks

**Solutions:**
1. Check browser encoding is set to UTF-8
2. Verify database charset is UTF-8
3. Check `POSTGRES_URL` includes `?sslmode=require`
4. Test in different browser
5. Verify font supports Hebrew characters

### Issue: Links not clickable

**Symptoms:** Email, phone, or software URLs don't open

**Solutions:**
1. Check database has valid data in those fields
2. Verify URL format is correct (include `http://` or `https://`)
3. Check browser console for errors
4. Inspect HTML to verify `<a>` tags are rendered
5. Test with different authority that has known working links

### Issue: Admin page not accessible

**Symptoms:** 403 Forbidden when accessing `/admin/rabies-authorities`

**Solutions:**
1. Verify you are logged in
2. Check user role in database: `SELECT email, role FROM user;`
3. Run `pnpm seed:admin` to make your account admin
4. Check `ADMIN_EMAIL` environment variable matches your email
5. Clear browser cache and cookies, then log in again

### Issue: Migration fails

**Symptoms:** Error when running `pnpm db:migrate`

**Solutions:**
1. Check `POSTGRES_URL` environment variable
2. Verify database connection
3. Check for syntax errors in `schema.ts`
4. Try `pnpm db:push` for development
5. Check migration file in `drizzle/` folder
6. Verify PostgreSQL version compatibility (needs 12+)

---

## Quick Command Reference

```bash
# Database
pnpm db:generate      # Generate migration from schema changes
pnpm db:migrate       # Apply migrations to database
pnpm db:push          # Push schema directly (dev only)
pnpm db:studio        # Open Drizzle Studio GUI

# Development
pnpm dev             # Start dev server
pnpm lint            # Run linter
pnpm typecheck       # Run TypeScript checker
pnpm build           # Build for production

# Testing
# (In PostgreSQL or Drizzle Studio)
SELECT * FROM rabies_authorities;
SELECT city, veterinarian_name, software_url FROM rabies_authorities WHERE city ILIKE '%tel aviv%';
```

---

## File Checklist

### ✅ Created (Phase 1-3: Database & Import)
- [x] `src/lib/schema.ts` - Database schema with rabiesAuthorities table
- [x] `src/app/api/admin/import-rabies-pdf/route.ts` - PDF extraction API
- [x] `src/app/api/admin/import-rabies-bulk/route.ts` - Bulk import API
- [x] `src/app/admin/import-rabies/page.tsx` - Import page
- [x] `src/components/admin/import-rabies-client.tsx` - Import UI
- [x] `src/scripts/import-rabies-data.ts` - Initial data import (165 records)

### ✅ Created (Phase 4: Simple Search Implementation)
- [x] `src/app/api/rabies-search/route.ts` - Public search API endpoint
- [x] `src/app/rabies-search/page.tsx` - Search page (Server Component)
- [x] `src/components/rabies-search/rabies-search-client.tsx` - Search UI with filtering
- [x] `src/components/site-header.tsx` - Updated with "Rabies Search" link

### ✅ Created (Admin CRUD - Optional)
- [x] `src/app/api/admin/rabies-authorities/route.ts` - CRUD list API (GET/POST)
- [x] `src/app/api/admin/rabies-authorities/[id]/route.ts` - CRUD single API (GET/PATCH/DELETE)
- [x] `src/app/admin/rabies-authorities/page.tsx` - Admin management page
- [x] `src/components/admin/rabies-authorities-manager.tsx` - Admin management UI

### 🗑️ Not Created (Legacy AI Chat Plan)
- ❌ `src/lib/tools/search-rabies-authority.ts` - Not needed (no AI function calling)
- ❌ AI agent configuration updates - Not needed (using simple search instead)
- ❌ AI system prompt updates - Not needed (no AI involved)

---

## Deployment Checklist

Before deploying to production:

- [ ] Run database migrations on production DB
- [ ] Verify 165 rabies authority records are imported
- [ ] Test search page with various queries (Hebrew and English)
- [ ] Test mobile responsiveness (search should work on small screens)
- [ ] Verify all links work (email, phone, software URLs)
- [ ] Check Hebrew text displays correctly
- [ ] Test empty state (search with no results)
- [ ] Verify search loads quickly (should be instant with client-side filtering)
- [ ] Test admin CRUD interface (if using)
- [ ] Check authentication for admin routes
- [ ] Test with non-admin users (should see search, not admin pages)
- [ ] Verify "Rabies Search" navigation link appears
- [ ] Check error handling for API failures
- [ ] Test with slow network (ensure loading states work)

---

## Future Enhancements

**Potential additions:**
1. **Advanced Filtering:** Add filters for region, software type, or veterinarian
2. **Sorting Options:** Allow sorting by city name, region, or software
3. **Search History:** Track popular searches (analytics)
4. **Export Functionality:** Download search results as CSV/PDF
5. **Map View:** Display authorities on an interactive map
6. **Bulk Edit:** Update multiple records at once (admin)
7. **Import from Excel:** Upload spreadsheet with authority data
8. **API for Third-Party:** Public API endpoint for external integrations
9. **Email Notifications:** Alert admins when data changes
10. **Audit Log:** Track who changed what and when
11. **Multi-Language:** Add English/Arabic translations for UI

---

## Support

**Common Questions:**

**Q: How do I become an admin?**
A: Run `pnpm seed:admin` with `ADMIN_EMAIL` environment variable set to your email

**Q: How do I add more authorities to the database?**
A: Use the admin CRUD interface at `/admin/rabies-authorities` or import via script

**Q: Can I use this without the admin interface?**
A: Yes! The search page at `/rabies-search` is public and works independently

**Q: How do I backup the data?**
A: Export from PostgreSQL: `pg_dump -t rabies_authorities > backup.sql`

**Q: What if I want to add more fields (like fax number)?**
A: Update `src/lib/schema.ts`, generate migration, update UI components

**Q: Can I integrate this with an external system?**
A: Yes! Use the API endpoint `/api/rabies-search?q=cityname` for integration

**Q: How do I update multiple records at once?**
A: Use the admin interface or write a custom script with Drizzle ORM queries

---

**End of Implementation Guide**
