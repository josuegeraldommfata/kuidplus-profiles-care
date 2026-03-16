const express = require('express');
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// List messages, optionally by proposal
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
