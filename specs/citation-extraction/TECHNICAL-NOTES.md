# Citation Extraction - Technical Notes

**Last Updated:** 2025-11-14

---

## API Comparison: Vercel AI SDK vs Native Google SDK

### Vercel AI SDK (`@ai-sdk/google`)
**Current Usage:** Chat streaming

```typescript
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";

const google = createGoogleGenerativeAI({ apiKey: "..." });

const result = streamText({
  model: google("gemini-2.5-flash"),
  messages: [...],
  tools: {
    file_search: google.tools.fileSearch({
      fileSearchStoreNames: [storeId],
      topK: 8,
    }),
  },
  experimental_providerMetadata: {
    google: { groundingMetadata: true }, // ❌ Not working in v2.0.30
  },
});

// ❌ No access to groundingMetadata
console.log(result.experimental_providerMetadata); // undefined
```

**Limitations:**
- No access to `groundingMetadata` even when enabled
- `result.sources` always empty
- Cannot extract citations

**Advantages:**
- Streaming support
- React hooks (`useChat`)
- Simpler API
- Better TypeScript support

---

### Native Google SDK (`@google/genai`)
**New Usage:** Citation extraction only

```typescript
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: "..." });

const response = await ai.models.generateContent({
  model: "gemini-2.5-flash",
  contents: [...],
  config: {
    tools: [{
      file_search: {
        file_search_store_names: [storeId],
      },
    }],
  },
});

// ✅ Access grounding metadata
const groundingMetadata = response.candidates?.[0]?.groundingMetadata;
console.log(groundingMetadata.groundingChunks); // Array of citations
```

**Advantages:**
- Full access to all Google features
- Grounding metadata available
- Can extract citations

**Limitations:**
- No streaming utilities
- Manual message formatting required
- Less TypeScript support

---

## Grounding Metadata Structure

### Raw Response Format
```typescript
{
  candidates: [
    {
      groundingMetadata: {
        groundingChunks: [
          {
            retrievedContext: {
              uri: "fileSearchStores/.../documents/...",
              title: "WSAVA-Vaccination-guidelines-2024.pdf",
              text: "Core vaccines for dogs include CDV, CAV, and CPV..."
            }
          },
          // ... more chunks
        ],
        groundingSupports: [
          {
            segment: {
              startIndex: 0,
              endIndex: 150,
              text: "According to WSAVA guidelines..."
            },
            groundingChunkIndices: [0, 1],
            confidenceScores: [0.95, 0.89]
          }
        ],
        retrievalMetadata: {
          googleSearchDynamicRetrievalScore: 0.0
        }
      },
      content: {
        parts: [{ text: "Response text here..." }]
      },
      finishReason: "STOP"
    }
  ]
}
```

### Parsed Citation Format
```typescript
interface Citation {
  documentName: string;      // "WSAVA-Vaccination-guidelines-2024.pdf"
  chunkText: string;          // "Core vaccines for dogs include..."
  startIndex?: number;        // Position in response where citation applies
  endIndex?: number;          // End position
  confidence?: number;        // 0.0 - 1.0 confidence score
}
```

---

## Implementation Strategy

### Hybrid Approach Flow

```
User sends message
    ↓
Chat API receives request
    ↓
┌─────────────────────────────────────────┐
│ STEP 1: Streaming (Vercel AI SDK)      │
│ - Call streamText() with File Search   │
│ - Stream response to user in real-time │
│ - User sees response immediately        │
└─────────────────────────────────────────┘
    ↓
Response streaming completes
    ↓
┌─────────────────────────────────────────┐
│ STEP 2: Citation Extraction (Background)│
│ - Call native Google SDK (async)       │
│ - Extract groundingMetadata             │
│ - Parse into Citation[] format         │
│ - Save to database                      │
│ - Send to frontend via SSE (optional)  │
└─────────────────────────────────────────┘
    ↓
Citations display under message
```

### Why Two API Calls?

**Question:** Why not use native SDK for everything?

**Answer:** Trade-offs

| Aspect | Vercel AI SDK | Native SDK | Hybrid |
|--------|---------------|------------|--------|
| Streaming | ✅ Built-in | ❌ Manual | ✅ Best of both |
| Citations | ❌ Not available | ✅ Available | ✅ Available |
| React Hooks | ✅ `useChat` | ❌ None | ✅ Keep hooks |
| TypeScript | ✅ Excellent | ⚠️ Basic | ✅ Excellent |
| API Calls | 1 call | 1 call | 2 calls |
| Complexity | Low | High | Medium |
| Migration Path | ❌ Breaking | ❌ Breaking | ✅ Easy upgrade |

**Verdict:** Hybrid approach is best short-term solution
- Maintains current UX
- Adds citations
- Easy to migrate when AI SDK adds native support

---

## Database Schema Options

### Option 1: Embedded JSONB (Recommended)
**Pros:** Simple, no joins needed, atomic updates
**Cons:** No indexing on citation fields

```sql
ALTER TABLE conversation_messages
ADD COLUMN citations JSONB;

-- Example data
{
  "citations": [
    {
      "documentName": "WSAVA-Vaccination-guidelines-2024.pdf",
      "chunkText": "Core vaccines include...",
      "confidence": 0.95
    }
  ]
}
```

### Option 2: Separate Citations Table
**Pros:** Normalized, indexable, easier to query
**Cons:** Requires joins, more complex

