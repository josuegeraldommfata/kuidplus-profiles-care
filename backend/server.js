const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');

const pool = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const professionalRoutes = require('./routes/professionals');
const paymentRoutes = require('./routes/payments');
const mpRoutes = require('./routes/mercadopago');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Segurança básica
app.use(helmet());

// Logs HTTP
app.use(morgan('dev'));

// CORS (ajuste FRONTEND_URL no .env)
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Body parser
app.use(express.json({ limit: '10mb' }));

// Arquivos enviados
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mercadopago', mpRoutes);

// Teste simples
app.get('/api/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// Health check (com banco)
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (err) {
    res.status(500).json({
      status: 'ERROR',
      database: 'disconnected',
    });
  }
});

// Erro global
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    error: 'Internal server error',
  });
});

// Server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = { app, pool };
