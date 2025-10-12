# **2. Enhancement Scope and Integration Strategy**

* **Code Integration Strategy**: We will refactor and extend the existing `server/services/conversationEngine.ts` to handle PWA-specific logic, keeping all user flow intelligence in one place.
* **Database Integration**: The `users` table will be modified for OAuth. The `interactions` table will be leveraged for journaling by adding a new `contentType` of `'journal_entry'`.
* **API Integration**: Existing ritual-related endpoints will be made functional. New endpoints will be added for authentication (`/api/auth/*`), repair (`/api/repair/*`), and journaling (by adapting an existing endpoint).
* **UI Integration**: New components will be created using `shadcn/ui` and integrated with a global auth state.

---
