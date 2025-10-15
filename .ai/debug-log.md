# Debug Log

This file tracks bugs, issues, and their resolutions for the rBuddy-v1 project.

---

## 2025-10-15: Google OAuth Callback Failing in Vercel Production

**Status**: ✅ RESOLVED

### Issue Description
Google OAuth sign-in worked locally but failed in Vercel production deployment with serverless function crash:
```
TypeError: next is not a function
    at attempt (/var/task/node_modules/passport/lib/middleware/authenticate.js:193:34)
```

### Root Cause Analysis

**Location**: `api/auth/google/callback.ts`

**Problem**: The OAuth callback handler was NOT using the `createVercelHandler` wrapper. Instead, it directly exported the handler function:
```typescript
export default handler; // ❌ Not wrapped for Vercel
```

**Why it Failed**:
1. In Vercel, serverless functions receive only `(req, res)` parameters - no `next` function
2. The handler internally calls `passport.authenticate()` which expects Express middleware signature `(req, res, next)`
3. Passport tried to call `next()` → `TypeError: next is not a function`

**Why Local Dev Worked**: 
- Express server in local dev provides the `next` function
- Problem only surfaced in Vercel's serverless environment

### Solution Implemented

**Fix 1: Wrap Default Export**
```typescript
import { createVercelHandler } from '../../_lib/vercel-handler.js';

// Export for Vercel serverless (wrap to provide proper next function)
export default createVercelHandler(middlewares);
```

**Fix 2: Add Safety Fallback**
Added defensive `next` fallback in handler:
```typescript
const safeNext = next || (() => {});
passport.authenticate(...)(req, res, safeNext);
```

**Fix 3: Update Tests**
- Changed test imports from default export to named `middlewares` export
- Fixed passport mock to mock `'passport'` module directly (not `AuthService`)
- Updated redirect URL expectations to include full frontend URL

### Files Modified
- `api/auth/google/callback.ts` - Added `createVercelHandler` wrapper and safety fallback
- `api/auth/auth.test.ts` - Fixed imports and passport mocks

### Verification
- ✅ TypeScript compilation: `npm run check`
- ✅ OAuth tests passing: `npm test -- api/auth/auth.test.ts` (4/4 passed)
- ✅ Build succeeded: `npm run build`

### Technical Notes

**Dual-Export Pattern Compliance**:
This fix brings the OAuth callback into compliance with the project's dual-export serverless pattern:
- ✅ Named export (`middlewares`) for Express server
- ✅ Default export wrapped with `createVercelHandler()` for Vercel
- ✅ Works in both local dev and production

**Why `createVercelHandler` Works for Passport**:
The wrapper creates a proper Express-style `next` function that passport's `authenticate()` middleware expects, even in serverless environments where `next` isn't provided by the platform.

### References
- Full fix documentation: `docs/OAUTH_CALLBACK_FIX.md`
- Dual-export pattern: `docs/vercel-deployment.md`

---

## 2025-10-13: Google OAuth 404 After Backend Decoupling

**Status**: ✅ RESOLVED

### Issue Description
After decoupling the Express backend (port 5001) from the Vite frontend (port 5173), the Google OAuth flow was failing with 404 errors at two points:
1. Initial auth request to `/api/auth/google` showing 404 in frontend
2. Google callback redirect showing 404 after successful authentication

### Root Cause Analysis

**Problem 1: Initial Auth Request**
- Location: [client/src/pages/Login.tsx:26](../client/src/pages/Login.tsx#L26)
- Cause: Using `navigate("/api/auth/google")` (React Router client-side navigation)
- Impact: React Router tried to match `/api/auth/google` as a frontend route instead of making an HTTP request to the backend

**Problem 2: OAuth Callback Redirect**
- Location: [api/auth/google.callback.ts:98](../api/auth/google.callback.ts#L98)
- Cause: Backend redirecting to relative path `/daily-ritual` instead of full frontend URL
- Impact: After OAuth success, user stayed on `localhost:5001/daily-ritual` (backend) instead of being redirected to frontend

### Solution Implemented

**Fix 1: Login Component**
- Changed from: `navigate("/api/auth/google", { replace: true })`
- Changed to: `window.location.href = "/api/auth/google"`
- Result: Full browser redirect allows Vite proxy to forward request to backend

**Fix 2: OAuth Callback Handler**
- Added dynamic `frontendUrl` resolution:
  ```typescript
  const frontendUrl = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://rbuddy-v1.vercel.app'
    : 'http://localhost:5173';
  ```
- Updated all redirects to use full frontend URLs:
  - Success: `${frontendUrl}/daily-ritual`
  - Errors: `${frontendUrl}/login?error={error_code}`

**Fix 3: Code Cleanup**
- Removed unused imports: `useNavigate`, `Chrome` icon
- Replaced deprecated `Chrome` with `Mail` icon
- Prefixed unused callback parameter with underscore

### Files Modified
1. [client/src/pages/Login.tsx](../client/src/pages/Login.tsx)
2. [api/auth/google.callback.ts](../api/auth/google.callback.ts)

### Testing Results
- ✅ Initial OAuth flow redirects to Google correctly
- ✅ OAuth callback redirects to frontend `http://localhost:5173/daily-ritual`
- ✅ Auth token cookie set correctly
- ✅ User successfully authenticated

### Prevention Guidelines
1. **OAuth flows always require full browser redirects** - Never use React Router `navigate()` for external authentication endpoints
2. **Backend redirects in decoupled apps must use full URLs** - Relative paths keep users on the backend server
3. **Environment-aware URL handling** - Always check `NODE_ENV` to determine correct frontend URL (dev vs production)
4. **Vite proxy configuration** - Ensure proxy is properly configured in `vite.config.ts` for `/api` routes

### Related Configuration
- Vite Proxy: [vite.config.ts:129-135](../vite.config.ts#L129-L135)
- Environment: Backend on `localhost:5001`, Frontend on `localhost:5173`
- Callback URL: Set in `.env` as `http://localhost:5001/api/auth/google/callback`
