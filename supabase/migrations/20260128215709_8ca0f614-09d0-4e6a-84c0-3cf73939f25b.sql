-- Drop the existing policy that allows public access
DROP POLICY IF EXISTS "Enable reading own bookings" ON public.bookings;

-- Create a new policy that only allows authenticated users to read their own bookings
CREATE POLICY "Enable reading own bookings" 
ON public.bookings 
FOR SELECT 
USING (auth.uid() = user_id);