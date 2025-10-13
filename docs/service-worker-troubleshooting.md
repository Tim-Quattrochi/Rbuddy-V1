# Service Worker Troubleshooting Guide

## Overview

This guide documents common service worker issues in production, debugging techniques, and solutions. The service worker is configured using Vite PWA plugin and Workbox.

## Issue: Service Worker Intercepting Vercel API Routes

### Problem Description
**Date:** 2025-10-13

The service worker was intercepting ALL `/api/*` requests in production, including Vercel serverless functions. This caused API requests to fail or return cached/stale data instead of hitting the actual backend.

### Root Cause
The URL pattern in [vite.config.ts](../vite.config.ts) was too broad:
```typescript
// ❌ WRONG - matches ANY domain with /api/ in the path
urlPattern: /^https?:\/\/.*\/api\/.*/i
```

This pattern matched:
- Same-origin requests: `https://yourapp.vercel.app/api/auth/google`
- External APIs: `https://external-service.com/api/data`
- Any URL containing `/api/`

### Solution

Updated the pattern to be more specific with endpoint exclusions:

```typescript
// ✅ CORRECT - only intercepts same-origin, non-critical endpoints
urlPattern: ({url}) => {
  const excludedPaths = [
    '/api/auth/',           // Authentication endpoints
    '/api/chat/',           // Real-time chat messages
    '/api/user/',           // User data and stats
    '/api/repair/',         // Repair flow (critical UX)
    '/api/daily-ritual/',   // Daily ritual submissions
    '/api/journal/history', // Journal history (needs fresh data)
  ];

  const isSameOrigin = url.origin === self.location.origin;
  const isApiRequest = url.pathname.startsWith('/api/');
  const isCriticalEndpoint = excludedPaths.some(path =>
    url.pathname.startsWith(path)
  );

  return isSameOrigin && isApiRequest && !isCriticalEndpoint;
}
```

