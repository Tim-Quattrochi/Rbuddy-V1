# Reentry Buddy Brownfield Enhancement Architecture

**Version:** 1.0
**Date:** October 10, 2025
**Status:** 🚨 URGENT - 8-Day Deadline (October 17, 2025)

---

## Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| Oct 10, 2025 | 1.0 | Initial brownfield architecture for SMS/IVR pivot | Winston (Architect) |

---

## Introduction

This document outlines the architectural approach for transforming **Reentry Buddy** from a web-based wellness application into an SMS/IVR-first recovery support system for justice-impacted individuals.

### Critical Context

- **Existing System**: React + Express + PostgreSQL web application for wellness check-ins
- **Enhancement**: Pivot to SMS/IVR accessibility (Twilio integration)
- **Timeline**: **8 days** (hard deadline: October 17, 2025)
- **Deployment**: Vercel (free tier)
- **Strategy**: Brownfield enhancement leveraging existing codebase

### Document Scope

This architecture focuses on:
1. Adapting existing Express.js backend for Twilio webhooks
2. Extending PostgreSQL schema for SMS/IVR interactions
3. Building investor demo UI using existing React components
4. Deploying to Vercel serverless platform

### Relationship to Existing Architecture

This document **extends** the existing web application architecture by:
- Adding Twilio SMS/IVR capabilities alongside (not replacing) web UI
- Reusing database models and business logic where possible
- Maintaining investor demo UI using existing React codebase
- Converting Express routes to Vercel serverless functions

---

## Quick Reference - Key Files and Entry Points

### Critical Files for Understanding the System

**Existing System:**
- **Frontend Entry**: `client/src/main.tsx` → `client/src/App.tsx`
- **Backend Entry**: `server/index.ts`
- **Database Schema**: `shared/schema.ts` (Drizzle ORM)
- **Existing Routes**: `server/routes.ts`
- **UI Components**: `client/src/components/ui/` (shadcn/ui)

**New Files for SMS/IVR Pivot:**
- **Twilio Webhooks**: `api/webhooks/twilio/sms.ts`, `api/webhooks/twilio/voice.ts` (to be created)
- **Conversation Engine**: `server/services/conversationEngine.ts` (to be created)
- **Message Templates**: `server/data/messageTemplates.json` (to be created)
- **Dashboard API**: `api/dashboard/metrics.ts` (to be created)

### Enhancement Impact Areas

| Component | Impact | Files Affected |
|-----------|--------|----------------|
| **Backend** | 🔴 Major | Convert Express → Vercel API routes |
| **Database** | 🟡 Medium | Extend schema for SMS logs, sessions |
| **Frontend** | 🟢 Minor | Add dashboard components for demo |
| **Deployment** | 🔴 Major | New Vercel configuration |

---

## Existing Project Analysis

### Current Project State

- **Primary Purpose**: Wellness-focused full-stack web application for recovery support (daily check-ins, journaling)
- **Current Tech Stack**:
  - Frontend: React 19 + TypeScript + Vite
  - Backend: Express.js + TypeScript
  - Database: PostgreSQL + Drizzle ORM
  - UI: shadcn/ui + Tailwind CSS
  - State: TanStack Query (React Query)
- **Architecture Style**: Monorepo (client/server/shared)
- **Deployment Method**: Unknown (likely development only)

### Available Documentation

- ✅ `AGENTS.md` - Development guide with tech stack and standards
- ✅ `docs/prd.md` - Product Requirements Document (SMS/IVR pivot)
- ✅ `docs/project-brief.md` - Project overview and goals
- ✅ `PROJECT_CONTEXT.md` - Detailed context (contains duplicate PRD)
- ✅ `.env.example` - Environment variable template
- ⚠️ No existing architecture documentation
- ⚠️ No API documentation
- ⚠️ No deployment documentation

### Identified Constraints

- **Timeline**: 8 days to deploy demo (October 17, 2025)
- **Budget**: Must use free tiers (Vercel, Neon PostgreSQL, Twilio trial)
- **Existing Codebase**: React/Express system designed for web, not SMS/IVR
- **Technology Mismatch**: PRD suggests Python/Django, existing code is TypeScript/Express
- **Deployment Platform**: Vercel requires serverless functions (Express must be adapted)

---

## Enhancement Scope and Integration Strategy

### Enhancement Overview

- **Enhancement Type**: Major pivot from web UI to SMS/IVR accessibility platform
- **Scope**: Add Twilio SMS/Voice capabilities while maintaining web demo UI
- **Integration Impact**: High - requires refactoring Express backend to serverless functions

### Integration Approach

