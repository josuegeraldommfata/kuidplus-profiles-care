const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'kuiduser',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'kuidplus',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

async function checkPlans() {
  try {
    const result = await pool.query('SELECT id, name, price, currency, duration_days, features FROM plans ORDER BY id');
    console.log('Planos encontrados:');
    console.log(result.rows);
  } catch (err) {
    console.error('Erro ao consultar planos:', err);
  } finally {
    pool.end();
  }
}

checkPlans();
