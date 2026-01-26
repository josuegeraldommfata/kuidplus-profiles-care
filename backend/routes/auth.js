const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const crypto = require('crypto');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

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

// Register
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, name } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate email confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');

    const result = await pool.query(
      'INSERT INTO users (email, password, role, name, email_confirmation_token) VALUES ($1, $2, $3, $4, $5) RETURNING id, email, role, name',
      [email, hashedPassword, role, name, confirmationToken]
    );

    // Send confirmation email
    const confirmationUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/confirmar-email?token=${confirmationToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@kuiddplus.com',
      to: email,
      subject: 'Confirme seu email - KUIDD+',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Bem-vindo ao KUIDD+!</h2>
          <p>Obrigado por se registrar. Para ativar sua conta, clique no link abaixo:</p>
          <a href="${confirmationUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Confirmar Email</a>
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p>${confirmationUrl}</p>
          <p>Este link expira em 24 horas.</p>
          <p>Atenciosamente,<br>Equipe KUIDD+</p>
        </div>
      `
    };

    await sendEmailSafely(mailOptions);

    res.status(201).json({
      message: 'Usuário registrado com sucesso! Verifique seu email para confirmar a conta.',
      user: result.rows[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Confirm email
router.post('/confirm-email', async (req, res) => {
  try {
    const { token } = req.body;
    const result = await pool.query(
      'UPDATE users SET email_confirmed = true, email_confirmation_token = null WHERE email_confirmation_token = $1 RETURNING id, email, role',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    res.json({ message: 'Email confirmado com sucesso!', user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email e senha são obrigatórios' });
    }

    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Usuário não encontrado' });
    }

    const user = result.rows[0];
    const storedPassword = user.password || '';
    const looksLikeBcrypt =
      storedPassword.startsWith('$2a$') ||
      storedPassword.startsWith('$2b$') ||
      storedPassword.startsWith('$2y$');

    let isValid = false;
    if (looksLikeBcrypt) {
      isValid = await bcrypt.compare(password, storedPassword);
    } else {
      // Compatibilidade: usuários criados manualmente no pgAdmin podem estar com senha em texto puro
      isValid = password === storedPassword;

      // Se validou em texto puro, migra para bcrypt automaticamente
      if (isValid) {
        const newHash = await bcrypt.hash(password, 10);
        await pool.query('UPDATE users SET password = $1 WHERE id = $2', [newHash, user.id]);
      }
    }

    if (!isValid) return res.status(400).json({ error: 'Senha inválida' });

    // Allow login even if email is not confirmed (for development/testing)
    // Uncomment this if you want to enforce email confirmation:
    // if (!user.email_confirmed) {
    //   return res.status(400).json({ error: 'Por favor, confirme seu email antes de fazer login' });
    // }

    const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'secret');
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        email: user.email, 
        role: user.role, 
        name: user.name, 
        profileImage: user.profile_image 
      } 
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: error.message || 'Erro interno do servidor' });
  }
});

// Get current user
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, name, profile_image, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Forgot password
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length === 0) {
      return res.status(200).json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha.' });
    }

    const user = result.rows[0];
    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpires = new Date(Date.now() + 3600000); // 1 hour

    await pool.query(
      'UPDATE users SET reset_password_token = $1, reset_password_expires = $2 WHERE id = $3',
      [resetToken, resetExpires, user.id]
    );

    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:8080'}/reset-password?token=${resetToken}`;
    const mailOptions = {
      from: process.env.SMTP_USER || 'noreply@kuiddplus.com',
      to: email,
      subject: 'Redefinição de Senha - KUIDD+',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Redefinição de Senha</h2>
          <p>Você solicitou a redefinição de sua senha. Clique no link abaixo para criar uma nova senha:</p>
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0;">Redefinir Senha</a>
          <p>Se o botão não funcionar, copie e cole este link no seu navegador:</p>
          <p>${resetUrl}</p>
          <p>Este link expira em 1 hora.</p>
          <p>Se você não solicitou esta redefinição, ignore este email.</p>
          <p>Atenciosamente,<br>Equipe KUIDD+</p>
        </div>
      `
    };

    await sendEmailSafely(mailOptions);

    res.json({ message: 'Se o email existir, você receberá instruções para redefinir sua senha.' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;

    const result = await pool.query(
      'SELECT * FROM users WHERE reset_password_token = $1 AND reset_password_expires > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Token inválido ou expirado' });
    }

    const user = result.rows[0];
    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      'UPDATE users SET password = $1, reset_password_token = NULL, reset_password_expires = NULL WHERE id = $2',
      [hashedPassword, user.id]
    );

    res.json({ message: 'Senha redefinida com sucesso!' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
