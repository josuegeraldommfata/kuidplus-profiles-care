const express = require('express');
const router = express.Router();
const pool = require('../db');
const { authenticateToken } = require('../middleware/auth');

/**
 * GET /api/stats/professional
 * Retorna estatísticas do profissional logado
 */
router.get('/professional', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar perfil profissional
    const profileResult = await pool.query(
      'SELECT id, whatsapp_clicks, weekly_views, rating, total_ratings FROM professionals WHERE user_id = $1',
      [userId]
    );

    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Perfil profissional não encontrado' });
    }

    const profile = profileResult.rows[0];

    // Buscar total de avaliações recebidas
    const reviewsResult = await pool.query(
      `SELECT COUNT(*) as total, AVG(rating) as avg_rating
       FROM reviews
       WHERE reviewee_id = $1 AND reviewee_role = 'profissional'`,
      [profile.id]
    );

    // Buscar total de contratos
    const contractsResult = await pool.query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
              SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed
       FROM contracts
       WHERE professional_id = $1`,
      [profile.id]
    );

    // Buscar agendamentos próximos (próximos 7 dias)
    const upcomingSchedulesResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM schedules
       WHERE professional_id = $1
       AND date >= CURRENT_DATE
       AND date <= CURRENT_DATE + INTERVAL '7 days'`,
      [profile.id]
    );

    // Buscar visualizações dos últimos 30 dias
    const viewsHistoryResult = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as views
       FROM professional_views
       WHERE professional_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [profile.id]
    );

    // Buscar cliques no WhatsApp dos últimos 30 dias
    const whatsappClicksResult = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as clicks
       FROM whatsapp_clicks
       WHERE professional_id = $1 AND created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`,
      [profile.id]
    );

    // Buscar profissionais por cidade (para comparação)
    const cityRankingResult = await pool.query(
      `SELECT city, COUNT(*) as total
       FROM professionals
       WHERE status = 'approved' AND city IS NOT NULL
       GROUP BY city
       ORDER BY total DESC
       LIMIT 10`
    );

    // Buscar profissionais por especialidade
    const professionRankingResult = await pool.query(
      `SELECT profession, COUNT(*) as total
       FROM professionals
       WHERE status = 'approved' AND profession IS NOT NULL
       GROUP BY profession
       ORDER BY total DESC`
    );

    res.json({
      profile: {
        whatsapp_clicks: profile.whatsapp_clicks || 0,
        weekly_views: profile.weekly_views || 0,
        rating: profile.rating || 0,
        total_ratings: profile.total_ratings || 0,
      },
      reviews: {
        total: parseInt(reviewsResult.rows[0].total) || 0,
        avg_rating: parseFloat(reviewsResult.rows[0].avg_rating) || 0,
      },
      contracts: {
        total: parseInt(contractsResult.rows[0].total) || 0,
        active: parseInt(contractsResult.rows[0].active) || 0,
        completed: parseInt(contractsResult.rows[0].completed) || 0,
      },
      schedules: {
        upcoming: parseInt(upcomingSchedulesResult.rows[0].total) || 0,
      },
      views_history: viewsHistoryResult.rows,
      whatsapp_clicks_history: whatsappClicksResult.rows,
      city_ranking: cityRankingResult.rows,
      profession_ranking: professionRankingResult.rows,
    });
  } catch (error) {
    console.error('Stats professional error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats/contractor
 * Retorna estatísticas do contratante logado
 */
router.get('/contractor', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;

    // Buscar total de contratos
    const contractsResult = await pool.query(
      `SELECT COUNT(*) as total,
              SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
              SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
              SUM(CASE WHEN status = 'cancelled' THEN 1 ELSE 0 END) as cancelled
       FROM contracts
       WHERE contractor_id = $1`,
      [userId]
    );

    // Buscar total de avaliações feitas
    const reviewsGivenResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM reviews
       WHERE reviewer_id = $1`,
      [userId]
    );

    // Buscar total de avaliações recebidas
    const reviewsReceivedResult = await pool.query(
      `SELECT COUNT(*) as total, AVG(rating) as avg_rating
       FROM reviews
       WHERE reviewee_id = $1 AND reviewee_role = 'contratante'`,
      [userId]
    );

    // Buscar profissionais favoritos
    const favoritesResult = await pool.query(
      `SELECT COUNT(*) as total
       FROM favorites
       WHERE user_id = $1`,
      [userId]
    );

    // Buscar histórico de gastos (últimos 12 meses)
    const spendingHistoryResult = await pool.query(
      `SELECT DATE_TRUNC('month', created_at) as month, SUM(value) as total
       FROM payments
       WHERE user_id = $1 AND status = 'approved'
       AND created_at >= CURRENT_DATE - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month ASC`,
      [userId]
    );

    // Buscar profissionais contratados por categoria
    const hiredByProfessionResult = await pool.query(
      `SELECT p.profession, COUNT(*) as total
       FROM contracts c
       JOIN professionals p ON c.professional_id = p.id
       WHERE c.contractor_id = $1
       GROUP BY p.profession
       ORDER BY total DESC`,
      [userId]
    );

    res.json({
      contracts: {
        total: parseInt(contractsResult.rows[0].total) || 0,
        active: parseInt(contractsResult.rows[0].active) || 0,
        completed: parseInt(contractsResult.rows[0].completed) || 0,
        cancelled: parseInt(contractsResult.rows[0].cancelled) || 0,
      },
      reviews_given: parseInt(reviewsGivenResult.rows[0].total) || 0,
      reviews_received: {
        total: parseInt(reviewsReceivedResult.rows[0].total) || 0,
        avg_rating: parseFloat(reviewsReceivedResult.rows[0].avg_rating) || 0,
      },
      favorites: parseInt(favoritesResult.rows[0].total) || 0,
      spending_history: spendingHistoryResult.rows,
      hired_by_profession: hiredByProfessionResult.rows,
    });
  } catch (error) {
    console.error('Stats contractor error:', error);
    res.status(500).json({ error: error.message });
  }
});

