# Debugging API Endpoints Returning HTML Instead of JSON

## Quick Diagnosis

If your API endpoint returns HTML (usually `index.html`) instead of JSON, it means the request is falling through to the SPA fallback in `vercel.json`.

## 🚨 Common Causes & Fixes

### 1. **URL Path Mismatch** (Most Common)

**Symptom:** Request to `/api/user/stats` returns HTML

**Cause:** Endpoint is at `/api/users/stats` but frontend requests `/api/user/stats`

**How to verify:**
```javascript
// In browser console:
fetch('/api/users/stats', { credentials: 'include' })
  .then(r => r.json())
  .then(console.log) // Should return JSON data
```

**Fix:** Update frontend URL to match the actual endpoint path

```typescript
// ❌ Wrong
fetch('/api/user/stats')

// ✅ Correct  
fetch('/api/users/stats')
```

---

### 2. **Missing Rewrite Rule in vercel.json**

**Symptom:** New endpoint always returns HTML

**Cause:** No rewrite rule routes the URL to your serverless function

**How to verify:**
1. Check `vercel.json` rewrites array
2. Ensure there's a rule that matches your URL pattern

**Current rewrite rules (evaluated in order):**
```json
[
  { "source": "/api/users/me", "destination": "/api/users/me" },
  { "source": "/api/users/:action", "destination": "/api/users/[action]" },
  { "source": "/api/chat/:action", "destination": "/api/chat/[action]" },
  { "source": "/api/daily-ritual/:action", "destination": "/api/daily-ritual/[action]" },
  { "source": "/api/(.*)", "destination": "/api/$1" },
  { "source": "/(.*)", "destination": "/index.html" }  // ← SPA fallback
]
```

**Example:** `/api/users/stats` matches rule #2 → routes to `api/users/[action].ts` ✅

**Fix:** Add a rewrite rule for your endpoint pattern

---

### 3. **Service Worker Caching Old Responses**

**Symptom:** Works in incognito but not in regular browser

**Cause:** PWA service worker cached the old (incorrect) response

**How to verify:**
1. Open incognito/private window
2. Test the endpoint
3. If it works in incognito → SW cache issue

**Fix:** Clear service worker cache

```javascript
// In browser console:
caches.keys()
  .then(keys => Promise.all(keys.map(k => caches.delete(k))))
  .then(() => location.reload(true))
```

Or manually:
1. DevTools → Application tab → Clear site data
2. Check all boxes and click "Clear site data"

---

### 4. **Service Worker Intercepting API Calls**

**Symptom:** API returns HTML in production but works in development

**Cause:** Service worker's `navigateFallback` is serving `index.html` for API routes

**How to verify:** Check `vite.config.ts` for PWA configuration

**Fix:** Ensure API routes are in the deny list

```typescript
// vite.config.ts
VitePWA({
  workbox: {
    navigateFallbackDenylist: [
      /^\/api\/.*/,      // Don't intercept API routes
      /^\/auth\/.*/,     // Don't intercept auth routes  
      /^\/api\/auth\/.*/ // Don't intercept auth API
    ]
  }
})
```

---

### 5. **Authentication Failure**

**Symptom:** Returns 401 or HTML when not logged in

**Cause:** Endpoint requires authentication but no valid session/token

**How to verify:**
```javascript
fetch('/api/users/stats', {
  method: 'GET',
  credentials: 'include', // ← Send cookies
  headers: { 'Accept': 'application/json' }
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Content-Type:', r.headers.get('content-type'));
  return r.text(); // Use .text() to see raw response
})
.then(console.log)
```

**Expected responses:**
- ✅ Status 200, `application/json` → Working
- ✅ Status 401, `application/json` → Auth issue (but endpoint exists)
- ❌ Status 200, `text/html` → Routing issue

**Fix:** Ensure user is logged in and cookies are being sent

---

### 6. **Missing Serverless Function File**

**Symptom:** 404 or HTML for a specific endpoint

**Cause:** The TypeScript file for the endpoint doesn't exist

**How to verify:**
```bash
# Check if function file exists
ls -la api/users/[action].ts  # Should exist
```

**Fix:** Create the serverless function file or fix the file path

---

## 🔍 Step-by-Step Debugging Process

### Step 1: Check Vercel Function Logs

**Where:** https://vercel.com/your-team/rbuddy-v1/logs

**What to look for:**
- ✅ **Logs present:** Function executed → Check for errors in logs
- ❌ **No logs:** Function never ran → Routing issue (steps 2-4)

