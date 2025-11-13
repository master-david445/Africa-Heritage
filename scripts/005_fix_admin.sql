-- Fix admin setup for specific users
-- First check if users exist
DO $$
DECLARE
  user_count INT;
BEGIN
  SELECT COUNT(*) INTO user_count
  FROM auth.users
  WHERE email IN ('macaulaydavid999@gmail.com', 'macaulayoreoluwa5002@gmail.com');

  IF user_count > 0 THEN
    -- Update profiles to set is_admin
    UPDATE profiles
    SET is_admin = true
    WHERE id IN (
      SELECT id FROM auth.users
      WHERE email IN ('macaulaydavid999@gmail.com', 'macaulayoreoluwa5002@gmail.com')
    );

    RAISE NOTICE 'Admin privileges granted to % users', user_count;
  ELSE
    RAISE NOTICE 'No users found with specified emails. Please sign up first.';
  END IF;
END $$;