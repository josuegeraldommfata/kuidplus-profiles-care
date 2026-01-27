const express = require('express');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const router = express.Router();
const { authenticateToken } = require('../middleware/auth');

// Configure nodemailer (use environment variables for production)
// Only create transporter if SMTP credentials are provided
let transporter = null;
if (process.env.SMTP_USER && process.env.SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: process.env.SMTP_PORT || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// Helper function to send email safely
async function sendEmailSafely(mailOptions) {
  if (!transporter) {
    console.warn('SMTP not configured. Email not sent. Configure SMTP_USER and SMTP_PASS in .env');
    return false;
  }
  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Error sending email:', error.message);
    return false;
  }
}

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

const upload = multer({ 
 storage,
 fileFilter: (req, file, cb) => {
 // Permitir apenas JPG e PNG para foto de perfil e certificados
 if (
 (file.fieldname === 'profilePhoto' || file.fieldname === 'certificates') &&
 !['image/jpeg', 'image/png', 'image/jpg'].includes(file.mimetype)
 ) {
 return cb(new Error('Apenas arquivos JPG e PNG são permitidos para foto de perfil e certificados!'), false);
 }
 // Permitir apenas MP4 para vídeo de apresentação
 if (file.fieldname === 'video' && file.mimetype !== 'video/mp4') {
 return cb(new Error('Apenas arquivos MP4 são permitidos para vídeo de apresentação!'), false);
 }
 cb(null, true);
 }
});