```sql
CREATE TABLE citations (
  id UUID PRIMARY KEY,
  message_id UUID REFERENCES conversation_messages(id),
  document_name TEXT NOT NULL,
  chunk_text TEXT NOT NULL,
  start_index INT,
  end_index INT,
  confidence REAL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_citations_message_id ON citations(message_id);
```

**Recommendation:** Use **Option 1 (Embedded)** for simplicity

---

## Message Formats

### Converting AI SDK Messages to Native SDK

```typescript
import { CoreMessage } from "ai";

function convertToGoogleFormat(messages: CoreMessage[]) {
  return messages.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [
      {
        text: typeof msg.content === "string"
          ? msg.content
          : msg.content.map(p => p.type === "text" ? p.text : "").join("")
      }
    ],
  }));
}
```

### Handling Multi-turn Conversations

```typescript
// ❌ Don't send entire conversation every time (expensive)
const allMessages = [...history, newUserMessage];

// ✅ For citations, only send relevant context
const recentMessages = [
  ...history.slice(-3), // Last 3 messages for context
  newUserMessage,
];
```

---

## Performance Optimization

### Citation Extraction Timing

```typescript
// ❌ Bad: Blocks streaming
const result = await streamText({ ... });
const citations = await extractCitations(); // Blocks!
return result.toUIMessageStreamResponse();

// ✅ Good: Async extraction
const result = streamText({ ... });

// Fire and forget (non-blocking)
result.then(async () => {
  const citations = await extractCitations();
  await saveCitations(citations);
}).catch(err => logger.error("Citation extraction failed", err));

return result.toUIMessageStreamResponse();
```

### Timeout Configuration

```typescript
async function extractCitations(...) {
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("Timeout")), 3000)
  );

  const extractionPromise = ai.models.generateContent({ ... });

  try {
    return await Promise.race([extractionPromise, timeoutPromise]);
  } catch (error) {
    logger.warn("Citation extraction timeout", { error });
    return []; // Graceful degradation
  }
}
```

---

## Error Handling Patterns

### Graceful Degradation

```typescript
async function extractCitations(messages, agentId) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY! });
    const store = await getStoreByAgentId(agentId);

    const response = await ai.models.generateContent({ ... });
    const metadata = response.candidates?.[0]?.groundingMetadata;

    if (!metadata || !metadata.groundingChunks) {
      logger.info("No grounding metadata available", { agentId });
      return []; // Not an error, just no citations
    }

    return parseCitations(metadata.groundingChunks);
  } catch (error) {
    logger.error("Citation extraction failed", { error, agentId });
    return []; // Return empty array, don't crash
  }
}
```

### Logging Best Practices

```typescript
// ✅ Good: Structured logging
logger.info("Citation extraction started", {
  agentId,
  messageCount: messages.length,
});

// ✅ Good: Log results
logger.info("Citations extracted", {
  agentId,
  citationCount: citations.length,
  duration: Date.now() - startTime,
});

// ❌ Bad: console.log
console.log("Got citations:", citations);
```

---

## Testing Checklist

### Unit Tests (Future)
- [ ] `extractCitations()` with valid grounding metadata
- [ ] `extractCitations()` with missing metadata
- [ ] `extractCitations()` with malformed data
- [ ] `parseCitations()` with various chunk formats
- [ ] Timeout handling

### Integration Tests (Future)
- [ ] End-to-end citation extraction flow
- [ ] Database storage and retrieval
- [ ] Frontend citation display

### Manual Testing (Required)
- [ ] Single document query → citations appear
- [ ] Multi-document query → multiple citations
- [ ] No document match → no citations (graceful)
- [ ] Long citations → truncation works
- [ ] Conversation history → citations load
- [ ] Mobile display → responsive layout

---

## Migration Path

### When AI SDK Adds Native Support

1. Check AI SDK release notes for grounding metadata support
2. Test new feature with existing setup
3. Remove native SDK citation extraction
4. Update to use AI SDK's built-in citations
5. Keep database schema (compatible)
6. Update frontend to use new citation format (if different)

**Estimated migration time:** 1-2 hours

---

## Useful References

- [Google Gemini File Search Docs](https://ai.google.dev/gemini-api/docs/file-search)
- [Vercel AI SDK Docs](https://ai-sdk.dev)
- [Native Google GenAI SDK](https://googleapis.github.io/js-genai/)
- [Drizzle ORM JSON Columns](https://orm.drizzle.team/docs/column-types/pg#json)

---

## Common Issues & Solutions

### Issue: "groundingMetadata is undefined"

**Cause:** Response doesn't include grounding data (model didn't use File Search)

**Solution:**
```typescript
// Check if File Search was actually used
if (response.candidates?.[0]?.finishReason !== "STOP") {
  logger.warn("Unexpected finish reason", { finishReason });
}

// Always check for metadata existence
const metadata = response.candidates?.[0]?.groundingMetadata;
if (!metadata) return [];
```

### Issue: "Citations don't match response content"

**Cause:** Different messages sent to streaming vs citation extraction

**Solution:**
```typescript
// Use SAME messages for both calls
const messages = [...]; // Build once

// Streaming
await streamText({ messages });

// Citations (use same messages)
await extractCitations(messages, agentId);
```

### Issue: "Database migration fails"

**Cause:** Existing data incompatible with new schema

**Solution:**
```sql
-- Add column as nullable first
ALTER TABLE conversation_messages
ADD COLUMN citations JSONB;

-- Backfill with empty arrays (optional)
UPDATE conversation_messages
SET citations = '[]'::jsonb
WHERE citations IS NULL;
```

---

**Version:** 1.0
**Last Updated:** 2025-11-14
