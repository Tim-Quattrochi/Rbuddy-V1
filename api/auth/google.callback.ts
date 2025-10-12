// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import passport from '../../server/services/AuthService';
import { generateToken } from '../../server/middleware/auth';
import type { User } from '../../server/storage';

/**
 * Handles Google OAuth callback
 * GET /api/auth/google/callback
 */
async function handler(req: Request, res: Response, next: NextFunction) {
  passport.authenticate(
    'google',
    { session: false },
    (err: Error | null, user: User | false, info: any) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect('/login?error=auth_failed');
      }

      if (!user) {
        console.error('No user returned from Google OAuth');
        return res.redirect('/login?error=no_user');
      }

      try {
        // Generate JWT token for the authenticated user
        const token = generateToken(user.id);

        // Set token as HttpOnly cookie
        res.cookie('auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });

        // Redirect to daily ritual page
        return res.redirect('/daily-ritual');
      } catch (error) {
        console.error('Error generating token or setting cookie:', error);
        return res.redirect('/login?error=token_generation_failed');
      }
    }
  )(req, res, next);
}

export default handler;
