# **2. Requirements**

## **Functional**

1.  **FR1 (Sign-in with Google)**: The system shall provide a `/login` page that prominently features a "Sign in with Google" button.
2.  **FR2 (OAuth Flow)**: Clicking the "Sign in with Google" button shall initiate the Google OAuth 2.0 flow. Upon successful authentication, Google will redirect the user back to a specified callback URL within our application.
3.  **FR3 (Backend Callback & Session)**: The backend shall implement an endpoint to handle the Google OAuth callback, create a new user in the database if one does not exist, and issue a session JWT to the frontend.
4.  **FR4 (Protected Routes)**: The system shall protect the `/daily-ritual` route. If an unauthenticated user attempts to access it, they must be redirected to the `/login` page.
5.  **FR5 (Logout)**: An authenticated user shall have a mechanism to log out, which invalidates their session on the client and redirects them to the `/login` page.
6.  **FR6 (Schema Update)**: The `users` table schema shall be updated to support Google OAuth. The `password` field will be made nullable, and new fields for `email` and `googleId` will be added.

## **Technical Debt / Refactoring**

* **TD1 (Twilio Deferral)**: All active Twilio-related API endpoints and production dependencies shall be deactivated to prevent conflicts, while preserving the underlying code in the repository for potential future use.

## **Non-Functional**

1.  **NFR1 (Responsive UI)**: The authentication pages must be fully responsive and usable across mobile, tablet, and desktop devices.
2.  **NFR2 (Token Security)**: The session token (JWT) must be stored in a way that protects it from cross-site scripting (XSS) attacks.
3.  **NFR3 (No Regressions)**: The Twilio deactivation effort (TD1) must not introduce any functional or visual regressions to the existing PWA.
4.  **NFR4 (Global State)**: The user's authentication status and profile information must be managed in a global client-side state.
5.  **NFR5 (Performance)**: The end-to-end Google OAuth login flow, from button click to user redirection, shall complete in under 3 seconds on a standard broadband connection.
6.  **NFR6 (Reliability)**: If the Google authentication service is unavailable, the login page shall display a user-friendly error message.

## **Compatibility Requirements**

1.  **CR1**: The Express.js backend must be extended with new endpoints to handle the server-side Google OAuth 2.0 flow.
2.  **CR2**: A Drizzle Kit migration must be created to safely modify the `users` table schema.
3.  **CR3**: The new `/login` page must be built using the project's existing `shadcn/ui` component library.

---
