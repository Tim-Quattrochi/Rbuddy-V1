// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Response } from 'express';
import ConversationEngine from '../../server/services/conversationEngine';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { createVercelHandler } from '../_lib/vercel-handler';

const engine = new ConversationEngine();

const VALID_TRIGGERS = ['stress', 'people', 'craving'];

export async function handler(req: AuthenticatedRequest, res: Response) {
  const { trigger } = req.body;
  const userId = req.userId!; // Guaranteed by requireAuth middleware

  if (!trigger) {
    return res.status(400).json({ error: 'trigger is required' });
  }

  // Validate trigger is a valid option
  if (!VALID_TRIGGERS.includes(trigger)) {
    return res.status(400).json({
      error: 'Invalid trigger option',
      message: 'Valid triggers are: stress, people, craving'
    });
  }

  try {
    const result = await engine.handlePwaRepairFlow(userId, trigger);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling PWA repair flow:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);
