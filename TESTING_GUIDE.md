# Testing Guide - RAG Agent Chat SaaS

**Date:** 2025-11-15
**Purpose:** Verify all critical functionality is working after implementation fixes

---

## Prerequisites

Before testing, ensure the following are set up:

### 1. Database Setup ✅ Required

Your PostgreSQL database must be running. Check your `.env` file:
```bash
POSTGRES_URL=postgresql://dev_user:dev_password@localhost:5432/postgres_dev
```

**To start your database:**
```bash
# If using Docker (recommended):
docker run --name postgres-dev -e POSTGRES_PASSWORD=dev_password -e POSTGRES_USER=dev_user -p 5432:5432 -d postgres

# OR if using local PostgreSQL:
sudo service postgresql start  # Linux
brew services start postgresql  # macOS
```

**Verify database is running:**
```bash
psql -h localhost -U dev_user -d postgres_dev -c "SELECT version();"
```

### 2. Environment Variables ✅ Already Configured

Your `.env` file is already set up with:
- ✅ Database connection
- ✅ Better Auth secret
- ✅ Google OAuth credentials
- ✅ Google Gemini API key
- ✅ Admin email

### 3. Dependencies ✅ Already Installed

```bash
pnpm install  # Already done
```

---

## Automated Tests

### Test 1: TypeScript Compilation ✅ PASSING

```bash
pnpm typecheck
```

**Expected Result:** No errors
**Status:** ✅ PASSING (verified)

### Test 2: ESLint Code Quality ✅ PASSING

```bash
pnpm lint
```

**Expected Result:** ✓ No ESLint warnings or errors
**Status:** ✅ PASSING (verified)

### Test 3: Production Build

**IMPORTANT:** Database must be running first!

```bash
pnpm build
```

**Expected Result:**
- Migrations apply successfully
- Next.js builds without errors
- Output shows optimized production bundle

**If build fails:** Check database connection first

---

## Database Verification

### Test 4: Database Migrations

```bash
# Apply migrations
pnpm db:migrate

# Optional: Open Drizzle Studio to inspect database
pnpm db:studio
```

**Expected Result:**
- Migrations apply successfully
- Drizzle Studio opens at http://localhost:4983
- You can see tables: users, sessions, fileSearchStores, documents, conversations, messages

**Verify Tables Exist:**
```sql
-- Run in psql or Drizzle Studio
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public';
```

**Expected Tables:**
- user
- session
- account
- verification
- file_search_stores
- documents
- conversations
- messages

### Test 5: File Search Stores Initialization

```bash
# Initialize File Search stores for all 5 agents
pnpm init:stores
```

**Expected Result:**
```
Creating File Search stores for agents...
✓ Created store for research-assistant
✓ Created store for code-reviewer
✓ Created store for medical-advisor
✓ Created store for legal-consultant
✓ Created store for data-analyst
✅ All stores created successfully!
```

**Verify in Database:**
```bash
pnpm db:studio
# Check file_search_stores table - should have 5 rows
```

### Test 6: File Search Diagnostic

```bash
# Run diagnostic to verify File Search integration
pnpm diagnose:file-search
```

**Expected Result:**
```
=== File Search Diagnostic Tool ===

📊 Checking database stores...
Found 5 store(s) in database:

Store: research-assistant-store
  - Agent ID: research-assistant
  - Store ID: file-search-stores/xxx
  - Created: 2025-11-15...
  - Documents in DB: 0 (initially)
  ✅ Store exists in Gemini
```

---

## Manual UI Testing

Once automated tests pass, start the development server:

```bash
pnpm dev
```

### Test 7: Landing Page

**URL:** http://localhost:3000

**What to Check:**
- ✅ Page loads without errors
- ✅ Hero section displays with gradient background
- ✅ 5 agent cards are visible
- ✅ Each card shows: icon, name, category, description, tags
- ✅ "Start Chat" buttons work
- ✅ "Preview" buttons open modal with agent details
- ✅ Dark mode toggle works
- ✅ Footer links present (Privacy, Terms, etc.)

### Test 8: Authentication Flow

**URL:** http://localhost:3000

**What to Check:**
1. ✅ Click "Get Started" or "Sign In" button
2. ✅ Redirects to Google OAuth login
3. ✅ After login, redirects to /dashboard
4. ✅ User profile appears in header
5. ✅ Sign out button works

**Test Protected Routes:**
- Navigate to http://localhost:3000/dashboard (should redirect if not logged in)
- Navigate to http://localhost:3000/profile (should redirect if not logged in)
- Navigate to http://localhost:3000/chat/research-assistant (should redirect if not logged in)

### Test 9: Dashboard

