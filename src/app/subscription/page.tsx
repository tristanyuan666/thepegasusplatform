"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import { User } from "@supabase/supabase-js";
import DashboardNavbar from "@/components/dashboard-navbar";
import SubscriptionManagement from "@/components/subscription-management";
import LoadingSpinner from "@/components/loading-spinner";
import { SubscriptionData } from "@/utils/auth";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  plan: string | null;
  plan_status: string | null;
  plan_billing: string | null;
  is_active: boolean;
  niche: string | null;
  tone: string | null;
  content_format: string | null;
  fame_goals: string | null;
  follower_count: string | null;
  viral_score: number;
  monetization_forecast: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string | null;
}

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
          setError("Not authenticated");
          setLoading(false);
          return;
        }
        setUser(user);

        // Get user profile
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (profileError) {
          console.error("Error fetching profile:", profileError);
          setError("Failed to load profile");
          setLoading(false);
          return;
        }
        setUserProfile(profile);

        // Get subscription
        const { data: subscriptionData, error: subscriptionError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!subscriptionError && subscriptionData) {
          // Map the database subscription to SubscriptionData format
          const mappedSubscription: SubscriptionData = {
            id: subscriptionData.id,
            user_id: subscriptionData.user_id,
            stripe_id: subscriptionData.stripe_id,
            customer_id: subscriptionData.stripe_customer_id,
            price_id: subscriptionData.stripe_price_id,
            status: subscriptionData.status,
            current_period_start: subscriptionData.current_period_start,
            current_period_end: subscriptionData.current_period_end,
            cancel_at_period_end: subscriptionData.cancel_at_period_end,
            amount: subscriptionData.amount,
            currency: subscriptionData.currency,
            interval: subscriptionData.billing_cycle,
            plan_name: subscriptionData.plan_name,
            billing_cycle: subscriptionData.billing_cycle,
            features_used: subscriptionData.features_used,
            usage_limits: subscriptionData.usage_limits,
            billing_history: subscriptionData.billing_history,
            stripe_subscription_id: subscriptionData.stripe_id,
            stripe_customer_id: subscriptionData.stripe_customer_id,
            stripe_payment_intent_id: null,
            created_at: subscriptionData.created_at,
            updated_at: subscriptionData.updated_at,
          };
          setSubscription(mappedSubscription);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setError("Failed to load data");
        setLoading(false);
      }
    };

    fetchUserData();
  }, [supabase]);

  const hasFeatureAccess = (feature: string): boolean => {
    if (!subscription) return false;
    
    const plan = subscription.plan_name?.toLowerCase() || "";
    
    switch (feature) {
      case "analytics":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "revenue":
        return ["influencer", "superstar"].includes(plan);
      case "platforms":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "ai_content":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "advanced_analytics":
        return ["influencer", "superstar"].includes(plan);
      case "monetization":
        return ["influencer", "superstar"].includes(plan);
      case "team_collaboration":
        return ["superstar"].includes(plan);
      default:
        return false;
    }
  };

  if (loading) {
    return <LoadingSpinner size="lg" />;
  }

  if (error || !user || !userProfile) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center max-w-sm">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-sm sm:text-base text-gray-600 mb-4">{error || "Please sign in to access subscription management."}</p>
          <a href="/sign-in" className="text-blue-600 hover:text-blue-700 text-sm sm:text-base">
            Sign In
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
                   <DashboardNavbar
               user={user}
               userProfile={{
                 user_id: userProfile.user_id,
                 full_name: userProfile.full_name || "",
                 email: userProfile.email || "",
                 plan: userProfile.plan || "",
                 plan_status: userProfile.plan_status || "",
                 plan_billing: userProfile.plan_billing || "",
                 is_active: userProfile.is_active,
                 created_at: userProfile.created_at,
                 updated_at: userProfile.updated_at || "",
               }}
               subscription={subscription ? {
                 stripe_id: subscription.stripe_id || "",
                 user_id: subscription.user_id || "",
                 plan_name: subscription.plan_name || "",
                 billing_cycle: subscription.billing_cycle || "",
                 status: subscription.status || "",
                 current_period_start: subscription.current_period_start || 0,
                 current_period_end: subscription.current_period_end || 0,
                 cancel_at_period_end: subscription.cancel_at_period_end || false,
               } : null}
               activeTab="settings"
               hasFeatureAccess={hasFeatureAccess}
             />
      
      <main className="pt-16 md:pt-20 pb-8">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 md:mb-8 px-2 sm:px-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">Subscription Management</h1>
              <p className="text-sm sm:text-base text-gray-600">Manage your subscription, billing, and plan details.</p>
            </div>
            
            <SubscriptionManagement
              userId={user.id}
              subscription={subscription}
              featureAccess={{
                analytics: hasFeatureAccess("analytics"),
                revenue: hasFeatureAccess("revenue"),
                platforms: hasFeatureAccess("platforms"),
                ai_content: hasFeatureAccess("ai_content"),
                advanced_analytics: hasFeatureAccess("advanced_analytics"),
                monetization: hasFeatureAccess("monetization"),
                team_collaboration: hasFeatureAccess("team_collaboration"),
              }}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
