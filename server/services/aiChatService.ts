/**
 * AI Chat Service - Multi-provider support (OpenAI, Gemini, Mistral, Perplexity, and more)
 * 
 * Provides context-aware chat for authenticated users
 * Uses user's mood, intentions, and session history for personalized responses
 */

import OpenAI from 'openai';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Mistral } from '@mistralai/mistralai';
import Perplexity from '@perplexity-ai/perplexity_ai';
import { db } from '../storage.js';
import * as schema from '../../shared/schema.js';
import { eq, desc } from 'drizzle-orm';

type AIProvider = 'openai' | 'gemini' | 'anthropic' | 'mistral' | 'perplexity';

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
  private provider: AIProvider;
  private openai?: OpenAI;
  private gemini?: GoogleGenerativeAI;
  private mistral?: Mistral;
  private perplexity?: Perplexity;
  private dbClient: typeof db;

  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
    
    // Determine which provider to use based on environment variables
    const provider = (process.env.AI_PROVIDER || 'openai').toLowerCase() as AIProvider;
    this.provider = provider;

    console.log(process.env.GEMINI_API_KEY);

    switch (provider) {
      case 'openai':
        const openaiKey = process.env.OPENAI_API_KEY;
        if (!openaiKey) {
          console.error('[AIChatService] OPENAI_API_KEY not set');
          throw new Error('OpenAI API key not configured');
        }
        this.openai = new OpenAI({ apiKey: openaiKey });
        console.log('[AIChatService] Using OpenAI provider');
        break;

      case 'gemini':
        const geminiKey = process.env.GEMINI_API_KEY;
        if (!geminiKey) {
          console.error('[AIChatService] GEMINI_API_KEY not set');
          throw new Error('Gemini API key not configured');
        }
        this.gemini = new GoogleGenerativeAI(geminiKey);
        console.log('[AIChatService] Using Gemini provider');
        break;

      case 'mistral':
        const mistralKey = process.env.MISTRAL_API_KEY;
        if (!mistralKey) {
          console.error('[AIChatService] MISTRAL_API_KEY not set');
          throw new Error('Mistral API key not configured');
        }
        this.mistral = new Mistral({ apiKey: mistralKey });
        console.log('[AIChatService] Using Mistral provider');
        break;

      case 'perplexity':
        const perplexityKey = process.env.PERPLEXITY_API_KEY;
        if (!perplexityKey) {
          console.error('[AIChatService] PERPLEXITY_API_KEY not set');
          throw new Error('Perplexity API key not configured');
        }
        this.perplexity = new Perplexity({ apiKey: perplexityKey });
        console.log('[AIChatService] Using Perplexity provider');
        break;

      case 'anthropic':
        const anthropicKey = process.env.ANTHROPIC_API_KEY;
        if (!anthropicKey) {
          console.error('[AIChatService] ANTHROPIC_API_KEY not set');
          throw new Error('Anthropic API key not configured. Note: Direct Anthropic support requires additional SDK installation.');
        }
        console.log('[AIChatService] Using Anthropic provider (requires @anthropic-ai/sdk)');
        // Note: Anthropic support can be added by installing @anthropic-ai/sdk
        throw new Error('Anthropic provider not yet implemented. Install @anthropic-ai/sdk to add support.');

      default:
        throw new Error(`Unsupported AI provider: ${provider}. Supported providers: openai, gemini, mistral, perplexity, anthropic`);
    }
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

      // Get AI response based on provider
      let aiResponse: string;
      
      switch (this.provider) {
        case 'openai':
          aiResponse = await this.getOpenAIResponse(context, history, message);
          break;
        case 'gemini':
          aiResponse = await this.getGeminiResponse(context, history, message);
          break;
        case 'mistral':
          aiResponse = await this.getMistralResponse(context, history, message);
          break;
        case 'perplexity':
          aiResponse = await this.getPerplexityResponse(context, history, message);
          break;
        default:
          throw new Error(`Provider ${this.provider} not implemented`);
      }

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
   * Get response from OpenAI
   */
  private async getOpenAIResponse(
    context: ChatContext,
    history: ChatMessage[],
    message: string
  ): Promise<string> {
    if (!this.openai) {
      throw new Error('OpenAI client not initialized');
    }

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

    const completion = await this.openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    return completion.choices[0]?.message?.content || 
      "I'm here to listen. How are you feeling?";
  }

  /**
   * Get response from Gemini
   */
  private async getGeminiResponse(
    context: ChatContext,
    history: ChatMessage[],
    message: string
  ): Promise<string> {
    if (!this.gemini) {
      throw new Error('Gemini client not initialized');
    }

    const model = this.gemini.getGenerativeModel({ 
      model: process.env.GEMINI_MODEL || 'gemini-2.0-flash'
    });

    // Prepare chat history for Gemini
    const chatHistory = history.map(msg => ({
      role: msg.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: msg.content }],
    }));

    // Start chat with history
    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        maxOutputTokens: 150,
        temperature: 0.7,
      },
    });

    // Add system prompt as first message context
    const systemPrompt = this.createSystemPrompt(context);
    const fullMessage = `[System Context: ${systemPrompt}]\n\nUser: ${message}`;

    const result = await chat.sendMessage(fullMessage);
    const response = await result.response;
    
    return response.text() || "I'm here to listen. How are you feeling?";
  }

  /**
   * Get response from Mistral AI
   */
  private async getMistralResponse(
    context: ChatContext,
    history: ChatMessage[],
    message: string
  ): Promise<string> {
    if (!this.mistral) {
      throw new Error('Mistral client not initialized');
    }

    // Prepare messages for Mistral
    const messages = [
      {
        role: 'system' as const,
        content: this.createSystemPrompt(context),
      },
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const chatResponse = await this.mistral.chat.complete({
      model: process.env.MISTRAL_MODEL || 'mistral-small-latest',
      messages,
      temperature: 0.7,
      maxTokens: 150,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (typeof content === 'string') {
      return content;
    }
    return "I'm here to listen. How are you feeling?";
  }

  /**
   * Get response from Perplexity
   */
  private async getPerplexityResponse(
    context: ChatContext,
    history: ChatMessage[],
    message: string
  ): Promise<string> {
    if (!this.perplexity) {
      throw new Error('Perplexity client not initialized');
    }

    // Prepare messages for Perplexity
    const messages = [
      {
        role: 'system' as const,
        content: this.createSystemPrompt(context),
      },
      ...history.map(msg => ({
        role: msg.role === 'assistant' ? ('assistant' as const) : ('user' as const),
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: message,
      },
    ];

    const chatResponse = await this.perplexity.chat.completions.create({
      model: process.env.PERPLEXITY_MODEL || 'llama-3.1-sonar-small-128k-chat',
      messages,
      temperature: 0.7,
      max_tokens: 150,
    });

    const content = chatResponse.choices?.[0]?.message?.content;
    if (typeof content === 'string') {
      return content;
    }
    return "I'm here to listen. How are you feeling?";
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
