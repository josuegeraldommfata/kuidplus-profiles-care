const express = require('express');
const router = express.Router();
const mercadopago = require('mercadopago');
const dotenv = require('dotenv');
const { Pool } = require('pg');

dotenv.config();

const pool = new Pool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'Kuid',
  password: process.env.DB_PASSWORD || '',
  port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
});

// Configure mercadopago with global token if present
if (!process.env.MP_ACCESS_TOKEN) {
  console.warn('MP_ACCESS_TOKEN not set; Mercado Pago endpoints will try user-saved keys.');
} else {
  mercadopago.configure({ access_token: process.env.MP_ACCESS_TOKEN });
}

const { encrypt, decrypt } = require('../utils/crypto');

// Create a preference for a plan
router.post('/create_preference', async (req, res) => {
  const { userId, planId } = req.body;
  if (!userId || !planId) return res.status(400).json({ error: 'userId and planId required' });

  try {
    const planRes = await pool.query('SELECT id, name, price, duration_days FROM plans WHERE id = $1 LIMIT 1', [planId]);
    if (planRes.rowCount === 0) return res.status(404).json({ error: 'Plan not found' });
    const plan = planRes.rows[0];

    // try get user email to prefill payer
    let payer = {};
    try {
      const u = await pool.query('SELECT email, name FROM users WHERE id = $1 LIMIT 1', [userId]);
      if (u.rowCount > 0) payer = { email: u.rows[0].email, name: u.rows[0].name };
    } catch (e) {
      // ignore
    }

    const preference = {
      items: [
        {
          id: `plan-${plan.id}`,
          title: plan.name,
          description: `Assinatura ${plan.name}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: parseFloat(plan.price)
        }
      ],
      payer,
      // external_reference helps map payment back to user and plan in webhook
      external_reference: `${userId}|${planId}`,
      back_urls: {
        success: process.env.MP_BACK_URL_SUCCESS || 'http://localhost:5173/',
        failure: process.env.MP_BACK_URL_FAILURE || 'http://localhost:5173/',
        pending: process.env.MP_BACK_URL_PENDING || 'http://localhost:5173/'
      },
      notification_url: process.env.MP_NOTIFICATION_URL || `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/mercadopago/webhook`
    };

    // ensure mercadopago SDK configured: try global token, else try user's saved key
    if (!process.env.MP_ACCESS_TOKEN) {
      try {
        const keys = await pool.query('SELECT private_key FROM api_keys WHERE user_id = $1 AND provider = $2 ORDER BY id DESC LIMIT 1', [userId, 'mercadopago']);
        if (keys.rowCount > 0) {
          const enc = keys.rows[0].private_key;
          const token = decrypt(enc);
          if (token) mercadopago.configure({ access_token: token });
        }
      } catch (e) {
        console.error('Error loading user API key for Mercado Pago:', e);
      }
    }

    const mpRes = await mercadopago.preferences.create(preference);
    // opcional: armazene provider_plan_id ou provider_subscription_id conforme seu fluxo
    // store provider_plan_id in plans? For now return data to frontend
    return res.json({ preference: mpRes, init_point: mpRes.body.init_point, sandbox_init_point: mpRes.body.sandbox_init_point });
  } catch (err) {
    console.error('MercadoPago create_preference error:', err);
    return res.status(500).json({ error: err.message || err });
  }
});

  // Save API keys for a user (e.g., customer's Mercado Pago keys)
  router.post('/save_keys', async (req, res) => {
    const { userId, provider, public_key, private_key, meta } = req.body;
    if (!provider) return res.status(400).json({ error: 'provider required' });
    try {
      const enc = private_key ? encrypt(private_key) : null;
      const result = await pool.query(`INSERT INTO api_keys (user_id, provider, public_key, private_key, meta) VALUES ($1,$2,$3,$4,$5) RETURNING id, user_id, provider, public_key, created_at`, [userId || null, provider, public_key || null, enc, meta || {}]);
      res.json({ saved: result.rows[0] });
    } catch (err) {
      console.error('Error saving API keys:', err);
      res.status(500).json({ error: err.message || err });
    }
  });

// Webhook endpoint (notification from Mercado Pago)
router.post('/webhook', express.raw({ type: '*/*' }), async (req, res) => {
  // Mercado Pago sends notifications that should be verified. For simplicity, we'll log and attempt to update payments/subscriptions.
  try {
    // If called with raw body, parse query params from req.query (MP may send POST with JSON)
    const topic = req.query.type || req.query.topic || req.headers['x-topic'];
    const resource = req.query['data.id'] || req.query['id'] || (req.body && req.body.id);

    console.log('MP webhook received', { topic, resource });

    // Try to fetch payment details when resource looks like a payment id
    try {
      if (resource) {
        // resource may be numeric id
        let mpPayment;
        try {
          mpPayment = await mercadopago.payment.get(resource);
        } catch (e) {
          try {
            mpPayment = await mercadopago.payment.findById(resource);
          } catch (e2) {
            mpPayment = null;
          }
        }

        const paymentBody = mpPayment && (mpPayment.body || mpPayment.response || mpPayment);
        console.log('MP payment fetched:', paymentBody && paymentBody.status);

        if (paymentBody) {
          const provider_payment_id = paymentBody.id || resource;
          const amount = paymentBody.transaction_amount || (paymentBody.transaction_details && paymentBody.transaction_details.total_paid_amount) || null;
          const currency = (paymentBody.currency_id) || 'BRL';
          const status = paymentBody.status || (paymentBody.status_detail) || 'unknown';
          const payerEmail = paymentBody.payer && (paymentBody.payer.email || paymentBody.payer.nickname);

          // try map payer to user_id
          let userId = null;
          if (payerEmail) {
            const u = await pool.query('SELECT id FROM users WHERE email = $1 LIMIT 1', [payerEmail]);
            if (u.rowCount > 0) userId = u.rows[0].id;
          }

          await pool.query(`INSERT INTO payments (user_id, amount, currency, provider, provider_payment_id, status, meta) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [userId, amount, currency, 'mercadopago', provider_payment_id, status, paymentBody]);

          // Optionally update subscriptions if you store provider ids there
          // Example: find subscription by provider_subscription_id and set status active
          if (paymentBody.subscription_id) {
            await pool.query('UPDATE subscriptions SET status = $1 WHERE provider_subscription_id = $2', ['active', paymentBody.subscription_id]);
          }

          // If preference external_reference was set as userId|planId, create or activate subscription accordingly
          const extRef = paymentBody.external_reference || (paymentBody.preference && paymentBody.preference.external_reference) || null;
          if (extRef) {
            try {
              const parts = String(extRef).split('|');
              const extUserId = parts[0];
              const extPlanId = parts[1] ? parseInt(parts[1], 10) : null;
              if (extPlanId) {
                // create subscription record linked to plan
                const planRow = await pool.query('SELECT duration_days FROM plans WHERE id = $1 LIMIT 1', [extPlanId]);
                const duration = planRow.rowCount > 0 ? (parseInt(planRow.rows[0].duration_days, 10) || 30) : 30;
                const started = new Date();
                const ends = new Date(started.getTime() + duration * 24 * 60 * 60 * 1000);
                await pool.query(`INSERT INTO subscriptions (user_id, plan_id, status, started_at, ends_at, auto_renew, provider_subscription_id) VALUES ($1,$2,$3,$4,$5,$6,$7)`, [extUserId, extPlanId, status === 'approved' || status === 'paid' || status === 'authorized' ? 'active' : 'pending', started.toISOString(), ends.toISOString(), false, provider_payment_id]);
                console.log('Subscription created/updated from external_reference for plan', extPlanId);
              }
            } catch (err3) {
              console.error('Error processing external_reference for subscription:', err3);
            }
          }
        }
      }
    } catch (err2) {
      console.error('Error processing MP webhook details:', err2);
    }

    // Acknowledge
    res.status(200).send('OK');
  } catch (err) {
    console.error('Error handling MP webhook:', err);
    res.status(500).send('ERR');
  }
});

module.exports = router;
