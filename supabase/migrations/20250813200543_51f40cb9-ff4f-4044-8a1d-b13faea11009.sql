-- Fix critical security vulnerability in bookings table RLS policies
-- Step 1: Update existing NULL user_id entries first
UPDATE public.bookings 
SET user_id = gen_random_uuid() 
WHERE user_id IS NULL;

-- Step 2: Remove the dangerous policy that exposes customer data
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Step 3: Create a secure policy that only allows users to view their own bookings
CREATE POLICY "Users can view their own bookings only" ON public.bookings
FOR SELECT 
USING (auth.uid() = user_id);

-- Step 4: Make user_id required for future bookings
ALTER TABLE public.bookings ALTER COLUMN user_id SET NOT NULL;