**Code Integration Strategy:**
- Convert Express routes (`server/routes.ts`) → Vercel API routes (`api/**/*.ts`)
- Extract business logic from routes into reusable services (`server/services/`)
- Create conversation state machine for SMS/IVR flows
- Reuse existing React components for investor demo dashboard

**Database Integration:**
- Extend existing Drizzle schema (`shared/schema.ts`) with:
  - `sessions` table (SMS/IVR interaction logs)
  - `messages` table (SMS message history)
  - `voiceCalls` table (IVR call logs)
  - `followUps` table (scheduled reminder messages)
- Migrate from local PostgreSQL → Neon PostgreSQL (Vercel-compatible)

**API Integration:**
- Keep existing `/api/*` routes for web dashboard (if needed)
- Add new Twilio webhook routes:
  - `POST /api/webhooks/twilio/sms` - Incoming SMS handler
  - `POST /api/webhooks/twilio/voice` - Incoming call handler
  - `POST /api/webhooks/twilio/voice/gather` - IVR DTMF input handler
- Add dashboard API routes:
  - `GET /api/dashboard/metrics` - Real-time metrics for demo UI
  - `POST /api/demo/initiate-call` - Click-to-call feature

**UI Integration:**
- Reuse existing React app structure (`client/src/`)
- Replace `Landing.tsx` and `CheckIn.tsx` with new `Dashboard.tsx`
- Reuse shadcn/ui components (`Button`, `Card`, `Chart`, etc.)
- Add real-time updates using TanStack Query polling or SSE

### Compatibility Requirements

- **Existing API Compatibility**: Not required (web UI being replaced with demo dashboard)
- **Database Schema Compatibility**: Must extend, not replace, existing schema (preserve `users` table)
- **UI/UX Consistency**: Reuse wellness design system (colors, typography from Tailwind config)
- **Performance Impact**: SMS response latency < 3s, IVR < 1s (Twilio requirement)

---

## Tech Stack

### Existing Technology Stack

| Category | Current Technology | Version | Usage in Enhancement | Notes |
|----------|-------------------|---------|----------------------|-------|
| **Frontend** | React | 19.x | ✅ Keep for demo UI | TypeScript + Vite |
| **UI Library** | shadcn/ui | Latest | ✅ Reuse components | Radix UI primitives |
| **Styling** | Tailwind CSS | 3.x | ✅ Keep design system | Wellness theme configured |
| **Backend** | Express.js | 4.x | ⚠️ Convert to serverless | Migrate to Vercel API routes |
| **Database** | PostgreSQL | 13+ | ✅ Keep (migrate to Neon) | Drizzle ORM stays |
| **ORM** | Drizzle | Latest | ✅ Keep | Type-safe queries |
| **State Management** | TanStack Query | 5.x | ✅ Keep | For dashboard data |
| **Auth** | Passport.js | Latest | ❌ Not needed for MVP | SMS uses phone numbers |
| **Deployment** | None | - | ➕ Add Vercel | Serverless functions |

### New Technology Additions

| Technology | Version | Purpose | Rationale | Integration Method |
|------------|---------|---------|-----------|-------------------|
| **Twilio SDK** | `^5.0.0` | SMS/Voice API | Industry standard for telephony | `npm i twilio` |
| **Neon PostgreSQL** | Free tier | Database hosting | Vercel-compatible connection pooling | Replace `DATABASE_URL` |
| **Vercel Cron** | Built-in | Scheduled messages | Daily check-in reminders | `vercel.json` config |
| **TwiML** | N/A | Voice response markup | Build IVR flows | Twilio's XML format |

---

## Data Models and Schema Changes

### Existing Data Models

**Current Schema** (`shared/schema.ts`):
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

**Integration Decision**: Keep `users` table, extend for SMS/IVR context.

### New Data Models

#### 1. **Session Logs** (SMS/IVR Interactions)

**Purpose**: Track each Daily Ritual or Rupture & Repair interaction
**Integration**: Links to existing `users` table via `userId`

```typescript
export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  flowType: varchar("flow_type", { enum: ["daily", "repair"] }).notNull(),
  channel: varchar("channel", { enum: ["sms", "ivr"] }).notNull(),
  mood: varchar("mood", { enum: ["calm", "stressed", "tempted", "hopeful"] }),
  intention: text("intention"),
  streakCount: integer("streak_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});
```

**Relationships:**
- **With Existing**: `userId` → `users.id` (one user, many sessions)
- **With New**: `id` → `messages.sessionId`, `voiceCalls.sessionId`

#### 2. **Messages** (SMS History)

**Purpose**: Log all SMS messages sent/received
**Integration**: Audit trail for compliance and debugging

