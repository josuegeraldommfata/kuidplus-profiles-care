-- Migration para sistema agenda/plantões - tabela de disponibilidades
CREATE TABLE IF NOT EXISTS service_availabilities (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, service_id, date, start_time)
);

CREATE INDEX idx_avail_professional_date ON service_availabilities(professional_id, date);
CREATE INDEX idx_avail_service_status ON service_availabilities(service_id, status);

-- Trigger para updated_at
CREATE OR REPLACE FUNCTION update_service_avail_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_avail_updated_at BEFORE UPDATE
  ON service_availabilities FOR EACH ROW EXECUTE FUNCTION update_service_avail_updated_at();

