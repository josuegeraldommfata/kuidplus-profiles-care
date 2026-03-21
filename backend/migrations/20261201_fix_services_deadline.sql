-- Fix services table - Remove deadline se não existe
DO $$
BEGIN
  IF EXISTS (
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name='services' and column_name='deadline'
  ) THEN
    ALTER TABLE services DROP COLUMN IF EXISTS deadline;
  END IF;
END $$;

-- Add missing columns if needed
ALTER TABLE services ADD COLUMN IF NOT EXISTS budget_min DECIMAL;
ALTER TABLE services ADD COLUMN IF NOT EXISTS budget_max DECIMAL;

