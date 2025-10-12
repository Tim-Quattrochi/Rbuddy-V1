// API handler for sending chat messages

import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';
import { chatSendLimiter } from '../../server/middleware/rateLimiter';
import AIChatService from '../../server/services/aiChatService';

// Constants for validation
const MESSAGE_MAX_LENGTH = 1000;

export async function handler(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > MESSAGE_MAX_LENGTH) {
      return res.status(400).json({ 
        error: `Message too long (max ${MESSAGE_MAX_LENGTH} characters)` 
      });
    }

    // Lazy initialization: instantiate service within handler to avoid
    // module-level crashes if API keys are missing
    const chatService = new AIChatService();
    const response = await chatService.sendMessage(userId, message.trim());

    return res.json({ response });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process message',
      ...(process.env.NODE_ENV === 'development' && {
        details: error instanceof Error ? error.message : 'Unknown error'
      })
    });
  }
}

// Apply rate limiting and authentication middleware
export default [requireAuth, chatSendLimiter, handler];
