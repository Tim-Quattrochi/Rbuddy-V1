# **6. API Design and Integration**

## API Architecture Overview

**CRITICAL: This project uses a dual-export pattern for Vercel serverless deployment.**

### Deployment Architecture

**Local Development:**
- Express server runs on port 5001 (`api/index.ts`)
- Routes registered in `server/routes.ts` import `middlewares` export
- All API endpoints work through Express middleware chains

**Production (Vercel):**
- Each file in `api/` directory becomes an independent serverless function
- Vercel automatically routes `/api/*` requests to corresponding files
- Each endpoint exports `default` handler wrapped by `createVercelHandler`

### Dual-Export Pattern

Every API endpoint must have TWO exports:

```typescript
// Named export for Express (local dev)
export const middlewares = [requireAuth, handler];

// Default export for Vercel (production)
export default createVercelHandler(middlewares);
```

**See:** [`docs/vercel-deployment.md`](../vercel-deployment.md) for complete implementation guide.

---

## API Endpoints

### Authentication Endpoints

* **`GET /api/auth/google`**: Initiates the Google OAuth login flow.
  - **File**: `api/auth/google.ts`
  - **Middleware**: None (public)
  - **Response**: Redirects to Google OAuth consent screen

* **`GET /api/auth/google/callback`**: Handles the callback from Google and sets the session cookie.
  - **File**: `api/auth/google/callback.ts`
  - **Middleware**: None (OAuth callback)
  - **Response**: Sets auth cookie, redirects to `/daily-ritual`

* **`POST /api/auth/logout`**: Securely logs the user out.
  - **File**: `api/auth/logout.ts`
  - **Middleware**: `requireAuth`
  - **Response**: Clears auth cookie, returns success

### User Endpoints

* **`GET /api/users/me`**: Retrieves the current user's profile.
  - **File**: `api/users/[action].ts`
  - **Middleware**: `requireAuth`
  - **Response**: User object (email, id, etc.)

### Daily Ritual Endpoints

* **`POST /api/daily-ritual/mood`**: Saves user's mood selection.
  - **File**: `api/daily-ritual/[action].ts`
  - **Middleware**: `requireAuth`
  - **Request Body**: `{ mood: string }`
  - **Response**: Confirmation with interaction ID

* **`POST /api/daily-ritual/intention`**: Saves user's intention or journal entry.
  - **File**: `api/daily-ritual/[action].ts`
  - **Middleware**: `requireAuth`
  - **Request Body**: `{ intention: string, type?: 'intention' | 'journal_entry' }`
  - **Response**: Confirmation with interaction ID

### Repair Endpoints

* **`POST /api/repair/start`**: Initiates the "Rupture & Repair" flow.
  - **File**: `api/repair/start.ts`
  - **Middleware**: `requireAuth`
  - **Request Body**: `{ trigger: string, context?: string }`
  - **Response**: Repair session details

### Journal Endpoints

* **`GET /api/journal/history`**: Retrieves user's journal entries with pagination.
  - **File**: `api/journal/history.ts`
  - **Middleware**: `requireAuth`
  - **Query Params**: `limit` (default: 20, max: 100), `offset` (default: 0)
  - **Response**: Array of journal entries with pagination metadata

### Chat Endpoints

* **`POST /api/chat/send`**: Sends a message to AI chat.
  - **File**: `api/chat/[action].ts`
  - **Middleware**: `requireAuth`, `chatSendLimiter` (20 msg/hour)
  - **Request Body**: `{ message: string, conversationId?: string }`
  - **Response**: AI response with conversation ID
  - **Rate Limit**: 20 messages per hour per user

* **`GET /api/chat/history`**: Retrieves chat conversation history.
  - **File**: `api/chat/[action].ts`
  - **Middleware**: `requireAuth`, `chatGeneralLimiter` (100 req/hour)
  - **Query Params**: `limit` (default: 20, max: 100), `conversationId?: string`
  - **Response**: Array of chat messages

* **`DELETE /api/chat/clear`**: Clears chat conversation history.
  - **File**: `api/chat/[action].ts`
  - **Middleware**: `requireAuth`, `chatGeneralLimiter` (100 req/hour)
  - **Query Params**: `conversationId?: string`
  - **Response**: Success confirmation

---

## Security & Rate Limiting

### Authentication
All protected endpoints use `requireAuth` middleware which:
- Validates JWT token from `auth_token` cookie
- Sets `req.userId` for authenticated requests
- Returns 401 for invalid/missing tokens

### Rate Limiting
Chat endpoints implement rate limiting (added October 2025):
- **Send messages**: 20 per hour per user
- **History/Clear**: 100 per hour per user
- Uses `express-rate-limit` with user-specific key generation
- Returns 429 status with retry-after headers when limit exceeded

**See:** [`docs/CRITICAL_FIXES.md`](../CRITICAL_FIXES.md) for security improvements.

---

## Error Handling

All endpoints follow consistent error response format:

```json
{
  "error": "Human-readable error message",
  "code": "ERROR_CODE" // Optional
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (validation error)
- `401` - Unauthorized (authentication required)
- `429` - Too Many Requests (rate limit exceeded)
- `500` - Internal Server Error

---
