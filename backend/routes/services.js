const express = require('express');
const router = express.Router();
const pool = require('../db');
const auth = require('../middleware/auth').authenticateToken;

// Listar serviços abertos (procurar turnos)
router.get('/open', async (req, res) => {
  try {
    const { city, profession, page = 1 } = req.query;
    const limit = 12;
    const offset = (page - 1) * limit;

    let query = `
      SELECT s.*,
             u.name as contractor_name,
             COUNT(sp.id) as proposals_count
      FROM services s
      JOIN users u ON s.contractor_id = u.id
      LEFT JOIN service_proposals sp ON s.id = sp.service_id AND sp.status = 'pending'
      WHERE s.status = 'open'
    `;
    let params = [];

    if (city) {
      query += ` AND s.city ILIKE $${params.length + 1}`;
      params.push(`%${city}%`);
    }
    if (profession) {
      query += ` AND s.profession ILIKE $${params.length + 1}`;
      params.push(`%${profession}%`);
    }

    query += ` GROUP BY s.id, u.name ORDER BY s.created_at DESC LIMIT $${params.length + 1} OFFSET $${params.length + 2}`;
    params.push(limit, offset);

    const services = await pool.query(query, params);
    res.json(services.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET /api/services/my-counts - Contadores de serviços (corrige MarketplaceSidebar)
router.get('/my-counts', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const role = req.user.role;

    let counts = { pending: 0, active: 0, total: 0 };

    if (role === 'contratante') {
      // Serviços do contratante
      const result = await pool.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN status = 'open' THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN status IN ('profissional_selecionado', 'active') THEN 1 ELSE 0 END) as active
        FROM services WHERE contractor_id = $1
      `, [userId]);
      counts = result.rows[0];
    } else if (role === 'profissional') {
      // Aplicações do profissional
      const result = await pool.query(`
        SELECT
          COUNT(*) as total,
          SUM(CASE WHEN sp.status = 'pendente' OR sp.status IS NULL THEN 1 ELSE 0 END) as pending,
          SUM(CASE WHEN sp.status = 'aceita' THEN 1 ELSE 0 END) as active
        FROM service_proposals sp
        JOIN services s ON sp.service_id = s.id
        WHERE sp.professional_id = $1
      `, [userId]);
      counts = result.rows[0];
    }

    res.json(counts);
  } catch (error) {
    console.error('Services my-counts error:', error);
    res.status(500).json({ error: 'Erro ao carregar contadores' });
  }
});

// Serviços do usuário atual (contratante) - mantido compatibilidade
router.get('/my-services', auth, async (req, res) => {
  try {
    const services = await pool.query(`
      SELECT s.*,
             COUNT(sp.id) as proposals_count,
             sp.status as proposal_status,
             sp.professional_id,
             u.name as professional_name,
             p.amount as proposal_amount
      FROM services s
      LEFT JOIN service_proposals sp ON s.id = sp.service_id AND sp.status = 'accepted'
      LEFT JOIN proposal_applications p ON sp.proposal_id = p.id
      LEFT JOIN users u ON sp.professional_id = u.id
      WHERE s.contractor_id = $1
      ORDER BY s.created_at DESC
    `, [req.user.id]);

    res.json(services.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Criar serviço
router.post('/', auth, async (req, res) => {
  const { title, description, profession, city, budget_min, budget_max, deadline } = req.body;

  try {
    const service = await pool.query(`
      INSERT INTO services (contractor_id, title, description, profession, city, budget_min, budget_max, deadline, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')
      RETURNING *
    `, [req.user.id, title, description, profession, city, budget_min, budget_max, deadline]);

    res.json(service.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

