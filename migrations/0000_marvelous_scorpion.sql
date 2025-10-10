CREATE TABLE "follow_ups" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"message_type" varchar,
	"scheduled_at" timestamp NOT NULL,
	"sent_at" timestamp,
	"status" varchar DEFAULT 'pending',
	"message_body" text NOT NULL,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "messages" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar,
	"direction" varchar NOT NULL,
	"from_number" varchar NOT NULL,
	"to_number" varchar NOT NULL,
	"body" text NOT NULL,
	"twilio_sid" varchar,
	"status" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "messages_twilio_sid_unique" UNIQUE("twilio_sid")
);
--> statement-breakpoint
CREATE TABLE "sessions" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" varchar NOT NULL,
	"flow_type" varchar NOT NULL,
	"channel" varchar NOT NULL,
	"mood" varchar,
	"intention" text,
	"streak_count" integer DEFAULT 0,
	"created_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"password" text NOT NULL,
	"phone_number" text,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
--> statement-breakpoint
CREATE TABLE "voice_calls" (
	"id" varchar PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"session_id" varchar,
	"twilio_call_sid" varchar NOT NULL,
	"from_number" varchar NOT NULL,
	"to_number" varchar NOT NULL,
	"duration" integer,
	"dtmf_inputs" jsonb,
	"recording_url" text,
	"status" varchar,
	"created_at" timestamp DEFAULT now(),
	CONSTRAINT "voice_calls_twilio_call_sid_unique" UNIQUE("twilio_call_sid")
);
--> statement-breakpoint
ALTER TABLE "follow_ups" ADD CONSTRAINT "follow_ups_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "messages" ADD CONSTRAINT "messages_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "voice_calls" ADD CONSTRAINT "voice_calls_session_id_sessions_id_fk" FOREIGN KEY ("session_id") REFERENCES "public"."sessions"("id") ON DELETE no action ON UPDATE no action;