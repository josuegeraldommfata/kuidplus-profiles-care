const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kuid',
  password: process.env.DB_PASSWORD || '320809eu',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

async function seedPlans() {
  try {
    console.log('Inserindo planos atualizados...');

    // Novos planos conforme solicitado
    const plansData = [
      // Planos para Profissionais
      {
        name: 'PLANO BASE',
        price: 49.00,
        duration_days: 30,
        slug: 'base',
        features: {
          profile_active: true,
          calendar: true,
          feedbacks: true,
          type: 'profissional',
          description: 'Perfil ativo + calendário + feedbacks'
        }
      },
      {
        name: 'PLANO PROFISSIONAL',
        price: 99.00,
        duration_days: 30,
        slug: 'profissional',
        features: {
          profile_active: true,
          calendar: true,
          feedbacks: true,
          highlight: true,
          verified_badge: true,
          type: 'profissional',
          description: 'Tudo acima + destaque na busca + selo verificado'
        }
      },
      {
        name: 'PLANO PREMIUM',
        price: 179.00,
        duration_days: 30,
        slug: 'premium',
        features: {
          profile_active: true,
          calendar: true,
          feedbacks: true,
          highlight: true,
          verified_badge: true,
          top_ranking: true,
          specialist_badge: true,
          type: 'profissional',
          description: 'Tudo acima + aparece no topo + badge de especialista'
        }
      },
      // Plano para Contratantes (Família)
      {
        name: 'Família Premium',
        price: 29.90,
        duration_days: 30,
        slug: 'family_monthly',
        features: {
          trial: false,
          type: 'familia',
          contacts_unlimited: true,
          priority: true
        }
      }
    ];

    for (const p of plansData) {
      const existing = await pool.query('SELECT id FROM plans WHERE slug = $1', [p.slug]);
      if (existing.rowCount > 0) {
        await pool.query(
          'UPDATE plans SET name = $2, price = $3, duration_days = $4, features = $5 WHERE slug = $1',
          [p.slug, p.name, p.price, p.duration_days, JSON.stringify(p.features)]
        );
        console.log(`Plano ${p.name} atualizado.`);
      } else {
        await pool.query(
          'INSERT INTO plans (name, price, currency, duration_days, slug, features) VALUES ($1, $2, $3, $4, $5, $6)',
          [p.name, p.price, 'BRL', p.duration_days, p.slug, JSON.stringify(p.features)]
        );
        console.log(`Plano ${p.name} inserido.`);
      }
    }

    console.log('Planos atualizados com sucesso!');
  } catch (err) {
    console.error('Erro ao inserir planos:', err);
  } finally {
    await pool.end();
  }
}

seedPlans();
