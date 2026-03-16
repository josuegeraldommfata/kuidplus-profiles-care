const dotenv = require('dotenv');
const { Pool } = require('pg');
const bcrypt = require('bcryptjs');

dotenv.config();

const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_NAME = process.env.DB_NAME || 'Kuid';
const DB_PASSWORD = process.env.DB_PASSWORD || '320809eu';

async function addDemoUsers() {
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    console.log('Adicionando usuários demo...');

    // Lista de usuários para criar
    const demoUsers = [
      // Profissionais
      { email: 'enfermeiro@kuid.com', password: '123456', name: 'Enfermeiro Carlos Silva', role: 'profissional', profession: 'Enfermeiro', city: 'São Paulo', state: 'SP' },
      { email: 'tecnico@kuid.com', password: '123456', name: 'Técnico Pedro Santos', role: 'profissional', profession: 'Técnico de Enfermagem', city: 'Rio de Janeiro', state: 'RJ' },
      { email: 'fisioterapeuta@kuid.com', password: '123456', name: 'Dra. Ana Fisioterapia', role: 'profissional', profession: 'Fisioterapeuta', city: 'Belo Horizonte', state: 'MG' },
      { email: 'medico@kuid.com', password: '123456', name: 'Dr. Roberto Medici', role: 'profissional', profession: 'Médico', city: 'São Paulo', state: 'SP' },
      { email: 'cuidador@kuid.com', password: '123456', name: 'Maria Cuidadora', role: 'profissional', profession: 'Cuidador de Idosos', city: 'Brasília', state: 'DF' },

      // Contratantes
      { email: 'contratante@kuid.com', password: '123456', name: 'João Contratante', role: 'contratante' },
      { email: 'familia@souza.com', password: '123456', name: 'Família Souza', role: 'contratante' },
      { email: 'empresa@exemplo.com', password: '123456', name: 'Empresa Exemplo LTDA', role: 'contratante' },

      // Admin
      { email: 'admin@kuid.com', password: '123456', name: 'Administrador KUID', role: 'admin' }
    ];

    for (const userData of demoUsers) {
      // Verificar se usuário já existe
      const existing = await pool.query('SELECT id FROM users WHERE email = $1', [userData.email]);

      if (existing.rows.length > 0) {
        console.log(`Usuário ${userData.email} já existe. Atualizando...`);
        const hashedPassword = await bcrypt.hash(userData.password, 10);
        await pool.query(
          'UPDATE users SET password = $1, name = $2, email_confirmed = true WHERE email = $3',
          [hashedPassword, userData.name, userData.email]
        );
      } else {
        console.log(`Criando usuário ${userData.email}...`);
        const hashedPassword = await bcrypt.hash(userData.password, 10);

        const userResult = await pool.query(
          `INSERT INTO users (email, password, name, role, email_confirmed, created_at)
           VALUES ($1, $2, $3, $4, true, NOW()) RETURNING id`,
          [userData.email, hashedPassword, userData.name, userData.role]
        );

        const userId = userResult.rows[0].id;

        // Se for profissional, criar registro na tabela professionals
        if (userData.role === 'profissional' && userData.profession) {
          await pool.query(
            `INSERT INTO professionals (user_id, name, email, profession, city, state, status, rating, created_at)
             VALUES ($1, $2, $3, $4, $5, $6, 'approved', 4.5, NOW())`,
            [userId, userData.name, userData.email, userData.profession, userData.city, userData.state]
          );
        }

        console.log(`Usuário ${userData.email} criado com sucesso!`);
      }
    }

    // Verificar total de usuários
    const countResult = await pool.query('SELECT COUNT(*) as total FROM users');
    console.log(`\nTotal de usuários no banco: ${countResult.rows[0].total}`);

    console.log('\nUsuários demo criados/atualizados com sucesso!');
    console.log('\nCredenciais de teste:');
    console.log('- Profissional: enfermeiro@kuid.com / 123456');
    console.log('- Profissional: tecnico@kuid.com / 123456');
    console.log('- Profissional: fisioterapeuta@kuid.com / 123456');
    console.log('- Profissional: medico@kuid.com / 123456');
    console.log('- Profissional: cuidador@kuid.com / 123456');
    console.log('- Contratante: contratante@kuid.com / 123456');
    console.log('- Contratante: familia@souza.com / 123456');
    console.log('- Contratante: empresa@exemplo.com / 123456');
    console.log('- Admin: admin@kuid.com / 123456');

  } catch (err) {
    console.error('Erro ao adicionar usuários:', err);
  } finally {
    await pool.end();
  }
}

addDemoUsers();