// Get professionals with optional pagination, search and highlighted filter
router.get('/', async (req, res) => {
  try {
    const {
      page = '1',
      limit = '12',
      highlighted,
      q,
      state,
      city,
      profession,
      sex,
      minRating,
      sortBy,
    } = req.query;

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.max(1, Math.min(100, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    const where = [];
    const params = [];

    // Only approved professionals by default
    where.push("status = 'approved' AND name IS NOT NULL AND name != ''");

    if (highlighted === 'true') {
      where.push('is_highlighted = true');
    }

    if (q) {
      params.push(`%${q}%`);
      params.push(`%${q}%`);
      params.push(`%${q}%`);
      where.push(`(name ILIKE $${params.length - 2} OR city ILIKE $${params.length - 1} OR profession ILIKE $${params.length})`);
    }

    if (state) {
      params.push(state);
      where.push(`state = $${params.length}`);
    }
    if (city) {
      params.push(`%${city}%`);
      where.push(`city ILIKE $${params.length}`);
    }
    if (profession) {
      params.push(profession);
      where.push(`profession = $${params.length}`);
    }
    if (sex) {
      params.push(sex);
      where.push(`sex = $${params.length}`);
    }
    if (minRating) {
      params.push(minRating);
      where.push(`rating >= $${params.length}`);
    }

    const whereClause = where.length ? `WHERE ${where.join(' AND ')}` : '';

    // Count total
    const countQuery = `SELECT COUNT(*) FROM professionals ${whereClause}`;
    const countResult = await pool.query(countQuery, params);
    const total = parseInt(countResult.rows[0].count, 10) || 0;

    // Order
    let orderClause = 'ORDER BY is_highlighted DESC, created_at DESC';
    if (sortBy === 'rating') orderClause = 'ORDER BY rating DESC, created_at DESC';

    // Build items query with limit/offset
    // Need to append limit and offset params
    const itemsParams = params.slice();
    itemsParams.push(limitNum);
    itemsParams.push(offset);

    const itemsQuery = `SELECT * FROM professionals ${whereClause} ${orderClause} LIMIT $${itemsParams.length - 1} OFFSET $${itemsParams.length}`;

    const itemsResult = await pool.query(itemsQuery, itemsParams);

    res.json({ items: itemsResult.rows, total, page: pageNum, limit: limitNum });
  } catch (error) {
    console.error('List professionals error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get distinct profession types (for filters)
router.get('/types/list', async (req, res) => {
  try {
    const result = await pool.query("SELECT DISTINCT profession FROM professionals WHERE profession IS NOT NULL ORDER BY profession");
    const list = result.rows.map(r => r.profession).filter(Boolean);
    res.json(list);
  } catch (error) {
    console.error('Get profession types error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Get current user's professional profile
router.get('/me/profile', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM professionals WHERE user_id = $1', [req.user.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Professional profile not found' });

    // Parse JSON fields
    const profile = result.rows[0];
    if (profile.certificates && typeof profile.certificates === 'string') {
      try {
        profile.certificates = JSON.parse(profile.certificates);
      } catch (e) {
        profile.certificates = [];
      }
    }
    if (profile.hospitals && typeof profile.hospitals === 'string') {
      try {
        profile.hospitals = JSON.parse(profile.hospitals);
      } catch (e) {
        profile.hospitals = [];
      }
    }
    if (profile.price_range && typeof profile.price_range === 'string') {
      try {
        profile.price_range = JSON.parse(profile.price_range);
      } catch (e) {
        profile.price_range = null;
      }
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get professional by ID (tries by professional id first, then by user_id)
router.get('/:id', async (req, res) => {
 try {
 const { id } = req.params;

 // First try to fetch by professional id
 let result = await pool.query('SELECT * FROM professionals WHERE id = $1', [id]);

 // If not found by professional id, try by user_id (so /profissional/:userId works)
 if (result.rows.length ===0) {
 result = await pool.query('SELECT * FROM professionals WHERE user_id = $1', [id]);
 }

 if (result.rows.length ===0) return res.status(404).json({ error: 'Professional not found' });

 // Parse JSON fields
 const profile = result.rows[0];
 if (profile.certificates && typeof profile.certificates === 'string') {
 try {
 profile.certificates = JSON.parse(profile.certificates);
 } catch (e) {
 profile.certificates = [];
 }
 }
 // normalize certificates to objects { name, file }
 if (Array.isArray(profile.certificates)) {
 profile.certificates = profile.certificates.map((c) => {
 if (!c) return null;
 if (typeof c === 'string') return { name: path.basename(c), file: c };
 if (typeof c === 'object' && c.file) return c;
 return null;
 }).filter(Boolean);
 }

 if (profile.hospitals && typeof profile.hospitals === 'string') {
 try {
 profile.hospitals = JSON.parse(profile.hospitals);
 } catch (e) {
 profile.hospitals = [];
 }
 }
 if (profile.price_range && typeof profile.price_range === 'string') {
 try {
 profile.price_range = JSON.parse(profile.price_range);
 } catch (e) {
 profile.price_range = null;
 }
 }

 res.json(profile);
 } catch (error) {
 res.status(500).json({ error: error.message });
 }
});

// Create professional (supports file upload for background check PDF and multiple certificates)
router.post('/', upload.fields([{ name: 'background_check_file', maxCount: 1 }, { name: 'certificates', maxCount: 10 }]), async (req, res) => {
  try {
    const fields = req.body;
    const files = req.files || {};
    const file = files.background_check_file ? files.background_check_file[0] : null;
    const certificateFiles = files.certificates || [];

    // Map incoming fields to DB columns
    const name = fields.name || fields.fullName || fields.username;
    const email = fields.email;
    const password = fields.password;
    const profession = fields.profession || fields.specialty;
    const city = fields.city;
    const state = fields.state;
    const birth_date = fields.birthDate || fields.birth_date || null;
    const sex = fields.sex;
    const whatsapp = fields.whatsapp;
    const bio = fields.bio || fields.description || null;
    const corem = fields.corem || null;
    const background_check_notes = fields.backgroundCheckNotes || null;
    const background_check_file = file ? `/uploads/${file.filename}` : null;
    const certificate_paths = certificateFiles.map(f => `/uploads/${f.filename}`);

    // Check if user already exists
    const existingUser = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email já cadastrado' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    // Create user
    const userResult = await pool.query(
      'INSERT INTO users (email, password, name, role, email_confirmation_token) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [email, hashedPassword, name, 'profissional', confirmationToken]
    );
    const userId = userResult.rows[0].id;

    // Create professional
    const query = `INSERT INTO professionals (
      user_id, name, birth_date, sex, city, state, whatsapp, email, profession,
      bio, profile_image, video_url, background_check, corem, background_check_file, background_check_notes, certificates
    ) VALUES (
      $1, $2, $3, $4, $5, $6, $7, $8, $9,
      $10, $11, $12, $13, $14, $15, $16, $17
    ) RETURNING *`;

    const values = [
      userId, name, birth_date, sex, city, state, whatsapp, email, profession,
      bio, null, null, false, corem, background_check_file, background_check_notes, JSON.stringify(certificate_paths)
    ];

    const result = await pool.query(query, values);

    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/confirmar-email?token=${confirmationToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@kuiddplus.com',
      to: email,
      subject: 'Confirme seu email - KUIDD+',
      html: `
        <h2>Bem-vindo ao KUIDD+!</h2>
        <p>Olá ${name},</p>
        <p>Obrigado por se cadastrar na plataforma KUIDD+. Para ativar sua conta, por favor confirme seu email clicando no link abaixo:</p>
        <a href="${confirmationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Confirmar Email</a>
        <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
        <p>${confirmationUrl}</p>
        <p>Atenciosamente,<br>Equipe KUIDD+</p>
      `,
    };

    await sendEmailSafely(mailOptions);

    res.status(201).json({
      message: 'Cadastro realizado com sucesso! Verifique seu email para confirmar a conta.',
      professional: result.rows[0]
    });
  } catch (error) {
    console.error('Create professional error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Update professional - with file upload support
router.put('/update', authenticateToken, upload.fields([
 { name: 'profilePhoto', maxCount:1 },
 { name: 'background_check_file', maxCount:1 },
 { name: 'certificates', maxCount:10 },
 { name: 'video', maxCount:1 }
]), async (req, res) => {
 try {
 const userId = req.user.id;
 const updates = req.body;
 const files = req.files || {};

 // Build dynamic update query
 const fields = [];
 const values = [];
 let paramIndex =1;

 // Handle file uploads
 if (files.profilePhoto && files.profilePhoto[0]) {
 fields.push(`profile_image = $${paramIndex}`);
 values.push(`/uploads/${files.profilePhoto[0].filename}`);
 paramIndex++;
 }

 if (files.background_check_file && files.background_check_file[0]) {
 fields.push(`background_check_file = $${paramIndex}`);
 values.push(`/uploads/${files.background_check_file[0].filename}`);
 paramIndex++;
 }

 if (files.certificates && files.certificates.length >0) {
 // Get existing certificates
 const currentQuery = await pool.query('SELECT certificates FROM professionals WHERE user_id = $1', [userId]);
 let existingCerts = [];
 if (currentQuery.rows[0]?.certificates) {
 try {
 existingCerts = typeof currentQuery.rows[0].certificates === 'string'
 ? JSON.parse(currentQuery.rows[0].certificates)
 : currentQuery.rows[0].certificates;
 } catch (e) {
 existingCerts = [];
 }
 }
 // Add new certificates
 const newCerts = files.certificates.map(f => ({
 name: f.originalname,
 file: `/uploads/${f.filename}`
 }));
 const allCerts = [...existingCerts, ...newCerts];
 fields.push(`certificates = $${paramIndex}`);
 values.push(JSON.stringify(allCerts));
 paramIndex++;
 }

 // Novo: upload de vídeo de apresentação
 if (files.video && files.video[0]) {
 fields.push(`video_url = $${paramIndex}`);
 values.push(`/uploads/${files.video[0].filename}`);
 paramIndex++;
 }

 // Map form fields to database columns
 const fieldMapping = {
 bio: 'bio',
 serviceArea: 'service_area',
 serviceRadius: 'service_radius',
 hospitals: 'hospitals',
 priceMin: 'price_range',
 priceMax: 'price_range',
 birthDate: 'birth_date',
 city: 'city',
 state: 'state',
 whatsapp: 'whatsapp',
 profession: 'profession',
 sex: 'sex',
 region: 'region'
 };

 // Get current professional data for merging
 const currentQuery = await pool.query('SELECT price_range FROM professionals WHERE user_id = $1', [userId]);
 const currentData = currentQuery.rows[0] || {};
 let currentPriceRange = currentData.price_range || {};
 if (typeof currentPriceRange === 'string') {
 try {
 currentPriceRange = JSON.parse(currentPriceRange);
 } catch (e) {
 currentPriceRange = {};
 }
 }

 for (const [key, value] of Object.entries(updates)) {
 if (value !== undefined && value !== null && value !== '') {
 const dbField = fieldMapping[key];
 if dbField) {
 if (key === 'priceMin' || key === 'priceMax') {
 if (!fields.some(f => f.startsWith('price_range'))) {
 if (updates.priceMin !== undefined && updates.priceMin !== '') {
 currentPriceRange.min = parseFloat(updates.priceMin);
 }
 if (updates.priceMax !== undefined && updates.priceMax !== '') {
 currentPriceRange.max = parseFloat(updates.priceMax);
 }
 fields.push('price_range = $' + paramIndex);
 values.push(JSON.stringify(currentPriceRange));
 paramIndex++;
 }
 } else if (key === 'hospitals') {
 fields.push(dbField + ' = $' + paramIndex);
 const hospitalsArray = typeof value === 'string' ? value.split(',').map(h => h.trim()) : value;
 values.push(JSON.stringify(hospitalsArray));
 paramIndex++;
 } else {
 fields.push(dbField + ' = $' + paramIndex);
 values.push(value);
 paramIndex++;
 }
 }
 }
 }

 // Se serviceArea foi enviado, atualize city/state também
 if (updates.serviceArea) {
 fields.push(`city = $${paramIndex}`);
 values.push(updates.serviceArea);
 paramIndex++;
 if (updates.state) {
 fields.push(`state = $${paramIndex}`);
 values.push(updates.state);
 paramIndex++;
 }
 }

 if (fields.length ===0) {
 return res.status(400).json({ error: 'No fields to update' });
 }

 values.push(userId);
 const query = `UPDATE professionals SET ${fields.join(', ')} WHERE user_id = $${paramIndex} RETURNING *`;

 const result = await pool.query(query, values);
 if (result.rows.length ===0) return res.status(404).json({ error: 'Professional not found' });
 res.json(result.rows[0]);
 } catch (error) {
 console.error('Update professional error:', error);
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
