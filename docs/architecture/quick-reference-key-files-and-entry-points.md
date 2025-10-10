# Quick Reference - Key Files and Entry Points

## Critical Files for Understanding the System

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

## Enhancement Impact Areas

| Component | Impact | Files Affected |
|-----------|--------|----------------|
| **Backend** | 🔴 Major | Convert Express → Vercel API routes |
| **Database** | 🟡 Medium | Extend schema for SMS logs, sessions |
| **Frontend** | 🟢 Minor | Add dashboard components for demo |
| **Deployment** | 🔴 Major | New Vercel configuration |
