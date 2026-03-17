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

async function fixTrialPeriod() {
  console.log('🔧 Fixando período de trial para todos usuários...\n');

  try {
    // 1. Usuários sem trial_ends_at OU subscription_status != 'trial'
    const result = await pool.query(`
      UPDATE users
      SET
        trial_ends_at = created_at + INTERVAL '7 days',
        subscription_status = 'trial'
      WHERE trial_ends_at IS NULL
         OR subscription_status != 'trial'
         OR subscription_status IS NULL
      RETURNING id, email, role, created_at, trial_ends_at, subscription_status
    `);

    console.log(`✅ ${result.rowCount} usuários atualizados com 7 dias de trial!\n`);

    // 2. Relatório dos usuários afetados
    const updatedUsers = await pool.query(`
      SELECT id, email, role, created_at, trial_ends_at, subscription_status
      FROM users
      WHERE trial_ends_at >= NOW()
      ORDER BY trial_ends_at DESC
      LIMIT 10
    `);

    console.log('📋 10 primeiros usuários com trial ativo:');
    updatedUsers.rows.slice(0, 10).forEach(user => {
      const daysLeft = Math.ceil(
        (new Date(user.trial_ends_at) - new Date()) / (1000 * 60 * 60 * 24)
      );
      console.log(`  👤 ${user.email} (${user.role}) - ${daysLeft} dias restantes`);
    });

    console.log(`\n🎉 Fix concluído! Execute node backend/fix_trial.js novamente para verificar.`);
  } catch (error) {
    console.error('❌ Erro:', error);
  } finally {
    await pool.end();
  }
}

fixTrialPeriod();

