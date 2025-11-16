# Citation Extraction - Requirements

**Feature:** Extract and Display Citations from Gemini File Search Responses
**Created:** 2025-11-14
**Status:** Planning
**Priority:** High

---

## Overview

Enable citation/source extraction from Google Gemini File Search responses to show users which document passages were used to generate answers. This increases trust, transparency, and verifiability of AI-generated responses.

---

## Business Requirements

### Primary Goal
Display source citations alongside AI responses to show users which uploaded documents and specific passages were used to generate the answer.

### Target Users
- **End Users:** Veterinary professionals, researchers, and anyone using RAG agents who need to verify information sources
- **Administrators:** Those uploading and managing knowledge base documents

### Key Value Propositions
1. **Transparency:** Users can see exactly which documents informed each response
2. **Verifiability:** Users can cross-reference AI answers with source materials
3. **Trust:** Citations build confidence in AI-generated information
4. **Compliance:** Meets academic and professional standards for sourcing
5. **Quality Control:** Helps identify when AI uses incorrect or outdated documents

---

## Current State Analysis

### What's Working ✅
- File Search successfully retrieves relevant document chunks
- AI provides accurate, document-grounded responses
- `finishReason: 'tool-calls'` confirms File Search execution
- High `reasoningTokens` indicates document processing
- Documents properly indexed in Gemini File Search stores

### What's Not Working ❌
- Vercel AI SDK (`@ai-sdk/google` v2.0.30) doesn't expose `groundingMetadata`
- `experimental_providerMetadata` not populated in responses
- No access to citation information through current implementation
- Users cannot see which document passages were used

---

## Functional Requirements

### FR1: Citation Extraction via Native SDK
- **Description:** Extract grounding metadata using native `@google/genai` SDK
- **Acceptance Criteria:**
  - Call native SDK after Vercel AI SDK response completes
  - Extract `groundingMetadata` from `response.candidates[0]`
  - Parse citation information (document name, chunk text, indices)
  - Return structured citation objects
  - Handle cases where no citations available

### FR2: Citation Data Structure
- **Description:** Define consistent citation format for frontend consumption
- **Acceptance Criteria:**
  - Citation includes: document name, chunk text, confidence score (if available)
  - Citations array associated with each assistant message
  - Support multiple citations per response
  - Handle missing or incomplete citation data gracefully
  - TypeScript interfaces defined for type safety

### FR3: Citation Display in UI
- **Description:** Render citations below assistant messages in chat interface
- **Acceptance Criteria:**
  - Citations appear as collapsible sections below responses
  - Each citation shows document name prominently
  - Chunk text displayed with readable formatting
  - Citations numbered/labeled for easy reference
  - Visual distinction from main response text
  - Responsive design for mobile devices

### FR4: Citation Storage
- **Description:** Persist citations with conversation messages
- **Acceptance Criteria:**
  - Citations stored in database with messages
  - Retrieved when loading conversation history
  - Included in conversation exports (if applicable)
  - Database schema supports citation array

### FR5: Performance Optimization
- **Description:** Minimize latency impact of dual API calls
- **Acceptance Criteria:**
  - Citation extraction runs in parallel where possible
  - Response streaming not blocked by citation extraction
  - User sees response immediately, citations load shortly after
  - Implement caching for repeated queries (optional)
  - Total latency increase < 500ms

---

## Non-Functional Requirements

### NFR1: Backward Compatibility
- Existing messages without citations display normally
- No breaking changes to current chat API
- Frontend handles missing citation data gracefully

### NFR2: Error Handling
- Failed citation extraction doesn't break chat functionality
- Log citation extraction errors for debugging
- Display partial citations if some fail
- Fallback to "no citations available" message

### NFR3: Scalability
- Citation extraction scales with message volume
- Database schema supports large citation arrays
- No memory leaks from citation processing

### NFR4: Security
- Citations don't expose sensitive document metadata
- Proper authentication for citation endpoints
- Rate limiting applies to citation extraction

### NFR5: Maintainability
- Clear separation between streaming and citation logic
- Well-documented code with examples
- Easy to swap implementation when AI SDK adds native support

---

## Technical Requirements

### TR1: Hybrid API Approach
- **Current:** Vercel AI SDK for streaming (`@ai-sdk/google`)
- **Addition:** Native Google SDK for citations (`@google/genai`)
- **Integration Point:** After `streamText` completes
- **Fallback:** Continue without citations on error

### TR2: Citation Extraction Function
```typescript
interface Citation {
  documentName: string;
  chunkText: string;
  startIndex?: number;
  endIndex?: number;
  confidence?: number;
}

async function extractCitations(
  messages: CoreMessage[],
  agentId: string
): Promise<Citation[]>
```

### TR3: Database Schema Update
- Update `messages` table or create `citations` table
- Store citations as JSONB column
- Index for efficient retrieval

### TR4: API Response Format
```typescript
{
  message: {
    id: string;
    role: "assistant";
    content: string;
    citations?: Citation[];
  }
}
```

---

## User Stories

### US1: Researcher Verifies Vaccination Guidelines
**As a** veterinarian
**I want to** see which WSAVA guideline sections informed the AI's answer
**So that** I can verify the information and reference the original source

**Acceptance Criteria:**
- Citation shows "WSAVA-Vaccination-guidelines-2024.pdf"
- Chunk text displays relevant passage
- Citation appears immediately below response
- I can expand/collapse citation details

