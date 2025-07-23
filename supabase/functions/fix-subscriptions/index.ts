import { corsHeaders } from "../_shared/cors.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

// Initialize Supabase
const supabaseUrl = Deno.env.get("NEXT_PUBLIC_SUPABASE_URL");
const supabaseServiceKey = Deno.env.get("SERVICE_ROLE_KEY");

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error("Supabase environment variables are required");
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

Deno.serve(async (req) => {
  console.log("=== FIX SUBSCRIPTIONS FUNCTION CALLED ===");
  console.log("Method:", req.method);

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  // Only allow POST requests
  if (req.method !== "POST") {
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
    const body = await req.json();
    const { action, user_id, subscription_id, plan_name, billing_cycle } = body;

    if (action === "fix_user_subscriptions") {
      // Fix all subscriptions for a specific user
      if (!user_id) {
        return new Response(
          JSON.stringify({
            error: "user_id is required",
            success: false,
          }),
          {
            status: 400,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      console.log(`Fixing subscriptions for user: ${user_id}`);

      // Get user details
      const { data: user, error: userError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", user_id)
        .single();

      if (userError || !user) {
        return new Response(
          JSON.stringify({
            error: "User not found",
            success: false,
          }),
          {
            status: 404,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      // Get all subscriptions for this user
      const { data: subscriptions, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", user_id);

      if (subError) {
        return new Response(
          JSON.stringify({
            error: `Failed to fetch subscriptions: ${subError.message}`,
            success: false,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const results = [];

      for (const subscription of subscriptions || []) {
        // Update subscription with proper data
        const updateData = {
          plan_name: subscription.plan_name || "Influencer",
          billing_cycle: subscription.billing_cycle || "monthly",
          status: subscription.status || "active",
          metadata: {
            ...subscription.metadata,
            user_id: user_id,
            plan_name: subscription.plan_name || "Influencer",
            billing_cycle: subscription.billing_cycle || "monthly",
            fixed_at: new Date().toISOString(),
            source: "fix_subscriptions_function",
          },
        };

        const { data: updatedSub, error: updateError } = await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("id", subscription.id)
          .select()
          .single();

        if (updateError) {
          results.push({
            subscription_id: subscription.stripe_id,
            success: false,
            error: updateError.message,
          });
        } else {
          results.push({
            subscription_id: subscription.stripe_id,
            success: true,
            updated_data: updateData,
          });
        }
      }

      // Update user profile
      const userUpdateData = {
        plan: "Influencer",
        plan_status: "active",
        plan_billing: "monthly",
        is_active: true,
        updated_at: new Date().toISOString(),
      };

      const { error: userUpdateError } = await supabase
        .from("users")
        .update(userUpdateData)
        .eq("user_id", user_id);

      return new Response(
        JSON.stringify({
          success: true,
          message: `Fixed ${subscriptions?.length || 0} subscriptions for user ${user_id}`,
          user: {
            user_id: user.user_id,
            email: user.email,
            plan: userUpdateData.plan,
            plan_status: userUpdateData.plan_status,
          },
          subscriptions: results,
          user_update_error: userUpdateError?.message || null,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );

    } else if (action === "fix_all_orphaned_subscriptions") {
      // Fix all subscriptions without user_id
      console.log("Fixing all orphaned subscriptions");

      const { data: orphanedSubs, error: orphanedError } = await supabase
        .from("subscriptions")
        .select("*")
        .is("user_id", null);

      if (orphanedError) {
        return new Response(
          JSON.stringify({
            error: `Failed to fetch orphaned subscriptions: ${orphanedError.message}`,
            success: false,
          }),
          {
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }

      const results = [];

      for (const subscription of orphanedSubs || []) {
        // Find most recent user as fallback
        const { data: recentUsers, error: userError } = await supabase
          .from("users")
          .select("user_id, email")
          .order("created_at", { ascending: false })
          .limit(1);

        if (userError || !recentUsers || recentUsers.length === 0) {
          results.push({
            subscription_id: subscription.stripe_id,
            success: false,
            error: "No users found for fallback",
          });
          continue;
        }

        const fallbackUser = recentUsers[0];

        // Update subscription with fallback user
        const updateData = {
          user_id: fallbackUser.user_id,
          plan_name: subscription.plan_name || "Influencer",
          billing_cycle: subscription.billing_cycle || "monthly",
          status: subscription.status || "active",
          metadata: {
            ...subscription.metadata,
            user_id: fallbackUser.user_id,
            plan_name: subscription.plan_name || "Influencer",
            billing_cycle: subscription.billing_cycle || "monthly",
            fixed_at: new Date().toISOString(),
            source: "fix_subscriptions_function",
            fallback_user: true,
          },
        };

        const { data: updatedSub, error: updateError } = await supabase
          .from("subscriptions")
          .update(updateData)
          .eq("id", subscription.id)
          .select()
          .single();

        if (updateError) {
          results.push({
            subscription_id: subscription.stripe_id,
            success: false,
            error: updateError.message,
          });
        } else {
          results.push({
            subscription_id: subscription.stripe_id,
            success: true,
            fallback_user: fallbackUser.user_id,
            updated_data: updateData,
          });
        }
      }

      return new Response(
        JSON.stringify({
          success: true,
          message: `Fixed ${orphanedSubs?.length || 0} orphaned subscriptions`,
          results: results,
        }),
        {
          status: 200,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );

    } else {
      return new Response(
        JSON.stringify({
          error: "Invalid action. Use 'fix_user_subscriptions' or 'fix_all_orphaned_subscriptions'",
          success: false,
        }),
        {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

  } catch (error) {
    console.error("Error in fix-subscriptions function:", error);
    return new Response(
      JSON.stringify({
        error: "Internal server error",
        details: error instanceof Error ? error.message : "Unknown error",
        success: false,
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
}); 