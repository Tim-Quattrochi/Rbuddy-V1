-- Migration: Add 'mood_selection', 'affirmation_view', 'intention' to content_type enum
-- Date: 2025-10-12
-- Issue: Database enum missing values defined in code schema (shared/schema.ts line 11)
-- Error: "invalid input value for enum content_type: 'mood_selection'"

-- Add missing values to the content_type enum if they don't exist
DO $$ 
BEGIN
    -- Add 'mood_selection'
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'mood_selection' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
    ) THEN
        ALTER TYPE content_type ADD VALUE 'mood_selection';
    END IF;

    -- Add 'affirmation_view'
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'affirmation_view' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
    ) THEN
        ALTER TYPE content_type ADD VALUE 'affirmation_view';
    END IF;

    -- Add 'intention'
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'intention' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type')
    ) THEN
        ALTER TYPE content_type ADD VALUE 'intention';
    END IF;
END $$;

-- Verify the enum values
SELECT enumlabel FROM pg_enum 
WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'content_type') 
ORDER BY enumsortorder;
