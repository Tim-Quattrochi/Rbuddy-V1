-- Migration: Add OAuth fields to users table
-- Story: 1.1 - Update Database Schema for OAuth

-- Step 1: Add new columns as nullable first
ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS google_id VARCHAR;
ALTER TABLE users ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- Step 2: Make password nullable
ALTER TABLE users ALTER COLUMN password DROP NOT NULL;

-- Step 3: Add placeholder emails for existing users (using username as base)
UPDATE users 
SET email = username || '@legacy.local'
WHERE email IS NULL;

-- Step 4: Now add the NOT NULL constraint on email
ALTER TABLE users ALTER COLUMN email SET NOT NULL;

-- Step 5: Add unique constraints
ALTER TABLE users ADD CONSTRAINT users_email_unique UNIQUE (email);
ALTER TABLE users ADD CONSTRAINT users_google_id_unique UNIQUE (google_id);
