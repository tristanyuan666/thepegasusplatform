import DashboardNavbar from "@/components/dashboard-navbar";
import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import {
  getUserProfile,
  getUserSubscription,
  getSubscriptionTier,
  getSocialConnections,
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
  searchParams: { tab?: string };
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Get user profile and subscription
  const userProfile = await getUserProfile(user.id);
  const subscription = await getUserSubscription(user.id);
  const subscriptionTier = getSubscriptionTier(subscription);
  const socialConnections = await getSocialConnections(user.id);

  // Check if user has active subscription before showing onboarding
  const hasActiveSubscription =
    subscription && subscription.status === "active";

  // Redirect to pricing if no active subscription
  if (!hasActiveSubscription) {
    return redirect("/pricing?welcome=true");
  }

  // Check if user needs onboarding (only after they have a subscription)
  if (!userProfile?.onboarding_completed) {
    return <OnboardingFlow user={user} />;
  }

  // User already has active subscription (checked above)

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
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-6 py-8">
          <Tabs defaultValue={activeTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5 max-w-2xl mx-auto">
              <TabsTrigger value="home">Home</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="monetization">Revenue</TabsTrigger>
              <TabsTrigger value="platforms">Platforms</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="home" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardHome
                  user={user}
                  userProfile={userProfile}
                  subscription={subscription}
                  subscriptionTier={subscriptionTier}
                  hasActiveSubscription={hasActiveSubscription}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <DashboardAnalytics
                  userId={user.id}
                  hasActiveSubscription={hasActiveSubscription}
                  subscriptionTier={subscriptionTier}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="monetization" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <MonetizationSuite
                  userProfile={userProfile}
                  subscription={subscription}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="platforms" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <PlatformConnections
                  userId={user.id}
                  connections={socialConnections}
                  onConnectionUpdate={() => {}}
                />
              </Suspense>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <Suspense fallback={<LoadingSpinner />}>
                <SubscriptionManagement
                  userId={user.id}
                  subscription={subscription}
                />
              </Suspense>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
