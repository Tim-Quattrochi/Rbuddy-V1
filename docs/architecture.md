# Next Moment Corrective & Enhancement Architecture

### **Change Log**

| Date       | Version | Description                                                          | Author              |
| :--------- | :------ | :------------------------------------------------------------------- | :------------------ |
| 2025-10-11 | 1.1     | Initial draft, refined to prioritize the corrective fix for persistence. | Winston (Architect) |

---

## **1. Introduction**

This document outlines a two-phase architectural approach. The **primary goal (Phase 1)** is to design the **corrective architecture** to fix the data persistence failure in the "Daily Ritual" feature. The **secondary goal (Phase 2)** is to detail the **enhancement architecture** for integrating new features (Authentication, Rupture & Repair, Journaling) onto that stable foundation.

### **Existing Project Analysis**

* **Current Project State**: The application is a PWA built with React 18 and an Express.js backend. Its core feature, the "Daily Ritual" flow, is currently non-functional due to a lack of end-to-end data persistence.
* **Identified Constraints**: The most critical constraint is the non-functional state of the core feature. This architecture **must prioritize the fix** before detailing new functionality.

---

## **2. Enhancement Scope and Integration Strategy**

* **Code Integration Strategy**: We will refactor and extend the existing `server/services/conversationEngine.ts` to handle PWA-specific logic, keeping all user flow intelligence in one place.
* **Database Integration**: The `users` table will be modified for OAuth. The `interactions` table will be leveraged for journaling by adding a new `contentType` of `'journal_entry'`.
* **API Integration**: Existing ritual-related endpoints will be made functional. New endpoints will be added for authentication (`/api/auth/*`), repair (`/api/repair/*`), and journaling (by adapting an existing endpoint).
* **UI Integration**: New components will be created using `shadcn/ui` and integrated with a global auth state.

---

## **3. Tech Stack**

The enhancement will use the existing tech stack. The only new dependency will be `passport-google-oauth20` to handle authentication.

---

## **4. Data Models and Schema Changes**

* **Modified Table: `users`**: The `password` column will be made `nullable`. New columns for `email`, `googleId`, and `avatar_url` will be added.
* **Modified Enum: `contentTypeEnum`**: A new value, `'journal_entry'`, will be added.
* **New Indexes**: Unique indexes will be added to `users.email` and `users.googleId` for performance.
* **Migration Strategy**: All changes will be managed through Drizzle Kit migrations.

---

## **5. Component Architecture**

* **New Backend Components**: An `AuthService` will encapsulate Passport.js logic.
* **New Frontend Components**:
    * `useAuth()` hook (using TanStack Query) to manage global auth state.
    * `ProtectedRoute` component to guard routes.
    * `LoginPage` component for the sign-in UI.
    * `JournalInput` and `RepairFlow` components for the new features.

---

## **6. API Design and Integration**

* **`GET /api/auth/google`**: Initiates the Google OAuth login flow.
* **`GET /api/auth/google/callback`**: Handles the callback from Google and sets the session cookie.
* **`POST /api/auth/logout`**: Securely logs the user out.
* **`GET /api/users/me`**: A protected endpoint to retrieve the current user's profile.
* **`POST /api/repair/start`**: A new protected endpoint to initiate the "Rupture & Repair" flow.

---

## **7. External API Integration**

* **Google Identity (OAuth 2.0) API**: This is the primary new external dependency. Integration will be managed server-side via `passport-google-oauth20`. `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` must be configured.

---

## **8. Source Tree**

New files will be organized into existing and new feature-specific folders, such as `api/auth/`, `client/src/hooks/`, and `client/src/components/repair/`.

---

## **9. Infrastructure and Deployment Integration**

The project will continue to use the existing Vercel CI/CD pipeline. New environment variables for Google OAuth will be added. Rollback will be handled via Vercel's instant rollback feature.

---

## **10. Coding Standards, Testing, and Security**

All new code must adhere to existing standards for linting, formatting, testing (Vitest), and security. Key security requirements include using `HttpOnly` cookies, protecting against CSRF, and validating all inputs.