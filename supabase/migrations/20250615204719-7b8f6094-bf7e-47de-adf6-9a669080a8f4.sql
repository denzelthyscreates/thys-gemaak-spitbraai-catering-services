
-- Enable RLS on calendar_sync table and create policies for public access
ALTER TABLE public.calendar_sync ENABLE ROW LEVEL SECURITY;

-- Allow public read access to calendar sync status (since this is operational data)
CREATE POLICY "Allow public read access to calendar sync" 
  ON public.calendar_sync 
  FOR SELECT 
  USING (true);

-- Allow public insert/update for sync operations (since this is operational data)
CREATE POLICY "Allow public write access to calendar sync" 
  ON public.calendar_sync 
  FOR ALL 
  USING (true);
