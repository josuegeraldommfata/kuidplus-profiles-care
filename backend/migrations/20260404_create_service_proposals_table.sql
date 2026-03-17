-- Migration para tabela service_proposals (propostas para serviços)
CREATE TABLE IF NOT EXISTS service_proposals (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  contractor_id INTEGER REFERENCES users(id),
  title VARCHAR(255),
  message TEXT,
  proposed_value DECIMAL(10,2),
  availability_confirmed BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'enviada' CHECK (status IN ('enviada', 'aceita', 'recusada', 'em_negociacao')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Index para queries rápidas
CREATE INDEX idx_service_proposals_service_id ON service_proposals(service_id);
CREATE INDEX idx_service_proposals_professional_id ON service_proposals(professional_id);
CREATE INDEX idx_service_proposals_status ON service_proposals(status);

-- Trigger para update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_proposals_updated_at BEFORE UPDATE
  ON service_proposals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

