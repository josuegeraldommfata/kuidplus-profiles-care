const { Pool } = require('pg');
const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '320809eu',
  port: process.env.DB_PORT || 5432,
});

async function createProfile() {
  try {
    // Check if user exists
    const user = await pool.query('SELECT * FROM users WHERE id = $1', [15]);
    if (user.rows.length === 0) {
      console.log('User 15 not found');
      return;
    }

    console.log('User found:', user.rows[0]);

    // Check if professional profile exists
    const prof = await pool.query('SELECT * FROM professionals WHERE user_id = $1', [15]);
    if (prof.rows.length > 0) {
      console.log('Professional profile already exists:', prof.rows[0]);
      return;
    }

    // Create professional profile
    const result = await pool.query(`
      INSERT INTO professionals (
        user_id, name, email, profession, city, state, status, bio
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [15, user.rows[0].name, user.rows[0].email, 'Profissional', 'São Paulo', 'SP', 'approved', 'Perfil profissional criado automaticamente']);

    console.log('Professional profile created:', result.rows[0]);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await pool.end();
  }
}

createProfile();
