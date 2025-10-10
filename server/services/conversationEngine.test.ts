import { describe, it, expect, beforeEach } from 'vitest';
import ConversationEngine from './conversationEngine';

describe('ConversationEngine - Story 3 (Mood Prompt)', () => {
  let engine: ConversationEngine;
  const testUserId = '+1234567890';

  beforeEach(() => {
    engine = new ConversationEngine();
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

      expect(response).toContain('calm');

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('calm');
      expect(state?.currentStep).toBe('mood_selected');
    });

    it('should accept "2" and store "stressed" mood', async () => {
      const response = await engine.processInput(testUserId, '2', 'sms');

      expect(response).toContain('stressed');

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('stressed');
    });

    it('should accept "3" and store "tempted" mood', async () => {
      const response = await engine.processInput(testUserId, '3', 'sms');

      expect(response).toContain('tempted');

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('tempted');
    });

    it('should accept "4" and store "hopeful" mood', async () => {
      const response = await engine.processInput(testUserId, '4', 'sms');

      expect(response).toContain('hopeful');

      const state = engine.getState(testUserId);
      expect(state?.context.mood).toBe('hopeful');
    });

    it('should handle input with whitespace', async () => {
      const response = await engine.processInput(testUserId, '  2  ', 'sms');

      expect(response).toContain('stressed');

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
      expect(response).toContain('Reply with: 1 for Calm');
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
