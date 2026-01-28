-- Drop the existing overly permissive INSERT policy
DROP POLICY IF EXISTS "Enable booking creation for all users" ON public.bookings;

-- Create a new INSERT policy that requires authentication and enforces user_id
CREATE POLICY "Authenticated users can create their own bookings" 
ON public.bookings 
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = user_id);