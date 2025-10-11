# PWA Pivot - Implementation Progress

**Date Started:** October 11, 2025
**Decision:** Pivot from Twilio SMS/IVR to Progressive Web App (PWA)
**Rationale:** Lifeline program provides free smartphones; PWA reduces costs ($91/month → $39/month) and enables richer UX

---

## ✅ Phase 1: Planning & Setup (Day 1 - Oct 11) - COMPLETED

### Completed Tasks:
- [x] Updated PRD ([docs/prd.md](../prd.md))
  - Section 2.1: In Scope updated for PWA
  - Section 2.4: Primary Actor updated (smartphone access)
  - Section 2.5: Key Use Cases refactored for PWA flows
  - Section 3: User Stories updated for PWA
  - Section 4.1: Architecture updated (PWA, Web Push, Service Workers)
  - Section 5.2: Implementation timeline updated (Oct 11-20)
  - Section 5.4: Success Metrics updated (Lighthouse scores, install rates)

- [x] Removed Twilio dependencies from package.json
  - Removed: `twilio`, `@types/twilio`

- [x] Added PWA dependencies to package.json
  - Added: `web-push`, `@types/web-push`
  - Added: `idb` (IndexedDB wrapper)
  - Added: `workbox-window`, `workbox-webpack-plugin`
  - Added: `vite-plugin-pwa`

- [x] Installed dependencies (`npm install`)
  - 295 packages added
  - 24 packages removed (including Twilio)

- [x] Updated database schema ([shared/schema.ts](../shared/schema.ts))
  - **users table:** Added `deviceToken`, `preferredTime`, `lastSyncAt`, `enablePushNotifications`
  - **sessions table:** Added 'pwa' to channel enum
  - **interactions table:** Renamed from `messages`, added:
    - `userId` direct reference
    - `channel` enum (sms/ivr/pwa)
    - `contentType` enum (text/notification/reminder)
    - `metadata` jsonb field
    - Made `fromNumber`/`toNumber` nullable for PWA
    - Added 'synced' to status enum
  - **followUps table:** Added `channel`, `pushPayload` jsonb
  - Kept `export const messages = interactions` for backwards compatibility

### Pending: Database Migration
- Schema changes defined but not yet pushed to Neon
- Drizzle-kit asking whether to rename `messages` → `interactions` or create new table
- **Decision needed:** Rename to preserve existing data
- **Next step:** Run migration interactively or via SQL script

---

## 🔄 Phase 2: Database Schema (Day 2 - Oct 12) - IN PROGRESS

### Tasks:
- [ ] Complete database migration
  - [ ] Rename `messages` table to `interactions`
  - [ ] Add new columns to `users` table
  - [ ] Update `sessions.channel` enum
  - [ ] Update `follow_ups` table
  - [ ] Verify migration in Neon console

- [ ] Test schema changes
  - [ ] Verify existing data preserved
  - [ ] Test PWA channel inserts
  - [ ] Test new user fields

---

## 📋 Phase 3: Backend API (Days 3-4 - Oct 13-14) - PENDING

### Tasks:
- [ ] Refactor ConversationEngine
  - [ ] Change return type from `Promise<string>` to `Promise<ConversationResponse>`
  - [ ] Return JSON instead of TwiML strings
  - [ ] Update state machine to handle PWA channel

- [ ] Create REST API endpoints
  - [ ] `POST /api/daily-ritual/start`
  - [ ] `POST /api/daily-ritual/mood`
  - [ ] `POST /api/daily-ritual/intention`
  - [ ] `POST /api/repair/start`
  - [ ] `POST /api/repair/trigger`
  - [ ] `GET /api/user/stats`

- [ ] Authentication endpoints
  - [ ] `POST /api/auth/request-code` (SMS verification)
  - [ ] `POST /api/auth/verify-code` (JWT generation)
  - [ ] `POST /api/auth/logout`

- [ ] Push notification endpoints
  - [ ] `POST /api/notifications/subscribe`
  - [ ] `POST /api/notifications/unsubscribe`
  - [ ] Backend web-push sender service

---

## 🎨 Phase 4: PWA Frontend (Days 5-7 - Oct 15-17) - PENDING

### Tasks:
- [ ] Core PWA setup
  - [ ] Create `public/manifest.json`
  - [ ] Generate PWA icons (192px, 512px)
  - [ ] Configure vite-plugin-pwa

- [ ] Service Worker
  - [ ] Create service worker with Workbox
  - [ ] Implement cache-first strategy
  - [ ] Background sync registration

