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

    const { plan } = body;
    
    // Calculate accurate prices in cents (Stripe currency standard)
    let amount = 2900; // $29.00 in cents for monthly
    if (plan === 'yearly') {
      amount = 27600; // $276.00 in cents for yearly ($23/mo billed annually)
    }

    // Access secure Cloudflare environment secret
    const stripeSecretKey = env.STRIPE_SECRET_KEY;
    
    if (!stripeSecretKey) {
      // Return a placeholder alert rather than crashing, to assist with initial setup
      return new Response(JSON.stringify({
        error: "Stripe Secret Key is not configured in Cloudflare Pages dashboard environment variables.",
        code: "STRIPE_SECRET_MISSING"
      }), {
        status: 200,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }

    // Connect directly to Stripe REST API using Edge-safe Fetch API
    const response = await fetch("https://api.stripe.com/v1/payment_intents", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${stripeSecretKey}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: new URLSearchParams({
        amount: amount.toString(),
        currency: "usd",
        "automatic_payment_methods[enabled]": "true",
        description: `Sovereign Intel Professional Plan - ${plan === 'yearly' ? 'Yearly Access' : 'Monthly Access'}`
      })
    });

    const data = await response.json();
    
    if (data.error) {
      return new Response(JSON.stringify({ 
        error: data.error.message,
        code: "STRIPE_API_ERROR" 
      }), {
        status: 400,
        headers: { 
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*" 
        }
      });
    }

    // Send client secret back to the frontend secure Elements checkout
    return new Response(JSON.stringify({ 
      clientSecret: data.client_secret 
    }), {
      status: 200,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: err.message,
      code: "EDGE_EXECUTION_ERROR" 
    }), {
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*" 
      }
    });
  }
}

// Handle preflight OPTIONS requests for CORS (if tested from separate development contexts)
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
