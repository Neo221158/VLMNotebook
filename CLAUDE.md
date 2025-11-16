# Agentic Coding Boilerplate - AI Assistant Guidelines

## Project Overview

This is a Next.js 15 boilerplate for building AI-powered applications with authentication, database, and modern UI components.

### Tech Stack

- **Framework**: Next.js 15 with App Router, React 19, TypeScript
- **AI Integration**: Vercel AI SDK 5 + Google Gemini (with File Search for RAG)
- **Authentication**: BetterAuth with Google OAuth
- **Database**: PostgreSQL with Drizzle ORM
- **UI**: shadcn/ui components with Tailwind CSS 4
- **Styling**: Tailwind CSS with dark mode support (next-themes)

## AI Integration with Google Gemini

### Key Points

- This project uses **Google Gemini** as the AI provider with built-in File Search for RAG
- Gemini File Search provides fully managed RAG without needing separate vector databases
- Default model: `gemini-2.5-flash` (configurable via `GEMINI_MODEL` env var)
- Supported models for File Search: `gemini-2.5-pro`, `gemini-2.5-flash`
- Get API keys from: https://aistudio.google.com/apikey
- File Search documentation: https://ai.google.dev/gemini-api/docs/file-search

### AI Implementation Files

- `src/app/api/chat/route.ts` - Chat API endpoint using Google Gemini
- Package: `@ai-sdk/google` (not `@ai-sdk/openai`)
- Import: `import { createGoogleGenerativeAI } from "@ai-sdk/google"`

### File Search RAG Capabilities

- Upload documents (PDF, DOCX, TXT, JSON, code files) up to 100MB each
- Automatic chunking, embedding generation, and semantic search
- Built-in citations showing which documents informed the response
- Persistent storage with metadata filtering
- Free storage and query embeddings (only pay for indexing: $0.15/1M tokens)

### IMPORTANT: Document-Only RAG Configuration

⚠️ **Critical Discovery (2025-11-15):** Google Gemini File Search does **NOT** have a built-in "strict mode" that restricts the model to only use uploaded documents.

**How File Search Actually Works:**
- File Search is designed as **Retrieval-Augmented Generation (RAG)**
- It *supplements* the model's responses with uploaded documents
- It does **NOT** *prevent* the model from using its general training knowledge
- Think of it as "grounding + general knowledge" rather than "grounding only"

**Our Solution:**
To enforce document-only responses, we use **very explicit system prompts** in `src/lib/agent-prompts.ts`:

```typescript
CRITICAL INSTRUCTION - DOCUMENT-ONLY RESPONSES:
You MUST ONLY use information that is explicitly found in the uploaded documents
provided to you through File Search. DO NOT use your general knowledge, training
data, or any external information sources.
```

**Limitations:**
- LLMs are not 100% deterministic - the model may occasionally reference general knowledge
- Always monitor citations to verify the model is using uploaded documents
- For production use cases requiring strict document-only responses, test thoroughly

