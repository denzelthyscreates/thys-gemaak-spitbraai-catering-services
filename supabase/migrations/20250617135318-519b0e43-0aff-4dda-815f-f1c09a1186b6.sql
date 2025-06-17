
-- Check what policies already exist and create only the missing ones
-- First, let's create the policy for authenticated users to view their own bookings
CREATE POLICY "Allow users to view their own bookings" 
ON public.bookings 
FOR SELECT 
TO authenticated
USING (auth.uid() = user_id);

-- Allow authenticated users to update their own bookings
CREATE POLICY "Allow users to update their own bookings" 
ON public.bookings 
FOR UPDATE 
TO authenticated
USING (auth.uid() = user_id);
