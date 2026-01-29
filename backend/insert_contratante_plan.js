const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

async function insertContratantePlan() {
  try {
    // Primeiro, verifica se o plano já existe
    const existing = await pool.query('SELECT id FROM plans WHERE name ILIKE $1', ['%contratante%']);
    if (existing.rows.length > 0) {
      console.log('Plano Contratante já existe:', existing.rows[0]);
      return;
    }

    // Insere o plano Contratante
    const result = await pool.query(
      `INSERT INTO plans (name, price, currency, duration_days, features) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      ['Contratante', 29.90, 'BRL', 30, '{"type": "family", "description": "Plano para famílias"}']
    );

    console.log('Plano Contratante inserido com sucesso:', result.rows[0]);
  } catch (err) {
    console.error('Erro ao inserir plano Contratante:', err);
  } finally {
    pool.end();
  }
}

insertContratantePlan();
