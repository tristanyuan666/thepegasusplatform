import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import {
  getUserProfile,
  getUserSubscription,
  getSubscriptionTier,
  getSocialConnections,
  UserProfile,
} from "@/utils/auth";
import OnboardingFlow from "@/components/onboarding-flow";
import DashboardHome from "@/components/dashboard-home";
import DashboardAnalytics from "@/components/dashboard-analytics";
import MonetizationSuite from "@/components/monetization-suite";
import PlatformConnections from "@/components/platform-connections";
import SubscriptionManagement from "@/components/subscription-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { getFeatureAccess } from "@/utils/feature-access";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

function LoadingSpinner() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="flex items-center gap-3 text-blue-600">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="font-medium">Loading...</span>
      </div>
    </div>
  );
}

export default async function Dashboard({
  searchParams,
}: {
  searchParams: { tab?: string; onboarding?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile and subscription with error handling
  let userProfile = null;
  let subscription = null;
  let subscriptionTier = "free";
  let socialConnections: any[] = [];
  let hasActiveSubscription = false;

  try {
    userProfile = await getUserProfile(user.id);
    subscription = await getUserSubscription(user.id);
    subscriptionTier = getSubscriptionTier(subscription);
    socialConnections = await getSocialConnections(user.id);
    
    // Check if user has active subscription
    hasActiveSubscription = subscription && subscription.status === "active";
    
    console.log("Dashboard subscription check:", {
      userId: user.id,
      hasSubscription: !!subscription,
      subscriptionStatus: subscription?.status,
      hasActiveSubscription,
      subscriptionTier
    });
  } catch (error) {
    console.error("Error fetching user data in dashboard:", error);
    // Continue with default values, but log the error
  }

  // Create a default user profile if none exists
  const defaultUserProfile: UserProfile = {
    id: user.id,
    user_id: user.id,
    email: user.email,
    full_name: user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    niche: null,
    tone: null,
    content_format: null,
    fame_goals: null,
    follower_count: 0,
    viral_score: 0,
    monetization_forecast: 0,
    onboarding_completed: false,
    subscription: null,
    created_at: new Date().toISOString(),
    updated_at: null,
  };

  const finalUserProfile = userProfile || defaultUserProfile;
  
  // Ensure onboarding_completed is always a boolean
  if (finalUserProfile.onboarding_completed === null) {
    finalUserProfile.onboarding_completed = false;
  }

  // Redirect to pricing if no active subscription
  if (!hasActiveSubscription) {
    console.log("No active subscription found, redirecting to pricing");
    return redirect("/pricing?welcome=true");
  }

  // Check if user needs onboarding (only after they have a subscription)
  if (finalUserProfile.onboarding_completed === false) {
    console.log("User needs onboarding, showing onboarding flow");
    return <OnboardingFlow user={user} />;
  }

  // User already has active subscription (checked above)
  const featureAccess = getFeatureAccess(
    subscription?.plan_name || null,
    subscription?.status || null
  );

  const activeTab = searchParams.tab || "home";

  // Add plan banner
  const planName = subscription?.plan_name || "Unknown";
  const planStatus = subscription?.status || "inactive";
  const planBilling = subscription?.billing_cycle || "monthly";
  const planPeriodEnd = subscription?.current_period_end
    ? new Date(subscription.current_period_end * 1000).toLocaleDateString()
    : null;

  return (
    <>
      <DashboardNavbar />
      {/* Plan Banner */}
      <div className="w-full bg-gradient-to-r from-blue-50 to-purple-50 border-b border-blue-100 py-4 px-4 flex flex-col md:flex-row items-center justify-between gap-2">
        <div className="flex flex-col md:flex-row items-center gap-2">
          <span className="text-sm md:text-base font-semibold text-blue-800">
            Current Plan:
            <span className="ml-2 text-blue-900 font-bold">
              {planName} ({planBilling})
            </span>
          </span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs font-bold ${planStatus === "active" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
            {planStatus === "active" ? "Active" : "Inactive"}
          </span>
          {planPeriodEnd && (
            <span className="ml-2 text-xs text-gray-600">Valid until {planPeriodEnd}</span>
          )}
        </div>
        <Button asChild variant="outline" className="text-xs font-semibold">
          <Link href="/pricing?upgrade=true">Manage Subscription</Link>
        </Button>
      </div>

      {/* Onboarding completion message */}
      {searchParams.onboarding === "complete" && (
        <div className="w-full bg-gradient-to-r from-green-50 to-emerald-50 border-b border-green-100 py-4 px-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              🎉 Welcome to Your Pegasus Empire!
            </h3>
            <p className="text-green-700">
              Your profile is set up and ready to go viral. Start exploring your features below!
            </p>
          </div>
        </div>
      )}

      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="analytics" disabled={!featureAccess.analytics.basic}>
                Analytics
              </TabsTrigger>
              <TabsTrigger value="monetization" disabled={!featureAccess.advancedMonetization}>
                Revenue
              </TabsTrigger>
              <TabsTrigger value="platforms" disabled={!featureAccess.socialPlatforms.enabled}>
                Platforms
              </TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardHome
                  user={user}
                  userProfile={finalUserProfile}
                  subscription={subscription}
                  subscriptionTier={subscriptionTier}
                  hasActiveSubscription={hasActiveSubscription}
                  featureAccess={featureAccess}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {featureAccess.analytics.basic ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <DashboardAnalytics
                    userId={user.id}
                    hasActiveSubscription={hasActiveSubscription}
                    subscriptionTier={subscriptionTier}
                    featureAccess={featureAccess}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Analytics Feature Not Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upgrade your plan to access advanced analytics and insights.
                  </p>
                  <Button asChild>
                    <Link href="/pricing?upgrade=true">Upgrade Plan</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="monetization" className="space-y-6">
              {featureAccess.advancedMonetization ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <MonetizationSuite
                    userProfile={userProfile}
                    subscription={subscription}
                    featureAccess={featureAccess}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Advanced Monetization Not Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upgrade to Superstar plan to access advanced monetization features.
                  </p>
                  <Button asChild>
                    <Link href="/pricing?upgrade=true">Upgrade to Superstar</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              {featureAccess.socialPlatforms.enabled ? (
                <Suspense fallback={<LoadingSpinner />}>
                  <PlatformConnections
                    userId={user.id}
                    connections={socialConnections}
                    onConnectionUpdate={() => {}}
                    featureAccess={featureAccess}
                  />
                </Suspense>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">
                    Platform Connections Not Available
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Upgrade your plan to connect and manage social media platforms.
                  </p>
                  <Button asChild>
                    <Link href="/pricing?upgrade=true">Upgrade Plan</Link>
                  </Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <SubscriptionManagement
                  userId={user.id}
                  subscription={subscription}
                  featureAccess={featureAccess}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
