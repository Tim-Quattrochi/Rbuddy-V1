// API handler for sending chat messages

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

    const { message } = req.body;

    if (!message || typeof message !== 'string' || message.trim().length === 0) {
      return res.status(400).json({ error: 'Message is required' });
    }

    if (message.length > 1000) {
      return res.status(400).json({ error: 'Message too long (max 1000 characters)' });
    }

    const response = await chatService.sendMessage(userId, message.trim());

    return res.json({ response });
  } catch (error) {
    console.error('[Chat API] Error:', error);
    return res.status(500).json({ 
      error: 'Failed to process message',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

export default [requireAuth, handler];
