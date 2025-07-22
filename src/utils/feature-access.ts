export interface FeatureAccess {
  aiPersonaBuilder: boolean;
  aiPosts: {
    enabled: boolean;
    limit: number | null; // null = unlimited
  };
  socialPlatforms: {
    enabled: boolean;
    limit: number | null; // null = all platforms
  };
  analytics: {
    basic: boolean;
    advanced: boolean;
  };
  support: {
    email: boolean;
    priority: boolean;
  };
  viralScorePredictor: boolean;
  advancedAIContent: boolean;
  autoScheduling: boolean;
  customBranding: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  dedicatedManager: boolean;
  customIntegrations: boolean;
  advancedMonetization: boolean;
  teamCollaboration: boolean;
  priorityFeatureRequests: boolean;
  strategyCalls: boolean;
  customAITraining: boolean;
  revenueOptimization: boolean;
}

export function getFeatureAccess(planName: string | null, planStatus: string | null): FeatureAccess {
  const isActive = planStatus === "active";
  const plan = planName?.toLowerCase() || "";

  // Base access (no plan)
  if (!isActive || !plan) {
    return {
      aiPersonaBuilder: false,
      aiPosts: { enabled: false, limit: 0 },
      socialPlatforms: { enabled: false, limit: 0 },
      analytics: { basic: false, advanced: false },
      support: { email: false, priority: false },
      viralScorePredictor: false,
      advancedAIContent: false,
      autoScheduling: false,
      customBranding: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      customIntegrations: false,
      advancedMonetization: false,
      teamCollaboration: false,
      priorityFeatureRequests: false,
      strategyCalls: false,
      customAITraining: false,
      revenueOptimization: false,
    };
  }

  // Creator Plan
  if (plan.includes("creator")) {
    return {
      aiPersonaBuilder: true,
      aiPosts: { enabled: true, limit: 50 },
      socialPlatforms: { enabled: true, limit: 2 },
      analytics: { basic: true, advanced: false },
      support: { email: true, priority: false },
      viralScorePredictor: false,
      advancedAIContent: false,
      autoScheduling: false,
      customBranding: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      customIntegrations: false,
      advancedMonetization: false,
      teamCollaboration: false,
      priorityFeatureRequests: false,
      strategyCalls: false,
      customAITraining: false,
      revenueOptimization: false,
    };
  }

  // Influencer Plan
  if (plan.includes("influencer")) {
    return {
      aiPersonaBuilder: true,
      aiPosts: { enabled: true, limit: null }, // unlimited
      socialPlatforms: { enabled: true, limit: null }, // all platforms
      analytics: { basic: true, advanced: true },
      support: { email: true, priority: true },
      viralScorePredictor: true,
      advancedAIContent: true,
      autoScheduling: true,
      customBranding: false,
      apiAccess: false,
      whiteLabel: false,
      dedicatedManager: false,
      customIntegrations: false,
      advancedMonetization: false,
      teamCollaboration: false,
      priorityFeatureRequests: false,
      strategyCalls: false,
      customAITraining: false,
      revenueOptimization: false,
    };
  }

  // Superstar Plan
  if (plan.includes("superstar")) {
    return {
      aiPersonaBuilder: true,
      aiPosts: { enabled: true, limit: null }, // unlimited
      socialPlatforms: { enabled: true, limit: null }, // all platforms
      analytics: { basic: true, advanced: true },
      support: { email: true, priority: true },
      viralScorePredictor: true,
      advancedAIContent: true,
      autoScheduling: true,
      customBranding: true,
      apiAccess: true,
      whiteLabel: true,
      dedicatedManager: true,
      customIntegrations: true,
      advancedMonetization: true,
      teamCollaboration: true,
      priorityFeatureRequests: true,
      strategyCalls: true,
      customAITraining: true,
      revenueOptimization: true,
    };
  }

  // Default to no access
  return {
    aiPersonaBuilder: false,
    aiPosts: { enabled: false, limit: 0 },
    socialPlatforms: { enabled: false, limit: 0 },
    analytics: { basic: false, advanced: false },
    support: { email: false, priority: false },
    viralScorePredictor: false,
    advancedAIContent: false,
    autoScheduling: false,
    customBranding: false,
    apiAccess: false,
    whiteLabel: false,
    dedicatedManager: false,
    customIntegrations: false,
    advancedMonetization: false,
    teamCollaboration: false,
    priorityFeatureRequests: false,
    strategyCalls: false,
    customAITraining: false,
    revenueOptimization: false,
  };
}

export function canAccessFeature(
  feature: keyof FeatureAccess,
  planName: string | null,
  planStatus: string | null
): boolean {
  const access = getFeatureAccess(planName, planStatus);
  return access[feature] as boolean;
}

export function getPlanTier(planName: string | null): number {
  if (!planName) return 0;
  const plan = planName.toLowerCase();
  if (plan.includes("creator")) return 1;
  if (plan.includes("influencer")) return 2;
  if (plan.includes("superstar")) return 3;
  return 0;
}

export function canUpgradeToPlan(
  currentPlan: string | null,
  targetPlan: string,
  currentStatus: string | null
): boolean {
  if (currentStatus !== "active") return true;
  
  const currentTier = getPlanTier(currentPlan);
  const targetTier = getPlanTier(targetPlan);
  
  return targetTier > currentTier;
} 