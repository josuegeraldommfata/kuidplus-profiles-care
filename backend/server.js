const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const pool = require('./db');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const professionalRoutes = require('./routes/professionals');
const paymentRoutes = require('./routes/payments');
const mpRoutes = require('./routes/mercadopago');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/professionals', professionalRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/mercadopago', mpRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

module.exports = { pool };
