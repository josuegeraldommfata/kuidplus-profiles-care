-- Migração AVAILABILITIES - Agenda profissionais
CREATE TABLE IF NOT EXISTS availabilities (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  status VARCHAR(20) DEFAULT 'available' CHECK (status IN ('available', 'booked', 'cancelled')),
  service_title VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(professional_id, date, start_time)
);

CREATE INDEX idx_avail_prof_date ON availabilities(professional_id, date);
CREATE INDEX idx_avail_status ON availabilities(status);

