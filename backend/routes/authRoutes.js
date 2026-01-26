const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');

const pool = new Pool({
 host: process.env.DB_HOST,
 port: process.env.DB_PORT,
 database: process.env.DB_NAME,
 user: process.env.DB_USER,
 password: process.env.DB_PASSWORD,
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
 try {
 const { email, password } = req.body;

 const result = await pool.query(
 'SELECT * FROM users WHERE email = $1 LIMIT 1',
 [email]
 );

 if (result.rows.length === 0) {
 return res.status(401).json({ message: 'Credenciais inválidas' });
 }

 const user = result.rows[0];
 const isMatch = await bcrypt.compare(password, user.password);

 if (!isMatch) {
 return res.status(401).json({ message: 'Credenciais inválidas' });
 }

 const token = jwt.sign(
 { id: user.id, email: user.email, role: user.role },
 process.env.JWT_SECRET,
 { expiresIn: '7d' }
 );

 res.json({
 token,
 user: {
 id: user.id,
 email: user.email,
 name: user.name,
 role: user.role,
 },
 });
 } catch (err) {
 console.error('Erro no login:', err);
 res.status(500).json({ message: 'Erro interno no servidor' });
 }
});

module.exports = router;
No server.js você deve ter algo assim (confirma):

const authRoutes = require('./routes/authRoutes');

app.use(express.json());
app.use('/api/auth', authRoutes);
