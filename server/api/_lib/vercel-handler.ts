import { Request, Response, NextFunction, RequestHandler } from 'express';
import type { VercelRequest, VercelResponse } from '@vercel/node';

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
        middleware(req as any, res as any, next);
      } catch (error) {
        next(error);
      }
    };

    next();
  };
}
