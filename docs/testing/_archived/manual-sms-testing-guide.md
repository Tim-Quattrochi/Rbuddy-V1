# Manual SMS Testing Guide

This guide walks you through testing the Story 5 implementation (database logging) with real Twilio SMS.

## Prerequisites

- ✅ Twilio account with phone number
- ✅ Vercel deployment (preview or production)
- ✅ Database connection (Neon PostgreSQL)
- ✅ Your personal phone number for testing

## Step-by-Step Testing

### 1. Create Test User in Database

Your phone number needs to exist in the `users` table due to foreign key constraints:

```bash
# Replace +15555551234 with YOUR actual phone number
npx tsx scripts/create-test-user.ts +15555551234
```

Expected output:
```
✅ Test user created successfully!
User ID: [some-uuid]
Phone Number: +15555551234
```

### 2. Configure Twilio Webhook

#### Option A: Using Vercel Preview (PR #4)

1. Go to [Twilio Console → Phone Numbers](https://console.twilio.com/us1/develop/phone-numbers/manage/incoming)
2. Click your Twilio phone number
3. Scroll to **Messaging Configuration**
4. Under "A MESSAGE COMES IN":
   - **Webhook URL**:
     ```
     https://rbuddy-v1-git-fix-story-5-bidire-321def-timquattrochis-projects.vercel.app/api/webhooks/twilio/sms
     ```
   - **HTTP Method**: `POST`
5. Click **Save**

#### Option B: Using Production

If you've merged to main and deployed:
```
https://[your-production-domain].vercel.app/api/webhooks/twilio/sms
```

#### Option C: Local Testing (Advanced)

For local testing, you need to expose localhost to the internet:

1. Install ngrok:
   ```bash
   npm install -g ngrok
   ```

2. Start your local server:
   ```bash
   npm run dev
   ```

3. In another terminal, expose port 3000:
   ```bash
   ngrok http 3000
   ```

4. Use the ngrok HTTPS URL in Twilio:
   ```
   https://[random-string].ngrok.io/api/webhooks/twilio/sms
   ```

### 3. Test the Daily Ritual Flow

Send SMS messages from your phone to your Twilio number:

#### Test Case 1: Complete Flow with Intention

| Step | Send | Expect to Receive |
|------|------|-------------------|
| 1 | `start` | Welcome message with mood options (1-4) |
| 2 | `1` | Affirmation + "Would you like to set an intention?" |
| 3 | `yes` | "What intention would you like to set?" |
| 4 | `Stay focused on recovery` | "Your check-in is complete. Thank you." |

**Expected Database:**
- 1 session record (mood='calm', intention='Stay focused on recovery')
- 8 message records (4 inbound + 4 outbound)

#### Test Case 2: Complete Flow without Intention

| Step | Send | Expect to Receive |
|------|------|-------------------|
| 1 | `hello` | Welcome message with mood options |
| 2 | `3` | Affirmation + intention prompt |
| 3 | `no` | "Your check-in is complete. Thank you." |

**Expected Database:**
- 1 session record (mood='tempted', intention=NULL)
- 6 message records (3 inbound + 3 outbound)

#### Test Case 3: Invalid Input Handling

| Step | Send | Expect to Receive |
|------|------|-------------------|
| 1 | `start` | Welcome with mood options |
| 2 | `5` | "Please reply with 1, 2, 3, or 4..." (re-prompt) |
| 3 | `2` | Affirmation + intention prompt |
| 4 | `maybe` | "Please reply YES or NO..." (re-prompt) |
| 5 | `no` | Completion message |

#### Test Case 4: All Mood Types

Test each mood option (1=calm, 2=stressed, 3=tempted, 4=hopeful) to verify:
- Different affirmations are sent
- All moods are correctly saved to database

### 4. Verify Database Records

After completing a flow, check the database:

```bash
npx tsx scripts/verify-session.ts +15555551234
```

Expected output:
```
🔍 Checking sessions for phone number: +15555551234

✅ User found: [user-id]

📋 Sessions (1 total):

Session ID: [session-id]
  Flow Type: daily
  Channel: sms
  Mood: calm
  Intention: Stay focused on recovery
  Streak Count: 0
  Created: 2025-10-11T00:00:00.000Z
  Messages (8):
    INBOUND: "start"
    OUTBOUND: "Welcome to your daily check-in. How are you..."
    INBOUND: "1"
    OUTBOUND: "That's wonderful. Finding peace is a streng..."
    INBOUND: "yes"
    OUTBOUND: "What intention would you like to set for to..."
    INBOUND: "Stay focused on recovery"
    OUTBOUND: "Your check-in is complete. Thank you."

✅ Verification complete!
```

### 5. Verify Message Linking (Critical for Story 5)

Check that BOTH inbound and outbound messages are linked:

```sql
-- Run in database console or using psql
SELECT
  m.direction,
  m."fromNumber",
  m."toNumber",
  m."sessionId" IS NOT NULL as "linked",
  LEFT(m.body, 30) as "preview"
FROM messages m
WHERE m."fromNumber" = '+15555551234' OR m."toNumber" = '+15555551234'
ORDER BY m."createdAt" DESC
LIMIT 20;
```

**✅ PASS:** All messages should have `linked = true`
**❌ FAIL:** If any message has `linked = false`, the bidirectional linking is broken

## Troubleshooting

### Issue: "Bad Request: Missing required fields"

**Cause:** Twilio webhook not configured correctly or sending invalid data.

**Fix:**
1. Verify webhook URL is correct in Twilio Console
2. Check Vercel function logs: `vercel logs [deployment-url]`
3. Ensure HTTP method is `POST`

### Issue: "Forbidden" (403 error)

**Cause:** Twilio signature validation failing.

**Fix:**
1. Verify `TWILIO_AUTH_TOKEN` in Vercel environment variables matches your account
2. Check that webhook URL exactly matches (including https://)
3. Verify no proxy/CDN is modifying the request

### Issue: Messages not linked to session (sessionId is NULL)

**Cause:** Bidirectional linking WHERE clause not working.

**Fix:**
1. This was the original bug - verify you're on the latest commit
2. Check that code has `or(eq(fromNumber, userId), eq(toNumber, userId))`
3. Re-run tests to verify fix is applied

### Issue: "Foreign key constraint violation"

**Cause:** User doesn't exist in database.

**Fix:**
```bash
npx tsx scripts/create-test-user.ts +YOUR_PHONE_NUMBER
```

### Issue: No response from Twilio

**Cause:** Webhook endpoint not reachable or timeout.

**Fix:**
1. Check Vercel deployment status
2. Verify webhook URL is accessible: `curl [webhook-url]`
3. Check Vercel function logs for errors
4. Ensure database connection is working

## Viewing Logs

### Vercel Logs (Real-time)
```bash
vercel logs --follow
```

### Check specific deployment
```bash
vercel logs https://rbuddy-v1-git-fix-story-5-bidire-321def-timquattrochis-projects.vercel.app
```

### Database Logs (Neon)

1. Go to [Neon Console](https://console.neon.tech)
2. Select your project
3. Click "Operations" tab
4. View query logs

## Success Criteria (from PR #4)

After testing, verify all these are true:

- [ ] ✅ Complete a daily ritual flow via SMS
- [ ] ✅ Session record created in `sessions` table
- [ ] ✅ All inbound messages saved to `messages` table
- [ ] ✅ All outbound messages saved to `messages` table
- [ ] ✅ All messages linked to session via `sessionId`
- [ ] ✅ Mood and intention stored correctly
- [ ] ✅ NO path works (session without intention)
- [ ] ✅ Invalid inputs are handled gracefully

## Next Steps

Once manual testing is complete and all checks pass:

1. Update PR #4 with test results (comment with verification output)
2. Request final review from team
3. Merge to main
4. Deploy to production
5. Update Twilio webhook to production URL

## Additional Test Scenarios

### Edge Cases

1. **Long intention text** (test 160+ characters):
   ```
   I want to focus on staying positive and present throughout the entire day, being mindful of my triggers and practicing self-compassion whenever I face challenges in my recovery journey.
   ```

2. **Special characters in intention**:
   ```
   Stay strong! 💪 @home #recovery
   ```

3. **Multiple rapid messages** (test concurrency):
   - Send 3-4 messages quickly in succession
   - Verify state machine handles correctly

4. **Restart after completion**:
   - Complete one flow
   - Send another message to start new flow
   - Verify new session is created

## Reference

- **Story 5 Documentation**: `docs/stories/s5.md`
- **PR #4**: https://github.com/Tim-Quattrochi/Rbuddy-V1/pull/4
- **Twilio Console**: https://console.twilio.com
- **Vercel Dashboard**: https://vercel.com/dashboard
