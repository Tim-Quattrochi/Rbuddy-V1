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

- [x] Database migration pushed to Neon (completed in Phase 2)

---

## ✅ Phase 2: Database Schema (Day 2 - Oct 12) - COMPLETED

### Completed Tasks:
- [x] Complete database migration
  - [x] Rename `messages` table to `interactions`
  - [x] Add new columns to `users` table
  - [x] Update `sessions.channel` enum
  - [x] Update `follow_ups` table
  - [x] Verify migration in Neon console

- [x] Test schema changes
  - [x] Verify existing data preserved
  - [x] Test PWA channel inserts
  - [x] Test new user fields

### Migration Details:
- **Date Completed:** October 11, 2025
- **Method:** `npm run db:push` with rename option selected
- **Verification:** Automated test script created (`scripts/verify-migration.ts`)
- **Results:** All 8 schema changes verified successfully
  - ✅ interactions table exists (renamed from messages)
  - ✅ users.deviceToken field working
  - ✅ users.preferredTime field working
  - ✅ users.lastSyncAt field working
  - ✅ users.enablePushNotifications field working
  - ✅ sessions.channel includes "pwa" option
  - ✅ interactions.channel includes "pwa" option
  - ✅ followUps.channel includes "push" option
  - ✅ followUps.pushPayload field working

---

## ✅ Phase 3: Backend API (Days 3-4 - Oct 13-14) - COMPLETED

### Completed Tasks:
- [x] ConversationEngine refactor
  - [x] Already returns `Promise<ConversationResponse>` with JSON
  - [x] Returns JSON instead of TwiML strings ✅
  - [x] State machine handles PWA channel ✅

- [x] Create REST API endpoints
  - [x] `POST /api/daily-ritual/start`
  - [x] `POST /api/daily-ritual/mood`
  - [x] `POST /api/daily-ritual/intention`
  - [x] `POST /api/repair/start`
  - [x] `POST /api/repair/trigger`
  - [x] `GET /api/user/:userId/stats`

- [x] Authentication endpoints
  - [x] `POST /api/auth/register` (creates user + sends verification code)
  - [x] `POST /api/auth/verify` (validates code + returns JWT)
  - [x] `POST /api/auth/logout` (clears device token)

- [x] Push notification endpoints
  - [x] `POST /api/notifications/subscribe` (stores push subscription)
  - [x] `POST /api/notifications/unsubscribe` (removes subscription)

- [x] Extended storage layer
  - [x] Added `getUserByPhoneNumber()` for authentication
  - [x] Added `updateDeviceToken()` for push subscriptions
  - [x] Added `createSession()` for session management
  - [x] Added `getUserSessions()` for history retrieval
  - [x] Added `getUserStats()` for streak/mood calculations
  - [x] Added `scheduleFollowUp()` for follow-up notifications
  - [x] Added `createInteraction()` for PWA interaction logging

### Implementation Details:
- **Date Completed:** October 11, 2025
- **Files Modified:**
  - [`server/routes.ts`](../server/routes.ts) - 11 REST endpoints implemented
  - [`server/storage.ts`](../server/storage.ts) - Extended DrizzleStorage with 7 new methods
  - [`server/services/conversationEngine.ts`](../server/services/conversationEngine.ts) - Minor updates for PWA channel
- **Testing:** All endpoints ready for integration testing with frontend
- **Next Step:** Phase 4 - PWA Frontend Development

---

## 🎨 Phase 4: PWA Frontend (Days 5-7 - Oct 15-17) - IN PROGRESS

### Story 11: PWA Manifest & Service Worker Setup - ✅ COMPLETE (Oct 11)

- [x] Core PWA setup
  - [x] Create `public/manifest.json`
  - [x] Generate PWA icons (64px, 192px, 512px, maskable)
  - [x] Configure vite-plugin-pwa

- [x] Service Worker
  - [x] Create service worker with Workbox (auto-generated)
  - [x] Implement cache-first strategy (fonts)
  - [x] Implement network-first strategy (API)
  - [x] Background sync registration (configured)

**Completed:**
- ✅ Manifest.json with theme colors and PWA metadata
- ✅ PWA icons generated using `@vite-pwa/assets-generator`
- ✅ vite-plugin-pwa configured in vite.config.ts
- ✅ Workbox caching strategies (cache-first for fonts, network-first for API)
- ✅ Service worker auto-generation with skipWaiting and clientsClaim
- ✅ Production build verified (sw.js and manifest.webmanifest generated)
- ✅ Manual testing guide created (`.ai/s11-pwa-testing-guide.md`)

**Status:** Ready for Review - Manual testing required (Lighthouse audit, browser installation test)

**Git:** Commit be62e39 - "feat: implement PWA manifest and service worker (Story 11)"

---

### Story 12: Daily Ritual Flow UI Components - NEXT

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

**Last Updated:** October 11, 2025
**Status:** Phases 1-3 complete (✅ Planning, ✅ Database, ✅ Backend API), Phase 4 next (PWA Frontend)
