const dotenv = require('dotenv');
const { Pool } = require('pg');

// Carrega variáveis de ambiente de .env (se existir)
dotenv.config();

const DB_USER = process.env.DB_USER || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;
const DB_NAME = process.env.DB_NAME || 'Kuid';
const DB_PASSWORD = process.env.DB_PASSWORD || '320809eu';

// Função principal: garante que o DB exista, cria tabelas se necessário e insere dados mock
async function seed() {
  console.log('Iniciando seed...');

  // 1) Conectar ao DB 'postgres' para criar o banco caso não exista
  const adminPool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: 'postgres',
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    const check = await adminPool.query('SELECT 1 FROM pg_database WHERE datname = $1', [DB_NAME]);
    if (check.rowCount === 0) {
      console.log(`Banco '${DB_NAME}' não existe — criando...`);
      // Nota: CREATE DATABASE não suporta parâmetros preparados para o nome do DB em todas as versões, então usamos string segura
      await adminPool.query(`CREATE DATABASE "${DB_NAME}"`);
      console.log(`Banco '${DB_NAME}' criado.`);
    } else {
      console.log(`Banco '${DB_NAME}' já existe.`);
    }
  } catch (err) {
    console.error('Erro ao verificar/criar banco:', err);
    process.exitCode = 1;
    await adminPool.end();
    return;
  }

  await adminPool.end();

  // 2) Conectar ao banco alvo e criar tabelas (IF NOT EXISTS)
  const pool = new Pool({
    user: DB_USER,
    host: DB_HOST,
    database: DB_NAME,
    password: DB_PASSWORD,
    port: DB_PORT,
  });

  try {
    await pool.query('BEGIN');

    // Cria tabela users
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        name VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'contratante',
        profile_image TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Cria tabela professionals
    await pool.query(`
      CREATE TABLE IF NOT EXISTS professionals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        birth_date DATE,
        sex VARCHAR(20),
        city VARCHAR(100),
        state VARCHAR(2),
        region VARCHAR(100),
        whatsapp VARCHAR(20),
        email VARCHAR(255),
        profession VARCHAR(100),
        profile_image TEXT,
        video_url TEXT,
        bio TEXT,
        experience_years INTEGER,
        courses JSONB,
        certificates JSONB,
        service_area TEXT,
        service_radius INTEGER,
        hospitals JSONB,
        availability VARCHAR(20),
        price_range JSONB,
        rating DECIMAL(3,2) DEFAULT 0,
        total_ratings INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'pending',
        background_check BOOLEAN DEFAULT FALSE,
        whatsapp_clicks INTEGER DEFAULT 0,
        weekly_views INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_highlighted BOOLEAN DEFAULT FALSE,
        highlight_phrase TEXT,
  "references" JSONB,
        trial_ends_at TIMESTAMP
      )
    `);

      // Cria tabela user_types (lista os 5 tipos de usuários)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS user_types (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) UNIQUE NOT NULL,
          description TEXT,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cria tabela plans (planos de assinatura)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS plans (
          id SERIAL PRIMARY KEY,
          name VARCHAR(150) NOT NULL,
          price NUMERIC(10,2) NOT NULL DEFAULT 0,
          currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
          duration_days INTEGER NOT NULL DEFAULT 30,
          features JSONB,
          provider_plan_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cria tabela subscriptions
      await pool.query(`
        CREATE TABLE IF NOT EXISTS subscriptions (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
          plan_id INTEGER REFERENCES plans(id) ON DELETE SET NULL,
          status VARCHAR(50) NOT NULL DEFAULT 'inactive', -- inactive, trialing, active, past_due, canceled
          started_at TIMESTAMP,
          ends_at TIMESTAMP,
          auto_renew BOOLEAN DEFAULT TRUE,
          provider_subscription_id VARCHAR(255),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cria tabela api_keys para armazenar chaves dos clientes (MercadoPago etc.)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS api_keys (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          provider VARCHAR(100) NOT NULL,
          public_key TEXT,
          private_key TEXT,
          meta JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Cria tabela payments (registro de pagamentos)
      await pool.query(`
        CREATE TABLE IF NOT EXISTS payments (
          id SERIAL PRIMARY KEY,
          user_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
          amount NUMERIC(12,2) NOT NULL,
          currency VARCHAR(10) NOT NULL DEFAULT 'BRL',
          provider VARCHAR(100),
          provider_payment_id VARCHAR(255),
          status VARCHAR(50),
          meta JSONB,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Inserir tipos de usuário padrão (5 tipos)
      const types = ['contratante','profissional','admin','partner','guest'];
      for (const t of types) {
        await pool.query(`INSERT INTO user_types (name, description) VALUES ($1, $2) ON CONFLICT (name) DO NOTHING`, [t, `Tipo de usuário ${t}`]);
      }

      // Inserir planos básicos
      const plansData = [
        { name: 'Trial 30 dias', price: 0.00, duration_days: 30, features: { trial: true } },
        { name: 'Pro Mensal', price: 29.90, duration_days: 30, features: { highlights: true, priority: true } },
        { name: 'Pro Anual', price: 299.90, duration_days: 365, features: { highlights: true, priority: true, discount: 15 } }
      ];

      for (const p of plansData) {
        // Inserir plano somente se não existir (evita usar ON CONFLICT sem constraint)
        await pool.query(`
          INSERT INTO plans (name, price, currency, duration_days, features)
          SELECT $1::varchar, $2::numeric, $3::varchar, $4::int, $5::jsonb
          WHERE NOT EXISTS (SELECT 1 FROM plans WHERE name = $1::varchar)
        `, [p.name, p.price, 'BRL', p.duration_days, JSON.stringify(p.features)]);
      }

    // Inserir dados mock se não existirem
    const existing = await pool.query('SELECT 1 FROM users WHERE email = $1', ['seed.user@example.com']);
    if (existing.rowCount === 0) {
      const userInsert = await pool.query(
        `INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING id`,
        ['seed.user@example.com', 'seed-password-placeholder', 'Usuario Seed', 'profissional']
      );
      const userId = userInsert.rows[0].id;

      await pool.query(
        `INSERT INTO professionals (
          user_id, name, email, profession, city, state, rating, status, bio
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          userId,
          'João da Silva',
          'joao.seed@example.com',
          'Enfermeiro',
          'São Paulo',
          'SP',
          4.8,
          'active',
          'Profissional criado pelo seed para facilitar testes.'
        ]
      );
      // Criar uma assinatura de trial de 30 dias para esse profissional
      const planRes = await pool.query(`SELECT id, duration_days FROM plans WHERE name = $1 LIMIT 1`, ['Trial 30 dias']);
      if (planRes.rowCount > 0) {
        const planId = planRes.rows[0].id;
        const duration = parseInt(planRes.rows[0].duration_days, 10) || 30;
        const now = new Date();
        const ends = new Date(now.getTime() + duration * 24 * 60 * 60 * 1000);
        await pool.query(`
          INSERT INTO subscriptions (user_id, plan_id, status, started_at, ends_at, auto_renew)
          VALUES ($1, $2, $3, $4, $5, $6)
        `, [userId, planId, 'trialing', now.toISOString(), ends.toISOString(), false]);
        console.log('Assinatura de trial criada para o usuário seed.');
      }
      console.log('Usuário e profissional mock inseridos.');
    } else {
      console.log('Dados mock já existem — pulando inserção.');
    }

    await pool.query('COMMIT');
    console.log('Seed concluído com sucesso.');
  } catch (err) {
    await pool.query('ROLLBACK');
    console.error('Erro durante o seed:', err);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
}

seed();
