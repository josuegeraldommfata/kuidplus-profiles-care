-- Add slug column to plans table
ALTER TABLE plans ADD COLUMN IF NOT EXISTS slug VARCHAR(255) UNIQUE;