**URL:** http://localhost:3000/dashboard (must be logged in)

**What to Check:**
- ✅ Dashboard loads without errors
- ✅ Shows all 5 agents
- ✅ Shows "Recent Conversations" (empty initially)
- ✅ "Start Chat" button for each agent works
- ✅ Navigation to chat works

### Test 10: Chat Interface

**URL:** http://localhost:3000/chat/research-assistant

**What to Check:**
1. ✅ Chat page loads without errors
2. ✅ Agent header shows correct agent (Research Assistant)
3. ✅ Starter prompts display (if no conversation history)
4. ✅ Can type a message in input box
5. ✅ Send button enabled when text present
6. ✅ Message appears in chat after sending
7. ✅ AI response streams in real-time
8. ✅ Response uses proper markdown formatting
9. ✅ No console errors in browser DevTools

**Test with File Search:**
- This requires uploading documents first (see Test 11)
- After uploading, ask: "What documents do I have?"
- AI should reference the uploaded documents

### Test 11: Document Upload (Admin Only)

**URL:** http://localhost:3000/documents

**What to Check:**
1. ✅ Documents page loads (for admin user)
2. ✅ Shows 5 agent tabs
3. ✅ Can select agent (Research Assistant, etc.)
4. ✅ "Upload Document" button visible
5. ✅ Click upload, file picker opens
6. ✅ Select a PDF, DOCX, or TXT file
7. ✅ Upload progress shows
8. ✅ Document appears in list after upload
9. ✅ Status changes: uploading → processing → ready
10. ✅ Can delete document

**File Upload Test Files:**
- PDF: Any research paper or documentation
- DOCX: Any Word document
- TXT: Any text file
- Max size: 100MB per file

**Verify in Database:**
```bash
pnpm db:studio
# Check documents table - should show uploaded files
```

### Test 12: Citations (Backend Verification)

**What to Test:**
1. Upload a document to an agent (e.g., Research Assistant)
2. Wait for status to show "ready"
3. Go to chat with that agent
4. Ask a question about the document content
5. Check server logs for citation extraction

**Expected in Server Logs:**
```
[INFO] Citations extracted successfully {
  agentId: 'research-assistant',
  citationCount: 3,
  documentNames: ['your-document.pdf', ...]
}
```

**Note:** Citations are currently logged on backend only. Frontend integration blocked by AI SDK v5 limitations. This is documented as a known limitation.

### Test 13: Conversation Persistence

**What to Test:**
1. Send several messages in a chat
2. Refresh the page
3. ✅ Conversation history loads
4. ✅ Previous messages display correctly
5. ✅ Can continue conversation
6. Navigate to dashboard
7. ✅ Recent conversation appears in list
8. Click on conversation
9. ✅ Returns to chat with full history

### Test 14: Profile Page

**URL:** http://localhost:3000/profile

**What to Check:**
- ✅ Profile page loads
- ✅ Shows user information (from Google OAuth)
- ✅ Shows email, name, avatar
- ✅ Profile settings work (if implemented)

### Test 15: Error Handling

**What to Test:**

**1. Network Error:**
- Stop the development server
- Try to send a chat message
- ✅ Error message displays
- ✅ Retry button appears

**2. Rate Limiting:**
- Send 30+ messages rapidly
- ✅ Rate limit message appears
- ✅ Shows X-RateLimit headers

**3. File Upload Errors:**
- Try to upload file > 100MB
- ✅ Error message displays
- Try to upload unsupported file type
- ✅ Error message displays

**4. Invalid Routes:**
- Navigate to http://localhost:3000/invalid-route
- ✅ 404 page displays

---

## Backend API Testing

You can test API endpoints directly using curl or Postman:

### Test 16: Chat API Endpoint

```bash
# Note: You need a valid session cookie
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{
    "messages": [{"role": "user", "content": "Hello"}],
    "agentId": "research-assistant"
  }'
```

**Expected Result:**
- Stream response starts
- AI response returns
- No errors

### Test 17: Conversations API

```bash
# Get conversations (requires authentication)
curl http://localhost:3000/api/conversations?agentId=research-assistant \
  -H "Cookie: your-session-cookie"
```

**Expected Result:**
- Returns JSON array of conversations
- Each has: id, agentId, title, createdAt, updatedAt

---

## Performance Testing

### Test 18: Page Load Times

**What to Check:**
1. Open Chrome DevTools → Network tab
2. Navigate to various pages
3. Check "Load" time (should be < 3 seconds)
4. Check "DOMContentLoaded" time

**Expected Results:**
- Landing page: < 2 seconds
- Dashboard: < 1.5 seconds
- Chat page: < 2 seconds

### Test 19: Chat Response Time

