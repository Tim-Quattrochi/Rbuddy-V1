# Vercel Deployment Guide

## Overview

This application uses a **decoupled deployment architecture** (updated 2025-10-13):

### Development (Local)
- **Backend**: Express server on port 5001 (`api/index.ts`)
- **Frontend**: Vite dev server on port 5173
- **Proxy**: Vite proxies `/api/*` requests to Express backend

### Production (Vercel)
- **Backend**: Vercel serverless functions (`api/` directory)
- **Frontend**: Static Vite build served from Vercel CDN
- **Note**: `api/index.ts` is ONLY for local development and is ignored by Vercel

## API Endpoint Pattern

All API endpoints in the `api/` directory must follow this dual-export pattern to work both locally (Express) and on Vercel (serverless):

```typescript
// Example: api/example/endpoint.ts
import dotenv from 'dotenv';
dotenv.config();

import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { createVercelHandler } from '../_lib/vercel-handler';

// Your handler function
export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    // Your endpoint logic here
    const userId = req.userId!;
    // ...
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);
```

## Key Points

### 1. Dual Exports

Each API endpoint must export:
- **`middlewares`** (named export): Array of Express middleware for local development server
- **`default`** (default export): Vercel-wrapped handler for serverless deployment

### 2. The Vercel Handler Wrapper

The `createVercelHandler` function in `api/_lib/vercel-handler.ts`:
- Converts Express middleware arrays into Vercel-compatible handler functions
- Applies each middleware in order (e.g., authentication, then handler)
- Handles errors properly in serverless context

### 3. Server Routes

The Express server (`server/routes.ts`) imports the **named** `middlewares` export:

```typescript
import { middlewares as myHandler } from '../api/example/endpoint';

app.post('/api/example/endpoint', ...myHandler);
```

### 4. Testing

Tests should import the **named** `middlewares` export for testing middleware behavior:

```typescript
import { middlewares as myHandler } from './endpoint';

// Test the middleware array
await runMiddlewares(myHandler, mockReq, mockRes);
```

## Why This Pattern?

### Problem
Vercel serverless functions expect a single function: `(req, res) => void`

Our Express patterns use middleware arrays: `[requireAuth, handler]`

### Solution
The dual-export pattern allows:
- ✅ Local development with Express middleware chains
- ✅ Production deployment to Vercel serverless
- ✅ Same code works in both environments
- ✅ No code duplication

## Vercel Configuration

The `vercel.json` configuration:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "api/**/*.ts": {
      "runtime": "nodejs22.x",
      "includeFiles": "{server/**,shared/**}"
    }
  },
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" },
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

Key settings:
- **runtime**: Node.js 22.x for serverless functions
- **includeFiles**: Bundle `server/**` and `shared/**` with API functions (critical for imports)
- **rewrites**:
  - API requests (`/api/*`) → Serverless functions in `api/` directory
  - All other routes (`/*`) → `index.html` (SPA fallback for React Router)

### Important Notes

⚠️ **`api/index.ts` is NOT deployed to Vercel**
- This file is only for local Express development
- Vercel automatically ignores Express server files
- Each endpoint in `api/` becomes its own serverless function

⚠️ **Module resolution in Vercel**
- Serverless functions cannot access `node_modules` from parent directory
- Use `includeFiles` to bundle necessary server code
- Avoid dynamic imports or `require()` with computed paths

## Key Differences: Local vs Vercel

### Local Development
```
User → Vite (5173) → Proxy /api → Express (5001) → Handler
```
- Single Express server handles all requests
- Middleware chains execute sequentially
- State can be shared across requests (sessions, etc.)
- Hot reload with `tsx` watch mode

### Vercel Production
```
User → Vercel CDN → /api/auth/google → Serverless Function → Handler
```
- Each API endpoint is an isolated serverless function
- No shared state between function invocations
- Cold starts possible (~1-3 seconds)
- Each function deployed independently

### Critical Implications

1. **No Session State**: Can't use Express sessions in Vercel
   - ✅ Use JWT tokens (stateless)
   - ❌ Don't use `express-session`

