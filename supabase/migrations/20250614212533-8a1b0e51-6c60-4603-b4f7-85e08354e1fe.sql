
-- Add the menu_selection column to the bookings table
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS menu_selection JSONB;
