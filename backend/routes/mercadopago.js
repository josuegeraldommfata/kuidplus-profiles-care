const express = require('express');
const router = express.Router();
const pool = require('../db');

const { MercadoPagoConfig, Preference, Payment } = require('mercadopago');

if (!process.env.MP_ACCESS_TOKEN) {
  console.warn('⚠️ MP_ACCESS_TOKEN not set; using user-saved keys if available.');
}

const { encrypt, decrypt } = require('../utils/crypto');

/* =========================
   CREATE PREFERENCE
========================= */
router.post('/create_preference', async (req, res) => {
  const { userId, planId } = req.body;
  if (!userId || !planId) {
    return res.status(400).json({ error: 'userId and planId required' });
  }

  try {
    const planRes = await pool.query(
      'SELECT id, name, price, duration_days FROM plans WHERE id = $1 LIMIT 1',
      [planId]
    );
    if (planRes.rowCount === 0) {
      return res.status(404).json({ error: 'Plan not found' });
    }
    const plan = planRes.rows[0];

    let payer = {};
    try {
      const u = await pool.query(
        'SELECT email, name FROM users WHERE id = $1 LIMIT 1',
        [userId]
      );
      if (u.rowCount > 0) {
        payer = { email: u.rows[0].email, name: u.rows[0].name };
      }
    } catch (_) {}

    const preference = {
      items: [
        {
          id: `plan-${plan.id}`,
          title: plan.name,
          description: `Assinatura ${plan.name}`,
          quantity: 1,
          currency_id: 'BRL',
          unit_price: Number(plan.price),
        },
      ],
      payer,
      external_reference: `${userId}|${planId}`,
      back_urls: {
        success: process.env.MP_BACK_URL_SUCCESS || 'http://localhost:5173/',
        failure: process.env.MP_BACK_URL_FAILURE || 'http://localhost:5173/',
        pending: process.env.MP_BACK_URL_PENDING || 'http://localhost:5173/',
      },
      notification_url:
        process.env.MP_NOTIFICATION_URL ||
        `${process.env.BACKEND_URL || 'http://localhost:5000'}/api/mercadopago/webhook`,
    };

    let token = process.env.MP_ACCESS_TOKEN || null;

    if (!token) {
      const keys = await pool.query(
        'SELECT private_key FROM api_keys WHERE user_id = $1 AND provider = $2 ORDER BY id DESC LIMIT 1',
        [userId, 'mercadopago']
      );
      if (keys.rowCount > 0) {
        token = decrypt(keys.rows[0].private_key);
      }
    }

    if (!token) {
      return res.status(500).json({ error: 'Mercado Pago token not configured' });
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const preferenceClient = new Preference(client);

    const mpRes = await preferenceClient.create({ body: preference });

    res.json({
      id: mpRes.id,
      init_point: mpRes.init_point,
      sandbox_init_point: mpRes.sandbox_init_point,
    });
  } catch (err) {
    console.error('MercadoPago create_preference error:', err);
    res.status(500).json({ error: 'Failed to create preference' });
  }
});

/* =========================
   SAVE API KEYS
========================= */
router.post('/save_keys', async (req, res) => {
  const { userId, provider, public_key, private_key, meta } = req.body;
  if (!provider) {
    return res.status(400).json({ error: 'provider required' });
  }

  try {
    const enc = private_key ? encrypt(private_key) : null;
    const result = await pool.query(
      `INSERT INTO api_keys (user_id, provider, public_key, private_key, meta)
       VALUES ($1,$2,$3,$4,$5)
       RETURNING id, user_id, provider, public_key, created_at`,
      [userId || null, provider, public_key || null, enc, meta || {}]
    );

    res.json({ saved: result.rows[0] });
  } catch (err) {
    console.error('Error saving API keys:', err);
    res.status(500).json({ error: 'Failed to save keys' });
  }
});

/* =========================
   WEBHOOK
========================= */
router.post('/webhook', async (req, res) => {
  try {
    const resource =
      req.query['data.id'] ||
      req.query['id'] ||
      (req.body?.data && req.body.data.id);

    if (!resource) {
      return res.status(200).send('OK');
    }

    let token = process.env.MP_ACCESS_TOKEN || null;

    if (!token) {
      const keys = await pool.query(
        'SELECT private_key FROM api_keys WHERE provider = $1 ORDER BY id DESC LIMIT 1',
        ['mercadopago']
      );
      if (keys.rowCount > 0) {
        token = decrypt(keys.rows[0].private_key);
      }
    }

    if (!token) {
      console.warn('Webhook received but no MP token available');
      return res.status(200).send('OK');
    }

    const client = new MercadoPagoConfig({ accessToken: token });
    const paymentClient = new Payment(client);

    const payment = await paymentClient.get({ id: resource });
    const data = payment;

    const extRef = data.external_reference;
    const status = data.status;
    const amount = data.transaction_amount;
    const payerEmail = data.payer?.email || null;

    let userId = null;
    if (payerEmail) {
      const u = await pool.query(
        'SELECT id FROM users WHERE email = $1 LIMIT 1',
        [payerEmail]
      );
      if (u.rowCount > 0) userId = u.rows[0].id;
    }

    await pool.query(
      `INSERT INTO payments
       (user_id, amount, currency, provider, provider_payment_id, status, meta)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        userId,
        amount,
        data.currency_id || 'BRL',
        'mercadopago',
        data.id,
        status,
        data,
      ]
    );

    if (extRef) {
      const [extUserId, extPlanId] = extRef.split('|');

      if (extUserId && extPlanId && status === 'approved') {
        const planRow = await pool.query(
          'SELECT duration_days FROM plans WHERE id = $1 LIMIT 1',
          [extPlanId]
        );

        const duration =
          planRow.rowCount > 0
            ? Number(planRow.rows[0].duration_days) || 30
            : 30;

        const start = new Date();
        const end = new Date(start.getTime() + duration * 86400000);

        await pool.query(
          `INSERT INTO subscriptions
           (user_id, plan_id, status, started_at, ends_at, auto_renew, provider_subscription_id)
           VALUES ($1,$2,$3,$4,$5,$6,$7)`,
          [
            extUserId,
            extPlanId,
            'active',
            start.toISOString(),
            end.toISOString(),
            false,
            data.id,
          ]
        );
      }
    }

    res.status(200).send('OK');
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(200).send('OK');
  }
});

module.exports = router;
