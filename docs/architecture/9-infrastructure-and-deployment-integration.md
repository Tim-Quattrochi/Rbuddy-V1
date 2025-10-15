# **9. Infrastructure and Deployment Integration**

## Deployment Architecture

**Updated:** October 2025 - Decoupled serverless architecture

### Overview

This project uses a **decoupled deployment strategy** with different architectures for development and production:

#### Development (Local)
- **Backend**: Express server on port 5001 (`api/index.ts`)
- **Frontend**: Vite dev server on port 5173
- **Proxy**: Vite proxies `/api/*` requests to Express backend
- **Workflow**: Single server, hot reload, full Express middleware support

#### Production (Vercel)
- **Backend**: Vercel serverless functions (`api/` directory)
- **Frontend**: Static Vite build served from Vercel CDN
- **Routing**: Vercel automatically routes `/api/*` to serverless functions
- **Workflow**: Each endpoint is an isolated serverless function

### Critical Architecture Note

⚠️ **The `api/` directory is NOT duplicated code.**

- Each file in `api/` serves dual purposes through **dual-export pattern**
- `server/routes.ts` imports `middlewares` export for Express (local)
- Vercel imports `default` export for serverless functions (production)
- This pattern eliminates code duplication while supporting both environments

**Required Reading:** [`docs/vercel-deployment.md`](../vercel-deployment.md)

---

## CI/CD Pipeline

### Vercel Integration

The project uses Vercel's automatic deployment:

1. **Push to GitHub** → Triggers Vercel build
2. **Build Process**:
   - `npm run build` compiles client, API, and server
   - Client build → Deployed to Vercel CDN
   - API functions → Deployed as serverless functions
   - Server code → Bundled with API functions (via `includeFiles`)
3. **Preview Deployments**: Every PR gets a unique preview URL
4. **Production Deployments**: Merges to `main` automatically deploy to production

### Environment Variables

**Must be configured in Vercel Dashboard:**

**Authentication:**
- `GOOGLE_CLIENT_ID` - Google OAuth client ID
- `GOOGLE_CLIENT_SECRET` - Google OAuth client secret
- `CALLBACK_URL` - OAuth callback URL (e.g., `https://your-app.vercel.app/api/auth/google/callback`)
- `FRONTEND_URL` - Frontend URL for redirects (e.g., `https://your-app.vercel.app`)
- `JWT_SECRET` - Secure random string (min 32 chars)

**Database:**
- `DATABASE_URL` - PostgreSQL connection string (use Neon with connection pooling)

**AI Services (Optional):**
- `OPENAI_API_KEY` - For chat functionality
- `ANTHROPIC_API_KEY` - Alternative AI provider
- `AI_PROVIDER` - Default provider (`openai` or `anthropic`)

### Vercel Configuration

The `vercel.json` file configures serverless deployment:

```json
{
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
- **includeFiles**: Bundles `server/` and `shared/` code with API functions (critical for imports)
- **rewrites**: Routes API requests and provides SPA fallback

---

## Rollback Strategy

### Vercel Instant Rollback

1. Go to Vercel Dashboard → Deployments
2. Find previous working deployment
3. Click "..." menu → "Promote to Production"
4. Rollback completes in seconds

### Database Rollback

For schema changes:
1. Drizzle migrations are versioned in `migrations/` directory
2. To rollback: Manually apply previous migration
3. **Recommendation**: Test migrations on staging branch first

---

## Monitoring & Debugging

### Vercel Function Logs

- Access real-time logs in Vercel Dashboard → Functions
- Click specific function to view invocation logs
- Logs include request/response details and errors

### Common Production Issues

1. **"Cannot find module 'server/...'"**
   - **Fix**: Add missing directory to `includeFiles` in `vercel.json`

2. **OAuth 404 errors**
   - **Fix**: Ensure OAuth redirects use full `frontendUrl` not relative paths
   - **See**: `vercel-deployment.md` OAuth configuration section

3. **Database connection timeout**
   - **Fix**: Use Neon serverless driver with connection pooling
   - **Check**: `DATABASE_URL` is set correctly in Vercel

### Health Checks

- Frontend: Visit root URL (should load React app)
- API: Test `/api/users/me` (requires authentication)
- Database: Check Neon dashboard for connection stats

---

## Performance Considerations

### Serverless Cold Starts

- First request to function: ~1-3 seconds (cold start)
- Subsequent requests: <100ms (warm)
- **Mitigation**: Functions stay warm with regular traffic

### Database Connections

- Use connection pooling (Neon serverless driver)
- Each function creates its own connection
- Avoid creating new connection per request

### CDN Caching

- Static assets cached at edge locations
- Fast global delivery for client bundle
- API responses not cached (dynamic content)

---

## Security

### Environment Isolation

- Development and production use separate environment variables
- Database credentials never committed to repository
- Secrets managed through Vercel Dashboard

### HTTPS & Cookies

- All production traffic uses HTTPS
- Auth cookies configured with:
  - `httpOnly: true` - Prevents XSS attacks
  - `secure: true` - HTTPS only in production
  - `sameSite: 'lax'` - Allows OAuth redirects while preventing CSRF

### Rate Limiting

- Implemented at API layer (not infrastructure)
- See `CRITICAL_FIXES.md` for chat endpoint rate limits

---

## Cost Management

### Vercel Free Tier Limits

- **Bandwidth**: 100 GB/month
- **Serverless Function Execution**: 100 GB-hours/month
- **Build Minutes**: 6000 minutes/month

### Cost Optimization

- Static client assets served from CDN (bandwidth efficient)
- Serverless functions only execute on demand
- Database connection pooling reduces overhead

### Monitoring Usage

- Check Vercel Dashboard → Settings → Usage
- Monitor function execution time
- Watch bandwidth consumption

---
