# Next Moment Brownfield Enhancement PRD

### **Change Log**

| Date       | Version | Description                                                                | Author    |
| :--------- | :------ | :------------------------------------------------------------------------- | :-------- |
| 2025-10-11 | 1.0     | Initial draft for Google OAuth feature and Twilio removal.                 | John (PM) |
| 2025-10-11 | 1.1     | Added NFRs for performance and reliability based on checklist validation. | John (PM) |

---

## **1. Intro Project Analysis and Context**

### **Existing Project Overview**

* **Analysis Source**: IDE-based analysis of the provided `flattened-codebase.xml`.
* **Current Project State**: "Next Moment" is a wellness-focused Progressive Web App (PWA) for recovery support. Its core features include daily check-ins, goal tracking, and emotional support. The current tech stack is a monorepo with a React 18 + TypeScript frontend, an Express.js backend, and a PostgreSQL database using Drizzle ORM. The last major update completed critical fixes for Story 12, making the PWA's daily ritual flow functional with JWT authentication and offline background sync.

### **Available Documentation Analysis**

* [x] Tech Stack Documentation (`docs/architecture/tech-stack.md`)
* [x] Source Tree/Architecture (`docs/architecture.md`, `memory-bank.md`)
* [x] Coding Standards (`AGENTS.md`)
* [x] API Documentation (`docs/architecture/api-design-and-integration.md`, `memory-bank.md`)
* [x] External API Documentation (`memory-bank.md` for Twilio, Neon)
* [ ] UX/UI Guidelines (`docs/front-end-spec.md` exists but is out of date)
* [x] Technical Debt Documentation (`memory-bank.md` under "Known Issues & TODOs")

### **Enhancement Scope Definition**

* **Enhancement Type**: New Feature Addition, UI/UX Overhaul
* **Enhancement Description**: Implement a full user authentication flow on the React frontend using Google OAuth, including login pages and global state management. This involves a UI/UX overhaul to create these new views and remove all obsolete code and dependencies related to the previous Twilio-based architecture.
* **Impact Assessment**: **Significant Impact**.

### **Goals and Background Context**

* **Goals**:
    * Users can securely sign up and log into the PWA using their Google account.
    * The frontend application has a consistent, modern UI for authentication.
    * The codebase is cleaned of all unused Twilio dependencies and code.
    * Authenticated state is managed globally on the client-side.
* **Background Context**: The project recently pivoted from an SMS/Twilio-based service to a PWA. While the Express backend has JWT authentication, the frontend currently lacks any user-facing login or registration capabilities. This enhancement builds the necessary UI/UX for a complete authentication flow using Google OAuth. It also addresses technical debt by removing the now-obsolete Twilio code.

---

## **2. Requirements**

### **Functional**

1.  **FR1 (Sign-in with Google)**: The system shall provide a `/login` page that prominently features a "Sign in with Google" button.
2.  **FR2 (OAuth Flow)**: Clicking the "Sign in with Google" button shall initiate the Google OAuth 2.0 flow. Upon successful authentication, Google will redirect the user back to a specified callback URL within our application.
3.  **FR3 (Backend Callback & Session)**: The backend shall implement an endpoint to handle the Google OAuth callback, create a new user in the database if one does not exist, and issue a session JWT to the frontend.
4.  **FR4 (Protected Routes)**: The system shall protect the `/daily-ritual` route. If an unauthenticated user attempts to access it, they must be redirected to the `/login` page.
5.  **FR5 (Logout)**: An authenticated user shall have a mechanism to log out, which invalidates their session on the client and redirects them to the `/login` page.
6.  **FR6 (Schema Update)**: The `users` table schema shall be updated to support Google OAuth. The `password` field will be made nullable, and new fields for `email` and `googleId` will be added.

### **Technical Debt / Refactoring**

* **TD1 (Twilio Deferral)**: All active Twilio-related API endpoints and production dependencies shall be deactivated to prevent conflicts, while preserving the underlying code in the repository for potential future use.

### **Non-Functional**

1.  **NFR1 (Responsive UI)**: The authentication pages must be fully responsive and usable across mobile, tablet, and desktop devices.
2.  **NFR2 (Token Security)**: The session token (JWT) must be stored in a way that protects it from cross-site scripting (XSS) attacks.
3.  **NFR3 (No Regressions)**: The Twilio deactivation effort (TD1) must not introduce any functional or visual regressions to the existing PWA.
4.  **NFR4 (Global State)**: The user's authentication status and profile information must be managed in a global client-side state.
5.  **NFR5 (Performance)**: The end-to-end Google OAuth login flow, from button click to user redirection, shall complete in under 3 seconds on a standard broadband connection.
6.  **NFR6 (Reliability)**: If the Google authentication service is unavailable, the login page shall display a user-friendly error message.

### **Compatibility Requirements**

1.  **CR1**: The Express.js backend must be extended with new endpoints to handle the server-side Google OAuth 2.0 flow.
2.  **CR2**: A Drizzle Kit migration must be created to safely modify the `users` table schema.
3.  **CR3**: The new `/login` page must be built using the project's existing `shadcn/ui` component library.

---

## **3. Epic and Story Structure**

### **Epic 1: Implement Frontend Google Authentication**
* **Story 1.1**: Update Database Schema for OAuth.
* **Story 1.2**: Implement Backend Google OAuth Callback.
* **Story 1.3**: Build Frontend Login UI & Initiate Flow.
* **Story 1.4**: Implement Protected Routes and Logout.

### **Epic 2 (Revised): Deactivate and Defer Twilio Functionality**
* **Story 2.1**: Safely Deactivate Twilio Endpoints and Dependencies.

### **Epic 3: Implement Daily Ritual Persistence**
* **Story 3.1**: Fix End-to-End Daily Ritual Persistence.

### **Epic 4: Implement PWA Rupture & Repair Flow**
* **Story 4.1**: Implement PWA Rupture & Repair Flow (BLOCKED - Content Validation)
* **Story 4.1A**: AI-Powered Repair Suggestions (Backend)
* **Story 4.1B**: AI-Powered Repair Suggestions (Frontend)
* **Story 4.2**: Improve Repair Flow Accessibility (Done)
* **Story 4.3**: Implement App Navigation (Done)

### **Epic 5: Implement Journaling Feature**
* **Story 5.1**: Implement Journaling Feature.