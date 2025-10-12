/**
 * ConversationEngine - FSM for SMS/IVR Daily Ritual flows
 *
 * Story 3: Implements mood prompt (Part 1 of Daily Ritual)
 * Story 5: Adds database persistence for sessions and messages
 */

import { db } from '../storage.js';
import * as schema from '../../shared/schema.js';
import { eq, and, or, isNull } from 'drizzle-orm';
import type { MoodOption } from '../../shared/schema.js';

export interface ConversationContext {
  mood?: MoodOption;
  intention?: string;
}

export interface ConversationState {
  userId: string;
  currentFlow: "daily" | "repair";
  currentStep: "mood_prompt" | "mood_selected" | "affirmation" | "intention_prompt" | "intention_capture" | "complete" | "repair_trigger";
  channel: "sms" | "ivr";
  context: ConversationContext;
}

const MOOD_MAP: Record<string, MoodOption> = {
  "1": "calm",
  "2": "stressed",
  "3": "tempted",
  "4": "hopeful",
};

const AFFIRMATIONS: Record<MoodOption, string> = {
  calm: "That's wonderful. Finding peace is a strength.",
  stressed: "I hear you. Taking this moment for yourself is important.",
  tempted: "Thank you for being honest. You're showing courage by reaching out.",
  hopeful: "That's beautiful. Hope is a powerful force.",
};

export default class ConversationEngine {
  // In-memory state storage (Story 3 requirement - no DB persistence yet)
  // Use a static store so warm serverless containers can share state across
  // invocations. This is a pragmatic MVP approach; production should persist
  // conversation state in an external store (Redis/Postgres) instead.
  private static stateStore: Map<string, ConversationState> = new Map();

  // Database client for persistence (Story 5)
  private dbClient: typeof db;

  /**
   * Constructor
   * @param dbClient - Optional Drizzle database client for persistence
   */
  constructor(dbClient: typeof db = db) {
    this.dbClient = dbClient;
  }

  /**
   * Process incoming SMS/IVR input
   * @param userId - Phone number or user identifier
   * @param input - User's message or DTMF input
   * @param channel - Communication channel (sms or ivr)
   * @returns Response message to send back to user
   */
  async processInput(
    userId: string,
    input: string,
    channel: "sms" | "ivr"
  ): Promise<string> {
    console.log(`[ConversationEngine] Processing input from ${userId}: "${input}" via ${channel}`);

  // Get or initialize state
  let state = ConversationEngine.stateStore.get(userId);

    if (!state) {
      // New conversation - start daily ritual flow
      state = {
        userId,
        currentFlow: "daily",
        currentStep: "mood_prompt",
        channel,
        context: {},
      };
  ConversationEngine.stateStore.set(userId, state);

      return this.getMoodPromptMessage();
    }

    // Handle current step based on FSM state
    switch (state.currentStep) {
      case "mood_prompt":
        return this.handleMoodInput(state, input.trim());

      case "intention_prompt":
        return await this.handleIntentionPrompt(state, input.trim());

      case "intention_capture":
        return await this.handleIntentionCapture(state, input.trim());

      case "complete":
        // Conversation already completed - reset and start new flow
        console.log(`[ConversationEngine] User ${userId} starting new check-in after completion`);
        ConversationEngine.stateStore.delete(userId);

        // Initialize new conversation state
        const newState: ConversationState = {
          userId,
          currentFlow: "daily",
          currentStep: "mood_prompt",
          channel,
          context: {},
        };
        ConversationEngine.stateStore.set(userId, newState);

        return this.getMoodPromptMessage();

      default:
        // Robustness: log and reset if we encounter an unexpected state so the
        // conversation doesn't get stuck.
        console.warn(`[ConversationEngine] Unhandled step "${state.currentStep}" for user ${userId}. Resetting state.`);
        ConversationEngine.stateStore.delete(userId);
        return "Thank you for your check-in! This conversation has now ended.";
    }
  }

