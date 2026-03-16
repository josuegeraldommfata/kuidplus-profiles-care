const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

// GET /schedules - Listar agendamentos de um profissional
router.get('/:professionalId', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { startDate, endDate } = req.query;

    let query = 'SELECT * FROM schedules WHERE professional_id = $1';
    const params = [professionalId];

    if (startDate && endDate) {
      query += ' AND date BETWEEN $2 AND $3';
      params.push(startDate, endDate);
    }

    query += ' ORDER BY date, time_slot';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Get schedules error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /schedules/availability - Verificar disponibilidade em uma data
router.get('/:professionalId/availability', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ error: 'Data é obrigatória' });
    }

    // Buscar slots do dia
    const slotsResult = await pool.query(
      `SELECT time_slot, is_available FROM schedules
       WHERE professional_id = $1 AND date = $2
       ORDER BY time_slot`,
      [professionalId, date]
    );

    // Se não houver slots cadastrados, retornar que está disponível
    if (slotsResult.rows.length === 0) {
      return res.json({
        date,
        hasAvailability: true,
        message: 'Profissional disponível neste dia',
        slots: []
      });
    }

    const availableSlots = slotsResult.rows.filter(s => s.is_available);

    res.json({
      date,
      hasAvailability: availableSlots.length > 0,
      totalSlots: slotsResult.rows.length,
      availableSlots: availableSlots.length,
      slots: slotsResult.rows
    });
  } catch (error) {
    console.error('Get availability error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /schedules - Criar/atualizar agendamento
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { professionalId, date, timeSlot, isAvailable, notes } = req.body;
    const userId = req.user.id;

    // Verificar se o profissional pertence ao usuário
    const profCheck = await pool.query(
      'SELECT id FROM professionals WHERE user_id = $1 AND id = $2',
      [userId, professionalId]
    );

    if (profCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const result = await pool.query(
      `INSERT INTO schedules (professional_id, date, time_slot, is_available, notes)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (professional_id, date, time_slot)
       DO UPDATE SET is_available = $4, notes = $5, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [professionalId, date, timeSlot, isAvailable, notes]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Create schedule error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /schedules/bulk - Criar múltiplos agendamentos
router.post('/bulk', authenticateToken, async (req, res) => {
  try {
    const { professionalId, date, slots } = req.body;
    const userId = req.user.id;

    // Verificar se o profissional pertence ao usuário
    const profCheck = await pool.query(
      'SELECT id FROM professionals WHERE user_id = $1 AND id = $2',
      [userId, professionalId]
    );

    if (profCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const results = [];
    for (const slot of slots) {
      const result = await pool.query(
        `INSERT INTO schedules (professional_id, date, time_slot, is_available)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (professional_id, date, time_slot)
         DO UPDATE SET is_available = $4, updated_at = CURRENT_TIMESTAMP
         RETURNING *`,
        [professionalId, date, slot.time, slot.isAvailable]
      );
      results.push(result.rows[0]);
    }

    res.status(201).json({ message: 'Agendamentos criados', slots: results });
  } catch (error) {
    console.error('Create bulk schedules error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /schedules/availability/week - Disponibilidade semanal
router.get('/:professionalId/week', async (req, res) => {
  try {
    const { professionalId } = req.params;
    const { startDate } = req.query;

    if (!startDate) {
      return res.status(400).json({ error: 'Data inicial é obrigatória' });
    }

    const start = new Date(startDate);
    const end = new Date(start);
    end.setDate(end.getDate() + 6);

    const result = await pool.query(
      `SELECT date, COUNT(*) as total_slots,
              COUNT(CASE WHEN is_available = true THEN 1 END) as available_slots
       FROM schedules
       WHERE professional_id = $1 AND date BETWEEN $2 AND $3
       GROUP BY date
       ORDER BY date`,
      [professionalId, start.toISOString().split('T')[0], end.toISOString().split('T')[0]]
    );

    // Gerar dias da semana
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(start);
      currentDate.setDate(currentDate.getDate() + i);
      const dateStr = currentDate.toISOString().split('T')[0];

      const dayData = result.rows.find(r => r.date === dateStr);

      weekDays.push({
        date: dateStr,
        dayName: currentDate.toLocaleDateString('pt-BR', { weekday: 'long' }),
        totalSlots: dayData ? parseInt(dayData.total_slots) : 0,
        availableSlots: dayData ? parseInt(dayData.available_slots) : 0,
        hasAvailability: dayData ? parseInt(dayData.available_slots) > 0 : true
      });
    }

    res.json(weekDays);
  } catch (error) {
    console.error('Get week availability error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /schedules/:id - Atualizar agendamento
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { isAvailable, notes } = req.body;

    const result = await pool.query(
      `UPDATE schedules SET is_available = $1, notes = $2, updated_at = CURRENT_TIMESTAMP
       WHERE id = $3 RETURNING *`,
      [isAvailable, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Update schedule error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /schedules/:id - Excluir agendamento
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM schedules WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Agendamento não encontrado' });
    }

    res.json({ message: 'Agendamento excluído' });
  } catch (error) {
    console.error('Delete schedule error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
