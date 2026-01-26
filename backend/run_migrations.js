const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

dotenv.config();

const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_NAME = process.env.DB_NAME || 'Kuid';
const DB_PASSWORD = process.env.DB_PASSWORD || '320809eu';

async function runMigrations() {
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    console.log('Executando migrations...');

    // Adicionar colunas faltantes
    const migrations = [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmed BOOLEAN DEFAULT TRUE`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS email_confirmation_token VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255)`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires TIMESTAMP`,
    ];

    for (const migration of migrations) {
      try {
        await pool.query(migration);
        console.log(`✓ Migration executada: ${migration.substring(0, 60)}...`);
      } catch (err) {
        if (err.code !== '42701') { // Ignorar se coluna já existe
          console.error('Erro na migration:', err.message);
        }
      }
    }

    // Atualizar todos os usuários para ter email_confirmed = true
    await pool.query(`UPDATE users SET email_confirmed = TRUE WHERE email_confirmed IS NULL OR email_confirmed = FALSE`);
    console.log('✓ Todos os usuários marcados como email confirmado.');

    console.log('\n✅ Migrations concluídas com sucesso!');
  } catch (err) {
    console.error('Erro ao executar migrations:', err);
  } finally {
    await pool.end();
  }
}

runMigrations();

