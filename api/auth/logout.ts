import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../_lib/middleware/auth.js';
import { createVercelHandler } from '../_lib/vercel-handler.js';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    // Clear the auth_token cookie
    res.clearCookie('auth_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });
    
    console.log('[POST /api/auth/logout] User logged out:', req.userId);
    
    return res.status(200).json({
      message: 'Logged out successfully'
    });
  } catch (error) {
    console.error('[POST /api/auth/logout] Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Logout failed'
    });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);
