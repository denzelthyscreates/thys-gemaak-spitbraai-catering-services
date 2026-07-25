
-- Tighten SECURITY DEFINER function exposure
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
REVOKE EXECUTE ON FUNCTION public.enforce_booking_user_id() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_event_availability_on_booking() FROM PUBLIC, anon, authenticated;

-- Hide public tables from the pg_graphql API (this project uses PostgREST only)
REVOKE USAGE ON SCHEMA graphql_public FROM anon, authenticated;

-- Scope bookings SELECT policy to authenticated role only
DROP POLICY IF EXISTS "Enable reading own bookings" ON public.bookings;
CREATE POLICY "Enable reading own bookings"
  ON public.bookings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Restrict calendar_sync visibility to admins (was any authenticated user)
DROP POLICY IF EXISTS "Authenticated users can view sync status" ON public.calendar_sync;
CREATE POLICY "Only admins can view sync status"
  ON public.calendar_sync
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::public.app_role));
