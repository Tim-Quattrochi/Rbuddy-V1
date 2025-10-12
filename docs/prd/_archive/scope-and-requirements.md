# 2. Scope and Requirements

## 2.1 In Scope (Tier 1 MVP)
| Feature | Description | Priority |
|----------|--------------|----------|
| **F1 – Daily Ritual Flow** | 2–5 min check-in via SMS/IVR capturing mood → affirmation → optional intention. | P0 |
| **F2 – Rupture & Repair Flow** | "SLIP" keyword triggers compassionate relapse reset with repair suggestions. | P0 |
| **F3 – Encouragement Loop** | Automated motivational messages for inactivity or streak milestones. | P1 |
| **F4 – User State Logging** | Anonymous session storage for mood, triggers, and streaks. | P1 |
| **F5 – Coach Summary (Phase 2)** | Weekly aggregate summaries for partner coaches. | P2 |
| **F6 – Language & Accessibility Layer** | English-first; bilingual (EN/ES) expansion framework. | P2 |

## 2.2 Out of Scope
- Smartphone or web app.
- AI chatbot or adaptive recommendation engine.
- Clinical data integration (EHR).
- Long-form journaling or audio storage.
- Case-management dashboard (beyond pilot summary view).

## 2.3 Primary Actor: Returning Citizen in Recovery
A justice-impacted individual within 12 months of release, working through substance use recovery using a basic phone.
They need simple, supportive routines without judgment or technical friction.

## 2.4 Key Use Cases
### UC-1: Daily Check-In (Ritual Flow)
**Goal:** Build consistent grounding habit.
**Trigger:** Automated SMS/call.
**Flow:** Mood prompt → affirmation → optional intention → log completion.

### UC-2: Rupture → Repair
**Goal:** Provide safe reset after relapse ("SLIP").
**Trigger:** User texts "SLIP" or presses repair option.
**Flow:** Empathetic message → identify trigger → repair suggestion → follow-up.

### UC-3: Encouragement Loop
**Goal:** Maintain motivation between check-ins.
**Trigger:** Inactivity or streak milestone.
**Flow:** Contextual message → link back to ritual.

### UC-4: Partner Summary (Phase 2)
**Goal:** Aggregate non-identifiable usage for coaches.
**Flow:** Pull engagement stats weekly → deliver via SMS or dashboard snapshot.

## 2.5 Boundaries and Design Intent
| Boundary | Design Intent |
|-----------|----------------|
| Technical simplicity | Operates on basic SMS and IVR (no app needed). |
| User data privacy | No PII; anonymized identifiers only. |
| Tone & branding | User-facing: *Next Moment* (friendly), Institutional: *Reentry Companion* (formal). |
| Trauma-informed design | Supportive, non-judgmental, plain language. |
| Engagement model | Encouragement over gamification. |

## 2.6 Success Criteria
- ≥ 90% of pilot users complete a check-in without assistance.
- ≤ 10-second response latency for SMS/IVR.
- ≥ 70% positive tone/ease-of-use feedback.
- Stable Twilio sandbox for ≤ 50 simultaneous users.
