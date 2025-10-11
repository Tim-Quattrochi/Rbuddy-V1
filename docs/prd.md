# Reentry Buddy (Institutional Alias: Reentry Companion)
## Product Requirements Document (PRD)
**Version:** v1.0  
**Date:** October 2025  
**Authors:** Alex (PM), Winston (Architect), Mary (Analyst)  
**Status:** ✅ Final & Approved  

---

## 1. Vision

### 1.1 Purpose
Reentry Buddy (institutional alias *Reentry Companion*) is a digital recovery support system designed for justice-impacted individuals reentering society after incarceration.  
Its mission is to provide structure, consistency, and emotional regulation through a daily ritual flow accessible on any mobile device — including basic phones.

### 1.2 Problem Statement
Justice-impacted individuals with substance use challenges often struggle with a lack of structure, high stress, and digital barriers (limited data, lost devices, low literacy).  
Existing recovery apps assume smartphone access, leaving a gap for low-access users who still need daily grounding and positive feedback.

### 1.3 Solution Overview
Reentry Buddy bridges that gap through **Tier 1 accessibility** — a low-data SMS and IVR (voice) solution that enables:
- A short **Daily Ritual Flow (2–5 minutes)** via text or call.  
- A **Rupture and Repair** process for relapse moments (“SLIP”).  
- Positive reinforcement that emphasizes progress, not failure.  

### 1.4 Target Users
- **Primary Actor:** Returning citizens (justice-impacted individuals) in early-stage recovery.
- **Context:** Limited digital literacy, low trust in technology, may rely on prepaid phones.
- **Accessibility Goal:** Plain-language content written at or below a 6th-grade reading level.

---

## 2. Scope and Requirements

### 2.1 In Scope (10-Day MVP - Phase 1: PWA)
| Feature | Description | Priority | Status |
|----------|--------------|----------|--------|
| **F1 – Daily Ritual Flow (PWA)** | 2–5 min check-in via **Progressive Web App** capturing mood → affirmation → optional intention. | P0 | ✅ In Scope |
| **F2 – Rupture & Repair Flow** | "I slipped" button triggers compassionate relapse reset with repair suggestions. | P0 | ✅ In Scope |
| **F3 – Encouragement Loop** | **Web push notifications** for inactivity or streak milestones. | P1 | ✅ In Scope |
| **F4 – User State Logging** | Anonymous session storage for mood, triggers, and streaks. | P1 | ✅ In Scope |
| **F7 – User Dashboard** | Visual progress tracking with streak display, mood trends, and calendar. | P0 | ✅ Enhanced |
| **F8 – Offline Support** | Service worker enables offline check-ins with background sync when connection restored. | P1 | ✅ New |

### 2.2 Deferred to Phase 2 (Post-MVP)
| Feature | Description | Original Priority | Deferral Reason |
|----------|--------------|-------------------|-----------------|
| **F1b – SMS/IVR (Voice)** | SMS text or voice call version of Daily Ritual Flow. | P0 → P2 | PWA provides better UX; SMS as fallback notification only. |
| **F5 – Coach Summary** | Weekly aggregate summaries for partner coaches. | P2 | No change - remains Phase 2. |
| **F6 – Language & Accessibility Layer** | English-first; bilingual (EN/ES) expansion framework. | P2 | No change - remains Phase 2. |

**Scope Rationale**: 10-day timeline prioritizes PWA development leveraging smartphone accessibility via Lifeline program. PWA provides richer UX (visual feedback, offline support, push notifications) at lower operational cost ($0 messaging vs. $0.0079/SMS). All P0 recovery support features (Daily Ritual, Repair, Encouragement) remain in scope with enhanced capabilities.

**Accessibility Update**: Target users now assumed to have Lifeline-provided smartphones or access via reentry org device lending programs. PWA approach maintains low-friction access (no app store required, works offline) while enabling visual progress tracking and richer engagement features.

### 2.3 Out of Scope (All Phases)
- Native mobile app (App Store/Google Play).
- AI chatbot or adaptive recommendation engine.
- Clinical data integration (EHR).
- Long-form journaling or audio storage beyond short intention text.
- Case-management dashboard (beyond aggregate metrics view).

