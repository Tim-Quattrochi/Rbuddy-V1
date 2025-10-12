---
name: "Reentry Buddy Project"
description: "A comprehensive development guide for Reentry Buddy - a wellness-focused full-stack application for recovery support, based on React 18 + TypeScript + Express + PostgreSQL, including complete development standards and best practices tailored to this workspace's actual structure."
---

# Reentry Buddy Project Development Guide

## Project Overview

Reentry Buddy is a wellness-focused full-stack application designed to support individuals in recovery. It provides daily check-ins, goal tracking, journaling, and emotional support features with a calming, accessible design system focused on trust and emotional safety.

## Tech Stack

- **Frontend Framework**: **React 18.3.1** + TypeScript (a future upgrade to React 19 is planned)
- **Build Tool**: Vite
- **Backend Framework**: Express.js + TypeScript (deployed as Vercel Serverless Functions)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Authentication**: **Passport.js with Google OAuth 2.0 strategy**
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier + TypeScript

## Project Structure

rBuddy-v1/
├── api/                    # Vercel Serverless Functions (Backend Routes)
│   └── auth/
│       ├── google/
│       │   └── index.ts      # Handles initial redirect
│       └── google.callback.ts  # Handles the callback
│       └── logout.ts         # Handles logout
├── client/                 # Frontend React application
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── daily-ritual/
│       │   └── ui/
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── lib/
│       ├── pages/
│       │   ├── DailyRitual.tsx
│       │   ├── Landing.tsx
│       │   └── Login.tsx
│       └── App.tsx
├── server/                 # Shared backend logic/services
│   ├── services/
│   │   ├── AuthService.ts
│   │   └── conversationEngine.ts
│   └── storage.ts
├── shared/                 # Shared types and schemas
│   └── schema.ts
├── docs/                   # Project documentation (PRD, Architecture, etc.)
├── .env.example
└── package.json


## Development Guidelines

### API Service Standards

The backend uses Vercel Serverless Functions. New API routes are defined in the `api/` directory.

```typescript
// Example: api/users/me.ts
import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';

async function handler(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;
  // ... logic to fetch user by ID
  return res.status(200).json({ user });
}

export default [requireAuth, handler];


rbuddy consultant
Custom Gem

Show thinking
Of course. I've updated your AGENTS.MD file to reflect all the recent architectural decisions we've made and to align with the actual state of your codebase.

Here is the complete, updated content for your AGENTS.MD file.

Markdown

---
name: "Reentry Buddy Project"
description: "A comprehensive development guide for Reentry Buddy - a wellness-focused full-stack application for recovery support, based on React 18 + TypeScript + Express + PostgreSQL, including complete development standards and best practices tailored to this workspace's actual structure."
---

# Reentry Buddy Project Development Guide

## Project Overview

Reentry Buddy is a wellness-focused full-stack application designed to support individuals in recovery. It provides daily check-ins, goal tracking, journaling, and emotional support features with a calming, accessible design system focused on trust and emotional safety.

## Tech Stack

- **Frontend Framework**: **React 18.3.1** + TypeScript (a future upgrade to React 19 is planned)
- **Build Tool**: Vite
- **Backend Framework**: Express.js + TypeScript (deployed as Vercel Serverless Functions)
- **Database**: PostgreSQL with Drizzle ORM
- **State Management**: TanStack Query (React Query)
- **UI Components**: shadcn/ui with Radix UI primitives
- **Styling**: Tailwind CSS
- **Authentication**: **Passport.js with Google OAuth 2.0 strategy**
- **Icons**: Lucide React
- **Code Quality**: ESLint + Prettier + TypeScript

## Project Structure

rBuddy-v1/
├── api/                    # Vercel Serverless Functions (Backend Routes)
│   └── auth/
│       ├── google/
│       │   └── index.ts      # Handles initial redirect
│       └── google.callback.ts  # Handles the callback
│       └── logout.ts         # Handles logout
├── client/                 # Frontend React application
│   └── src/
│       ├── components/
│       │   ├── auth/
│       │   ├── daily-ritual/
│       │   └── ui/
│       ├── hooks/
│       │   └── useAuth.ts
│       ├── lib/
│       ├── pages/
│       │   ├── DailyRitual.tsx
│       │   ├── Landing.tsx
│       │   └── Login.tsx
│       └── App.tsx
├── server/                 # Shared backend logic/services
│   ├── services/
│   │   ├── AuthService.ts
│   │   └── conversationEngine.ts
│   └── storage.ts
├── shared/                 # Shared types and schemas
│   └── schema.ts
├── docs/                   # Project documentation (PRD, Architecture, etc.)
├── .env.example
└── package.json


## Development Guidelines

### API Service Standards

The backend uses Vercel Serverless Functions. New API routes are defined in the `api/` directory.

```bash
// Example: api/users/me.ts
import { Response } from 'express';
import { requireAuth, AuthenticatedRequest } from '../../server/middleware/auth';

async function handler(req: AuthenticatedRequest, res: Response) {
  const userId = req.userId!;
  // ... logic to fetch user by ID
  return res.status(200).json({ user });
}

export default [requireAuth, handler];
Environment Setup
Environment Variables Configuration
Your .env file should contain the following variables:

# .env.example
DATABASE_URL="postgresql://user:password@host:port/db"
NODE_ENV="development"
PORT="5001"

# Authentication
JWT_SECRET="your-super-secret-jwt-key"
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"
```

### ROUTING CONFIGURATION
```tsx
// client/src/App.tsx
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "@/pages/Landing";
import Login from "@/pages/Login";
import DailyRitual from "@/pages/DailyRitual";
import ProtectedRoute from "@/components/auth/ProtectedRoute"; // Example component

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/daily-ritual" 
          element={
            <ProtectedRoute>
              <DailyRitual />
            </ProtectedRoute>
          } 
        />
        {/* Other routes */}
      </Routes>
    </BrowserRouter>
  );
}
```

### DATABASE SCHEMA
```ts
// shared/schema.ts (Excerpt)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").notNull().unique(),
  googleId: varchar("google_id").unique(),
  avatar_url: text("avatar_url"),
  password: text("password"), // Nullable to support OAuth-only users
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  flowType: flowTypeEnum("flow_type").notNull(),
  // ... other columns
});
```

### Common Issues
Issue 1: Database Connection Errors
Solution:

Verify DATABASE_URL environment variable is correctly set.

Ensure your Neon/PostgreSQL database is active and accessible.

Run npm run db:push to sync your schema after any changes in shared/schema.ts.

Issue 2: Google OAuth Errors (e.g., redirect_uri_mismatch)
Solution:

Ensure the redirect URI in your Google Cloud Console exactly matches the one your backend is configured to use (e.g., http://localhost:5001/api/auth/google/callback).

Verify your GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET environment variables are correct.

---

### **Summary of Key Updates**

* **Tech Stack**: Corrected the React version to `18.3.1` and updated the Authentication strategy to **Google OAuth 2.0**.
* **Project Structure**: The diagram has been updated to reflect the actual Vercel serverless layout (`api/` directory) and the new component/page structure we designed.
* **API & Routing**: Examples now show the correct API patterns (serverless functions) and the planned frontend routes (`/login`, `/daily-ritual`).
* **Database Schema**: The example now shows the refined `users` table that supports Google OAuth by making the `password` nullable and adding `email` and `googleId`.
* **Environment Variables**: Added the necessary `JWT_SECRET` and Google OAuth variables to the configuration example.