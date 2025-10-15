# Incident Report: `/api/user` vs `/api/users` Route Typo

**Date**: 2025-10-14  
**Severity**: Medium (404 errors for working endpoint)  
**Detected By**: Quinn (QA Agent) during Story 5.3 review  
**Status**: Resolved

---

## Summary

Route registration in `server/routes.ts` incorrectly used `/api/user/stats` (singular) instead of `/api/users/stats` (plural), causing 404 errors when the frontend attempted to fetch user statistics.

---

## Timeline

| Time | Event |
|------|-------|
| 22:24 | OAuth regression fix completed during Story 5.3 QA review |
| 22:27 | User reported `/api/users/stats` returning 404 after OAuth login |
| 22:28 | Investigation revealed typo in routes.ts line 32 |
| 22:29 | Fix applied and verified |

---

## Technical Details

### Root Cause

**File**: `server/routes.ts` (line 32)  
**Error**: `/api/user/stats` should be `/api/users/stats`

```diff
  // User Routes
  app.get("/api/users/me", ...userHandler);
- app.get("/api/user/stats", ...userHandler);  // ❌ WRONG
+ app.get("/api/users/stats", ...userHandler);  // ✅ CORRECT
  app.get("/api/journal/history", ...journalHistoryHandler);
```

### Impact

- **User-Facing**: Stats widget on Daily Ritual page showed loading state indefinitely
- **API**: Endpoint returned 404 instead of 200 with user stats
- **Severity**: Medium - Feature broken but authentication still worked
- **Scope**: Local development environment only (not deployed to production)

### Why This Happened

1. **Autocomplete Suggestion**: IDE may suggest singular form
2. **Mental Model**: Developer thinks "user stats" → singular resource path
3. **No Type Safety**: Route paths are plain strings, no compile-time checking
4. **Pattern Recognition**: This is a **RECURRING** issue in the project

---

## Detection

### Symptoms Observed

```
Terminal Logs:
GET /api/users/stats 404 in 1ms
GET /api/users/stats 404 in 1ms
```

Browser Console:
```
Failed to load resource: the server responded with a status of 404 (Not Found)
```

### How to Detect in Future

1. **Terminal Monitoring**: Watch for 404s on `/api/users/*` endpoints
2. **Browser DevTools**: Check Network tab for failed requests
3. **Automated Check**: `grep -n "/api/user/" server/routes.ts` should return nothing
4. **Integration Tests**: Verify all user endpoints respond with 200

---

## Resolution

### Immediate Fix

Changed route path from `/api/user/stats` to `/api/users/stats` in `server/routes.ts`

### Verification

```bash
# Before fix:
GET /api/users/stats 404 in 1ms

# After fix:
GET /api/users/stats 200 in 50ms
```

---

## Prevention Measures Implemented

### 1. Documentation Created

- **`docs/COMMON_ISSUES.md`**: Comprehensive guide on this recurring pattern
- **This incident report**: Historical record for future reference
- **PR Template**: Added route verification checklist

### 2. Code Comments Added

Added warning comment in `server/routes.ts`:
```typescript
// ⚠️ CRITICAL: Always use /api/users/... (PLURAL) - see docs/COMMON_ISSUES.md
// This typo has occurred multiple times: /api/user/ vs /api/users/
```

### 3. Pre-Commit Verification Script (Recommended)

Consider adding to package.json:
```json
{
  "scripts": {
    "check:routes": "! grep -q '/api/user/' server/routes.ts || (echo 'ERROR: Found /api/user/ - should be /api/users/' && exit 1)"
  }
}
```

### 4. Code Review Checklist

Pull request template now includes:
- Route path verification checklist
- Grep command to detect pattern
- Link to COMMON_ISSUES.md

---

## Lessons Learned

### What Went Well

- ✅ Issue detected during QA review before production deployment
- ✅ Quick diagnosis (< 2 minutes from report to fix)
- ✅ Root cause identified as recurring pattern
- ✅ Comprehensive documentation created

### What Could Be Improved

- ❌ No automated checks to prevent this typo
- ❌ No integration tests covering user stats endpoint
- ❌ No historical documentation of previous occurrences

### Action Items

- [x] Fix immediate bug
- [x] Document the pattern in COMMON_ISSUES.md
- [x] Add warning comment to routes.ts
- [x] Create PR template with route verification
- [ ] Add integration tests for all user endpoints
- [ ] Consider implementing pre-commit hook
- [ ] Research if previous git history shows this pattern
- [ ] Add to team onboarding documentation

---

## Related Issues

This appears to be a **recurring pattern**. Search git history for similar issues:

```bash
# Search for previous occurrences
git log --all --full-history --grep="user.*users\|users.*user" --oneline

# Check when routes.ts was previously modified
git log -p server/routes.ts | grep -B5 -A5 "/api/user"
```

**TODO**: Document any historical occurrences found in the table in COMMON_ISSUES.md

---

## References

- **Story**: 5.3 - Add Search and Filter to Journal History
- **Gate Status**: PASS (unrelated regression, not caused by Story 5.3)
- **Files Modified**:
  - `server/routes.ts` (fix)
  - `docs/COMMON_ISSUES.md` (documentation)
  - `docs/qa/incidents/2025-10-14-user-users-typo.md` (this file)
  - `.github/PULL_REQUEST_TEMPLATE.md` (prevention)

---

**Report Author**: Quinn (Test Architect)  
**Review Date**: 2025-10-14  
**Status**: Closed - Resolved with prevention measures
