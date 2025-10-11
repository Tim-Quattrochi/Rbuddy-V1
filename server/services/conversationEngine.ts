/**
 * ConversationEngine - FSM for SMS/IVR Daily Ritual flows
 *
 * Story 3: Implements mood prompt (Part 1 of Daily Ritual)
 */

export interface ConversationContext {
  mood?: MoodOption;
  intention?: string;
}

export interface ConversationState {
  userId: string;
  currentFlow: "daily" | "repair";
  currentStep: "mood_prompt" | "mood_selected" | "affirmation" | "intention_prompt" | "intention_capture" | "complete" | "repair_trigger";
  context: ConversationContext;
}

type MoodOption = "calm" | "stressed" | "tempted" | "hopeful";

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
        return this.handleIntentionPrompt(state, input.trim());

      case "intention_capture":
        return this.handleIntentionCapture(state, input.trim());

      case "complete":
        // Conversation already completed - reset and start new flow
        console.log(`[ConversationEngine] User ${userId} starting new check-in after completion`);
        ConversationEngine.stateStore.delete(userId);

        // Initialize new conversation state
        const newState: ConversationState = {
          userId,
          currentFlow: "daily",
          currentStep: "mood_prompt",
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
  private handleIntentionPrompt(state: ConversationState, input: string): string {
    const normalizedInput = input.toLowerCase();

    if (normalizedInput === "yes") {
      state.currentStep = "intention_capture";
      ConversationEngine.stateStore.set(state.userId, state);

      return "Please share your intention for today.";
    }

    if (normalizedInput === "no") {
      state.currentStep = "complete";
      ConversationEngine.stateStore.set(state.userId, state);

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
  private handleIntentionCapture(state: ConversationState, input: string): string {
    state.context.intention = input.trim();
    state.currentStep = "complete";
    ConversationEngine.stateStore.set(state.userId, state);

    console.log(`[ConversationEngine] User ${state.userId} set intention: ${input.trim()}`);

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
   * Save session to database (placeholder for future stories)
   */
  async saveSession(state: ConversationState): Promise<void> {
    // Story 3: In-memory only - database persistence in future stories
    console.log(`[ConversationEngine] Session saved (in-memory): ${state.userId}`);
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
