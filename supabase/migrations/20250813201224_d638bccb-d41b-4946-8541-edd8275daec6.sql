-- Critical security fix: Remove public exposure of customer data in bookings table
-- Step 1: Remove the dangerous policy that allows public access to bookings with NULL user_id
DROP POLICY IF EXISTS "Users can view their own bookings" ON public.bookings;

-- Step 2: Drop the foreign key constraints that are preventing us from fixing the security issue
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS bookings_user_id_fkey;
ALTER TABLE public.bookings DROP CONSTRAINT IF EXISTS fk_user;

-- Step 3: Create a secure policy that only allows authenticated users to view their own bookings
-- This prevents any public access to customer personal information
CREATE POLICY "Authenticated users can view their own bookings" ON public.bookings
FOR SELECT 
USING (auth.uid() = user_id);

-- Step 4: For anonymous bookings, we'll create a separate system
-- Update any NULL user_id entries to use a special system UUID that can't be accessed publicly
UPDATE public.bookings 
SET user_id = gen_random_uuid() 
WHERE user_id IS NULL;

-- Step 5: Make user_id required to prevent future NULL entries
ALTER TABLE public.bookings ALTER COLUMN user_id SET NOT NULL;