### Files Modified
- [vite.config.ts:92-126](../vite.config.ts#L92-L126)
- Generated service worker: `dist/sw.js`

---

## Debugging Service Workers in Production

### 1. Check Service Worker Registration

Open browser console on production site:

```javascript
// Check if service worker is registered
navigator.serviceWorker.getRegistrations().then(registrations => {
  console.log('Active service workers:', registrations);
  registrations.forEach(reg => {
    console.log('Scope:', reg.scope);
    console.log('Active:', reg.active);
    console.log('Installing:', reg.installing);
    console.log('Waiting:', reg.waiting);
  });
});
```

### 2. Monitor Network Requests

1. Open DevTools → **Network** tab
2. Make API calls to `/api/*` endpoints
3. Look for indicators:
   - **(ServiceWorker)** in the "Size" column = intercepted by SW
   - Actual size (e.g., "1.2 kB") = direct network request
4. Check the "Timing" tab for each request

### 3. Inspect Service Worker State

DevTools → **Application** → **Service Workers**:
- View active service workers and their status
- Check "Update on reload" to force SW updates during development
- Click "Unregister" to remove a problematic service worker
- View console logs from the SW context

### 4. View Service Worker Cache

DevTools → **Application** → **Cache Storage**:
- Inspect cached responses
- Delete individual cache entries
- Clear all caches

### 5. Force Service Worker Update

```javascript
// Method 1: Unregister and reload
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => reg.unregister());
  location.reload();
});

// Method 2: Update registration
navigator.serviceWorker.getRegistration().then(reg => {
  if (reg) {
    reg.update();
  }
});
```

### 6. Check Service Worker Messages

Add to your app for runtime debugging:

```typescript
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.addEventListener('message', (event) => {
    console.log('SW message:', event.data);
  });
}
```

### 7. View Service Worker Source

DevTools → **Application** → **Service Workers** → Click on service worker name
- View the actual service worker source code
- Verify the URL patterns and handlers

---

## Common Issues and Solutions

### Issue: API Requests Return Stale Data

**Symptoms:**
- API responses don't reflect recent changes
- User sees outdated information

**Diagnosis:**
1. Check Network tab - does request show (ServiceWorker)?
2. Inspect Cache Storage - is the API response cached?

**Solution:**
- Add the endpoint to `excludedPaths` in [vite.config.ts](../vite.config.ts)
- Use `NetworkOnly` handler for dynamic data
- Clear cache and unregister service worker

### Issue: Service Worker Not Updating

**Symptoms:**
- Code changes not reflected in production
- Old service worker version still active

**Diagnosis:**
```javascript
navigator.serviceWorker.getRegistration().then(reg => {
  console.log('SW version:', reg?.active?.scriptURL);
});
```

**Solution:**
1. Clear browser cache
2. Hard reload (Cmd+Shift+R / Ctrl+Shift+R)
3. Unregister old service worker
4. Check Vercel deployment has new SW file

### Issue: Service Worker Breaks After Deployment

**Symptoms:**
- App stops working after deployment
- Console shows service worker errors

**Diagnosis:**
1. Check DevTools Console for errors
2. Verify service worker file is accessible: `https://yourdomain.com/sw.js`
3. Check Network tab for 404 errors

**Solution:**
- Ensure `dist/sw.js` is included in deployment
- Verify Vercel build includes service worker files
- Check [vercel.json](../vercel.json) configuration

---

## Service Worker Configuration

### Current Setup

**Location:** [vite.config.ts:57-126](../vite.config.ts#L57-L126)

**Strategy:**
- **Static assets** (fonts): `CacheFirst` strategy
- **API requests**: `NetworkOnly` strategy with background sync
- **Navigation**: Serve `index.html` for SPA routing

### Excluded Endpoints

All critical API endpoints are excluded from service worker interception:

| Endpoint | Reason for Exclusion |
|----------|---------------------|
| `/api/auth/*` | Authentication requires real-time validation |
| `/api/chat/*` | Real-time chat messages |
| `/api/user/*` | User data must be fresh |
| `/api/repair/*` | Critical user experience flow |
| `/api/daily-ritual/*` | Daily ritual submissions |
| `/api/journal/history` | Journal history needs fresh data |

### Adding New Excluded Endpoints

If you add a new API endpoint that should not be cached:

1. Add to `excludedPaths` array in [vite.config.ts:97-104](../vite.config.ts#L97-L104)
2. Rebuild: `npm run build:client`
3. Deploy to Vercel
4. Test in production

---

## Testing Service Worker Changes

### Local Testing

1. Enable service worker in dev mode:
```typescript
// vite.config.ts
devOptions: {
  enabled: true,
  type: "module",
}
```

2. Run dev server: `npm run dev`
3. Open DevTools → Application → Service Workers
4. Test with "Update on reload" enabled

### Production Testing

1. Deploy to Vercel: `git push origin main`
2. Wait for deployment to complete
3. Open production URL in incognito window
4. Follow debugging steps above
5. Verify API requests are not intercepted:
   ```javascript
   // Should return empty or false
   fetch('/api/user/stats').then(response => {
     console.log('From SW?', response.headers.get('x-from-sw'));
   });
   ```

---

## Related Files

- [vite.config.ts](../vite.config.ts) - Service worker configuration
- [client/src/main.tsx](../client/src/main.tsx) - Service worker registration
- [vercel.json](../vercel.json) - Vercel deployment config
- [dist/sw.js](../dist/sw.js) - Generated service worker (after build)

---

## Additional Resources

- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Service Worker API](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API)
- [Chrome DevTools Service Worker Debugging](https://developer.chrome.com/docs/devtools/progressive-web-apps/)

---

## Changelog

| Date | Issue | Solution |
|------|-------|----------|
| 2025-10-13 | SW intercepting all API requests | Updated URL pattern to exclude critical endpoints |

