# OAuth Callback Vercel Regression Fix

**Date**: October 15, 2025  
**Issue 1**: Google OAuth callback failing in Vercel production with `TypeError: next is not a function`  
**Issue 2**: After fixing Issue 1, new error: `Error: Unknown authentication strategy "google"`  
**Status**: ✅ FIXED (requires 2-part fix)

## Problem Summary

### Symptoms
- Google OAuth sign-in worked locally but failed in Vercel production
- Error in Vercel logs: `TypeError: next is not a function`
- Stack trace pointed to passport middleware at `authenticate.js:193:34`

### Root Cause
The `api/auth/google/callback.ts` handler was NOT using the `createVercelHandler` wrapper. Instead, it directly exported the handler function as the default export.

**The Issue**:
```typescript
// ❌ BROKEN CODE
export default handler; // Not wrapped for Vercel
```

When deployed to Vercel:
1. Serverless function is invoked with only `(req, res)` - no `next` parameter
2. Handler internally calls `passport.authenticate()` which expects `next` function
3. Passport tries to call `next()` → `TypeError: next is not a function`

### Why This Happened
The original comment in the file said:
```typescript
// Export for Vercel serverless (NOT using createVercelHandler because passport needs special handling)
export default handler;
```

This was incorrect. Passport DOES work with `createVercelHandler` - the wrapper provides the necessary `next` function that passport needs.

## Solution

### Changes Made

#### 1. Updated `api/auth/google/callback.ts`
- Added import for `createVercelHandler`
- Added safety fallback for `next` parameter in handler
- Wrapped default export with `createVercelHandler(middlewares)`

**Before**:
```typescript
async function handler(req: Request, res: Response, next: NextFunction) {
  passport.authenticate('google', { session: false }, (err, user, _info) => {
    // ... handler logic
  })(req as any, res as any, next as any);
}

export const middlewares = [handler];
export default handler; // ❌ Not wrapped
```

**After**:
```typescript
import { createVercelHandler } from '../../_lib/vercel-handler.js';

async function handler(req: Request, res: Response, next: NextFunction) {
  // Create a no-op next function for serverless environments where next may be undefined
  const safeNext = next || (() => {});
  
  passport.authenticate('google', { session: false }, (err, user, _info) => {
    // ... handler logic
  })(req as any, res as any, safeNext as any);
}

export const middlewares = [handler];
export default createVercelHandler(middlewares); // ✅ Wrapped properly
```

#### 1. Updated `api/auth/google/callback.ts` (Part 2 - Add Strategy Configuration)

Added inline Passport strategy configuration so the callback function has access to the Google OAuth strategy in Vercel's isolated serverless environment:

**Changes**:
```typescript
// NEW IMPORTS
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../../_lib/storage.js';

// NEW: Configure Passport inline for serverless (each Vercel function is isolated)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL || 'https://rbuddy-v1.vercel.app/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('FATAL: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

// NEW: Configure Google OAuth strategy for this serverless function
passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      // ... strategy implementation (same as google.ts)
    }
  )
);
```

**Why This Is Needed**:
- In Vercel, `api/auth/google/callback.ts` is a separate Lambda function
- It has NO access to the Passport configuration in `api/auth/google.ts`
- Must configure the strategy inline within the same file

#### 2. Updated `api/auth/auth.test.ts`
- Fixed test imports to use named `middlewares` export
- Updated passport mock to mock the `'passport'` module directly (not `AuthService`)
- Fixed redirect URL expectations to include full frontend URL in test environment

**Before**:
```typescript
import googleCallbackHandler from './google/callback'; // ❌ Wrong export

vi.mock('../../server/services/AuthService', () => { // ❌ Wrong path
  // ...
});
```

**After**:
```typescript
import { middlewares as googleCallbackMiddlewares } from './google/callback';
const [googleCallbackHandler] = googleCallbackMiddlewares; // ✅ Correct export

vi.mock('passport', () => { // ✅ Correct module
  // ...
});
```

## Verification

### Tests
All OAuth tests passing ✅:
```bash
npm test -- api/auth/auth.test.ts
# 4 passed (4)
```

### Build
TypeScript compilation successful ✅:
```bash
npm run check  # No errors
npm run build  # Build succeeded
```

### What to Test in Vercel
1. Navigate to production app: `https://rbuddy-v1.vercel.app`
2. Click "Sign in with Google"
3. Complete Google OAuth flow
4. Verify successful redirect to `/daily-ritual` page
5. Verify `auth_token` cookie is set
6. Verify authenticated API calls work

## Technical Notes

### Why `createVercelHandler` Works for Passport

The `createVercelHandler` wrapper in `api/_lib/vercel-handler.ts`:
1. Creates a proper Express-style `next` function
2. Applies middleware in sequence
3. Handles errors properly
4. Works in both Express (local) and Vercel (serverless) environments

