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

    // Step 1: Find all users who have checkout sessions but no subscriptions
    const { data: checkoutSessions, error: checkoutError } = await supabaseClient
      .from("checkout_sessions")
      .select("*")
      .in("status", ["pending", "completed"])
      .order("created_at", { ascending: false });

    if (checkoutError) {
      console.error("❌ Error fetching checkout sessions:", checkoutError);
      throw checkoutError;
    }

    console.log(`📋 Found ${checkoutSessions?.length || 0} checkout sessions`);

    const fixedUsers = [];
    const errors = [];

    // Step 2: Process each checkout session
    for (const session of checkoutSessions || []) {
      try {
        console.log(`🔍 Processing checkout session: ${session.session_id}`);
        
        if (!session.user_id) {
          console.log("⚠️ Checkout session missing user_id, skipping");
          continue;
        }

        // Check if user already has a subscription
        const { data: existingSubscription } = await supabaseClient
          .from("subscriptions")
          .select("*")
          .eq("user_id", session.user_id)
          .maybeSingle();

        if (existingSubscription) {
          console.log("✅ User already has subscription, skipping");
          continue;
        }

        // Check if user profile has plan access
        const { data: userProfile } = await supabaseClient
          .from("users")
          .select("*")
          .eq("user_id", session.user_id)
          .single();

        if (userProfile && userProfile.plan && userProfile.plan_status === "active") {
          console.log("✅ User already has plan access, skipping");
          continue;
        }

        console.log("🔧 Creating subscription for user:", session.user_id);

        // Create subscription based on checkout session
        const subscriptionData = {
          stripe_id: `manual_${session.session_id}_${Date.now()}`,
          user_id: session.user_id,
          plan_name: session.plan_name || "Influencer",
          billing_cycle: session.billing_cycle || "monthly",
          status: "active",
          current_period_start: Math.floor(Date.now() / 1000),
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // 30 days
          cancel_at_period_end: false,
          metadata: {
            user_id: session.user_id,
            plan_name: session.plan_name || "Influencer",
            billing_cycle: session.billing_cycle || "monthly",
            checkout_session_id: session.session_id,
            created_at: new Date().toISOString(),
            source: "manual_fix_function",
          },
        };

        const { data: newSubscription, error: createError } = await supabaseClient
          .from("subscriptions")
          .insert(subscriptionData)
          .select()
          .single();

        if (createError) {
          console.error("❌ Error creating subscription:", createError);
          errors.push({ 
            user_id: session.user_id, 
            session_id: session.session_id,
            error: createError.message 
          });
          continue;
        }

        console.log("✅ Subscription created successfully");

        // Update user profile with plan access
        const userUpdateData = {
          plan: session.plan_name || "Influencer",
          plan_status: "active",
          plan_billing: session.billing_cycle || "monthly",
          is_active: true,
          updated_at: new Date().toISOString(),
        };

        const { error: userUpdateError } = await supabaseClient
          .from("users")
          .update(userUpdateData)
          .eq("user_id", session.user_id);

        if (userUpdateError) {
          console.error("❌ Error updating user profile:", userUpdateError);
          errors.push({ 
            user_id: session.user_id, 
            session_id: session.session_id,
            error: userUpdateError.message 
          });
        } else {
          console.log("✅ User profile updated successfully");
          fixedUsers.push({
            user_id: session.user_id,
            session_id: session.session_id,
            plan_name: session.plan_name || "Influencer",
            billing_cycle: session.billing_cycle || "monthly",
            subscription_id: newSubscription.id,
          });
        }

      } catch (error) {
        console.error("❌ Error processing checkout session:", session.session_id, error);
        errors.push({ 
          user_id: session.user_id, 
          session_id: session.session_id,
          error: error.message 
        });
      }
    }

    // Step 3: Also fix existing subscriptions that might be broken
    const { data: allSubscriptions, error: subError } = await supabaseClient
      .from("subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (!subError && allSubscriptions) {
      console.log(`📋 Processing ${allSubscriptions.length} existing subscriptions`);
      
      for (const subscription of allSubscriptions) {
        if (!subscription.user_id) {
          console.log("⚠️ Found subscription without user_id:", subscription.stripe_id);
          
          // Try to find user by recent checkout sessions
          const { data: recentSessions } = await supabaseClient
            .from("checkout_sessions")
            .select("*")
            .in("status", ["pending", "completed"])
            .order("created_at", { ascending: false })
            .limit(1);

          if (recentSessions && recentSessions.length > 0) {
            const recentSession = recentSessions[0];
            
            const { error: updateError } = await supabaseClient
              .from("subscriptions")
              .update({
                user_id: recentSession.user_id,
                plan_name: recentSession.plan_name || subscription.plan_name || "Influencer",
                billing_cycle: recentSession.billing_cycle || subscription.billing_cycle || "monthly",
                metadata: {
                  ...subscription.metadata,
                  user_id: recentSession.user_id,
                  fixed_at: new Date().toISOString(),
                },
              })
              .eq("stripe_id", subscription.stripe_id);

            if (!updateError) {
              console.log("✅ Fixed subscription without user_id");
              
              // Update user profile
              await supabaseClient
                .from("users")
                .update({
                  plan: recentSession.plan_name || "Influencer",
                  plan_status: "active",
                  plan_billing: recentSession.billing_cycle || "monthly",
                  is_active: true,
                  updated_at: new Date().toISOString(),
                })
                .eq("user_id", recentSession.user_id);
            }
          }
        }
      }
    }

    // Step 4: Return comprehensive results
    const result = {
      success: true,
      message: "Comprehensive subscription fix completed",
      summary: {
        total_checkout_sessions: checkoutSessions?.length || 0,
        fixed_users: fixedUsers.length,
        errors: errors.length,
      },
      fixed_users: fixedUsers,
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