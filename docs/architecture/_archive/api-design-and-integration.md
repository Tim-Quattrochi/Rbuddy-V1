# API Design and Integration

## API Integration Strategy

- **Integration Strategy**: Hybrid - New Twilio webhooks + existing dashboard API routes
- **Authentication**:
  - Twilio webhooks: Signature validation (no user auth)
  - Dashboard API: Public for demo (add basic auth in Phase 2)
- **Versioning**: Not needed for MVP (single version)

## New API Endpoints

### 1. **POST /api/webhooks/twilio/sms** (Incoming SMS)

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

### 2. **POST /api/webhooks/twilio/voice** (Incoming Call)

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

### 3. **GET /api/dashboard/metrics** (Demo Metrics)

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

### 4. **POST /api/demo/initiate-call** (Click-to-Call)

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
