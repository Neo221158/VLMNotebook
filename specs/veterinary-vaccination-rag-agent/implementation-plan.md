# Veterinary Vaccination RAG Agent - Implementation Plan

**Feature:** Veterinary Vaccination RAG Agent
**Version:** 1.1
**Last Updated:** 2025-11-15
**Status:** ✅ Core Features Complete, Pending Admin UI Restrictions

---

## Current Status Summary

### ✅ Completed
- Phase 1: Gemini File Search Integration ✅ COMPLETE
- **Document-Only RAG Configuration** ✅ COMPLETE (2025-11-15)
  - System prompts updated to enforce document-only responses
  - Agent will refuse to use general knowledge
  - Explicit instructions added to only answer from uploaded veterinary guidelines

### 🔄 In Progress
- Phase 2: Citations Extraction & Display (75% complete via dedicated spec)

### ✅ Prerequisites Complete
- RAG infrastructure (File Search stores, database schema)
- Better Auth security implementation
- Base chat interface
- Document upload API endpoints

### 📊 Progress
**1.5 of 8 phases complete (19%)** - Core RAG functionality working

---

## Implementation Overview

This plan transforms the existing RAG Agent Chat SaaS into a specialized veterinary vaccination guidelines assistant. The focus is on integrating Google Gemini File Search, implementing citations, and restricting document uploads to admin users only.

**Total Estimated Time:** 8-12 hours

---

## Phase 1: Gemini File Search Integration ✅ COMPLETE

**Goal:** Connect Gemini File Search to chat API for document-grounded responses
**Estimated Time:** 1.5-2 hours
**Priority:** 🔴 Critical
**Status:** ✅ COMPLETE (2025-11-14)

### Tasks

#### 1.1: Update Chat API with File Search Tool ✅

- [x] Open `src/app/api/chat/route.ts`
- [x] Import File Search tool from Vercel AI SDK
  ```typescript
  import { google } from '@ai-sdk/google';
  ```
- [x] Replace TODO block (lines 61-70) with File Search configuration
- [x] Add `google.tools.fileSearch()` configuration:
  - [x] Pass `fileSearchStoreNames: [store.storeId]`
  - [x] Set `topK: 8` for retrieval
- [x] Add File Search tool to `streamText` configuration
- [x] Enable grounding metadata via `experimental_providerMetadata`
- [x] Add fallback logic if store doesn't exist (continue without File Search)
- [x] Remove console.log, use logger instead

#### 1.2: Test File Search Integration ✅

- [x] Ensure File Search store exists for test agent
- [x] Run `pnpm init:stores` if needed
- [x] Upload test document to verify indexing
- [x] Ask test question requiring document knowledge
- [x] Verify response uses document content
- [x] Check for any API errors in logs

### Verification Checklist ✅

- [x] Chat API accepts agentId in request body
- [x] File Search tool configured correctly
- [x] Test responses show document-grounded content
- [x] Error handling works when no documents uploaded
- [x] No console.log statements remain
- [x] TypeScript compiles without errors

### Code Reference

**Files Modified:**
- `src/app/api/chat/route.ts` (lines 61-77)

**Expected Code Structure:**
```typescript
// Configure File Search tool
let fileSearchTool = undefined;
if (agentId) {
  systemPrompt = getSystemPromptText(agentId);

  try {
    const store = await getStoreByAgentId(agentId);
    fileSearchTool = {
      file_search: google.tools.fileSearch({
        fileSearchStoreNames: [store.storeId],
        topK: 8,
      }),
    };
  } catch (error) {
    logger.error("Error getting File Search store", { error });
  }
}

// Add to streamText config
const result = streamText({
  model: google(process.env.GEMINI_MODEL || "gemini-2.5-flash"),
  messages: convertToModelMessages(messages),
  system: systemPrompt || undefined,
  tools: fileSearchTool || undefined,
  experimental_providerMetadata: {
    google: { groundingMetadata: true },
  },
});
```

---

## Phase 2: Citations Extraction & Display

