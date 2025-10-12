import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb, boolean, pgEnum } from "drizzle-orm/pg-core";

// Define PostgreSQL enums for type safety and database constraints
export const flowTypeEnum = pgEnum("flow_type", ["daily", "repair", "daily-ritual"]);
export const channelEnum = pgEnum("channel", ["sms", "ivr", "pwa"]);
export const moodEnum = pgEnum("mood", ["calm", "stressed", "tempted", "hopeful"]);
export type MoodOption = "calm" | "stressed" | "tempted" | "hopeful";
export const directionEnum = pgEnum("direction", ["inbound", "outbound"]);
export const contentTypeEnum = pgEnum("content_type", [
  "text",
  "notification",
  "reminder",
  "mood_selection",
  "affirmation_view",
  "intention",
  "journal_entry",
]);
export const interactionStatusEnum = pgEnum("interaction_status", ["queued", "sent", "delivered", "failed", "synced"]);
export const voiceCallStatusEnum = pgEnum("voice_call_status", ["queued", "ringing", "in-progress", "completed", "failed"]);
export const messageTypeEnum = pgEnum("message_type", ["daily_reminder", "streak_celebration", "post_slip_encouragement"]);
export const followUpChannelEnum = pgEnum("follow_up_channel", ["sms", "push", "pwa"]);
export const followUpStatusEnum = pgEnum("follow_up_status", ["pending", "sent", "failed"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password"), // Made nullable for OAuth users
  email: varchar("email").notNull().unique(), // Required for OAuth
  googleId: varchar("google_id").unique(), // OAuth provider ID
  avatarUrl: text("avatar_url"), // User profile picture
  phoneNumber: text("phone_number"),
  deviceToken: jsonb("device_token"), // Push notification subscription object
  preferredTime: varchar("preferred_time", { length: 5 }), // "09:00" format
  lastSyncAt: timestamp("last_sync_at"),
  enablePushNotifications: boolean("enable_push_notifications").default(true),
});

export const sessions = pgTable("sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  flowType: flowTypeEnum("flow_type").notNull(),
  channel: channelEnum("channel").notNull(),
  mood: moodEnum("mood"),
  intention: text("intention"),
  streakCount: integer("streak_count").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Renamed from 'messages' to 'interactions' to support PWA (not just SMS)
export const interactions = pgTable("interactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(), // Direct user reference
  sessionId: varchar("session_id").references(() => sessions.id),
  direction: directionEnum("direction").notNull(),
  channel: channelEnum("channel").notNull(),
  contentType: contentTypeEnum("content_type").default("text"),
  fromNumber: varchar("from_number"), // Nullable for PWA interactions
  toNumber: varchar("to_number"), // Nullable for PWA interactions
  body: text("body").notNull(),
  metadata: jsonb("metadata"), // Store device info, app version, etc.
  twilioSid: varchar("twilio_sid").unique(), // Legacy: Twilio message SID (nullable for PWA)
  status: interactionStatusEnum("status"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Keep legacy 'messages' export for backwards compatibility during migration
export const messages = interactions;

export const voiceCalls = pgTable("voice_calls", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sessionId: varchar("session_id").references(() => sessions.id),
  twilioCallSid: varchar("twilio_call_sid").unique().notNull(),
  fromNumber: varchar("from_number").notNull(),
  toNumber: varchar("to_number").notNull(),
  duration: integer("duration"), // Seconds
  dtmfInputs: jsonb("dtmf_inputs"), // Store DTMF keypresses
  recordingUrl: text("recording_url"), // Optional voice recording
  status: voiceCallStatusEnum("status"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const followUps = pgTable("follow_ups", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  messageType: messageTypeEnum("message_type"),
  channel: followUpChannelEnum("channel").default("push"),
  scheduledAt: timestamp("scheduled_at").notNull(),
  sentAt: timestamp("sent_at"),
  status: followUpStatusEnum("status").default("pending"),
  messageBody: text("message_body").notNull(),
  pushPayload: jsonb("push_payload"), // Notification title, body, icon, badge, etc.
  createdAt: timestamp("created_at").defaultNow(),
});

export const chatRoleEnum = pgEnum("chat_role", ["user", "assistant", "system"]);

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id).notNull(),
  role: chatRoleEnum("role").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata"), // Store context like mood, session info, etc.
  createdAt: timestamp("created_at").defaultNow(),
});