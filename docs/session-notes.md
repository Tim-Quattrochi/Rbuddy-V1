# Session Notes

## Session Information


**Current state on production (vercel):**

Build fails with the following error. This was observed after pushing this commit: `45890ae fix(api): add concrete chat endpoints (send/history/clear) and rewrites to avoid 405; ensure POST reaches handler`

**Here is the exact error from the vercel build logs:**
```bash
19:13:06.126 
Error: No more than 12 Serverless Functions can be added to a Deployment on the Hobby plan. Create a team (Pro plan) to deploy more. Learn More: https://vercel.link/function-count-limit
```

- **Date**: 10/13/2025
- **Mode**: Github Copilot GPT-5

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