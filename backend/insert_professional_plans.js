const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function insertProfessionalPlans() {
  try {
    console.log('Inserindo planos para profissionais...');

    // Plano Mensal para Profissionais
    await pool.query(`
      INSERT INTO plans (name, price, currency, duration_days, features)
      VALUES ('Profissional Mensal', 49.90, 'BRL', 30, '{"trial_days": 7, "auto_renewal": true}')
      ON CONFLICT (name) DO NOTHING;
    `);

    // Plano Trimestral para Profissionais
    await pool.query(`
      INSERT INTO plans (name, price, currency, duration_days, features)
      VALUES ('Profissional Trimestral', 119.90, 'BRL', 90, '{"trial_days": 7, "auto_renewal": true}')
      ON CONFLICT (name) DO NOTHING;
    `);

    console.log('Planos inseridos com sucesso!');
  } catch (error) {
    console.error('Erro ao inserir planos:', error);
  } finally {
    await pool.end();
  }
}

insertProfessionalPlans();
