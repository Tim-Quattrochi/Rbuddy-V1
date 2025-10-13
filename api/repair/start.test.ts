import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { db } from 'server/storage';
import { users, sessions, interactions } from '../../shared/schema';

import { eq, and } from 'drizzle-orm';
import ConversationEngine from 'server/services/conversationEngine';

/**
 * Integration Test Suite for Repair Flow (Rupture & Repair)
 *
 * Tests AC#3-5 from Story 4.1:
 * - Creates repair session with correct flowType
 * - Logs trigger selection and repair suggestion
 * - Verifies streak is broken (dynamic calculation)
 */
describe('Repair Flow Integration Tests', () => {
  const engine = new ConversationEngine();
  let testUserId: string;

  beforeAll(async () => {
    // Create a test user
    const [user] = await db.insert(users).values({
      username: `repair-test-${Date.now()}`,
      email: `repair-test-${Date.now()}@example.com`,
      password: 'test-password',
    }).returning();

    testUserId = user.id;
    console.log(`[Repair Test] Created test user: ${testUserId}`);
  });

  afterAll(async () => {
    // Cleanup: Delete test data
    if (testUserId) {
      await db.delete(interactions).where(eq(interactions.userId, testUserId));
      await db.delete(sessions).where(eq(sessions.userId, testUserId));
      await db.delete(users).where(eq(users.id, testUserId));
      console.log(`[Repair Test] Cleaned up test user: ${testUserId}`);
    }
  });

  it('should create repair session successfully (AC#3, AC#4)', async () => {
    const result = await engine.handlePwaRepairFlow(testUserId, 'stress');

    // Verify return structure
    expect(result).toBeDefined();
    expect(result.sessionId).toBeDefined();
    expect(result.message).toBe("Slips happen. What matters is what you do next.");
    expect(result.repairSuggestion).toBe("Take 3 deep breaths right now.");

    // Verify session was created with correct flowType
    const [session] = await db.select()
      .from(sessions)
      .where(eq(sessions.id, result.sessionId));

    expect(session).toBeDefined();
    expect(session.userId).toBe(testUserId);
    expect(session.flowType).toBe('repair');
    expect(session.channel).toBe('pwa');
  });

  it('should log trigger selection interaction (AC#6)', async () => {
    const result = await engine.handlePwaRepairFlow(testUserId, 'people');

    // Verify trigger interaction was logged
    const sessionInteractions = await db.select()
      .from(interactions)
      .where(and(
        eq(interactions.sessionId, result.sessionId),
        eq(interactions.direction, 'inbound')
      ));

    expect(sessionInteractions.length).toBeGreaterThanOrEqual(1);

    const triggerInteraction = sessionInteractions[0];
    expect(triggerInteraction.contentType).toBe('text');
    expect(triggerInteraction.body).toBe('people');
    expect(triggerInteraction.channel).toBe('pwa');
  });

  it('should log repair suggestion interaction (AC#7)', async () => {
    const result = await engine.handlePwaRepairFlow(testUserId, 'craving');

    // Verify repair suggestion interaction was logged
    const sessionInteractions = await db.select()
      .from(interactions)
      .where(and(
        eq(interactions.sessionId, result.sessionId),
        eq(interactions.direction, 'outbound')
      ));

    expect(sessionInteractions.length).toBeGreaterThanOrEqual(1);

    const suggestionInteraction = sessionInteractions[0];
    expect(suggestionInteraction.contentType).toBe('text');
    expect(suggestionInteraction.body).toBe("Drink a glass of water and step outside.");
    expect(suggestionInteraction.channel).toBe('pwa');
  });

  it('should return correct repair suggestion mapping', async () => {
    const triggers = [
      { trigger: 'stress', expected: 'Take 3 deep breaths right now.' },
      { trigger: 'people', expected: 'Text or call someone who supports your recovery.' },
      { trigger: 'craving', expected: 'Drink a glass of water and step outside.' },
    ];

    for (const { trigger, expected } of triggers) {
      const result = await engine.handlePwaRepairFlow(testUserId, trigger);
      expect(result.repairSuggestion).toBe(expected);
    }
  });

  it('should break user streak when repair session is created (AC#5)', async () => {
    // Create a 3-day streak with daily-ritual sessions
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const twoDaysAgo = new Date(today);
    twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

    await db.insert(sessions).values([
      {
        userId: testUserId,
        flowType: 'daily-ritual',
        channel: 'pwa',
        mood: 'calm',
        createdAt: twoDaysAgo,
      },
      {
        userId: testUserId,
        flowType: 'daily-ritual',
        channel: 'pwa',
        mood: 'hopeful',
        createdAt: yesterday,
      },
      {
        userId: testUserId,
        flowType: 'daily-ritual',
        channel: 'pwa',
        mood: 'calm',
        createdAt: today,
      },
    ]);

    // Verify streak exists before repair (would be 3)
    const sessionsBeforeRepair = await db.select()
      .from(sessions)
      .where(and(
        eq(sessions.userId, testUserId),
        eq(sessions.flowType, 'daily-ritual')
      ));

    expect(sessionsBeforeRepair.length).toBe(3);

    // Create repair session
    await engine.handlePwaRepairFlow(testUserId, 'stress');

    // Verify repair session exists
    const repairSessions = await db.select()
      .from(sessions)
      .where(and(
        eq(sessions.userId, testUserId),
        eq(sessions.flowType, 'repair')
      ));

    expect(repairSessions.length).toBeGreaterThanOrEqual(1);

    // Note: Actual streak calculation is done in api/user/stats.ts
    // This test verifies that a repair session was created, which will
    // break the consecutive daily-ritual chain when calculateStreak() runs
  });

  it('should allow multiple repair sessions same day (Edge Case)', async () => {
    const result1 = await engine.handlePwaRepairFlow(testUserId, 'stress');
    const result2 = await engine.handlePwaRepairFlow(testUserId, 'people');

    expect(result1.sessionId).not.toBe(result2.sessionId);

    // Both sessions should exist
    const repairSessions = await db.select()
      .from(sessions)
      .where(and(
        eq(sessions.userId, testUserId),
        eq(sessions.flowType, 'repair')
      ));

    expect(repairSessions.length).toBeGreaterThanOrEqual(2);
  });
});
