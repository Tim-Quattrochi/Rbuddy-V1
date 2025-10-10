# Project Brief: Reentry Buddy

## Executive Summary

Reentry Buddy is a compassionate, low-barrier digital companion designed to assist justice-impacted individuals in recovery. It addresses the critical problem of relapse caused by a lack of daily structure and accessible support, a challenge often magnified by digital inequity. 

The primary user is the **"Returning Citizen in Recovery"**—a recently released individual who typically relies on a basic mobile phone and requires simple, non-judgmental guidance. 

Reentry Buddy's key value proposition is its unparalleled accessibility, functioning on any phone via SMS or voice (IVR) without needing a data plan or app. This is combined with a core principle of **"Repair, not failure"** to provide compassionate, shame-free support after a relapse, promoting psychological safety and sustained recovery.

## Problem Statement

Justice-impacted individuals in early recovery face a high risk of relapse due to a critical lack of daily structure and accessible support, a problem significantly worsened by profound digital inequity. 

The first 6–12 months of reentry are exceptionally fragile, marked by overwhelming triggers and unstable routines. 

### Key Pain Points

- **Lack of structure**: No daily routine or accountability system
- **Digital isolation**: Limited to basic phones without data plans or apps
- **Psychological barriers**: Lack of trust and fear of judgment from existing clinical-toned apps

## Proposed Solution

Reentry Buddy provides support exclusively through universally accessible SMS (text messaging) and IVR (voice calls). The solution is built around two key features:

1. **The Daily Ritual Flow (F1)**: A simple, 2-5 minute daily check-in to build structure and self-awareness
2. **The Rupture & Repair Flow (F2)**: A compassionate, non-punitive support flow for reported slip-ups

## Target Users

### Primary User
The **"Returning Citizen in Recovery"** in the first 6–12 months of reentry, who has:
- A history of substance use
- Significant digital and social barriers
- Access only to basic mobile phones

### Secondary Users
*(Targeted for future phase features)*
- Case Managers
- Reentry Coaches
- Probation Officers

## Goals & Success Metrics

### User Success
- Users build consistency
- Achieve emotional grounding
- Feel safe to report setbacks
- Find the tool easy to use

### Project KPIs
- **≥ 60%** daily engagement rate
- **< 10%** user drop-off after one week
- Positive qualitative feedback confirming ease of use and non-judgmental support

## MVP Scope

### Core Features (Must Have)

1. **The Daily Ritual Flow (F1)**
2. **The Rupture & Repair Flow (F2)**
3. **The Encouragement Loop (F3)**
4. **Basic Logging (F4)**
5. **The Investor Demo UI**: A simple web dashboard to visually demonstrate the SMS/IVR interactions in real-time
   - Includes a "Click-to-Call" feature to programmatically initiate a demo call to a user's phone

### Out of Scope for MVP

- ❌ Mobile app, web app for end-users, or case management dashboard
- ❌ AI-driven chat
- ❌ Voice journaling
- ❌ Bilingual support
- ❌ Gamification

## Post-MVP Vision

Future phases will focus on:
- **"Coach Mode"** for case managers
- Bilingual support
- Voice journaling
- Full-featured web and mobile application
- Advanced AI capabilities

## Technical Considerations

### Technology Stack

- **Messaging & Voice Platform**: Twilio (recommended)
- **Backend**: Python with Django framework (recommended)
- **Frontend (Demo UI)**: Next.js (React) (recommended)
- **Architecture**: Monorepo structure containing:
  - Monolithic Django backend
  - Separate Next.js frontend
- **Local Development**: ngrok for local testing of Twilio webhooks

## Constraints & Assumptions

### Constraints

- **Timeline**: Hard deadline set for **Friday, October 17, 2025**
  - Demo must be deployed and functional by this date
- **Cost**: Solution must operate within free tiers of selected cloud services (e.g., Vercel, AWS)

### Assumptions

- Core value can be validated via SMS/IVR alone
- Multi-platform architecture (Vercel + AWS) will be used

## Risks & Open Questions

### Primary Risk
The aggressive **8-day timeline** requires:
- Ruthless prioritization
- Focus on a "demo-ready" product over a production-hardened one
- Potential trade-offs in feature completeness vs. deadline adherence
