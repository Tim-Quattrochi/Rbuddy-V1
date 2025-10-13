// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response, NextFunction } from 'express';
import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../../_lib/storage.js';
import { generateToken } from '../../_lib/middleware/auth.js';
import type { User } from '../../_lib/storage.js';

// Minimal cookie serializer for serverless environments
function serializeCookie(name: string, value: string, options: {
  httpOnly?: boolean;
  secure?: boolean;
  sameSite?: 'lax' | 'strict' | 'none' | undefined;
  maxAge?: number; // milliseconds
  path?: string;
  domain?: string;
  expires?: Date;
} = {}) {
  const segments: string[] = [];
  segments.push(`${name}=${encodeURIComponent(value)}`);

  if (options.maxAge !== undefined) {
    const seconds = Math.floor(options.maxAge / 1000);
    segments.push(`Max-Age=${seconds}`);
  }
  if (options.domain) segments.push(`Domain=${options.domain}`);
  if (options.path) segments.push(`Path=${options.path}`);
  if (options.expires) segments.push(`Expires=${options.expires.toUTCString()}`);
  if (options.httpOnly) segments.push('HttpOnly');
  if (options.secure) segments.push('Secure');
  if (options.sameSite) {
    const v = options.sameSite.charAt(0).toUpperCase() + options.sameSite.slice(1);
    segments.push(`SameSite=${v}`);
  }

  return segments.join('; ');
}

function setCookie(res: any, name: string, value: string, options: Parameters<typeof serializeCookie>[2]) {
  if (typeof res.cookie === 'function') {
    // Express response
    return res.cookie(name, value, options);
  }
  // Vercel or Node response without res.cookie
  const cookie = serializeCookie(name, value, options);
  const prev = res.getHeader ? res.getHeader('Set-Cookie') : undefined;
  if (!prev) {
    res.setHeader('Set-Cookie', cookie);
  } else if (Array.isArray(prev)) {
    res.setHeader('Set-Cookie', [...prev, cookie]);
  } else {
    res.setHeader('Set-Cookie', [prev as string, cookie]);
  }
}

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
        return (res as any).redirect?.(`${frontendUrl}/login?error=auth_failed`) ?? (res as any).status(302).setHeader('Location', `${frontendUrl}/login?error=auth_failed`).end();
      }

      if (!user) {
        console.error('No user returned from Google OAuth');
        return (res as any).redirect?.(`${frontendUrl}/login?error=no_user`) ?? (res as any).status(302).setHeader('Location', `${frontendUrl}/login?error=no_user`).end();
      }

      try {
        // Generate JWT token for the authenticated user
        const token = generateToken(user.id);

        // Set token as HttpOnly cookie (works for Express and Vercel)
        setCookie(res as any, 'auth_token', token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
          sameSite: 'lax',
          maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
          path: '/',
        });

        // Redirect to daily ritual page on frontend
        return (res as any).redirect?.(`${frontendUrl}/daily-ritual`) ?? (res as any).status(302).setHeader('Location', `${frontendUrl}/daily-ritual`).end();
      } catch (error) {
        console.error('Error generating token or setting cookie:', error);
        return (res as any).redirect?.(`${frontendUrl}/login?error=token_generation_failed`) ?? (res as any).status(302).setHeader('Location', `${frontendUrl}/login?error=token_generation_failed`).end();
      }
    }
  )(req as any, res as any, next as any);
}

// Export for Express server (middleware array)
export const middlewares = [handler];

// Export for Vercel serverless (NOT using createVercelHandler because passport needs special handling)
export default handler;
