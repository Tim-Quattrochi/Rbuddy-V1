# Source Tree

## Existing Project Structure

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

## New File Organization

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

## Integration Guidelines

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