**Goal:** Extract and display source citations from File Search responses
**Estimated Time:** 1.5-2 hours (OR follow Citation Extraction feature spec)
**Priority:** 🔴 Critical
**Status:** 🟢 75% Complete (via dedicated feature spec)

### ⚠️ IMPORTANT UPDATE

This phase has been **superseded by a dedicated feature specification**:

📁 **See:** `specs/citation-extraction/`
- `README.md` - Feature overview
- `requirements.md` - Detailed requirements
- `implementation-plan.md` - **75% COMPLETE** - Step-by-step implementation guide
- `TECHNICAL-NOTES.md` - Technical details and API comparison

### Current Progress (2025-11-14)

✅ **Completed:**
1. Type definitions and database schema (Phase 1)
2. Citation extraction function with native Google SDK (Phase 2)
3. Chat API integration with `onFinish` callback (Phase 3)
4. Frontend components (CitationsList, ChatMessage updated) (Phase 4)

⏳ **Remaining:**
- Phase 5: Database storage and history loading
- Frontend integration (connect extraction to UI)
- End-to-end testing

### Why the Change?

Initial investigation revealed that:
1. **File Search IS working** - documents successfully retrieved
2. **Vercel AI SDK limitation** - doesn't expose grounding metadata
3. **Hybrid solution required** - use native Google SDK for citations
4. **Broader applicability** - all RAG agents need citations, not just veterinary

### Implementation Options

**Option A: Follow Citation Extraction Spec (Recommended)**
- Complete feature: `specs/citation-extraction/implementation-plan.md`
- Estimated time: 6-8 hours
- Benefits all RAG agents
- Production-ready with proper error handling

**Option B: Quick Veterinary-Only Implementation**
- Follow simplified tasks below
- Estimated time: 1.5-2 hours
- Veterinary agent only
- May need refactoring later

### Quick Implementation (Option B)

If you choose to implement citations specifically for the veterinary agent first:

#### 2.1: Extract Citations Using Native SDK

- [ ] Create `src/lib/extract-citations.ts`
- [ ] Import `GoogleGenAI` from `@google/genai`
- [ ] Implement function to call native SDK after streaming
- [ ] Extract `groundingMetadata` from response
- [ ] Parse into simplified Citation format
- [ ] Return empty array on error (graceful degradation)

#### 2.2: Display Citations in UI

- [ ] Update `ChatMessage` component to accept citations
- [ ] Create basic citations display (document name + text)
- [ ] Add below assistant messages
- [ ] Test with veterinary questions

### Verification Checklist

- [ ] Citations appear for File Search responses
- [ ] Document names visible
- [ ] Chunk text readable
- [ ] No errors when citations unavailable

### Recommendation

**Follow Citation Extraction spec** (`specs/citation-extraction/`) for production-ready implementation that benefits all agents and includes proper database storage, error handling, and UI polish.

### Code Reference

**Refer to:**
- `specs/citation-extraction/implementation-plan.md` - Full implementation
- `specs/citation-extraction/TECHNICAL-NOTES.md` - API details
- `docs/archive/FINDINGS_2025-11-14.md` - Investigation results (archived)

---

## Phase 3: Remove End-User Upload UI

**Goal:** Hide document upload features from regular users (admin-only access)
**Estimated Time:** 30-45 minutes
**Priority:** 🟡 High

### Tasks

#### 3.1: Remove Upload UI from Chat Interface

- [ ] Open `src/components/chat/chat-header.tsx`
- [ ] Remove or comment out document manager button
- [ ] Remove document count badge display
- [ ] Keep back button and agent info
- [ ] Test chat header layout without upload button

#### 3.2: Remove Document Manager from Chat Page

- [ ] Open `src/app/chat/[agentId]/page.tsx`
- [ ] Remove `DocumentManagerSheet` import
- [ ] Remove `documentSheetOpen` state
- [ ] Remove `documentCount` state and fetching logic
- [ ] Remove DocumentManagerSheet component rendering
- [ ] Remove document-related useEffect hooks
- [ ] Test chat page without document management features

