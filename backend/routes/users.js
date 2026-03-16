const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const upload = require('../middleware/upload');

const router = express.Router();

/* ============================
   VERIFY TOKEN
============================ */
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: 'Token não fornecido.',
    });
  }

  const token = authHeader.replace('Bearer ', '');

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token inválido.',
    });
  }
};

/* ============================
   GET ALL USERS (ADMIN)
============================ */
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    const users = await User.findAll();
    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
});

/* ============================
   GET USER BY ID
============================ */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
      return res.status(403).json({ success: false, message: 'Acesso negado.' });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
});

/* ============================
   UPDATE USER + FOTO PERFIL
============================ */
router.put(
  '/:id',
  verifyToken,
  upload.single('profile_image'),
  async (req, res) => {
    try {
      // ===== DEBUG AQUI =====
      console.log('REQ.FILE =>', req.file);
      console.log('REQ.BODY =>', req.body);
      // ======================

      const { id } = req.params;

      if (req.user.role !== 'admin' && req.user.id !== Number(id)) {
        return res.status(403).json({ success: false, message: 'Acesso negado.' });
      }

      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({ success: false, message: 'Usuário não encontrado.' });
      }

      const updateData = { ...req.body };

      // proteção
      delete updateData.password;
      delete updateData.role;
      delete updateData.email_confirmed;

      // imagem
      if (req.file) {
        updateData.profile_image = `/uploads/${req.file.filename}`;
      }

      const updatedUser = await user.update(updateData);

      res.json({
        success: true,
        message: 'Perfil atualizado com sucesso!',
        user: updatedUser,
      });
    } catch (err) {
      console.error('Update error:', err);
      res.status(500).json({
        success: false,
        message: 'Erro ao atualizar perfil.',
      });
    }
  }
);

/* ============================
   DELETE USER (ADMIN)
============================ */
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
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Erro interno.' });
  }
});

module.exports = router;
