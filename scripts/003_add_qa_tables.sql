-- Migration: Add Q&A tables and related functionality
-- This migration adds tables for a Q&A system with voting, following, and notifications

-- Create answers table
CREATE TABLE IF NOT EXISTS public.answers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.proverbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  vote_count INTEGER DEFAULT 0,
  is_accepted BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create votes table
CREATE TABLE IF NOT EXISTS public.votes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  answer_id UUID NOT NULL REFERENCES public.answers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('upvote', 'downvote')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(answer_id, user_id)
);

-- Create question_follows table
CREATE TABLE IF NOT EXISTS public.question_follows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question_id UUID NOT NULL REFERENCES public.proverbs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(question_id, user_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  related_id UUID,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add columns to existing proverbs table
ALTER TABLE public.proverbs ADD COLUMN IF NOT EXISTS answer_count INTEGER DEFAULT 0;
ALTER TABLE public.proverbs ADD COLUMN IF NOT EXISTS follower_count INTEGER DEFAULT 0;

-- Add column to existing profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS reputation_score INTEGER DEFAULT 0;

-- Enable Row Level Security on new tables
ALTER TABLE public.answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.question_follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- RLS Policies for answers
CREATE POLICY "answers_select_public"
  ON public.answers FOR SELECT
  USING (TRUE);

CREATE POLICY "answers_insert_authenticated"
  ON public.answers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "answers_update_own"
  ON public.answers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "answers_delete_own"
  ON public.answers FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for votes
CREATE POLICY "votes_select_public"
  ON public.votes FOR SELECT
  USING (TRUE);

CREATE POLICY "votes_insert_authenticated"
  ON public.votes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "votes_delete_own"
  ON public.votes FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for question_follows
CREATE POLICY "question_follows_select_public"
  ON public.question_follows FOR SELECT
  USING (TRUE);

CREATE POLICY "question_follows_insert_authenticated"
  ON public.question_follows FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "question_follows_delete_own"
  ON public.question_follows FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for notifications
CREATE POLICY "notifications_select_own"
  ON public.notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_insert_authenticated"
  ON public.notifications FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "notifications_update_own"
  ON public.notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "notifications_delete_own"
  ON public.notifications FOR DELETE
  USING (auth.uid() = user_id);

-- Stored procedures

-- Increment answer count on proverbs
DROP FUNCTION IF EXISTS public.increment_answer_count(UUID);
CREATE OR REPLACE FUNCTION public.increment_answer_count(proverb_id UUID)
RETURNS VOID AS $$
BEGIN
  IF proverb_id IS NULL THEN
    RAISE EXCEPTION 'proverb_id cannot be null';
  END IF;
  UPDATE public.proverbs SET answer_count = answer_count + 1 WHERE id = proverb_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Decrement answer count on proverbs
DROP FUNCTION IF EXISTS public.decrement_answer_count(UUID);
CREATE OR REPLACE FUNCTION public.decrement_answer_count(proverb_id UUID)
RETURNS VOID AS $$
BEGIN
  IF proverb_id IS NULL THEN
    RAISE EXCEPTION 'proverb_id cannot be null';
  END IF;
  UPDATE public.proverbs SET answer_count = GREATEST(answer_count - 1, 0) WHERE id = proverb_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Increment follower count on proverbs
DROP FUNCTION IF EXISTS public.increment_follower_count(UUID);
CREATE OR REPLACE FUNCTION public.increment_follower_count(proverb_id UUID)
RETURNS VOID AS $$
BEGIN
  IF proverb_id IS NULL THEN
    RAISE EXCEPTION 'proverb_id cannot be null';
  END IF;
  UPDATE public.proverbs SET follower_count = follower_count + 1 WHERE id = proverb_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Decrement follower count on proverbs
DROP FUNCTION IF EXISTS public.decrement_follower_count(UUID);
CREATE OR REPLACE FUNCTION public.decrement_follower_count(proverb_id UUID)
RETURNS VOID AS $$
BEGIN
  IF proverb_id IS NULL THEN
    RAISE EXCEPTION 'proverb_id cannot be null';
  END IF;
  UPDATE public.proverbs SET follower_count = GREATEST(follower_count - 1, 0) WHERE id = proverb_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Increment vote count on answers
DROP FUNCTION IF EXISTS public.increment_vote_count(UUID, INT);
CREATE OR REPLACE FUNCTION public.increment_vote_count(answer_id UUID, vote_change INT)
RETURNS VOID AS $$
BEGIN
  IF answer_id IS NULL THEN
    RAISE EXCEPTION 'answer_id cannot be null';
  END IF;
  UPDATE public.answers SET vote_count = vote_count + vote_change WHERE id = answer_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Increment user points on profiles
DROP FUNCTION IF EXISTS public.increment_user_points(UUID, INTEGER);
CREATE OR REPLACE FUNCTION public.increment_user_points(user_id UUID, points INTEGER)
RETURNS VOID AS $$
BEGIN
  IF user_id IS NULL THEN
    RAISE EXCEPTION 'user_id cannot be null';
  END IF;
  IF points IS NULL OR points < 0 THEN
    RAISE EXCEPTION 'points must be a positive integer';
  END IF;
  UPDATE public.profiles SET points = points + points WHERE id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_answers_question_id ON public.answers(question_id);
CREATE INDEX IF NOT EXISTS idx_answers_user_id ON public.answers(user_id);
CREATE INDEX IF NOT EXISTS idx_votes_answer_id ON public.votes(answer_id);
CREATE INDEX IF NOT EXISTS idx_votes_user_id ON public.votes(user_id);
CREATE INDEX IF NOT EXISTS idx_question_follows_question_id ON public.question_follows(question_id);
CREATE INDEX IF NOT EXISTS idx_question_follows_user_id ON public.question_follows(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);