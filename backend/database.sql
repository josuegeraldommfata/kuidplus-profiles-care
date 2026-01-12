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
    references JSONB,
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
