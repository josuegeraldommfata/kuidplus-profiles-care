const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  password: '320809eu',
  port: 5432,
});

async function createDatabase() {
  try {
    await pool.query('CREATE DATABASE "Kuid";');
    console.log('✅ Banco Kuid criado com sucesso!');
  } catch (e) {
    if (e.code === '42P04') {
      console.log('ℹ Banco Kuid já existe.');
    } else {
      console.error('Erro ao criar banco:', e.message);
    }
  } finally {
    await pool.end();
  }
}

createDatabase();

