# Testing Strategy

## Current Test Coverage

- **Unit Tests**: None
- **Integration Tests**: None
- **E2E Tests**: None
- **Manual Testing**: Primary QA method

## New Testing Requirements

### Unit Tests for New Components

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

### Integration Tests

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

### Regression Testing

- **Existing Feature Verification**: No existing features to regress
- **Automated Regression Suite**: Not applicable
- **Manual Testing Requirements**:
  1. Test SMS flow end-to-end with real Twilio number
  2. Test dashboard displays real data
  3. Test click-to-call initiates real IVR call
