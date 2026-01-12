const express = require('express');
const router = express.Router();
const { Pool } = require('pg');
const dotenv = require('dotenv');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// Rota para listar planos
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, currency, duration_days, features FROM plans ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Rota para iniciar checkout (placeholder) — será integrado ao Mercado Pago
router.post('/checkout', async (req, res) => {
  const { userId, planId } = req.body;
  if (!userId || !planId) return res.status(400).json({ error: 'userId and planId required' });

  try {
    // Aqui você pode criar a preferência/checkout com Mercado Pago e retornar o link
    // Por enquanto apenas cria uma subscription local com status pending
    const plan = await pool.query('SELECT id, price, duration_days FROM plans WHERE id = $1', [planId]);
    if (plan.rowCount === 0) return res.status(404).json({ error: 'Plan not found' });

    const started_at = new Date();
    const ends_at = new Date(started_at.getTime() + plan.rows[0].duration_days * 24 * 60 * 60 * 1000);

    const sub = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, started_at, ends_at, auto_renew) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [userId, planId, 'pending', started_at.toISOString(), ends_at.toISOString(), false]
    );

    res.json({ subscription: sub.rows[0], message: 'Subscription created locally (pending). Integrate Mercado Pago to complete checkout.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
