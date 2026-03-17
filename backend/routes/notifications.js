const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get notifications for user (unread + read)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const { page = 1, limit = 50, read = null } = req.query;
    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);

    const where = ['user_id = $1'];
    const params = [userId];

    if (read !== null) {
      params.push(read === 'true');
      where.push('is_read = $' + params.length);
    }

    const countRes = await pool.query(`
      SELECT COUNT(*)
      FROM notifications
      WHERE ${where.join(' AND ')}
    `, params);

    const notificationsRes = await pool.query(`
      SELECT *,
        (CASE
          WHEN type = 'nova_proposta' THEN 'Nova proposta recebida'
          WHEN type = 'proposta_aceita' THEN 'Sua proposta foi aceita!'
          WHEN type = 'proposta_recusada' THEN 'Proposta recusada'
          WHEN type = 'nova_mensagem' THEN 'Nova mensagem'
          WHEN type = 'servico_concluido' THEN 'Serviço concluído'
          ELSE title
        END) as title_display
      FROM notifications
      WHERE ${where.join(' AND ')}
      ORDER BY created_at DESC
      LIMIT $${params.length + 1} OFFSET $${params.length + 2}
    `, [...params, parseInt(limit, 10), offset]);

    res.json({
      notifications: notificationsRes.rows,
      total: parseInt(countRes.rows[0].count),
      unread_count: notificationsRes.rows.filter(n => !n.is_read).length,
      page: parseInt(page),
      limit: parseInt(limit)
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark as read
router.patch('/:id/read', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Notification not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Mark all as read
router.patch('/read-all', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      'UPDATE notifications SET is_read = true WHERE user_id = $1 AND is_read = false RETURNING *',
      [userId]
    );

    res.json({
      message: 'All notifications marked as read',
      count: result.rows.length
    });
  } catch (error) {
    console.error('Mark all read error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create notification (internal use)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { user_id, type, title, message, data } = req.body;

    const result = await pool.query(
      `INSERT INTO notifications (user_id, type, title, message, data)
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [user_id, type, title || '', message || '', data || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

