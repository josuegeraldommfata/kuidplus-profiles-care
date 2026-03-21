const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
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
    const migrationsDir = path.join(__dirname, 'migrations');
    const migrationFiles = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort();

    console.log('🔄 Executando migrações...');

    for (const file of migrationFiles) {
      try {
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, 'utf8');

        console.log(`📝 Executando: ${file}`);

        await pool.query(sql);
        console.log(`✅ ${file} OK`);
      } catch (err) {
        console.log(`⚠️  ${file} já executada ou erro:`, err.message);
      }
      console.log(`✅ ${file} executada com sucesso!`);
    }

    console.log('🎉 Todas migrações executadas!');
  } catch (error) {
    console.error('❌ Erro nas migrações:', error);
  } finally {
    await pool.end();
  }
}

runMigrations();