**What to Check:**
1. Send a simple message
2. Measure time to first token
3. Measure time to complete response

**Expected Results:**
- First token: < 2 seconds
- Complete response: 3-10 seconds (depends on length)

### Test 20: File Upload Speed

**What to Check:**
1. Upload a 10MB PDF
2. Monitor upload progress
3. Monitor processing status changes

**Expected Results:**
- Upload: 5-15 seconds (depends on network)
- Processing: 10-30 seconds (Gemini indexing)

---

## Security Testing

### Test 21: Authentication Security

**What to Test:**

**1. Protected Routes:**
```bash
# Try accessing protected route without auth
curl http://localhost:3000/api/conversations
# Expected: 401 Unauthorized or redirect
```

**2. Session Validation:**
- Sign in
- Copy session cookie
- Sign out
- Try to use old cookie
- ✅ Should be rejected

**3. CSRF Protection:**
- Better Auth handles this automatically
- Verify no warnings in console

### Test 22: File Upload Security

**What to Test:**

**1. File Type Validation:**
- Upload a .exe file
- ✅ Should be rejected

**2. File Size Validation:**
- Upload a file > 100MB
- ✅ Should be rejected

**3. Ownership Validation:**
- User A uploads document
- User B tries to delete User A's document
- ✅ Should be rejected (403 Forbidden)

---

## Known Limitations & Expected Behavior

### ✅ Working As Expected:
1. TypeScript compilation passes
2. ESLint passes
3. Citation extraction works on backend
4. Logger utility replaces console.error
5. File Search integration functional
6. Database schema complete
7. Authentication server-side validation

### ⚠️ Known Limitations:
1. **Citations not visible in frontend** - AI SDK v5 doesn't support StreamData
   - Backend extraction works ✅
   - Logged in server console ✅
   - Frontend integration pending SDK update

2. **Chat page uses Client Component** - Server Component migration pending
   - Still secure (API validates auth) ✅
   - Best practice migration planned

---

## Quick Health Check Script

Save this as `check-health.sh`:

```bash
#!/bin/bash
echo "🔍 Running Health Checks..."
echo ""

echo "1. TypeScript Check..."
pnpm typecheck && echo "✅ TypeScript OK" || echo "❌ TypeScript Failed"
echo ""

echo "2. Lint Check..."
pnpm lint && echo "✅ Lint OK" || echo "❌ Lint Failed"
echo ""

echo "3. Database Connection..."
psql -h localhost -U dev_user -d postgres_dev -c "SELECT 1;" > /dev/null 2>&1 && echo "✅ Database OK" || echo "❌ Database Not Running"
echo ""

echo "4. Environment Variables..."
[ -f .env ] && echo "✅ .env exists" || echo "❌ .env missing"
[ ! -z "$GOOGLE_GENERATIVE_AI_API_KEY" ] && echo "✅ Gemini API Key set" || echo "⚠️  Gemini API Key not loaded"
echo ""

echo "🎉 Health check complete!"
```

Make it executable:
```bash
chmod +x check-health.sh
./check-health.sh
```

---

## Troubleshooting

### Issue: Build Fails with Database Connection Error

**Solution:**
1. Ensure PostgreSQL is running
2. Check `.env` POSTGRES_URL is correct
3. Test connection: `psql -h localhost -U dev_user -d postgres_dev`

### Issue: File Upload Fails

**Solution:**
1. Check GOOGLE_GENERATIVE_AI_API_KEY is set
2. Verify API key is valid at https://aistudio.google.com/app/apikey
3. Check Gemini API quota hasn't been exceeded
4. Ensure File Search stores are initialized: `pnpm init:stores`

### Issue: Citations Not Appearing in Chat

**Expected Behavior:**
- Citations are currently extracted on backend only
- Check server logs for: "Citations extracted successfully"
- Frontend display blocked by AI SDK v5 limitations
- This is documented as a known limitation

### Issue: Chat Responses Are Slow

**Check:**
1. Network connection
2. Gemini API quota
3. Model being used (check GEMINI_MODEL in .env)
4. Try: `GEMINI_MODEL="gemini-2.5-flash"` for faster responses

---

## Next Steps After Testing

If all tests pass:

1. ✅ **Code is production-ready** (with known limitations documented)
2. 🚀 **Deploy to Vercel/production**
3. 📊 **Set up monitoring** (Sentry, LogRocket, etc.)
4. 🔐 **Review security** one final time before public launch

If tests fail:
1. Check "Troubleshooting" section above
2. Review error messages carefully
3. Check server logs and browser console
4. Refer to implementation documentation in `/specs`

---

**Last Updated:** 2025-11-15
**Author:** Claude Code
