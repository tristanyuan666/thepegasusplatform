import { createClient } from "../supabase/server";
import { User } from "@supabase/supabase-js";

export interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  avatar_url: string | null;
  niche: string | null;
  tone: string | null;
  content_format: string | null;
  fame_goals: string | null;
  follower_count: number | null;
  viral_score: number | null;
  monetization_forecast: number | null;
  onboarding_completed: boolean | null;
  subscription: string | null;
  created_at: string;
  updated_at: string | null;
}

export interface SubscriptionData {
  id: string;
  user_id: string | null;
  stripe_id: string | null;
  customer_id: string | null;
  price_id: string | null;
  status: string | null;
  current_period_start: number | null;
  current_period_end: number | null;
  cancel_at_period_end: boolean | null;
  amount: number | null;
  currency: string | null;
  interval: string | null;
  plan_name: string | null;
  features_used: any;
  usage_limits: any;
  billing_history: any;
  created_at: string;
  updated_at: string;
}

export interface SocialConnection {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id: string | null;
  username: string | null;
  follower_count: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ContentItem {
  id: string;
  user_id: string;
  title: string;
  content: string;
  content_type: string;
  platform: string;
  scheduled_for: string | null;
  status: string | null;
  viral_score: number | null;
  hashtags: string[] | null;
  thumbnail_url: string | null;
  duration: number | null;
  auto_post: boolean;
  posted_at: string | null;
  post_url: string | null;
  performance_data: any;
  created_at: string;
  updated_at: string;
}

export interface AnalyticsData {
  id: string;
  user_id: string;
  platform: string;
  metric_type: string;
  metric_value: number;
  date: string;
  content_id: string | null;
  engagement_rate: number | null;
  reach: number | null;
  impressions: number | null;
  shares: number | null;
  comments: number | null;
  likes: number | null;
  saves: number | null;
  created_at: string;
}

export interface ViralScore {
  id: string;
  user_id: string;
  content_id: string | null;
  score: number;
  factors: any;
  predicted_at: string;
  actual_performance: any;
  accuracy_score: number | null;
}

export interface UserGoal {
  id: string;
  user_id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  target_date: string | null;
  is_achieved: boolean;
  created_at: string;
  updated_at: string;
}

export interface MonetizationData {
  id: string;
  user_id: string;
  platform: string;
  revenue_source: string;
  amount: number;
  currency: string;
  date: string;
  content_id: string | null;
  created_at: string;
}

export async function getUserProfile(
  userId: string,
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }

  return data;
}

export async function getUserSubscription(
  userId: string,
): Promise<SubscriptionData | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .maybeSingle();

  if (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }

  return data;
}

export async function getSocialConnections(
  userId: string,
): Promise<SocialConnection[]> {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("social_connections")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching social connections:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error fetching social connections:", error);
    return [];
  }
}

export async function getContentQueue(
  userId: string,
  limit: number = 10,
): Promise<ContentItem[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("content_queue")
    .select("*")
    .eq("user_id", userId)
    .order("scheduled_for", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error fetching content queue:", error);
    return [];
  }

  return data || [];
}

export async function getAnalyticsData(
  userId: string,
  days: number = 30,
): Promise<AnalyticsData[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("analytics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching analytics data:", error);
    return [];
  }

  return data || [];
}

export async function getViralScores(
  userId: string,
  limit: number = 10,
): Promise<ViralScore[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("viral_scores")
    .select("*")
    .eq("user_id", userId)
    .order("predicted_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching viral scores:", error);
    return [];
  }

  return data || [];
}

export async function getUserGoals(userId: string): Promise<UserGoal[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("user_goals")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching user goals:", error);
    return [];
  }

  return data || [];
}

export async function getMonetizationData(
  userId: string,
  days: number = 30,
): Promise<MonetizationData[]> {
  const supabase = await createClient();

  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const { data, error } = await supabase
    .from("monetization_data")
    .select("*")
    .eq("user_id", userId)
    .gte("date", startDate.toISOString().split("T")[0])
    .order("date", { ascending: false });

  if (error) {
    console.error("Error fetching monetization data:", error);
    return [];
  }

  return data || [];
}

