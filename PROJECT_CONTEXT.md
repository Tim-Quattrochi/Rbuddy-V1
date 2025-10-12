
## **🪴 Next Moment —Project Brief**

Version: Draft v1  
Prepared by: Mary (Analyst, Team Fullstack)  
Date: October 2025

---

### **1\. Problem Statement**

Justice-impacted individuals in early reentry with a history of substance use often face overwhelming triggers, unstable routines, and limited support systems. Existing recovery apps are too complex, data-heavy, or inaccessible to those with limited devices, literacy, or connectivity.  
Core challenge: How might we deliver structure, encouragement, and relapse resilience *without* depending on smartphones or constant internet access?

---

### **2\. Target Users**

* Primary: Formerly incarcerated individuals in early reentry (first 6–12 months), especially those in recovery programs or probation supervision.  
* Secondary: Probation officers, case managers, and reentry coaches who support habit accountability.  
* Accessibility considerations:  
  * High phone turnover and number changes  
  * Low data availability / limited smartphone use  
  * Preference for voice or text-based interfaces

---

### **3\. MVP Goal**

Deliver a low-friction “Daily Ritual Flow” that helps users build emotional regulation, accountability, and recovery momentum using SMS or IVR (voice) — accessible from any phone, at any time.

---

### **4\. Core MVP Features (Tier 1: SMS/IVR)**

| Category | Feature | Description |
| ----- | ----- | ----- |
| Core Routine | Daily Ritual Flow | 2–5 min daily check-in via SMS or voice: “How’s your mood today?” → Reflect → Get affirmation or grounding tip. |
| Relapse Support | Rupture → Repair | Non-punitive relapse check-in flow: encourages users to report slip-ups, receive affirming messages, and reset goals. |
| Continuity | Offline First Design | Works without smartphone, app install, or data plan. Uses short codes or toll-free IVR line. |
| Engagement | Encouragement Loop | Motivational voice or SMS messages, personalized over time (“You’ve shown up 3 days in a row — small wins matter.”) |
| Coach Mode (Phase 2\) | Case managers receive weekly summaries (via web or SMS digest). |  |

---

### **5\. Success Metrics (Early Validation)**

* ≥ 60% daily ritual completion over 2 weeks  
* ≥ 70% user-reported “helped me stay grounded” rating  
* \< 10% drop-off after first week  
* Qualitative feedback: sense of support, no judgment, “easy to use”  
* Baseline comparison of relapse reporting behavior (pre/post pilot)

---

### **6\. Technical MVP Architecture**

| Layer | Component | Technology / Approach |
| ----- | ----- | ----- |
| User Interaction | SMS & IVR Flow | Twilio or Africa’s Talking API (for SMS \+ voice) |
| Flow Logic | Conversation Engine | Simple rule-based state machine (Node.js or Python Flask backend) |
| Data Storage | Minimal user profile & log | Secure SQLite / Firebase / AWS DynamoDB |
| Content Layer | Message Templates | JSON/YAML content bank for daily rituals, affirmations, repair flows |
| Admin / Coach Interface (later) | Simple dashboard | Low-code web portal (Retool or Supabase UI) |

---

### **7\. Constraints & Assumptions**

* Users may have prepaid phones or limited credit — must use toll-free or low-cost short code.  
* IVR prompts must be under 20 seconds, plain language, and emotionally warm.  
* Security: minimal identifiable data collected; anonymized IDs preferred.  
* Testing to occur with reentry nonprofits or county reentry offices.

---

### **8\. Roadmap (MVP → Validation Path)**

Phase 0 – Discovery (Current)

* Validate message tone and ritual flow through role-play or SMS prototypes  
* Test literacy and comprehension for message samples

Phase 1 – MVP (8–10 weeks)

* Launch core SMS/IVR flow (Daily Ritual \+ Rupture & Repair)  
* Pilot with 25–50 users via reentry partner org  
* Collect engagement metrics & qualitative insights

Phase 2 – Expansion

* Add weekly coach summaries  
* Introduce voice-based journaling and AI-assisted reflection  
* Explore integration with probation check-in reminders

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

## **Project: Next Moment – Tier 1 MVP (SMS/IVR Edition)**

Version: 1.0 | Date: October 2025  
Owner: Mary (Business Analyst, Team Fullstack)  
Collaborators: Product Manager, Architect, UX, Reentry Program Advisors

---

## **1\. Overview**

### **1.1 Problem Statement**

