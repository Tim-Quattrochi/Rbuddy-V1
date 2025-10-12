import { Request, Response } from 'express';
import passport from '../../../server/services/AuthService';
import { createVercelHandler } from "../../_lib/vercel-handler";


/**
 * Initiates Google OAuth flow
 * GET /api/auth/google
 */
async function handler(req: Request, res: Response) {
  passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
  })(req, res);
}

export const middlewares = [handler];

export default createVercelHandler(middlewares);
