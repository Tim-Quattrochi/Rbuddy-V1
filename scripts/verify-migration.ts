import { db } from '../server/storage';
import { users, sessions, interactions, followUps } from '../shared/schema';
import { sql } from 'drizzle-orm';

async function verifyMigration() {
  console.log('🔍 Verifying Phase 2 Database Migration...\n');

  try {
    // 1. Verify interactions table exists
    console.log('1️⃣ Checking interactions table...');
    const interactionsCount = await db.select({ count: sql<number>`count(*)` }).from(interactions);
    console.log(`   ✅ interactions table exists (${interactionsCount[0].count} rows)`);

    // 2. Test inserting a test user with new PWA fields
    console.log('\n2️⃣ Testing new users table fields...');
    const testUser = await db.insert(users).values({
      username: `test_pwa_user_${Date.now()}`,
      password: 'test_password',
      phoneNumber: '+15555551234',
      deviceToken: JSON.stringify({ endpoint: 'https://test.push.service', keys: {} }),
      preferredTime: '09:00',
      enablePushNotifications: 1,
    }).returning();
    console.log(`   ✅ Created user with PWA fields: ${testUser[0].id}`);

    // 3. Test creating a PWA session
    console.log('\n3️⃣ Testing PWA channel in sessions...');
    const testSession = await db.insert(sessions).values({
      userId: testUser[0].id,
      flowType: 'daily',
      channel: 'pwa', // NEW: PWA channel
      mood: 'calm',
    }).returning();
    console.log(`   ✅ Created PWA session: ${testSession[0].id}`);

    // 4. Test creating a PWA interaction
    console.log('\n4️⃣ Testing PWA interaction insert...');
    const testInteraction = await db.insert(interactions).values({
      userId: testUser[0].id,
      sessionId: testSession[0].id,
      direction: 'inbound',
      channel: 'pwa', // NEW: PWA channel
      contentType: 'text',
      body: 'Test PWA message from verification script',
      metadata: { deviceType: 'mobile', appVersion: '1.0.0' },
      status: 'synced',
    }).returning();
    console.log(`   ✅ Created PWA interaction: ${testInteraction[0].id}`);

    // 5. Test creating a push notification follow-up
    console.log('\n5️⃣ Testing push notification follow-up...');
    const testFollowUp = await db.insert(followUps).values({
      userId: testUser[0].id,
      messageType: 'daily_reminder',
      channel: 'push', // NEW: Push channel
      scheduledAt: new Date(Date.now() + 86400000), // Tomorrow
      messageBody: 'Test push notification',
      pushPayload: { title: 'Daily Check-in', body: 'Ready to check in?', icon: '/icon.png' },
    }).returning();
    console.log(`   ✅ Created push follow-up: ${testFollowUp[0].id}`);

    // 6. Verify lastSyncAt can be updated
    console.log('\n6️⃣ Testing lastSyncAt update...');
    await db.update(users)
      .set({ lastSyncAt: new Date() })
      .where(sql`${users.id} = ${testUser[0].id}`);
    console.log(`   ✅ Updated lastSyncAt for user`);

    // Cleanup test data
    console.log('\n🧹 Cleaning up test data...');
    await db.delete(interactions).where(sql`${interactions.userId} = ${testUser[0].id}`);
    await db.delete(followUps).where(sql`${followUps.userId} = ${testUser[0].id}`);
    await db.delete(sessions).where(sql`${sessions.userId} = ${testUser[0].id}`);
    await db.delete(users).where(sql`${users.id} = ${testUser[0].id}`);
    console.log('   ✅ Test data cleaned up');

    console.log('\n✅ Phase 2 Migration Verification: SUCCESS');
    console.log('\nMigration Summary:');
    console.log('  ✅ interactions table exists (renamed from messages)');
    console.log('  ✅ users.deviceToken field working');
    console.log('  ✅ users.preferredTime field working');
    console.log('  ✅ users.lastSyncAt field working');
    console.log('  ✅ users.enablePushNotifications field working');
    console.log('  ✅ sessions.channel includes "pwa" option');
    console.log('  ✅ interactions.channel includes "pwa" option');
    console.log('  ✅ followUps.channel includes "push" option');
    console.log('  ✅ followUps.pushPayload field working');

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Migration verification FAILED:', error);
    process.exit(1);
  }
}

verifyMigration();
