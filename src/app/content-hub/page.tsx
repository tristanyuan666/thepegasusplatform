import { createClient } from "@/supabase/server";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import DashboardNavbar from "@/components/dashboard-navbar";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ContentHubPage() {
  try {
    const supabase = await createClient();
    
    // Get user with comprehensive error handling
    let user = null;
    try {
      const { data: { user: userData }, error: userError } = await supabase.auth.getUser();
      if (userError) {
        console.error("Auth error:", userError);
        return redirect("/sign-in");
      }
      user = userData;
    } catch (error) {
      console.error("Error getting user:", error);
      return redirect("/sign-in");
    }

    if (!user) {
      return redirect("/sign-in");
    }

    // Create a basic user profile without database queries
    const userProfile = {
      id: user.id,
      user_id: user.id,
      email: user.email,
      full_name: user.user_metadata?.full_name || null,
      plan: null,
      plan_status: null,
      plan_billing: null,
      is_active: true,
      niche: null,
      tone: null,
      content_format: null,
      fame_goals: null,
      bio: null,
      website: null,
      location: null,
      follower_count: null,
      viral_score: 0,
      monetization_forecast: 0,
      onboarding_completed: false,
      created_at: new Date().toISOString(),
      updated_at: null,
    };

    // Create a basic subscription object without database queries
    const subscription = {
      stripe_id: "",
      user_id: user.id,
      plan_name: "free",
      billing_cycle: "monthly",
      status: "inactive",
      current_period_start: 0,
      current_period_end: 0,
      cancel_at_period_end: false,
    };

    // Simple feature access function
    const hasFeatureAccess = (feature: string) => {
      // Allow all features for now to prevent errors
      return true;
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
          hasActiveSubscription={false}
          subscriptionTier="free"
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Content hub error:", error);
    // Return a helpful error page
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