2. **File System**: Serverless functions have read-only filesystem (except `/tmp`)
   - ✅ Store uploads in cloud storage (S3, Cloudinary)
   - ❌ Don't write to local disk

3. **Database Connections**: Each function creates its own connection
   - ✅ Use connection pooling (like `@neondatabase/serverless`)
   - ❌ Don't create new connection per request

4. **Environment**: Check `NODE_ENV` to determine environment
   - Local: `NODE_ENV=development`
   - Vercel: `NODE_ENV=production`

## Adding New API Endpoints

1. Create file in `api/` directory (e.g., `api/my-feature/endpoint.ts`)
2. Follow the dual-export pattern above
3. Add route in `server/routes.ts` (using named `middlewares` export)
   ```typescript
   import { middlewares as myHandler } from '../api/my-feature/endpoint';
   app.post('/api/my-feature/endpoint', ...myHandler);
   ```
4. If writing tests, import named `middlewares` export
5. Test locally: `npm run dev`
6. Build: `npm run build`
7. Deploy: Push to GitHub (Vercel auto-deploys)
8. Verify on Vercel: Check function logs in Vercel Dashboard

## OAuth Configuration for Vercel

### Google OAuth Callback URL

**Critical**: OAuth callbacks must redirect to the **frontend URL**, not the backend.

In production (`api/auth/google.callback.ts`):
```typescript
const frontendUrl = process.env.NODE_ENV === 'production'
  ? process.env.FRONTEND_URL || 'https://rbuddy-v1.vercel.app'
  : 'http://localhost:5173';

// Redirect to frontend after successful auth
return res.redirect(`${frontendUrl}/daily-ritual`);
```

### Environment Variables in Vercel

Set these in Vercel Dashboard (Settings → Environment Variables):

**Required for OAuth**:
- `GOOGLE_CLIENT_ID` - From Google Cloud Console
- `GOOGLE_CLIENT_SECRET` - From Google Cloud Console
- `CALLBACK_URL` - `https://your-app.vercel.app/api/auth/google/callback`
- `FRONTEND_URL` - `https://your-app.vercel.app` (for OAuth redirects)

**Required for Auth**:
- `JWT_SECRET` - Secure random string (min 32 chars)

**Required for Database**:
- `DATABASE_URL` - PostgreSQL connection string

**Google Cloud Console Setup**:
1. Go to Google Cloud Console → APIs & Services → Credentials
2. Add authorized redirect URI: `https://your-app.vercel.app/api/auth/google/callback`
3. Add authorized JavaScript origin: `https://your-app.vercel.app`

### Cookie Configuration

⚠️ **Important**: Cookies must be configured correctly for cross-origin OAuth:

```typescript
res.cookie('auth_token', token, {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production', // true in production
  sameSite: 'lax', // allows OAuth redirects
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
});
```

## Build Process

The build command in `package.json`:

```json
{
  "scripts": {
    "build:client": "vite build",
    "build:api": "tsc --project tsconfig.api.json",
    "build:server": "tsc -p tsconfig.json --outDir dist/server",
    "build": "npm run build:client && npm run build:api && npm run build:server"
  }
}
```

**What happens on Vercel**:
1. Runs `npm run build` (builds client, API, and server)
2. **Client build** (`dist/public`) → Served from CDN
3. **API functions** (`api/**/*.ts`) → Deployed as serverless functions
4. **Server build** (`dist/server`) → Bundled with API functions via `includeFiles`

## Common Issues

### "middlewares is not iterable"
- **Cause**: Test importing default export instead of named `middlewares`
- **Fix**: `import { middlewares as handler } from './endpoint'`

### "Type is not an array type"
- **Cause**: Route using default export instead of named `middlewares`
- **Fix**: `import { middlewares as handler } from '../api/endpoint'`

### "Cannot find module" on Vercel
- **Cause**: Missing dependency or incorrect path in serverless context
- **Fix**: Ensure `includeFiles` in `vercel.json` includes required directories
- **Example**: If importing from `server/services/`, ensure `server/**` is in `includeFiles`

