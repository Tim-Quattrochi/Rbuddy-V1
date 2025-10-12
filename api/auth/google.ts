// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../_lib/storage';
import { createVercelHandler } from "../_lib/vercel-handler";

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
            googleId,
            email,
            username,
            avatarUrl,
            password: null,
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
