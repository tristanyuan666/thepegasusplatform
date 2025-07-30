"use client";

import { useEffect, useState, Suspense } from "react";
import { createClient } from "../../../supabase/client";
import { User } from "@supabase/supabase-js";
import { useSearchParams } from "next/navigation";
import DashboardNavbar from "@/components/dashboard-navbar";
import DashboardHome from "@/components/dashboard-home";
import DashboardAnalytics from "@/components/dashboard-analytics";
import DashboardRevenue from "../../components/dashboard-revenue";
import DashboardPlatforms from "../../components/dashboard-platforms";
import DashboardSettings from "../../components/dashboard-settings";
import LoadingSpinner from "@/components/loading-spinner";

type DashboardTab = "home" | "analytics" | "revenue" | "platforms" | "settings";

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

interface Subscription {
  stripe_id: string;
  user_id: string;
  plan_name: string;
  billing_cycle: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface PlatformConnection {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token: string;
  is_active: boolean;
  connected_at: string;
  last_sync: string;
}

interface AnalyticsData {
  total_followers: number;
  total_views: number;
  engagement_rate: number;
  viral_score: number;
  content_count: number;
  revenue: number;
  growth_rate: number;
  platform_breakdown: {
    instagram: { followers: number; engagement: number; posts: number };
    tiktok: { followers: number; engagement: number; posts: number };
    youtube: { followers: number; engagement: number; posts: number };
    x: { followers: number; engagement: number; posts: number };
  };
  recent_performance: {
    date: string;
    views: number;
    engagement: number;
    viral_score: number;
  }[];
}

function DashboardContent() {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [platformConnections, setPlatformConnections] = useState<PlatformConnection[]>([]);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab") as DashboardTab;
  const activeTab: DashboardTab = tabParam && ["home", "analytics", "revenue", "platforms", "settings"].includes(tabParam) 
    ? tabParam 
    : "home";

  // Check if user has access to specific features based on plan
  const hasFeatureAccess = (feature: string): boolean => {
    // Allow basic features for all authenticated users
    switch (feature) {
      case "settings":
        return true; // Settings should be available to all users
      case "home":
        return true;
      case "platforms":
        return true; // Allow platforms for all users temporarily
      default:
        break;
    }
    
    if (!subscription || subscription.status !== "active") {
      // Allow basic features for free users
      switch (feature) {
        case "analytics":
          return true; // Allow analytics for all users temporarily
        case "revenue":
          return true; // Allow revenue for all users temporarily
        default:
          return false;
      }
    }
    
    const plan = subscription.plan_name.toLowerCase();
    
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
      case "settings":
        return true; // Settings available to all users
      case "home":
        return true; // Home available to all users
      default:
        return false;
    }
  };

