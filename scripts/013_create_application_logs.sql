-- Create application logs table
CREATE TABLE IF NOT EXISTS public.application_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  level TEXT NOT NULL CHECK (level IN ('info', 'warn', 'error', 'debug')),
  message TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  path TEXT,
  method TEXT,
  status_code INT,
  duration_ms INT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.application_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view logs
CREATE POLICY "Admins can view application logs"
  ON public.application_logs
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE id = auth.uid() AND is_admin = true
    )
  );

-- Service role can insert logs (for server-side logging)
-- Authenticated users can insert logs (for client-side error reporting)
CREATE POLICY "Users can insert logs"
  ON public.application_logs
  FOR INSERT
  WITH CHECK (true);

-- Create index for faster querying
CREATE INDEX IF NOT EXISTS idx_application_logs_level ON public.application_logs(level);
CREATE INDEX IF NOT EXISTS idx_application_logs_created_at ON public.application_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_application_logs_user_id ON public.application_logs(user_id);