### 2.4 Primary Actor: Returning Citizen in Recovery
A justice-impacted individual within 12 months of release, working through substance use recovery using a **Lifeline-provided smartphone or borrowed device**.
They need simple, supportive routines without judgment or technical friction. PWA provides app-like experience without app store barriers, works offline after first load, and enables visual progress tracking.

### 2.5 Key Use Cases
#### UC-1: Daily Check-In (Ritual Flow)
**Goal:** Build consistent grounding habit.
**Trigger:** Web push notification or user-initiated app open.
**Flow:** Open PWA → Tap mood (visual buttons with emojis) → View affirmation card → Optionally enter intention → See streak update.

#### UC-2: Rupture → Repair
**Goal:** Provide safe reset after relapse.
**Trigger:** User taps "I slipped" button in app navigation.
**Flow:** View empathetic message → Select trigger type (visual options) → Receive repair guidance → Schedule follow-up notification.

#### UC-3: Encouragement Loop
**Goal:** Maintain motivation between check-ins.
**Trigger:** Web push notification for inactivity or streak milestone.
**Flow:** Notification displays contextual message → Tapping opens PWA to ritual flow.

#### UC-4: Offline Check-In
**Goal:** Enable check-ins without internet connection.
**Trigger:** User opens PWA while offline.
**Flow:** Service worker serves cached app → User completes ritual locally → Background sync queues data → Syncs when connection restored.

#### UC-5: Partner Summary (Phase 2)
**Goal:** Aggregate non-identifiable usage for coaches.
**Flow:** Pull engagement stats weekly → deliver via web dashboard or SMS digest.

### 2.6 Boundaries and Design Intent
| Boundary | Design Intent |
|-----------|----------------|
| Technical simplicity | PWA accessible via browser (no app store needed), works offline after first load. |
| User data privacy | No PII; anonymized identifiers only; local-first architecture. |
| Tone & branding | User-facing: *Reentry Buddy* (friendly), Institutional: *Reentry Companion* (formal). |
| Trauma-informed design | Supportive, non-judgmental, plain language, emoji-enhanced clarity. |
| Engagement model | Encouragement over gamification; visual progress (streaks) without competitive elements. |

### 2.7 Success Criteria
- ≥ 90% of pilot users complete a check-in without assistance.
- PWA Lighthouse score ≥ 90 (performance, accessibility, best practices, PWA).
- ≥ 60% install PWA to home screen within first week.
- Offline functionality: 100% of core flows work without connection.
- ≥ 70% positive tone/ease-of-use feedback.
- Web push notification delivery rate ≥ 95%.

---

## 3. User Stories and Acceptance Criteria

### 3.1 PWA Daily Ritual Flow
**Story:** As a returning citizen, I want a visual daily check-in on my phone so I can ground myself.
- **Given:** User opens PWA (via push notification or app icon).
- **When:** User taps one of four mood buttons (Calm 😌, Stressed 😰, Tempted 😣, Hopeful 🌟).
- **Then:** User sees animated affirmation card, can optionally enter intention, and views updated streak.
- **Acceptance:** Interaction logs to database; streak counter updates; works offline with background sync.

### 3.2 PWA Installation
**Story:** As a user, I want to add Reentry Buddy to my home screen so it feels like a regular app.
- **Given:** User visits PWA in browser.
- **When:** Browser prompts to "Add to Home Screen" or user selects option.
- **Then:** PWA installs with custom icon, splash screen, and standalone display mode.
- **Acceptance:** Lighthouse PWA audit passes; manifest.json served correctly.

### 3.3 Offline Support
**Story:** As a user with unreliable internet, I want to complete my check-in even when offline.
- **Given:** User opens PWA without internet connection.
- **When:** User completes daily ritual flow.
- **Then:** Service worker caches interaction locally and syncs when connection restored.
- **Acceptance:** All core flows (mood selection, affirmation display) work offline; background sync queues API calls.

