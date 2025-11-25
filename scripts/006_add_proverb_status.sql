-- Add status column to proverbs table
ALTER TABLE public.proverbs 
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'pending' 
CHECK (status IN ('pending', 'approved', 'rejected'));

-- Add rejection_reason column
ALTER TABLE public.proverbs 
ADD COLUMN IF NOT EXISTS rejection_reason TEXT;

-- Update existing proverbs to be approved
UPDATE public.proverbs SET status = 'approved' WHERE status = 'pending';

-- Create index for faster filtering by status
CREATE INDEX IF NOT EXISTS idx_proverbs_status ON public.proverbs(status);