### US2: User Identifies Outdated Information
**As a** research assistant user
**I want to** see which documents the AI used
**So that** I can identify if outdated documents were referenced

**Acceptance Criteria:**
- All citations clearly labeled with document names
- Upload date shown (if available)
- Multiple document sources distinguished
- Easy to spot which documents need updating

### US3: User Shares Verified Answers
**As a** legal document advisor user
**I want to** include citations when sharing AI responses
**So that** recipients can verify the information

**Acceptance Criteria:**
- Citations exportable with response
- Professional formatting for sharing
- Document names and passages clearly marked
- Copy-to-clipboard functionality

### US4: Admin Monitors Citation Quality
**As a** system administrator
**I want to** see citation metadata in logs
**So that** I can monitor File Search effectiveness

**Acceptance Criteria:**
- Citation count logged per response
- Citation extraction errors logged
- Analytics on most-cited documents
- Performance metrics tracked

---

## Out of Scope

The following are explicitly **NOT** included in this feature:

1. ❌ Full-text search within cited passages
2. ❌ Direct links to specific PDF page numbers
3. ❌ Citation editing or manual override
4. ❌ Citation export in specific formats (BibTeX, APA, etc.)
5. ❌ Highlighted text showing exact citation locations in documents
6. ❌ Citation ranking or relevance scoring
7. ❌ Multi-language citation support
8. ❌ Citation analytics dashboard
9. ❌ Automated citation quality assessment
10. ❌ Integration with reference management tools (Zotero, Mendeley)

---

## Success Metrics

### User Engagement
- 80%+ of responses include at least 1 citation
- Users expand citations 30%+ of the time
- Citation-related errors < 2%

### Accuracy
- 95%+ citation extraction success rate
- Citations match actual retrieved chunks
- No hallucinated document names

### Performance
- Citation extraction adds < 500ms latency
- Citation display renders in < 100ms
- No degradation in streaming performance

### User Satisfaction
- Increase in user trust metrics (surveys)
- Positive feedback on citation feature
- Reduced questions about source verification

---

## Assumptions

1. Google Gemini API consistently returns grounding metadata
2. Native `@google/genai` SDK v1.29.0 supports grounding metadata access
3. Citation data structure from Google remains stable
4. Users have sufficient permissions to view cited documents
5. Database can handle JSONB citation arrays efficiently
6. Citations can be extracted post-streaming without timeout issues

---

## Dependencies

### External Services
- Google Gemini API (File Search + grounding metadata)
- `@google/genai` SDK v1.29.0+

### Internal Systems
- Existing File Search infrastructure
- Database (PostgreSQL + Drizzle ORM)
- Chat API and streaming implementation
- Frontend chat components

### Development Tools
- TypeScript type definitions
- Database migration tools
- Testing utilities (for future testing)

---

## Risks & Mitigations

| Risk | Impact | Probability | Mitigation |
|------|--------|-------------|------------|
| Native SDK grounding metadata unavailable | High | Low | Verify with test before full implementation |
| Citation extraction timeout | Medium | Low | Set reasonable timeout (3s), fallback gracefully |
| Database schema migration issues | Medium | Low | Test migration on dev environment first |
| Increased API costs (2x calls) | Medium | High | Implement intelligent caching, batch requests |
| Citation format changes in Google API | Medium | Low | Abstract citation parsing, version detection |
| Performance degradation | Medium | Medium | Profile and optimize, parallel execution |
| Frontend rendering issues | Low | Low | Progressive enhancement, loading states |

---

## Future Enhancements (Post-MVP)

1. **Smart Caching:** Cache citations for identical queries
2. **Citation Analytics:** Track most-cited documents and passages
3. **Enhanced Display:** Highlight cited passages in original documents
4. **Export Formats:** BibTeX, APA, MLA citation formats
5. **Citation Filtering:** Filter responses by specific documents
6. **Confidence Scores:** Display and sort by citation confidence
7. **Batch Extraction:** Optimize for conversation-wide citation retrieval
8. **Native SDK Migration:** Move entirely to native SDK when Vercel adds support

---

## Compliance & Legal

### Data Privacy
- Citations contain only document metadata (names, chunks)
- No PII or sensitive data in citations
- Citations subject to same access controls as documents

### Copyright
- Citations used for referencing, not redistribution
- Chunk text limited to reasonable excerpt lengths
- Document ownership respected

### Accuracy Disclaimer
- Citations show AI's retrieval, not guarantee of accuracy
- Users responsible for verifying cited information
- Disclaimer included in UI near citations

---

## Appendix: Technical Investigation Summary

### Root Cause
Vercel AI SDK's `@ai-sdk/google` provider (v2.0.30) does not expose Google's `groundingMetadata` in the response object, even when explicitly enabled via `experimental_providerMetadata`.

### Evidence
- Tested with `pnpm test:file-search`
- `finishReason: 'tool-calls'` confirms File Search used
- `reasoningTokens: 295` indicates document processing
- `experimental_providerMetadata` undefined in result
- `result.sources` empty

### Verification
- File Search working correctly (responses are accurate)
- Only citation metadata inaccessible through AI SDK
- Native Google SDK provides access via `response.candidates[0].groundingMetadata`

### Implementation Decision
Hybrid approach: Keep Vercel AI SDK for streaming, add native Google SDK for citation extraction post-response.
