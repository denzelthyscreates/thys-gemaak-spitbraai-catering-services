-- Fix the overly permissive INSERT policy on bookings table
-- The trigger already enforces user_id = auth.uid(), but the policy should also check this

-- Drop the existing overly permissive insert policy
DROP POLICY IF EXISTS "Authenticated users can create bookings" ON public.bookings;

-- Create a more restrictive INSERT policy that explicitly checks user_id
-- This works in conjunction with the enforce_booking_user_id trigger
-- The trigger sets user_id = auth.uid(), so this policy will pass after the trigger runs
CREATE POLICY "Users can only create bookings for themselves"
ON public.bookings
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);