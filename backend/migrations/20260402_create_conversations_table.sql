-- Create conversations table for marketplace chat
CREATE TABLE IF NOT EXISTS conversations (
  id SERIAL PRIMARY KEY,
  contractor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  service_id INTEGER REFERENCES services(id) ON DELETE SET NULL,
  title VARCHAR(255),
  status VARCHAR(32) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(contractor_id, professional_id)
);

CREATE INDEX idx_conversations_service ON conversations(service_id);
CREATE INDEX idx_conversations_status ON conversations(status);