- [ ] React Components
  - [ ] `DailyRitual.tsx` (main flow orchestrator)
  - [ ] `MoodSelector.tsx` (4 emoji buttons)
  - [ ] `AffirmationCard.tsx` (animated display)
  - [ ] `IntentionInput.tsx` (text input)
  - [ ] `RepairFlow.tsx` (slip recovery)
  - [ ] `Dashboard.tsx` (streak, mood chart)
  - [ ] `Settings.tsx` (notification preferences)

- [ ] Authentication UI
  - [ ] `Login.tsx` (phone verification)
  - [ ] Phone input with country code
  - [ ] Verification code entry

---

## 💾 Phase 5: Offline-First (Day 8 - Oct 18) - PENDING

### Tasks:
- [ ] IndexedDB setup
  - [ ] Create offline storage module
  - [ ] Queue for pending interactions
  - [ ] Local state caching

- [ ] Background Sync
  - [ ] Register sync event
  - [ ] Sync pending interactions
  - [ ] Conflict resolution (last-write-wins)

- [ ] Optimistic UI
  - [ ] Show affirmations immediately
  - [ ] Update streak counter optimistically
  - [ ] Show sync status indicator

---

## 🚀 Phase 6: Deploy & Test (Days 9-10 - Oct 19-20) - PENDING

### Tasks:
- [ ] Vercel deployment
  - [ ] Update `vercel.json` for PWA
  - [ ] Configure service worker headers
  - [ ] Set VAPID environment variables

- [ ] PWA Validation
  - [ ] Run Lighthouse audit (target ≥90)
  - [ ] Test on iOS Safari
  - [ ] Test on Android Chrome
  - [ ] Verify offline functionality

- [ ] E2E Testing
  - [ ] Daily ritual flow (online)
  - [ ] Daily ritual flow (offline)
  - [ ] Repair flow
  - [ ] Push notifications
  - [ ] PWA installation
  - [ ] Dashboard display

---

## 📊 Cost Comparison

| Component | SMS Approach | PWA Approach | Savings |
|-----------|-------------|--------------|---------|
| Phone number | $15/month | $0 | $15 |
| SMS messages (100 users) | $75.84/month | $0 | $75.84 |
| Vercel hosting | $0 (Hobby) | $20/month (Pro) | -$20 |
| Neon PostgreSQL | $19/month | $19/month | $0 |
| **Total** | **$109.84/month** | **$39/month** | **$70.84/month** |
| **Annual** | **$1,318** | **$468** | **$850** |

---

## 🎯 Success Metrics (PWA-Specific)

- [ ] PWA Lighthouse score ≥ 90
- [ ] ≥ 60% install PWA to home screen
- [ ] 100% core flows work offline
- [ ] Push notification delivery ≥ 95%
- [ ] ≥ 70% daily check-in completion rate
- [ ] 80% positive feedback on ease of use

---

## 📝 Technical Decisions

### 1. Messages → Interactions Table Rename
**Decision:** Rename existing table to preserve data
**Rationale:** Existing SMS data is valuable for continuity; rename maintains foreign key relationships

### 2. Service Worker Strategy
**Decision:** Cache-first for app shell, network-first for API with offline fallback
**Rationale:** Ensures app loads instantly while keeping data fresh when online

### 3. Push Notifications
**Decision:** Web Push API with VAPID (not Twilio)
**Rationale:** Free, native browser support, no third-party dependencies

### 4. Authentication
**Decision:** JWT with SMS verification code (minimal Twilio use)
**Rationale:** Phone number remains primary identifier; SMS only for initial verification (1-time cost)

---

## 🚧 Open Questions

1. **iOS Safari PWA limitations:** How will we handle iOS-specific quirks?
   - **Answer TBD:** Test thoroughly; provide fallback guidance

2. **Offline conflict resolution:** What happens if user completes ritual offline on multiple devices?
   - **Answer:** Last-write-wins based on timestamp; conflict UI if needed

3. **Push notification opt-in rate:** What if users don't grant permission?
   - **Answer:** App works without notifications; encourage during onboarding

---

## 📚 Key Files Modified

1. [docs/prd.md](../prd.md) - PRD updated for PWA pivot
2. [package.json](../package.json) - Dependencies updated
3. [shared/schema.ts](../shared/schema.ts) - Database schema updated
4. [docs/pwa-pivot-progress.md](../docs/pwa-pivot-progress.md) - This file (tracking document)

---

## 🔗 Related Documentation

- [Original PRD (SMS)](../PROJECT_CONTEXT.md)
- [Manual SMS Testing Guide](../docs/testing/manual-sms-testing-guide.md) (archived)
- [Story 5: Database Logging](../docs/stories/s5.md)
- [ConversationEngine](../../server/services/conversationEngine.ts)

---

**Last Updated:** October 11, 2025, 3:45 PM
**Status:** Phase 1 complete, Phase 2 in progress (database migration pending)
