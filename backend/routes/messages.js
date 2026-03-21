const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// GET /api/messages/conversations - Listar conversas do usuário
router.get('/conversations', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(`
      SELECT c.id, c.created_at, c.updated_at, c.service_id,
        COALESCE(u1.name, 'Contratante') as contractor_name,
        COALESCE(u2.name, 'Profissional') as professional_name,
        COALESCE(s.title, 'Serviço') as service_title,
        COUNT(m.id) FILTER (WHERE m.is_read = false AND m.receiver_id = $1) as unread_count
      FROM conversations c
      LEFT JOIN users u1 ON c.contractor_id = u1.id
      LEFT JOIN users u2 ON c.professional_id = u2.id
      LEFT JOIN services s ON c.service_id = s.id
      LEFT JOIN messages m ON m.conversation_id = c.id
      WHERE c.contractor_id = $1 OR c.professional_id = $1
      GROUP BY c.id, u1.name, u2.name, s.title
      ORDER BY c.updated_at DESC NULLS LAST
    `, [userId]);

    res.json(result.rows);
  } catch (error) {
    console.error('Conversations error:', error);
    res.status(500).json({ error: error.message });
  }
});

// List messages, optionally by proposal (endpoint antigo mantido)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const { proposalId } = req.query;
    if (proposalId) {
      const result = await pool.query(
        `SELECT m.*, u.name as sender_name, u.profile_image as sender_image
         FROM messages m
         LEFT JOIN users u ON m.sender_id = u.id
         WHERE m.proposal_id = $1
         ORDER BY m.created_at ASC`,
        [proposalId]
      );
      return res.json(result.rows);
    }

    // If no proposal specified, return user's messages (inbox)
    const userId = req.user.id;
    const result = await pool.query(
      `SELECT m.*, u.name as sender_name, u.profile_image as sender_image
       FROM messages m
       LEFT JOIN users u ON m.sender_id = u.id
       WHERE m.receiver_id = $1 OR m.sender_id = $1
       ORDER BY m.created_at DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('List messages error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Create message (persist and emit via socket.io)
router.post('/', authenticateToken, async (req, res) => {
  try {
    const senderId = req.user.id;
    const { receiverId, proposalId, content } = req.body;

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, proposal_id, content)
       VALUES ($1,$2,$3,$4) RETURNING *`,
      [senderId, receiverId || null, proposalId || null, content]
    );

    const message = result.rows[0];

    // Emit to proposal room if applicable (lazy require to avoid circular import issues)
    if (proposalId) {
      const room = `proposal-${proposalId}`;
      try {
        const srv = require('../server');
        if (srv && srv.io) srv.io.to(room).emit('message', message);
      } catch (e) {
        // ignore if io not available
      }
    }

    res.status(201).json(message);
  } catch (error) {
    console.error('Create message error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
