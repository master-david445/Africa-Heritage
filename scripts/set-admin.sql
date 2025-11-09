-- Set admin privileges for macaulaydavid999@gmail.com
UPDATE profiles
SET is_admin = true
WHERE id IN (
  SELECT id FROM auth.users
  WHERE email = 'macaulaydavid999@gmail.com'
);