import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import UserProfileManagement from "@/components/user-profile-management";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserProfile, getUserSubscription, getSubscriptionTier } from "@/utils/auth";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile
  const userProfile = await getUserProfile(user.id);
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
        activeTab="settings"
        onTabChange={() => {}}
        hasFeatureAccess={hasFeatureAccess}
      />
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          {userProfile ? (
            <UserProfileManagement user={user} userProfile={userProfile as any} />
          ) : (
            <div className="text-center text-gray-500">User profile not found.</div>
          )}
        </div>
      </div>
    </>
  );
}
