-- Database schema for KUID+ application

-- Create database
CREATE DATABASE IF NOT EXISTS kuidplus;
\c kuidplus;

-- Users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'contratante',
    profile_image TEXT,
    email_confirmed BOOLEAN DEFAULT FALSE,
    email_confirmation_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Professionals table
CREATE TABLE IF NOT EXISTS professionals (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    birth_date DATE,
    sex VARCHAR(20),
    city VARCHAR(100),
    state VARCHAR(2),
    region VARCHAR(100),
    whatsapp VARCHAR(20),
    email VARCHAR(255),
    profession VARCHAR(100),
    profile_image TEXT,
    video_url TEXT,
    bio TEXT,
    experience_years INTEGER,
    courses JSONB,
    certificates JSONB,
    service_area TEXT,
    service_radius INTEGER,
    hospitals JSONB,
    availability VARCHAR(20),
    price_range JSONB,
    rating DECIMAL(3,2) DEFAULT 0,
    total_ratings INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending',
    background_check BOOLEAN DEFAULT FALSE,
    whatsapp_clicks INTEGER DEFAULT 0,
    weekly_views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_highlighted BOOLEAN DEFAULT FALSE,
    highlight_phrase TEXT,
    reference_data JSONB,
    trial_ends_at TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_state ON professionals(state);
CREATE INDEX IF NOT EXISTS idx_professionals_profession ON professionals(profession);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);
CREATE INDEX IF NOT EXISTS idx_professionals_is_highlighted ON professionals(is_highlighted);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON professionals(rating DESC);

-- Insert some sample data (optional)
-- You can run this separately if you want to populate with initial data

-- Insert demo users with plain text passwords (backend will hash on first login)
INSERT INTO users (email, password, name, role, email_confirmed) VALUES
('enfermeiro@kuid.com', '123456', 'João Enfermeiro', 'profissional', true),
('tecnico@kuid.com', '123456', 'Maria Técnica', 'profissional', true),
('contratante@kuid.com', '123456', 'Carlos Contratante', 'contratante', true),
('admin@kuid.com', '123456', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Conversations table for chat between clients and professionals
CREATE TABLE IF NOT EXISTS conversations (
    id SERIAL PRIMARY KEY,
    client_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    professional_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'active', -- active, archived, blocked
    last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(client_id, professional_id)
);

-- Messages table for chat messages
CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    conversation_id INTEGER REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    message_type VARCHAR(20) DEFAULT 'text', -- text, image, file
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_conversations_client_id ON conversations(client_id);
CREATE INDEX IF NOT EXISTS idx_conversations_professional_id ON conversations(professional_id);
CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at DESC);

-- Insert professional data for demo users
INSERT INTO professionals (user_id, name, email, profession, city, state, rating, status, bio)
SELECT u.id, 'João Enfermeiro', 'enfermeiro@kuid.com', 'Enfermeiro', 'São Paulo', 'SP', 4.8, 'approved', 'Enfermeiro experiente com 5 anos de atuação.'
FROM users u WHERE u.email = 'enfermeiro@kuid.com'
ON CONFLICT DO NOTHING;

INSERT INTO professionals (user_id, name, email, profession, city, state, rating, status, bio)
SELECT u.id, 'Maria Técnica', 'tecnico@kuid.com', 'Técnico de Enfermagem', 'Rio de Janeiro', 'RJ', 4.5, 'approved', 'Técnica especializada em cuidados domiciliares.'
FROM users u WHERE u.email = 'tecnico@kuid.com'
ON CONFLICT DO NOTHING;