**References:**
- [Gemini File Search Docs](https://ai.google.dev/gemini-api/docs/file-search)
- [Gemini Grounding Options](https://ai.google.dev/gemini-api/docs/grounding)

## Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── api/
│   │   ├── auth/[...all]/       # Better Auth catch-all route
│   │   ├── chat/route.ts        # AI chat endpoint (Google Gemini)
│   │   └── diagnostics/         # System diagnostics
│   ├── chat/page.tsx            # AI chat interface (protected)
│   ├── dashboard/page.tsx       # User dashboard (protected)
│   ├── profile/page.tsx         # User profile (protected)
│   ├── page.tsx                 # Home/landing page
│   └── layout.tsx               # Root layout
├── components/
│   ├── auth/                    # Authentication components
│   │   ├── sign-in-button.tsx
│   │   ├── sign-out-button.tsx
│   │   └── user-profile.tsx
│   ├── ui/                      # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── dialog.tsx
│   │   ├── dropdown-menu.tsx
│   │   ├── avatar.tsx
│   │   ├── badge.tsx
│   │   ├── separator.tsx
│   │   ├── mode-toggle.tsx      # Dark/light mode toggle
│   │   └── github-stars.tsx
│   ├── site-header.tsx          # Main navigation header
│   ├── site-footer.tsx          # Footer component
│   ├── theme-provider.tsx       # Dark mode provider
│   ├── setup-checklist.tsx      # Setup guide component
│   └── starter-prompt-modal.tsx # Starter prompts modal
└── lib/
    ├── auth.ts                  # Better Auth server config
    ├── auth-client.ts           # Better Auth client hooks
    ├── db.ts                    # Database connection
    ├── schema.ts                # Drizzle schema (users, sessions, etc.)
    └── utils.ts                 # Utility functions (cn, etc.)
```

## Environment Variables

Required environment variables (see `env.example`):

```env
# Database
POSTGRES_URL=postgresql://user:password@localhost:5432/db_name

# Better Auth
BETTER_AUTH_SECRET=32-char-random-string

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# AI via Google Gemini
GOOGLE_GENERATIVE_AI_API_KEY=your-api-key-here
GEMINI_MODEL=gemini-2.5-flash  # or gemini-2.5-pro

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Available Scripts

```bash
npm run dev          # Start dev server (DON'T run this yourself - ask user)
npm run build        # Build for production (runs db:migrate first)
npm run start        # Start production server
npm run lint         # Run ESLint (ALWAYS run after changes)
npm run typecheck    # TypeScript type checking (ALWAYS run after changes)
npm run db:generate  # Generate database migrations
npm run db:migrate   # Run database migrations
npm run db:push      # Push schema changes to database
npm run db:studio    # Open Drizzle Studio (database GUI)
npm run db:dev       # Push schema for development
npm run db:reset     # Reset database (drop all tables)
```

## Documentation Files

The project includes technical documentation in `docs/`:

- `docs/technical/ai/streaming.md` - AI streaming implementation guide
- `docs/technical/ai/structured-data.md` - Structured data extraction
- `docs/technical/react-markdown.md` - Markdown rendering guide
- `docs/technical/betterauth/polar.md` - Polar payment integration
- `docs/business/starter-prompt.md` - Business context for AI prompts

## Guidelines for AI Assistants

### CRITICAL RULES

1. **ALWAYS run lint and typecheck** after completing changes:

   ```bash
   npm run lint && npm run typecheck
   ```

2. **NEVER start the dev server yourself**

   - If you need dev server output, ask the user to provide it
   - Don't run `npm run dev` or `pnpm dev`

3. **Use Google Gemini with File Search**

   - Import from `@ai-sdk/google`
   - Use `createGoogleGenerativeAI()` function
   - Model names: `gemini-2.5-flash` or `gemini-2.5-pro`
   - File Search only works with Gemini 2.5 models

4. **Styling Guidelines**

   - Stick to standard Tailwind CSS utility classes
   - Use shadcn/ui color tokens (e.g., `bg-background`, `text-foreground`)
   - Avoid custom colors unless explicitly requested
   - Support dark mode with appropriate Tailwind classes

5. **Authentication**

   - Server-side: Import from `@/lib/auth` (Better Auth instance)
   - Client-side: Import hooks from `@/lib/auth-client`
   - Protected routes should check session in Server Components
   - Use existing auth components from `src/components/auth/`

6. **Database Operations**

   - Use Drizzle ORM (imported from `@/lib/db`)
   - Schema is defined in `@/lib/schema`
   - Always run migrations after schema changes
   - PostgreSQL is the database (not SQLite, MySQL, etc.)

7. **Component Creation**

   - Use existing shadcn/ui components when possible
   - Follow the established patterns in `src/components/ui/`
   - Support both light and dark modes
   - Use TypeScript with proper types

8. **API Routes**
   - Follow Next.js 15 App Router conventions
   - Use Route Handlers (route.ts files)
   - Return Response objects
   - Handle errors appropriately

### Best Practices

- Read existing code patterns before creating new features
- Maintain consistency with established file structure
- Use the documentation files when implementing related features
- Test changes with lint and typecheck before considering complete
- When modifying AI functionality, refer to `docs/technical/ai/` guides

### Common Tasks

**Adding a new page:**

1. Create in `src/app/[route]/page.tsx`
2. Use Server Components by default
3. Add to navigation if needed

**Adding a new API route:**

1. Create in `src/app/api/[route]/route.ts`
2. Export HTTP method handlers (GET, POST, etc.)
3. Use proper TypeScript types

**Adding authentication to a page:**

1. Import auth instance: `import { auth } from "@/lib/auth"`
2. Get session: `const session = await auth.api.getSession({ headers: await headers() })`
3. Check session and redirect if needed

**Working with the database:**

1. Update schema in `src/lib/schema.ts`
2. Generate migration: `npm run db:generate`
3. Apply migration: `npm run db:migrate`
4. Import `db` from `@/lib/db` to query

**Modifying AI chat:**

1. Backend: `src/app/api/chat/route.ts`
2. Frontend: `src/app/chat/page.tsx`
3. Reference streaming docs: `docs/technical/ai/streaming.md`
4. Remember to use Google Gemini with File Search for RAG capabilities

## Package Manager

This project uses **pnpm** (see `pnpm-lock.yaml`). When running commands:

- Use `pnpm` instead of `npm` when possible
- Scripts defined in package.json work with `pnpm run [script]`
- please always remember to update the specs/rag-agent-chat-saas/implementation-plan.md file after you've done implenting. DONT create a new file.