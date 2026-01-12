const express = require('express');
const User = require('../models/User');

const router = express.Router();

// Verify token middleware
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res.status(401).json({ success: false, message: 'Token não fornecido.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: 'Token inválido.' });
  }
};

// Get all users (admin only)
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    const users = await User.findAll();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// Get user by ID
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Users can only see their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// Update user
router.put('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    // Remove sensitive fields that shouldn't be updated directly
    delete updateData.password;
    delete updateData.role;

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    await user.update(updateData);
    res.json({ success: true, message: 'Usuário atualizado com sucesso!', user });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

// Delete user (admin only)
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    await user.delete();
    res.json({ success: true, message: 'Usuário deletado com sucesso!' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
