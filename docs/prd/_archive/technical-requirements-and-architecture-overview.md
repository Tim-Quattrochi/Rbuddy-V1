# 4. Technical Requirements and Architecture Overview

## 4.1 Core Architecture
- **Interface:** SMS + IVR via Twilio Programmable Messaging and Voice.
- **Backend:** FastAPI (Python) + AWS Lambda (serverless).
- **Data Store:** DynamoDB (encrypted, TTL cleanup).
- **Storage:** S3 for optional voice recordings (short-term).
- **Monitoring:** CloudWatch / Datadog for error tracking.
- **Security:** TLS, AES-256 encryption, and Twilio signature validation.

## 4.2 Conversation Engine
- Finite-state machine (FSM) controlling "Daily Ritual" and "Repair" flows.
- Stateless interactions; each step logs to DB with `session_id`.
- JSON-based flow definitions for non-dev content updates.

## 4.3 Twilio Integration
- Webhooks:
  - `/webhooks/twilio/sms`
  - `/webhooks/twilio/voice`
  - `/webhooks/twilio/voice/gather`
- Signature validation for all inbound traffic.
- REST API for outbound messages and IVR follow-ups.

## 4.4 Data Model
- **Users** → `user_id`, `phone_hash`, `preferred_time`, `language`, `opt_out`
- **SessionLogs** → `session_id`, `user_id`, `flow_type`, `mood`, `timestamp`, `streak_count`
- **FollowUps** → `followup_id`, `user_id`, `scheduled_at`, `status`

## 4.5 Security & Privacy
- Anonymous IDs only; no direct PII stored.
- "STOP" keyword deactivates user.
- 90-day retention; data auto-purged post-pilot.
