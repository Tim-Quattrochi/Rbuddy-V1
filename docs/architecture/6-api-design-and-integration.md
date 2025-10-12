# **6. API Design and Integration**

* **`GET /api/auth/google`**: Initiates the Google OAuth login flow.
* **`GET /api/auth/google/callback`**: Handles the callback from Google and sets the session cookie.
* **`POST /api/auth/logout`**: Securely logs the user out.
* **`GET /api/users/me`**: A protected endpoint to retrieve the current user's profile.
* **`POST /api/repair/start`**: A new protected endpoint to initiate the "Rupture & Repair" flow.

---
