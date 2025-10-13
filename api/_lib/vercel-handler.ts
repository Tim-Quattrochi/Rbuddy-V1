import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

function setCors(res: VercelResponse, origin?: string | null) {
  res.setHeader('Access-Control-Allow-Origin', origin || '*');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
}

async function parseBody(req: VercelRequest): Promise<void> {
  if (req.method === 'GET' || req.method === 'HEAD') return;
  if ((req as any).body !== undefined) {
    // If body already provided by platform, try to normalize JSON strings
    const b: any = (req as any).body;
    if (typeof b === 'string') {
      try { (req as any).body = JSON.parse(b); } catch { /* leave as string */ }
    }
    return;
  }

  const contentType = (req.headers['content-type'] || '').toString();
  const chunks: Buffer[] = [];
  await new Promise<void>((resolve) => {
    (req as any).on('data', (chunk: Buffer) => chunks.push(chunk));
    (req as any).on('end', () => resolve());
  });
  const raw = Buffer.concat(chunks).toString('utf8');
  if (!raw) return;

  if (contentType.includes('application/json')) {
    try { (req as any).body = JSON.parse(raw); } catch { (req as any).body = raw; }
  } else if (contentType.includes('application/x-www-form-urlencoded')) {
    const params = new URLSearchParams(raw);
    const obj: Record<string, string> = {};
    params.forEach((v, k) => { obj[k] = v; });
    (req as any).body = obj;
  } else {
    (req as any).body = raw;
  }
}

/**
 * Wraps Express middleware chain for Vercel serverless functions.
 * 
 * Vercel expects a single function that takes (req, res), but our API
 * endpoints use Express middleware patterns like [requireAuth, handler].
 * This wrapper applies each middleware in order, then calls the final handler.
 * 
 * @param middlewares - Array of Express middleware functions
 * @returns A Vercel-compatible serverless handler function
 */
export function createVercelHandler(
  middlewares: RequestHandler[]
): (req: VercelRequest, res: VercelResponse) => Promise<void> {
  return async (req: VercelRequest, res: VercelResponse) => {
    // Always set CORS headers (safe for same-origin too)
    setCors(res, (req.headers as any)?.origin || (req.headers as any)?.Origin);

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).end();
      return;
    }

    // Ensure body is parsed for JSON/form submissions
    try { await parseBody(req); } catch (e) { /* ignore parse errors */ }

    let index = 0;
    const next: NextFunction = (err?: any) => {
      if (err) {
        console.error('Middleware error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Internal Server Error' });
        }
        return;
      }

      if (index >= middlewares.length) {
        return;
      }

      const middleware = middlewares[index++];
      try {
        middleware(req as any as Request, res as any as Response, next);
      } catch (error) {
        next(error);
      }
    };

    next();
  };
}
