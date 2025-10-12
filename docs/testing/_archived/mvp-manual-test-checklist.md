# Next Moment - MVP Manual Test Checklist

**Version**: 1.0
**Date**: October 10, 2025
**Purpose**: Manual end-to-end testing for 10-day MVP before investor demo
**Timeline**: Execute on Day 10 (October 19, 2025)

---

## Pre-Test Setup

- [ ] Vercel deployment successful (check `https://[project].vercel.app`)
- [ ] Twilio webhook configured to point to Vercel URL
- [ ] Neon PostgreSQL database accessible
- [ ] `.env` variables configured in Vercel dashboard
- [ ] Twilio trial phone number active
- [ ] Test phone available for SMS testing

---

## Test 1: Daily Ritual Flow (SMS) - Happy Path

**Feature**: F1 – Daily Ritual Flow (SMS Only)
**Priority**: P0 - CRITICAL
**Estimated Time**: 5 minutes

### Steps

1. **Initiate Flow**
   - [ ] Send SMS to Twilio number: "START" or wait for scheduled prompt
   - [ ] **Expected**: Receive mood prompt within 10 seconds
   - [ ] **Actual**: ___________________________

2. **Select Mood**
   - [ ] Reply with: "2" (Getting by)
   - [ ] **Expected**: Receive affirmation message acknowledging mood within 5 seconds
   - [ ] **Actual**: ___________________________

3. **Set Intention (Optional)**
   - [ ] Reply with intention: "Stay calm today"
   - [ ] **Expected**: Receive acknowledgment + completion message
   - [ ] **Actual**: ___________________________

4. **Verify Database Logging**
   - [ ] Check Neon PostgreSQL `sessions` table
   - [ ] **Expected**: New session entry with mood="getting_by", intention="Stay calm today", streak_count updated
   - [ ] **Actual**: ___________________________

5. **Verify Dashboard Update**
   - [ ] Open investor dashboard (`https://[project].vercel.app`)
   - [ ] **Expected**: Total sessions count incremented, recent message visible
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

**Notes**: ___________________________________________

---

## Test 2: Repair Flow ("SLIP" Keyword)

**Feature**: F2 – Rupture & Repair Flow
**Priority**: P0 - CRITICAL
**Estimated Time**: 5 minutes

### Steps

1. **Trigger Repair Flow**
   - [ ] Send SMS: "SLIP"
   - [ ] **Expected**: Immediate empathetic response (<10 seconds): "We're here with you. You're not alone."
   - [ ] **Actual**: ___________________________

2. **Receive Reframe Message**
   - [ ] Wait 10-30 seconds
   - [ ] **Expected**: Receive message: "Slips happen. What matters is what comes next."
   - [ ] **Actual**: ___________________________

3. **Trigger Identification (Optional)**
   - [ ] **Expected**: Receive prompt asking what triggered the slip
   - [ ] Reply: "Saw old friend"
   - [ ] **Expected**: Acknowledgment of trigger
   - [ ] **Actual**: ___________________________

4. **Repair Suggestions**
   - [ ] **Expected**: Receive 3 micro-action suggestions (e.g., "Take 3 deep breaths", "Drink water", "Text someone who cares")
   - [ ] Reply: "Water"
   - [ ] **Expected**: Acknowledgment + next-day follow-up scheduled
   - [ ] **Actual**: ___________________________

5. **Verify Database Logging**
   - [ ] Check `sessions` table
   - [ ] **Expected**: Session with flowType="repair", trigger logged, followUp scheduled
   - [ ] **Actual**: ___________________________

6. **Verify Follow-Up Scheduled**
   - [ ] Check `followUps` table
   - [ ] **Expected**: Entry with scheduledAt=tomorrow, messageType="post_slip_encouragement"
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

**Notes**: ___________________________________________

---

## Test 3: Encouragement Loop (Automated Messages)

**Feature**: F3 – Encouragement Loop
**Priority**: P1 - HIGH
**Estimated Time**: Variable (requires simulating inactivity OR waiting for Vercel Cron)

### Option A: Simulate Inactivity (Recommended)

1. **Set User as Inactive**
   - [ ] Manually update `sessions` table: Set last session timestamp to 4 days ago
   - [ ] **Expected**: Vercel Cron job detects inactivity (next scheduled run)
   - [ ] **Actual**: ___________________________

2. **Trigger Cron Manually** (if Vercel allows)
   - [ ] Invoke `/api/cron/daily-reminders` endpoint
   - [ ] **Expected**: Encouragement message sent: "Hey, we miss you. No pressure—just checking in."
   - [ ] **Actual**: ___________________________

3. **Verify Message Received**
   - [ ] Check test phone
   - [ ] **Expected**: SMS received with "BREAK" option mentioned
   - [ ] **Actual**: ___________________________

4. **Test "BREAK" Keyword**
   - [ ] Reply: "BREAK"
   - [ ] **Expected**: Confirmation message: "Got it. Taking a break is okay. We'll check back in a week."
   - [ ] **Actual**: ___________________________

### Option B: Wait for Milestone (If Time Allows)

1. **Complete 5-Day Streak**
   - [ ] Complete Daily Ritual for 5 consecutive days
   - [ ] **Expected**: Receive milestone celebration message: "5 days of showing up for yourself."
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL | ⏭️ SKIPPED (if time-constrained)

**Notes**: ___________________________________________

---

## Test 4: Investor Demo Dashboard

**Feature**: F7 – Investor Demo Dashboard
**Priority**: P0 - CRITICAL
**Estimated Time**: 3 minutes

