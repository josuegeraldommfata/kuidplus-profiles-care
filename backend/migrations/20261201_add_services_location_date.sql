-- Adiciona colunas faltantes na tabela services
ALTER TABLE services ADD COLUMN IF NOT EXISTS state VARCHAR(2);
ALTER TABLE services ADD COLUMN IF NOT EXISTS date DATE;
ALTER TABLE services ADD COLUMN IF NOT EXISTS start_time TIME;
ALTER TABLE services ADD COLUMN IF NOT EXISTS end_time TIME;
ALTER TABLE services ADD COLUMN IF NOT EXISTS location TEXT;

-- Fix coluna deadline se existir
ALTER TABLE services DROP COLUMN IF EXISTS deadline;