#### 3.3: Restrict Documents Page to Admin

- [ ] Open `src/components/site-header.tsx`
- [ ] Make "Documents" link conditional on admin role
- [ ] Add admin email to environment variables (`.env`)
- [ ] Add `ADMIN_EMAIL` to environment variable validation
- [ ] Show "Documents" link only if `session?.user?.email === process.env.ADMIN_EMAIL`
- [ ] Test with admin and non-admin accounts

#### 3.4: Keep Admin Document Management

- [ ] Verify `src/app/documents/page.tsx` still accessible
- [ ] Verify all document upload API routes functional
- [ ] Verify document deletion works for admins
- [ ] Test full document management workflow as admin

### Verification Checklist

- [ ] Regular users see no upload UI in chat
- [ ] Regular users see no "Documents" link in navigation
- [ ] Admin users can access `/documents` page
- [ ] Admin users can upload documents
- [ ] Admin users can delete documents
- [ ] Chat interface clean and uncluttered
- [ ] No broken links or missing components

### Code Reference

**Files Modified:**
- `src/components/chat/chat-header.tsx`
- `src/app/chat/[agentId]/page.tsx`
- `src/components/site-header.tsx`

**Environment Variable Added:**
- `ADMIN_EMAIL` - Email address of admin user(s)

---

## Phase 4: Admin Document Upload Script

**Goal:** Create batch upload script for veterinary guideline documents
**Estimated Time:** 45 minutes - 1 hour
**Priority:** 🟡 High

### Tasks

#### 4.1: Create Upload Script

- [ ] Create `src/scripts/upload-vet-documents.ts`
- [ ] Import necessary functions:
  - [ ] `getStoreByAgentId` from `@/lib/gemini-file-search`
  - [ ] `uploadDocument` from `@/lib/gemini-file-search`
  - [ ] Node.js `fs` and `path` modules
- [ ] Implement `uploadVetDocuments()` function
- [ ] Read files from `./vet-documents` directory
- [ ] Filter for supported file types (PDF, DOCX)
- [ ] Upload each file with metadata:
  - [ ] `category: "veterinary-vaccination"`
  - [ ] `type: "canine" | "feline"` (based on filename)
- [ ] Log upload progress and results
- [ ] Handle upload errors gracefully

#### 4.2: Add Script to Package.json

- [ ] Open `package.json`
- [ ] Add script: `"upload:vet-docs": "tsx src/scripts/upload-vet-documents.ts"`
- [ ] Test script execution: `pnpm upload:vet-docs`

#### 4.3: Create Documents Directory

- [ ] Create `vet-documents/` directory in project root
- [ ] Add `.gitignore` entry for `vet-documents/*`
- [ ] Create `vet-documents/README.md` with instructions
- [ ] Document supported file types and naming conventions

#### 4.4: Test Upload Workflow

- [ ] Place test PDF in `vet-documents/`
- [ ] Run upload script
- [ ] Verify document uploaded to correct File Search store
- [ ] Verify document appears in database
- [ ] Verify document status changes to "ready"
- [ ] Test asking questions about uploaded document

### Verification Checklist

- [ ] Script runs without errors
- [ ] All PDF/DOCX files upload successfully
- [ ] Upload progress logged to console
- [ ] Metadata correctly set on documents
- [ ] Documents indexed in Gemini File Search
- [ ] Documents available for retrieval in chat
- [ ] Error handling works for invalid files

### Code Reference

**Files Created:**
- `src/scripts/upload-vet-documents.ts`
- `vet-documents/README.md`

**Files Modified:**
- `package.json` (add upload script)
- `.gitignore` (exclude vet-documents)

**Script Template:**
```typescript
import { getStoreByAgentId, uploadDocument } from "@/lib/gemini-file-search";
import * as fs from "fs";
import * as path from "path";

async function uploadVetDocuments() {
  const agentId = "research-assistant";
  const documentsPath = "./vet-documents";
  const adminUserId = "admin"; // Replace with actual admin user ID

  const store = await getStoreByAgentId(agentId);
  const files = fs.readdirSync(documentsPath);

  for (const filename of files) {
    if (filename.endsWith('.pdf') || filename.endsWith('.docx')) {
      // Upload logic here
    }
  }
}
```

