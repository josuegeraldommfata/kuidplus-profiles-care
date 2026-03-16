-- Create proposals table
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

-- Applications by professionals to proposals
CREATE TABLE IF NOT EXISTS proposal_applications (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  message TEXT,
  expected_budget NUMERIC(10,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Messages table (chat)
CREATE TABLE IF NOT EXISTS messages (
  id SERIAL PRIMARY KEY,
  sender_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  receiver_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
  proposal_id INTEGER REFERENCES proposals(id) ON DELETE SET NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_messages_proposal ON messages(proposal_id);
CREATE INDEX IF NOT EXISTS idx_proposals_profession ON proposals(profession);
