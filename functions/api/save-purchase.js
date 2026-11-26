export async function onRequestPost(context) {
  const CORS = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*"
  };

  try {
    const { request, env } = context;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ error: "Invalid request payload. Expected JSON body." }), {
        status: 400, headers: CORS
      });
    }

    let { email, name, plan, paymentIntentId, licenseKey } = body;

    // 1. Server-side Stripe PaymentIntent verification whenever Stripe secret is configured
    let verifiedAmount = plan === 'yearly' ? 27600 : 2900;
    let verifiedWithStripe = false;

    if (env.STRIPE_SECRET_KEY) {
      if (!paymentIntentId || !String(paymentIntentId).startsWith('pi_')) {
        return new Response(JSON.stringify({
          error: "Missing or invalid Stripe payment_intent ID. Purchase cannot be provisioned without a verified payment.",
          code: "PAYMENT_UNVERIFIED"
        }), { status: 402, headers: CORS });
      }

      const piRes = await fetch(
        `https://api.stripe.com/v1/payment_intents/${encodeURIComponent(paymentIntentId)}?expand[]=latest_charge`,
        {
          method: "GET",
          headers: { "Authorization": `Bearer ${env.STRIPE_SECRET_KEY}` }
        }
      );

      if (!piRes.ok) {
        return new Response(JSON.stringify({
          error: "Unable to verify payment intent with Stripe.",
          code: "STRIPE_LOOKUP_FAILED"
        }), { status: 402, headers: CORS });
      }

      const piData = await piRes.json();
      if (piData.status !== 'succeeded') {
        return new Response(JSON.stringify({
          error: `Payment has not succeeded (status: ${piData.status}).`,
          code: "PAYMENT_NOT_SUCCEEDED"
        }), { status: 402, headers: CORS });
      }

      verifiedWithStripe = true;
      verifiedAmount = piData.amount_received || piData.amount || verifiedAmount;
      if (verifiedAmount >= 27600) plan = 'yearly';

      // Recover payer email / name from Stripe if Express Checkout omitted URL params
      const stripeEmail = piData.receipt_email || piData.latest_charge?.billing_details?.email || '';
      const stripeName = piData.latest_charge?.billing_details?.name || '';
      if (!email || !email.includes('@')) email = stripeEmail;
      if (!name || name === 'Valued Subscriber') name = stripeName || name;
    }

    if (!email || !email.includes('@')) {
      return new Response(JSON.stringify({ error: "Missing valid subscriber email." }), {
        status: 400, headers: CORS
      });
    }

    // 2. Provision license key on app.sovdash.com (Neon Postgres)
    let provisionedKey = licenseKey || null;
    try {
      const provRes = await fetch("https://app.sovdash.com/api/billing/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name: name || 'Valued Subscriber',
          plan: plan === 'enterprise' ? 'enterprise' : 'pro',
          amount: verifiedAmount,
          paymentIntentId: paymentIntentId || provisionedKey,
          licenseKey: provisionedKey
        })
      });
      if (provRes.ok) {
        const provData = await provRes.json();
        if (provData.licenseKey) provisionedKey = provData.licenseKey;
      }
    } catch (e) {
      console.warn("Cross-origin license provisioning warning:", e.message);
    }

    // 3. Record verified purchase in Cloudflare D1 (if bound)
    const db = env.DB;
    if (db) {
      await db.prepare(`
        INSERT INTO purchases (email, name, plan, amount, stripe_payment_intent_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(
        email,
        name || 'Valued Subscriber',
        plan || 'monthly',
        verifiedAmount,
        paymentIntentId || provisionedKey || null,
        'completed'
      ).run();
    }

    return new Response(JSON.stringify({
      success: true,
      verifiedWithStripe,
      email,
      name: name || 'Valued Subscriber',
      plan: plan || 'monthly',
      licenseKey: provisionedKey,
      source: db ? "D1_AND_NEON_POSTGRES" : "NEON_POSTGRES_PROVISIONED"
    }), { status: 200, headers: CORS });

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message,
      code: "DATABASE_EXECUTION_ERROR"
    }), { status: 500, headers: CORS });
  }
}

export async function onRequestOptions() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Max-Age": "86400"
    }
  });
}
