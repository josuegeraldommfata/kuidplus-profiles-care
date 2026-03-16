-- Tabela de agendamentos/calendário para profissionais
CREATE TABLE IF NOT EXISTS schedules (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  time_slot TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professional_id, date, time_slot)
);

-- Tabela de disponibilidade semanal do profissional
CREATE TABLE IF NOT EXISTS professional_availability (
  id SERIAL PRIMARY KEY,
  professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6),
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(professional_id, day_of_week)
);

-- Índices para melhorar performance
CREATE INDEX idx_schedules_professional ON schedules(professional_id);
CREATE INDEX idx_schedules_date ON schedules(date);
CREATE INDEX idx_professional_availability_professional ON professional_availability(professional_id);
