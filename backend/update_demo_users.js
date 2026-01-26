const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_NAME = process.env.DB_NAME || 'Kuid';
const DB_PASSWORD = process.env.DB_PASSWORD || '320809eu';

async function updateDemoUsers() {
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    console.log('Atualizando usuários demo...');

    const demoUsers = [
      { email: 'enfermeiro@kuid.com', password: '123456', name: 'Enfermeiro Demo', role: 'enfermeiro' },
      { email: 'tecnico@kuid.com', password: '123456', name: 'Técnico Demo', role: 'tecnico' },
      { email: 'contratante@kuid.com', password: '123456', name: 'Contratante Demo', role: 'contratante' },
      { email: 'admin@kuid.com', password: '123456', name: 'Admin Demo', role: 'admin' }
    ];

    for (const userData of demoUsers) {
      // Update password to plain text and set email_confirmed to true
      await pool.query(
        'UPDATE users SET password = $1, email_confirmed = true WHERE email = $2',
        [userData.password, userData.email]
      );
      console.log(`Usuário ${userData.email} atualizado.`);
    }

    console.log('Usuários demo atualizados com sucesso.');
  } catch (err) {
    console.error('Erro ao atualizar usuários:', err);
  } finally {
    await pool.end();
  }
}

updateDemoUsers();
