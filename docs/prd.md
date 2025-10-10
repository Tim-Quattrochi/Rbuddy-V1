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

### 2.1 In Scope (Tier 1 MVP)
| Feature | Description | Priority |
|----------|--------------|----------|
| **F1 – Daily Ritual Flow** | 2–5 min check-in via SMS/IVR capturing mood → affirmation → optional intention. | P0 |
| **F2 – Rupture & Repair Flow** | “SLIP” keyword triggers compassionate relapse reset with repair suggestions. | P0 |
| **F3 – Encouragement Loop** | Automated motivational messages for inactivity or streak milestones. | P1 |
| **F4 – User State Logging** | Anonymous session storage for mood, triggers, and streaks. | P1 |
| **F5 – Coach Summary (Phase 2)** | Weekly aggregate summaries for partner coaches. | P2 |
| **F6 – Language & Accessibility Layer** | English-first; bilingual (EN/ES) expansion framework. | P2 |

### 2.2 Out of Scope
- Smartphone or web app.
- AI chatbot or adaptive recommendation engine.
- Clinical data integration (EHR).
- Long-form journaling or audio storage.
- Case-management dashboard (beyond pilot summary view).

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

### 4.1 Core Architecture
- **Interface:** SMS + IVR via Twilio Programmable Messaging and Voice.  
- **Backend:** FastAPI (Python) + AWS Lambda (serverless).  
- **Data Store:** DynamoDB (encrypted, TTL cleanup).  
- **Storage:** S3 for optional voice recordings (short-term).  
- **Monitoring:** CloudWatch / Datadog for error tracking.  
- **Security:** TLS, AES-256 encryption, and Twilio signature validation.

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

### 5.2 Sprint Plan (10 Weeks)

| Sprint | Duration | Focus | Deliverables |
|--------|-----------|-------|--------------|
| **Sprint 0** | 1 week | Environment setup | Repo, CI/CD, Twilio sandbox, infra config |
| **Sprint 1** | 2 weeks | Core SMS flow | Daily Ritual FSM, database logging |
| **Sprint 2** | 2 weeks | IVR + Repair flow | Voice DTMF, SLIP flow, follow-up |
| **Sprint 3** | 2 weeks | Metrics + monitoring | Admin dashboard, alerts |
| **Sprint 4** | 2 weeks | QA + pilot readiness | Testing, content QA, review |
| **Sprint 5** | 1 week | Pilot launch | Live test with 25–50 users |

### 5.3 Milestones
- **M1:** SMS flow functional (sandbox).  
- **M2:** IVR end-to-end call flow verified.  
- **M3:** Secure DynamoDB operational.  
- **M4:** QA passed (≥90% success).  
- **M5:** Pilot launch complete.

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
