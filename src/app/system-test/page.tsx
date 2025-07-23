import { createClient } from "@/supabase/server";
import SystemTest from "@/components/system-test";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserProfile, getUserSubscription, getSubscriptionTier } from "@/utils/auth";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function SystemTestPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const userProfile = user ? await getUserProfile(user.id) : null;
  const subscriptionData = user ? await getUserSubscription(user.id) : null;
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
        userProfile={userProfile as any}
        subscription={subscription}
        activeTab="home"

        hasFeatureAccess={hasFeatureAccess}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <SystemTest user={user} />
        </div>
      </div>
    </>
  );
}