export function getSubscriptionTier(
  subscription: SubscriptionData | null,
): string {
  if (!subscription || subscription.status !== "active") {
    return "free";
  }

  const planName = subscription.plan_name?.toLowerCase();
  if (planName?.includes("creator")) return "creator";
  if (planName?.includes("influencer")) return "influencer";
  if (planName?.includes("superstar")) return "superstar";

  // Fallback to price-based detection (in cents)
  const amount = subscription.amount || 0;
  if (amount >= 9999) return "superstar";
  if (amount >= 5999) return "influencer";
  if (amount >= 3999) return "creator";

  return "free";
}

export function hasFeatureAccess(
  subscription: SubscriptionData | null,
  feature: string,
): boolean {
  const tier = getSubscriptionTier(subscription);

  const featureMap: Record<string, string[]> = {
    ai_content: ["creator", "influencer", "superstar"],
    basic_analytics: ["creator", "influencer", "superstar"],
    advanced_analytics: ["influencer", "superstar"],
    viral_predictor: ["influencer", "superstar"],
    auto_scheduling: ["influencer", "superstar"],
    all_platforms: ["influencer", "superstar"],
    priority_support: ["influencer", "superstar"],
    custom_branding: ["superstar"],
    api_access: ["superstar"],
    dedicated_manager: ["superstar"],
    white_label: ["superstar"],
    team_collaboration: ["superstar"],
    monetization_suite: ["influencer", "superstar"],
    content_studio: ["creator", "influencer", "superstar"],
    platform_connections: ["creator", "influencer", "superstar"],
  };

  return featureMap[feature]?.includes(tier) || false;
}

export function getUsageLimit(
  subscription: SubscriptionData | null,
  limitType: string,
): number {
  const tier = getSubscriptionTier(subscription);

  const limitMap: Record<string, Record<string, number>> = {
    free: {
      posts_per_month: 5,
      platforms: 1,
      storage_gb: 1,
    },
    creator: {
      posts_per_month: 50,
      platforms: 2,
      storage_gb: 5,
    },
    influencer: {
      posts_per_month: -1, // unlimited
      platforms: -1, // unlimited
      storage_gb: 50,
    },
    superstar: {
      posts_per_month: -1, // unlimited
      platforms: -1, // unlimited
      storage_gb: 500,
      team_members: 10,
    },
  };

  return limitMap[tier]?.[limitType] || 0;
}

export async function checkUsageLimit(
  userId: string,
  limitType: string,
): Promise<{ current: number; limit: number; exceeded: boolean }> {
  const subscription = await getUserSubscription(userId);
  const limit = getUsageLimit(subscription, limitType);

  let current = 0;

  // Calculate current usage based on limit type
  if (limitType === "posts_per_month") {
    const supabase = await createClient();
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const { count } = await supabase
      .from("content_queue")
      .select("*", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("created_at", startOfMonth.toISOString());

    current = count || 0;
  } else if (limitType === "platforms") {
    const connections = await getSocialConnections(userId);
    current = connections.length;
  }

  return {
    current,
    limit,
    exceeded: limit !== -1 && current >= limit,
  };
}

export async function createOrUpdateUser(
  user: User,
): Promise<UserProfile | null> {
  const supabase = await createClient();

  const userData = {
    user_id: user.id,
    email: user.email,
    full_name:
      user.user_metadata?.full_name || user.user_metadata?.name || null,
    avatar_url: user.user_metadata?.avatar_url || null,
    updated_at: new Date().toISOString(),
    token_identifier: user.id,
  };

  const { data, error } = await supabase
    .from("users")
    .upsert(userData, { onConflict: "user_id" })
    .select()
    .single();

  if (error) {
    console.error("Error creating/updating user:", error);
    return null;
  }

  return data;
}
