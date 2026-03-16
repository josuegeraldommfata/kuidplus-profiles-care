const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// List proposals with optional filters
router.get('/', async (req, res) => {
  try {
    const { page = 1, limit = 20, profession, city, state, q } = req.query;
    const offset = (Math.max(1, parseInt(page, 10)) - 1) * parseInt(limit, 10);

    const where = [];
    const params = [];

    if (profession) {
      params.push(profession);
      where.push(`profession = $${params.length}`);
    }
    if (city) {
      params.push(city);
      where.push(`city ILIKE $${params.length}`);
    }
    if (state) {
      params.push(state);
      where.push(`state = $${params.length}`);
    }
    if (q) {
      params.push(`%${q}%`);
      where.push(`(title ILIKE $${params.length} OR description ILIKE $${params.length})`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    const totalRes = await pool.query(`SELECT COUNT(*) FROM proposals ${whereClause}`, params);
    const total = parseInt(totalRes.rows[0].count, 10) || 0;

    params.push(limit);
    params.push(offset);

    const itemsRes = await pool.query(
      `SELECT * FROM proposals ${whereClause} ORDER BY created_at DESC LIMIT $${params.length - 1} OFFSET $${params.length}`,
      params
    );

    res.json({ items: itemsRes.rows, total, page: parseInt(page, 10), limit: parseInt(limit, 10) });
  } catch (error) {
    console.error('List proposals error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get single proposal
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM proposals WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Proposal not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create proposal (only authenticated contractors)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const contractorId = req.user.id;
    const { title, description, profession, city, state, budgetMin, budgetMax } = req.body;

    const result = await pool.query(
      `INSERT INTO proposals (title, description, profession, city, state, contractor_id, budget_min, budget_max)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
      [title, description, profession, city, state, contractorId, budgetMin || null, budgetMax || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create proposal error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Professional applies to a proposal (creates an application)
router.post('/:id/apply', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const professionalId = req.user.id;
    const { message, expectedBudget } = req.body;

    const result = await pool.query(
      `INSERT INTO proposal_applications (proposal_id, professional_id, message, expected_budget)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [id, professionalId, message || null, expectedBudget || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Apply to proposal error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
