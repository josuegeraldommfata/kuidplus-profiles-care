-- Migration adicionar localização aos users (lat/lng GRÁTIS)
ALTER TABLE users ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE users ADD COLUMN IF NOT EXISTS location_updated_at TIMESTAMP DEFAULT NOW();

-- Index para queries Haversine performance
CREATE INDEX IF NOT EXISTS idx_users_location ON users USING GIST (point(longitude, latitude));

-- Trigger auto update location_updated_at
CREATE OR REPLACE FUNCTION update_users_location_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.location_updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_users_location_updated_at ON users;
CREATE TRIGGER update_users_location_updated_at BEFORE UPDATE OF latitude, longitude
  ON users FOR EACH ROW EXECUTE FUNCTION update_users_location_updated_at();

-- Dados teste Campinas região
UPDATE users SET latitude = -22.9099, longitude = -47.0653 WHERE id = 3; -- Prof Campinas
UPDATE users SET latitude = -23.5505, longitude = -46.6333 WHERE id = 4; -- Prof SP
UPDATE users SET latitude = -22.9068, longitude = -43.1729 WHERE id = 5; -- Prof RJ