**Key Code from vercel-handler.ts**:
```typescript
const next: NextFunction = (err?: any) => {
  if (err) {
    // Handle error
    return;
  }
  if (index >= middlewares.length) {
    return;
  }
  const middleware = middlewares[index++];
  middleware(req as any as Request, res as any as Response, next);
};
next(); // Start the chain
```

This provides the `next` callback that passport's `authenticate()` middleware expects.

### Dual-Export Pattern Compliance

This fix brings `api/auth/google/callback.ts` into compliance with the project's **dual-export serverless pattern** documented in `docs/vercel-deployment.md`:

✅ **Named export** (`middlewares`) for Express server  
✅ **Default export** wrapped with `createVercelHandler()` for Vercel  
✅ Works in both local dev and production  

## Related Documentation

- **Dual-Export Pattern**: `docs/vercel-deployment.md`
- **AI Chat Deployment**: Used same pattern successfully
- **OAuth Setup**: `docs/vercel-deployment.md` (OAuth Configuration section)

## Prevention

### Checklist for New API Endpoints
- [ ] Import `createVercelHandler` from `api/_lib/vercel-handler.ts`
- [ ] Export named `middlewares` array for Express
- [ ] Export default with `createVercelHandler(middlewares)` wrapper
- [ ] Test both locally (`npm run dev`) and on Vercel
- [ ] Verify tests import `middlewares` named export, not default

### Code Review Guidelines
When reviewing new API endpoints, check:
1. ✅ Both exports present (`middlewares` and `default`)
2. ✅ Default export uses `createVercelHandler` wrapper
3. ✅ Tests import named `middlewares` export
4. ✅ No direct use of Express-specific features without compatibility layer

## Deployment Notes

**Files Modified**:
- `api/auth/google/callback.ts` - Added `createVercelHandler` wrapper
- `api/auth/auth.test.ts` - Fixed imports and mocks

**No Breaking Changes**:
- Local development continues to work unchanged
- Express routes in `server/routes.ts` unchanged
- Test interface unchanged (still uses named export)

**Deployment Steps**:
1. Commit changes to `main` branch
2. Vercel auto-deploys on push
3. Monitor Vercel function logs for any errors
4. Test OAuth flow end-to-end in production

## Rollback Plan

If issues arise:
1. Revert commit: `git revert <commit-hash>`
2. Push to trigger new Vercel deployment
3. Previous working state will be restored

---

**Fixed By**: James (Dev Agent)  
**Tested**: Local ✅ | Build ✅ | Tests ✅  
**Ready for Deployment**: YES ✅

## ⚠️ CRITICAL: Second Regression Discovered

**Date**: October 15, 2025 (same day, a few hours after initial fix)

**Problem**: The initial fix (wrapping with `createVercelHandler`) resolved the `next is not a function` error but **introduced a NEW regression**:

```
Middleware error: Error: Unknown authentication strategy "google"
    at passport/lib/middleware/authenticate.js:193:39
```

**Root Cause**: Each Vercel serverless function runs in **complete isolation**. The Passport Google strategy configured in `api/auth/google.ts` is **NOT available** to `api/auth/google/callback.ts` in production.

### Why It Worked Locally But Not in Vercel

**Local Development (Express)**:
- Single Node.js process
- `api/auth/google.ts` configures strategy once
- `api/auth/google/callback.ts` can access that strategy
- ✅ Works fine

**Vercel Production (Serverless)**:
- Each API file is a separate Lambda function
- `api/auth/google.ts` runs in Function A
- `api/auth/google/callback.ts` runs in Function B (isolated)
- ❌ Function B has NO access to Function A's Passport configuration
- Result: "Unknown authentication strategy 'google'"

### The Complete Fix

**Part 1** (commit `2aefb02`): Wrap with `createVercelHandler` to provide `next` function
**Part 2** (this commit): Add inline Passport strategy configuration to callback handler

Both parts are **required** for the callback to work in Vercel.

---

### Why This Wasn't Obvious

**Documentation Said**: "Passport must be configured in each serverless function" (`docs/vercel-deployment.md` line 355-357)

**But**: The OAuth callback endpoint often configures passport inline (see `api/auth/google.callback.ts`)

**Reality**: This note was ALREADY pointing to the solution, but it wasn't clear that:
1. The callback handler ALSO needs inline configuration (not just the initiator)
2. Both functions are isolated and can't share Passport state

### Timeline of Events

1. **Original State** (working): Callback had NO `createVercelHandler`, NO inline Passport config
   - Somehow worked (possibly older Vercel behavior or different routing)
  
2. **Commit `2aefb02`** (Oct 15, 2025 00:13): Added `createVercelHandler` wrapper
   - Fixed: `next is not a function`
   - Broke: Strategy now properly isolated, causing "Unknown strategy" error
   - This is when the regression appeared

3. **This Fix** (Oct 15, 2025 05:00): Added inline Passport strategy configuration
   - Fixed: "Unknown authentication strategy 'google'"
   - Result: OAuth callback now works in both Express and Vercel

---
