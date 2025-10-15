
## **🪴 Next Moment — Project Brief**

Version: v2.0 (PWA Pivot)
Prepared by: Mary (Analyst, Team Fullstack)
Date: October 2025
Last Updated: October 14, 2025

---

## **📋 Executive Summary - Current State**

**Project Status**: Phase 4 (PWA Frontend Development) - In Progress

**Architecture**: Decoupled Progressive Web App
- **Frontend**: React 18 + Vite PWA (offline-first, installable)
- **Backend**: Express.js REST API (Node.js 20, TypeScript)
- **Database**: Neon Serverless PostgreSQL + Drizzle ORM
- **Deployment**: Vercel Serverless Functions
- **AI Integration**: Multi-provider chat (Google Gemini, OpenAI, Mistral, Perplexity)

**Strategic Pivot Rationale** (October 2025):
- **FROM**: SMS/IVR-based system using Twilio
- **TO**: Progressive Web App (PWA) with offline capabilities
- **Why**: Lifeline program provides free smartphones to target users; PWA reduces costs ($624/year savings) and enables richer UX while maintaining accessibility

**Key Files**:
- Frontend: [client/src/](client/src/) - React PWA components
- Backend API: [api/](api/) - Express REST endpoints
- Database Schema: [shared/schema.ts](shared/schema.ts)
- Documentation: [docs/pwa-pivot-progress.md](docs/pwa-pivot-progress.md), [handoff.md](handoff.md)

---

### **1\. Problem Statement**

Justice-impacted individuals in early reentry with a history of substance use often face overwhelming triggers, unstable routines, and limited support systems. Existing recovery apps are too complex, data-heavy, or lack the empathetic approach needed for this vulnerable population.

Core challenge: How might we deliver structure, encouragement, and relapse resilience through an accessible, empathetic digital companion?

---

### **2\. Target Users**

* **Primary**: Formerly incarcerated individuals in early reentry (first 6–12 months), especially those in recovery programs or probation supervision
* **Secondary**: Probation officers, case managers, and reentry coaches who support habit accountability
* **Accessibility considerations**:
  * Smartphone access via Lifeline program (free smartphones for qualified users)
  * Progressive Web App (PWA) for offline-first functionality
  * Simple, trauma-informed interface design
  * 6th-grade reading level content

---

### **3\. MVP Goal**

Deliver a low-friction "Daily Ritual Flow" through a Progressive Web App (PWA) that helps users build emotional regulation, accountability, and recovery momentum. The app works offline-first and provides a compassionate, mobile-optimized experience accessible from any smartphone.

---

### **4\. Core MVP Features (PWA Architecture)**

| Category | Feature | Description |
| ----- | ----- | ----- |
| Core Routine | Daily Ritual Flow | 2–5 min daily check-in via PWA: Mood selection (4 options) → Affirmation/grounding tip → Optional intention setting |
| Relapse Support | Rupture → Repair | Compassionate relapse support flow: users can initiate repair flow, identify triggers, receive supportive guidance, and reset goals |
| Continuity | Offline-First Design | PWA with service worker caching, works without internet connection, syncs when online |
| Engagement | Encouragement Loop | Push notifications for daily check-ins, streak celebrations, gentle re-engagement after missed days |
| Journaling | Reflection & History | Optional journal entries, mood trend visualization, historical review of check-ins |
| AI Chat Support | Floating Chat Widget | Multi-provider AI chat (Google Gemini, OpenAI, Mistral, Perplexity) for crisis support and reflection |
| Coach Mode (Phase 2) | Case managers can view aggregated engagement data (with user consent) |  |

---

### **5\. Success Metrics (Early Validation)**

* ≥ 60% daily ritual completion over 2 weeks  
* ≥ 70% user-reported “helped me stay grounded” rating  
* \< 10% drop-off after first week  
* Qualitative feedback: sense of support, no judgment, “easy to use”  
* Baseline comparison of relapse reporting behavior (pre/post pilot)

---

### **6\. Technical MVP Architecture (Decoupled PWA)**

| Layer | Component | Technology / Approach |
| ----- | ----- | ----- |
| **Frontend** | Progressive Web App | React 18 + Vite, vite-plugin-pwa, Workbox service worker |
| **UI Components** | Component Library | shadcn/ui (Radix UI + Tailwind CSS) |
| **Backend API** | Express.js REST API | Node.js 20, TypeScript, decoupled from frontend |
| **Flow Logic** | Conversation Engine | Rule-based state machine (FSM) in TypeScript, returns JSON |
| **Database** | PostgreSQL | Neon Serverless PostgreSQL, Drizzle ORM |
| **Data Storage** | User sessions & logs | Express-session with Postgres, encrypted user data |
| **Authentication** | Passport.js | Local strategy (phone/email), Google OAuth, JWT cookies |
| **AI Integration** | Multi-provider chat | @google/generative-ai, OpenAI SDK, Mistral, Perplexity |
| **Content Layer** | Message Templates | TypeScript objects with mood-based affirmations, repair flows |
| **Deployment** | Vercel Serverless | Frontend + API deployed as Vercel serverless functions |
| **Admin Interface** | (Phase 2) | Web-based dashboard for coaches (future) |

**Architecture Pattern**: Decoupled client-server architecture
- **Frontend**: React PWA (port 5173 dev, Vercel production)
- **Backend**: Express API (port 5001 dev, Vercel serverless production)
- **Communication**: REST API via `/api/*` endpoints
- **Development**: Concurrent dev servers with Vite proxy

---

### **7\. Constraints & Assumptions**

* **Smartphone Access**: Users receive free smartphones via Lifeline program (validated assumption)
* **Connectivity**: Offline-first design assumes intermittent internet connectivity
* **UX Design**: Mobile-first, touch-optimized, 6th-grade reading level
* **Security**: Minimal PII collected; encrypted sessions; optional anonymized analytics
* **Cost Efficiency**: PWA reduces operational costs from $91/month (Twilio) to $39/month (Vercel + Neon)
* **Testing**: Pilot with reentry nonprofits or county reentry offices

---

### **8\. Roadmap (MVP → Validation Path)**

**Phase 1 – Planning & Setup** ✅ COMPLETE (Day 1, Oct 11)
* Strategic pivot from SMS/IVR to PWA architecture
* Updated PRD and technical documentation
* Removed Twilio dependencies, added PWA tooling

**Phase 2 – Database Schema Migration** ✅ COMPLETE (Day 2, Oct 12)
* Migrated `messages` table → `interactions` table
* Extended schema for PWA support (mood, intention, triggers)
* Maintained backwards compatibility

**Phase 3 – Backend API Development** ✅ COMPLETE (Days 3-4, Oct 13-14)
* Implemented 11 REST API endpoints:
  - Authentication: `/api/auth/*` (login, logout, session check, Google OAuth)
  - Daily Ritual: `/api/daily-ritual/*` (start, mood, affirmation, intention)
  - Repair Flow: `/api/repair/*` (start, trigger, guidance)
  - Journal: `/api/journal/*` (history)
  - User Management: `/api/users/me`
  - Chat: `/api/chat/*` (send, history, clear)
* Extended storage layer with PWA-specific methods
* Integrated ConversationEngine (returns JSON)

**Phase 4 – PWA Frontend Development** 🔄 IN PROGRESS (Days 5-7, Oct 15-17)
* Create PWA manifest and icons
* Build React components (MoodSelector, AffirmationCard, IntentionInput, etc.)
* Connect components to REST API
* Implement service worker with Workbox

**Phase 5 – Offline-First Implementation** ⏸️ PENDING (Day 8, Oct 18)
* Implement IndexedDB for offline data
* Configure caching strategies
* Add sync mechanism for offline actions

