-- Tabelas para tracking de estatísticas

-- Tabela de visualizações de perfil
CREATE TABLE IF NOT EXISTS professional_views (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    viewer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de cliques no WhatsApp
CREATE TABLE IF NOT EXISTS whatsapp_clicks (
    id SERIAL PRIMARY KEY,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de favoritos
CREATE TABLE IF NOT EXISTS favorites (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    professional_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, professional_id)
);

-- Tabela de visualizações de contratantes
CREATE TABLE IF NOT EXISTS contractor_views (
    id SERIAL PRIMARY KEY,
    contractor_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    viewed_profile_id INTEGER REFERENCES professionals(id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_professional_views_professional_id ON professional_views(professional_id);
CREATE INDEX IF NOT EXISTS idx_professional_views_created_at ON professional_views(created_at);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_professional_id ON whatsapp_clicks(professional_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_clicks_created_at ON whatsapp_clicks(created_at);
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_professional_id ON favorites(professional_id);
CREATE INDEX IF NOT EXISTS idx_contractor_views_contractor_id ON contractor_views(contractor_id);
CREATE INDEX IF NOT EXISTS idx_contractor_views_created_at ON contractor_views(created_at);

-- Trigger para atualizar weekly_views automaticamente
CREATE OR REPLACE FUNCTION update_weekly_views()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE professionals
    SET weekly_views = (
        SELECT COUNT(*)
        FROM professional_views
        WHERE professional_id = NEW.professional_id
        AND created_at >= CURRENT_DATE - INTERVAL '7 days'
    )
    WHERE id = NEW.professional_id;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_weekly_views
AFTER INSERT ON professional_views
FOR EACH ROW
EXECUTE FUNCTION update_weekly_views();