  /**
   * Handle mood selection input
   * @param state - Current conversation state
   * @param input - User's numeric input (1-4)
   * @returns Response message
   */
  private handleMoodInput(state: ConversationState, input: string): string {
    const mood = MOOD_MAP[input];

    if (!mood) {
      // Invalid input - re-prompt
      return `Sorry, I didn't understand "${input}". Please reply with a number:\n\n${this.getMoodPromptMessage()}`;
    }

    // Valid mood selection - store and transition to intention prompt
    state.context.mood = mood;
    state.currentStep = "intention_prompt";
    ConversationEngine.stateStore.set(state.userId, state);

    console.log(`[ConversationEngine] User ${state.userId} selected mood: ${mood}`);

    // AC #1 & #2: Send affirmation immediately followed by intention prompt
    return `${AFFIRMATIONS[mood]}\n\nWould you like to set an intention for today? Reply YES or NO.`;
  }

  /**
   * Handle intention prompt - parse YES/NO response
   * @param state - Current conversation state
   * @param input - User's YES/NO response
   * @returns Response message
   */
  private async handleIntentionPrompt(state: ConversationState, input: string): Promise<string> {
    const normalizedInput = input.toLowerCase();

    if (normalizedInput === "yes") {
      state.currentStep = "intention_capture";
      ConversationEngine.stateStore.set(state.userId, state);

      return "Please share your intention for today.";
    }

    if (normalizedInput === "no") {
      state.currentStep = "complete";
      ConversationEngine.stateStore.set(state.userId, state);

      // Save session to database (user declined to set intention)
      await this.saveSession(state);

      return "Your check-in is complete. Thank you.";
    }

    // Invalid input - re-prompt
    return `Sorry, I didn't understand "${input}". Please reply YES or NO.`;
  }

  /**
   * Handle intention capture - store user's intention
   * @param state - Current conversation state
   * @param input - User's intention message
   * @returns Response message
   */
  private async handleIntentionCapture(state: ConversationState, input: string): Promise<string> {
    state.context.intention = input.trim();
    state.currentStep = "complete";
    ConversationEngine.stateStore.set(state.userId, state);

    console.log(`[ConversationEngine] User ${state.userId} set intention: ${input.trim()}`);

    // Save session to database (user provided intention)
    await this.saveSession(state);

    return "Your check-in is complete. Thank you.";
  }

  /**
   * Get the initial mood prompt message
   */
  private getMoodPromptMessage(): string {
    return "Welcome to your daily check-in. How are you feeling? Reply with: 1 for Calm, 2 for Stressed, 3 for Tempted, or 4 for Hopeful.";
  }

  /**
   * Get next message based on current state (for future FSM expansion)
   */
  async getNextMessage(state: ConversationState): Promise<string> {
    switch (state.currentStep) {
      case "mood_prompt":
        return this.getMoodPromptMessage();
      case "mood_selected":
        return "Your check-in is complete!";
      default:
        return "Thank you!";
    }
  }

  /**
   * Save session to database and link messages
   * Story 5: Implements database persistence
   */
  async saveSession(state: ConversationState): Promise<void> {
    try {
      console.log(`[ConversationEngine] Saving session for user ${state.userId}`);

      // Insert session record
      const [newSession] = await this.dbClient.insert(schema.sessions).values({
        userId: state.userId,
        flowType: state.currentFlow,
        channel: state.channel,
        mood: state.context.mood || null,
        intention: state.context.intention || null,
      }).returning();

      console.log(`[ConversationEngine] Session created: ${newSession.id}`);

      // Link all messages for this user to the new session
      await this.linkMessagesToSession(state.userId, newSession.id);

      console.log(`[ConversationEngine] Messages linked to session ${newSession.id}`);
    } catch (error) {
      console.error(`[ConversationEngine] Failed to save session for ${state.userId}:`, error);
      // Don't throw - continue execution to avoid blocking Twilio response
    }
  }

  /**
   * Link all unlinked messages for a user to a session
   * Links both inbound (fromNumber = userId) and outbound (toNumber = userId) messages
   * @param userId - User identifier (phone number)
   * @param sessionId - Session ID to link messages to
   */
  private async linkMessagesToSession(userId: string, sessionId: string): Promise<void> {
    try {
      await this.dbClient.update(schema.messages)
        .set({ sessionId })
        .where(
          and(
            or(
              eq(schema.messages.fromNumber, userId),
              eq(schema.messages.toNumber, userId)
            ),
            isNull(schema.messages.sessionId)
          )
        );
    } catch (error) {
      console.error(`[ConversationEngine] Failed to link messages to session ${sessionId}:`, error);
      // Don't throw - log error but continue
    }
  }

