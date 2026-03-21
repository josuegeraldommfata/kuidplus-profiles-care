const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/availabilities?professional_id=ID - Lista disponibilidades
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { professional_id } = req.query;

    if (!professional_id) {
      return res.status(400).json({ error: 'professional_id requerido' });
    }

    const result = await pool.query(`
      SELECT
        a.*,
        COALESCE(s.title, 'Disponível') as service_title
      FROM availabilities a
      LEFT JOIN schedules sch ON a.id = sch.availability_id
      LEFT JOIN services s ON sch.service_id = s.id
      WHERE a.professional_id = $1
      ORDER BY a.date ASC, a.start_time ASC
    `, [professional_id]);

    res.json(result.rows);
  } catch (error) {
    console.error('Availabilities error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/availabilities - Criar disponibilidade
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { professional_id, date, start_time, end_time } = req.body;

    const result = await pool.query(`
      INSERT INTO availabilities (professional_id, date, start_time, end_time)
      VALUES ($1, $2, $3, $4)
      RETURNING *
    `, [professional_id, date, start_time, end_time]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create availability error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

