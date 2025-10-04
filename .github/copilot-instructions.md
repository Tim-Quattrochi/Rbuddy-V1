<!-- Copilot instructions for AI coding agents working on Rbuddy-V1 -->
# Quick guide for AI coding agents

This repository is a full-stack TypeScript app (Vite + React client, Express server, Drizzle ORM). Use this file to get up to speed quickly and to make precise edits.

- Project roots and entry points:
  - Server: `server/index.ts` (registers routes, sets up Vite in development, serves static in production)
  - Routes bootstrap: `server/routes.ts` (returns HTTP server and is where API routes are mounted)
  - Storage: `server/storage.ts` (in-memory `MemStorage` implementing `IStorage` — replace with DB-backed implementation)
  - Client: `client/src/main.tsx` and `client/src/App.tsx` (React entry and routing); useful utilities: `client/src/lib/queryClient.ts`
  - Shared types/schema: `shared/schema.ts` (Drizzle table definitions and Zod types)

- Build / dev commands (from `package.json`):
  - dev: `npm run dev` — runs `tsx server/index.ts` (server + Vite in dev mode)
  - build: `npm run build` — builds client with Vite then bundles server with esbuild
  - start: `npm run start` — runs production build from `dist`
  - db:push: `npm run db:push` — runs `drizzle-kit push` to sync DB schema
  - check: `npm run check` — TypeScript typecheck (`tsc`)

- Environment notes:
  - `.env.example` exists as a template. The server uses `PORT` (defaults to 5000) and `DATABASE_URL` for Drizzle.
  - Dev server uses `app.get('env') === 'development'` to decide to run Vite middleware; ensure NODE_ENV is set to `development` when running `dev` locally if replicating behavior.

- Coding conventions and patterns to follow (observable in repo):
  - TypeScript-first: prefer typed interfaces for props and return values (see `client/components/*` and `shared/schema.ts`).
  - React: function components + hooks, use React Router for pages (`client/src/pages`).
  - Server routes should be prefixed with `/api` and use `express.json()`/`urlencoded()` middleware; logging middleware in `server/index.ts` captures `/api` responses.
  - Server-side storage is abstracted via `IStorage` in `server/storage.ts` — implement new storage classes rather than changing call sites.
  - Client API calls use fetch with credentials and the `getQueryFn` wrapper in `client/src/lib/queryClient.ts` (handles 401 behavior and default query options). Reuse `apiRequest` for mutations.

- What to change and where (examples):
  - Add a new API route: update `server/routes.ts` to mount a router (e.g., `app.use('/api/check-ins', checkInRouter)`), then add handlers in `server/api/check-ins.ts` (create new file).
  - Replace `MemStorage` with Drizzle-backed storage: implement `IStorage` in `server/storage.pg.ts` and swap exported `storage` to new implementation (preserve same method names: `getUser`, `getUserByUsername`, `createUser`).
  - Update client queries to use an absolute `import.meta.env.VITE_API_URL` only when running client separately; default behavior expects server and client served from same origin.

- Testing and checks:
  - Unit tests use Vitest/React Testing Library patterns (see examples in `AGENTS.md`), but there are no test files in the repo root — add tests under `client/src` or a `tests/` folder and wire `vitest` if needed.
  - Always run `npm run check` after changes to ensure TypeScript types remain clean.

- Safety and security:
  - Do not commit secrets. The repo includes an env template; expect secrets to be provided via environment variables.
  - The server uses `express-session`/`passport` in dependencies — if adding authentication, prefer `connect-pg-simple` with a secure session store in production.

- Quick examples (search for these files when making related edits):
  - Query defaults and API helpers: `client/src/lib/queryClient.ts`
  - Server logging / middleware: `server/index.ts`
  - Storage interface: `server/storage.ts`
  - Shared schemas/types: `shared/schema.ts`

If anything here is unclear or you need more examples (e.g., preferred folder for API handlers, test runner config), tell me which area you want expanded and I'll update this file.
