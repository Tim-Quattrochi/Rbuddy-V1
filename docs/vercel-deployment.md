# Vercel Deployment Guide

## Overview

This application uses a **hybrid deployment architecture**:
- **Development**: Traditional Express server (`server/index.ts`)
- **Production**: Vercel serverless functions (`api/` directory)

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
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "framework": "vite",
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "/api/$1"
    }
  ],
  "functions": {
    "api/**/*.ts": {
      "includeFiles": "{server/**,shared/**}"
    }
  }
}
```

Key settings:
- **outputDirectory**: Client build output (`dist/public`)
- **rewrites**: Route API requests to serverless functions
- **includeFiles**: Bundle server code with API functions (for shared logic)

## Adding New API Endpoints

1. Create file in `api/` directory
2. Follow the dual-export pattern above
3. Add route in `server/routes.ts` (using named `middlewares` export)
4. If writing tests, import named `middlewares` export
5. Test locally: `npm run dev`
6. Build: `npm run build`
7. Deploy: Push to GitHub (Vercel auto-deploys)

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
