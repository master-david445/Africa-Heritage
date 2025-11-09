-- Set admin privileges for specified email addresses
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email IN ('macaulaydavid999@gmail.com', 'macaulayoreoluwa5002@gmail.com')
);