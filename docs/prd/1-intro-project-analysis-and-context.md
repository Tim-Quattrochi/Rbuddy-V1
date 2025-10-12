# **1. Intro Project Analysis and Context**

## **Existing Project Overview**

* **Analysis Source**: IDE-based analysis of the provided `flattened-codebase.xml`.
* **Current Project State**: "Reentry Buddy" is a wellness-focused Progressive Web App (PWA) for recovery support. Its core features include daily check-ins, goal tracking, and emotional support. The current tech stack is a monorepo with a React 18 + TypeScript frontend, an Express.js backend, and a PostgreSQL database using Drizzle ORM. The last major update completed critical fixes for Story 12, making the PWA's daily ritual flow functional with JWT authentication and offline background sync.

## **Available Documentation Analysis**

* [x] Tech Stack Documentation (`docs/architecture/tech-stack.md`)
* [x] Source Tree/Architecture (`docs/architecture.md`, `memory-bank.md`)
* [x] Coding Standards (`AGENTS.md`)
* [x] API Documentation (`docs/architecture/api-design-and-integration.md`, `memory-bank.md`)
* [x] External API Documentation (`memory-bank.md` for Twilio, Neon)
* [ ] UX/UI Guidelines (`docs/front-end-spec.md` exists but is out of date)
* [x] Technical Debt Documentation (`memory-bank.md` under "Known Issues & TODOs")

## **Enhancement Scope Definition**

* **Enhancement Type**: New Feature Addition, UI/UX Overhaul
* **Enhancement Description**: Implement a full user authentication flow on the React frontend using Google OAuth, including login pages and global state management. This involves a UI/UX overhaul to create these new views and remove all obsolete code and dependencies related to the previous Twilio-based architecture.
* **Impact Assessment**: **Significant Impact**.

## **Goals and Background Context**

* **Goals**:
    * Users can securely sign up and log into the PWA using their Google account.
    * The frontend application has a consistent, modern UI for authentication.
    * The codebase is cleaned of all unused Twilio dependencies and code.
    * Authenticated state is managed globally on the client-side.
* **Background Context**: The project recently pivoted from an SMS/Twilio-based service to a PWA. While the Express backend has JWT authentication, the frontend currently lacks any user-facing login or registration capabilities. This enhancement builds the necessary UI/UX for a complete authentication flow using Google OAuth. It also addresses technical debt by removing the now-obsolete Twilio code.

---
