
// Load environment variables FIRST
import dotenv from 'dotenv';
dotenv.config();

import { Response } from 'express';
import ConversationEngine from '../../server/services/conversationEngine';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';

const engine = new ConversationEngine();

export async function handler(req: AuthenticatedRequest, res: Response) {
  const { sessionId, intentionText } = req.body;
  const userId = req.userId!; // Guaranteed by requireAuth middleware

  if (!sessionId || !intentionText) {
    return res.status(400).json({ error: 'sessionId and intentionText are required' });
  }

  if (typeof intentionText !== 'string' || intentionText.trim().length === 0) {
    return res.status(400).json({ error: 'intentionText must be a non-empty string' });
  }

  try {
    const result = await engine.handlePwaIntention(sessionId, intentionText);
    return res.status(200).json(result);

  } catch (error) {
    console.error('Error saving PWA intention:', error);
    
    // Check if error is session not found
    if (error instanceof Error && error.message === 'Session not found') {
      return res.status(404).json({ error: 'Session not found' });
    }
    
    return res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default [requireAuth, handler];