```typescript
export const messages = pgTable("messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => sessions.id),
  direction: varchar("direction", { enum: ["inbound", "outbound"] }).notNull(),
  fromNumber: varchar("from_number").notNull(), // Phone number
  toNumber: varchar("to_number").notNull(),
  body: text("body").notNull(),
  twilioSid: varchar("twilio_sid").unique(), // Twilio message SID
  status: varchar("status", { enum: ["queued", "sent", "delivered", "failed"] }),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### 3. **Voice Calls** (IVR Logs)

**Purpose**: Track IVR call interactions
**Integration**: Optional for MVP (Phase 2 priority)

```typescript
export const voiceCalls = pgTable("voice_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => sessions.id),
  twilioCallSid: varchar("twilio_call_sid").unique().notNull(),
  fromNumber: varchar("from_number").notNull(),
  toNumber: varchar("to_number").notNull(),
  duration: integer("duration"), // Seconds
  dtmfInputs: jsonb("dtmf_inputs"), // Store DTMF keypresses
  recordingUrl: text("recording_url"), // Optional voice recording
  status: varchar("status", { enum: ["queued", "ringing", "in-progress", "completed", "failed"] }),
  createdAt: timestamp("created_at").defaultNow(),
});
```

#### 4. **Follow-Ups** (Scheduled Messages)

**Purpose**: Queue daily reminders and post-SLIP encouragement
**Integration**: Processed by Vercel Cron jobs

```typescript
export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  messageType: varchar("message_type", { enum: ["daily_reminder", "streak_celebration", "post_slip_encouragement"] }),
  scheduledAt: timestamp("scheduled_at").notNull(),
  sentAt: timestamp("sent_at"),
  status: varchar("status", { enum: ["pending", "sent", "failed"] }).default("pending"),
  messageBody: text("message_body").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});
