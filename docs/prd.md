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

### 2.1 In Scope (10-Day MVP - Phase 1)
| Feature | Description | Priority | Status |
|----------|--------------|----------|--------|
| **F1 – Daily Ritual Flow (SMS Only)** | 2–5 min check-in via **SMS** capturing mood → affirmation → optional intention. | P0 | ✅ In Scope |
| **F2 – Rupture & Repair Flow** | "SLIP" keyword triggers compassionate relapse reset with repair suggestions. | P0 | ✅ In Scope |
| **F3 – Encouragement Loop** | Automated motivational messages for inactivity or streak milestones. | P1 | ✅ In Scope |
| **F4 – User State Logging** | Anonymous session storage for mood, triggers, and streaks. | P1 | ✅ In Scope |
| **F7 – Investor Demo Dashboard** | Real-time metrics display for investor demonstration. | P0 | ✅ In Scope |

### 2.2 Deferred to Phase 2 (Post-MVP)
| Feature | Description | Original Priority | Deferral Reason |
|----------|--------------|-------------------|-----------------|
| **F1b – IVR (Voice)** | Voice call version of Daily Ritual Flow with DTMF input. | P0 → P2 | Complexity + doubles integration surface; SMS validates core concept. |
| **F5 – Coach Summary** | Weekly aggregate summaries for partner coaches. | P2 | No change - remains Phase 2. |
| **F6 – Language & Accessibility Layer** | English-first; bilingual (EN/ES) expansion framework. | P2 | No change - remains Phase 2. |

**Scope Rationale**: 10-day timeline prioritizes SMS accessibility (core MVP goal) while deferring IVR complexity to Phase 2 post-validation. All P0 recovery support features (Daily Ritual, Repair, Encouragement) remain in scope.

### 2.3 Out of Scope (All Phases)
- Smartphone or web app (beyond investor demo dashboard).
- AI chatbot or adaptive recommendation engine.
- Clinical data integration (EHR).
- Long-form journaling or audio storage.
- Case-management dashboard (beyond aggregate metrics view).

### 2.3 Primary Actor: Returning Citizen in Recovery
A justice-impacted individual within 12 months of release, working through substance use recovery using a basic phone.  
They need simple, supportive routines without judgment or technical friction.

### 2.4 Key Use Cases
#### UC-1: Daily Check-In (Ritual Flow)
**Goal:** Build consistent grounding habit.  
**Trigger:** Automated SMS/call.  
**Flow:** Mood prompt → affirmation → optional intention → log completion.

#### UC-2: Rupture → Repair
**Goal:** Provide safe reset after relapse (“SLIP”).  
**Trigger:** User texts “SLIP” or presses repair option.  
**Flow:** Empathetic message → identify trigger → repair suggestion → follow-up.  

#### UC-3: Encouragement Loop
**Goal:** Maintain motivation between check-ins.  
**Trigger:** Inactivity or streak milestone.  
**Flow:** Contextual message → link back to ritual.

#### UC-4: Partner Summary (Phase 2)
**Goal:** Aggregate non-identifiable usage for coaches.  
**Flow:** Pull engagement stats weekly → deliver via SMS or dashboard snapshot.

### 2.5 Boundaries and Design Intent
| Boundary | Design Intent |
|-----------|----------------|
| Technical simplicity | Operates on basic SMS and IVR (no app needed). |
| User data privacy | No PII; anonymized identifiers only. |
| Tone & branding | User-facing: *Reentry Buddy* (friendly), Institutional: *Reentry Companion* (formal). |
| Trauma-informed design | Supportive, non-judgmental, plain language. |
| Engagement model | Encouragement over gamification. |

### 2.6 Success Criteria
- ≥ 90% of pilot users complete a check-in without assistance.  
- ≤ 10-second response latency for SMS/IVR.  
- ≥ 70% positive tone/ease-of-use feedback.  
- Stable Twilio sandbox for ≤ 50 simultaneous users.

---

## 3. User Stories and Acceptance Criteria

### 3.1 Core SMS Flow
**Story:** As a returning citizen, I want a daily check-in by text so I can ground myself.  
- **Given:** System sends daily SMS prompt.  
- **When:** User replies with mood (1–4).  
- **Then:** User receives affirmation and can set intention.  
- **Acceptance:** Response logs successfully; streak counter updates.

### 3.2 IVR Flow
**Story:** As a user without texting ability, I can call or receive a voice call for my daily check-in.  
- **Given:** User receives IVR prompt.  
- **When:** User presses 1–4 for mood.  
- **Then:** System plays supportive message and logs session.

