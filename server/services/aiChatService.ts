/**
 * AI Chat Service - Powered by OpenAI
 * 
 * Provides context-aware chat for authenticated users
 * Uses user's mood, intentions, and session history for personalized responses
 */

import OpenAI from 'openai';
import { db } from '../storage.js';
import * as schema from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

interface ChatContext {
  userId: string;
  recentMood?: string;
  recentIntention?: string;
  streakCount?: number;
}

interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export default class AIChatService {
  private openai: OpenAI;
  private dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('[AIChatService] OPENAI_API_KEY not set');
      throw new Error('OpenAI API key not configured');
    }
    
    this.openai = new OpenAI({ apiKey });
    this.dbClient = dbClient;
  }

  /**
   * Get user context for AI chat
   */
  private async getUserContext(userId: string): Promise<ChatContext> {
    try {
      // Get user's most recent session
      const recentSession = await this.dbClient
        .select()
        .from(schema.sessions)
        .where(eq(schema.sessions.userId, userId))
        .orderBy(desc(schema.sessions.createdAt))
        .limit(1);

      const session = recentSession[0];

      return {
        userId,
        recentMood: session?.mood || undefined,
        recentIntention: session?.intention || undefined,
        streakCount: session?.streakCount || 0,
      };
    } catch (error) {
      console.error('[AIChatService] Error getting user context:', error);
      return { userId };
    }
  }

  /**
   * Get chat history for user
   */
  private async getChatHistory(userId: string, limit: number = 10): Promise<ChatMessage[]> {
    try {
      const messages = await this.dbClient
        .select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.userId, userId))
        .orderBy(desc(schema.chatMessages.createdAt))
        .limit(limit);

      // Reverse to get chronological order
      return messages.reverse().map(msg => ({
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
      }));
    } catch (error) {
      console.error('[AIChatService] Error getting chat history:', error);
      return [];
    }
  }

  /**
   * Create system prompt based on user context
   */
  private createSystemPrompt(context: ChatContext): string {
    let prompt = `You are a compassionate AI companion for someone in recovery. Your role is to:
* Provide emotional support and encouragement
* Help them reflect on their feelings and intentions
* Celebrate their progress and support them through challenges
* Ask thoughtful questions to help them gain insights
* Be warm, non-judgmental, and supportive

Keep responses concise (2-3 sentences usually) and conversational.`;

    if (context.recentMood) {
      prompt += `\n\nThe user recently shared they were feeling "${context.recentMood}".`;
    }

    if (context.recentIntention) {
      prompt += `\n\nTheir recent intention was: "${context.recentIntention}".`;
    }

    if (context.streakCount && context.streakCount > 0) {
      prompt += `\n\nThey have a ${context.streakCount}-day streak!`;
    }

    return prompt;
  }

  /**
   * Send a chat message and get AI response
   */
  async sendMessage(userId: string, message: string): Promise<string> {
    try {
      // Get user context
      const context = await this.getUserContext(userId);

      // Get chat history
      const history = await this.getChatHistory(userId);

      // Save user message
      await this.dbClient.insert(schema.chatMessages).values({
        userId,
        role: 'user',
        content: message,
        metadata: { context },
      });

      // Prepare messages for OpenAI
      const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
        {
          role: 'system',
          content: this.createSystemPrompt(context),
        },
        ...history.map(msg => ({
          role: msg.role,
          content: msg.content,
        } as OpenAI.Chat.ChatCompletionMessageParam)),
        {
          role: 'user',
          content: message,
        },
      ];

      // Get AI response
      const completion = await this.openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages,
        temperature: 0.7,
        max_tokens: 150,
      });

      const aiResponse = completion.choices[0]?.message?.content || 
        "I'm here to listen. How are you feeling?";

      // Save AI response
      await this.dbClient.insert(schema.chatMessages).values({
        userId,
        role: 'assistant',
        content: aiResponse,
      });

      return aiResponse;
    } catch (error) {
      console.error('[AIChatService] Error sending message:', error);
      throw new Error('Failed to send message. Please try again.');
    }
  }

  /**
   * Get recent chat messages for a user
   */
  async getMessages(userId: string, limit: number = 20): Promise<Array<{
    id: string;
    role: 'user' | 'assistant' | 'system';
    content: string;
    createdAt: Date | null;
  }>> {
    try {
      const messages = await this.dbClient
        .select()
        .from(schema.chatMessages)
        .where(eq(schema.chatMessages.userId, userId))
        .orderBy(desc(schema.chatMessages.createdAt))
        .limit(limit);

      return messages.reverse().map(msg => ({
        id: msg.id,
        role: msg.role as 'user' | 'assistant' | 'system',
        content: msg.content,
        createdAt: msg.createdAt,
      }));
    } catch (error) {
      console.error('[AIChatService] Error getting messages:', error);
      return [];
    }
  }

  /**
   * Clear chat history for a user
   */
  async clearHistory(userId: string): Promise<void> {
    try {
      await this.dbClient
        .delete(schema.chatMessages)
        .where(eq(schema.chatMessages.userId, userId));
    } catch (error) {
      console.error('[AIChatService] Error clearing history:', error);
      throw new Error('Failed to clear chat history');
    }
  }
}