  /**
   * Log a message to the database
   * @param direction - 'inbound' or 'outbound'
   * @param fromNumber - Sender phone number
   * @param toNumber - Recipient phone number
   * @param body - Message content
   * @param twilioSid - Optional Twilio message SID
   */
  async logMessage(
    direction: 'inbound' | 'outbound',
    fromNumber: string,
    toNumber: string,
    body: string,
    channel: 'sms' | 'ivr' | 'pwa',
    userId: string,
    twilioSid?: string
  ): Promise<void> {
    try {
      console.log(`[ConversationEngine] Logging ${direction} message from ${fromNumber}`);

      await this.dbClient.insert(schema.interactions).values({
        sessionId: null, // Will be linked when session is created
        direction,
        fromNumber,
        toNumber,
        body,
        channel,
        userId,
        twilioSid: twilioSid || null,
      });

      console.log(`[ConversationEngine] Message logged successfully`);
    } catch (error) {
      console.error(`[ConversationEngine] Failed to log ${direction} message:`, error);
      // Don't throw - log error but continue
    }
  }

  /**
   * Handle mood selection from PWA
   * @param userId - The user's ID
   * @param mood - The selected mood
   */
  async handlePwaMoodSelection(userId: string, mood: MoodOption): Promise<{ sessionId: string; affirmation: string }> {
    console.log(`[ConversationEngine] Handling PWA mood selection for user ${userId}`);

    // 1. Create a new session
    const [newSession] = await this.dbClient.insert(schema.sessions).values({
      userId,
      flowType: 'daily-ritual',
      channel: 'pwa',
      mood,
    }).returning();

    console.log(`[ConversationEngine] PWA session created: ${newSession.id}`);

    // 2. Log the mood selection as an interaction
    await this.dbClient.insert(schema.interactions).values({
      userId,
      sessionId: newSession.id,
      direction: 'inbound',
      channel: 'pwa',
      contentType: 'mood_selection',
      body: mood,
      status: 'synced',
    });

    const affirmation = AFFIRMATIONS[mood];

    // 3. Log the affirmation as a separate interaction
    await this.dbClient.insert(schema.interactions).values({
      userId,
      sessionId: newSession.id,
      direction: 'outbound',
      channel: 'pwa',
      contentType: 'affirmation_view',
      body: affirmation,
      status: 'synced',
    });

    console.log(`[ConversationEngine] PWA mood selection and affirmation logged for session ${newSession.id}`);

    return {
      sessionId: newSession.id,
      affirmation,
    };
  }

  /**
   * Handle intention submission from PWA
   * @param sessionId - The session ID
   * @param intentionText - The user's intention
   */
  async handlePwaIntention(sessionId: string, intentionText: string): Promise<void> {
    try {
      console.log(`[ConversationEngine] Handling PWA intention for session ${sessionId}`);

      // 1. Fetch the session to get the user ID
      const [session] = await this.dbClient.select().from(schema.sessions).where(eq(schema.sessions.id, sessionId));

      if (!session) {
        console.error(`[ConversationEngine] PWA intention handling failed: session not found for ID ${sessionId}`);
        return;
      }

      // 2. Update the session with the intention
      await this.dbClient.update(schema.sessions).set({ intention: intentionText }).where(eq(schema.sessions.id, sessionId));

      // 3. Log the intention as an interaction
      await this.dbClient.insert(schema.interactions).values({
        userId: session.userId,
        sessionId: sessionId,
        direction: 'inbound',
        channel: 'pwa',
        contentType: 'intention',
        body: intentionText,
        status: 'synced',
      });

      console.log(`[ConversationEngine] PWA intention logged for session ${sessionId}`);
    } catch (error) {
      console.error(`[ConversationEngine] Failed to handle PWA intention for session ${sessionId}:`, error);
    }
  }

  /**
   * Get current state for a user (for testing/debugging)
   */
  getState(userId: string): ConversationState | undefined {
    return ConversationEngine.stateStore.get(userId);
  }

  /**
   * Clear state for a user (for testing)
   */
  clearState(userId: string): void {
    ConversationEngine.stateStore.delete(userId);
  }
}