---

## Phase 5: Convert Chat Page to Server Component

**Goal:** Refactor chat page to follow Next.js 15 best practices with Server Components
**Estimated Time:** 1.5-2 hours
**Priority:** 🟡 High

### Tasks

#### 5.1: Create Chat Client Component

- [ ] Create `src/components/chat/chat-client.tsx`
- [ ] Add `"use client"` directive
- [ ] Move all interactive logic from chat page:
  - [ ] `useChat` hook and configuration
  - [ ] All `useState` hooks
  - [ ] All `useEffect` hooks
  - [ ] Message handling logic
  - [ ] Conversation loading/saving
  - [ ] Scroll behavior
- [ ] Define component props interface:
  ```typescript
  interface ChatClientProps {
    session: Session;
    agent: Agent;
    agentId: string;
  }
  ```
- [ ] Accept props from Server Component parent
- [ ] Keep all rendering logic (ChatHeader, ChatMessage, etc.)
- [ ] Remove document management features (from Phase 3)

#### 5.2: Refactor Chat Page to Server Component

- [ ] Open `src/app/chat/[agentId]/page.tsx`
- [ ] Remove `"use client"` directive
- [ ] Import `requireAuth` from `@/lib/auth-helpers`
- [ ] Import `getAgentById` from `@/lib/mock-data/agents`
- [ ] Import `redirect` from `next/navigation`
- [ ] Import `ChatClient` component
- [ ] Make component async
- [ ] Call `requireAuth()` for server-side auth
- [ ] Call `getAgentById()` for server-side agent validation
- [ ] Redirect to dashboard if agent not found
- [ ] Render `ChatClient` with props

#### 5.3: Update Imports and Dependencies

- [ ] Remove unused client-side imports from page
- [ ] Verify all necessary imports in ChatClient
- [ ] Update type imports as needed
- [ ] Check for hydration issues

#### 5.4: Test Server Component Pattern

- [ ] Test authentication flow (unauthenticated redirect)
- [ ] Test with valid agent ID
- [ ] Test with invalid agent ID (should redirect)
- [ ] Test initial page load speed
- [ ] Check for hydration errors in console
- [ ] Verify all chat features still work

### Verification Checklist

- [ ] Chat page is Server Component (no "use client")
- [ ] Authentication validated server-side
- [ ] Agent validation happens server-side
- [ ] ChatClient receives correct props
- [ ] All chat features functional (messages, streaming, etc.)
- [ ] No hydration errors
- [ ] Page loads faster (less client JS)
- [ ] TypeScript compiles without errors

### Code Reference

**Files Created:**
- `src/components/chat/chat-client.tsx`

**Files Modified:**
- `src/app/chat/[agentId]/page.tsx`

**Server Component Template:**
```typescript
// src/app/chat/[agentId]/page.tsx
import { requireAuth } from "@/lib/auth-helpers";
import { getAgentById } from "@/lib/mock-data/agents";
import { redirect } from "next/navigation";
import { ChatClient } from "@/components/chat/chat-client";

export default async function ChatPage({
  params,
}: {
  params: { agentId: string };
}) {
  const session = await requireAuth();
  const agent = getAgentById(params.agentId);

  if (!agent) {
    redirect("/dashboard");
  }

  return <ChatClient session={session} agent={agent} agentId={params.agentId} />;
}
```

---

## Phase 6: Production Code Quality Fixes

**Goal:** Fix critical production issues (logging, security, types)
**Estimated Time:** 1-2 hours
**Priority:** 🔴 Critical

### Tasks

#### 6.1: Replace Console.log with Logger

- [ ] Open `src/app/api/chat/route.ts`
- [ ] Import logger: `import { logger } from "@/lib/logger"`
- [ ] Replace `console.log` (line 65) with `logger.info()`
- [ ] Replace `console.error` with `logger.error()`
- [ ] Add structured logging with context objects
- [ ] Search for other console statements in API routes:
  - [ ] `src/app/api/files/upload/route.ts`
  - [ ] `src/app/api/conversations/*.ts`
  - [ ] `src/lib/gemini-file-search.ts`
