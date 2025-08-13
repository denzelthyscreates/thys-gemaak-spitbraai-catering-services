-- Fix critical security vulnerability in bookings table RLS policies
-- Remove the dangerous OR (user_id IS NULL) condition that exposes customer data publicly

-- First, drop the problematic policy
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Create a secure policy that only allows users to view their own bookings
-- This ensures customer data is never publicly accessible
CREATE POLICY "Users can view their own bookings only" ON public.bookings
FOR SELECT 
USING (auth.uid() = user_id);

-- For anonymous bookings, we'll need to ensure user_id is always set
-- Update the user_id column to not be nullable and always have a value
ALTER TABLE public.bookings ALTER COLUMN user_id SET NOT NULL;

-- Update any existing NULL user_id entries to have a generated UUID
-- This prevents data loss while securing existing records
UPDATE public.bookings 
SET user_id = gen_random_uuid() 
WHERE user_id IS NULL;