# Data Models and Schema Changes

## Existing Data Models

**Current Schema** (`shared/schema.ts`):
```typescript
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});
```

**Integration Decision**: Keep `users` table, extend for SMS/IVR context.

## New Data Models

### 1. **Session Logs** (SMS/IVR Interactions)

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

### 2. **Messages** (SMS History)

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

### 3. **Voice Calls** (IVR Logs)

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

### 4. **Follow-Ups** (Scheduled Messages)

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

## Schema Integration Strategy

**Database Changes Required:**
- ✅ **New Tables**: `sessions`, `messages`, `voiceCalls`, `followUps`
- ⚠️ **Modified Tables**: Extend `users` with phone number field
- ✅ **New Indexes**: `sessions(userId)`, `messages(sessionId)`, `followUps(scheduledAt, status)`
- **Migration Strategy**: Use Drizzle Kit migrations (`drizzle-kit generate`, `drizzle-kit push`)

**Backward Compatibility:**
- Existing `users` table unchanged (add optional `phoneNumber` field)
- No breaking changes to current schema
- New tables isolated from existing web app logic