/**
 * GET /api/stats/admin
 * Retorna estatísticas globais para o admin
 */
router.get('/admin', authenticateToken, async (req, res) => {
  try {
    // Verificar se é admin
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Acesso restrito a administradores' });
    }

    // Total de usuários
    const usersResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN role = 'profissional' THEN 1 ELSE 0 END) as professionals,
        SUM(CASE WHEN role = 'contratante' THEN 1 ELSE 0 END) as contractors,
        SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 ELSE 0 END) as new_this_month
       FROM users`
    );

    // Total de perfis profissionais
    const profilesResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'approved' THEN 1 ELSE 0 END) as approved,
        SUM(CASE WHEN status = 'pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status = 'rejected' THEN 1 ELSE 0 END) as rejected
       FROM professionals`
    );

    // Total de contratos
    const contractsResult = await pool.query(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN status = 'completed' THEN 1 ELSE 0 END) as completed,
        SUM(CASE WHEN created_at >= CURRENT_DATE - INTERVAL '30 days' THEN 1 ELSE 0 END) as new_this_month
       FROM contracts`
    );

    // Total de avaliações
    const reviewsResult = await pool.query(
      `SELECT COUNT(*) as total,
              AVG(rating) as avg_rating
       FROM reviews`
    );

    // Total de assinaturas ativas
    const subscriptionsResult = await pool.query(
      `SELECT COUNT(*) as active,
              SUM(CASE WHEN plan_type = 'base' THEN 1 ELSE 0 END) as base,
              SUM(CASE WHEN plan_type = 'profissional' THEN 1 ELSE 0 END) as profissional,
              SUM(CASE WHEN plan_type = 'premium' THEN 1 ELSE 0 END) as premium
       FROM subscriptions
       WHERE status = 'active'`
    );

    // Profissionais por cidade
    const professionalsByCityResult = await pool.query(
      `SELECT city, COUNT(*) as total
       FROM professionals
       WHERE status = 'approved' AND city IS NOT NULL
       GROUP BY city
       ORDER BY total DESC
       LIMIT 10`
    );

    // Profissionais por especialidade
    const professionalsByProfessionResult = await pool.query(
      `SELECT profession, COUNT(*) as total
       FROM professionals
       WHERE status = 'approved' AND profession IS NOT NULL
       GROUP BY profession
       ORDER BY total DESC`
    );

    // Registro de novos usuários (últimos 30 dias)
    const newUsersHistoryResult = await pool.query(
      `SELECT DATE(created_at) as date, COUNT(*) as total
       FROM users
       WHERE created_at >= CURRENT_DATE - INTERVAL '30 days'
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    // Contratos por mês (últimos 12 meses)
    const contractsHistoryResult = await pool.query(
      `SELECT DATE_TRUNC('month', created_at) as month, COUNT(*) as total
       FROM contracts
       WHERE created_at >= CURRENT_DATE - INTERVAL '12 months'
       GROUP BY DATE_TRUNC('month', created_at)
       ORDER BY month ASC`
    );

    // Revenue (receita)
    const revenueResult = await pool.query(
      `SELECT SUM(amount) as total
       FROM payments
       WHERE status = 'approved'`
    );

    res.json({
      users: {
        total: parseInt(usersResult.rows[0].total) || 0,
        professionals: parseInt(usersResult.rows[0].professionals) || 0,
        contractors: parseInt(usersResult.rows[0].contractors) || 0,
        new_this_month: parseInt(usersResult.rows[0].new_this_month) || 0,
      },
      profiles: {
        total: parseInt(profilesResult.rows[0].total) || 0,
        approved: parseInt(profilesResult.rows[0].approved) || 0,
        pending: parseInt(profilesResult.rows[0].pending) || 0,
        rejected: parseInt(profilesResult.rows[0].rejected) || 0,
      },
      contracts: {
        total: parseInt(contractsResult.rows[0].total) || 0,
        active: parseInt(contractsResult.rows[0].active) || 0,
        completed: parseInt(contractsResult.rows[0].completed) || 0,
        new_this_month: parseInt(contractsResult.rows[0].new_this_month) || 0,
      },
      reviews: {
        total: parseInt(reviewsResult.rows[0].total) || 0,
        avg_rating: parseFloat(reviewsResult.rows[0].avg_rating) || 0,
      },
      subscriptions: {
        active: parseInt(subscriptionsResult.rows[0].active) || 0,
        base: parseInt(subscriptionsResult.rows[0].base) || 0,
        profissional: parseInt(subscriptionsResult.rows[0].profissional) || 0,
        premium: parseInt(subscriptionsResult.rows[0].premium) || 0,
      },
      professionals_by_city: professionalsByCityResult.rows,
      professionals_by_profession: professionalsByProfessionResult.rows,
      new_users_history: newUsersHistoryResult.rows,
      contracts_history: contractsHistoryResult.rows,
      revenue: parseFloat(revenueResult.rows[0].total) || 0,
    });
  } catch (error) {
    console.error('Stats admin error:', error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
