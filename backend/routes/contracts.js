const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /contracts - Listar contratos do usuário (profissional ou contratante)
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const userRole = req.user.role;

    let query = '';
    let params = [];

    // Se for profissional, buscar contratos onde ele é o profissional
    if (userRole === 'profissional' || ['cuidador', 'acompanhante', 'tecnico', 'enfermeiro', 'psicologo', 'fonoaudiologo', 'fisioterapeuta', 'nutricionista', 'terapeuta'].includes(userRole)) {
      query = `
        SELECT c.*, p.name as professional_name, p.profile_image, u.name as contractor_name
        FROM contracts c
        JOIN professionals prof ON c.professional_id = prof.id
        LEFT JOIN users p ON prof.user_id = p.id
        JOIN users u ON c.contractor_id = u.id
        WHERE prof.user_id = $1
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    } else {
      // Se for contratante, buscar contratos onde ele é o contratante
      query = `
        SELECT c.*, p.name as professional_name, p.profile_image, u.name as contractor_name
        FROM contracts c
        JOIN professionals prof ON c.professional_id = prof.id
        LEFT JOIN users p ON prof.user_id = p.id
        JOIN users u ON c.contractor_id = u.id
        WHERE c.contractor_id = $1
        ORDER BY c.created_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get contracts error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /contracts/:id - Detalhes de um contrato
router.get('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `SELECT c.*, p.name as professional_name, p.profile_image, p.whatsapp as professional_whatsapp,
              u.name as contractor_name, u.whatsapp as contractor_whatsapp
       FROM contracts c
       JOIN professionals p ON c.professional_id = p.id
       JOIN users u ON c.contractor_id = u.id
       WHERE c.id = $1 AND (p.user_id = $2 OR c.contractor_id = $2)`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Get contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /contracts - Criar nova proposta de contrato
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { professionalId, startDate, endDate, notes, value } = req.body;
    const contractorId = req.user.id;

    // Verificar se o profissional existe
    const profCheck = await pool.query(
      'SELECT id, user_id FROM professionals WHERE id = $1',
      [professionalId]
    );

    if (profCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Profissional não encontrado' });
    }

    const result = await pool.query(
      `INSERT INTO contracts (professional_id, contractor_id, status, start_date, end_date, notes, value)
       VALUES ($1, $2, 'pending', $3, $4, $5, $6)
       RETURNING *`,
      [professionalId, contractorId, startDate, endDate, notes, value]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /contracts/:id/status - Atualizar status do contrato
router.put('/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // pending, confirmed, cancelled, completed
    const userId = req.user.id;

    // Verificar se o usuário tem permissão (profissional ou contratante)
    const contractCheck = await pool.query(
      `SELECT c.*, p.user_id as professional_user_id
       FROM contracts c
       JOIN professionals p ON c.professional_id = p.id
       WHERE c.id = $1`,
      [id]
    );

    if (contractCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado' });
    }

    const contract = contractCheck.rows[0];
    if (contract.professional_user_id !== userId && contract.contractor_id !== userId) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      `UPDATE contracts SET status = $1, updated_at = CURRENT_TIMESTAMP
       WHERE id = $2 RETURNING *`,
      [status, id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update contract status error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /contracts/:id - Cancelar/excluir contrato
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `DELETE FROM contracts WHERE id = $1 AND contractor_id = $2 RETURNING *`,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Contrato não encontrado ou acesso negado' });
    }

    res.json({ message: 'Contrato cancelado com sucesso' });
  } catch (error) {
    console.error('Delete contract error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
