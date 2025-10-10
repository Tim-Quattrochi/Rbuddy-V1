import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, jsonb } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  phoneNumber: text("phone_number"),
});

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