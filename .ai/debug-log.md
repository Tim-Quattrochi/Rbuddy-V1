# Debug Log

This file tracks bugs, issues, and their resolutions for the rBuddy-v1 project.

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

---
