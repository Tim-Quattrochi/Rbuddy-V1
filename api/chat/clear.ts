// API handler for clearing chat history

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

    await chatService.clearHistory(userId);

    return res.json({ success: true });
  } catch (error) {
    console.error('[Chat API] Error clearing history:', error);
    return res.status(500).json({ 
      error: 'Failed to clear chat history'
    });
  }
}

export default [requireAuth, handler];
