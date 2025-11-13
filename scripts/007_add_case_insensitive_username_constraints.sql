-- Migration: Add case-insensitive username constraints and indexes
-- This addresses the security and performance issues with username handling

-- Step 1: Drop the existing case-sensitive unique constraint on username
-- Note: This will fail if there are existing duplicate usernames with different cases
-- In that case, manual cleanup of duplicates would be required first
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_username_key;

-- Step 2: Create a case-insensitive unique index on username
-- This ensures usernames are unique regardless of case (e.g., "User" and "user" cannot both exist)
CREATE UNIQUE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username_case_insensitive
ON profiles(LOWER(username));

-- Step 3: Add a check constraint to ensure username format
-- This enforces the same validation as the application code
ALTER TABLE profiles ADD CONSTRAINT chk_profiles_username_format
CHECK (username ~ '^[a-zA-Z0-9_]+$' AND LENGTH(username) BETWEEN 3 AND 30);

-- Step 4: Create an index on LOWER(username) for fast case-insensitive lookups
-- This optimizes the username lookup queries in authentication
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_username_lower
ON profiles(LOWER(username));

-- Step 5: Ensure the foreign key constraint exists (should already be there from initial schema)
-- This maintains referential integrity between profiles and auth.users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE constraint_name = 'profiles_id_fkey'
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT fk_profiles_user_id
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Step 6: Add NOT NULL constraint on email if not already present
-- This ensures all profiles have valid email addresses
ALTER TABLE profiles ALTER COLUMN email SET NOT NULL;

-- Step 7: Create partial indexes for better query performance
-- Index for active/non-suspended users
CREATE INDEX CONCURRENTLY IF NOT EXISTS idx_profiles_active
ON profiles(id, username)
WHERE is_suspended = FALSE;

-- Step 8: Add updated_at trigger if not exists
-- This ensures updated_at is automatically maintained
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Log the migration completion
DO $$
BEGIN
  RAISE NOTICE 'Migration 007 completed: Added case-insensitive username constraints and performance indexes';
END $$;