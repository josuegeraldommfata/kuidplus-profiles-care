-- Migration: add corem and background check fields to professionals

ALTER TABLE professionals
  ADD COLUMN IF NOT EXISTS corem VARCHAR(255),
  ADD COLUMN IF NOT EXISTS background_check_file TEXT,
  ADD COLUMN IF NOT EXISTS background_check_notes TEXT;

-- Optionally set background_check default to false if not present
ALTER TABLE professionals
  ALTER COLUMN background_check SET DEFAULT FALSE;
