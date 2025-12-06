-- Performance Optimization: Materialized Views and Indexes
-- First, enable required extension
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- Create materialized view for proverb stats
CREATE MATERIALIZED VIEW IF NOT EXISTS proverb_stats AS
SELECT
  p.id AS proverb_id,
  COUNT(DISTINCT l.id) AS like_count,
  COUNT(DISTINCT c.id) AS comment_count,
  COUNT(DISTINCT b.id) AS bookmark_count
FROM proverbs p
LEFT JOIN likes l ON p.id = l.proverb_id
LEFT JOIN comments c ON p.id = c.proverb_id
LEFT JOIN bookmarks b ON p.id = b.proverb_id
GROUP BY p.id;

-- Create index on the materialized view for fast lookups
CREATE UNIQUE INDEX IF NOT EXISTS idx_proverb_stats_id ON proverb_stats(proverb_id);

-- Create function to refresh proverb stats
CREATE OR REPLACE FUNCTION refresh_proverb_stats()
RETURNS TRIGGER AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY proverb_stats;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Create triggers to refresh stats
CREATE TRIGGER refresh_stats_on_like
AFTER INSERT OR DELETE ON likes
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_proverb_stats();

CREATE TRIGGER refresh_stats_on_comment
AFTER INSERT OR DELETE ON comments
FOR EACH STATEMENT
EXECUTE FUNCTION refresh_proverb_stats();

-- Add missing indexes for common query patterns

-- Feed queries (filtering by country, language, verification)
CREATE INDEX IF NOT EXISTS idx_proverbs_feed 
ON proverbs(is_verified, created_at DESC)
INCLUDE (country, language);

-- User profile lookups (username search with fuzzy matching)
CREATE INDEX IF NOT EXISTS idx_profiles_username_trgm 
ON profiles USING gin(username gin_trgm_ops);

-- Follows lookups (finding followers/following)
CREATE INDEX IF NOT EXISTS idx_follows_follower 
ON follows(follower_id);

CREATE INDEX IF NOT EXISTS idx_follows_following 
ON follows(following_id);

-- Notification lookups (unread notifications)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
ON notifications(user_id, created_at DESC) 
WHERE is_read = false;

-- Search optimization for proverbs
CREATE INDEX IF NOT EXISTS idx_proverbs_search 
ON proverbs USING gin(to_tsvector('english', proverb || ' ' || meaning));
