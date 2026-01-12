const express = require('express');
const pool = require('../db');

const router = express.Router();

// Get all professionals
router.get('/', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professionals');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM professionals WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Professional not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create professional
router.post('/', async (req, res) => {
  try {
    const { name, email, specialty, location, bio, user_id } = req.body;
    const result = await pool.query(
      'INSERT INTO professionals (name, email, specialty, location, bio, user_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [name, email, specialty, location, bio, user_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update professional
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, specialty, location, bio } = req.body;
    const result = await pool.query(
      'UPDATE professionals SET name = $1, email = $2, specialty = $3, location = $4, bio = $5 WHERE id = $6 RETURNING *',
      [name, email, specialty, location, bio, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Professional not found' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete professional
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM professionals WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Professional not found' });
    res.json({ message: 'Professional deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
