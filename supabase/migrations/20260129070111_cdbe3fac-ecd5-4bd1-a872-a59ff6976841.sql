-- ============================================
-- SECURITY FIX 1: Create user_roles table for admin access control
-- ============================================

-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create user_roles table
CREATE TABLE public.user_roles (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    created_at timestamp with time zone NOT NULL DEFAULT now(),
    UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function FIRST to check roles (prevents RLS recursion)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

-- Users can view their own roles
CREATE POLICY "Users can view their own roles"
ON public.user_roles FOR SELECT
USING (auth.uid() = user_id);

-- Only admins can manage roles (now has_role function exists)
CREATE POLICY "Admins can manage roles"
ON public.user_roles FOR ALL
USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- SECURITY FIX 2: Fix bookings table - enforce user_id server-side
-- ============================================

-- Change user_id default to auth.uid() to enforce authenticated user's ID
ALTER TABLE public.bookings 
ALTER COLUMN user_id SET DEFAULT auth.uid();

-- Drop existing INSERT policy that allows user_id manipulation
DROP POLICY IF EXISTS "Authenticated users can create their own bookings" ON public.bookings;

-- Create a trigger to enforce user_id is always the authenticated user's ID
CREATE OR REPLACE FUNCTION public.enforce_booking_user_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Always set user_id to the authenticated user's ID, preventing spoofing
  NEW.user_id := auth.uid();
  
  -- Ensure user is authenticated
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create bookings';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger that runs before insert to enforce user_id
DROP TRIGGER IF EXISTS enforce_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER enforce_booking_user_id_trigger
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.enforce_booking_user_id();

-- New INSERT policy that allows authenticated users to insert (trigger handles user_id)
CREATE POLICY "Authenticated users can create bookings"
ON public.bookings FOR INSERT
TO authenticated
WITH CHECK (true);

-- ============================================
-- SECURITY FIX 3: Fix calendar_sync table - remove public write access
-- ============================================

-- Drop the dangerous public write policies
DROP POLICY IF EXISTS "Allow public write access to calendar sync" ON public.calendar_sync;
DROP POLICY IF EXISTS "Allow public read access to calendar sync" ON public.calendar_sync;

-- Keep authenticated read access but restrict write to admins only
-- Drop any duplicate policies first
DROP POLICY IF EXISTS "Authenticated users can view sync status" ON public.calendar_sync;

CREATE POLICY "Authenticated users can view sync status"
ON public.calendar_sync FOR SELECT
TO authenticated
USING (true);

-- Only admins can modify calendar sync data
CREATE POLICY "Only admins can modify calendar sync"
ON public.calendar_sync FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));