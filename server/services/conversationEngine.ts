/**
 * ConversationEngine - FSM for SMS/IVR Daily Ritual flows
 *
 * Story 3: Implements mood prompt (Part 1 of Daily Ritual)
 */

export interface ConversationState {
  userId: string;
  currentFlow: "daily" | "repair";
  currentStep: "mood_prompt" | "mood_selected" | "affirmation" | "intention" | "repair_trigger";
  context: Record<string, any>;
}

type MoodOption = "calm" | "stressed" | "tempted" | "hopeful";

const MOOD_MAP: Record<string, MoodOption> = {
  "1": "calm",
  "2": "stressed",
  "3": "tempted",
  "4": "hopeful",
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

    // Handle current step
    if (state.currentStep === "mood_prompt") {
      return this.handleMoodInput(state, input.trim());
    }

    // Future steps will be implemented in subsequent stories
    // Robustness: log and reset if we encounter an unexpected state so the
    // conversation doesn't get stuck.
    console.warn(`[ConversationEngine] Unhandled step "${state.currentStep}" for user ${userId}. Resetting state.`);
    ConversationEngine.stateStore.delete(userId);
    return "Thank you for your check-in! This conversation has now ended.";
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

    // Valid mood selection
  state.context.mood = mood;
  state.currentStep = "mood_selected";
  ConversationEngine.stateStore.set(state.userId, state);

    console.log(`[ConversationEngine] User ${state.userId} selected mood: ${mood}`);

    // Acknowledgment message (future stories will continue flow)
    return `Thank you! You're feeling ${mood}. Your check-in is complete for now.`;
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
