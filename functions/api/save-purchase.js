export async function onRequestPost(context) {
  try {
    const { request, env } = context;
    
    // Parse request JSON body safely
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

    const { email, name, plan, paymentIntentId, method } = body;
    
    if (!email) {
      return new Response(JSON.stringify({ error: "Missing required parameter: email" }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Dynamic price calculation in cents (Stripe currency standard)
    const amount = plan === 'yearly' ? 27600 : 2900; 

    // Cloudflare D1 Database binding check
    const db = env.DB;
    
    if (db) {
      // Execute standard SQL prepared statement to record purchase securely
      await db.prepare(`
        INSERT INTO purchases (email, name, plan, amount, stripe_payment_intent_id, status)
        VALUES (?, ?, ?, ?, ?, ?)
      `).bind(email, name || 'Valued Subscriber', plan, amount, paymentIntentId || null, 'completed').run();

      return new Response(JSON.stringify({ 
        success: true, 
        message: "Purchase stored securely in Cloudflare D1 database.",
        source: "D1_DATABASE"
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*"
        }
      });
    } else {
      // Elegant Developer Sandbox/Fallback when D1 is not bound yet in Pages Dashboard
      console.warn("Cloudflare D1 Database binding 'DB' is not configured. Purchase logs bypassed.");
      return new Response(JSON.stringify({ 
        success: true, 
        message: "Purchase logged in sandbox mode (Cloudflare D1 DB binding not active yet).",
        source: "SANDBOX_SIMULATOR"
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

// Handle preflight OPTIONS requests for CORS (assisting local environment debugging)
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