- [ ] Replace all console statements with logger
- [ ] Verify logger only logs in development (check logger.ts config)

#### 6.2: Add Security Headers

- [ ] Open `next.config.ts`
- [ ] Add `headers()` async function
- [ ] Configure security headers:
  - [ ] `X-Frame-Options: DENY`
  - [ ] `X-Content-Type-Options: nosniff`
  - [ ] `Referrer-Policy: origin-when-cross-origin`
  - [ ] `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- [ ] Apply headers to all routes (`/:path*`)
- [ ] Test headers with browser DevTools
- [ ] Verify no console warnings about headers

#### 6.3: Environment Variable Validation

- [ ] Create `src/lib/env.ts`
- [ ] Define required environment variables array
- [ ] Add validation logic (throw error if missing)
- [ ] Export typed `env` object for use in app
- [ ] Import `env` in `src/app/layout.tsx` (runs on startup)
- [ ] Add `ADMIN_EMAIL` to required variables
- [ ] Test with missing env var (should fail fast)
- [ ] Document required env vars in `.env.example`

#### 6.4: Fix TypeScript any Types

- [ ] Open `src/app/chat/[agentId]/page.tsx` (or chat-client.tsx)
- [ ] Find `as any` type assertion (line 35-39)
- [ ] Import `UseChatOptions` type from `@ai-sdk/react`
- [ ] Replace `as any` with proper type:
  ```typescript
  const chatOptions: UseChatOptions = {
    body: { agentId },
    api: '/api/chat',
  };
  ```
- [ ] Run `pnpm typecheck` to verify
- [ ] Fix any other TypeScript warnings

#### 6.5: Add Error Boundary to Chat

- [ ] Open Server Component chat page
- [ ] Import ErrorBoundary: `import { ErrorBoundary } from "@/components/error-boundary"`
- [ ] Wrap `<ChatClient>` with `<ErrorBoundary>`
- [ ] Test error boundary by throwing error in chat
- [ ] Verify error UI displays correctly
- [ ] Verify error doesn't crash entire app

### Verification Checklist

- [ ] No console.log in any API routes
- [ ] Logger used for all debug/info/error messages
- [ ] Security headers active (check DevTools Network tab)
- [ ] Environment validation works (test missing var)
- [ ] All TypeScript strict mode passing
- [ ] No `any` types in codebase
- [ ] Error boundary catches chat errors
- [ ] `pnpm run build` succeeds
- [ ] `pnpm run typecheck` passes
- [ ] `pnpm run lint` passes

### Code Reference

**Files Created:**
- `src/lib/env.ts`

**Files Modified:**
- `src/app/api/chat/route.ts`
- `src/lib/gemini-file-search.ts`
- `next.config.ts`
- `src/app/chat/[agentId]/page.tsx`
- `.env.example`

---

## Phase 7: Veterinary-Specific Configuration

**Goal:** Configure agent for veterinary use case with appropriate system prompt
**Estimated Time:** 30-45 minutes
**Priority:** 🟡 High

### Tasks

#### 7.1: Update or Create Veterinary Agent

- [ ] Open `src/lib/mock-data/agents.ts`
- [ ] Option A: Repurpose Research Assistant for veterinary use
- [ ] Option B: Create new "Veterinary Assistant" agent
- [ ] Set agent properties:
  - [ ] `id: "veterinary-assistant"`
  - [ ] `name: "Veterinary Vaccination Assistant"`
  - [ ] `category: "Veterinary Medicine"`
  - [ ] `icon: "🩺"` or similar
  - [ ] `color: "#10b981"` (green for medical)
  - [ ] Update `description` for veterinary focus
  - [ ] Update `tags` for vaccination-related keywords

#### 7.2: Create Veterinary System Prompt

- [ ] Open `src/lib/agent-prompts.ts`
- [ ] Create or update system prompt for veterinary agent
- [ ] Include key instructions:
  - [ ] Focus on vaccination protocols only
  - [ ] Cite authoritative sources (AAHA, WSAVA, etc.)
  - [ ] Include medical disclaimer
  - [ ] Specify target audience (veterinary professionals)
  - [ ] Clarify scope (dogs and cats only)
  - [ ] Emphasize evidence-based responses
- [ ] Test prompt with sample questions

#### 7.3: Update Landing Page

- [ ] Open `src/app/page.tsx`
- [ ] Update hero section for veterinary focus (optional)
- [ ] Feature veterinary agent prominently
- [ ] Update marketing copy for target audience
- [ ] Test landing page layout

#### 7.4: Update Sample Questions

- [ ] Open veterinary agent configuration
- [ ] Update `sampleQuestions` array with veterinary examples:
  - [ ] "What is the vaccination protocol for puppies?"
  - [ ] "When should cats receive their rabies booster?"
  - [ ] "What are the core vaccines for adult dogs?"
  - [ ] "Are there contraindications for leptospirosis vaccine?"

### Verification Checklist

- [ ] Veterinary agent appears on landing page
- [ ] Agent has appropriate icon and color
- [ ] System prompt includes medical disclaimer
- [ ] Sample questions are veterinary-focused
- [ ] Agent description accurate for use case
- [ ] File Search enabled for agent

### Code Reference

**Files Modified:**
- `src/lib/mock-data/agents.ts`
- `src/lib/agent-prompts.ts`

**System Prompt Template (Updated 2025-11-15):**
```typescript
{
  agentId: "research-assistant", // "veterinary-assistant" in future
  persona: "Expert Veterinary Professional specializing in Vaccination Guidelines",
  systemPrompt: `You are an AI assistant specialized in veterinary vaccination protocols for dogs and cats. Your role is to provide accurate, evidence-based information to veterinary professionals based EXCLUSIVELY on the uploaded guideline documents.

CRITICAL INSTRUCTION - DOCUMENT-ONLY RESPONSES:
You MUST ONLY use information that is explicitly found in the uploaded documents provided to you through File Search. DO NOT use your general knowledge, training data, or any external information sources.

Key Instructions:
- ONLY answer questions using information found in the uploaded documents
- If the answer is not in the uploaded documents, explicitly state: "I cannot find this information in the uploaded vaccination guidelines. Please consult the original source documents or a veterinary professional."
- Always cite the specific document name and section when providing information
- Do NOT provide information from your general knowledge or training data
- Do NOT make assumptions or inferences beyond what is explicitly stated in the documents
- Focus exclusively on vaccination protocols and guidelines from the uploaded documents
- Emphasize core vs. non-core vaccines as defined in the uploaded documents
- Include legal/regulatory requirements only if mentioned in the uploaded documents

Medical Disclaimer: This information is for reference only. Always consult current veterinary guidelines and use professional judgment. This AI does not diagnose conditions or replace veterinary expertise.

Target Audience: Licensed veterinarians, veterinary technicians, and practice managers.`,
  tone: "Professional, precise, evidence-based, authoritative yet accessible"
}
```

**Note:** This system prompt enforces document-only responses since Google Gemini File Search does NOT have a built-in "strict mode" to prevent general knowledge usage. See [Google File Search Documentation](https://ai.google.dev/gemini-api/docs/file-search) for more details.

---

## Phase 8: Testing & Documentation

**Goal:** Comprehensive testing with veterinary documents and documentation updates
**Estimated Time:** 1-2 hours
**Priority:** 🟡 High

### Tasks

#### 8.1: Upload Test Veterinary Documents

- [ ] Gather sample veterinary guideline PDFs
- [ ] Place documents in `vet-documents/` directory
- [ ] Run upload script: `pnpm upload:vet-docs`
- [ ] Verify uploads in Drizzle Studio: `pnpm db:studio`
- [ ] Check document status (should be "ready")
- [ ] Verify File Search store has documents

#### 8.2: Test Veterinary Questions

Test the following scenarios:

**Puppy Vaccination Protocol:**
- [ ] Ask: "What is the vaccination protocol for puppies?"
- [ ] Verify response includes schedule (6-8 weeks, 10-12 weeks, etc.)
- [ ] Verify citations show guideline documents
- [ ] Check for core vaccines mentioned (distemper, parvovirus, adenovirus)

**Feline Rabies Booster:**
- [ ] Ask: "When should cats receive their rabies booster?"
- [ ] Verify response includes 1-year and 3-year options
- [ ] Verify citations reference rabies guidelines
- [ ] Check for legal/regulatory mentions

**Adult Dog Core Vaccines:**
- [ ] Ask: "What are the core vaccines for adult dogs?"
- [ ] Verify response lists DHPP, rabies
- [ ] Verify citations show authoritative sources
- [ ] Check for booster interval information

**Vaccine Contraindications:**
- [ ] Ask: "Are there any contraindications for leptospirosis vaccine?"
- [ ] Verify response includes known contraindications
- [ ] Verify citations reference safety data
- [ ] Check for breed-specific mentions

**Edge Cases:**
- [ ] Ask non-vaccination question (should redirect to scope)
- [ ] Ask about exotic pets (should indicate out of scope)
- [ ] Ask very vague question (should request clarification)

#### 8.3: Test Admin Workflow

- [ ] Log in as admin user
- [ ] Access `/documents` page
- [ ] Upload new veterinary guideline PDF
- [ ] Verify upload progress shown
- [ ] Verify document appears in list
- [ ] Delete test document
- [ ] Verify deletion successful

#### 8.4: Test Regular User Experience

- [ ] Log in as non-admin user
- [ ] Verify no "Documents" link in navigation
- [ ] Access chat page
- [ ] Verify no document upload UI
- [ ] Ask veterinary question
- [ ] Verify response and citations work
- [ ] Verify clean, professional interface

#### 8.5: Quality Assurance Checks

- [ ] Run TypeScript check: `pnpm typecheck`
- [ ] Run ESLint: `pnpm lint`
- [ ] Build for production: `pnpm build`
- [ ] Test production build: `pnpm start`
- [ ] Check browser console for errors
- [ ] Verify security headers (Network tab)
- [ ] Test on multiple browsers (Chrome, Safari, Firefox)
- [ ] Test responsive design (mobile, tablet, desktop)

#### 8.6: Update Documentation

- [ ] Update `specs/rag-agent-chat-saas/implementation-plan.md`:
  - [ ] Mark Phase 12 as 100% complete
  - [ ] Update Phase 17 with completed items
  - [ ] Add note about veterinary specialization
- [ ] Update project `README.md`:
  - [ ] Document veterinary use case
  - [ ] Add setup instructions for admin
  - [ ] Document upload workflow
  - [ ] Add example questions
- [ ] Create `vet-documents/README.md`:
  - [ ] List recommended guideline sources
  - [ ] Document naming conventions
  - [ ] Explain metadata tagging
- [ ] Update `.env.example`:
  - [ ] Add `ADMIN_EMAIL` with description
  - [ ] Document all required variables

### Verification Checklist

- [ ] All test questions return accurate responses
- [ ] Citations appear for all responses
- [ ] Citations reference correct documents
- [ ] Admin workflow functional end-to-end
- [ ] Regular users cannot upload documents
- [ ] No TypeScript errors
- [ ] No ESLint warnings
- [ ] Production build successful
- [ ] Documentation complete and accurate

### Code Reference

**Files Modified:**
- `specs/rag-agent-chat-saas/implementation-plan.md`
- `README.md`
- `vet-documents/README.md`
- `.env.example`

---

## Progress Tracking

### Overall Progress

**Phase 1:** ✅ COMPLETE (100%) - Gemini File Search Integration
**Phase 2:** ⏳ Pending (0%) - Citations Extraction & Display
**Phase 3:** ⏳ Pending (0%) - Remove End-User Upload UI
**Phase 4:** ⏳ Pending (0%) - Admin Document Upload Script
**Phase 5:** ⏳ Pending (0%) - Convert Chat Page to Server Component
**Phase 6:** ⏳ Pending (0%) - Production Code Quality Fixes
**Phase 7:** ⏳ Pending (0%) - Veterinary-Specific Configuration
**Phase 8:** ⏳ Pending (0%) - Testing & Documentation

**Overall Completion:** 12.5% (1/8 phases)

---

## Dependencies Between Phases

```
Phase 1 (File Search) ← CRITICAL PATH
    ↓