**Phase 6 – Deploy & Test** ⏸️ PENDING (Days 9-10, Oct 19-20)
* Deploy to Vercel
* E2E testing on iOS and Android
* Lighthouse PWA audit (target score ≥90)

**Phase 7 – Expansion** (Future)
* Add coach dashboard for aggregated metrics
* Enhance AI chat with crisis detection
* Integrate push notification system
* Add data export for probation check-ins

---

### **9\. Core Differentiators**

* Empathy-driven recovery framing: “Repair, not failure” philosophy.  
* Accessibility by design: Works on any phone, no app needed.  
* Low cognitive load: Simple, repeatable, emotionally grounding ritual.  
* Bridge for reentry ecosystem: Optional coach-facing layer for continuity of care.

---

### **10\. Next Steps**

1. Develop prototype message flow (SMS \+ voice script).  
2. Partner with one local reentry org for pilot cohort.  
3. Conduct 2-week usability and emotional resonance testing.  
4. Measure daily engagement and qualitative feedback.

---

# **📘 Product Requirements Document (PRD)**

## **Project: Next Moment – PWA MVP**

Version: 2.0 (PWA Edition) | Date: October 2025
Last Updated: October 14, 2025
Owner: Mary (Business Analyst, Team Fullstack)
Collaborators: Product Manager, Architect, UX, Reentry Program Advisors

---

## **1\. Overview**

### **1.1 Problem Statement**

Justice-impacted individuals in early reentry with substance abuse histories often struggle with structure, emotional regulation, and relapse prevention. Many recovery apps lack trauma-informed design, require complex navigation, or fail to work offline.

Next Moment provides a simple daily ritual and compassionate relapse support through a Progressive Web App (PWA) to help individuals build consistency and resilience. The app leverages smartphone accessibility via the Lifeline program while providing offline-first functionality.

---

### **1.2 Objectives**

* Deliver a mobile-first, high-empathy digital recovery companion via PWA
* Reinforce self-regulation through 2–5 minute daily rituals
* Reframe relapse as "rupture and repair" instead of failure
* Provide offline-first functionality for users with intermittent connectivity
* Integrate multi-provider AI chat for crisis support and reflection
* Validate engagement and emotional impact with reentry population

---

### **1.3 Success Metrics (MVP Validation)**

| Category | Metric | Target |
| ----- | ----- | ----- |
| Engagement | Daily Ritual completion rate | ≥ 60% after 2 weeks |
| Retention | 2-week active user retention | ≥ 70% |
| User Sentiment | “Feels supportive / helps me stay grounded” | ≥ 80% positive |
| Accessibility | % users able to complete flow without assistance | ≥ 90% |
| Safety | Zero data leaks or privacy issues | 100% compliance |

---

## **2\. User Personas**

### **Primary User: “Marcus” – Reentry & Recovery Participant**

* Age: 30–50  
* Recently released (within 6 months)  
* Basic phone (flip or feature phone)  
* Limited trust in digital systems; prefers voice or text simplicity  
* Motivations: Stay sober, stay out, rebuild consistency  
* Frustrations: Complex systems, judgmental tone, inconsistent support

### **Secondary User: “Coach Tara” – Reentry Case Manager**

* Manages 15–25 clients  
* Limited bandwidth for daily check-ins  
* Needs lightweight view of client engagement and wellbeing signals

---

## **3\. Core Features & Flows**

### **3.1 Feature A — Daily Ritual Flow (Core Habit Loop)**

Goal: Establish daily grounding and positive reinforcement habit via SMS or IVR.

User Entry Points:

* Receives daily SMS or call (“Next Moment check-in time\!”)  
* Or can dial/txt short code anytime (e.g., *“Text CHECKIN to 74747”*)

Flow (SMS Example):

`RB: Hey Marcus, time for your Daily Check-In. How’s your mood right now?`    
`1) Calm`    
`2) Stressed`    
`3) Tempted`    
`4) Hopeful`

`(User replies: 3)`

`RB: Thanks for sharing. That’s real honesty.`    
`Here’s your grounding tip: “Take 3 deep breaths. Remember how far you’ve come.”`    
`Would you like to set a small intention for today? (Y/N)`

`(User replies: Y)`

`RB: Great. Text your intention (e.g., “Stay calm at work”).`    
`(User replies)`    
`RB: You’ve got this, Marcus. Small steps make big change. Talk tomorrow.`

Flow (IVR Example):  
Voice prompt uses calm, affirming tone.  
“Hi Marcus, this is Next Moment checking in. How’s your mood? Press 1 for calm, 2 for stressed…”  
System reads short reflection or grounding statement, then optional voice-recorded intention.

Data Logged:

* Timestamp  
* Mood selection  
* Intention text (if given)  
* Duration of call/SMS session

System Response Rules:

* Each mood → custom short response template  
* Positive reinforcement triggers after 3 consecutive completions

---

### **3.2 Feature B — Recalibration Flow (Rupture → Repair)**

Goal: Provide compassionate post-relapse support and re-engagement instead of punitive framing.

Entry Trigger:

* User texts keyword (e.g., “SLIP”) or selects relapse option during check-in  
* Optional detection from lapse message (“I messed up” triggers flow)

Flow (SMS Example):

`RB: Thanks for reaching out, Marcus.`    
`We all hit bumps — this isn’t failure, it’s repair time.`    
`Would you like a reset plan or a grounding tip first?`    
`1) Reset plan`    
`2) Grounding tip`

(User chooses 1\)

`RB: Okay. Let’s start fresh.`    
`Think back — what triggered the slip?`    
`1) Stress`    
`2) People`    
`3) Craving`    
`4) Don’t know`

(System responds with tailored repair tip, e.g., “Stress is real — maybe rest tonight. You showed courage by checking in.”)

Follow-up message next morning:

“New day, new start. You repaired yesterday — that’s what counts.”

IVR Flow: Same structure with DTMF input and pre-recorded human-voice affirmations.

Data Logged:

* Slip acknowledgment event  
* Selected trigger type  
* Repair plan sent

---

### **3.3 Feature C — Encouragement Loop (Micro-Coaching)**

* Sends short automated affirmations 1–2×/week  
* Varies tone by consistency streaks (e.g., “3 days strong\!” → motivational, “Missed you yesterday” → gentle re-engagement)  
* Optional: rotating audio affirmations voiced by peer mentors

---

### **3.4 Feature D — Coach Summary (Phase 2 Add-On)**

* Aggregated weekly report (SMS or web dashboard) showing:  
  * Check-in completion rate  
  * Mood distribution (e.g., 40% calm, 30% stressed)  
  * Recalibration events  
* Accessible by case managers with user consent

---

## **4\. Technical Specifications**

| Layer | Requirement | Notes |
| ----- | ----- | ----- |
| **Frontend** | React 18 + Vite PWA | vite-plugin-pwa, Workbox service worker, offline-first |
| **UI Library** | shadcn/ui + Tailwind CSS | Radix UI primitives, fully accessible components |
| **Backend API** | Express.js (TypeScript) | RESTful API, Vercel serverless functions |
| **Logic Engine** | ConversationEngine FSM | Rule-based state machine, returns JSON responses |
| **Database** | Neon Serverless PostgreSQL | Drizzle ORM, encrypted at rest |
| **Storage** | Session-based + PostgreSQL | Express-session with pg-simple store, JWT cookies |
| **Security** | AES-256 encryption, HTTPS, CORS | Secure cookies, rate limiting, input validation |
| **Authentication** | Passport.js | Local (phone/email) + Google OAuth strategies |
| **AI Integration** | Multi-provider | Google Gemini, OpenAI, Mistral, Perplexity APIs |
| **Deployment** | Vercel + Neon | Frontend CDN + serverless API functions |
| **Content Layer** | TypeScript constants | Mood-based affirmations, repair flow templates |
| **Admin Panel** | (Phase 2) Web dashboard | Aggregated analytics for coaches |
| **Development** | Concurrent dev servers | Vite (port 5173) + Express (port 5001) |

