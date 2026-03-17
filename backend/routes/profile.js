
const express = require('express');
const { authenticateToken } = require('../middleware/auth.js');
const db = require('../db.js');
const upload = require('../middleware/upload.js');

const router = express.Router();
// pool exportado de db.js

router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const userResult = await db.query(
      `SELECT id, email, nome, telefone, role, avatar, bio, profissao, especialidades,
              created_at, trial_expires_at, subscription_status, subscription_plan,
              latitude, longitude, cidade, estado, cep
       FROM users WHERE id = $1`,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }

    const user = userResult.rows[0];

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    console.error('Erro ao buscar perfil:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.get('/location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await db.query(
      'SELECT latitude, longitude, cidade, estado, cep FROM users WHERE id = $1',
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Localização não encontrada' });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao buscar localização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

router.patch('/location', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { latitude, longitude, cidade, estado, cep } = req.body;

    const fields = [];
    const values = [];
    let paramIndex = 1;

    if (latitude !== undefined) {
      fields.push(`latitude = $${paramIndex}`);
      values.push(latitude);
      paramIndex++;
    }
    if (longitude !== undefined) {
      fields.push(`longitude = $${paramIndex}`);
      values.push(longitude);
      paramIndex++;
    }
    if (cidade !== undefined) {
      fields.push(`cidade = $${paramIndex}`);
      values.push(cidade);
      paramIndex++;
    }
    if (estado !== undefined) {
      fields.push(`estado = $${paramIndex}`);
      values.push(estado);
      paramIndex++;
    }
    if (cep !== undefined) {
      fields.push(`cep = $${paramIndex}`);
      values.push(cep);
      paramIndex++;
    }

    values.push(userId);

    if (fields.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }

    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = $${paramIndex}`;

    await db.query(query, values);

    res.json({ success: true, message: 'Localização atualizada' });

  } catch (error) {
    console.error('Erro ao atualizar localização:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;

