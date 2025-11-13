-- Create proverb_of_the_day_tracker table
CREATE TABLE IF NOT EXISTS public.proverb_of_the_day_tracker (
  id SERIAL PRIMARY KEY,
  current_index INTEGER NOT NULL DEFAULT 0,
  last_reset_date DATE NOT NULL DEFAULT CURRENT_DATE
);

-- Enable Row Level Security
ALTER TABLE public.proverb_of_the_day_tracker ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow all operations for proverb of the day tracker since it's a global feature)
CREATE POLICY "proverb_of_the_day_tracker_select_all"
  ON public.proverb_of_the_day_tracker FOR SELECT
  USING (TRUE);

CREATE POLICY "proverb_of_the_day_tracker_insert_all"
  ON public.proverb_of_the_day_tracker FOR INSERT
  WITH CHECK (TRUE);

CREATE POLICY "proverb_of_the_day_tracker_update_all"
  ON public.proverb_of_the_day_tracker FOR UPDATE
  USING (TRUE);

-- Insert initial record
INSERT INTO public.proverb_of_the_day_tracker (current_index, last_reset_date)
VALUES (0, CURRENT_DATE)
ON CONFLICT DO NOTHING;