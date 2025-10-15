# Common Issues and Solutions

This document tracks recurring issues in the rBuddy-v1 project to help prevent future regressions.

---

## 🚨 Critical: `/api/user` vs `/api/users` Typo Pattern

### Issue Description

**Recurring Pattern**: Route paths inconsistently use `/api/user/...` instead of `/api/users/...`

This is a **RECURRING ISSUE** that has happened multiple times in the project lifecycle.

### Root Cause

- The API endpoint handlers are in `api/users/[action].ts` (note the plural)
- Frontend code calls `/api/users/stats` and `/api/users/me` (plural)
- Route registration in `server/routes.ts` has been accidentally typed as `/api/user/...` (singular)
- This causes 404 errors that are hard to debug because the endpoint *exists*, just at the wrong path

### Correct Pattern

**✅ ALWAYS USE PLURAL** in route paths:

```typescript
// ✅ CORRECT - server/routes.ts
app.get("/api/users/me", ...userHandler);
app.get("/api/users/stats", ...userHandler);

// ❌ WRONG - DO NOT USE SINGULAR
app.get("/api/user/me", ...userHandler);    // WRONG!
app.get("/api/user/stats", ...userHandler);  // WRONG!
```

### Why This Keeps Happening

1. **Autocomplete**: IDEs may suggest `/api/user` when typing
2. **Mental Model**: Developers think "get user stats" → `/api/user/stats`
3. **Inconsistent Convention**: Some APIs use singular for resource name
4. **No Type Safety**: Route paths are strings with no compile-time checking

### Detection

**Symptoms:**
- Frontend shows "Unable to load user stats" or similar error
- Browser DevTools Network tab shows 404 for `/api/users/stats`
- Terminal logs show `GET /api/users/stats 404 in 1ms`
- The endpoint works on some environments but not others (if routes.ts differs)

**Quick Check:**
```bash
# Search for wrong pattern in routes.ts
grep -n "/api/user/" server/routes.ts

# Should return no results if correct
```

### Prevention Strategy

1. **Code Review Checklist**: Always verify route paths match plural convention
2. **Grep Check**: Run the command above before committing route changes
3. **Integration Tests**: Add tests that verify all user endpoints respond
4. **Documentation**: Keep this file updated when adding new user routes

### Historical Occurrences

| Date | Story | Fixed By | Notes |
|------|-------|----------|-------|
| 2025-10-14 | 5.3 QA Review | Quinn (QA Agent) | `/api/user/stats` typo in routes.ts line 32 |
| *(Add previous occurrences here)* | | | |

### Files to Check When Adding User Routes

When adding or modifying user-related routes, verify these files are consistent:

1. **`server/routes.ts`** - Route registration (MUST use `/api/users/...`)
2. **`api/users/[action].ts`** - Handler implementation
3. **Client fetch calls** - Check all files calling user endpoints:
   - `client/src/pages/DailyRitual.tsx`
   - `client/src/hooks/useAuth.ts`
   - Any other files fetching user data

### Related Routes to Verify

```typescript
// All user-related routes - ALWAYS CHECK THESE:
app.get("/api/users/me", ...);        // ✅ PLURAL
app.get("/api/users/stats", ...);     // ✅ PLURAL
app.get("/api/users/profile", ...);   // ✅ PLURAL (if added in future)
app.patch("/api/users/settings", ...); // ✅ PLURAL (if added in future)
```

---

## 🔧 Other Common Issues

### OAuth Redirect Header Errors

**Issue**: `ERR_HTTP_HEADERS_SENT: Cannot set headers after they are sent`

**Root Cause**: Using nullish coalescing (`??`) with void-returning functions like `res.redirect()`

**Solution**: Use explicit function checks instead:
```typescript
// ❌ WRONG - redirect() returns undefined, triggers fallback
return res.redirect?.(url) ?? res.status(302).setHeader('Location', url).end();

// ✅ CORRECT - explicit check
if (typeof res.redirect === 'function') {
  return res.redirect(url);
} else {
  res.status(302).setHeader('Location', url).end();
  return;
}
```

**Fixed In**: `api/auth/google/callback.ts` (2025-10-14)

---

## 📚 Additional Resources

- [API Design Guidelines](./architecture/6-api-design-and-integration.md)
- [Coding Standards](./architecture/coding-standards.md)
- [Testing Strategy](./testing/testing-strategy.md)

---

## 🔄 Maintenance

This document should be updated whenever:
- A bug occurs more than once
- A new common pattern is identified
- A prevention strategy is implemented
- A recurring issue is resolved permanently

**Last Updated**: 2025-10-14 by Quinn (Test Architect)