---

## **5\. REST API Endpoints (Implemented)**

### **Authentication Endpoints**
- `POST /api/auth/login` - User login (local or phone-based)
- `POST /api/auth/logout` - Clear session and logout
- `GET /api/auth/session` - Check current session status
- `GET /api/auth/google` - Initiate Google OAuth flow
- `GET /api/auth/google/callback` - Handle Google OAuth callback

### **Daily Ritual Endpoints**
- `POST /api/daily-ritual/start` - Begin daily check-in flow
- `POST /api/daily-ritual/mood` - Submit mood selection (1-4)
- `POST /api/daily-ritual/affirmation` - Retrieve mood-based affirmation
- `POST /api/daily-ritual/intention` - Submit optional daily intention

### **Repair Flow Endpoints**
- `POST /api/repair/start` - Initiate compassionate repair flow
- `POST /api/repair/trigger` - Identify relapse trigger
- `POST /api/repair/guidance` - Get personalized reset guidance

### **Journal & History**
- `GET /api/journal/history` - Retrieve user's check-in history

### **User Management**
- `GET /api/users/me` - Get current user profile

### **AI Chat Support**
- `POST /api/chat/send` - Send message to AI chat
- `GET /api/chat/history` - Retrieve chat conversation history
- `DELETE /api/chat/clear` - Clear chat history

---

## **6\. Content Architecture Example**

```typescript
// Mood-based affirmations
const AFFIRMATIONS = {
  calm: [
    "Keep going steady today — your peace helps you stay free.",
    "Your calm is powerful. Carry it with you today."
  ],
  stressed: [
    "You're not alone. One minute of breathing changes your state.",
    "Stress is real, but so is your resilience. Take it one moment at a time."
  ],
  tempted: [
    "Urges come and go. Remember your reason for starting fresh.",
    "You've made it this far. That takes strength. Keep going."
  ],
  hopeful: [
    "Hope grows from small wins — and you just made one.",
    "Your hope is valid. Build on it today."
  ]
};

// Repair flow guidance
const REPAIR_GUIDANCE = {
  stress: "Take rest tonight. Reach out tomorrow for a reset. You showed courage by checking in.",
  people: "Avoid that environment for 24 hours — call someone positive. You're doing the right thing.",
  craving: "Cravings pass. You've waited them out before. Try a 5-minute walk or call your support person.",
  unknown: "It's okay not to know. The important thing is you're here now. Let's start fresh together."
};
```

---

## **7\. User Experience Guidelines**

| Area | Principle | Implementation |
| ----- | ----- | ----- |
| Tone | Non-judgmental, peer-like, affirming | Always "we" not "you should" |
| Language | Plain, 6th-grade reading level | Tested via Flesch–Kincaid |
| Timing | Daily check-in reminders | Push notifications (opt-in) |
| Interface | Touch-optimized, mobile-first | Large tap targets, smooth animations |
| Accessibility | Works offline; installable PWA | Service worker caching, IndexedDB |
| Visual Design | Calming colors, minimal clutter | Dark mode support, high contrast |
| Gestures | Swipe-friendly navigation | Minimal typing required |

---

## **8\. Privacy & Compliance**

* No clinical claims or diagnoses
* User consents to data storage and automated communication
* Minimal PII collection (phone/email for auth only)
* End-to-end HTTPS encryption
* Secure session management with HttpOnly cookies
* Optional anonymized analytics for product improvement
* User can delete account and all data at any time
* No third-party data sharing (except AI providers for chat feature)
* GDPR-conscious design (right to access, delete, export)

---

## **9\. Risks & Mitigations**

| Risk | Mitigation |
| ----- | ----- |
| Low engagement after first week | Personalized push notifications, streak celebrations, gentle re-engagement |
| Triggering content or tone | Co-design content with peer mentors, trauma-informed language review |
| Device/phone changes | Google OAuth backup, account recovery via email |
| Privacy concerns | Transparent privacy policy, minimal data collection, user controls |
| Offline sync conflicts | Last-write-wins strategy, conflict resolution UI |
| Browser compatibility | PWA tested on iOS Safari, Chrome, Firefox |
| AI chat inappropriate responses | System prompts for trauma-informed responses, content moderation |

---

## **10\. Rollout Plan (10-Day PWA Implementation)**

| Phase | Timeline | Status | Deliverable |
| ----- | ----- | ----- | ----- |
| 1 – Planning & Setup | Day 1 (Oct 11) | ✅ Complete | PWA architecture, dependency updates, PRD revision |
| 2 – Database Migration | Day 2 (Oct 12) | ✅ Complete | Schema migration (messages → interactions), Drizzle migration |
| 3 – Backend API | Days 3-4 (Oct 13-14) | ✅ Complete | 11 REST endpoints, storage layer, ConversationEngine integration |
| 4 – PWA Frontend | Days 5-7 (Oct 15-17) | 🔄 In Progress | React components, PWA manifest, service worker, API integration |
| 5 – Offline-First | Day 8 (Oct 18) | ⏸️ Pending | IndexedDB, sync strategies, offline UX |
| 6 – Deploy & Test | Days 9-10 (Oct 19-20) | ⏸️ Pending | Vercel deployment, E2E testing, Lighthouse audit |
| 7 – Pilot | Weeks 2-4 | ⏸️ Future | Partner org test (25–50 users), usage analytics |
| 8 – Iterate | Weeks 5-6 | ⏸️ Future | Adjust UX based on feedback, add push notifications |
| 9 – Scale | Months 2-3 | ⏸️ Future | Coach dashboard, enhanced AI features, data export |

---

## **11\. Open Questions**

1. Should voice journaling be available at MVP stage or reserved for Phase 2?
2. Should participants earn "streak badges" or keep the experience purely reflective?
3. Will reentry orgs handle onboarding, or should Next Moment support self-enrollment?
4. Should we support bilingual (English/Spanish) content at launch?
5. What push notification strategy will maximize engagement without being intrusive?
6. Should the AI chat feature be available immediately or gated behind streak milestones?
7. What analytics should be tracked while maintaining privacy commitments?

---

## **12\. Appendices**

### **Appendix A — PWA User Flow Diagram (Simplified)**

```
┌─────────────────────────┐
│  Daily Push Notification│
│   "Time for check-in"   │
└───────────┬─────────────┘
            │
            v
┌─────────────────────────┐
│   Landing: Daily Ritual │
│  "How's your mood?"     │
│  [😌 Calm]              │
│  [😰 Stressed]          │
│  [😔 Tempted]           │
│  [😊 Hopeful]           │
└───────────┬─────────────┘
            │
            v
┌─────────────────────────┐
│   Affirmation Display   │
│  Mood-based message +   │
│  calming animation      │
└───────────┬─────────────┘
            │
            v
┌─────────────────────────┐
│   Optional Intention    │
│  "Set today's goal?"    │
│  [Text input]           │
│  [Skip] [Save]          │
└───────────┬─────────────┘
            │
            v
┌─────────────────────────┐
│   Completion Screen     │
│  Streak counter update  │
│  Encouragement message  │
└─────────────────────────┘
```

---

### **Appendix B — PWA Component Structure**

