/**
 * Rate Limiting Middleware for Chat API
 * 
 * Prevents abuse and controls OpenAI API costs by limiting:
 * - 20 messages per hour per user
 * - 100 requests per hour per IP (fallback)
 */

import rateLimit from 'express-rate-limit';
import type { Request } from 'express';

// Rate limiter for chat send endpoint
// 20 messages per hour per user to control OpenAI costs
export const chatSendLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20,
  message: {
    error: 'Too many messages sent. Please try again later.',
    retryAfter: '1 hour'
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Use userId if available, otherwise fall back to default IP handling
  keyGenerator: (req: Request) => {
    const userId = (req as any).userId;
    if (userId) {
      return `user:${userId}`;
    }
    // Don't return IP directly - let express-rate-limit handle it
    // This avoids IPv6 issues
    return undefined as any;
  },
  // Skip rate limiting if API key is missing (will fail at service level)
  skip: (req) => {
    return !process.env.OPENAI_API_KEY && 
           !process.env.GEMINI_API_KEY && 
           !process.env.MISTRAL_API_KEY &&
           !process.env.PERPLEXITY_API_KEY;
  }
});

// Rate limiter for history and clear endpoints
// More lenient: 100 requests per hour
export const chatGeneralLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100,
  message: {
    error: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req: Request) => {
    const userId = (req as any).userId;
    if (userId) {
      return `user:${userId}`;
    }
    // Let express-rate-limit handle IP
    return undefined as any;
  }
});
