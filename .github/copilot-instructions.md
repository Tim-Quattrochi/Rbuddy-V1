<!-- Copilot instructions for AI coding agents working on Rbuddy-V1 -->
# Quick guide for AI coding agents

This repository is a full-stack TypeScript app (Vite + React client, Express/Vercel serverless backend, Drizzle ORM). Use this file to get up to speed quickly and to make precise edits.

## Critical Architecture Note (Updated Oct 2025)

⚠️ **DUAL-EXPORT SERVERLESS PATTERN**: This project uses a decoupled architecture:
- **Local dev**: Express server on port 5001 (`api/index.ts`)
- **Production**: Vercel serverless functions (each file in `api/` directory)
- **Pattern**: Each API endpoint exports BOTH `middlewares` (for Express) AND `default` (for Vercel)
- **DO NOT** treat `api/` files as duplicates - they ARE the source of truth for API endpoints
- **See**: `docs/vercel-deployment.md` for complete dual-export pattern documentation

## Project Structure

- Project roots and entry points:
  - **API Endpoints**: `api/` directory (dual-export pattern for Express + Vercel)
  - Server (local dev only): `api/index.ts` (Express server for local development)
  - Routes bootstrap: `server/routes.ts` (imports `middlewares` from `api/` files)
  - Storage: Database-backed via Drizzle ORM (PostgreSQL/Neon)
  - Client: `client/src/main.tsx` and `client/src/App.tsx` (React entry and routing)
  - Shared types/schema: `shared/schema.ts` (Drizzle table definitions and Zod types)

- Build / dev commands (from `package.json`):
  - dev: `npm run dev` — runs `tsx api/index.ts` (Express server + Vite in dev mode)
  - build: `npm run build` — builds client, API, and server for Vercel deployment
  - start: `npm run start` — runs production build from `dist`
  - db:push: `npm run db:push` — runs `drizzle-kit push` to sync DB schema
  - check: `npm run check` — TypeScript typecheck (`tsc`)
  - test: `npm run test` — runs Vitest test suite

- Environment notes:
  - `.env.example` exists as a template
  - Required vars: `DATABASE_URL`, `JWT_SECRET`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`
  - Vercel production vars configured in Vercel Dashboard
  - Dev server uses `NODE_ENV=development` to enable Vite middleware

## Coding Conventions

- TypeScript-first: prefer typed interfaces for props and return values (see `client/components/*` and `shared/schema.ts`).
- React: function components + hooks, use React Router for pages (`client/src/pages`).
- API endpoints: MUST use dual-export pattern (see `docs/vercel-deployment.md`):
  ```typescript
  export const middlewares = [requireAuth, handler];
  export default createVercelHandler(middlewares);
  ```
- Server routes in `server/routes.ts` import the **named** `middlewares` export
- Client API calls use fetch with credentials and the `getQueryFn` wrapper in `client/src/lib/queryClient.ts`

## How to Add New Features

- Add a new API endpoint:
  1. Create file in `api/` directory (e.g., `api/my-feature/endpoint.ts`)
  2. Follow dual-export pattern (see `docs/vercel-deployment.md`)
  3. Import in `server/routes.ts` using named `middlewares` export
  4. Example: `import { middlewares as myHandler } from '../api/my-feature/endpoint'`

- Add database table:
  1. Define in `shared/schema.ts` using Drizzle schema
  2. Run `npm run db:push` to sync schema
  3. Create migration file if needed in `migrations/`

- Add React component:
  1. Create in `client/src/components/` or feature-specific folder
  2. Use shadcn/ui components from `client/src/components/ui/`
  3. Follow existing patterns (see `client/src/pages/DailyRitual.tsx`)

## Testing

- Unit tests use Vitest + React Testing Library
- API tests use Vitest with supertest
- Run tests: `npm run test`
- Test files: `*.test.tsx` or `*.test.ts` co-located with source
- Always run `npm run check` after changes to ensure TypeScript types remain clean

## Security & Best Practices

- Authentication uses JWT tokens in `httpOnly` cookies
- All protected endpoints use `requireAuth` middleware
- Rate limiting implemented on chat endpoints (see `docs/CRITICAL_FIXES.md`)
- Input validation using Zod schemas
- Do not commit secrets - use environment variables

## Quick Reference

- Query defaults and API helpers: `client/src/lib/queryClient.ts`
- Auth middleware: `server/middleware/auth.ts`
- Rate limiting: `server/middleware/rateLimiter.ts`
- Storage interface: `server/storage.ts`
- Shared schemas/types: `shared/schema.ts`
- Vercel handler wrapper: `api/_lib/vercel-handler.ts`

## Important Documentation

- **Must read**: `docs/vercel-deployment.md` - Dual-export pattern for Vercel serverless
- API reference: `docs/architecture/6-api-design-and-integration.md`
- Project index: `docs/INDEX.md`
- Recent security fixes: `docs/CRITICAL_FIXES.md`
- AI Chat widget: `docs/ai-chat.md` (ad-hoc feature, not part of sprint stories)

## Ad-Hoc Features

**AI Chat Widget** - Implemented outside the formal story process:
- Floating chat widget available on authenticated pages
- Multi-provider support (OpenAI, Anthropic, Google Gemini)
- Context-aware with user mood, intentions, and streak data
- Rate-limited endpoints (20 messages/hour per user)
- Files: `api/chat/[action].ts`, `client/src/components/chat/FloatingChat.tsx`
- Docs: `docs/ai-chat.md`, `docs/ai-chat-architecture.md`
- Security fixes: `docs/CRITICAL_FIXES.md`

If anything here is unclear or you need more examples, refer to the docs above or ask for clarification.
