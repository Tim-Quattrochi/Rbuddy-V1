// API handler for getting chat history

import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { chatGeneralLimiter } from '../../server/middleware/rateLimiter';
import AIChatService from '../../server/services/aiChatService';
import { createVercelHandler } from '../_lib/vercel-handler';

// Constants for validation
const CHAT_HISTORY_LIMIT_MIN = 1;
const CHAT_HISTORY_LIMIT_MAX = 100;
const CHAT_HISTORY_LIMIT_DEFAULT = 20;

export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Validate and clamp limit parameter to prevent abuse
    const requestedLimit = parseInt(req.query.limit as string) || CHAT_HISTORY_LIMIT_DEFAULT;
    const limit = Math.min(
      Math.max(requestedLimit, CHAT_HISTORY_LIMIT_MIN),
      CHAT_HISTORY_LIMIT_MAX
    );

    // Lazy initialization: instantiate service within handler
    const chatService = new AIChatService();
    const messages = await chatService.getMessages(userId, limit);

    return res.json({ messages });
  } catch (error) {
    console.error('[Chat API] Error getting history:', error);
    return res.status(500).json({ 
      error: 'Failed to get chat history'
    });
  }
}

// Apply rate limiting and authentication middleware
export const middlewares = [requireAuth, chatGeneralLimiter, handler];

export default createVercelHandler(middlewares);
