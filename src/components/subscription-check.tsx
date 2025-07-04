import { redirect } from "next/navigation";
import { createClient } from "@/supabase/server";
import { getUserSubscription, getSubscriptionTier } from "@/utils/auth";

interface SubscriptionCheckProps {
  children: React.ReactNode;
  redirectTo?: string;
  requiredTier?: "starter" | "growth" | "empire";
  allowFree?: boolean;
}

export async function SubscriptionCheck({
  children,
  redirectTo = "/pricing",
  requiredTier,
  allowFree = false,
}: SubscriptionCheckProps) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/sign-in");
  }

  // Get user subscription
  const subscription = await getUserSubscription(user.id);
  const currentTier = getSubscriptionTier(subscription);

  // Check if user has active subscription
  const hasActiveSubscription =
    subscription && subscription.status === "active";

  // If free tier is not allowed and user doesn't have active subscription
  if (!allowFree && !hasActiveSubscription) {
    redirect(redirectTo);
  }

  // Check tier requirements
  if (requiredTier) {
    const tierHierarchy = { free: 0, starter: 1, growth: 2, empire: 3 };
    const requiredLevel = tierHierarchy[requiredTier];
    const currentLevel =
      tierHierarchy[currentTier as keyof typeof tierHierarchy] || 0;

    if (currentLevel < requiredLevel) {
      redirect(`${redirectTo}?upgrade=${requiredTier}`);
    }
  }

  return <>{children}</>;
}

// Client-side subscription check hook
export function useSubscriptionCheck() {
  return {
    checkFeatureAccess: (feature: string, subscription: any) => {
      const tier = getSubscriptionTier(subscription);

      const featureMap: Record<string, string[]> = {
        ai_content: ["starter", "growth", "empire"],
        basic_analytics: ["starter", "growth", "empire"],
        advanced_analytics: ["growth", "empire"],
        viral_predictor: ["growth", "empire"],
        auto_scheduling: ["growth", "empire"],
        all_platforms: ["growth", "empire"],
        priority_support: ["growth", "empire"],
        custom_branding: ["empire"],
        api_access: ["empire"],
        dedicated_manager: ["empire"],
        monetization_suite: ["growth", "empire"],
        content_studio: ["starter", "growth", "empire"],
        platform_connections: ["starter", "growth", "empire"],
      };

      return featureMap[feature]?.includes(tier) || false;
    },

    getUsageLimit: (limitType: string, subscription: any) => {
      const tier = getSubscriptionTier(subscription);

      const limitMap: Record<string, Record<string, number>> = {
        free: {
          posts_per_month: 3,
          platforms: 1,
          storage_gb: 0.5,
        },
        starter: {
          posts_per_month: 50,
          platforms: 2,
          storage_gb: 5,
        },
        growth: {
          posts_per_month: -1, // unlimited
          platforms: -1, // unlimited
          storage_gb: 50,
        },
        empire: {
          posts_per_month: -1, // unlimited
          platforms: -1, // unlimited
          storage_gb: 500,
          team_members: 10,
        },
      };

      return limitMap[tier]?.[limitType] || 0;
    },
  };
}
