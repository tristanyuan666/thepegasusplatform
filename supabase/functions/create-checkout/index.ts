import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Supabase
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Stripe configuration
const STRIPE_SECRET_KEY = Deno.env.get("STRIPE_SECRET_KEY");

if (!STRIPE_SECRET_KEY) {
  throw new Error("Stripe environment variables are required");
}

Deno.serve(async (req) => {
  console.log("=== STRIPE CHECKOUT FUNCTION CALLED ===");
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
    console.log("=== STRIPE CHECKOUT REQUEST START ===");

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

    // Prevent duplicate purchases: check for active subscription
    const { data: existingSub, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user_id)
      .eq("status", "active")
      .maybeSingle();

    // Helper to determine plan tier order
    function getTierOrder(planName) {
      if (!planName) return 0;
      const name = planName.toLowerCase();
      if (name.includes("creator")) return 1;
      if (name.includes("influencer")) return 2;
      if (name.includes("superstar")) return 3;
      return 0;
    }

    if (existingSub) {
      console.log("Existing subscription found:", existingSub);
      const existingTier = getTierOrder(existingSub.plan_name);
      const requestedTier = getTierOrder(plan_name);
      
      console.log("Tier comparison:", {
        existingPlan: existingSub.plan_name,
        existingTier,
        requestedPlan: plan_name,
        requestedTier,
        existingBilling: existingSub.billing_cycle,
        requestedBilling: billing_cycle
      });

      // Same plan and billing cycle - prevent duplicate
      if (
        existingTier === requestedTier &&
        existingSub.billing_cycle === billing_cycle
      ) {
        return new Response(
          JSON.stringify({
            error: `You already have an active ${plan_name} (${billing_cycle}) subscription.`,
            success: false,
            details: "Duplicate subscription attempt"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      } 
      // Downgrade attempt - not allowed
      else if (existingTier > requestedTier) {
        return new Response(
          JSON.stringify({
            error: `You already have a higher-tier plan (${existingSub.plan_name}). Downgrades are not allowed through this flow.`,
            success: false,
            details: "Downgrade attempt"
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
      // Upgrade or billing cycle change - allow it
      else {
        console.log("Upgrade or billing change allowed:", {
          existingPlan: existingSub.plan_name,
          newPlan: plan_name,
          existingBilling: existingSub.billing_cycle,
          newBilling: billing_cycle
        });
        
        // For upgrades, we should ideally cancel the old subscription in Stripe
        // For now, we'll let Stripe handle it and update via webhook
      }
    }

    // Handle test mode - return success without creating actual checkout
    if (test_mode) {
      console.log("Test mode detected - returning mock success response");
      return new Response(
        JSON.stringify({
          success: true,
          message: "Stripe Edge Function is working! Test mode enabled.",
          test_mode: true,
          timestamp: new Date().toISOString(),
          environment_check: {
            stripe_secret_key_exists: !!Deno.env.get("STRIPE_SECRET_KEY"),
            supabase_url_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_URL"),
            supabase_service_key_exists: !!Deno.env.get("SERVICE_ROLE_KEY"),
          },
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Set up URLs
    const baseUrl = "https://thepegasus.ca";
    const successUrl = return_url || `${baseUrl}/success`;
    const cancelUrl = cancel_url || `${baseUrl}/pricing?cancelled=true`;

    console.log("Creating Stripe checkout session...");

    // Create Stripe checkout session using fetch API
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded",
        "Stripe-Version": "2024-12-18.acacia",
      },
      body: new URLSearchParams({
        "payment_method_types[]": "card",
        "line_items[0][price]": price_id,
        "line_items[0][quantity]": "1",
        mode: "subscription",
        success_url: successUrl,
        cancel_url: cancelUrl,
        customer_email: customer_email,
        // Pass metadata to the checkout session - this will be used by the webhook
        "metadata[user_id]": user_id,
        "metadata[plan_name]": plan_name || "Unknown Plan",
        "metadata[billing_cycle]": billing_cycle || "monthly",
        "metadata[timestamp]": new Date().toISOString(),
      }),
    });

    if (!stripeResponse.ok) {
      const errorData = await stripeResponse.text();
      console.error("Stripe API error:", errorData);
      throw new Error(`Stripe API error: ${stripeResponse.status} ${errorData}`);
    }

    const session = await stripeResponse.json();

    if (!session || !session.url) {
      throw new Error("No checkout URL returned from Stripe");
    }

    const checkoutUrl = session.url;
    const checkoutId = session.id;

    // Store checkout session in database for tracking
    try {
      await supabase.from("checkout_sessions").insert({
        session_id: checkoutId,
        user_id: user_id,
        price_id: price_id,
        plan_name: plan_name || "Unknown Plan",
        billing_cycle: billing_cycle || "monthly",
        amount: null, // Will be updated when webhook is received
        currency: "usd",
        status: "pending",
        metadata: {
          user_id: user_id,
          plan_name: plan_name || "Unknown Plan",
          billing_cycle: billing_cycle || "monthly",
          price_id: price_id,
          customer_email: customer_email,
          created_at: new Date().toISOString(),
        },
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.warn("Failed to store checkout session in database:", dbError);
      // Don't fail checkout for database errors
    }

    const response = {
      sessionId: checkoutId,
      url: checkoutUrl,
      success: true,
      status: "pending",
      created: new Date().toISOString(),
    };

    console.log("=== STRIPE CHECKOUT SUCCESS ===");
    console.log("Response:", response);

    return new Response(JSON.stringify(response), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("=== STRIPE CHECKOUT ERROR ===");
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
        stripe_secret_key_exists: !!Deno.env.get("STRIPE_SECRET_KEY"),
        supabase_url_exists: !!Deno.env.get("NEXT_PUBLIC_SUPABASE_URL"),
        supabase_service_key_exists: !!Deno.env.get("SERVICE_ROLE_KEY"),
      },
    };

    console.error("Error response:", errorResponse);

    return new Response(JSON.stringify(errorResponse), {
      status: statusCode,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
}); 