```
client/src/
├── components/
│   ├── daily-ritual/
│   │   ├── MoodSelector.tsx         # 4 emoji mood buttons
│   │   ├── AffirmationCard.tsx      # Animated affirmation display
│   │   ├── IntentionInput.tsx       # Optional text input
│   │   └── StreakCounter.tsx        # Gamified streak display
│   ├── repair/
│   │   └── RepairFlow.tsx           # Compassionate relapse support
│   ├── chat/
│   │   └── FloatingChat.tsx         # AI chat widget
│   ├── auth/
│   │   └── ProtectedRoute.tsx       # Auth guard
│   └── navigation/
│       ├── NavigationMenu.tsx       # Bottom nav
│       └── UserMenu.tsx             # User settings
├── pages/
│   ├── Landing.tsx                  # Public landing page
│   ├── Login.tsx                    # Authentication
│   ├── DailyRitual.tsx              # Main check-in flow
│   ├── Journal.tsx                  # History & trends
│   └── CheckIn.tsx                  # Quick check-in entry
├── hooks/
│   ├── useAuth.tsx                  # Authentication hook
│   └── useOfflineSync.tsx           # Offline data sync
└── lib/
    ├── api.ts                       # API client
    └── db.ts                        # IndexedDB wrapper
```

---

### **Appendix C — Technology Stack Details**

**Frontend Dependencies:**
- `react` ^18.3.1 - UI framework
- `react-router-dom` ^7.9.3 - Client-side routing
- `@tanstack/react-query` ^5.60.5 - Server state management
- `vite-plugin-pwa` ^0.21.1 - PWA capabilities
- `workbox-window` ^7.3.0 - Service worker management
- `idb` ^8.0.0 - IndexedDB wrapper
- `framer-motion` ^11.13.1 - Animations
- `lucide-react` ^0.453.0 - Icons

**Backend Dependencies:**
- `express` ^4.21.2 - Web framework
- `passport` ^0.7.0 - Authentication
- `drizzle-orm` ^0.39.1 - Database ORM
- `@neondatabase/serverless` ^0.10.4 - Neon client
- `@google/generative-ai` ^0.24.1 - Gemini AI
- `openai` ^6.3.0 - OpenAI client
- `express-rate-limit` ^8.1.0 - Rate limiting
- `express-session` ^1.18.1 - Session management

---

# **✅ Next Moment — PWA Implementation Status**

### **Prepared by: Mary (Business Analyst)**

Date: October 2025
Last Updated: October 14, 2025
Current Phase: Phase 4 (Frontend Development)

---

## **1\. Summary**

**Objective**: Create a trauma-informed, emotionally supportive recovery companion for justice-impacted individuals using Progressive Web App technology.

**Core Strategy**: Deliver a "Daily Ritual Flow" habit builder + "Rupture and Repair" post-relapse support through an installable, offline-first PWA accessible on any smartphone.

**Guiding Principle**: *Recovery is not linear — consistency, not perfection.*

**Current Status**: Backend API complete (11 endpoints), Frontend components in development

---

## **2\. Core Problem to Solve**

Justice-impacted individuals in early reentry frequently relapse due to lack of structure and accessible daily support. While the Lifeline program provides free smartphones to qualified users, existing recovery apps lack trauma-informed design, offline functionality, and the empathetic approach this population needs.

---

## **3\. Solution Vision**

* Provide Daily Ritual check-ins (2–5 min) via PWA with touch-optimized interface
* Offer mood-based affirmations and grounding tips with calming animations
* When relapse occurs, offer a "Repair" flow—encouragement, reset planning, and reflection, not shame
* Enable offline functionality so users can check in anytime, anywhere
* Integrate multi-provider AI chat for additional support and reflection
* Design for low friction, high empathy, and human warmth through technology

---

## **4\. Target User**

| User Type | Description | Needs |
| ----- | ----- | ----- |
| Primary: Returning citizen in recovery | Smartphone via Lifeline; vulnerable to triggers; intermittent connectivity | Simple daily structure, emotional grounding, offline capability |
| Secondary: Case manager / reentry coach | 15–25 clients, limited check-in capacity | Lightweight engagement data (aggregated dashboard - Phase 2) |

---

## **5\. Core MVP Features (PWA Implementation)**

| Feature | Description | Implementation |
| ----- | ----- | ----- |
| Daily Ritual Flow | 2–5 minute mood selection → affirmation → optional intention | React components + REST API |
| Rupture & Repair Flow | Compassionate relapse support with trigger identification | Dedicated repair flow component |
| Encouragement Loop | Push notifications for streaks and gentle re-engagement | Web Push API (Phase 5) |
| Journal & History | View past check-ins, mood trends, intentions | Journal page with data visualization |
| AI Chat Support | Multi-provider AI chat for crisis support | Floating chat widget with provider selection |
| Offline Capability | Works without internet; syncs when online | Service worker + IndexedDB (Phase 5) |
| Streak Counter | Visualize consistency without gamification pressure | Non-punitive, encouraging design |
| Coach Dashboard (Phase 2) | Aggregated engagement metrics (opt-in) | Web dashboard |

---

## **6\. Accessibility & Design Principles**

* **Mobile-First**: Optimized for smartphones (iOS Safari, Android Chrome)
* **Offline-First**: Service worker caching enables use without connectivity
* **Installable**: Add to home screen, full-screen experience
* **Touch-Optimized**: Large tap targets, swipe gestures, minimal typing
* **Plain Language**: 6th-grade reading level throughout
* **Trauma-Informed Tone**: Warm, peer-support voice (e.g., "You showed up today — that's strength")
* **Privacy-First**: Minimal data collection, transparent policies
* **Responsive**: Works across device sizes (phone priority)
* **Dark Mode**: Reduces eye strain, battery-friendly
* **High Contrast**: WCAG AA accessibility standards

---

## **7\. Success Criteria**

| Metric | Target | Measurement Method |
| ----- | ----- | ----- |
| Daily Ritual completion rate | ≥ 60% | Backend analytics (anonymized) |
| User retention (2 weeks) | ≥ 70% | Active user tracking |
| "Felt supported" sentiment | ≥ 80% positive | Post-pilot survey |
| PWA installation rate | ≥ 50% | Install event tracking |
| Lighthouse PWA score | ≥ 90 | Automated audit |
| API response time | < 500ms p95 | Server monitoring |
| Offline functionality | 100% core features | Manual testing |
| Data privacy incidents | 0 | Security audit |
| Mobile compatibility | iOS Safari + Android Chrome | Device testing |

---

## **8\. Validation Path**

1. **Phase 4 Completion**: Finish PWA frontend components and API integration (Oct 15-17)
2. **Phase 5 Implementation**: Add offline-first functionality with IndexedDB (Oct 18)
3. **Phase 6 Deployment**: Deploy to Vercel, conduct Lighthouse audit, E2E testing (Oct 19-20)
4. **Pilot Preparation**: Partner with reentry organization for 25–50 user cohort
5. **Pilot Launch**: 2-3 week pilot with engagement tracking and user feedback
6. **Iteration**: Refine UX, content, and features based on pilot learnings
7. **Scale**: Expand to additional partner organizations

---

## **9\. Development Environment Setup**

### **Backend Development**
```bash
# Start backend API server (port 5001)
npm run dev:backend

# Run backend tests
npm test

# Build backend for production
npm run build:api
```

### **Frontend Development**
```bash
# Start Vite dev server (port 5173)
npm run dev:frontend

# Build frontend for production
npm run build:client

# Run both servers concurrently
npm run dev
```

### **Database Operations**
```bash
# Push schema changes to database
npm run db:push

# Generate migrations
npx drizzle-kit generate
```

### **Key Environment Variables**
```
# Database
DATABASE_URL=postgresql://...

# Authentication
SESSION_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# AI Providers
GOOGLE_GEMINI_API_KEY=...
OPENAI_API_KEY=...
MISTRAL_API_KEY=...
PERPLEXITY_API_KEY=...
```

---

## **10\. Immediate Next Steps (Phase 4 - In Progress)**

