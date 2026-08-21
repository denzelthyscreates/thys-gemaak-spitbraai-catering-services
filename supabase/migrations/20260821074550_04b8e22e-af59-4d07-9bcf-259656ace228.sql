-- ============================================================================
-- Consolidated schema for the Thys Gemaak Spitbraai backend.
-- Reproduces the FINAL state of the old Supabase project (pcvmdyhzufupgckszrdy)
-- in one migration. Run this FIRST on the new Lovable Cloud backend, then
-- 02_data.sql.
-- ============================================================================

-- 1. Enum -------------------------------------------------------------------
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'app_role') THEN
    CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');
  END IF;
END
$$;

-- 2. Tables + grants + RLS + policies ---------------------------------------

-- user_roles ----------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- has_role must exist before policies that use it
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated, service_role;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- bookings ------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz NOT NULL DEFAULT now(),
  user_id uuid NOT NULL DEFAULT auth.uid(),
  menu_package text NOT NULL,
  number_of_guests integer NOT NULL,
  season text,
  starters text,
  sides text,
  desserts text,
  extras text,
  extra_salad_type text,
  total_price numeric NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  event_date timestamptz,
  contact_name text NOT NULL,
  contact_email text NOT NULL,
  contact_phone text NOT NULL,
  notes text NOT NULL,
  venue_postal_code text,
  additional_notes text,
  address_line1 text,
  address_line2 text,
  city text,
  province text,
  postal_code_address text,
  venue_name text,
  venue_street_address text,
  venue_city text,
  venue_province text,
  event_type text,
  referral_source text,
  menu_selection jsonb,
  booking_reference text
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.bookings TO authenticated;
GRANT ALL ON public.bookings TO service_role;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can only create bookings for themselves"
  ON public.bookings FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable reading own bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Enable updating own bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Enable deleting own bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all bookings"
  ON public.bookings FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all bookings"
  ON public.bookings FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can delete all bookings"
  ON public.bookings FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- blocked_dates -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.blocked_dates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL,
  reason text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blocked_dates TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blocked_dates TO authenticated;
GRANT ALL ON public.blocked_dates TO service_role;
ALTER TABLE public.blocked_dates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view blocked dates"
  ON public.blocked_dates FOR SELECT USING (true);
CREATE POLICY "Only admins can manage blocked dates"
  ON public.blocked_dates FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- event_availability --------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.event_availability (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  date date NOT NULL UNIQUE,
  is_available boolean NOT NULL DEFAULT true,
  max_events integer DEFAULT 1,
  booked_events integer DEFAULT 0,
  google_calendar_events jsonb DEFAULT '[]'::jsonb,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.event_availability TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.event_availability TO authenticated;
GRANT ALL ON public.event_availability TO service_role;
ALTER TABLE public.event_availability ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view event availability"
  ON public.event_availability FOR SELECT USING (true);
CREATE POLICY "Only admins can modify event availability"
  ON public.event_availability FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- calendar_sync -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.calendar_sync (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  last_sync timestamptz NOT NULL DEFAULT now(),
  sync_status text NOT NULL DEFAULT 'success',
  error_message text,
  events_synced integer DEFAULT 0
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.calendar_sync TO authenticated;
GRANT ALL ON public.calendar_sync TO service_role;
ALTER TABLE public.calendar_sync ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only admins can view sync status"
  ON public.calendar_sync FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Only admins can modify calendar sync"
  ON public.calendar_sync FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- zoho_tokens ---------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.zoho_tokens (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  access_token text NOT NULL,
  refresh_token text,
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT ALL ON public.zoho_tokens TO service_role;
ALTER TABLE public.zoho_tokens ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Only system can manage tokens"
  ON public.zoho_tokens FOR ALL USING (false);

-- 3. Trigger functions ------------------------------------------------------

CREATE OR REPLACE FUNCTION public.enforce_booking_user_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.user_id := auth.uid();
  IF NEW.user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required to create bookings';
  END IF;
  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.enforce_booking_user_id() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.update_event_availability_on_booking()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF NEW.status = 'confirmed' AND (OLD.status IS NULL OR OLD.status != 'confirmed') THEN
    INSERT INTO public.event_availability (date, booked_events)
    VALUES (NEW.event_date::DATE, 1)
    ON CONFLICT (date)
    DO UPDATE SET
      booked_events = public.event_availability.booked_events + 1,
      is_available = CASE
        WHEN public.event_availability.booked_events + 1 >= public.event_availability.max_events
        THEN false ELSE true END,
      updated_at = now();
  END IF;

  IF NEW.status = 'cancelled' AND OLD.status = 'confirmed' THEN
    UPDATE public.event_availability
    SET booked_events = GREATEST(0, booked_events - 1),
        is_available = CASE WHEN booked_events - 1 < max_events THEN true ELSE is_available END,
        updated_at = now()
    WHERE date = OLD.event_date::DATE;
  END IF;

  RETURN NEW;
END;
$$;
REVOKE EXECUTE ON FUNCTION public.update_event_availability_on_booking() FROM PUBLIC, anon, authenticated;

-- 4. Triggers ---------------------------------------------------------------
DROP TRIGGER IF EXISTS enforce_booking_user_id_trigger ON public.bookings;
CREATE TRIGGER enforce_booking_user_id_trigger
  BEFORE INSERT ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.enforce_booking_user_id();

DROP TRIGGER IF EXISTS booking_status_change_trigger ON public.bookings;
CREATE TRIGGER booking_status_change_trigger
  AFTER UPDATE ON public.bookings
  FOR EACH ROW EXECUTE FUNCTION public.update_event_availability_on_booking();

-- 5. Security hardening carried over ----------------------------------------
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;

COMMENT ON TABLE public.bookings IS e'@graphql({"visible": false})';
COMMENT ON TABLE public.blocked_dates IS e'@graphql({"visible": false})';
COMMENT ON TABLE public.calendar_sync IS e'@graphql({"visible": false})';
COMMENT ON TABLE public.event_availability IS e'@graphql({"visible": false})';
COMMENT ON TABLE public.user_roles IS e'@graphql({"visible": false})';
COMMENT ON TABLE public.zoho_tokens IS e'@graphql({"visible": false})';