-- =====================================================
-- KUID+ PROFILES CARE - ATUALIZAÇÃO DO BANCO DE DADOS
-- Data: 2024
-- Descrição: Novos profissionais, planos e calendários
-- ATENÇÃO: Execute 20260118_create_schedules_table.sql primeiro!
-- =====================================================

-- =====================================================
-- 1. TABELA DE AGENDAMENTOS (JÁ CRIADA EM 20260118)
-- Se não existir, criar (compatibilidade)
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.tables
        WHERE table_name = 'schedules'
    ) THEN
        CREATE TABLE schedules (
            id SERIAL PRIMARY KEY,
            professional_id INTEGER NOT NULL REFERENCES professionals(id) ON DELETE CASCADE,
            date DATE NOT NULL,
            time_slot TIME NOT NULL,
            is_available BOOLEAN DEFAULT TRUE,
            notes TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            UNIQUE(professional_id, date, time_slot)
        );
        CREATE INDEX idx_schedules_professional ON schedules(professional_id);
        CREATE INDEX idx_schedules_date ON schedules(date);
    END IF;
END $$;

-- =====================================================
-- 2. ATUALIZAR PLANS COM NOVOS PLANOS
-- =====================================================

-- Inserir novos planos (se não existirem)
INSERT INTO plans (name, price, currency, duration_days, slug, features, created_at) VALUES
('BASE', 49.00, 'BRL', 30, 'base',
 '{"features": ["Perfil ativo", "Calendário", "Feedbacks", "Contato direto WhatsApp"]}',
 CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO plans (name, price, currency, duration_days, slug, features, created_at) VALUES
('PROFISSIONAL', 99.00, 'BRL', 30, 'professional',
 '{"features": ["Perfil ativo", "Calendário", "Feedbacks", "Destaque na busca", "Selo verificado"]}',
 CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO plans (name, price, currency, duration_days, slug, features, created_at) VALUES
('PREMIUM', 179.00, 'BRL', 30, 'premium',
 '{"features": ["Perfil ativo", "Calendário", "Feedbacks", "Destaque na busca", "Selo verificado", "Aparece no topo", "Badge especialista"]}',
 CURRENT_TIMESTAMP)
ON CONFLICT (slug) DO NOTHING;

-- Atualizar planos existentes para novos preços
UPDATE plans SET price = 49.00 WHERE slug = 'family_monthly';
UPDATE plans SET price = 99.00 WHERE slug = 'professional_monthly';
UPDATE plans SET price = 179.00 WHERE slug = 'premium';

-- =====================================================
-- 3. CIDADES PERMITIDAS (para futuras validações)
-- =====================================================

CREATE TABLE IF NOT EXISTS allowed_cities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    state VARCHAR(2) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Inserir as 5 cidades iniciais
INSERT INTO allowed_cities (name, state, active) VALUES
('Campinas', 'SP', true),
('São Paulo', 'SP', true),
('Rio de Janeiro', 'RJ', true),
('Belo Horizonte', 'MG', true),
('Curitiba', 'PR', true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- 4. NOVOS TIPOS DE PROFISSIONAIS
-- =====================================================

-- A tabela professionals já tem profession VARCHAR
-- Apenas atualizar o enum se necessário

DO $$
BEGIN
    -- Verificar se a coluna profession existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'professionals' AND column_name = 'profession'
    ) THEN
        ALTER TABLE professionals ADD COLUMN profession VARCHAR(100);
    END IF;
END $$;

-- Verificar e adicionar coluna specialty para especialistas
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'professionals' AND column_name = 'specialty'
    ) THEN
        ALTER TABLE professionals ADD COLUMN specialty VARCHAR(100);
    END IF;
END $$;

-- Badge de especialista
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'professionals' AND column_name = 'is_specialist'
    ) THEN
        ALTER TABLE professionals ADD COLUMN is_specialist BOOLEAN DEFAULT FALSE;
    END IF;
END $$;

-- =====================================================
-- 5. MELHORIAS NA TABELA DE REVIEWS
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns
        WHERE table_name = 'reviews' AND column_name = 'professional_type'
    ) THEN
        ALTER TABLE reviews ADD COLUMN professional_type VARCHAR(50);
    END IF;
END $$;

-- =====================================================
-- 6. ÍNDICES PARA MELHORAR PERFORMANCE
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_users_city ON users(city);
CREATE INDEX IF NOT EXISTS idx_users_state ON users(state);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_professionals_city ON professionals(city);
CREATE INDEX IF NOT EXISTS idx_professionals_profession ON professionals(profession);
CREATE INDEX IF NOT EXISTS idx_professionals_status ON professionals(status);

-- =====================================================
-- 7. TABELA DE CONTRATOS/FECHAMENTOS
-- =====================================================

CREATE TABLE IF NOT EXISTS contracts (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER NOT NULL REFERENCES professionals(id),
    contractor_id INTEGER NOT NULL REFERENCES users(id),
    status VARCHAR(20) DEFAULT 'pending',
    -- pending: aguardando confirmação
    -- confirmed: confirmado
    -- cancelled: cancelado
    -- completed: concluído
    start_date DATE,
    end_date DATE,
    notes TEXT,
    value DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_contracts_professional ON contracts(professional_id);
CREATE INDEX idx_contracts_contractor ON contracts(contractor_id);
CREATE INDEX idx_contracts_status ON contracts(status);

-- =====================================================
-- 8. VERIFICAÇÃO FINAL
-- =====================================================

-- Listar todas as tabelas criadas/atualizadas
SELECT 'tables' as type, table_name FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('schedules', 'allowed_cities', 'contracts')
UNION ALL
SELECT 'plans' as type, name FROM plans ORDER BY price;

-- Verificar se as colunas foram adicionadas
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'professionals'
AND column_name IN ('specialty', 'is_specialist', 'profession');

-- Verificar cidades permitidas
SELECT * FROM allowed_cities WHERE active = true;

-- Verificar planos
SELECT * FROM plans ORDER BY price;