  // Fetch user data
  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!currentUser) throw new Error("No user found");

      setUser(currentUser);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (profileError) {
        console.error("Profile error:", profileError);
        // Create a default profile if none exists
        const { data: newProfile, error: createError } = await supabase
          .from("users")
          .insert({
            user_id: currentUser.id,
            email: currentUser.email,
            full_name: currentUser.user_metadata?.full_name || currentUser.user_metadata?.name || currentUser.email?.split('@')[0],
            avatar_url: currentUser.user_metadata?.avatar_url,
            plan: null,
            plan_status: null,
            plan_billing: null,
            is_active: false,
            niche: null,
            tone: null,
            content_format: null,
            fame_goals: null,
            follower_count: null,
            viral_score: 0,
            monetization_forecast: 0,
            onboarding_completed: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .select()
          .single();
        
        if (createError) {
          console.error("Create profile error:", createError);
          // Continue without profile for now
          setUserProfile(null);
        } else {
          setUserProfile(newProfile);
        }
      } else {
        setUserProfile(profile);
      }

      // Get subscription
      const { data: sub, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("status", "active")
        .maybeSingle();

      if (subError) throw subError;
      setSubscription(sub);

      // Get platform connections
      const { data: connections, error: connectionsError } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("is_active", true);

      if (connectionsError) {
        console.warn("Platform connections error:", connectionsError);
        setPlatformConnections([]);
      } else {
        setPlatformConnections(connections || []);
      }

      // Get real analytics data (only if platforms are connected)
      if (connections && connections.length > 0) {
        try {
          const { data: analytics, error: analyticsError } = await supabase
            .from("analytics")
            .select("*")
            .eq("user_id", currentUser.id)
            .order("created_at", { ascending: false })
            .limit(1)
            .maybeSingle();

          if (!analyticsError && analytics) {
            setAnalyticsData(analytics);
          } else {
            // Set default analytics data for connected platforms
            setAnalyticsData({
              total_followers: 0,
              total_views: 0,
              engagement_rate: 0,
              viral_score: 0,
              content_count: 0,
              revenue: 0,
              growth_rate: 0,
              platform_breakdown: {
                instagram: { followers: 0, engagement: 0, posts: 0 },
                tiktok: { followers: 0, engagement: 0, posts: 0 },
                youtube: { followers: 0, engagement: 0, posts: 0 },
                x: { followers: 0, engagement: 0, posts: 0 },
              },
              recent_performance: [],
            });
          }
        } catch (analyticsError) {
          console.warn("Analytics error:", analyticsError);
          // Set default analytics data
          setAnalyticsData({
            total_followers: 0,
            total_views: 0,
            engagement_rate: 0,
            viral_score: 0,
            content_count: 0,
            revenue: 0,
            growth_rate: 0,
            platform_breakdown: {
              instagram: { followers: 0, engagement: 0, posts: 0 },
              tiktok: { followers: 0, engagement: 0, posts: 0 },
              youtube: { followers: 0, engagement: 0, posts: 0 },
              x: { followers: 0, engagement: 0, posts: 0 },
            },
            recent_performance: [],
          });
        }
      } else {
        // No platforms connected - show zero data
        setAnalyticsData({
          total_followers: 0,
          total_views: 0,
          engagement_rate: 0,
          viral_score: 0,
          content_count: 0,
          revenue: 0,
          growth_rate: 0,
          platform_breakdown: {
            instagram: { followers: 0, engagement: 0, posts: 0 },
            tiktok: { followers: 0, engagement: 0, posts: 0 },
            youtube: { followers: 0, engagement: 0, posts: 0 },
            x: { followers: 0, engagement: 0, posts: 0 },
          },
          recent_performance: [],
        });
      }

    } catch (err) {
      console.error("Error fetching user data:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);



  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
  return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Dashboard</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchUserData}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
          <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">User Not Found</h2>
          <p className="text-gray-600">Please log in to access your dashboard.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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
        subscription={subscription}
        activeTab={activeTab}
        hasFeatureAccess={hasFeatureAccess}
      />
      
      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {activeTab === "home" && (
                <DashboardHome
                  user={user}
                  userProfile={{
                    id: userProfile.id,
                    user_id: userProfile.user_id,
                    email: userProfile.email,
                    name: userProfile.full_name,
                    full_name: userProfile.full_name,
                    avatar_url: userProfile.avatar_url,
                    subscription: userProfile.plan,
                    niche: userProfile.niche,
                    tone: userProfile.tone,
                    content_format: userProfile.content_format,
                    fame_goals: userProfile.fame_goals,
                    follower_count: userProfile.follower_count ? parseInt(userProfile.follower_count) : null,
                    viral_score: userProfile.viral_score,
                    monetization_forecast: userProfile.monetization_forecast,
                    onboarding_completed: userProfile.onboarding_completed,
                    created_at: userProfile.created_at,
                    updated_at: userProfile.updated_at,
                  }}
                  subscription={subscription}
              platformConnections={platformConnections}
              analyticsData={analyticsData}
              hasFeatureAccess={hasFeatureAccess}
            />
          )}
          
          {activeTab === "analytics" && hasFeatureAccess("analytics") && (
                  <DashboardAnalytics
              user={user}
              platformConnections={platformConnections}
              analyticsData={analyticsData}
              hasFeatureAccess={hasFeatureAccess}
            />
          )}
          
          {activeTab === "revenue" && hasFeatureAccess("revenue") && (
            <DashboardRevenue
                    userProfile={userProfile}
                    subscription={subscription}
              hasFeatureAccess={hasFeatureAccess}
            />
          )}
          {activeTab === "platforms" && hasFeatureAccess("platforms") && (
            <DashboardPlatforms
              userProfile={userProfile}
              subscription={subscription}
              platformConnections={platformConnections}
              onConnectionsUpdate={() => fetchUserData()}
              hasFeatureAccess={hasFeatureAccess}
            />
          )}
          {activeTab === "settings" && (
            <DashboardSettings
              userProfile={userProfile}
                  subscription={subscription}
              onProfileUpdate={() => fetchUserData()}
              hasFeatureAccess={hasFeatureAccess}
                />
          )}
        </div>
      </main>
      </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={<LoadingSpinner size="lg" />}>
      <DashboardContent />
    </Suspense>
  );
}
