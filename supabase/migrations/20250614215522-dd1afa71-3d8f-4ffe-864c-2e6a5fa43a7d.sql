
-- Only create the anonymous booking creation policy (the key one we need)
CREATE POLICY "Allow anonymous booking creation" 
ON public.bookings 
FOR INSERT 
TO anon, authenticated
WITH CHECK (true);
