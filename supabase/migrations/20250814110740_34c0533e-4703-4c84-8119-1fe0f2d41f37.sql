-- Create table to store Zoho OAuth tokens securely
CREATE TABLE IF NOT EXISTS public.zoho_tokens (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  access_token TEXT NOT NULL,
  refresh_token TEXT,
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.zoho_tokens ENABLE ROW LEVEL SECURITY;

-- Only allow system access to tokens (no user access)
CREATE POLICY "Only system can manage tokens" 
ON public.zoho_tokens 
FOR ALL 
USING (false);