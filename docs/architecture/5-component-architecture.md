# **5. Component Architecture**

* **New Backend Components**: An `AuthService` will encapsulate Passport.js logic.
* **New Frontend Components**:
    * `useAuth()` hook (using TanStack Query) to manage global auth state.
    * `ProtectedRoute` component to guard routes.
    * `LoginPage` component for the sign-in UI.
    * `JournalInput` and `RepairFlow` components for the new features.

---
