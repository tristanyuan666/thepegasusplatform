import { createClient } from "../../../supabase/client";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ContentHubPage() {
  const supabase = createClient();

  try {
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      redirect('/sign-in');
    }

    // Get user profile
    const { data: userProfile, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (profileError) {
      console.error("Profile error:", profileError);
      redirect('/onboarding');
    }

    // Get subscription status
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    const hasActiveSubscription = !!subscription;
    const subscriptionTier = subscription?.plan_name?.toLowerCase() || "free";

    // Get platform connections for real data
    const { data: platformConnections, error: connectionsError } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Get content analytics
    const { data: contentAnalytics, error: analyticsError } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    // Get scheduled content
    const { data: scheduledContent, error: scheduledError } = await supabase
      .from("content_queue")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_for", { ascending: true });

    // Get personas
    const { data: personas, error: personasError } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-50">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }>
        <ContentCreationHub
          user={user}
          userProfile={userProfile}
          hasActiveSubscription={hasActiveSubscription}
          subscriptionTier={subscriptionTier}
          platformConnections={platformConnections || []}
          contentAnalytics={contentAnalytics || []}
          scheduledContent={scheduledContent || []}
          personas={personas || []}
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Content hub error:", error);
    // Return a helpful error page
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 via-white to-blue-50">
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