### 3.3 Repair Flow
**Story:** When I relapse, I can text “SLIP” and receive compassion, not judgment.  
- **Acceptance:** System logs relapse, schedules next-day follow-up, and resets streak gracefully.

### 3.4 Encouragement Loop
**Story:** When I skip a few days, the system reminds me gently.  
- **Acceptance:** If inactivity > 3 days, user receives motivation message.

### 3.5 Data Logging & Privacy
**Story:** As an operator, I can see anonymized aggregate data.  
- **Acceptance:** Reports show trends only (no phone numbers).

---

## 4. Technical Requirements and Architecture Overview

### 4.1 Core Architecture (10-Day MVP Implementation)
- **Interface:** SMS only via Twilio Programmable Messaging (IVR deferred to Phase 2).
- **Backend:** Node.js + Express + TypeScript (Vercel serverless functions).
- **Data Store:** PostgreSQL (Neon) with Drizzle ORM.
- **Storage:** No file storage in MVP (voice recordings deferred to Phase 2).
- **Monitoring:** Vercel logs + Twilio Console.
- **Security:** TLS, Twilio signature validation, Neon PostgreSQL encryption at rest.

**Tech Stack Rationale**: Leverages existing TypeScript/Express/PostgreSQL codebase for rapid 10-day MVP delivery. Brownfield enhancement approach converts Express routes to Vercel serverless functions while reusing React + shadcn/ui for investor demo dashboard.

### 4.2 Conversation Engine
- Finite-state machine (FSM) controlling “Daily Ritual” and “Repair” flows.  
- Stateless interactions; each step logs to DB with `session_id`.  
- JSON-based flow definitions for non-dev content updates.  

### 4.3 Twilio Integration
- Webhooks:
  - `/webhooks/twilio/sms`
  - `/webhooks/twilio/voice`
  - `/webhooks/twilio/voice/gather`
- Signature validation for all inbound traffic.
- REST API for outbound messages and IVR follow-ups.

### 4.4 Data Model
- **Users** → `user_id`, `phone_hash`, `preferred_time`, `language`, `opt_out`  
- **SessionLogs** → `session_id`, `user_id`, `flow_type`, `mood`, `timestamp`, `streak_count`  
- **FollowUps** → `followup_id`, `user_id`, `scheduled_at`, `status`  

### 4.5 Security & Privacy
- Anonymous IDs only; no direct PII stored.  
- “STOP” keyword deactivates user.  
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

### 5.2 Implementation Plan (10 Days - October 10-19, 2025)

| Phase | Days | Focus | Deliverables |
|-------|------|-------|--------------|
| **Phase 1: Planning & Setup** | Days 1-2 (Oct 10-11) | PRD updates, story creation, stakeholder approval | Updated PRD, 9-10 implementation stories, Neon PostgreSQL setup |
| **Phase 2: Foundation** | Days 3-4 (Oct 12-13) | Database & webhook infrastructure | Schema migrations, Twilio SMS webhook, message templates |
| **Phase 3: Core Flows** | Days 5-6 (Oct 14-15) | Conversation logic implementation | Daily Ritual FSM, Repair Flow ("SLIP") |
| **Phase 4: Advanced Features** | Days 7-8 (Oct 16-17) | Encouragement & scheduling | Encouragement Loop logic, Vercel Cron configuration |
| **Phase 5: Deploy & Demo** | Days 9-10 (Oct 18-19) | Dashboard & testing | Investor demo dashboard, Vercel deployment, manual E2E testing |

### 5.3 Milestones (10-Day MVP)
- **M1:** Database schema extended + Twilio webhook operational (Day 4).
- **M2:** Daily Ritual SMS flow functional end-to-end (Day 6).
- **M3:** Repair Flow + Encouragement Loop deployed (Day 8).
- **M4:** Investor demo dashboard displaying real-time metrics (Day 9).
- **M5:** Manual test checklist 100% passing + demo-ready (Day 10).

### 5.4 Success Metrics
- ≥ 70% of users complete 5+ daily check-ins.  
- < 2% message delivery failures.  
- 100% opt-out compliance.  
- 80% positive feedback on ease of use.  

### 5.5 Risks and Mitigations
| Risk | Mitigation |
|------|-------------|
| AWS access delays | Early IAM setup |
| Twilio rate limits | Use Messaging Service for scaling |
| Low digital literacy | Provide onboarding print materials |
| Language gaps | Phase 2 bilingual support |

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
