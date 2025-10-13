// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../_lib/storage.js';
import { generateToken } from '../_lib/middleware/auth.js';
import type { User } from '../_lib/storage.js';

// Configure Passport inline for serverless (avoids module resolution issues)
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL || 'https://rbuddy-v1.vercel.app/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('FATAL: Missing GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET');
}

passport.use(
  new GoogleStrategy(
    {
      clientID: GOOGLE_CLIENT_ID!,
      clientSecret: GOOGLE_CLIENT_SECRET!,
      callbackURL: CALLBACK_URL,
      scope: ['profile', 'email'],
    },
    async (
      accessToken: string,
      refreshToken: string,
      profile: Profile,
      done: VerifyCallback
    ) => {
      try {
        const googleId = profile.id;
        const email = profile.emails?.[0]?.value;
        const avatarUrl = profile.photos?.[0]?.value;

        if (!email) {
          return done(new Error('No email found in Google profile'));
        }

        let user = await storage.getUserByGoogleId(googleId);

        if (!user) {
          const baseUsername = email.split('@')[0];
          const username = `${baseUsername}_${googleId.slice(-6)}`;

          user = await storage.createUser({
            email,
            username,
          });
        }

        return done(null, user);
      } catch (error) {
        console.error('Error in Google OAuth strategy:', error);
        return done(error as Error);
      }
    }
  )
);

/**
 * Handles Google OAuth callback
 * GET /api/auth/google/callback
 */
async function handler(req: Request, res: Response, next: NextFunction) {
  const frontendUrl = process.env.NODE_ENV === 'production'
    ? process.env.FRONTEND_URL || 'https://rbuddy-v1.vercel.app'
    : 'http://localhost:5173';

  passport.authenticate(
    'google',
    { session: false },
    (err: Error | null, user: User | false, _info: any) => {
      if (err) {
        console.error('Google OAuth error:', err);
        return res.redirect(`${frontendUrl}/login?error=auth_failed`);
      }

      if (!user) {
        console.error('No user returned from Google OAuth');
        return res.redirect(`${frontendUrl}/login?error=no_user`);
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

        // Redirect to daily ritual page on frontend
        return res.redirect(`${frontendUrl}/daily-ritual`);
      } catch (error) {
        console.error('Error generating token or setting cookie:', error);
        return res.redirect(`${frontendUrl}/login?error=token_generation_failed`);
      }
    }
  )(req, res, next);
}

// Export for Express server (middleware array)
export const middlewares = [handler];

// Export for Vercel serverless (NOT using createVercelHandler because passport needs special handling)
export default handler;
