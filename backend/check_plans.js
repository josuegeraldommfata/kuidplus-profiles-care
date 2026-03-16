const pool = require('../db');

function checkSubscription(requiredPlanSlugs = []) {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: 'Não autenticado' });
      }

      const result = await pool.query(
        `
        SELECT s.status, s.expires_at, p.slug
        FROM subscriptions s
        JOIN plans p ON p.id = s.plan_id
        WHERE s.user_id = $1
        ORDER BY s.created_at DESC
        LIMIT 1
        `,
        [userId]
      );

      if (result.rows.length === 0) {
        return res.status(403).json({ error: 'Sem assinatura ativa' });
      }

      const sub = result.rows[0];

      if (sub.status !== 'active') {
        return res.status(403).json({ error: 'Assinatura inativa' });
      }

      if (sub.expires_at && new Date(sub.expires_at) < new Date()) {
        return res.status(403).json({ error: 'Assinatura expirada' });
      }

      if (
        requiredPlanSlugs.length &&
        !requiredPlanSlugs.includes(sub.slug)
      ) {
        return res.status(403).json({ error: 'Plano insuficiente' });
      }

      req.subscription = sub;
      next();
    } catch (err) {
      console.error('checkSubscription:', err);
      res.status(500).json({ error: 'Erro ao validar assinatura' });
    }
  };
}

module.exports = { checkSubscription };
