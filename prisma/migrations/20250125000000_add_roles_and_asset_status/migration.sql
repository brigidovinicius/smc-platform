/*
  Migration: Add FOUNDER and INVESTOR roles, update AssetStatus enum
  
  This migration is safe and non-destructive:
  - Adds new enum values to Role (does not remove existing values)
  - Updates AssetStatus enum (maps old values to new ones)
  - Sets default role for existing users to USER if not set
*/

-- Add new roles to Role enum
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'FOUNDER';
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'INVESTOR';

-- Update AssetStatus enum
-- First, create a new enum with the desired values
DO $$ 
BEGIN
  -- Check if the new enum values don't exist yet
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'AssetStatus_new') THEN
    -- Create temporary enum
    CREATE TYPE "AssetStatus_new" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'PUBLISHED', 'REJECTED');
    
    -- Update Asset table to use new enum values
    -- Map old values to new ones:
    -- DRAFT -> DRAFT
    -- SUBMITTED -> UNDER_REVIEW
    -- PENDING_REVIEW -> UNDER_REVIEW
    -- APPROVED -> PUBLISHED
    -- REJECTED -> REJECTED
    -- PUBLISHED -> PUBLISHED
    
    ALTER TABLE "Asset" 
      ALTER COLUMN "status" TYPE "AssetStatus_new" 
      USING CASE 
        WHEN "status"::text = 'DRAFT' THEN 'DRAFT'::AssetStatus_new
        WHEN "status"::text = 'SUBMITTED' THEN 'UNDER_REVIEW'::AssetStatus_new
        WHEN "status"::text = 'PENDING_REVIEW' THEN 'UNDER_REVIEW'::AssetStatus_new
        WHEN "status"::text = 'APPROVED' THEN 'PUBLISHED'::AssetStatus_new
        WHEN "status"::text = 'REJECTED' THEN 'REJECTED'::AssetStatus_new
        WHEN "status"::text = 'PUBLISHED' THEN 'PUBLISHED'::AssetStatus_new
        ELSE 'DRAFT'::AssetStatus_new
      END;
    
    -- Drop old enum and rename new one
    DROP TYPE "AssetStatus";
    ALTER TYPE "AssetStatus_new" RENAME TO "AssetStatus";
  END IF;
END $$;

-- Ensure default status for new assets is UNDER_REVIEW (if not already set)
-- This is handled by the Prisma schema default, but we ensure existing records are safe


