const express = require('express');
const User = require('../models/User');
const path = require('path');
const multer = require('multer');

const router = express.Router();

/* ============================
   MULTER CONFIG (ADICIONADO)
   ============================ */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars');
  },
  filename: function (req, file, cb) {
    const uniqueName =
      Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueName + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

/* ============================
   VERIFY TOKEN (ORIGINAL)
   ============================ */
const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: 'Token não fornecido.' });
  }

  try {
    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res
      .status(401)
      .json({ success: false, message: 'Token inválido.' });
  }
};

/* ============================
   GET ALL USERS (ADMIN)
   ============================ */
router.get('/', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Acesso negado.' });
    }

    const users = await User.findAll();
    res.json({ success: true, users });
  } catch (error) {
    console.error('Get users error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro interno do servidor.' });
  }
});

/* ============================
   GET USER BY ID
   ============================ */
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
      return res
        .status(403)
        .json({ success: false, message: 'Acesso negado.' });
    }

    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuário não encontrado.' });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error('Get user error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro interno do servidor.' });
  }
});

/* ============================
   UPDATE USER (COM UPLOAD)
   ============================ */
router.put(
  '/:id',
  verifyToken,
  upload.single('profile_image'),
  async (req, res) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      if (req.user.role !== 'admin' && req.user.id !== parseInt(id)) {
        return res
          .status(403)
          .json({ success: false, message: 'Acesso negado.' });
      }

      delete updateData.password;
      delete updateData.role;

      const user = await User.findById(id);
      if (!user) {
        return res
          .status(404)
          .json({ success: false, message: 'Usuário não encontrado.' });
      }

      if (req.file) {
        updateData.profile_image = `/uploads/avatars/${req.file.filename}`;
      }

      await user.update(updateData);

      res.json({
        success: true,
        message: 'Usuário atualizado com sucesso!',
        user,
      });
    } catch (error) {
      console.error('Update user error:', error);
      res
        .status(500)
        .json({ success: false, message: 'Erro interno do servidor.' });
    }
  }
);

/* ============================
   DELETE USER (ADMIN)
   ============================ */
router.delete('/:id', verifyToken, async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res
        .status(403)
        .json({ success: false, message: 'Acesso negado.' });
    }

    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'Usuário não encontrado.' });
    }

    await user.delete();
    res.json({
      success: true,
      message: 'Usuário deletado com sucesso!',
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res
      .status(500)
      .json({ success: false, message: 'Erro interno do servidor.' });
  }
});

module.exports = router;
