import { corsHeaders } from "@shared/cors.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") as string, {
  apiVersion: "2024-06-20",
});

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { customer_id, return_url } = await req.json();

    if (!customer_id) {
      return new Response(JSON.stringify({ error: "Missing customer_id" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Creating portal session for customer:", customer_id);

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer_id,
      return_url:
        return_url ||
        "https://epic-raman6-4uxp6.view-3.tempo-dev.app/dashboard",
    });

    console.log("Portal session created:", portalSession.id);

    return new Response(
      JSON.stringify({
        url: portalSession.url,
        success: true,
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error creating portal session:", error);
    return new Response(
      JSON.stringify({
        error: "Failed to create portal session",
        details: error.message,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
