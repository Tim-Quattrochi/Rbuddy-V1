# OAuth Callback Vercel Regression Fix

**Date**: October 15, 2025  
**Issue**: Google OAuth callback failing in Vercel production with `TypeError: next is not a function`  
**Status**: ✅ FIXED

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
