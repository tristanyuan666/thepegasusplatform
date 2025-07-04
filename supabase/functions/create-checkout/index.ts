import { corsHeaders } from "@shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Stripe
const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
if (!stripeKey) {
  throw new Error("STRIPE_SECRET_KEY environment variable is required");
}

const stripe = new Stripe(stripeKey, {
  apiVersion: "2024-06-20",
  httpClient: Stripe.createFetchHttpClient(),
});

// Initialize Supabase
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  console.log("=== EDGE FUNCTION CALLED ===");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    console.log("Handling CORS preflight");
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    console.log("Method not allowed:", req.method);
    return new Response(
      JSON.stringify({
        error: "Method not allowed",
        success: false,
      }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    console.log("=== CHECKOUT REQUEST START ===");

    // Parse request body
    const body = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));

    // Extract required parameters
    const {
      price_id,
      user_id,
      return_url,
      cancel_url,
      customer_email,
      plan_name,
      billing_cycle,
      metadata = {},
      test_mode = false,
    } = body;

    // Validate required fields
    if (!price_id || !user_id) {
      return new Response(
        JSON.stringify({
          error: "Missing required fields: price_id and user_id are required",
          success: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Handle test mode - return success without creating actual session
    if (test_mode) {
      console.log("Test mode detected - returning mock success response");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Edge Function is working! Test mode enabled.",
          test_mode: true,
          timestamp: new Date().toISOString(),
          environment_check: {
            stripe_key_exists: !!Deno.env.get("STRIPE_SECRET_KEY"),
            supabase_url_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_URL"),
            supabase_service_key_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verify Stripe price exists and is active
    console.log("Verifying Stripe price:", price_id);
    try {
      const price = await stripe.prices.retrieve(price_id);
      if (!price.active) {
        throw new Error(`Price ${price_id} is not active`);
      }
      console.log("Price verified:", {
        id: price.id,
        active: price.active,
        amount: price.unit_amount,
      });
    } catch (priceError) {
      console.error("Price verification failed:", priceError);
      return new Response(
        JSON.stringify({
          error: "Invalid price ID",
          success: false,
          details: priceError.message,
          price_id_attempted: price_id,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Set up URLs
    const baseUrl = "https://epic-raman6-4uxp6.view-3.tempo-dev.app";
    const successUrl = return_url || `${baseUrl}/success`;
    const cancelUrl = cancel_url || `${baseUrl}/pricing?cancelled=true`;

    console.log("Creating Stripe checkout session...");

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: price_id,
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}&plan=${plan_name || "unknown"}&billing=${billing_cycle || "monthly"}`,
      cancel_url: `${cancelUrl}&reason=user_cancelled`,
      customer_email: customer_email || undefined,
      client_reference_id: user_id,
      metadata: {
        user_id,
        plan_name: plan_name || "Unknown Plan",
        billing_cycle: billing_cycle || "monthly",
        created_at: new Date().toISOString(),
        ...metadata,
      },
      subscription_data: {
        metadata: {
          user_id,
          plan_name: plan_name || "Unknown Plan",
          billing_cycle: billing_cycle || "monthly",
        },
      },
      allow_promotion_codes: true,
      billing_address_collection: "required",
      automatic_tax: {
        enabled: true,
      },
    });

    console.log("Checkout session created:", {
      sessionId: session.id,
      url: session.url,
      status: session.status,
    });

    // Store session in database for tracking
    try {
      await supabase.from("checkout_sessions").insert({
        session_id: session.id,
        user_id: user_id,
        price_id: price_id,
        plan_name: plan_name || "Unknown Plan",
        billing_cycle: billing_cycle || "monthly",
        amount: session.amount_total,
        currency: session.currency,
        status: "pending",
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.warn("Failed to store session in database:", dbError);
      // Don't fail checkout for database errors
    }

    // Validate session URL
    if (!session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    const response = {
      sessionId: session.id,
      url: session.url,
      success: true,
      status: session.status,
      created: session.created,
      expires_at: session.expires_at,
    };

    console.log("=== CHECKOUT SUCCESS ===");
    console.log("Response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("=== CHECKOUT ERROR ===");
    console.error("Error type:", typeof error);
    console.error("Error:", error);
    console.error(
      "Error stack:",
      error instanceof Error ? error.stack : "No stack",
    );

    let statusCode = 500;
    let errorMessage = "Internal server error";

    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Error message:", errorMessage);

      // Handle specific error types
      if (error.message.includes("price")) {
        statusCode = 400;
        errorMessage = "Invalid price configuration";
      } else if (error.message.includes("customer")) {
        statusCode = 400;
        errorMessage = "Invalid customer information";
      } else if (
        error.message.includes("network") ||
        error.message.includes("timeout")
      ) {
        statusCode = 503;
        errorMessage = "Service temporarily unavailable";
      }
    }

    const errorResponse = {
      error: errorMessage,
      success: false,
      timestamp: new Date().toISOString(),
      details: error instanceof Error ? error.message : "Unknown error",
      function_name: "create-checkout",
      environment_check: {
        stripe_key_exists: !!Deno.env.get("STRIPE_SECRET_KEY"),
        supabase_url_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_URL"),
        supabase_service_key_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
      },
    };

    console.error("Error response:", errorResponse);

    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
