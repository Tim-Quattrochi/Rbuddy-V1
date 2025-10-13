import type { Request, Response, NextFunction, RequestHandler } from 'express';
import { requireAuth } from '../_lib/middleware/auth.js';
import { createVercelHandler } from '../_lib/vercel-handler.js';
import { handleClear } from './[action].js';

const methodGuard: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
  if ((req.method || '').toUpperCase() !== 'DELETE') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
  next();
};

export const middlewares: RequestHandler[] = [requireAuth as any, methodGuard as any, (req: Request, res: Response) => {
  return (handleClear as any)(req, res);
}];

export default createVercelHandler(middlewares);
