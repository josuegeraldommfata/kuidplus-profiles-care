const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const morgan = require('morgan');
const helmet = require('helmet');
const http = require('http');
const { Server: IOServer } = require('socket.io');

const pool = require('./db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(morgan('dev'));
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check primeiro
app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'OK', database: 'connected' });
  } catch (err) {
    res.status(500).json({ status: 'ERROR', database: 'disconnected' });
  }
});

app.get('/api/test', (req, res) => res.json({ message: 'Server OK' }));

// Register routes with individual try/catch
const routes = [
  { path: '/api/auth', file: './routes/auth' },
  { path: '/api/users', file: './routes/users' },
  { path: '/api/professionals', file: './routes/professionals' },
  { path: '/api/payments', file: './routes/payments' },
  { path: '/api/reviews', file: './routes/reviews' },
  { path: '/api/schedules', file: './routes/schedules' },
  { path: '/api/contracts', file: './routes/contracts' },
  { path: '/api/stats', file: './routes/stats' },
  { path: '/api/proposals', file: './routes/proposals' },
  { path: '/api/messages', file: './routes/messages' },
  { path: '/api/services', file: './routes/services' },
  { path: '/api/service-proposals', file: './routes/service-proposals' },
  { path: '/api/profile', file: './routes/profile' },
  { path: '/api/notifications', file: './routes/notifications' },
  { path: '/api/availabilities', file: './routes/availabilities' }
];

routes.forEach(({ path, file }) => {
  try {
    const router = require(file);
    if (typeof router === 'function') {
      app.use(path, router);
      console.log(`✅ Route ${path} OK`);
    } else {
      console.log(`⚠️  Route ${path} invalid (not router)`);
    }
  } catch (err) {
    console.error(`❌ Route ${path}:`, err.message);
  }
});

// MercadoPago webhook separado
try {
  const paymentRoutes = require('./routes/payments');
  if (paymentRoutes.webhook) {
    app.post('/api/payments/webhook', express.raw({type: 'application/json'}), paymentRoutes.webhook);
    console.log('✅ MercadoPago webhook OK');
  }
} catch (err) {
  console.error('❌ MercadoPago webhook:', err.message);
}

// 404 handler (após todas rotas)
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Socket.IO
const server = http.createServer(app);
const io = new IOServer(server, {
  cors: { origin: process.env.FRONTEND_URL || '*', methods: ['GET', 'POST'] }
});

io.on('connection', (socket) => {
  console.log('Socket connected:', socket.id);
  socket.on('join', (room) => socket.join(room));
  socket.on('message', (msg) => socket.to(msg.room || 'general').emit('message', msg));
  socket.on('disconnect', () => console.log('Socket disconnected'));
});

server.listen(port, () => {
  console.log(`🚀 Backend: http://localhost:${port}`);
  console.log(`📱 Socket.IO ready`);
  console.log(`🔗 Frontend: http://localhost:8080`);
});

