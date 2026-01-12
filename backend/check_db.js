const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

async function listTables() {
  try {
    console.log(`Conectando ao banco: ${process.env.DB_NAME || 'Kuid'}`);
    const res = await pool.query(`
      SELECT table_schema, table_name
      FROM information_schema.tables
      WHERE table_type='BASE TABLE'
        AND table_schema NOT IN ('pg_catalog','information_schema')
      ORDER BY table_schema, table_name;
    `);

    if (res.rows.length === 0) {
      console.log('Nenhuma tabela encontrada nesse banco.');
    } else {
      console.log('Tabelas encontradas:');
      res.rows.forEach(r => console.log(`- ${r.table_schema}.${r.table_name}`));
    }
  } catch (err) {
    console.error('Erro ao listar tabelas:', err.message || err);
  } finally {
    await pool.end();
  }
}

listTables();
