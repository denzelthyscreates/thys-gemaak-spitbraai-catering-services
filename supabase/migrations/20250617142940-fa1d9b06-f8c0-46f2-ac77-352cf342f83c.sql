
-- Add the booking_reference column to the bookings table
ALTER TABLE public.bookings 
ADD COLUMN booking_reference TEXT;

-- Add an index for performance on booking reference lookups
CREATE INDEX idx_bookings_booking_reference ON public.bookings(booking_reference);
