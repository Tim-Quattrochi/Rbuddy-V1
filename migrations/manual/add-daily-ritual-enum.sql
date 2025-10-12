-- Migration: Add 'daily-ritual' to flow_type enum
-- Date: 2025-10-12
-- Issue: Database enum missing value defined in code schema

-- Add 'daily-ritual' value to the flow_type enum if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_enum 
        WHERE enumlabel = 'daily-ritual' 
        AND enumtypid = (SELECT oid FROM pg_type WHERE typname = 'flow_type')
    ) THEN
        ALTER TYPE flow_type ADD VALUE 'daily-ritual';
    END IF;
END $$;

-- Verify the enum values
SELECT enumlabel FROM pg_enum WHERE enumtypid = (SELECT oid FROM pg_type WHERE typname = 'flow_type') ORDER BY enumsortorder;
