# Enhancement Scope and Integration Strategy

## Enhancement Overview

- **Enhancement Type**: Major pivot from web UI to SMS/IVR accessibility platform
- **Scope**: Add Twilio SMS/Voice capabilities while maintaining web demo UI
- **Integration Impact**: High - requires refactoring Express backend to serverless functions

## Integration Approach

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

## Compatibility Requirements

- **Existing API Compatibility**: Not required (web UI being replaced with demo dashboard)
- **Database Schema Compatibility**: Must extend, not replace, existing schema (preserve `users` table)
- **UI/UX Consistency**: Reuse wellness design system (colors, typography from Tailwind config)
- **Performance Impact**: SMS response latency < 3s, IVR < 1s (Twilio requirement)
