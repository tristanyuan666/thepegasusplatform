import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserSubscription, getSubscriptionTier, SubscriptionData } from "@/utils/auth";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ContentHubPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch user profile
  const { data: userProfile } = await supabase
    .from("user_profiles")
    .select("*")
    .eq("user_id", user.id)
    .single();

  const subscriptionData = await getUserSubscription(user.id);
  const subscriptionTier = getSubscriptionTier(subscriptionData);
  const hasActiveSubscription = !!(subscriptionData && subscriptionData.status === "active");

  // Convert SubscriptionData to Subscription type for DashboardNavbar
  const subscription = subscriptionData ? {
    stripe_id: subscriptionData.stripe_id || "",
    user_id: subscriptionData.user_id || "",
    plan_name: subscriptionData.plan_name || "",
    billing_cycle: subscriptionData.billing_cycle || subscriptionData.interval || "",
    status: subscriptionData.status || "",
    current_period_start: subscriptionData.current_period_start || 0,
    current_period_end: subscriptionData.current_period_end || 0,
    cancel_at_period_end: subscriptionData.cancel_at_period_end || false,
  } : null;

  // Mock function for feature access (you can implement this based on your needs)
  const hasFeatureAccess = (feature: string) => {
    if (!hasActiveSubscription) return false;
    switch (feature) {
      case "analytics":
        return subscriptionTier === "influencer" || subscriptionTier === "superstar";
      case "revenue":
        return subscriptionTier === "influencer" || subscriptionTier === "superstar";
      case "platforms":
        return subscriptionTier === "influencer" || subscriptionTier === "superstar";
      default:
        return true;
    }
  };

  return (
    <>
      <DashboardNavbar
        user={user}
        userProfile={userProfile}
        subscription={subscription}
        activeTab="home"
        onTabChange={() => {}}
        hasFeatureAccess={hasFeatureAccess}
      />
      <ContentCreationHub
        user={user}
        hasActiveSubscription={hasActiveSubscription}
        subscriptionTier={subscriptionTier}
      />
    </>
  );
}
