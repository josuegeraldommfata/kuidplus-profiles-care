const express = require('express');
const router = express.Router();
const pool = require('../db');
const { default: mercadopago } = require('mercadopago');
const mercadopagoConfig = require('../mercadopago-config');
const mg = new mercadopago(mercadopagoConfig.access_token || process.env.MP_ACCESS_TOKEN);




// Rota para listar planos
router.get('/plans', async (req, res) => {
  try {
    const result = await pool.query('SELECT id, name, price, currency, duration_days, slug, features FROM plans ORDER BY id');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Service payment checkout - usado após aceitar proposta
router.post('/service-checkout/:serviceId', async (req, res) => {
  const serviceId = req.params.serviceId;
  const contractorId = req.user.id; // middleware auth

  try {
    // Get service + proposal
    const service = await pool.query(`
      SELECT s.*, sp.proposal_id, p.amount as proposal_amount
      FROM services s
      JOIN service_proposals sp ON s.id = sp.service_id
      LEFT JOIN proposal_applications p ON sp.proposal_id = p.id
      WHERE s.id = $1 AND s.contractor_id = $2 AND sp.status = 'accepted'
    `, [serviceId, contractorId]);

    if (service.rowCount === 0) {
      return res.status(404).json({ error: 'Serviço ou proposta não encontrada' });
    }

    const serviceData = service.rows[0];
    const amount = serviceData.proposal_amount || serviceData.budget_max || 100.00;
    const commission = amount * 0.15;
    const platform_amount = amount - commission;

    // Create payment record
    const payment = await pool.query(`
      INSERT INTO payments (service_id, proposal_id, professional_id, contractor_id, professional_name, service_title, amount, commission_amount, commission_percent, status)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, 'pending')
      RETURNING *
    `, [serviceId, serviceData.proposal_id, serviceData.professional_id, contractorId, serviceData.professional_name, serviceData.title, amount, commission, 15]);

    // MercadoPago preference
    const preference = {
      items: [{
        title: `Serviço: ${serviceData.title}`,
        unit_price: Number(amount),
        quantity: 1,
        id: payment.rows[0].id.toString(),
      }],
      payer: {
        id: contractorId.toString(),
      },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/pagamento-success?payment_id=${payment.rows[0].id}`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/pagamento-failed`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/pagamento-pending`,
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/webhook`,
      statement_descriptor: 'KUIDD+ - Plantão',
      purpose: 'service',
      metadata: {
        service_id: serviceId,
        proposal_id: serviceData.proposal_id,
        payment_id: payment.rows[0].id,
      }
    };

    const mpResponse = await mg.preferences.create(preference);

    res.json({
      payment_id: payment.rows[0].id,
      mp_preference_id: mpResponse.body.id,
      init_point: mpResponse.body.init_point,
      amount,
      platform_amount,
      commission,
      service_title: serviceData.title,
    });
  } catch (err) {
    console.error('Payment checkout error:', err);
    res.status(500).json({ error: err.message });
  }
});

// MercadoPago webhook
router.post('/webhook', express.raw({type: 'application/json'}), async (req, res) => {
  try {
    const paymentData = req.body;

    if (paymentData.action === 'payment.updated') {
      const paymentId = paymentData.data.id;
      const mpStatus = paymentData.data.status;

      let status = 'rejected';
      if (mpStatus === 'approved') status = 'paid';
      else if (mpStatus === 'pending') status = 'pending';

      await pool.query(`
        UPDATE payments SET mp_payment_id = $1, status = $2 WHERE id = $3
      `, [paymentId, status, paymentData.data.metadata?.payment_id || 0]);

      // Emit socket notification
      req.io.to(`professional_${paymentData.data.metadata?.professional_id}`).emit('payment_status', {
        payment_id: paymentData.data.metadata?.payment_id,
        status
      });
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).send('ERROR');
  }
});

module.exports = router;


// /create_preference - FOR PLANS (matches frontend Planos.tsx)
const { authenticateToken } = require('../middleware/auth');
router.post('/create_preference', authenticateToken, async (req, res) => {
  const userId = req.user.id;
  const { planId } = req.body;

  if (!planId) return res.status(400).json({ error: 'planId required' });

  try {
    // Get plan details
    const planResult = await pool.query(
      'SELECT id, name, price, currency, duration_days, slug, features FROM plans WHERE id = $1',
      [planId]
    );

    if (planResult.rowCount === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }

    const plan = planResult.rows[0];
    const amount = parseFloat(plan.price);

    // Create subscription record (pending)
    const started_at = new Date();
    const trial_days = plan.features?.trial ? 7 : 0;
    const ends_at = new Date(started_at.getTime() + (plan.duration_days + trial_days) * 24 * 60 * 60 * 1000);
    const trial_ends_at = trial_days > 0 ? new Date(started_at.getTime() + trial_days * 24 * 60 * 60 * 1000) : null;

    const subResult = await pool.query(
      `INSERT INTO subscriptions (user_id, plan_id, status, started_at, ends_at, trial_ends_at, auto_renew)
       VALUES ($1, $2, 'pending', $3, $4, $5, true)
       RETURNING *`,
      [userId, planId, started_at.toISOString(), ends_at.toISOString(), trial_ends_at?.toISOString() || null]
    );

    const subscription = subResult.rows[0];

    // MercadoPago preference
    const preference = {
      items: [{
        id: subscription.id.toString(),
        title: `KUID+ ${plan.name} ${trial_days > 0 ? '(7 dias grátis + trial)' : '(Assinatura mensal)'}`,
        unit_price: amount,
        quantity: 1,
        currency_id: plan.currency || 'BRL',
      }],
      payer: { id: userId.toString() },
      back_urls: {
        success: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/planos?success=true&sub_id=${subscription.id}`,
        failure: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/planos?error=failed`,
        pending: `${process.env.FRONTEND_URL || 'http://localhost:8080'}/planos?pending=true`,
      },
      notification_url: `${process.env.BACKEND_URL || 'http://localhost:3000'}/api/payments/webhook`,
      statement_descriptor: 'KUID+ Profiles Care',
      purpose: 'subscription',
      metadata: {
        subscription_id: subscription.id,
        plan_id: planId,
        user_id: userId,
      }
    };

    const mpResponse = await mg.preferences.create(preference);

    res.json({
      preference: mpResponse.body,
      init_point: mpResponse.body.init_point,
      sandbox_init_point: mpResponse.body.sandbox_init_point,
      subscription_id: subscription.id,
      amount,
      plan_name: plan.name,
      trial_days
    });

  } catch (err) {
    console.error('Create preference error:', err);
    res.status(500).json({ error: err.message });
  }
});


module.exports = router;
