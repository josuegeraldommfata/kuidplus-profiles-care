const User = require('../models/User');

const checkSubscription = async (req, res, next) => {
  try {
    // Se não há usuário logado, permite o acesso (para rotas públicas)
    if (!req.user || !req.user.id) {
      return next();
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Usuário não encontrado.'
      });
    }

    if (user.role === 'contratante') {
      const now = new Date();
      const hasActiveSubscription = user.subscription_status === 'active';

      // Trial
      if (user.trial_ends_at && !hasActiveSubscription) {
        const trialEnds = new Date(user.trial_ends_at);
        const diffMs = trialEnds - now;
        const daysLeft = Math.max(Math.ceil(diffMs / (1000 * 60 * 60 * 24)), 0);

        if (daysLeft <= 0) {
          return res.status(402).json({
            success: false,
            code: 'SUBSCRIPTION_REQUIRED',
            message: 'Seu período gratuito terminou. Assine um plano para continuar.',
            subscription: {
              status: 'expired',
              days_left: 0,
              plan_required: 'Contratante'
            },
            redirect: '/planos/contratante'
          });
        }

        // Trial válido → deixa passar, mas informa
        req.subscriptionInfo = {
          status: 'trial',
          days_left: daysLeft,
          plan_required: 'Contratante'
        };
      }
    }

    req.userData = user;
    next();
  } catch (error) {
    console.error('Subscription check error:', error);
    res.status(500).json({
      success: false,
      message: 'Erro interno do servidor.'
    });
  }
};

module.exports = { checkSubscription };
