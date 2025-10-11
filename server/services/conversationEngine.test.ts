import { describe, it, expect, beforeEach } from 'vitest';
import ConversationEngine from './conversationEngine';

describe('ConversationEngine - Story 3 (Mood Prompt)', () => {
  let engine: ConversationEngine;
  const testUserId = '+1234567890';

  beforeEach(() => {
    engine = new ConversationEngine();
    engine.clearState(testUserId);
  });

  describe('Initial mood prompt', () => {
    it('should send mood prompt for new user', async () => {
      const response = await engine.processInput(testUserId, 'hello', 'sms');

      expect(response).toContain('Welcome to your daily check-in');
      expect(response).toContain('1 for Calm');
      expect(response).toContain('2 for Stressed');
      expect(response).toContain('3 for Tempted');
      expect(response).toContain('4 for Hopeful');
    });

    it('should initialize state for new user', async () => {
      await engine.processInput(testUserId, 'start', 'sms');

      const state = engine.getState(testUserId);
      expect(state).toBeDefined();
      expect(state?.currentFlow).toBe('daily');
      expect(state?.currentStep).toBe('mood_prompt');
      expect(state?.userId).toBe(testUserId);
    });
  });

  describe('Valid mood selection', () => {
    beforeEach(async () => {
      // Initialize conversation
      await engine.processInput(testUserId, 'start', 'sms');
    });

    it('should accept "1" and store "calm" mood', async () => {
      const response = await engine.processInput(testUserId, '1', 'sms');

      expect(response).toContain("That's wonderful");

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('calm');
      expect(state?.currentStep).toBe('intention_prompt');
    });

    it('should accept "2" and store "stressed" mood', async () => {
      const response = await engine.processInput(testUserId, '2', 'sms');

      expect(response).toContain("I hear you");

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('stressed');
    });

    it('should accept "3" and store "tempted" mood', async () => {
      const response = await engine.processInput(testUserId, '3', 'sms');

      expect(response).toContain("Thank you for being honest");

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('tempted');
    });

    it('should accept "4" and store "hopeful" mood', async () => {
      const response = await engine.processInput(testUserId, '4', 'sms');

      expect(response).toContain("That's beautiful");

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('hopeful');
    });

    it('should handle input with whitespace', async () => {
      const response = await engine.processInput(testUserId, '  2  ', 'sms');

      expect(response).toContain("I hear you");

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('stressed');
    });
  });

  describe('Invalid mood input', () => {
    beforeEach(async () => {
      // Initialize conversation
      await engine.processInput(testUserId, 'start', 'sms');
    });

    it('should reject "5" and re-prompt', async () => {
      const response = await engine.processInput(testUserId, '5', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('5');
      expect(response).toContain('1 for Calm');

      // State should remain at mood_prompt
      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('mood_prompt');
      expect(state?.context.mood).toBeUndefined();
    });

    it('should reject "0" and re-prompt', async () => {
      const response = await engine.processInput(testUserId, '0', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('0');
    });

    it('should reject text input and re-prompt', async () => {
      const response = await engine.processInput(testUserId, 'calm', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('calm');
      expect(response).toContain('1 for Calm');
    });

    it('should reject empty input and re-prompt', async () => {
      const response = await engine.processInput(testUserId, '', 'sms');

      expect(response).toContain("didn't understand");
    });

    it('should reject special characters and re-prompt', async () => {
      const response = await engine.processInput(testUserId, '!@#', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('!@#');
    });
  });

  describe('State management', () => {
    it('should maintain separate states for different users', async () => {
      const user1 = '+1111111111';
      const user2 = '+2222222222';

      await engine.processInput(user1, 'start', 'sms');
      await engine.processInput(user2, 'start', 'sms');

      await engine.processInput(user1, '1', 'sms');
      await engine.processInput(user2, '3', 'sms');

      const state1 = engine.getState(user1);
      const state2 = engine.getState(user2);

      expect(state1?.context.mood).toBe('calm');
      expect(state2?.context.mood).toBe('tempted');
    });

    it('should allow clearing state for testing', async () => {
      await engine.processInput(testUserId, 'start', 'sms');

      expect(engine.getState(testUserId)).toBeDefined();

      engine.clearState(testUserId);

      expect(engine.getState(testUserId)).toBeUndefined();
    });
  });

  describe('Channel support', () => {
    it('should work with SMS channel', async () => {
      const response = await engine.processInput(testUserId, 'start', 'sms');

      expect(response).toContain('Welcome to your daily check-in');
    });

    it('should work with IVR channel', async () => {
      const response = await engine.processInput(testUserId, 'start', 'ivr');

      expect(response).toContain('Welcome to your daily check-in');
    });
  });
});

describe('ConversationEngine - Story 4 (Affirmation & Intention)', () => {
  let engine: ConversationEngine;
  const testUserId = '+1234567890';

  beforeEach(() => {
    engine = new ConversationEngine();
    engine.clearState(testUserId);
  });

  describe('Affirmation delivery', () => {
    it('should send affirmation + intention prompt for calm mood (AC #1, #2)', async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      const response = await engine.processInput(testUserId, '1', 'sms');

      // AC #1: Affirmation sent immediately after mood
      expect(response).toContain("That's wonderful");
      expect(response).toContain("Finding peace is a strength");

      // AC #2: Intention prompt follows affirmation immediately
      expect(response).toContain("Would you like to set an intention for today?");
      expect(response).toContain("Reply YES or NO");

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_prompt');
      expect(state?.context.mood).toBe('calm');
    });

    it('should send affirmation + intention prompt for stressed mood (AC #1, #2)', async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      const response = await engine.processInput(testUserId, '2', 'sms');

      expect(response).toContain("I hear you");
      expect(response).toContain("Taking this moment for yourself is important");
      expect(response).toContain("Would you like to set an intention for today?");

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_prompt');
    });

    it('should send affirmation + intention prompt for tempted mood (AC #1, #2)', async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      const response = await engine.processInput(testUserId, '3', 'sms');

      expect(response).toContain("Thank you for being honest");
      expect(response).toContain("showing courage");
      expect(response).toContain("Would you like to set an intention for today?");

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_prompt');
    });

    it('should send affirmation + intention prompt for hopeful mood (AC #1, #2)', async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      const response = await engine.processInput(testUserId, '4', 'sms');

      expect(response).toContain("That's beautiful");
      expect(response).toContain("Hope is a powerful force");
      expect(response).toContain("Would you like to set an intention for today?");

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_prompt');
    });
  });

  describe('Intention prompt responses', () => {
    beforeEach(async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      await engine.processInput(testUserId, '1', 'sms'); // Select calm - now at intention_prompt
    });

    it('should handle YES response (lowercase) - AC #3, #4', async () => {
      const response = await engine.processInput(testUserId, 'yes', 'sms');

      expect(response).toContain('Please share your intention for today');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_capture');
    });

    it('should handle YES response (uppercase) - AC #3, #4', async () => {
      const response = await engine.processInput(testUserId, 'YES', 'sms');

      expect(response).toContain('Please share your intention for today');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_capture');
    });

    it('should handle YES response (mixed case) - AC #3, #4', async () => {
      const response = await engine.processInput(testUserId, 'Yes', 'sms');

      expect(response).toContain('Please share your intention for today');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_capture');
    });

    it('should handle NO response (lowercase) - AC #3, #5, #6', async () => {
      const response = await engine.processInput(testUserId, 'no', 'sms');

      expect(response).toContain('Your check-in is complete');
      expect(response).toContain('Thank you');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('complete');
      expect(state?.context.intention).toBeUndefined();
    });

    it('should handle NO response (uppercase) - AC #3, #5, #6', async () => {
      const response = await engine.processInput(testUserId, 'NO', 'sms');

      expect(response).toContain('Your check-in is complete');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('complete');
    });

    it('should reject invalid response and re-prompt - AC #3', async () => {
      const response = await engine.processInput(testUserId, 'maybe', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('maybe');
      expect(response).toContain('Please reply YES or NO');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('intention_prompt');
    });

    it('should reject empty input and re-prompt - AC #3', async () => {
      const response = await engine.processInput(testUserId, '', 'sms');

      expect(response).toContain("didn't understand");
      expect(response).toContain('Please reply YES or NO');
    });
  });

  describe('Intention capture', () => {
    beforeEach(async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      await engine.processInput(testUserId, '2', 'sms'); // Select stressed - now at intention_prompt
      await engine.processInput(testUserId, 'yes', 'sms'); // Say yes to intention
    });

    it('should capture and store user intention - AC #4, #6', async () => {
      const intention = 'Stay focused and positive today';
      const response = await engine.processInput(testUserId, intention, 'sms');

      expect(response).toContain('Your check-in is complete');
      expect(response).toContain('Thank you');

      const state = engine.getState(testUserId);
      expect(state?.currentStep).toBe('complete');
      expect(state?.context.intention).toBe(intention);
    });

    it('should trim whitespace from intention - AC #4', async () => {
      const intention = '  Be kind to myself  ';
      await engine.processInput(testUserId, intention, 'sms');

      const state = engine.getState(testUserId);
      expect(state?.context.intention).toBe('Be kind to myself');
    });

    it('should handle multi-word intentions - AC #4', async () => {
      const intention = 'I will focus on one task at a time and be present';
      await engine.processInput(testUserId, intention, 'sms');

      const state = engine.getState(testUserId);
      expect(state?.context.intention).toBe(intention);
    });

    it('should handle short intentions - AC #4', async () => {
      const intention = 'Breathe';
      await engine.processInput(testUserId, intention, 'sms');

      const state = engine.getState(testUserId);
      expect(state?.context.intention).toBe(intention);
    });
  });

  describe('Complete flow - with intention', () => {
    it('should complete full flow: mood → affirmation+prompt → yes → intention → complete', async () => {
      // Start
      const msg1 = await engine.processInput(testUserId, 'hello', 'sms');
      expect(msg1).toContain('Welcome to your daily check-in');

      // Select mood - receives affirmation + intention prompt immediately
      const msg2 = await engine.processInput(testUserId, '3', 'sms');
      expect(msg2).toContain('Thank you for being honest');
      expect(msg2).toContain('Would you like to set an intention');
      expect(engine.getState(testUserId)?.currentStep).toBe('intention_prompt');

      // Say yes to intention
      const msg3 = await engine.processInput(testUserId, 'YES', 'sms');
      expect(msg3).toContain('Please share your intention');
      expect(engine.getState(testUserId)?.currentStep).toBe('intention_capture');

      // Provide intention
      const msg4 = await engine.processInput(testUserId, 'Stay strong today', 'sms');
      expect(msg4).toContain('Your check-in is complete');

      const finalState = engine.getState(testUserId);
      expect(finalState?.currentStep).toBe('complete');
      expect(finalState?.context.mood).toBe('tempted');
      expect(finalState?.context.intention).toBe('Stay strong today');
    });
  });

  describe('Complete flow - without intention', () => {
    it('should complete full flow: mood → affirmation+prompt → no → complete', async () => {
      // Start
      await engine.processInput(testUserId, 'start', 'sms');

      // Select mood - receives affirmation + intention prompt immediately
      const msg2 = await engine.processInput(testUserId, '4', 'sms');
      expect(msg2).toContain("That's beautiful");
      expect(msg2).toContain('Would you like to set an intention');
      expect(engine.getState(testUserId)?.currentStep).toBe('intention_prompt');

      // Say no to intention
      const msg3 = await engine.processInput(testUserId, 'no', 'sms');
      expect(msg3).toContain('Your check-in is complete');

      const finalState = engine.getState(testUserId);
      expect(finalState?.currentStep).toBe('complete');
      expect(finalState?.context.mood).toBe('hopeful');
      expect(finalState?.context.intention).toBeUndefined();
    });
  });

  describe('State persistence across flow', () => {
    it('should maintain mood context throughout entire flow - AC #7', async () => {
      await engine.processInput(testUserId, 'start', 'sms');
      await engine.processInput(testUserId, '1', 'sms'); // calm - now at intention_prompt

      let state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('calm');
      expect(state?.currentStep).toBe('intention_prompt');

      await engine.processInput(testUserId, 'yes', 'sms'); // yes to intention
      state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('calm');
      expect(state?.currentStep).toBe('intention_capture');

      await engine.processInput(testUserId, 'My intention', 'sms');
      state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('calm');
      expect(state?.context.intention).toBe('My intention');
      expect(state?.currentStep).toBe('complete');
    });
  });

  describe('New conversation after completion', () => {
    it('should allow starting new check-in after completion', async () => {
      // Complete first check-in
      await engine.processInput(testUserId, 'start', 'sms');
      await engine.processInput(testUserId, '1', 'sms'); // Now at intention_prompt
      await engine.processInput(testUserId, 'no', 'sms');

      expect(engine.getState(testUserId)?.currentStep).toBe('complete');

      // Start new check-in
      const response = await engine.processInput(testUserId, 'hello again', 'sms');
      expect(response).toContain('Welcome to your daily check-in');
      expect(engine.getState(testUserId)?.currentStep).toBe('mood_prompt');
      expect(engine.getState(testUserId)?.context.mood).toBeUndefined();
      expect(engine.getState(testUserId)?.context.intention).toBeUndefined();
    });
  });
});