### OAuth 404 on Vercel (but works locally)
- **Cause**: Backend redirecting to relative path instead of full frontend URL
- **Fix**: Use `${frontendUrl}/path` for all OAuth redirects, where `frontendUrl` is from environment
- **See**: `.ai/debug-log.md` (2025-10-13) for detailed fix

### "Module not found" for shared code
- **Cause**: Serverless functions can't resolve imports outside their bundle
- **Fix**: Add directory to `includeFiles` in `vercel.json`
- **Example**: `"includeFiles": "{server/**,shared/**,api/_lib/**}"`

### Cookie not being set on OAuth callback
- **Cause**: Cookie domain mismatch or incorrect `sameSite` setting
- **Fix**: Ensure `sameSite: 'lax'` and `secure: true` in production
- **Check**: Browser DevTools → Application → Cookies

### Frontend shows 404 for all routes except home
- **Cause**: Missing SPA fallback rewrite
- **Fix**: Ensure `{ "source": "/(.*)", "destination": "/index.html" }` is in `vercel.json` rewrites

## Pre-Deployment Checklist

Before deploying to Vercel, ensure:

### Environment Variables
- [ ] `GOOGLE_CLIENT_ID` set in Vercel
- [ ] `GOOGLE_CLIENT_SECRET` set in Vercel
- [ ] `CALLBACK_URL` set to `https://your-app.vercel.app/api/auth/google/callback`
- [ ] `FRONTEND_URL` set to `https://your-app.vercel.app`
- [ ] `JWT_SECRET` set (min 32 chars, secure random)
- [ ] `DATABASE_URL` set (PostgreSQL connection string)

### Google Cloud Console
- [ ] Authorized redirect URI: `https://your-app.vercel.app/api/auth/google/callback`
- [ ] Authorized JavaScript origin: `https://your-app.vercel.app`

### Code Changes
- [ ] All OAuth redirects use `${frontendUrl}/path` pattern
- [ ] Cookie settings include `secure: true` for production
- [ ] No `express-session` or stateful middleware
- [ ] Database uses connection pooling
- [ ] All API endpoints follow dual-export pattern
- [ ] `vercel.json` includes correct `includeFiles`

### Testing
- [ ] Run `npm run build` locally (should succeed)
- [ ] Test OAuth flow locally with decoupled setup
- [ ] Check all API endpoints return expected responses
- [ ] Verify TypeScript compilation: `npm run check`

### Post-Deployment
- [ ] Visit `https://your-app.vercel.app` and verify frontend loads
- [ ] Test OAuth login flow end-to-end
- [ ] Check Vercel function logs for errors
- [ ] Verify cookies are being set correctly
- [ ] Test authenticated API endpoints

## Troubleshooting Vercel Deployment

### Check Function Logs
1. Go to Vercel Dashboard → Your Project → Functions
2. Click on specific function (e.g., `api/auth/google/callback.ts`)
3. View real-time logs for errors

### Common Log Errors

**"Cannot find module 'server/middleware/auth'"**
- Missing from `includeFiles` in `vercel.json`
- Add `server/**` to `includeFiles`

**"dotenv is not defined"**
- Each serverless function must import and configure dotenv at the top:
  ```typescript
  import dotenv from 'dotenv';
  dotenv.config();
  ```

**"Passport strategy not configured"**
- Passport must be configured in each serverless function
- OAuth callback endpoints often configure passport inline (see `api/auth/google.callback.ts`)

**"Connection timeout" or database errors**
- Check `DATABASE_URL` is set correctly in Vercel
- Ensure database allows connections from Vercel IPs (usually 0.0.0.0/0 for Neon)
- Verify connection pooling is configured

## Additional Resources

- [Vercel Serverless Functions Docs](https://vercel.com/docs/functions/serverless-functions)
- [Vercel Environment Variables](https://vercel.com/docs/projects/environment-variables)
- [Debugging Vercel Functions](https://vercel.com/docs/functions/debugging)
- Project Debug Log: `.ai/debug-log.md`
