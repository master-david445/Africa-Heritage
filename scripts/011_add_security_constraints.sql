-- Add check constraint for username format
-- This ensures usernames only contain alphanumeric characters and underscores, and are 3-30 characters long
ALTER TABLE public.profiles
ADD CONSTRAINT username_format_check
CHECK (username ~* '^[a-zA-Z0-9_]{3,30}$');

-- Add check constraint for points to be non-negative
ALTER TABLE public.profiles
ADD CONSTRAINT points_non_negative_check
CHECK (points >= 0);

-- Add check constraint for country length (optional, but good practice)
ALTER TABLE public.profiles
ADD CONSTRAINT country_length_check
CHECK (length(country) <= 100);

-- Add check constraint for bio length
ALTER TABLE public.profiles
ADD CONSTRAINT bio_length_check
CHECK (length(bio) <= 500);

-- Ensure email is unique in profiles if it exists (it should be unique per user in auth.users, but good to enforce here too if we store it)
-- Note: profiles.id is PK and references auth.users.id, so 1:1 mapping is enforced.
-- But if we store email, it should also be unique to avoid confusion (though technically one person could have multiple profiles if not for the PK constraint).
-- Since id is PK, we can't have duplicate users.
-- But we could have different users with same email in profiles? No, email should be unique.
ALTER TABLE public.profiles
ADD CONSTRAINT profiles_email_unique
UNIQUE (email);
