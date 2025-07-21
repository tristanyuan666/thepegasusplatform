import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Supabase
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Stripe webhook secret
const STRIPE_WEBHOOK_SECRET = Deno.env.get("STRIPE_WEBHOOK_SECRET");

if (!STRIPE_WEBHOOK_SECRET) {
  throw new Error("STRIPE_WEBHOOK_SECRET environment variable is required");
}

Deno.serve(async (req) => {
  console.log("=== STRIPE WEBHOOK CALLED ===");
  console.log("Method:", req.method);
  console.log("Headers:", Object.fromEntries(req.headers.entries()));

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "Method not allowed" }),
      {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  try {
    // Get the raw body for signature verification
    const rawBody = await req.text();
    console.log("Raw webhook body:", rawBody);

    // Verify webhook signature
    const signature = req.headers.get("x-signature");
    if (!signature) {
      console.error("No signature found in webhook");
      return new Response(
        JSON.stringify({ error: "No signature found" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Verify the signature (Stripe uses HMAC SHA256)
    const crypto = await import("https://deno.land/std@0.177.0/crypto/mod.ts");
    const encoder = new TextEncoder();
    const key = encoder.encode(STRIPE_WEBHOOK_SECRET);
    const message = encoder.encode(rawBody);
    
    const hmacKey = await crypto.hmacKey("sha256", key);
    const signatureBytes = await crypto.hmacSign(hmacKey, message);
    const expectedSignature = Array.from(signatureBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (signature !== expectedSignature) {
      console.error("Invalid webhook signature");
      return new Response(
        JSON.stringify({ error: "Invalid signature" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    // Parse the webhook data
    const webhookData = JSON.parse(rawBody);
    console.log("Webhook data:", JSON.stringify(webhookData, null, 2));

    const eventName = webhookData.type;
    const eventData = webhookData.data.object;

    console.log("Processing Stripe event:", eventName);

    // Handle different Stripe webhook events
    switch (eventName) {
      case "checkout.session.completed":
        await handleCheckoutCompleted(supabase, eventData);
        break;
      case "customer.subscription.created":
        await handleSubscriptionCreated(supabase, eventData);
        break;
      case "customer.subscription.updated":
        await handleSubscriptionUpdated(supabase, eventData);
        break;
      case "customer.subscription.deleted":
        await handleSubscriptionCancelled(supabase, eventData);
        break;
      default:
        console.log("Unhandled Stripe event:", eventName);
    }

    // Store webhook event for tracking
    try {
      await supabase.from("webhook_events").insert({
        event_type: eventName,
        type: "stripe",
        stripe_event_id: webhookData.id || "unknown",
        data: webhookData,
        created_at: new Date().toISOString(),
      });
    } catch (dbError) {
      console.warn("Failed to store webhook event:", dbError);
    }

    return new Response(
      JSON.stringify({ success: true, event: eventName }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Webhook processing error:", error);
    return new Response(
      JSON.stringify({
        error: "Webhook processing failed",
        details: error instanceof Error ? error.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});

async function handleCheckoutCompleted(supabaseClient: any, eventData: any) {
  console.log("Handling checkout completed:", eventData.id);
  
  // Update checkout session status
  await supabaseClient
    .from("checkout_sessions")
    .update({
      status: "completed",
      amount: eventData.amount_total,
      currency: eventData.currency,
      completed_at: new Date().toISOString(),
    })
    .eq("session_id", eventData.id);
}

async function handleSubscriptionCreated(supabaseClient: any, eventData: any) {
  console.log("Handling subscription created:", eventData.id);
  // Create or update subscription in database
  await supabaseClient
    .from("subscriptions")
    .upsert({
      stripe_id: eventData.id,
      user_id: eventData.metadata?.user_id,
      status: eventData.status,
      plan_name: eventData.metadata?.plan_name || "Unknown Plan",
      billing_cycle: eventData.metadata?.billing_cycle || "monthly",
      current_period_start: eventData.current_period_start,
      current_period_end: eventData.current_period_end,
      cancel_at_period_end: eventData.cancel_at_period_end,
      metadata: {
        ...eventData.metadata,
        subscription_id: eventData.id,
        created_at: new Date().toISOString(),
      },
    }, {
      onConflict: "stripe_id"
    });

  // Update user profile/role/features
  if (eventData.metadata?.user_id) {
    await supabaseClient
      .from("users")
      .update({
        plan: eventData.metadata?.plan_name || "Unknown Plan",
        plan_status: eventData.status,
        plan_billing: eventData.metadata?.billing_cycle || "monthly",
        plan_period_end: eventData.current_period_end,
        is_active: eventData.status === "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", eventData.metadata.user_id);
  }
}

async function handleSubscriptionUpdated(supabaseClient: any, eventData: any) {
  console.log("Handling subscription updated:", eventData.id);
  // Update subscription in database
  await supabaseClient
    .from("subscriptions")
    .update({
      status: eventData.status,
      current_period_start: eventData.current_period_start,
      current_period_end: eventData.current_period_end,
      cancel_at_period_end: eventData.cancel_at_period_end,
      metadata: {
        ...eventData.metadata,
        subscription_id: eventData.id,
        updated_at: new Date().toISOString(),
      },
    })
    .eq("stripe_id", eventData.id);

  // Update user profile/role/features
  if (eventData.metadata?.user_id) {
    await supabaseClient
      .from("users")
      .update({
        plan: eventData.metadata?.plan_name || "Unknown Plan",
        plan_status: eventData.status,
        plan_billing: eventData.metadata?.billing_cycle || "monthly",
        plan_period_end: eventData.current_period_end,
        is_active: eventData.status === "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", eventData.metadata.user_id);
  }
}

async function handleSubscriptionCancelled(supabaseClient: any, eventData: any) {
  console.log("Handling subscription cancelled:", eventData.id);
  
  // Update subscription status in database
  await supabaseClient
    .from("subscriptions")
    .update({
      status: "cancelled",
      cancel_at_period_end: true,
      metadata: {
        cancelled_at: new Date().toISOString(),
        subscription_id: eventData.id,
      },
    })
    .eq("stripe_id", eventData.id);
} 