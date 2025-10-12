import { Request, Response } from 'express';
import passport from '../../../server/services/AuthService';

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

export default handler;
