// API handler for clearing chat history

import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { chatGeneralLimiter } from '../../server/middleware/rateLimiter';
import AIChatService from '../../server/services/aiChatService';
import { createVercelHandler } from '../_lib/vercel-handler';

export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Lazy initialization: instantiate service within handler
    const chatService = new AIChatService();
    await chatService.clearHistory(userId);

    return res.json({ success: true });
  } catch (error) {
    console.error('[Chat API] Error clearing history:', error);
    return res.status(500).json({ 
      error: 'Failed to clear chat history'
    });
  }
}

// Apply rate limiting and authentication middleware
export const middlewares = [requireAuth, chatGeneralLimiter, handler];

export default createVercelHandler(middlewares);
