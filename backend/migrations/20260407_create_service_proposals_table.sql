-- Migration service_proposals table (99Freelas proposals)
CREATE TABLE IF NOT EXISTS service_proposals (
  id SERIAL PRIMARY KEY,
  service_id INTEGER REFERENCES services(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected')),
  amount DECIMAL(10,2) NOT NULL,
  message TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_service_proposals_service ON service_proposals(service_id);
CREATE INDEX idx_service_proposals_professional ON service_proposals(professional_id);
CREATE INDEX idx_service_proposals_status ON service_proposals(status);

-- Trigger updated_at
CREATE OR REPLACE FUNCTION update_service_proposal_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_service_proposal_updated_at BEFORE UPDATE
  ON service_proposals FOR EACH ROW EXECUTE FUNCTION update_service_proposal_updated_at();

-- Seed dados teste
INSERT INTO services (contractor_id, title, description, profession, city, budget_min, budget_max, deadline, status)
VALUES
  (1, 'Fisioterapia pós-cirúrgica', 'Recuperação joelho - 3 sessões', 'Fisioterapeuta', 'Campinas', 150, 250, '2025-04-20', 'open'),
  (2, 'Avaliação fonoaudiológica', 'Criança 5 anos - dificuldade fala', 'Fonoaudiólogo', 'São Paulo', 200, 350, '2025-04-15', 'open');

INSERT INTO service_proposals (service_id, professional_id, amount, message, status)
VALUES
  (1, 3, 180.00, 'Disponível terça 14h-16h', 'pending'),
  (1, 4, 220.00, 'Especialista joelho - certificado', 'accepted');