Justice-impacted individuals in early reentry with substance abuse histories often struggle with structure, emotional regulation, and relapse prevention.  
Many recovery apps require smartphones, data plans, and high digital literacy — all barriers in this population.

Next Moment provides a simple daily ritual and recalibration support through SMS or voice (IVR) to help individuals build consistency and resilience.

---

### **1.2 Objectives**

* Deliver a low-access, high-empathy digital recovery companion via text or voice.  
* Reinforce self-regulation through 2–5 minute daily rituals.  
* Reframe relapse as “rupture and repair” instead of failure.  
* Validate engagement and feasibility for low-tech user groups.

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
| Interaction Layer | SMS (Twilio, Plivo, or Africa’s Talking) \+ IVR | Dual-channel architecture |
| Logic Engine | Node.js or Python Flask rule-based conversation handler | Should support JSON-based flow definitions |
| Storage | Encrypted SQLite or Firebase Lite | Store minimal PII: user ID, phone, interaction logs |
| Security | AES-256 encryption at rest; phone \# as key | HIPAA-lite compliance |
| Deployment | Cloud (AWS or Render) | Must scale to \~500 users |
| Content Layer | JSON/YAML message bank | Easily editable by non-tech staff |
| Admin Panel | (Phase 2\) Retool/Supabase dashboard | For viewing metrics |

---

## **5\. Content Architecture Example**

`daily_ritual: calm: - "Keep going steady today — your peace helps you stay free." stressed: - "You’re not alone. One minute of breathing changes your state." tempted: - "Urges come and go. Remember your reason for starting fresh." hopeful: - "Hope grows from small wins — and you just made one." repair_flow: stress: - "Take rest tonight. Reach out tomorrow for a reset." people: - "Avoid that environment for 24 hours — call someone positive."`  
---

## **6\. User Experience Guidelines**

| Area | Principle | Implementation |
| ----- | ----- | ----- |
| Tone | Non-judgmental, peer-like, affirming | Always “we” not “you should” |
| Language | Plain, 6th-grade reading level | Tested via Flesch–Kincaid |
| Timing | Same time each day (opt-in schedule) | SMS reminders configurable |
| Voice | Warm, steady, non-clinical | Recordings by real recovery mentors |
| Accessibility | Works without data; no app install | USSD fallback optional |

---

## **7\. Privacy & Compliance**

* No clinical claims or diagnoses  
* User consents to message storage and automated communication  
* Anonymous data for analytics; opt-out at any time (“STOP”)  
* Voice data stored \<30 days unless user opts to retain for journaling

---

## **8\. Risks & Mitigations**

| Risk | Mitigation |
| ----- | ----- |
| Low engagement after first week | Personalize timing, streak encouragements |
| Triggering content or tone | Co-design message bank with peer mentors |
| Lost or changed phone number | Allow self-registration with unique code |
| Privacy concerns | Transparent disclosure; anonymized storage |
| Voice fatigue / poor IVR UX | Use human-voiced audio prompts, 20s max length |

---

## **9\. Rollout Plan**

| Phase | Milestone | Deliverable |
| ----- | ----- | ----- |
| 0 – Discovery | Validate flow with 10 participants | Prototype via Twilio Sandbox |
| 1 – MVP Build (8 weeks) | Deploy SMS/IVR flows \+ logging | Node.js backend \+ Twilio integration |
| 2 – Pilot (2–3 weeks) | Partner org test (25–50 users) | Usage \+ sentiment reports |
| 3 – Learn & Iterate | Adjust tone, timing, and repair model | V2 PRD update |
| 4 – Scale | Add coach summaries \+ web dashboard | Phase 2 build |

---

## **10\. Open Questions**

1. Should voice journaling be available at MVP stage or reserved for Phase 2?  
2. Should participants earn “streak badges” or keep the experience purely reflective?  
3. Will reentry orgs handle onboarding, or should Next Moment support self-enrollment?  
4. Should we support bilingual (English/Spanish) content at launch?

---

## **11\. Appendices**

### **Appendix A — SMS Flow Diagram (Simplified)**

       `+-------------------------+`  
        `|   Daily Reminder Sent   |`  
        `+-----------+-------------+`  
                    `|`  
                    `v`  
      `+-------------+-------------+`  
      `| How’s your mood today?    |`  
      `| (1) Calm (2) Stressed ... |`  
      `+-------------+-------------+`  
                    `|`  
                    `v`  
        `+-----------+------------+`  
        `| Send tailored response |`  
        `+-----------+------------+`  
                    `|`  
                    `v`  
        `+-----------+------------+`  
        `| Ask: “Set intention?”  |`  
        `+-----------+------------+`  
                    `|`  
                    `v`  
        `+-----------+------------+`  
        `| Store results + streak |`  
        `+------------------------+`

