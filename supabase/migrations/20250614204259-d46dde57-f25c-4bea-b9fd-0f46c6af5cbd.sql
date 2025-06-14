
-- Add only the missing columns that don't already exist
ALTER TABLE public.bookings 
ADD COLUMN IF NOT EXISTS address_line1 TEXT,
ADD COLUMN IF NOT EXISTS address_line2 TEXT,
ADD COLUMN IF NOT EXISTS city TEXT,
ADD COLUMN IF NOT EXISTS province TEXT,
ADD COLUMN IF NOT EXISTS postal_code_address TEXT,
ADD COLUMN IF NOT EXISTS venue_name TEXT,
ADD COLUMN IF NOT EXISTS venue_street_address TEXT,
ADD COLUMN IF NOT EXISTS venue_city TEXT,
ADD COLUMN IF NOT EXISTS venue_province TEXT,
ADD COLUMN IF NOT EXISTS event_type TEXT,
ADD COLUMN IF NOT EXISTS referral_source TEXT;
