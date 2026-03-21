const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/stats/professional - Estatísticas profissional
 */
router.get('/professional', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const profileResult = await pool.query(
      'SELECT id FROM professionals WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.json({ profile: {}, reviews: { total: 0, avg_rating: 0 }, contracts: { total: 0, active: 0, completed: 0 } });
    }

    const profileId = profileResult.rows[0].id;
    const [reviewsResult, contractsResult] = await Promise.all([
      pool.query('SELECT COUNT(*) as total, AVG(rating)::numeric(3,1) as avg_rating FROM reviews WHERE reviewee_id = $1 AND reviewee_role = $2', [profileId, 'profissional']),
      pool.query('SELECT COUNT(*) as total FROM contracts WHERE professional_id = $1', [profileId])
    ]);

    res.json({
      profile: {},
      reviews: reviewsResult.rows[0],
      contracts: contractsResult.rows[0]
    });
  } catch (error) {
    console.error('Stats professional error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats/contractor - Estatísticas contratante (CORRIGIDO 500)
 */
router.get('/contractor', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [contractsResult, servicesResult] = await Promise.all([
      pool.query(`
        SELECT
          COUNT(*) FILTER (WHERE contractor_id = $1) as total,
          COUNT(*) FILTER (WHERE contractor_id = $1 AND status = 'active') as active,
          COUNT(*) FILTER (WHERE contractor_id = $1 AND status = 'completed') as completed
        FROM contracts
      `, [userId]),
      pool.query(`
        SELECT
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'open') as open
        FROM services WHERE contractor_id = $1
      `, [userId])
    ]);

    res.json({
      contracts: contractsResult.rows[0],
      services: servicesResult.rows[0],
      success: true
    });
  } catch (error) {
    console.error('Stats contractor error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

