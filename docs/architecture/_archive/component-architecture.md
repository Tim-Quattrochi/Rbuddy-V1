# Component Architecture

## Existing Components

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

## New Components

### 1. **Conversation Engine** (Backend)

**Responsibility**: Finite State Machine (FSM) for SMS/IVR flows
**Integration Points**: Twilio webhooks → Conversation Engine → Database

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

### 2. **Twilio Webhook Handlers** (API Routes)

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

### 3. **Investor Demo Dashboard** (Frontend)

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

## Component Interaction Diagram

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
