-- Script completo para criar todas as tabelas do sistema KUID+
-- Execute este script no PostgreSQL para configurar o banco de dados

-- Criar banco de dados (execute separadamente se necessário)
-- CREATE DATABASE kuidplus;
-- \c kuidplus;

-- Tabela de usuários
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

-- Tabela de profissionais
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
    trial_ends_at TIMESTAMP,
    corem VARCHAR(50),
    background_check_file TEXT,
    background_check_notes TEXT
);

-- Tabela de planos
CREATE TABLE IF NOT EXISTS plans (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'BRL',
    duration_days INTEGER NOT NULL,
    features JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de assinaturas
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    plan_id INTEGER REFERENCES plans(id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'pending',
    started_at TIMESTAMP,
    ends_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_professionals_user_id ON professionals(user_id);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_state ON professionals(state);
CREATE INDEX IF NOT EXISTS idx_professionals_profession ON professionals(profession);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);
CREATE INDEX IF NOT EXISTS idx_professionals_is_highlighted ON professionals(is_highlighted);
CREATE INDEX IF NOT EXISTS idx_professionals_rating ON professionals(rating DESC);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Inserir dados iniciais dos planos
INSERT INTO plans (name, price, currency, duration_days, features) VALUES
('Plano Básico', 29.90, 'BRL', 30, '["Acesso básico", "Suporte por email", "Até 5 anúncios"]'::jsonb),
('Plano Profissional', 59.90, 'BRL', 30, '["Acesso completo", "Suporte prioritário", "Anúncios ilimitados", "Destaque nos resultados"]'::jsonb),
('Plano Premium', 99.90, 'BRL', 30, '["Todos os recursos", "Suporte 24/7", "Anúncios ilimitados", "Destaque premium", "Relatórios avançados"]'::jsonb)
ON CONFLICT DO NOTHING;

-- Inserir usuários de demonstração (senhas em texto plano - serão hasheadas no primeiro login)
INSERT INTO users (email, password, name, role, email_confirmed) VALUES
('enfermeiro@kuid.com', '123456', 'João Enfermeiro', 'profissional', true),
('tecnico@kuid.com', '123456', 'Maria Técnica', 'profissional', true),
('contratante@kuid.com', '123456', 'Carlos Contratante', 'contratante', true),
('admin@kuid.com', '123456', 'Admin User', 'admin', true)
ON CONFLICT (email) DO NOTHING;

-- Inserir perfis profissionais para os usuários de demonstração
INSERT INTO professionals (user_id, name, email, profession, city, state, rating, status, bio, experience_years, sex, birth_date, whatsapp)
SELECT u.id, 'João Enfermeiro', 'enfermeiro@kuid.com', 'Enfermeiro', 'São Paulo', 'SP', 4.8, 'approved', 'Enfermeiro experiente com 5 anos de atuação.', 5, 'Masculino', '1985-03-15', '5511999999999'
FROM users u WHERE u.email = 'enfermeiro@kuid.com'
ON CONFLICT DO NOTHING;

INSERT INTO professionals (user_id, name, email, profession, city, state, rating, status, bio, experience_years, sex, birth_date, whatsapp)
SELECT u.id, 'Maria Técnica', 'tecnico@kuid.com', 'Técnico de Enfermagem', 'Rio de Janeiro', 'RJ', 4.5, 'approved', 'Técnica especializada em cuidados domiciliares.', 3, 'Feminino', '1990-07-22', '5521888888888'
FROM users u WHERE u.email = 'tecnico@kuid.com'
ON CONFLICT DO NOTHING;

-- Confirmar que tudo foi criado
SELECT 'Database setup completed successfully!' as status;
