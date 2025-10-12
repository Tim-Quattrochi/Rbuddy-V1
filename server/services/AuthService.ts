import passport from 'passport';
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from 'passport-google-oauth20';
import { storage } from '../storage';

// Validate required environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const CALLBACK_URL = process.env.CALLBACK_URL || 'http://localhost:5001/api/auth/google/callback';

if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error('FATAL ERROR: GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET not set in environment variables.');
  if (process.env.NODE_ENV === 'production') {
    process.exit(1);
  }
}

/**
 * Configure Passport with Google OAuth 2.0 Strategy
 */
export function configurePassport() {
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
          // Extract user information from Google profile
          const googleId = profile.id;
          const email = profile.emails?.[0]?.value;
          const avatarUrl = profile.photos?.[0]?.value;

          if (!email) {
            return done(new Error('No email found in Google profile'));
          }

          // Try to find existing user by Google ID
          let user = await storage.getUserByGoogleId(googleId);

          if (!user) {
            // User doesn't exist, create a new one
            // Generate a unique username from email (fallback to googleId if needed)
            const baseUsername = email.split('@')[0];
            const username = `${baseUsername}_${googleId.slice(-6)}`;

            user = await storage.createUser({
              googleId,
              email,
              username,
              avatarUrl,
              password: null, // OAuth users don't have passwords
            });
          }

          // Successfully authenticated
          return done(null, user);
        } catch (error) {
          console.error('Error in Google OAuth strategy:', error);
          return done(error as Error);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from session
  passport.deserializeUser(async (id: string, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user);
    } catch (error) {
      done(error);
    }
  });
}

export default passport;
