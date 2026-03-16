-- Create proposals table (missing)
CREATE TABLE IF NOT EXISTS proposals (
  id SERIAL PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  profession TEXT,
  city TEXT,
  state TEXT,
  contractor_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  status VARCHAR(32) DEFAULT 'open',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_proposals_profession ON proposals(profession);
CREATE INDEX IF NOT EXISTS idx_proposals_city ON proposals(city);
CREATE INDEX IF NOT EXISTS idx_proposals_contractor ON proposals(contractor_id);
