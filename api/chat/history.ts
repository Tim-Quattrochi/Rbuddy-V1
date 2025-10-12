// API handler for getting chat history

import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import AIChatService from '../../server/services/aiChatService';

const chatService = new AIChatService();

export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const limit = parseInt(req.query.limit as string) || 20;

    const messages = await chatService.getMessages(userId, limit);

    return res.json({ messages });
  } catch (error) {
    console.error('[Chat API] Error getting history:', error);
    return res.status(500).json({ 
      error: 'Failed to get chat history'
    });
  }
}

export default [requireAuth, handler];