### 3.4 Repair Flow
**Story:** When I relapse, I can tap "I slipped" and receive compassion, not judgment.
- **Given:** User navigates to repair flow via button.
- **When:** User selects trigger type (visual options).
- **Then:** User sees empathetic repair message and receives follow-up notification next day.
- **Acceptance:** System logs relapse, schedules follow-up push notification, maintains streak history.

### 3.5 Web Push Notifications
**Story:** As a user, I want daily reminders on my phone so I don't forget my check-in.
- **Given:** User grants notification permission.
- **When:** Scheduled notification time arrives.
- **Then:** User receives push notification with encouraging message.
- **Acceptance:** Notification delivered ≥95% of time; tapping opens PWA to ritual flow.

### 3.6 Data Logging & Privacy
**Story:** As an operator, I can see anonymized aggregate data.
- **Acceptance:** Dashboard shows trends only (no phone numbers); interactions table stores anonymized user IDs.

---

## 4. Technical Requirements and Architecture Overview

### 4.1 Core Architecture (10-Day PWA MVP Implementation)
- **Interface:** Progressive Web App (PWA) with offline-first architecture via Service Workers.
- **Frontend:** React 18 + TypeScript + shadcn/ui component library + React Router v7.
- **Backend:** Node.js + Express + TypeScript (Vercel serverless functions).
- **Data Store:** PostgreSQL (Neon) with Drizzle ORM.
- **Notifications:** Web Push API with VAPID (no Twilio dependency).
- **Offline:** Service Worker + IndexedDB for local caching and background sync.
- **Monitoring:** Vercel logs + Sentry for error tracking.
- **Security:** TLS, JWT session tokens, Neon PostgreSQL encryption at rest, CSP headers.

**Tech Stack Rationale**: Leverages existing TypeScript/Express/PostgreSQL/React codebase for rapid 10-day MVP delivery. Brownfield enhancement approach converts SMS webhook handlers to REST API endpoints and extends existing React UI (investor dashboard) to full user-facing PWA. PWA eliminates $75+/month Twilio SMS costs while enabling richer visual UX and offline support.

### 4.2 Conversation Engine (Refactored for PWA)
- Finite-state machine (FSM) controlling "Daily Ritual" and "Repair" flows (reused from SMS implementation).
- REST API endpoints return JSON responses instead of TwiML strings.
- Each step logs to DB with `session_id` for continuity across offline/online transitions.
- JSON-based flow definitions for non-dev content updates.

### 4.3 REST API Endpoints
- `POST /api/daily-ritual/start` → Returns session ID and mood prompt
- `POST /api/daily-ritual/mood` → Returns affirmation based on mood selection
- `POST /api/daily-ritual/intention` → Logs intention and completes session
- `POST /api/repair/start` → Initiates repair flow
- `POST /api/repair/trigger` → Logs trigger and returns repair message
- `GET /api/user/stats` → Returns streak count and mood trends
- `POST /api/auth/request-code` → Sends SMS verification code (minimal Twilio use)
- `POST /api/auth/verify-code` → Validates code and returns JWT
- `POST /api/notifications/subscribe` → Registers push notification subscription

### 4.4 Data Model (Updated for PWA)
- **Users** → `user_id`, `phone_hash`, `preferred_time`, `language`, `device_token` (push notifications), `last_sync_at`, `enable_push_notifications`
- **Sessions** → `session_id`, `user_id`, `flow_type`, `mood`, `intention`, `timestamp`, `channel` ('pwa'/'sms')
- **Interactions** (renamed from Messages) → `id`, `user_id`, `session_id`, `direction`, `channel`, `content_type`, `body`, `created_at`
- **FollowUps** → `id`, `user_id`, `message_type`, `channel`, `scheduled_at`, `status`, `push_payload`

### 4.5 PWA-Specific Requirements
- **Service Worker:** Cache-first strategy for app shell, network-first for API calls with fallback to IndexedDB
- **Manifest:** Icons (192px, 512px), splash screen, standalone display mode, theme colors
- **Web Push:** VAPID key pair for push notifications, subscription management
- **Offline Storage:** IndexedDB stores pending interactions for background sync
- **Background Sync:** Queues failed API calls, retries when connection restored

