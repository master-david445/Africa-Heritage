-- Add index on username for faster lookups during login
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);