const { Pool } = require('pg');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');

dotenv.config();

const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_NAME = process.env.DB_NAME || 'Kuid';
const DB_PASSWORD = process.env.DB_PASSWORD || '320809eu';

async function updateUsersPasswords() {
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    console.log('Atualizando senhas dos usuários...');

    // Lista de usuários de teste com senha padrão 123456
    const testUsers = [
      { email: 'enfermeiro@kuid.com', password: '123456', name: 'Enfermeiro Demo', role: 'enfermeiro' },
      { email: 'tecnico@kuid.com', password: '123456', name: 'Técnico Demo', role: 'tecnico' },
      { email: 'contratante@kuid.com', password: '123456', name: 'Contratante Demo', role: 'contratante' },
      { email: 'admin@kuid.com', password: '123456', name: 'Admin Demo', role: 'admin' },
      { email: 'seed.user@example.com', password: '123456', name: 'Usuario Seed', role: 'profissional' },
    ];

    for (const userData of testUsers) {
      // Verificar se usuário existe
      const userExists = await pool.query('SELECT id, password FROM users WHERE email = $1', [userData.email]);
      
      if (userExists.rows.length > 0) {
        const user = userExists.rows[0];
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        
        // Atualizar senha
        let updateQuery = 'UPDATE users SET password = $1 WHERE email = $2';
        const updateParams = [hashedPassword, userData.email];
        
        // Tentar adicionar email_confirmed se a coluna existir
        try {
          await pool.query(
            'UPDATE users SET password = $1, email_confirmed = true WHERE email = $2',
            updateParams
          );
        } catch (err) {
          // Se a coluna não existir, atualizar apenas a senha
          if (err.code === '42703') {
            await pool.query('UPDATE users SET password = $1 WHERE email = $2', updateParams);
          } else {
            throw err;
          }
        }
        console.log(`✓ Usuário ${userData.email} atualizado com senha hasheada.`);
      } else {
        // Criar usuário se não existir
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        try {
          await pool.query(
            'INSERT INTO users (email, password, name, role, email_confirmed) VALUES ($1, $2, $3, $4, $5)',
            [userData.email, hashedPassword, userData.name, userData.role, true]
          );
        } catch (err) {
          // Se a coluna não existir, inserir sem email_confirmed
          if (err.code === '42703') {
            await pool.query(
              'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
              [userData.email, hashedPassword, userData.name, userData.role]
            );
          } else {
            throw err;
          }
        }
        console.log(`✓ Usuário ${userData.email} criado.`);
      }
    }

    // Atualizar todos os usuários existentes que têm senha em texto plano
    const allUsers = await pool.query('SELECT id, email, password FROM users');
    for (const user of allUsers.rows) {
      // Verificar se a senha não parece ser um hash bcrypt (bcrypt hashes começam com $2a$ ou $2b$)
      if (!user.password || (!user.password.startsWith('$2a$') && !user.password.startsWith('$2b$') && !user.password.startsWith('$2y$'))) {
        const hashedPassword = await bcrypt.hash('123456', 10);
        try {
          await pool.query(
            'UPDATE users SET password = $1, email_confirmed = true WHERE id = $2',
            [hashedPassword, user.id]
          );
        } catch (err) {
          // Se a coluna não existir, atualizar apenas a senha
          if (err.code === '42703') {
            await pool.query(
              'UPDATE users SET password = $1 WHERE id = $2',
              [hashedPassword, user.id]
            );
          } else {
            throw err;
          }
        }
        console.log(`✓ Senha do usuário ${user.email} (ID: ${user.id}) atualizada para hash bcrypt.`);
        console.log(`  Senha padrão: 123456`);
      }
    }

    console.log('\n✅ Todos os usuários foram atualizados!');
    console.log('\n📋 Credenciais de teste:');
    console.log('   Email: qualquer email do banco');
    console.log('   Senha: 123456 (para usuários que foram atualizados)');
    
  } catch (err) {
    console.error('Erro ao atualizar usuários:', err);
  } finally {
    await pool.end();
  }
}

updateUsersPasswords();

