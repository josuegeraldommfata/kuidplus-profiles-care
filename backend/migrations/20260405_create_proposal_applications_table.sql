-- Migration para tabela proposal_applications (aplicações/propostas para services)
CREATE TABLE IF NOT EXISTS proposal_applications (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  contractor_id INTEGER REFERENCES users(id),
  message TEXT,
  proposed_value DECIMAL(10,2),
  availability_confirmed BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'enviada' CHECK (status IN ('enviada', 'aceita', 'recusada', 'cancelada')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_proposal_applications_service_id ON proposal_applications(service_id);
CREATE INDEX idx_proposal_applications_professional_id ON proposal_applications(professional_id);
CREATE INDEX idx_proposal_applications_status ON proposal_applications(status);

-- Trigger updated_at
CREATE TRIGGER update_proposal_applications_updated_at BEFORE UPDATE
  ON proposal_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

