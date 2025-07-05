import { corsHeaders } from "@shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Supabase
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("NEXT_PUBLIC_SUPABASE_ANON_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Lemon Squeezy webhook secret
const LEMON_SQUEEZY_WEBHOOK_SECRET = Deno.env.get("LEMON_SQUEEZY_WEBHOOK_SECRET");

if (!LEMON_SQUEEZY_WEBHOOK_SECRET) {
  throw new Error("LEMON_SQUEEZY_WEBHOOK_SECRET environment variable is required");
}

Deno.serve(async (req) => {
  console.log("=== LEMON SQUEEZY WEBHOOK CALLED ===");
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

    // Verify the signature (Lemon Squeezy uses HMAC SHA256)
    const crypto = await import("https://deno.land/std@0.177.0/crypto/mod.ts");
    const encoder = new TextEncoder();
    const key = encoder.encode(LEMON_SQUEEZY_WEBHOOK_SECRET);
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

    const eventName = webhookData.meta?.event_name;
    const eventData = webhookData.data;

    console.log("Processing event:", eventName);

    // Handle different webhook events
    switch (eventName) {
      case "order_created":
        await handleOrderCreated(supabase, eventData);
        break;
      case "subscription_created":
        await handleSubscriptionCreated(supabase, eventData);
        break;
      case "subscription_updated":
        await handleSubscriptionUpdated(supabase, eventData);
        break;
      case "subscription_cancelled":
        await handleSubscriptionCancelled(supabase, eventData);
        break;
      default:
        console.log("Unhandled event:", eventName);
    }

    // Store webhook event for tracking
    try {
      await supabase.from("webhook_events").insert({
        event_type: eventName,
        type: "lemonsqueezy",
        stripe_event_id: webhookData.meta?.event_name || "unknown",
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

async function handleOrderCreated(supabaseClient: any, eventData: any) {
  console.log("Handling order created:", eventData.id);
  
  const order = eventData.attributes;
  const customData = order.custom_data || {};
  
  // Update checkout session status
  await supabaseClient
    .from("checkout_sessions")
    .update({
      status: "completed",
      amount: order.total,
      currency: order.currency,
      completed_at: new Date().toISOString(),
    })
    .eq("session_id", eventData.id);
}

async function handleSubscriptionCreated(supabaseClient: any, eventData: any) {
  console.log("Handling subscription created:", eventData.id);
  
  const subscription = eventData.attributes;
  const customData = subscription.custom_data || {};
  
  // Create or update subscription in database
  await supabaseClient
    .from("subscriptions")
    .upsert({
      stripe_id: eventData.id,
      user_id: customData.user_id,
      status: subscription.status,
      plan_name: customData.plan_name || "Unknown Plan",
      billing_cycle: customData.billing_cycle || "monthly",
      current_period_start: subscription.renews_at,
      current_period_end: subscription.renews_at,
      cancel_at_period_end: false,
      metadata: {
        ...customData,
        subscription_id: eventData.id,
        created_at: new Date().toISOString(),
      },
    }, {
      onConflict: "stripe_id"
    });
}

async function handleSubscriptionUpdated(supabaseClient: any, eventData: any) {
  console.log("Handling subscription updated:", eventData.id);
  
  const subscription = eventData.attributes;
  const customData = subscription.custom_data || {};
  
  // Update subscription in database
  await supabaseClient
    .from("subscriptions")
    .update({
      status: subscription.status,
      current_period_start: subscription.renews_at,
      current_period_end: subscription.renews_at,
      cancel_at_period_end: subscription.cancelled,
      metadata: {
        ...customData,
        subscription_id: eventData.id,
        updated_at: new Date().toISOString(),
      },
    })
    .eq("stripe_id", eventData.id);
}

async function handleSubscriptionCancelled(supabaseClient: any, eventData: any) {
  console.log("Handling subscription cancelled:", eventData.id);
  
  const subscription = eventData.attributes;
  
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