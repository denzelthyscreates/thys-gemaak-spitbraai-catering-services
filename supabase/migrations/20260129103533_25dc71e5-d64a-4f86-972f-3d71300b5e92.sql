-- Fix the overly permissive policy on calendar_sync table
-- Remove the policy that allows any authenticated user to modify sync status

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Authenticated users can update sync status" ON public.calendar_sync;

-- The existing policies are sufficient:
-- "Authenticated users can view sync status" - SELECT with USING (true) - keeps public read access
-- "Only admins can modify calendar sync" - ALL with has_role(auth.uid(), 'admin') - restricts writes to admins

-- Note: Edge functions using service role will bypass RLS, so google-calendar-sync will continue to work