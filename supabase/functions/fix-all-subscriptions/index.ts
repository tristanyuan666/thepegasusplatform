import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    console.log("🔧 Starting comprehensive subscription fix for ALL users...");

    // Step 1: Find all subscriptions that might be broken
    const { data: allSubscriptions, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (subError) {
      console.error("❌ Error fetching subscriptions:", subError);
      throw subError;
    }

    console.log(`📋 Found ${allSubscriptions?.length || 0} total subscriptions`);

    const fixedSubscriptions = [];
    const errors = [];

    // Step 2: Process each subscription
    for (const subscription of allSubscriptions || []) {
      try {
        console.log(`🔍 Processing subscription: ${subscription.stripe_id}`);
        
        // Check if subscription has user_id
        if (!subscription.user_id) {
          console.log("⚠️ Subscription missing user_id, attempting to fix...");
          
          // Strategy 1: Look for checkout session
          const { data: checkoutSessions } = await supabaseClient
            .from("checkout_sessions")
            .select("*")
            .eq("session_id", subscription.metadata?.checkout_session_id || "")
            .maybeSingle();

          let userId = null;
          let planName = null;
          let billingCycle = null;

          if (checkoutSessions) {
            userId = checkoutSessions.user_id;
            planName = checkoutSessions.plan_name;
            billingCycle = checkoutSessions.billing_cycle;
            console.log("✅ Found user from checkout session:", userId);
          } else {
            // Strategy 2: Find user by customer email from Stripe
            if (subscription.metadata?.customer_email) {
              const { data: users } = await supabaseClient
                .from("users")
                .select("user_id, email, created_at, full_name")
                .eq("email", subscription.metadata.customer_email)
                .order("created_at", { ascending: false })
                .limit(1);

              if (users && users.length > 0) {
                userId = users[0].user_id;
                console.log("✅ Found user by email:", users[0]);
              }
            }
          }

          // Strategy 3: Use subscription creation time to find recent user
          if (!userId && subscription.created_at) {
            const subscriptionTime = new Date(subscription.created_at);
            const fiveMinutesBefore = new Date(subscriptionTime.getTime() - 5 * 60 * 1000);
            const fiveMinutesAfter = new Date(subscriptionTime.getTime() + 5 * 60 * 1000);

            const { data: recentUsers } = await supabaseClient
              .from("users")
              .select("user_id, email, created_at, full_name")
              .gte("created_at", fiveMinutesBefore.toISOString())
              .lte("created_at", fiveMinutesAfter.toISOString())
              .order("created_at", { ascending: false })
              .limit(1);

            if (recentUsers && recentUsers.length > 0) {
              userId = recentUsers[0].user_id;
              console.log("✅ Found user by creation time proximity:", recentUsers[0]);
            }
          }

          // Update subscription if we found a user
          if (userId) {
            const updateData = {
              user_id: userId,
              plan_name: planName || subscription.plan_name || "Influencer",
              billing_cycle: billingCycle || subscription.billing_cycle || "monthly",
              metadata: {
                ...subscription.metadata,
                user_id: userId,
                plan_name: planName || subscription.plan_name || "Influencer",
                billing_cycle: billingCycle || subscription.billing_cycle || "monthly",
                fixed_at: new Date().toISOString(),
                fix_method: "auto_fix_function",
              },
            };

            const { error: updateError } = await supabaseClient
              .from("subscriptions")
              .update(updateData)
              .eq("stripe_id", subscription.stripe_id);

            if (updateError) {
              console.error("❌ Error updating subscription:", updateError);
              errors.push({ subscription_id: subscription.stripe_id, error: updateError.message });
            } else {
              console.log("✅ Subscription fixed successfully");
              fixedSubscriptions.push({
                subscription_id: subscription.stripe_id,
                user_id: userId,
                plan_name: updateData.plan_name,
                billing_cycle: updateData.billing_cycle,
              });

              // Update user profile
              const userUpdateData = {
                plan: updateData.plan_name,
                plan_status: "active",
                plan_billing: updateData.billing_cycle,
                is_active: true,
                updated_at: new Date().toISOString(),
              };

              const { error: userUpdateError } = await supabaseClient
                .from("users")
                .update(userUpdateData)
                .eq("user_id", userId);

              if (userUpdateError) {
                console.error("❌ Error updating user profile:", userUpdateError);
              } else {
                console.log("✅ User profile updated successfully");
              }
            }
          } else {
            console.log("❌ Could not find user for subscription:", subscription.stripe_id);
            errors.push({ 
              subscription_id: subscription.stripe_id, 
              error: "Could not find matching user" 
            });
          }
        } else {
          console.log("✅ Subscription already has user_id, skipping");
        }
      } catch (error) {
        console.error("❌ Error processing subscription:", subscription.stripe_id, error);
        errors.push({ 
          subscription_id: subscription.stripe_id, 
          error: error.message 
        });
      }
    }

    // Step 3: Return comprehensive results
    const result = {
      success: true,
      message: "Comprehensive subscription fix completed",
      summary: {
        total_subscriptions: allSubscriptions?.length || 0,
        fixed_subscriptions: fixedSubscriptions.length,
        errors: errors.length,
      },
      fixed_subscriptions: fixedSubscriptions,
      errors: errors,
      timestamp: new Date().toISOString(),
    };

    console.log("🎉 Comprehensive fix completed:", result.summary);

    return new Response(
      JSON.stringify(result),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      }
    );

  } catch (error) {
    console.error("❌ Error in fix-all-subscriptions:", error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
        timestamp: new Date().toISOString(),
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
}); 