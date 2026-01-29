-- Fix overly permissive RLS policies on event_availability and blocked_dates tables
-- Both tables currently allow ANY authenticated user to modify them

-- ============================================
-- FIX: event_availability table
-- ============================================

-- Drop the overly permissive policy that allows any authenticated user to modify
DROP POLICY IF EXISTS "Authenticated users can update availability" ON public.event_availability;

-- Create admin-only write policy
CREATE POLICY "Only admins can modify event availability"
ON public.event_availability
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Keep existing: "Anyone can view event availability" - SELECT with USING (true)

-- ============================================
-- FIX: blocked_dates table
-- ============================================

-- Drop the overly permissive policy that allows any authenticated user to manage
DROP POLICY IF EXISTS "Authenticated users can manage blocked dates" ON public.blocked_dates;

-- Create admin-only write policy
CREATE POLICY "Only admins can manage blocked dates"
ON public.blocked_dates
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Keep existing: "Anyone can view blocked dates" - SELECT with USING (true)

-- Note: Edge functions using service role bypass RLS, so google-calendar-sync will continue to work