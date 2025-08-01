import { createClient } from "@/supabase/client";
import { redirect } from "next/navigation";
import ContentCreationHub from "@/components/content-creation-hub";
import { Suspense } from "react";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ContentHubPage() {
  const supabase = createClient();

  // Get current user - redirect if not authenticated
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  
  if (userError || !user) {
    redirect('/sign-in');
  }

  // Initialize with empty data as fallbacks
  let userProfile = null;
  let hasActiveSubscription = false;
  let subscriptionTier = "free";
  let platformConnections = [];
  let contentAnalytics = [];
  let scheduledContent = [];
  let personas = [];

  try {
    // Get user profile - don't redirect on error, just use fallback
    const { data: profileData, error: profileError } = await supabase
      .from("users")
      .select("*")
      .eq("user_id", user.id)
      .single();

    if (!profileError && profileData) {
      userProfile = profileData;
    }

    // Get subscription status
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", user.id)
      .eq("status", "active")
      .maybeSingle();

    if (!subError && subscription) {
      hasActiveSubscription = true;
      subscriptionTier = subscription.plan_name?.toLowerCase() || "free";
    }

    // Get platform connections
    const { data: connections, error: connectionsError } = await supabase
      .from("platform_connections")
      .select("*")
      .eq("user_id", user.id)
      .eq("is_active", true);

    if (!connectionsError && connections) {
      platformConnections = connections;
    }

    // Get content analytics
    const { data: analytics, error: analyticsError } = await supabase
      .from("analytics")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(100);

    if (!analyticsError && analytics) {
      contentAnalytics = analytics;
    }

    // Get scheduled content
    const { data: scheduled, error: scheduledError } = await supabase
      .from("content_queue")
      .select("*")
      .eq("user_id", user.id)
      .order("scheduled_for", { ascending: true });

    if (!scheduledError && scheduled) {
      scheduledContent = scheduled;
    }

    // Get personas
    const { data: personasData, error: personasError } = await supabase
      .from("personas")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false });

    if (!personasError && personasData) {
      personas = personasData;
    }

  } catch (error) {
    // Log error but don't show error page - just use fallback data
    console.error("Content hub data loading error:", error);
    // Continue with fallback data
  }

  // Always return the content hub component, never show error page
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
        platformConnections={platformConnections}
        contentAnalytics={contentAnalytics}
        scheduledContent={scheduledContent}
        personas={personas}
      />
    </Suspense>
  );
}