### Step 2: Test the Exact URL

```javascript
// Browser console - test with exact URL
fetch('https://rbuddy-v1.vercel.app/api/users/stats', {
  credentials: 'include'
})
.then(r => {
  console.log('Status:', r.status);
  console.log('Content-Type:', r.headers.get('content-type'));
  return r.json();
})
.then(console.log)
.catch(console.error)
```

### Step 3: Verify URL Pattern Matching

Check if your URL matches any rewrite rule:

| URL | Matches Rule | Result |
|-----|--------------|--------|
| `/api/users/stats` | `/api/users/:action` | ✅ Routes to `api/users/[action].ts` |
| `/api/user/stats` | None (falls through) | ❌ Returns `index.html` |
| `/api/chat/send` | `/api/chat/:action` | ✅ Routes to `api/chat/[action].ts` |

### Step 4: Check Dynamic Route Handler

If using `[action].ts`, verify the action resolver:

```typescript
// api/users/[action].ts
function resolveAction(req: Request): UserAction | null {
  // Check params
  const fromParams = (req as any).params?.action;
  
  // Check query string
  const queryValue = req.query?.action;
  
  // Check URL path
  const path = (req as any).path || req.url || '';
  const segments = path.split('?')[0]?.split('/').filter(Boolean) ?? [];
  const lastSegment = segments[segments.length - 1];
  
  // Return matched action
  return lastSegment as UserAction;
}
```

### Step 5: Check Content-Type Header

```javascript
fetch('/api/users/stats', { credentials: 'include' })
  .then(r => {
    const contentType = r.headers.get('content-type');
    console.log('Content-Type:', contentType);
    
    if (contentType?.includes('text/html')) {
      console.error('❌ Receiving HTML - routing issue');
    } else if (contentType?.includes('application/json')) {
      console.log('✅ Receiving JSON - endpoint working');
    }
    
    return r.text();
  })
  .then(console.log)
```

---

## 🛠️ Quick Fixes Reference

### Fix #1: Update Frontend URL
```typescript
// Find in: client/src/pages/*.tsx or hooks
- fetch('/api/user/stats')
+ fetch('/api/users/stats')
```

### Fix #2: Add Rewrite Rule
```json
// vercel.json
{
  "rewrites": [
    { "source": "/api/your-endpoint/:param", "destination": "/api/your-endpoint/[param]" },
    // ... other rules
  ]
}
```

### Fix #3: Clear Service Worker
```javascript
// Browser console
caches.keys().then(keys => 
  Promise.all(keys.map(k => caches.delete(k)))
).then(() => location.reload(true))
```

### Fix #4: Update SW Deny List
```typescript
// vite.config.ts
navigateFallbackDenylist: [/^\/api\/.*/]
```

### Fix #5: Add Credentials to Fetch
```typescript
fetch('/api/endpoint', {
  credentials: 'include' // Send cookies
})
```

---

## 🎯 Prevention Checklist

When adding new API endpoints:

- [ ] Create serverless function file: `api/feature/[action].ts`
- [ ] Add rewrite rule in `vercel.json` if needed
- [ ] Use correct URL in frontend (match the rewrite rule)
- [ ] Include `credentials: 'include'` in fetch calls
- [ ] Test in incognito window (no cache)
- [ ] Check Vercel function logs after deployment
- [ ] Verify Content-Type is `application/json`

---

## 📝 Example: Fixing `/api/user/stats` → HTML

**Problem:** `https://rbuddy-v1.vercel.app/api/user/stats` returns HTML

**Root cause:** URL is `/api/user/stats` (singular) but endpoint is `/api/users/stats` (plural)

**Solution:**
1. Find the fetch call in `client/src/pages/DailyRitual.tsx`
2. Change `/api/user/stats` → `/api/users/stats`
3. Update test file: `DailyRitual.integration.test.tsx`
4. Clear browser cache
5. Test: `fetch('/api/users/stats', {credentials: 'include'})`

**Files changed:**
- `client/src/pages/DailyRitual.tsx`
- `client/src/pages/__tests__/DailyRitual.integration.test.tsx`

---

## 🔗 Related Documentation

- [Vercel Deployment Guide](./vercel-deployment.md)
- [Service Worker Troubleshooting](./service-worker-troubleshooting.md)
- [Session Notes](./session-notes.md) - See "Vercel Function Count Issue"
