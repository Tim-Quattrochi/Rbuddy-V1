-- Critical Schema Fixes Migration
-- Fixes: Boolean type, Enum types, JSONB type
-- Date: 2025-10-11

BEGIN;

-- Step 1: Create PostgreSQL enum types (skip if already exist)
DO $$ BEGIN
  CREATE TYPE flow_type AS ENUM ('daily', 'repair');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE channel AS ENUM ('sms', 'ivr', 'pwa');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE mood AS ENUM ('calm', 'stressed', 'tempted', 'hopeful');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE direction AS ENUM ('inbound', 'outbound');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE content_type AS ENUM ('text', 'notification', 'reminder');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE interaction_status AS ENUM ('queued', 'sent', 'delivered', 'failed', 'synced');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE voice_call_status AS ENUM ('queued', 'ringing', 'in-progress', 'completed', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE message_type AS ENUM ('daily_reminder', 'streak_celebration', 'post_slip_encouragement');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE follow_up_channel AS ENUM ('sms', 'push', 'pwa');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE follow_up_status AS ENUM ('pending', 'sent', 'failed');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- Step 2: Fix users table
-- Convert device_token from text to jsonb
ALTER TABLE users
  ALTER COLUMN device_token TYPE jsonb
  USING CASE
    WHEN device_token IS NULL THEN NULL
    WHEN device_token = '' THEN NULL
    ELSE device_token::jsonb
  END;

-- Convert enable_push_notifications from integer to boolean
-- First drop the existing default
ALTER TABLE users
  ALTER COLUMN enable_push_notifications DROP DEFAULT;

-- Then change the type
ALTER TABLE users
  ALTER COLUMN enable_push_notifications TYPE boolean
  USING CASE
    WHEN enable_push_notifications = 1 THEN TRUE
    WHEN enable_push_notifications = 0 THEN FALSE
    ELSE TRUE
  END;

-- Finally set the new boolean default
ALTER TABLE users
  ALTER COLUMN enable_push_notifications SET DEFAULT TRUE;

-- Step 3: Fix sessions table
-- Convert flow_type to enum
ALTER TABLE sessions
  ALTER COLUMN flow_type TYPE flow_type
  USING flow_type::flow_type;

-- Convert channel to enum
ALTER TABLE sessions
  ALTER COLUMN channel TYPE channel
  USING channel::channel;

-- Convert mood to enum
ALTER TABLE sessions
  ALTER COLUMN mood TYPE mood
  USING mood::mood;

-- Step 4: Fix interactions table
-- Convert direction to enum
ALTER TABLE interactions
  ALTER COLUMN direction TYPE direction
  USING direction::direction;

-- Convert channel to enum
ALTER TABLE interactions
  ALTER COLUMN channel TYPE channel
  USING channel::channel;

-- Convert content_type to enum (drop default first)
ALTER TABLE interactions
  ALTER COLUMN content_type DROP DEFAULT;

ALTER TABLE interactions
  ALTER COLUMN content_type TYPE content_type
  USING content_type::content_type;

ALTER TABLE interactions
  ALTER COLUMN content_type SET DEFAULT 'text'::content_type;

-- Convert status to enum
ALTER TABLE interactions
  ALTER COLUMN status TYPE interaction_status
  USING status::interaction_status;

-- Step 5: Fix voice_calls table
-- Convert status to enum
ALTER TABLE voice_calls
  ALTER COLUMN status TYPE voice_call_status
  USING status::voice_call_status;

-- Step 6: Fix follow_ups table
-- Convert message_type to enum
ALTER TABLE follow_ups
  ALTER COLUMN message_type TYPE message_type
  USING message_type::message_type;

-- Convert channel to enum (drop default first)
ALTER TABLE follow_ups
  ALTER COLUMN channel DROP DEFAULT;

ALTER TABLE follow_ups
  ALTER COLUMN channel TYPE follow_up_channel
  USING channel::follow_up_channel;

ALTER TABLE follow_ups
  ALTER COLUMN channel SET DEFAULT 'push'::follow_up_channel;

-- Convert status to enum (drop default first)
ALTER TABLE follow_ups
  ALTER COLUMN status DROP DEFAULT;

ALTER TABLE follow_ups
  ALTER COLUMN status TYPE follow_up_status
  USING status::follow_up_status;

ALTER TABLE follow_ups
  ALTER COLUMN status SET DEFAULT 'pending'::follow_up_status;

COMMIT;
