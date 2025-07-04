import { corsHeaders } from "@shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    console.log("Testing Stripe connection...");

    // Check environment variables
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      throw new Error("STRIPE_SECRET_KEY not found");
    }

    // Initialize Stripe
    const stripe = new Stripe(stripeKey, {
      apiVersion: "2024-06-20",
      httpClient: Stripe.createFetchHttpClient(),
    });

    // Test Stripe connection by listing products
    const products = await stripe.products.list({ limit: 1 });

    // Test price retrieval with a known price ID
    let priceTest = null;
    try {
      priceTest = await stripe.prices.retrieve(
        "price_1QdGGJCQldCuIb4OjVQzjQoL",
      );
    } catch (priceError) {
      console.warn("Price test failed:", priceError.message);
    }

    const response = {
      success: true,
      message: "Stripe connection successful!",
      timestamp: new Date().toISOString(),
      stripe_connected: true,
      products_count: products.data.length,
      price_test: priceTest
        ? {
            id: priceTest.id,
            active: priceTest.active,
            currency: priceTest.currency,
            unit_amount: priceTest.unit_amount,
          }
        : "Price test failed",
      environment: {
        STRIPE_SECRET_KEY: !!Deno.env.get("STRIPE_SECRET_KEY"),
        SUPABASE_URL: !!Deno.env.get("SUPABASE_URL"),
        SUPABASE_SERVICE_KEY: !!Deno.env.get("SUPABASE_SERVICE_KEY"),
      },
    };

    console.log("Stripe test response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Stripe test error:", error);

    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
        stripe_connected: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
