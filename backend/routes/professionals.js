const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const router = express.Router();

// Ensure uploads dir exists
const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir);
  },
  filename: function (req, file, cb) {
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-]/g, '_');
    cb(null, `${Date.now()}_${safeName}`);
  }
});

const upload = multer({ storage });

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

// Create professional (supports file upload for background check PDF)
router.post('/', upload.single('background_check_file'), async (req, res) => {
  try {
    const fields = req.body;
    const file = req.file;

    // Map incoming fields to DB columns
    const name = fields.name || fields.fullName || fields.username;
    const email = fields.email;
    const profession = fields.profession || fields.specialty;
    const city = fields.city;
    const state = fields.state;
    const birth_date = fields.birthDate || fields.birth_date || null;
    const sex = fields.sex;
    const whatsapp = fields.whatsapp;
    const bio = fields.bio || fields.description || null;
    const user_id = fields.user_id || null;
    const corem = fields.corem || null;
    const background_check_notes = fields.backgroundCheckNotes || null;
    const background_check_file = file ? `/uploads/${file.filename}` : null;

    const query = `INSERT INTO professionals (
      user_id, name, birth_date, sex, city, state, whatsapp, email, profession,
      bio, profile_image, video_url, background_check, corem, background_check_file, background_check_notes
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16
    ) RETURNING *`;

    const values = [
      user_id, name, birth_date, sex, city, state, whatsapp, email, profession,
      bio, null, null, false, corem, background_check_file, background_check_notes
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create professional error:', error);
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
