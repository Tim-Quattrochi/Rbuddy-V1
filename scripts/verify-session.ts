/**
 * Script to verify session and message data in database
 * Run with: npx tsx scripts/verify-session.ts +YOUR_PHONE_NUMBER
 */

import { db } from '../server/storage';
import * as schema from '../shared/schema';
import { eq, desc } from 'drizzle-orm';

const phoneNumber = process.argv[2];

if (!phoneNumber) {
  console.error('Usage: npx tsx scripts/verify-session.ts +15555551234');
  process.exit(1);
}

async function verifySession() {
  try {
    console.log(`\n🔍 Checking sessions for phone number: ${phoneNumber}\n`);

    // Get user
    const users = await db.select()
      .from(schema.users)
      .where(eq(schema.users.phoneNumber, phoneNumber));

    if (users.length === 0) {
      console.log('❌ No user found with this phone number.');
      console.log('Run: npx tsx scripts/create-test-user.ts', phoneNumber);
      process.exit(1);
    }

    const user = users[0];
    console.log('✅ User found:', user.id);

    // Get sessions
    const sessions = await db.select()
      .from(schema.sessions)
      .where(eq(schema.sessions.userId, phoneNumber))
      .orderBy(desc(schema.sessions.createdAt));

    console.log(`\n📋 Sessions (${sessions.length} total):\n`);

    if (sessions.length === 0) {
      console.log('❌ No sessions found.');
      console.log('   Try completing a daily ritual flow via SMS first.');
    } else {
      for (const session of sessions) {
        console.log('Session ID:', session.id);
        console.log('  Flow Type:', session.flowType);
        console.log('  Channel:', session.channel);
        console.log('  Mood:', session.mood || '(none)');
        console.log('  Intention:', session.intention || '(none)');
        console.log('  Streak Count:', session.streakCount);
        console.log('  Created:', session.createdAt);

        // Get messages for this session
        const messages = await db.select()
          .from(schema.messages)
          .where(eq(schema.messages.sessionId, session.id))
          .orderBy(schema.messages.createdAt);

        console.log(`  Messages (${messages.length}):`);
        for (const msg of messages) {
          console.log(`    ${msg.direction.toUpperCase()}: "${msg.body.substring(0, 50)}${msg.body.length > 50 ? '...' : ''}"`);
        }
        console.log('');
      }
    }

    // Check for unlinked messages
    const unlinkedMessages = await db.select()
      .from(schema.messages)
      .where(eq(schema.messages.fromNumber, phoneNumber));

    const unlinked = unlinkedMessages.filter(m => !m.sessionId);

    if (unlinked.length > 0) {
      console.log(`⚠️  Warning: ${unlinked.length} unlinked messages found (sessionId is NULL)`);
      console.log('   This might indicate an incomplete conversation.\n');
    }

    console.log('✅ Verification complete!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error verifying session:', error);
    process.exit(1);
  }
}

verifySession();
