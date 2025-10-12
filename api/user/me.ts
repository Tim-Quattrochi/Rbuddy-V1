import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { storage } from '../../server/storage';
import { createVercelHandler } from '../_lib/vercel-handler';
import dotenv from 'dotenv';

// Ensure environment variables are loaded
dotenv.config();

async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId!;
    
    // Fetch user from storage
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    // Return user data (excluding password)
    const { password, ...userData } = user;
    
    return res.status(200).json({
      user: userData
    });
  } catch (error) {
    console.error('[GET /api/user/me] Error:', error);
    return res.status(500).json({
      error: 'Internal Server Error',
      message: 'Failed to fetch user data'
    });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);
