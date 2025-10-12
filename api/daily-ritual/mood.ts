
// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Response } from 'express';
import ConversationEngine from '../../server/services/conversationEngine';
import { moodEnum, type MoodOption } from '../../shared/schema';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { createVercelHandler } from '../_lib/vercel-handler';

const engine = new ConversationEngine();

export async function handler(req: AuthenticatedRequest, res: Response) {
  const { mood } = req.body;
  const userId = req.userId!; // Guaranteed by requireAuth middleware

  if (!mood) {
    return res.status(400).json({ error: 'mood is required' });
  }

  // Validate mood is a valid option
  const validMoods: MoodOption[] = moodEnum.enumValues;
  if (!validMoods.includes(mood)) {
    return res.status(400).json({ error: 'Invalid mood option' });
  }

  try {
    const result = await engine.handlePwaMoodSelection(userId, mood as MoodOption);
    return res.status(200).json(result);
  } catch (error) {
    console.error('Error handling PWA mood selection:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

// Export for Express server (middleware array)
export const middlewares = [requireAuth, handler];

// Export for Vercel serverless (wrapped function)
export default createVercelHandler(middlewares);
