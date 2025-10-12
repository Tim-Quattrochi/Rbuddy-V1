# Project Brief: Reentry Buddy

## Executive Summary

Reentry Buddy is a compassionate, low-barrier digital companion designed to assist justice-impacted individuals in recovery. It addresses the critical problem of relapse caused by a lack of daily structure and accessible support.

**Primary User:**  
The "Returning Citizen in Recovery"—a recently released individual who has access to a smartphone (often via the Lifeline program) and requires a simple, non-judgmental digital tool.

**Key Value Proposition:**  
- Accessibility as a Progressive Web App (PWA):  
  - App-like experience without needing an app store  
  - Works offline  
  - Sends encouraging push notifications  
- Core principle: "Repair, not failure"—compassionate support after a relapse

---

## Problem Statement

Justice-impacted individuals in early recovery face a high risk of relapse due to a lack of daily structure and accessible support. The first 6–12 months of reentry are exceptionally fragile, marked by overwhelming triggers and unstable routines.

### Key Pain Points

- **Lack of structure:** No daily routine or accountability system
- **Digital friction:** Unreliable internet access and low data plans can make traditional apps unusable
- **Psychological barriers:** Lack of trust and fear of judgment from existing clinical-toned apps

---

## Proposed Solution

Reentry Buddy provides support through an accessible Progressive Web App (PWA) that functions offline. The solution is built around these core features:

- **Google Authentication:** Simple, secure, and passwordless sign-in
- **Daily Ritual Flow (F1):** A simple, 2–5 minute daily check-in to build structure and self-awareness
- **Rupture & Repair Flow (F2):** Compassionate, non-punitive support flow for reported slip-ups
- **Journaling:** Optional feature for deeper reflection

---

## Target Users

### Primary User

- "Returning Citizen in Recovery" in the first 6–12 months of reentry, who has:
  - A history of substance use
  - Access to a smartphone with a web browser

### Secondary Users (Future Phase Features)

- Case Managers
- Reentry Coaches

---

## Goals & Success Metrics

### User Success

- Users build consistency and feel a sense of progress
- The app feels like a safe, non-judgmental space
- The tool is easy to use, even with intermittent connectivity

### Project KPIs

- **PWA Lighthouse Score:** Achieve a score of ≥ 90 across all categories
- **PWA Installation Rate:** ≥ 60% of users install the PWA to their home screen
- **Daily Engagement Rate:** ≥ 70% of users complete 5+ daily check-ins
- **Offline Functionality:** 100% of core flows work without an internet connection

---

## MVP Scope

### Core Features (Must Have)

- Google Authentication Flow
- Daily Ritual Persistence Fix (End-to-end data saving)
- Rupture & Repair Flow (PWA version)
- Journaling Feature
- Encouragement Loop (via Web Push Notifications)

### Out of Scope for MVP

- ❌ SMS/IVR-first functionality
- ❌ Native mobile app (App Store/Google Play)
- ❌ AI-driven chat
- ❌ Bilingual support

---

## Technical Considerations

### Technology Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Backend:** Express.js + TypeScript (as Vercel Serverless Functions)
- **Database:** PostgreSQL (Neon) with Drizzle ORM
- **UI Components:** shadcn/ui
- **Authentication:** Passport.js with Google OAuth 2.0
- **Platform:** Vercel

### Constraints & Assumptions

#### Constraints

- **Timeline:** 10-day focused development sprint to deliver a functional MVP for the demo
- **Cost:** Solution must operate within the free tiers of Vercel and Neon

#### Assumptions

- Target users have access to smartphones capable of running a modern web browser
- A PWA with robust offline capabilities is a sufficient solution to address the "digital friction" pain point

---

## Risks & Open Questions

### Primary Risk

- The aggressive development timeline requires ruthless prioritization and a focus on delivering the core user flow for the demo