### 4.6 Security & Privacy
- Anonymous IDs only; no direct PII stored beyond hashed phone number.
- JWT tokens for session management (7-day expiry).
- Content Security Policy (CSP) headers to prevent XSS.
- HTTPS-only (enforced by Vercel).
- 90-day retention; data auto-purged post-pilot.  

---

## 5. Implementation Roadmap and Release Plan

### 5.1 Team Roles
| Role | Owner | Responsibility |
|------|--------|----------------|
| Product Manager | Alex | Backlog, roadmap, approvals |
| Architect | Winston | System design, code review |
| Analyst | Mary | Content QA, accessibility |
| Developer (Claude Code) | — | Implementation, testing |
| QA Lead | TBD | Testing & pilot readiness |
| Security Officer | TBD | Compliance validation |

### 5.2 Implementation Plan (10 Days - October 11-20, 2025)

| Phase | Days | Focus | Deliverables |
|-------|------|-------|--------------|
| **Phase 1: Planning & Setup** | Day 1 (Oct 11) | PRD updates, architecture design, dependency audit | Updated PRD (PWA pivot), technical design doc, removed Twilio deps |
| **Phase 2: Database Schema** | Day 2 (Oct 12) | Schema migrations for PWA | `messages` → `interactions` table, add `device_token` to users, push notification tables |
| **Phase 3: Backend API** | Days 3-4 (Oct 13-14) | REST API endpoints, ConversationEngine refactor | `/api/daily-ritual/*`, `/api/repair/*`, `/api/auth/*`, JSON responses |
| **Phase 4: PWA Frontend** | Days 5-7 (Oct 15-17) | React components, service worker, push notifications | MoodSelector, AffirmationCard, service worker, manifest.json, VAPID setup |
| **Phase 5: Offline-First** | Day 8 (Oct 18) | IndexedDB, background sync, optimistic UI | Local caching, background sync queue, offline functionality |
| **Phase 6: Deploy & Test** | Days 9-10 (Oct 19-20) | Vercel deployment, PWA validation, E2E testing | Lighthouse audit (≥90), manual testing, demo-ready PWA |

### 5.3 Milestones (10-Day PWA MVP)
- **M1:** PRD updated + database schema migrated (Day 2).
- **M2:** REST API endpoints functional + ConversationEngine refactored (Day 4).
- **M3:** PWA core UI complete + service worker operational (Day 7).
- **M4:** Offline support + push notifications working (Day 8).
- **M5:** Deployed to Vercel + Lighthouse PWA score ≥90 (Day 10).

### 5.4 Success Metrics (Updated for PWA)
- PWA Lighthouse score ≥ 90 (performance, accessibility, best practices, PWA).
- ≥ 60% of users install PWA to home screen.
- 100% of core flows work offline.
- ≥ 70% of users complete 5+ daily check-ins.
- Push notification delivery rate ≥ 95%.
- 80% positive feedback on ease of use.

### 5.5 Risks and Mitigations
| Risk | Mitigation |
|------|-------------|
| iOS Safari PWA limitations | Test thoroughly on iOS; graceful degradation for Safari-specific issues |
| Push notification permission rejection | Clear onboarding explaining value; app works without notifications |
| Service worker caching bugs | Versioned cache names; force update mechanism; thorough testing |
| Offline state conflicts | Last-write-wins with timestamp; conflict resolution UI if needed |
| User education curve | Simple "Add to Home Screen" tutorial; works in browser without install |

---

## 6. Approval Summary
| Reviewer | Role | Approval |
|-----------|------|----------|
| Mary | Analyst | ✅ |
| Winston | Architect | ✅ |
| Alex | Product Manager | ✅ |
| Partner Org / QA | Pilot approval pending |

---

### Document Metadata
- **Version:** v1.0  
- **Status:** Final (locked)  
- **Repository Path:** `/docs/prd.md/`  
- **Next Review:** Post-Pilot (v1.1)

---

✅ **End of Document**
