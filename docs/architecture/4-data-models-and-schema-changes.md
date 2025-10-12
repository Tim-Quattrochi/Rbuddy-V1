# **4. Data Models and Schema Changes**

* **Modified Table: `users`**: The `password` column will be made `nullable`. New columns for `email`, `googleId`, and `avatar_url` will be added.
* **Modified Enum: `contentTypeEnum`**: A new value, `'journal_entry'`, will be added.
* **New Indexes**: Unique indexes will be added to `users.email` and `users.googleId` for performance.
* **Migration Strategy**: All changes will be managed through Drizzle Kit migrations.

---
