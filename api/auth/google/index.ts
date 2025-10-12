// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import passport, { configurePassport } from '../../../server/services/AuthService';
import { createVercelHandler } from "../../_lib/vercel-handler";

// Ensure Passport is configured (required for Vercel serverless)
configurePassport();

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
