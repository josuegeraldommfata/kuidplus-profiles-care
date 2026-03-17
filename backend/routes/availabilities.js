const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth');

// Listar disponibilidades do profissional
router.get('/:professionalId', auth, async (req, res) => {
  const { professionalId } = req.params;

  if (req.user.id != professionalId) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const availabilities = await pool.query(`
      SELECT sa.*, s.title as service_title
      FROM service_availabilities sa
      LEFT JOIN services s ON sa.service_id = s.id
      WHERE sa.professional_id = $1
      ORDER BY sa.date, sa.start_time
    `, [professionalId]);

    res.json(availabilities.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Adicionar disponibilidade
router.post('/', auth, async (req, res) => {
  const { professional_id, service_id, date, start_time, end_time } = req.body;

  if (req.user.id != professional_id) {
    return res.status(403).json({ error: 'Acesso negado' });
  }

  try {
    const availability = await pool.query(`
      INSERT INTO service_availabilities (professional_id, service_id, date, start_time, end_time)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `, [professional_id, service_id, date, start_time, end_time]);

    res.json(availability.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status (book/cancel)
router.patch('/:id/status', auth, async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const result = await pool.query(`
      UPDATE service_availabilities
      SET status = $1
      WHERE id = $2 AND professional_id = $3
      RETURNING *
    `, [status, id, req.user.id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Disponibilidade não encontrada' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

