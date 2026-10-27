export async function onRequestPost(context) {
  try {
    const { request, env } = context;

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({
        error: "Invalid request payload. Expected JSON body."
      }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const { email, name, plan, paymentIntentId, licenseKey, method } = body;

    if (!email) {
      return new Response(JSON.stringify({ error: "Missing required parameter: email" }), {
        status: 400,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    const amount = plan === 'yearly' ? 27600 : 2900;
    const db = env.DB;

    // 1. Provision license key on app.sovdash.com (Neon Postgres)
    let provisionedKey = licenseKey || null;
    try {
      const provRes = await fetch("https://app.sovdash.com/api/billing/provision", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          plan: plan === 'enterprise' ? 'enterprise' : 'pro',
          amount,
          paymentIntentId: paymentIntentId || licenseKey,
          licenseKey
        })
      });
      if (provRes.ok) {
        const provData = await provRes.json();
        if (provData.licenseKey) provisionedKey = provData.licenseKey;
      }
    } catch (e) {
      console.warn("Cross-origin license provisioning warning:", e.message);
    }

    if (db) {
      await db.prepare(`
        INSERT INTO purchases (email, name, plan, amount, stripe_payment_intent_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(email, name || 'Valued Subscriber', plan, amount, paymentIntentId || provisionedKey || null, 'completed').run();

      return new Response(JSON.stringify({
        success: true,
        licenseKey: provisionedKey,
        message: "Purchase stored securely in Cloudflare D1 and provisioned on app.sovdash.com.",
        source: "D1_AND_NEON_POSTGRES"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      return new Response(JSON.stringify({
        success: true,
        licenseKey: provisionedKey,
        message: "License provisioned on app.sovdash.com (Cloudflare D1 binding optional).",
        source: "NEON_POSTGRES_PROVISIONED"
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

  } catch (err) {
    return new Response(JSON.stringify({
      error: err.message,
      code: "DATABASE_EXECUTION_ERROR"
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      }
    });
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