```

### Schema Integration Strategy

**Database Changes Required:**
- ✅ **New Tables**: `sessions`, `messages`, `voiceCalls`, `followUps`
- ⚠️ **Modified Tables**: Extend `users` with phone number field
- ✅ **New Indexes**: `sessions(userId)`, `messages(sessionId)`, `followUps(scheduledAt, status)`
- **Migration Strategy**: Use Drizzle Kit migrations (`drizzle-kit generate`, `drizzle-kit push`)

**Backward Compatibility:**
- Existing `users` table unchanged (add optional `phoneNumber` field)
- No breaking changes to current schema
- New tables isolated from existing web app logic

---

## Component Architecture

### Existing Components

**Frontend** (`client/src/`):
- `App.tsx` - Main router
- `components/Header.tsx`, `Footer.tsx` - Layout
- `components/CheckInForm.tsx` - Web check-in form (to be replaced)
- `components/ui/*` - shadcn/ui components (reuse)
- `pages/Landing.tsx`, `pages/CheckIn.tsx` - Web pages (replace with Dashboard)

**Backend** (`server/`):
- `index.ts` - Express server entry (convert to Vercel)
- `routes.ts` - Express routes (convert to API routes)
- `storage.ts` - Database connection (reuse Drizzle client)

### New Components

#### 1. **Conversation Engine** (Backend)

**Responsibility**: Finite State Machine (FSM) for SMS/IVR flows
**Integration Points**: Twilio webhooks → Conversation Engine → Database

**Implementation Note**: The ConversationEngine uses static in-memory state storage for MVP simplicity. For production, this should be migrated to Redis or database-backed session storage to support multi-instance deployments and prevent state loss during serverless function cold starts.

```typescript
// server/services/conversationEngine.ts
interface ConversationState {
  userId: string;
  currentFlow: "daily" | "repair";
  currentStep: "mood_prompt" | "affirmation" | "intention" | "repair_trigger";
  context: Record<string, any>; // Store mood, selections, etc.
}

class ConversationEngine {
  // Process incoming SMS/IVR input
  async processInput(userId: string, input: string, channel: "sms" | "ivr"): Promise<string>;

  // Get next message in flow
  async getNextMessage(state: ConversationState): Promise<string>;

  // Save session to database
  async saveSession(state: ConversationState): Promise<void>;
}
```

**Key Interfaces:**
- `processInput(userId, input, channel)` - Main entry point from webhooks
- `getNextMessage(state)` - FSM step processor
- `saveSession(state)` - Persist to `sessions` table

**Dependencies:**
- **Existing**: Drizzle ORM (`storage.ts`)
- **New**: Message Templates (`messageTemplates.json`), Twilio SDK

**Technology Stack**: TypeScript, no external FSM library (custom implementation)

#### 2. **Twilio Webhook Handlers** (API Routes)

**Responsibility**: Receive and respond to Twilio HTTP requests
**Integration Points**: Twilio Cloud → Vercel Functions → Conversation Engine

```typescript
// api/webhooks/twilio/sms.ts (Vercel API Route)
import { VercelRequest, VercelResponse } from '@vercel/node';
import twilio from 'twilio';
import { ConversationEngine } from '../../../server/services/conversationEngine';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Validate Twilio signature (security)
  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers['x-twilio-signature'] as string,
    `https://reentry-buddy.vercel.app/api/webhooks/twilio/sms`,
    req.body
  );

  if (!isValid) {
    return res.status(403).send('Forbidden');
  }

  // 2. Extract SMS data
  const { From, Body } = req.body;

  // 3. Process through conversation engine
  const engine = new ConversationEngine();
  const response = await engine.processInput(From, Body, 'sms');

  // 4. Return TwiML response
  const twiml = new twilio.twiml.MessagingResponse();
  twiml.message(response);

  res.setHeader('Content-Type', 'text/xml');
  res.status(200).send(twiml.toString());
}
```

**Key Interfaces:**
- `POST /api/webhooks/twilio/sms` - Incoming SMS
- `POST /api/webhooks/twilio/voice` - Incoming call
- `POST /api/webhooks/twilio/voice/gather` - IVR DTMF input

**Dependencies:**
- Twilio SDK (signature validation, TwiML generation)
- Conversation Engine (business logic)

#### 3. **Investor Demo Dashboard** (Frontend)

**Responsibility**: Real-time visualization of SMS/IVR interactions
**Integration Points**: React UI → Vercel API → PostgreSQL

```typescript
// client/src/pages/Dashboard.tsx
import { useQuery } from '@tanstack/react-query';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function Dashboard() {
  const { data: metrics } = useQuery({
    queryKey: ['dashboard-metrics'],
    queryFn: async () => {
      const res = await fetch('/api/dashboard/metrics');
      return res.json();
    },
    refetchInterval: 5000, // Poll every 5 seconds
  });

  const handleClickToCall = async () => {
    await fetch('/api/demo/initiate-call', { method: 'POST', body: JSON.stringify({ phone: '+1234567890' }) });
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Reentry Buddy - Live Demo</h1>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Check-Ins</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl">{metrics?.totalSessions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl">{metrics?.activeUsers || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Average Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl">{metrics?.avgStreak || 0} days</p>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleClickToCall} className="mt-6">
        📞 Click to Call Demo
      </Button>
    </div>
  );
}
```

**Key Interfaces:**
- Real-time metrics display (TanStack Query polling)
- Click-to-call button (Twilio Programmable Voice)
- Recent messages feed (live SMS log)

**Dependencies:**
- **Existing**: shadcn/ui components, TanStack Query
- **New**: Dashboard API route, Twilio REST API (for outbound calls)

### Component Interaction Diagram

```mermaid
graph TB
    subgraph "Twilio Cloud"
        SMS[SMS Gateway]
        VOICE[Voice Gateway]
    end

    subgraph "Vercel Serverless"
        WEBHOOK_SMS[/api/webhooks/twilio/sms]
        WEBHOOK_VOICE[/api/webhooks/twilio/voice]
        ENGINE[Conversation Engine]
        DASHBOARD_API[/api/dashboard/metrics]
        DEMO_CALL[/api/demo/initiate-call]
    end

    subgraph "Frontend (React)"
        UI[Dashboard.tsx]
    end

    subgraph "Neon PostgreSQL"
        DB[(Database)]
    end

    SMS -->|Incoming SMS| WEBHOOK_SMS
    VOICE -->|Incoming Call| WEBHOOK_VOICE

    WEBHOOK_SMS --> ENGINE
    WEBHOOK_VOICE --> ENGINE

    ENGINE --> DB

    UI -->|Fetch metrics| DASHBOARD_API
    UI -->|Click-to-call| DEMO_CALL

    DASHBOARD_API --> DB
    DEMO_CALL --> SMS
    DEMO_CALL --> VOICE
```

---

## API Design and Integration

### API Integration Strategy

- **Integration Strategy**: Hybrid - New Twilio webhooks + existing dashboard API routes
- **Authentication**:
  - Twilio webhooks: Signature validation (no user auth)
  - Dashboard API: Public for demo (add basic auth in Phase 2)
- **Versioning**: Not needed for MVP (single version)

### New API Endpoints

#### 1. **POST /api/webhooks/twilio/sms** (Incoming SMS)

**Method**: POST
**Endpoint**: `/api/webhooks/twilio/sms`
**Purpose**: Handle incoming SMS messages from Twilio
**Integration**: Entry point for Daily Ritual and Repair flows

**Request** (from Twilio):
```json
{
  "MessageSid": "SM1234567890abcdef",
  "From": "+15551234567",
  "To": "+18885551234",
  "Body": "2",
  "NumMedia": "0"
}
```

**Response** (TwiML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Message>Thanks for checking in! You're feeling stressed - take 3 deep breaths. Remember how far you've come.</Message>
</Response>
```

#### 2. **POST /api/webhooks/twilio/voice** (Incoming Call)

**Method**: POST
**Endpoint**: `/api/webhooks/twilio/voice`
**Purpose**: Handle incoming voice calls (IVR)
**Integration**: Phase 2 priority

**Request** (from Twilio):
```json
{
  "CallSid": "CA1234567890abcdef",
  "From": "+15551234567",
  "To": "+18885551234",
  "CallStatus": "ringing"
}
```

**Response** (TwiML):
```xml
<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="alice">Hi, this is Reentry Buddy. How's your mood today? Press 1 for calm, 2 for stressed, 3 for tempted, 4 for hopeful.</Say>
  <Gather input="dtmf" numDigits="1" action="/api/webhooks/twilio/voice/gather"/>
</Response>
```

#### 3. **GET /api/dashboard/metrics** (Demo Metrics)

**Method**: GET
**Endpoint**: `/api/dashboard/metrics`
**Purpose**: Fetch real-time metrics for investor dashboard
**Integration**: Read-only access to database

**Request**: None (simple GET)

**Response**:
```json
{
  "totalSessions": 127,
  "activeUsers": 34,
  "avgStreak": 5.2,
  "recentMessages": [
    {
      "timestamp": "2025-10-10T14:23:00Z",
      "fromNumber": "+1555***4567",
      "mood": "calm",
      "message": "Thanks for checking in! Keep going steady today."
    }
  ],
  "moodDistribution": {
    "calm": 45,
    "stressed": 30,
    "tempted": 15,
    "hopeful": 10
  }
}
```

#### 4. **POST /api/demo/initiate-call** (Click-to-Call)

**Method**: POST
**Endpoint**: `/api/demo/initiate-call`
**Purpose**: Programmatically initiate demo call from dashboard
**Integration**: Uses Twilio REST API to make outbound call

**Request**:
```json
{
  "phoneNumber": "+15551234567"
}
```

**Response**:
```json
{
  "success": true,
  "callSid": "CA1234567890abcdef",
  "message": "Call initiated to +15551234567"
}
```

---

## External API Integration

### Twilio API

- **Purpose**: Send/receive SMS, make/receive voice calls
- **Documentation**: https://www.twilio.com/docs/sms/api, https://www.twilio.com/docs/voice/api
- **Base URL**: `https://api.twilio.com/2010-04-01`
- **Authentication**: Account SID + Auth Token (HTTP Basic Auth)
- **Integration Method**: Node.js SDK (`npm install twilio`)

**Key Endpoints Used:**
- `POST /Accounts/{AccountSid}/Messages.json` - Send SMS
- `POST /Accounts/{AccountSid}/Calls.json` - Initiate outbound call
- **Webhooks**: Twilio calls our `/api/webhooks/twilio/*` endpoints

**Error Handling**:
- Validate webhook signatures to prevent spoofing
- Retry failed SMS sends (Twilio SDK handles)
- Log all Twilio errors to CloudWatch/Vercel logs

---

## Source Tree

### Existing Project Structure

```
rBuddy-v1/
├── client/                    # React frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── ui/           # shadcn/ui components (REUSE)
│   │   │   ├── Header.tsx
│   │   │   ├── Footer.tsx
│   │   │   └── CheckInForm.tsx  (REPLACE)
│   │   ├── pages/
│   │   │   ├── Landing.tsx   (REPLACE with Dashboard.tsx)
│   │   │   └── CheckIn.tsx   (REMOVE)
│   │   ├── lib/
│   │   │   ├── queryClient.ts (REUSE)
│   │   │   └── utils.ts      (REUSE)
│   │   ├── App.tsx           (UPDATE routes)
│   │   └── main.tsx
│   └── index.html
├── server/                    # Express backend (CONVERT to API routes)
│   ├── index.ts              (REMOVE - Vercel handles)
│   ├── routes.ts             (CONVERT to api/)
│   ├── storage.ts            (REUSE - Drizzle client)
│   └── vite.ts               (REMOVE)
├── shared/                    # Shared types
│   └── schema.ts             (EXTEND with new tables)
├── package.json
├── tsconfig.json
├── vite.config.ts
└── drizzle.config.ts
```

### New File Organization

```
rBuddy-v1/
├── api/                           # NEW: Vercel serverless functions
│   ├── webhooks/
│   │   └── twilio/
│   │       ├── sms.ts            # POST handler for SMS
│   │       ├── voice.ts          # POST handler for IVR
│   │       └── voice/
│   │           └── gather.ts     # DTMF input handler
│   ├── dashboard/
│   │   └── metrics.ts            # GET real-time metrics
│   └── demo/
│       └── initiate-call.ts      # POST click-to-call
│
├── server/
│   ├── services/                 # NEW: Business logic (serverless-friendly)
│   │   ├── conversationEngine.ts # FSM for SMS/IVR flows
│   │   ├── twilioService.ts      # Twilio SDK wrapper
│   │   └── metricsService.ts     # Dashboard data aggregation
│   ├── data/                     # NEW: Static content
│   │   └── messageTemplates.json # Message bank for flows
│   └── storage.ts                # EXISTING: Drizzle client (reuse)
│
├── client/
│   └── src/
│       └── pages/
│           ├── Dashboard.tsx     # NEW: Investor demo UI
│           └── Landing.tsx       # REMOVE or archive
│
├── shared/
│   └── schema.ts                 # EXTEND: Add sessions, messages, voiceCalls, followUps
│
├── vercel.json                   # NEW: Vercel config (build, routes, cron)
├── .env.example                  # UPDATE: Add Twilio credentials
└── README.md                     # UPDATE: New setup instructions
```

### Integration Guidelines

- **File Naming**:
  - API routes: lowercase with hyphens (`sms.ts`, `initiate-call.ts`)
  - React components: PascalCase (`Dashboard.tsx`)
  - Services: camelCase (`conversationEngine.ts`)

- **Folder Organization**:
  - Group by feature (`api/webhooks/twilio/`, `server/services/`)
  - Keep existing structure where possible

- **Import/Export Patterns**:
  - Use existing path aliases (`@/components`, `@/lib`)
  - Export services as default: `export default class ConversationEngine {}`
  - Export types from `shared/schema.ts`: `export type { Session, Message }`

---

## Infrastructure and Deployment Integration

### Existing Infrastructure

- **Current Deployment**: None (local development only)
- **Infrastructure Tools**: None
- **Environments**: Development only

### Enhancement Deployment Strategy

**Platform**: Vercel (Free Tier)

**Deployment Approach**:
1. **Frontend**: Static site generation (Vite build → `public/`)
2. **Backend**: Serverless functions (`api/` directory auto-deploys)
3. **Database**: Neon PostgreSQL (external, connection pooling built-in)
4. **Scheduled Tasks**: Vercel Cron (daily reminders)

**Note**: The build output directory was changed from `client/dist/` to `public/` to align with Vercel's serverless function requirements and avoid conflicts with the `api/` directory structure.

**Infrastructure Changes**:
```json
// vercel.json
{
  "buildCommand": "npm run build",
  "outputDirectory": "client/dist",
  "framework": "vite",
  "rewrites": [
    { "source": "/api/(.*)", "destination": "/api/$1" }
  ],
  "crons": [
    {
      "path": "/api/cron/daily-reminders",
      "schedule": "0 9 * * *"
    }
  ],
  "env": {
    "DATABASE_URL": "@database_url",
    "TWILIO_ACCOUNT_SID": "@twilio_account_sid",
    "TWILIO_AUTH_TOKEN": "@twilio_auth_token",
    "TWILIO_PHONE_NUMBER": "@twilio_phone_number"
  }
}
```

**Pipeline Integration**:
- Git push → Vercel auto-deploys (no CI/CD config needed)
- Environment variables set in Vercel dashboard
- Preview deployments for each PR

### Rollback Strategy

**Rollback Method**: Vercel instant rollback (click previous deployment)
**Risk Mitigation**:
- Test Twilio webhooks in Vercel preview environments first
- Use Twilio Studio for complex IVR flows (no-code fallback)
- Database migrations are additive only (no drops)

**Monitoring**:
- Vercel Analytics (free tier: web vitals)
- Vercel Logs (serverless function logs)
- Twilio Console (SMS/Voice logs and errors)

---

## Coding Standards

### Existing Standards Compliance

- **Code Style**: TypeScript strict mode, Prettier formatting
- **Linting Rules**: ESLint with React/TypeScript rules
- **Testing Patterns**: None (no tests exist yet)
- **Documentation Style**: Inline JSDoc comments

### Critical Integration Rules

- **Twilio Webhook Security**: ALWAYS validate `X-Twilio-Signature` header
  ```typescript
  import twilio from 'twilio';

  const isValid = twilio.validateRequest(
    process.env.TWILIO_AUTH_TOKEN!,
    req.headers['x-twilio-signature'] as string,
    `https://yourdomain.com${req.url}`,
    req.body
  );

  if (!isValid) return res.status(403).send('Forbidden');
  ```

- **Database Integration**: Use Drizzle ORM, no raw SQL
  ```typescript
  import { db } from '../server/storage';
  import { sessions } from '../shared/schema';

  await db.insert(sessions).values({ userId, flowType: 'daily', mood: 'calm' });
  ```

- **Error Handling**: Always respond to Twilio within 10 seconds
  ```typescript
  try {
    const response = await conversationEngine.process(input);
    res.status(200).send(twimlResponse(response));
  } catch (error) {
    // Fallback message
    res.status(200).send(twimlResponse('Sorry, please try again.'));
  }
  ```

- **Logging Consistency**: Use `console.log` for Vercel logs (captured automatically)
  ```typescript
  console.log(`[SMS] Received from ${fromNumber}: ${body}`);
  ```

---

## Testing Strategy

### Current Test Coverage

- **Unit Tests**: None
- **Integration Tests**: None
- **E2E Tests**: None
- **Manual Testing**: Primary QA method

### New Testing Requirements

#### Unit Tests for New Components

- **Framework**: Vitest (Vite-native, already compatible)
- **Location**: `__tests__/` directories next to source files
- **Coverage Target**: 50% (realistic for 8-day timeline)
- **Integration with Existing**: None to integrate with (greenfield testing)

**Example**:
```typescript
// server/services/__tests__/conversationEngine.test.ts
import { describe, it, expect } from 'vitest';
import ConversationEngine from '../conversationEngine';

describe('ConversationEngine', () => {
  it('should respond to mood selection with affirmation', async () => {
    const engine = new ConversationEngine();
    const response = await engine.processInput('user123', '2', 'sms');

    expect(response).toContain('stressed');
    expect(response).toContain('deep breaths');
  });
});
```

#### Integration Tests

- **Scope**: Twilio webhook → Conversation Engine → Database
- **Existing System Verification**: Not applicable (new system)
- **New Feature Testing**: Mock Twilio requests, verify database writes

**Example**:
```typescript
// api/__tests__/webhooks.twilio.sms.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import handler from '../webhooks/twilio/sms';
import { db } from '../../server/storage';
import { sessions } from '../../shared/schema';

describe('POST /api/webhooks/twilio/sms', () => {
  beforeEach(async () => {
    // Clear test database
    await db.delete(sessions);
  });

  it('should save session to database', async () => {
    const req = {
      body: { From: '+15551234567', Body: '1' },
      headers: { 'x-twilio-signature': 'valid-signature' }
    };
    const res = { status: vi.fn(), send: vi.fn() };

    await handler(req, res);

    const session = await db.select().from(sessions).limit(1);
    expect(session).toHaveLength(1);
    expect(session[0].mood).toBe('calm');
  });
});
```

#### Regression Testing

- **Existing Feature Verification**: No existing features to regress
- **Automated Regression Suite**: Not applicable
- **Manual Testing Requirements**:
  1. Test SMS flow end-to-end with real Twilio number
  2. Test dashboard displays real data
  3. Test click-to-call initiates real IVR call

---

## Security Integration

### Existing Security Measures

- **Authentication**: Passport.js local strategy (not used in SMS/IVR)
- **Authorization**: None
- **Data Protection**: PostgreSQL password hashing (bcrypt)
- **Security Tools**: None

### Enhancement Security Requirements

**New Security Measures**:
1. **Twilio Signature Validation**: Prevent webhook spoofing
2. **Phone Number Anonymization**: Store hashed phone numbers
3. **Database Encryption**: Neon PostgreSQL TLS connections
4. **Rate Limiting**: Vercel built-in (60 req/min per IP)

**Integration Points**:
- Every Twilio webhook MUST validate signature
- Never log full phone numbers (mask last 4 digits)
- Use environment variables for secrets (never commit)

**Compliance Requirements**:
- No HIPAA data stored (mood is not PHI)
- SMS opt-out supported ("STOP" keyword)
- Data retention: 90 days (auto-delete old sessions)

### Security Testing

- **Existing Security Tests**: None
- **New Security Test Requirements**:
  1. Test invalid Twilio signature rejected
  2. Test SQL injection prevention (Drizzle ORM handles)
  3. Test "STOP" keyword unsubscribes user

- **Penetration Testing**: Not required for MVP

---

## Next Steps

### Immediate Actions (Priority Order)

1. **Set up Neon PostgreSQL** (15 min)
   - Create free account at https://neon.tech
   - Create database, copy connection string
   - Update `DATABASE_URL` in `.env`

2. **Extend Drizzle Schema** (30 min)
   - Add `sessions`, `messages`, `voiceCalls`, `followUps` tables to `shared/schema.ts`
   - Run `npx drizzle-kit generate` → `npx drizzle-kit push`

3. **Create Twilio Account** (15 min)
   - Sign up at https://www.twilio.com/try-twilio (free trial)
   - Get phone number, copy Account SID + Auth Token
   - Add to Vercel environment variables

4. **Convert Express to API Routes** (2-3 hours)
   - Move `server/routes.ts` logic to `api/webhooks/twilio/sms.ts`
   - Create `server/services/conversationEngine.ts`
   - Create `server/data/messageTemplates.json`

5. **Build Dashboard UI** (2-3 hours)
   - Create `client/src/pages/Dashboard.tsx`
   - Add `/api/dashboard/metrics.ts` endpoint
   - Reuse shadcn/ui `Card`, `Button` components

6. **Deploy to Vercel** (30 min)
   - `npm install -g vercel`
   - `vercel login`
   - `vercel --prod`
   - Configure Twilio webhook URL: `https://your-project.vercel.app/api/webhooks/twilio/sms`

7. **Test End-to-End** (1 hour)
   - Send SMS to Twilio number
   - Verify response received
   - Check dashboard shows session
   - Test click-to-call feature

### Story Manager Handoff

**Task**: Implement Reentry Buddy SMS/IVR pivot with investor demo dashboard

**Key Integration Requirements** (validated with user):
- Use existing Express.js codebase (convert to Vercel serverless)
- Keep PostgreSQL (migrate to Neon for connection pooling)
- Reuse React + shadcn/ui for dashboard
- Deploy to Vercel (free tier)

**Existing System Constraints** (based on actual project analysis):
- Monorepo structure (`client/`, `server/`, `shared/`)
- TypeScript strict mode enabled
- Drizzle ORM for database (keep existing patterns)
- No existing tests (start fresh with Vitest)

**First Story to Implement**:
**Story 1**: Set up Twilio SMS webhook with basic "echo" response

**Acceptance Criteria**:
1. Create `api/webhooks/twilio/sms.ts` Vercel function
2. Validate Twilio signature
3. Return TwiML response echoing received message
4. Log message to database (`messages` table)
5. Deploy to Vercel and test with real SMS

**Integration Checkpoints**:
- [ ] Twilio signature validation works
- [ ] Drizzle schema migration applied
- [ ] Vercel deployment successful
- [ ] Incoming SMS logged to database
- [ ] Response received on phone within 3 seconds

**Critical Path**: This story validates the entire Twilio → Vercel → Database pipeline

### Developer Handoff

**Reference Documents**:
- This architecture document
- PRD: `docs/prd.md`
- Existing codebase standards: `AGENTS.md`

**Integration Requirements with Existing Codebase**:
1. **Database**: Extend `shared/schema.ts` (do not replace)
2. **Imports**: Use existing path aliases (`@/components`, `@/lib`)
3. **Styling**: Follow Tailwind config in `tailwind.config.ts`
4. **Components**: Reuse shadcn/ui from `client/src/components/ui/`

**Key Technical Decisions** (based on real project constraints):
- Vercel serverless functions (not traditional Express server)
- Neon PostgreSQL (not local/Render PostgreSQL)
- TanStack Query polling (not WebSockets) for dashboard
- Vercel Cron (not node-cron) for scheduled messages

**Existing System Compatibility Requirements**:
1. **Schema Migration**: Use Drizzle Kit (`npx drizzle-kit push`)
   - Verify existing `users` table not modified
   - Run in staging first (Neon branch)

2. **Import Patterns**: Match existing style
   ```typescript
   // ✅ Correct
   import { db } from '@/server/storage';
   import { Button } from '@/components/ui/button';

   // ❌ Wrong
   import { db } from '../../../server/storage';
   ```

3. **Error Handling**: Always return 200 to Twilio (even on errors)
   ```typescript
   // Twilio requires 200 response to prevent retries
   try {
     const response = await process();
     res.status(200).send(twiml(response));
   } catch (error) {
     res.status(200).send(twiml('Please try again.'));
   }
   ```

**Clear Sequencing** (minimize risk to existing functionality):
1. ✅ **Phase 1**: Add new tables (no impact on existing code)
2. ✅ **Phase 2**: Create API routes (new files, no conflicts)
3. ✅ **Phase 3**: Build dashboard (replace unused `Landing.tsx`)
4. ✅ **Phase 4**: Deploy to Vercel (new platform, no migration)

**Timeline**: 8 days (October 10-17, 2025)
- Days 1-2: Database + API routes
- Days 3-4: Conversation engine + message templates
- Days 5-6: Dashboard UI + click-to-call
- Day 7: End-to-end testing
- Day 8: Deploy + demo prep

---

## Document Metadata

- **Version**: 1.0
- **Status**: Draft (pending user approval)
- **Repository Path**: `docs/architecture.md`
- **Next Review**: After Sprint 1 (daily iteration expected)

---

✅ **End of Brownfield Architecture Document**
