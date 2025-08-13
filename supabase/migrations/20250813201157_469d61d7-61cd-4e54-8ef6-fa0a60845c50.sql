-- Check what foreign key constraint exists on user_id
SELECT 
    conname AS constraint_name,
    confrelid::regclass AS foreign_table,
    a.attname AS column_name,
    af.attname AS foreign_column
FROM pg_constraint c
JOIN pg_attribute a ON a.attnum = ANY(c.conkey) 
    AND a.attrelid = c.conrelid
JOIN pg_attribute af ON af.attnum = ANY(c.confkey) 
    AND af.attrelid = c.confrelid
WHERE c.conrelid = 'public.bookings'::regclass 
    AND c.contype = 'f'
    AND a.attname = 'user_id';