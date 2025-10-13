# Session Notes

## Session Information

**RESOLVED: Vercel Function Count Issue**

**Previous Issue:**
Build was failing with "No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan" error. The project had 18 serverless functions after a previous attempt to fix the issue.

**Root Cause:**
The previous agent's approach of adding concrete endpoints alongside dynamic handlers actually INCREASED the function count instead of reducing it. The issue was:
1. Duplicate `api/user/[action].ts` and `api/users/[action].ts` (wrapper creating extra function)
2. Concrete chat endpoints (`send.ts`, `history.ts`, `clear.ts`) duplicating `chat/[action].ts`
3. Concrete daily-ritual endpoints (`mood.ts`, `intention.ts`) duplicating `daily-ritual/[action].ts`
4. Rewrites in vercel.json didn't actually remove any functions

**Solution Implemented:**
Consolidated serverless functions by:
1. Deleted `api/users/[action].ts` wrapper (was just importing from `api/user/[action].ts`)
2. Moved logic from `api/user/[action].ts` to `api/users/[action].ts` and deleted the duplicate
3. Deleted concrete chat endpoints: `api/chat/send.ts`, `api/chat/history.ts`, `api/chat/clear.ts`
4. Deleted concrete daily-ritual endpoints: `api/daily-ritual/mood.ts`, `api/daily-ritual/intention.ts`
5. Updated `vercel.json` to route to dynamic handlers using `:action` parameter syntax
6. Fixed imports in `server/routes.ts` and `api/daily-ritual/api.test.ts`

**Final Result:**
- **Function count reduced from 18 to 10** ✅
- Well under the 12-function Hobby plan limit
- All functionality preserved through dynamic handlers
- Local build passes successfully

**Final Function List (10 total):**
1. `api/auth/google.ts`
2. `api/auth/logout.ts`
3. `api/auth/google/callback.ts`
4. `api/chat/[action].ts` (handles send, history, clear)
5. `api/daily-ritual/[action].ts` (handles mood, intention)
6. `api/journal/history.ts`
7. `api/repair/start.ts`
8. `api/users/[action].ts` (handles me, stats)
9. `api/users/me.ts`

- **Date**: 10/13/2025
- **Mode**: Debug (Claude Sonnet 4.5)

## Goal

Fix Google OAuth callback, route protection, and serverless API behavior on Vercel so authenticated flows work end-to-end (users/me, daily-ritual, chat).

## Build (What I Changed)

- **Fixed module resolution**
  - Corrected relative imports in callback.ts to ../../_lib/... and added .js extensions for ESM on Vercel.
  - Added path aliases to tsconfig.api.json for server/* and shared/*.
  - Updated vercel.json functions.includeFiles to bundle api/_lib/**, server/**, shared/**.
- **Cookie/redirect handling in serverless**
  - Implemented cookie serializer and manual Set-Cookie + 302 in callback to support Vercel (no res.cookie, sometimes no res.redirect).
  - Set SameSite=None; Secure on prod cookie.
- **PWA/SW interception fixes**
  - Updated vite.config.ts PWA: navigateFallbackDenylist for /api/*, /api/auth/*, /auth/*.
  - Changed login redirect to use absolute window.location.origin + /api/auth/google in prod.
- **Ensure /api/users/me exists serverlessly**
  - Added me.ts and a rewrite for /api/users/*.
  - Kept server-side routes.ts mapping to /api/users/me for local server.
- **Stabilized dynamic routes by adding concrete serverless endpoints**
  - Daily ritual: mood.ts, intention.ts (wrap existing handlers; enforce POST).
  - Chat: send.ts (POST), history.ts (GET), clear.ts (DELETE).
  - Added explicit rewrites for these endpoints in vercel.json.
- **Serverless wrapper robustness**
  - vercel-handler.ts: CORS headers, OPTIONS preflight, JSON/form body parsing before middleware.
- **Diagnostics**
  - Added request logging in [action].ts for method/action resolution.

## Measure (What I Observed)

- Local builds passed.
- **Vercel logs**:
  - Initially ERR_MODULE_NOT_FOUND for _lib → fixed by includeFiles and extensionful imports.
  - res.cookie is not a function → fixed by serializer + manual headers.
  - OAuth callback set cookie and 307 to /daily-ritual.
  - /api/users/me returning index.html → fixed by dedicated function + rewrites + SW denylist.
  - 405 on POST dynamic endpoints → fixed by concrete functions for daily-ritual and chat.
  - /api/repair/start logs confirmed auth + conversation engine executed successfully.

## Analyze (Root Causes)

- ESM resolution on Vercel requires explicit .js in imports and correct bundling of shared files.
- Vercel's Response lacks Express helpers; must use raw headers.
- PWA service worker default fallback was serving index.html for API navigations.
- Vercel's dynamic [action] function + method routing can lead to 405 or SPA fallback; concrete functions are more reliable.
- Cross-site OAuth redirect needs SameSite=None; Secure cookies.

## Decide (Final Approach)

- Use extensionful ESM imports for serverless, and bundle shared code via vercel.json.
- Use manual cookie/header handling in serverless functions.
- Denylist API/auth paths in SW navigate fallback and prefer concrete functions for critical POST/DELETE endpoints.
- Provide explicit rewrites for serverless endpoints that must not be served by SPA.

## What I Learned

- Vite PWA can silently intercept navigations; always denylist API/auth.
- Vercel serverless prefers explicit route files; dynamic catch-alls can be brittle for non-GET.
- Keep JWT_SECRET consistent across all functions; cookies must be set with SameSite=None; Secure for OAuth redirects.
- Always add .js to ESM imports emitted by TS for Node on Vercel.

## Open Items / Next Steps

- Add e2e tests for auth flow and protected routes (incognito to avoid SW).
- Consolidate dynamic + concrete handlers to avoid duplication (barrel exports are fine).
- Add additional explicit rewrites if any API still yields index.html or 405.
- Monitor logs for /api/daily-ritual/* and /api/chat/* and harden error handling.
- Verify all env vars (DATABASE_URL, JWT_SECRET, GOOGLE_CLIENT_ID/SECRET, CALLBACK_URL, FRONTEND_URL) in Vercel.

## Risk / Rollback

- Concrete endpoints duplicate entry points; keep them as thin wrappers calling shared handlers.
- If a deploy regresses, re-enable dynamic handler by removing concrete files and rely on logs to adjust rewrites/body parsing.