### Steps

1. **Access Dashboard**
   - [ ] Open browser: `https://[project].vercel.app`
   - [ ] **Expected**: Dashboard loads within 2 seconds
   - [ ] **Actual**: ___________________________

2. **Verify Real-Time Metrics**
   - [ ] Check "Total Sessions" card
   - [ ] **Expected**: Displays count from database (includes Tests 1-3 sessions)
   - [ ] **Actual**: ___________________________

   - [ ] Check "Active Users" card
   - [ ] **Expected**: Displays 1 (test user)
   - [ ] **Actual**: ___________________________

   - [ ] Check "Average Streak" card
   - [ ] **Expected**: Displays calculated streak (e.g., 1-5 days)
   - [ ] **Actual**: ___________________________

3. **Verify Recent Messages Feed**
   - [ ] Scroll to recent messages section
   - [ ] **Expected**: Shows recent SMS logs (phone masked: +1555***4567)
   - [ ] **Actual**: ___________________________

4. **Verify Mood Distribution Chart**
   - [ ] Check mood distribution visualization
   - [ ] **Expected**: Shows breakdown (e.g., "getting_by": 1 entry)
   - [ ] **Actual**: ___________________________

5. **Test Dashboard Auto-Refresh**
   - [ ] Send new SMS from test phone
   - [ ] Wait 5-10 seconds (TanStack Query polling interval)
   - [ ] **Expected**: Dashboard updates automatically without page refresh
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

**Notes**: ___________________________________________

---

## Test 5: Error Handling & Edge Cases

**Feature**: General System Resilience
**Priority**: P1 - HIGH
**Estimated Time**: 5 minutes

### Steps

1. **Invalid Mood Input**
   - [ ] During Daily Ritual, reply: "banana"
   - [ ] **Expected**: Clarification message: "Please reply with a number: 1=Struggling, 2=Getting by, 3=Good, 4=Great"
   - [ ] **Actual**: ___________________________

2. **Rapid Duplicate Messages**
   - [ ] Send "2" twice within 5 seconds
   - [ ] **Expected**: System processes first valid response, ignores duplicate
   - [ ] **Actual**: ___________________________

3. **Unknown Keyword**
   - [ ] Send SMS: "HELP ME"
   - [ ] **Expected**: Fallback message or ignored (based on conversation state)
   - [ ] **Actual**: ___________________________

4. **Long Message (>160 chars)**
   - [ ] During intention step, send 200-character message
   - [ ] **Expected**: System accepts and logs full message (or truncates gracefully)
   - [ ] **Actual**: ___________________________

5. **Twilio Webhook Signature Validation**
   - [ ] Attempt to call webhook directly (without Twilio signature)
   - [ ] **Expected**: 403 Forbidden response
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

**Notes**: ___________________________________________

---

## Test 6: Deployment & Monitoring

**Feature**: Infrastructure Health
**Priority**: P0 - CRITICAL
**Estimated Time**: 3 minutes

### Steps

1. **Vercel Logs Check**
   - [ ] Open Vercel dashboard → Logs
   - [ ] **Expected**: No error logs from SMS webhook calls
   - [ ] **Actual**: ___________________________

2. **Twilio Console Check**
   - [ ] Open Twilio Console → Messaging logs
   - [ ] **Expected**: All test messages show "delivered" status
   - [ ] **Actual**: ___________________________

3. **Database Connection Pooling**
   - [ ] Send 5 rapid SMS messages
   - [ ] **Expected**: All processed without connection errors
   - [ ] **Actual**: ___________________________

4. **Response Latency**
   - [ ] Measure time from sending SMS to receiving response
   - [ ] **Expected**: <10 seconds for all interactions
   - [ ] **Actual**: ___________________________

**Result**: ✅ PASS | ❌ FAIL | ⚠️ PARTIAL

**Notes**: ___________________________________________

---

## Test Summary

| Test | Status | Priority | Blocker? |
|------|--------|----------|----------|
| 1. Daily Ritual Flow | ⬜ | P0 | YES |
| 2. Repair Flow ("SLIP") | ⬜ | P0 | YES |
| 3. Encouragement Loop | ⬜ | P1 | NO |
| 4. Investor Dashboard | ⬜ | P0 | YES |
| 5. Error Handling | ⬜ | P1 | NO |
| 6. Deployment Health | ⬜ | P0 | YES |

**Overall Result**: ⬜ PASS | ⬜ FAIL | ⬜ PARTIAL

**Blocker Issues** (must fix before demo):
1. ___________________________________________
2. ___________________________________________
3. ___________________________________________

**Non-Blocker Issues** (can defer to Phase 2):
1. ___________________________________________
2. ___________________________________________

---

## Demo Readiness Checklist

- [ ] All P0 tests passing (Tests 1, 2, 4, 6)
- [ ] No critical errors in Vercel logs
- [ ] Dashboard displays real data correctly
- [ ] SMS response latency <10 seconds
- [ ] Twilio webhook signature validation working
- [ ] Database migrations applied successfully
- [ ] Test phone number available for live demo
- [ ] Investor demo talking points prepared

**Demo Ready?**: ⬜ YES | ⬜ NO (explain): ___________________________________________

---

## Notes & Observations

**What Worked Well**:
___________________________________________

**Issues Encountered**:
___________________________________________

**Recommended Improvements for Phase 2**:
___________________________________________

---

**Tester**: ___________________________________________
**Date Completed**: ___________________________________________
**Sign-Off**: ___________________________________________
