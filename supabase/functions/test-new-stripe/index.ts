import { corsHeaders } from "@shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Testing new Stripe account connection...");

    // Check environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not found");
    }

    console.log("Stripe key found, initializing...");

    // Initialize Stripe with new key
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Test Stripe connection by listing account details
    const account = await stripe.accounts.retrieve();
    console.log("Account retrieved:", account.id);

    // Test by listing products
    const products = await stripe.products.list({ limit: 10 });
    console.log("Products found:", products.data.length);

    // Test by listing prices
    const prices = await stripe.prices.list({ limit: 10 });
    console.log("Prices found:", prices.data.length);

    const response = {
      success: true,
      message: "New Stripe account connection successful!",
      timestamp: new Date().toISOString(),
      account_id: account.id,
      account_country: account.country,
      account_currency: account.default_currency,
      products_count: products.data.length,
      prices_count: prices.data.length,
      products: products.data.map((p) => ({
        id: p.id,
        name: p.name,
        active: p.active,
        created: p.created,
      })),
      prices: prices.data.map((p) => ({
        id: p.id,
        product: p.product,
        unit_amount: p.unit_amount,
        currency: p.currency,
        recurring: p.recurring,
        active: p.active,
      })),
      environment: {
        STRIPE_SECRET_KEY: !!Deno.env.get("STRIPE_SECRET_KEY"),
        SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
        SUPABASE_SERVICE_KEY: !!Deno.env.get("SUPABASE_SERVICE_KEY"),
      },
    };

    console.log("New Stripe test response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("New Stripe test error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        stripe_connected: false,
        details: error instanceof Error ? error.stack : "No stack trace",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
