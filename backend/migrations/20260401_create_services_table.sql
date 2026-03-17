-- Create services table for marketplace
CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  category VARCHAR(100),
  profession VARCHAR(100),
  city VARCHAR(100),
  state VARCHAR(50),
  contractor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  budget_min NUMERIC(10,2),
  budget_max NUMERIC(10,2),
  status VARCHAR(32) DEFAULT 'open',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_services_contractor ON services(contractor_id);
CREATE INDEX idx_services_profession ON services(profession);
CREATE INDEX idx_services_city ON services(city);
CREATE INDEX idx_services_status ON services(status);