Phase 2 (Citations) ← Depends on Phase 1
    ↓
Phase 7 (Vet Config) ← Can run in parallel with Phases 3-6
    ↓
Phase 3 (Remove User Upload) ← Independent
Phase 4 (Admin Script) ← Independent
Phase 5 (Server Component) ← Independent
Phase 6 (Production Fixes) ← Independent
    ↓
Phase 8 (Testing) ← Depends on all previous phases
```

**Recommended Order:**
1. Phase 1 (File Search) - Must be first
2. Phase 2 (Citations) - Requires Phase 1
3. Phases 3-7 in any order (parallel work possible)
4. Phase 8 (Testing) - Must be last

---

## Risk Assessment

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Vercel AI SDK File Search API different than expected | High | Medium | Research official docs, test incrementally |
| Citations format doesn't match expectations | Medium | Low | Use Gemini's native citation format |
| Admin email filtering insufficient | Low | Low | Add role-based auth in future iteration |
| Large PDF uploads timeout | Medium | Low | Already have 100MB limit and progress UI |
| File Search responses inaccurate | High | Low | Test with high-quality guideline documents |
| Users ask out-of-scope questions | Low | High | System prompt guides to vaccination topics |

---

## Post-Implementation Tasks

### Immediate (After Phase 8)
- [ ] Deploy to staging environment
- [ ] Get veterinary professional feedback
- [ ] Refine system prompt based on feedback
- [ ] Add more sample questions
- [ ] Monitor response accuracy

### Short-Term (1-2 weeks)
- [ ] Replace in-memory rate limiter with Vercel KV
- [ ] Implement conversation pagination (50+ messages)
- [ ] Add metadata filtering (by species, publication date)
- [ ] Implement Gemini document deletion API
- [ ] Add analytics tracking

### Medium-Term (1-2 months)
- [ ] Add support for more veterinary topics (diagnostics, treatment)
- [ ] Multi-species support (exotic pets, farm animals)
- [ ] Regional guideline variants (US, UK, EU)
- [ ] Conversation export functionality
- [ ] Advanced search and filtering

---

## Success Criteria

### Technical Success
- ✅ Build passes without errors
- ✅ TypeScript strict mode compliance
- ✅ No ESLint warnings
- ✅ All tests pass
- ✅ Security headers active
- ✅ Rate limiting functional
- ✅ Server Component pattern implemented

### Functional Success
- ✅ File Search retrieves relevant documents
- ✅ Citations appear on all grounded responses
- ✅ Admin can upload documents
- ✅ Regular users cannot upload documents
- ✅ Chat interface clean and professional
- ✅ Veterinary questions answered accurately

### User Experience Success
- ✅ Response time < 3 seconds
- ✅ Citations easy to read
- ✅ Interface intuitive for veterinary professionals
- ✅ Error messages clear and helpful
- ✅ Mobile-responsive design

---

## Appendix: Useful Commands

### Development
```bash
pnpm dev                    # Start development server
pnpm db:studio             # Open database GUI
pnpm typecheck             # Check TypeScript
pnpm lint                  # Check code quality
pnpm build                 # Build for production
```

### Document Management
```bash
pnpm init:stores           # Initialize File Search stores
pnpm upload:vet-docs       # Upload veterinary documents
```

### Database
```bash
pnpm db:generate           # Generate migrations
pnpm db:migrate            # Run migrations
pnpm db:push               # Push schema changes (dev)
```

---

**Document Version History:**

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | 2025-11-14 | Initial implementation plan created |
