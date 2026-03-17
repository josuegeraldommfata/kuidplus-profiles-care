const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '320809eu',
  port: process.env.DB_PORT || 5432,
});

async function runMigrations() {
  try {
    console.log('Executando todas as migrations do diretório migrations...');

    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, 'utf8');

      try {
        await pool.query(sql);
        console.log(`✓ ${file} executada com sucesso`);
      } catch (err) {
        if (err.code === '42P07' || err.code === '42701') {
          console.log(`⚠ ${file} já existe/pulada (normal)`);
        } else {
          console.error(`✗ Erro em ${file}:`, err.message);
        }
      }
    }

    console.log('\n✅ Todas migrations executadas!');
  } catch (err) {
    console.error('Erro geral:', err);
  } finally {
    await pool.end();
  }
}

runMigrations();

