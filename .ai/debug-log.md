# Debug Log

This file tracks bugs, issues, and their resolutions for the rBuddy-v1 project.

---

## 2025-10-15: Google OAuth Callback Failing in Vercel Production (2-Part Fix)

**Status**: ✅ RESOLVED (Required 2 fixes)

### Issue 1: `TypeError: next is not a function`

**Description**: Google OAuth sign-in worked locally but failed in Vercel production deployment with serverless function crash:
```
TypeError: next is not a function
    at attempt (/var/task/node_modules/passport/lib/middleware/authenticate.js:193:34)
```

**Root Cause**: OAuth callback handler wasn't using `createVercelHandler` wrapper. Vercel provides `(req, res)` but passport needs `(req, res, next)`.

**Fix 1** (Commit `2aefb02`): Wrapped default export with `createVercelHandler(middlewares)`

---

### Issue 2: `Error: Unknown authentication strategy "google"` (REGRESSION from Fix 1)

**Description**: After applying Fix 1, new error appeared in Vercel production:
```
Middleware error: Error: Unknown authentication strategy "google"
    at passport/lib/middleware/authenticate.js:193:39
```

**Root Cause**: Each Vercel serverless function is **completely isolated**. The Passport Google strategy configured in `api/auth/google.ts` is NOT available to `api/auth/google/callback.ts`.

**Why It Worked Before**: Unknown - possibly older Vercel behavior or different routing mechanism that somehow shared state.

**Why It Broke After Fix 1**: When we wrapped the handler with `createVercelHandler`, the proper function isolation kicked in, exposing the missing strategy configuration.

**Fix 2** (This commit): Added inline Passport strategy configuration to the callback handler:
```typescript
// api/auth/google/callback.ts
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../../_lib/storage.js';

// Configure Passport inline for serverless (each Vercel function is isolated)
passport.use(new GoogleStrategy({
  clientID: GOOGLE_CLIENT_ID!,
  clientSecret: GOOGLE_CLIENT_SECRET!,
  callbackURL: CALLBACK_URL,
  scope: ['profile', 'email'],
}, async (accessToken, refreshToken, profile, done) => {
  // ... strategy implementation
}));
```

### Complete Solution

**Both fixes are required**:

1. **Fix 1**: Wrap handler with `createVercelHandler` (provides `next` function)
   ```typescript
   export default createVercelHandler(middlewares);
   ```

2. **Fix 2**: Add inline Passport strategy configuration (provides strategy in isolated function)
   ```typescript
   passport.use(new GoogleStrategy({ ... }));
   ```

### Files Modified
- `api/auth/google/callback.ts` - Added `createVercelHandler` wrapper (Fix 1) + inline Passport strategy (Fix 2)
- `api/auth/auth.test.ts` - Fixed imports and passport mocks

### Verification
- ✅ TypeScript compilation: `npm run check`
- ✅ OAuth tests passing: `npm test -- api/auth/auth.test.ts` (4/4 passed)
- ✅ Build succeeded: `npm run build`

### Key Lesson

**Vercel Serverless Isolation**: Each API endpoint is a completely isolated Lambda function with NO shared state. Any configuration (Passport strategies, middleware setup, etc.) must be done within the same file that uses it.

### References
- Full fix documentation: `docs/OAUTH_CALLBACK_FIX.md`
- Dual-export pattern: `docs/vercel-deployment.md`
- Passport isolation note: `docs/vercel-deployment.md` (line 355-357)

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
