import { corsHeaders } from "@shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-06-20",
});

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_KEY")!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { subscription_id, user_id } = await req.json();

    if (!subscription_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "Missing subscription_id or user_id" }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Canceling subscription:", { subscription_id, user_id });

    // Cancel the subscription in Stripe
    const canceledSubscription =
      await stripe.subscriptions.cancel(subscription_id);

    console.log("Stripe subscription canceled:", canceledSubscription.id);

    // Update the subscription status in our database
    const { error: updateError } = await supabase
      .from("subscriptions")
      .update({
        status: "canceled",
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("stripe_subscription_id", subscription_id)
      .eq("user_id", user_id);

    if (updateError) {
      console.error("Error updating subscription in database:", updateError);
      return new Response(
        JSON.stringify({ error: "Failed to update subscription status" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    console.log("Subscription canceled successfully");

    return new Response(
      JSON.stringify({
        success: true,
        message: "Subscription canceled successfully",
        subscription: {
          id: canceledSubscription.id,
          status: canceledSubscription.status,
          canceled_at: canceledSubscription.canceled_at,
          current_period_end: canceledSubscription.current_period_end,
        },
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error canceling subscription:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to cancel subscription",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
