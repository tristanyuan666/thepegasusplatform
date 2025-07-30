import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";
import { getUserSubscription, getSubscriptionTier, SubscriptionData } from "@/utils/auth";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

function ContentHubErrorBoundary() {
  return (
    <div className="min-h-screen flex items-center justify-center p-8">
      <div className="max-w-md w-full text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">Content Hub Unavailable</h2>
        <p className="text-gray-600 mb-4">
          The content creation hub is currently being updated. Please try again later.
        </p>
        <Button asChild>
          <Link href="/dashboard">Back to Dashboard</Link>
        </Button>
      </div>
    </div>
  );
}

export default async function ContentHubPage() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return redirect("/sign-in");
    }

    // Fetch user profile with error handling
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile fetch error:", profileError);
      // Continue with null profile rather than failing
    }

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
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }>
        <DashboardNavbar
          user={user}
          userProfile={userProfile}
          subscription={subscription}
          activeTab="home"
          hasFeatureAccess={hasFeatureAccess}
        />
        <ContentCreationHub
          user={user}
          hasActiveSubscription={hasActiveSubscription}
          subscriptionTier={subscriptionTier}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Content hub error:", error);
    // Return a more helpful error page instead of the generic one
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Content Hub Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We're experiencing some technical difficulties. Please try again in a few moments.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/content-hub">Try Again</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