### **Frontend Components to Build**
1. ✅ **PWA Manifest** - Already configured in [vite.config.ts:12-56](vite.config.ts#L12-L56)
2. 🔄 **Daily Ritual Components**:
   - [ ] [MoodSelector.tsx](client/src/components/daily-ritual/MoodSelector.tsx) - 4 emoji mood buttons (exists, may need updates)
   - [ ] [AffirmationCard.tsx](client/src/components/daily-ritual/AffirmationCard.tsx) - Animated affirmation display (exists, may need updates)
   - [ ] [IntentionInput.tsx](client/src/components/daily-ritual/IntentionInput.tsx) - Optional text input (exists, may need updates)
   - [ ] [StreakCounter.tsx](client/src/components/daily-ritual/StreakCounter.tsx) - Non-punitive streak display (exists, may need updates)
3. 🔄 **Repair Flow**:
   - [ ] [RepairFlow.tsx](client/src/components/repair/RepairFlow.tsx) - Compassionate relapse support (exists, verify integration)
4. 🔄 **Pages**:
   - [ ] [DailyRitual.tsx](client/src/pages/DailyRitual.tsx) - Main flow orchestrator (exists, verify REST API integration)
   - [ ] [Journal.tsx](client/src/pages/Journal.tsx) - History view (exists, verify)
   - [ ] [Login.tsx](client/src/pages/Login.tsx) - Authentication UI (exists, verify)
5. ✅ **AI Chat** - [FloatingChat.tsx](client/src/components/chat/FloatingChat.tsx) already implemented

### **Integration Tasks**
- [ ] Connect all components to REST API endpoints (see Section 5)
- [ ] Test end-to-end Daily Ritual flow
- [ ] Test Repair flow trigger and guidance
- [ ] Verify authentication flow (local + Google OAuth)
- [ ] Test PWA installation on iOS and Android

---

## **11\. Attachments**

* User Flow Diagrams: Daily Ritual & Recalibration (SMS/IVR)  
* Message Content Samples  
* Accessibility Review Checklist

---

## **🧭 Section 1 — Vision**

### **Product Vision Statement**

Next Moment is a compassionate, low-barrier digital companion that helps justice-impacted individuals in recovery rebuild daily structure and emotional regulation through simple, accessible SMS or voice (IVR) interactions.

It aims to deliver consistency, connection, and encouragement in moments where traditional digital support systems fail due to low access, literacy, or trust.

Our “why”:

* Recovery and reentry are fragile, especially in the first 6–12 months.  
* Digital inequity isolates the most vulnerable.  
* Next Moment restores human-centered connection via the simplest available technology — a basic phone.

North Star Metric: Sustained daily ritual engagement rate (completion ≥ 60% over 14 days).

---

### **Product Goals**

1. Accessibility: Work for all phones (feature or smart) — no data required.  
2. Consistency: Encourage short, daily check-ins that reinforce emotional grounding.  
3. Empathy: Replace judgment with supportive, affirming communication.  
4. Resilience: Reframe relapse as repair, not failure.  
5. Scalability: Build a conversation engine architecture that can later extend to app, web, or AI-assisted coaching.

---

### **Key Differentiators**

| Aspect | Next Moment | Typical Recovery Apps |
| ----- | ----- | ----- |
| Access | SMS & IVR — any phone | Smartphone & data required |
| Tone | Peer-like, affirming | Often clinical or punitive |
| Complexity | 2–5 min ritual | Multi-step app navigation |
| Privacy | Anonymous, opt-in | Accounts \+ personal data |
| Design Principle | “Repair, not failure” | “Reset after relapse” |

---

### **Vision Summary**

Next Moment transforms everyday mobile communication (text or call) into a ritual of self-care and reflection, offering individuals in reentry a small, consistent success moment each day.  
It stands as a bridge between behavioral recovery, reentry support, and accessible digital health — lightweight yet deeply human.

---

## **📦 Section 2 — Product Scope and Key Use Cases**

### **2.1 In-Scope (MVP Scope)**

The MVP focuses on the Tier 1 accessibility layer, ensuring all interactions function via SMS and IVR without reliance on smartphones or data connectivity.  
It’s designed to validate engagement, usability, and emotional impact among reentry and recovery participants.

| Feature | Description | Priority |
| ----- | ----- | ----- |
| Daily Ritual Flow | 2–5 min text or voice-based self-check-in. Captures mood → provides short reflection or grounding tip → optional goal/intention setting. | P0 |
| Rupture & Repair Flow | Compassionate relapse flow. When a user reports a “slip,” system provides affirmation, identifies trigger, and offers reset guidance. | P0 |
| Encouragement Loop | Periodic motivational messages or affirmations to maintain engagement. | P1 |
| Data Logging & Basic Analytics | Store minimal user engagement data (mood trends, streaks, triggers). No personal content retention. | P1 |
| Coach Summary (Phase 2\) | Weekly SMS or dashboard summaries for partner organizations. | P2 |
| Bilingual Support (Phase 2\) | English and Spanish message bank for broader reach. | P2 |

---

### **2.2 Out of Scope (for MVP)**

* Mobile or web app interface.  
* AI-driven chat or smart recommendations.  
* Clinical data collection or integration with EMRs.  
* Voice journaling or long-form responses.  
* Complex case management dashboard (beyond basic summaries).

---

### **2.3 Core Use Cases**

#### **UC-1: Daily Check-In (Ritual Flow)**

Actor: Returning citizen with basic phone  
Goal: Build a habit of self-awareness and consistency  
Trigger: Daily SMS or IVR prompt (“How’s your mood today?”)  
Flow:

1. User receives daily message or call.  
2. Responds with mood selection (1–4).  
3. Receives corresponding grounding message.  
4. Optionally sets a small daily intention.  
5. Interaction logged as “completed.”

Outcome: Reinforces stability and positive reinforcement.

---

#### **UC-2: Recalibration (Rupture → Repair Flow)**

Actor: Returning citizen after relapse or emotional crisis  
Goal: Re-engage user compassionately and reset recovery plan  
Trigger: User texts “SLIP” or reports “tempted/stressed.”  
Flow:

1. System acknowledges with empathy (“Repair time, not failure.”).  
2. Asks for trigger type (stress, people, craving, unknown).  
3. Sends short personalized repair message.  
4. Offers optional grounding audio (IVR).  
5. Marks as “repair” event for next-day follow-up.

Outcome: Maintains engagement, prevents shame spiral.

---

#### **UC-3: Encouragement Loop (Micro-Coaching)**

Actor: Returning citizen  
Goal: Maintain momentum and emotional connection between rituals  
Trigger: Automated schedule (e.g., 2× weekly) or missed check-in  
Flow:

* Sends motivational text (“Missed you yesterday — you matter. Try again today.”)  
* Adjusts tone dynamically (encouragement vs. celebration)

---

#### **UC-4: Partner Summary (Phase 2\)**

Actor: Reentry coach or case manager  
Goal: Gain light-touch insight into client engagement  
Flow:

1. System aggregates anonymized user data (check-in rate, mood trend).  
2. Sends summary via weekly SMS or simple dashboard link.

---

### **2.4 MVP Boundaries**

| Boundary | Design Intent |
| ----- | ----- |
| Technical simplicity | Must function on basic SMS/voice devices. |
| User data privacy | Minimal retention, anonymized IDs only. |
| Tone and messaging | Empathetic, non-clinical, and affirming. |
| Engagement strategy | Habit-forming via consistency, not gamification. |

---

### **2.5 Success Criteria for Scope Completion**

* Daily and Repair flows functional end-to-end (SMS \+ IVR).  
* ≥90% of test users able to complete flow unaided.  
* Twilio sandbox prototype stable under pilot load (≤50 users).  
* Positive qualitative feedback from at least 70% of pilot users.

---

### **🔹 Actor Clarification: *Returning Citizen with Basic Phone***

Profile Summary:  
An individual recently released from incarceration (typically within the past 6–12 months), actively engaged in or seeking recovery from substance use disorder.

Context:

* May be enrolled in a reentry or diversion program.  
* Often balancing multiple stressors: housing, employment, probation check-ins, and relapse prevention.  
* May have limited social support and high exposure to triggers.  
* Uses a basic mobile phone (flip or feature) — limited data plan, shared device, or prepaid service.

Behavioral Focus:  
The system supports habit formation, emotional regulation, and relapse resilience through short, structured check-ins.  
While not a clinical treatment tool, Next Moment acts as a behavioral reinforcement and recovery companion.


---

## **🧩 Name Assessment: “Next Moment”**

### **1\. Linguistic and Emotional Tone Analysis**

* “Reentry” → Clear, functional term used in justice and social service contexts. Recognizable to probation, parole, and reentry professionals.  
* “Buddy” → Conveys warmth, friendliness, and approachability. It humanizes the digital tool and lowers the psychological barrier to engagement.

However:

* “Buddy” can also sound overly casual or juvenile when associated with serious recovery journeys or formal programs.  
* Some professional stakeholders (e.g., county reentry coordinators, funders, clinical partners) may perceive it as too informal or non-clinical, especially in grant or compliance documentation.  
* Among peer users, it may actually increase adoption likelihood — “Buddy” signals a nonjudgmental, approachable ally rather than a formal authority.

Summary: The name strikes a tone of *friendliness and accessibility* but risks sounding *less serious* in institutional settings.

---

### **2\. Audience Alignment**

| Audience | Likely Reaction | Fit |
| ----- | ----- | ----- |
| Returning citizens (users) | Feels friendly, easy to say, low intimidation. | ✅ Good |
| Recovery coaches / peers | Likely receptive; matches motivational culture. | ✅ Good |
| Probation / reentry officials | May perceive as too informal for documentation or policy integration. | ⚠️ Moderate |
| Funding & partner orgs | Might prefer something that implies structure and legitimacy. | ⚠️ Moderate |

---

### **3\. Comparative Tone Benchmarks**

| Name | Tone | Perception |
| ----- | ----- | ----- |
| Next Moment | Friendly, casual | Trustworthy but non-institutional |
| Reentry Coach | Professional, empowering | Formal but approachable |
| Reentry Guide | Supportive, neutral | Professional yet simple |
| Recovery Path | Reflective, hopeful | Emotionally balanced |
| Grounded | Modern, mindful | Youth-friendly, abstract |
| The Reset Line | Conversational, action-oriented | Culturally resonant for relapse recovery |
| Second Step | Hopeful, reentry-aligned | Symbolic, meaningful |

---

### **4\. Recommendation**

Primary Recommendation:  
✅ *Retain “Next Moment” for the MVP and early-stage pilot,* given:

* Its plain-language accessibility (6th-grade level).  
* Emotional safety for justice-impacted participants.  
* Lower cognitive and stigma barriers.

However, prepare an alternate “professional name” for institutional communication and partner adoption.  
A dual-branding model can balance tone across contexts:

| Use Context | Recommended Label |
| ----- | ----- |
| User-facing (SMS/IVR) | “Next Moment” |
| Institutional / PRD / Grant documents | “Reentry Companion” or “Reentry Coach” |

---

### **5\. Suggested Alternatives (if renaming fully)**

| Option | Tone | Comment |
| ----- | ----- | ----- |
| Reentry Coach | Supportive, authoritative | Best all-around professional alternative |
| Reentry Companion | Neutral, empathetic | Friendly yet formal |
| Recovery Line | Simple, accessible | Good for voice/SMS format |
| Reset Support | Plain, action-focused | Emphasizes “repair not failure” theme |

---

### **6\. Final Recommendation Summary**

* Retain “Next Moment” for pilot MVP to preserve trust and approachability.  
* Evaluate name perception with participants during early testing.  
* If feedback skews toward “too casual,” transition to “Reentry Coach” or “Reentry Companion” for broader rollout.  
* Maintain 6th-grade readability and non-stigmatizing language in all brand materials regardless of final name.

---

**📜 Branding Decision Memo (for Integration Reference)**

Decision Context:  
Project name *“Next Moment”* tested positively for accessibility and emotional warmth but may sound overly casual in institutional settings. To balance tone, we adopt a dual-brand strategy for clarity and professionalism.

| Context | Name Used | Rationale |
| ----- | ----- | ----- |
| User-facing (SMS/IVR, website, materials) | Next Moment | Plain, friendly, relatable; encourages engagement among returning citizens. |
| Institutional / Partner / PRD Documentation | Reentry Companion | Professional tone for funders, agencies, and partner communications. |

Action:  
PRD will reference the project as “Next Moment (Institutional alias: Reentry Companion)” throughout.  
Tone in all content will remain trauma-informed, nonjudgmental, and written at a 6th-grade reading level.

---

Now resuming the PRD Section 3: Functional Scope and Requirements with branding integration and alignment to the approved MVP definition.

---

## **⚙️ Section 3 — Functional Scope and Requirements**

Product Name: *Next Moment (Institutional alias: Reentry Companion)*

---

### **3.1 Core System Functions (Tier 1 MVP)**

| ID | Function | Description | Priority |
| ----- | ----- | ----- | ----- |
| F1 | Daily Ritual Flow | Core check-in cycle delivered via SMS and IVR. Collects emotional state, sends affirmations or grounding messages, and optionally captures a simple daily intention. | P0 |
| F2 | Rupture & Repair Flow | Post-relapse flow offering empathetic reset options. User can text “SLIP” or respond to relapse prompt to receive nonjudgmental guidance and re-engagement content. | P0 |
| F3 | Encouragement Loop | Automated motivational messages sent after inactivity or on completion streaks. Supports emotional reinforcement and engagement recovery. | P1 |
| F4 | User State Logging | Stores anonymized records (mood, streaks, engagement). Enables aggregated insights without collecting personal data. | P1 |
| F5 | Coach Summary (Phase 2\) | Optional weekly summaries via SMS or dashboard for partner coaches. Aggregates engagement metrics by anonymous ID. | P2 |
| F6 | Language & Accessibility Layer | Supports plain English for MVP; framework built for bilingual expansion (English/Spanish). | P2 |

---

### **3.2 Functional Flow Overview**

Daily Ritual Flow (F1)

* Trigger: Automated daily SMS/IVR call or user-initiated keyword (“CHECKIN”).  
* Step 1: Ask user’s current mood (1–4).  
* Step 2: Respond with supportive affirmation or grounding tip.  
* Step 3: Offer optional “daily intention” entry (text or voice).  
* Step 4: Log result and update streak count.  
* Step 5: Send closing message (“You showed up — that matters.”).

Rupture & Repair Flow (F2)

* Trigger: Keyword “SLIP” or relapse option selected.  
* Step 1: System acknowledges with empathy (“Repair, not failure.”).  
* Step 2: Ask trigger type (1–4: stress, people, craving, unknown).  
* Step 3: Provide personalized guidance or rest tip.  
* Step 4: Schedule follow-up encouragement for next day.

Encouragement Loop (F3)

* Trigger: Inactivity or milestone event (e.g., 3-day streak).  
* Step 1: Send contextual message (“3 days strong\!” or “We missed you — try again today.”).  
* Step 2: Re-link to check-in flow.

---

### **3.3 Non-Functional Requirements (NFRs)**

| Category | Requirement | Target / Standard |
| ----- | ----- | ----- |
| Accessibility | Functional via SMS & IVR on feature phones | ≥ 95% reliability |
| Performance | Response latency \< 3s for SMS; \< 1s for IVR tone recognition |  |
| Scalability | Handle 500 concurrent users in pilot |  |
| Data Security | No PII storage; phone number → anonymized ID | AES-256 encryption |
| Reliability | ≥ 99% message delivery uptime | Twilio SLA compliance |
| Tone & Language | 6th-grade reading level, affirming, non-judgmental | Plain language check |

---

### **3.4 User Data & Privacy Model**

* No clinical or diagnostic data collected.  
* Each user linked via randomized identifier.  
* Optional opt-out (“STOP” for SMS, “press 9” for IVR).  
* Aggregate-level reporting only.

---

### **3.5 Success Metrics (Aligned with Vision)**

| Metric | Target | Validation Method |
| ----- | ----- | ----- |
| Daily Ritual completion | ≥ 60% | Engagement logs |
| Retention (2 weeks) | ≥ 70% | Active session tracking |
| Sentiment (“felt supported”) | ≥ 80% | Post-pilot survey |
| Usability (unaided completion) | ≥ 90% | Pilot testing |
| Data privacy incidents | 0 | Audit |

---

### **3.6 Dependencies**

* Twilio (SMS & IVR API) — primary messaging provider.  
* Node.js or Python backend for state logic.  
* Cloud-hosted DB (SQLite/Firebase) for logs.  
* Partner Organizations for user onboarding.

---

## **📦 Section 2 — Product Scope and Requirements**

### **2.1 In-Scope (Tier 1 MVP)**

| Feature | Description | Priority |
| ----- | ----- | ----- |
| Daily Ritual Flow (F1) | 2–5 minute check-in that captures mood → sends affirmation or grounding tip → optional daily intention. Accessible via SMS or IVR. | P0 |
| Rupture & Repair Flow (F2) | Compassionate “slip” reset. User texts “SLIP” or selects relapse option to receive empathetic reset plan. | P0 |
| Encouragement Loop (F3) | Automated motivational messages triggered by inactivity or streak milestones. | P1 |
| User State Logging (F4) | Anonymous storage of check-in results, streaks, and triggers. | P1 |
| Coach Summary (F5) | Weekly SMS or dashboard summaries for partner coaches (Phase 2). | P2 |
| Language & Accessibility Layer (F6) | Plain-English flows; bilingual (EN/ES) expansion framework. | P2 |

---

### **2.2 Out of Scope (for MVP)**

* Smartphone app or web UI  
* AI chatbot or adaptive content engine  
* Clinical data capture or integration with EHR systems  
* Voice journaling or long-form recordings  
* Full case-management dashboard

---

### **2.3 Primary Actor: Returning Citizen in Recovery**

Profile: A justice-impacted individual, recently released (≤12 months), actively working through substance use recovery. Uses a basic mobile phone with limited data and trust in digital systems.

Needs: Daily structure, emotional grounding, non-judgmental support, and a sense of progress without technological barriers.

---

### **2.4 Key Use Cases**

#### **UC-1: Daily Check-In (Ritual Flow)**

Goal: Create a habit of self-awareness and consistency.  
Trigger: Automated daily SMS or call.  
Steps: Mood selection → affirmation → optional intention → log completion.  
Outcome: Grounding moment that builds positive streaks.

#### **UC-2: Rupture → Repair Flow**

Goal: Handle relapse without shame.  
Trigger: Keyword “SLIP” or relapse option.  
Steps: Empathetic acknowledgment → trigger identification → repair tip → next-day follow-up.  
Outcome: Re-engagement and psychological safety.

#### **UC-3: Encouragement Loop**

Goal: Maintain motivation between rituals.  
Trigger: Inactivity or milestone.  
Flow: Send contextual message → re-link to check-in flow.

#### **UC-4: Partner Summary (Phase 2\)**

Goal: Provide case managers with aggregate engagement insights.  
Flow: Aggregate check-in logs → generate weekly SMS digest or dashboard snapshot.

---

### **2.5 Boundaries and Design Intent**

| Boundary | Design Intent |
| ----- | ----- |
| Technical simplicity | All flows must run on basic SMS and IVR devices. |
| User data privacy | Minimal collection; anonymous IDs; explicit opt-out. |
| Tone and branding | User-facing brand: *Next Moment* (friendly); Institutional alias: *Reentry Companion* (professional). |
| Trauma-informed design | Language must be supportive, not directive. |
| Engagement model | Encourage consistency through affirmation, not gamification. |

---

### **2.6 Success Criteria for Scope Completion**

* All Tier 1 flows (F1–F4) functional end-to-end (SMS \+ IVR).  
* ≥ 90 % of pilot users complete check-in without assistance.  
* Twilio sandbox stable for ≤ 50 simultaneous users.  
* ≥ 70 % positive feedback on tone and ease of use.

---

## **🧩 Section 3 — User Stories & Acceptance Criteria**

---

### **Epic 1: Daily Ritual Flow (F1)**

Goal: Build a consistent daily check-in habit through SMS or IVR.

#### **User Story 1.1 — Receive Daily Check-In Prompt**

*As a returning citizen in recovery,*  
I want to receive a short daily text or call at my preferred time  
So that I can stay grounded and consistent in my recovery.

Acceptance Criteria:

*  System automatically sends daily SMS or IVR call at configured time.  
*  User can initiate manually by texting “CHECKIN.”  
*  System confirms message delivery.  
*  Daily logs store timestamp and message ID.

---

#### **User Story 1.2 — Report Mood & Get Grounding Message**

*As a user,*  
I want to quickly select how I feel from simple options  
So that I can receive a relevant grounding tip or affirmation.

Acceptance Criteria:

*  System presents 4 mood options (Calm, Stressed, Tempted, Hopeful).  
*  User selects via number (SMS or DTMF).  
*  System responds with matching message from content bank.  
*  Message tone adheres to trauma-informed guidelines.  
*  Interaction completes in ≤ 3 SMS exchanges or ≤ 60 seconds IVR.

---

#### **User Story 1.3 — Set a Daily Intention**

*As a user who’s reflected on my state,*  
I want to optionally write or say a short daily goal  
So that I can practice small steps toward self-regulation.

Acceptance Criteria:

*  System prompts for optional intention (“Want to set one? Y/N”).  
*  If yes → captures free text or voice input (≤ 20s).  
*  System sends acknowledgment message.  
*  Intention stored under user session ID (no PII).

---

### **Epic 2: Rupture → Repair Flow (F2)**

Goal: Offer empathetic, non-punitive support after a slip or relapse.

#### **User Story 2.1 — Self-Report a Slip**

*As a user who relapsed or felt triggered,*  
I want to text a simple keyword (“SLIP”) or select relapse option  
So that I can receive encouragement and practical next steps.

Acceptance Criteria:

*  Keyword “SLIP” triggers repair flow immediately.  
*  System sends empathetic acknowledgment (“You showed courage by checking in.”).  
*  User prompted to select trigger type (Stress / People / Craving / Unsure).  
*  Repair tip provided from message bank.  
*  Follow-up encouragement scheduled for next day.

---

#### **User Story 2.2 — Receive Next-Day Repair Check-In**

*As a user who slipped recently,*  
I want to receive a follow-up message the next day  
So that I feel supported in restarting my routine.

Acceptance Criteria:

*  System sends repair follow-up message within 24 hours.  
*  Message tone reaffirms progress, not failure.  
*  Logs mark repair cycle completion.

---

### **Epic 3: Encouragement Loop (F3)**

Goal: Sustain motivation through contextual automated messages.

#### **User Story 3.1 — Get Encouragement After Inactivity**

*As a user who missed a check-in,*  
I want to receive a friendly reminder  
So that I stay motivated to re-engage.

Acceptance Criteria:

*  Triggered if user inactive ≥ 24 hours.  
*  Message content draws from “gentle re-engagement” library.  
*  User can immediately reply “CHECKIN” to resume.

---

#### **User Story 3.2 — Get Positive Reinforcement for Consistency**

*As a user completing multiple check-ins,*  
I want to receive celebration messages  
So that I feel recognized for my progress.

Acceptance Criteria:

*  Triggered on streak milestones (e.g., 3, 7, 14 days).  
*  System personalizes message using user ID context.  
*  Optional replay of motivational audio via IVR.

---

### **Epic 4: Data Logging & Coach Summary (F4–F5)**

Goal: Enable basic engagement insights while maintaining privacy.

#### **User Story 4.1 — Log Engagement Data**

*As a system administrator,*  
I want to record each user’s check-in type and timestamp  
So that aggregate engagement trends can be reviewed.

Acceptance Criteria:

*  Logs include user ID (anonymized), mood, timestamp, and channel (SMS/IVR).  
*  No PII (names, locations, or content of free-text intentions).  
*  All data stored encrypted (AES-256).

---

#### **User Story 4.2 — View Weekly Coach Summary (Phase 2\)**

*As a reentry coach,*  
I want to see my cohort’s engagement patterns  
So that I can encourage consistent participation.

Acceptance Criteria:

*  Summaries delivered via SMS or simple web dashboard.  
*  Include total check-ins, top mood categories, and repair count.  
*  Data anonymized and grouped by program ID.

---

### **Epic 5: Accessibility & Language Layer (F6)**

Goal: Ensure usability and emotional resonance for all literacy levels.

#### **User Story 5.1 — Understandable and Accessible Content**

*As a user with low literacy or limited tech skills,*  
I want messages that are short and clear  
So that I can complete check-ins without confusion.

Acceptance Criteria:

*  All message templates written at ≤ 6th-grade reading level.  
*  Message length ≤ 160 characters (SMS limit).  
*  IVR voice recordings ≤ 20 seconds each.  
*  Tone validated through pilot focus groups.

---


## **🏗️ Section 4 — Technical Requirements & Architecture Overview**

---

### **4.1 System Overview**

Next Moment operates as a conversation-driven behavioral support platform built on top of reliable telephony and messaging infrastructure.  
Its architecture emphasizes:

* Low-access functionality: works on any device capable of sending/receiving texts or voice calls.  
* Simplicity: minimal user data; lightweight backend.  
* Scalability: easy to expand to new flows and channels (e.g., WhatsApp, app).

---

### **4.2 High-Level Architecture Diagram (Conceptual)**

      `+--------------------+`  
       `|  User (SMS/IVR)   |`  
       `+--------+----------+`  
                `|`  
                `v`  
      `+----------------------+`  
      `| Twilio API Gateway   |`  
      `| (SMS / Voice)        |`  
      `+---------+------------+`  
                `|`  
                `v`  
      `+----------------------+`  
      `| Conversation Engine  |`  
      `| (Node.js / Python)   |`  
      `| - Flow Logic         |`  
      `| - State Machine      |`  
      `| - Message Templates  |`  
      `+---------+------------+`  
                `|`  
                `v`  
      `+----------------------+`  
      `| Data Layer (DB)      |`  
      `| SQLite / Firebase DB |`  
      `| - Logs               |`  
      `| - Anon IDs           |`  
      `| - Streak counters    |`  
      `+----------------------+`  
                `|`  
                `v`  
      `+----------------------+`  
      `| Admin / Analytics UI |`  
      `| Retool or Supabase   |`  
      `+----------------------+`

---

### **4.3 Core Components**

| Component | Description | Technology / Notes |
| ----- | ----- | ----- |
| Messaging Gateway | Handles inbound/outbound SMS and IVR calls. | Twilio Programmable Messaging & Voice |
| Conversation Engine | Rules-based message logic and session management. | Node.js (Express) or Python (Flask/FastAPI) |
| Content Layer | JSON/YAML message templates for moods, repair flows, affirmations. | Stored locally or via CMS-like repository |
| Data Layer | Secure minimal schema for logging sessions, moods, triggers. | SQLite (local) or Firebase (cloud) |
| Admin Layer | Basic analytics dashboard for pilot data review. | Retool / Supabase |
| Security Layer | Anonymization, encryption, and opt-out handling. | AES-256, no PII beyond phone \# hash |

---

### **4.4 Core APIs and Flows**

#### **A. SMS Flow (Twilio Messaging API)**

Inbound:

* Endpoint `/sms/inbound` receives user message.  
* Conversation Engine parses message (e.g., “1”, “SLIP”, “Y”, free text).

Outbound:

* Endpoint `/sms/outbound` triggered by state machine decisions.  
* Sends preformatted responses via Twilio API.

Sample Payload (Outbound):

`{ "to": "+15551234567", "from": "+18445556789", "body": "Thanks for checking in. Remember, small steps make change." }`  
---

#### **B. IVR Flow (Twilio Voice API)**

Inbound:

* User calls toll-free number → Twilio webhook hits `/voice/inbound`.  
* Plays pre-recorded greeting \+ prompts via TwiML response.

Example TwiML:

`<Response> <Say voice="alice">Hi, this is Next Moment. How’s your mood today?</Say> <Gather input="dtmf" numDigits="1" action="/voice/mood-response"/> </Response>`

Follow-up:

* User presses key → engine fetches response from content bank.  
* Logs DTMF response, triggers affirmation playback.

---

### **4.5 Conversation Logic (State Machine Model)**

Each flow (Daily Ritual, Rupture & Repair) is modeled as a finite state machine:

| State | Trigger | Next State | Action |
| ----- | ----- | ----- | ----- |
| `start` | Daily reminder / user initiation | `mood_prompt` | Send mood question |
| `mood_prompt` | User input (1–4) | `response` | Fetch and send affirmation |
| `response` | User input Y/N for intention | `intention` or `end` | Capture intention if Y |
| `intention` | Free-text or voice input | `end` | Log data |
| `repair_start` | Keyword “SLIP” | `trigger_type` | Acknowledge \+ prompt for trigger |
| `trigger_type` | User input (1–4) | `repair_tip` | Send reset advice |
| `repair_tip` | Message sent | `follow_up` (24h) | Schedule next-day encouragement |

---

### **4.6 Data Schema (Simplified)**

User Table

| Field | Type | Description |
| ----- | ----- | ----- |
| user\_id | UUID | Anonymized ID |
| phone\_hash | String | Hashed phone number |
| preferred\_time | String | Daily check-in time |
| language | String | Default “en” |

Log Table

| Field | Type | Description |
| ----- | ----- | ----- |
| log\_id | UUID | Unique entry |
| user\_id | UUID | Foreign key |
| timestamp | Datetime | Check-in timestamp |
| channel | Enum (SMS/IVR) | Interaction type |
| flow\_type | Enum (daily, repair) | Flow classification |
| mood | String | Mood keyword |
| trigger | String | Repair trigger type |
| intention\_text | String | Optional short text |
| streak\_count | Integer | Calculated field |

---

### **4.7 Technical Non-Functional Requirements**

| Category | Requirement | Metric |
| ----- | ----- | ----- |
| Performance | SMS round-trip latency | ≤ 3 seconds |
| Availability | Uptime (Twilio \+ Backend) | ≥ 99% |
| Scalability | Pilot load (50 users) | Smooth operation |
| Maintainability | Configurable message flows | JSON/YAML editable |
| Security | Encryption at rest / in transit | AES-256 \+ HTTPS |
| Privacy | PII minimization | Hash all identifiers |
| Compliance | SMS opt-out / consent | “STOP” \+ confirmation |

---

### **4.8 MVP Deployment Plan**

| Environment | Purpose | Tools |
| ----- | ----- | ----- |
| Sandbox | Prototype & message flow testing | Twilio Sandbox \+ ngrok |
| Staging | Partner testing (small cohort) | AWS Lightsail / Firebase |
| Production (Pilot) | 25–50 user pilot | Cloud host (Render / AWS EC2) |

---
