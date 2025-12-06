-- Step 1: Find usernames that violate the constraint
-- Run this first to see which usernames need fixing

SELECT 
    id,
    username,
    email,
    CASE 
        WHEN LENGTH(username) < 3 THEN 'Too short (< 3 chars)'
        WHEN LENGTH(username) > 30 THEN 'Too long (> 30 chars)'
        WHEN username !~ '^[a-zA-Z0-9_]+$' THEN 'Invalid characters (only letters, numbers, _ allowed)'
        ELSE 'Valid'
    END as issue
FROM profiles
WHERE 
    LENGTH(username) < 3 
    OR LENGTH(username) > 30 
    OR username !~ '^[a-zA-Z0-9_]+$';

-- Step 2: Fix invalid usernames
-- This will update problematic usernames to a safe format

-- Fix usernames that are too short
UPDATE profiles
SET username = CONCAT('user_', id)
WHERE LENGTH(username) < 3;

-- Fix usernames that are too long
UPDATE profiles
SET username = LEFT(username, 30)
WHERE LENGTH(username) > 30;

-- Fix usernames with invalid characters (spaces, special chars, etc.)
-- Replace invalid characters with underscores
UPDATE profiles
SET username = REGEXP_REPLACE(username, '[^a-zA-Z0-9_]', '_', 'g')
WHERE username !~ '^[a-zA-Z0-9_]+$';

-- Step 3: Verify all usernames are now valid
SELECT 
    COUNT(*) as total_users,
    COUNT(CASE WHEN LENGTH(username) >= 3 AND LENGTH(username) <= 30 AND username ~ '^[a-zA-Z0-9_]+$' THEN 1 END) as valid_usernames
FROM profiles;

-- If the counts match, you're good to proceed with the constraint migration