---

### **Appendix B — IVR Voice Prompts Sample**

* “Hi, this is Next Moment — let’s take two minutes together.”  
* “Press 1 if you’re calm, 2 if stressed, 3 if tempted, 4 if hopeful.”  
* “That’s honest — good job checking in. Remember, every day you show up, you strengthen your freedom.”

---

# **✅ Next Moment — Final MVP Brief (Tier 1 SMS/IVR Approach)**

### **Prepared by: Mary (Business Analyst)**

Date: October 2025  
For: Alex (Product Manager) – PRD & Roadmap Definition

---

## **1\. Summary**

Objective: Create a low-barrier, emotionally supportive recovery companion for justice-impacted individuals using SMS or IVR.  
Core Strategy: Deliver a “Daily Ritual Flow” habit builder \+ “Rupture and Repair” post-relapse support, accessible via any phone, without requiring data or app downloads.  
Guiding Principle: *Recovery is not linear — consistency, not perfection.*

---

## **2\. Core Problem to Solve**

Justice-impacted individuals in early reentry frequently relapse due to lack of structure and accessible daily support. Traditional digital tools are often smartphone-dependent, creating a digital divide for those with low access or literacy.

---

## **3\. Solution Vision**

* Provide Daily Ritual check-ins (2–5 min) by text or call.  
* Offer affirmations and grounding tips tied to emotional states.  
* When relapse occurs, offer a “Repair” flow—encouragement, reset planning, and reflection, not shame.  
* Design for low friction, high empathy, and human warmth through technology.

---

## **4\. Target User**

| User Type | Description | Needs |
| ----- | ----- | ----- |
| Primary: Returning citizen in recovery | Limited tech access; vulnerable to triggers | Simple daily structure, emotional grounding |
| Secondary: Case manager / reentry coach | 15–25 clients, limited check-in capacity | Lightweight engagement data (weekly summary) |

---

## **5\. Core MVP Features (Tier 1\)**

| Feature | Description | Channel |
| ----- | ----- | ----- |
| Daily Ritual Flow | 2–5 minute daily mood \+ reflection check-in | SMS \+ IVR |
| Rupture & Repair Flow | Post-relapse reset with affirming language | SMS \+ IVR |
| Encouragement Loop | Micro-messages for motivation and re-engagement | SMS |
| Basic Logging | Mood, response, streaks (anonymized) | Backend |
| Coach Summary (Phase 2\) | Weekly digest of user engagement | SMS/Web dashboard |

---

## **6\. Accessibility & Design Principles**

* Works on any mobile phone (feature or smart).  
* Uses toll-free or short code access.  
* Plain language at 6th-grade reading level.  
* Warm, peer-support tone (e.g., “You showed up today — that’s strength.”).  
* No clinical data; privacy-first approach.

---

## **7\. Success Criteria**

| Metric | Target |
| ----- | ----- |
| Daily Ritual completion | ≥ 60% |
| Retention (2 weeks) | ≥ 70% |
| “Felt supported” user sentiment | ≥ 80% positive |
| Successful SMS/IVR delivery | ≥ 95% uptime |
| Data privacy incidents | 0 |

---

## **8\. Validation Path**

1. Prototype SMS & IVR flows (Twilio sandbox).  
2. Pilot test with 25–50 reentry participants via community partner.  
3. Collect engagement and qualitative feedback.  
4. Iterate tone, timing, and content bank before scaling.

---

## **9\. Technical Guidance for Winston (Preliminary)**

* Conversation Engine: Rule-based flow handler (JSON/YAML configurable).  
* Backend: Python (Flask/FastAPI) or Node.js with Twilio integration.  
* Storage: Minimal (user ID, timestamp, response logs).  
* Deployment: Cloud (AWS, Render, or Supabase).  
* Security: End-to-end encryption; anonymized identifiers only.

---

## **10\. Next Steps**

| Phase | Owner | Deliverable |
| ----- | ----- | ----- |
| Phase 1: PRD Definition | Alex (PM) | Formal PRD with feature specs, roadmap, and success metrics |
| Phase 2: Architecture | Winston (Architect) | Technical design (Twilio API, IVR state logic, data schema) |
| Phase 3: Build & Validation | Claude Code (Dev) | MVP build, test deployment, and pilot feedback loop |

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
