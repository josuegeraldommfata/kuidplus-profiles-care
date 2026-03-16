const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const { Server: IOServer } = require('socket.io');

const pool = require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const professionalRoutes = require('./routes/professionals');
const paymentRoutes = require('./routes/payments');
const mpRoutes = require('./routes/mercadopago');
const reviewRoutes = require('./routes/reviews');
const scheduleRoutes = require('./routes/schedules');
const contractRoutes = require('./routes/contracts');
const statsRoutes = require('./routes/stats');
const proposalsRoutes = require('./routes/proposals');
const messagesRoutes = require('./routes/messages');

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
app.use('/api/reviews', reviewRoutes);
app.use('/api/schedules', scheduleRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/proposals', proposalsRoutes);
app.use('/api/messages', messagesRoutes);

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

// Create HTTP server and attach Socket.IO for real-time chat
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: {
    origin: process.env.FRONTEND_URL || '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Authorization'],
  },
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);

  socket.on('join', (room) => {
    if (!room) return;
    socket.join(room);
    console.log(`Socket ${socket.id} joined room ${room}`);
  });

  socket.on('leave', (room) => {
    if (!room) return;
    socket.leave(room);
  });

  socket.on('message', (msg) => {
    // msg should contain: { room, message }
    if (!msg || !msg.room) return;
    // Broadcast to room
    socket.to(msg.room).emit('message', msg);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected:', socket.id);
  });
});

// Server
server.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

module.exports = { app, pool, server, io };
