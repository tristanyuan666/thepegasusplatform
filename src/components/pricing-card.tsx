"use client";

import { useState } from "react";
import { useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { createClient } from "../../supabase/client";
import LoadingSpinner, { ButtonLoadingSpinner } from "./loading-spinner";
import {
  Crown,
  Sparkles,
  Zap,
  Check,
  X,
  Star,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Palette,
  DollarSign,
  AlertTriangle,
  Settings,
  ExternalLink,
  Shield,
} from "lucide-react";

interface PricingPlan {
  id: string;
  name: string;
  price: {
    monthly: number;
    yearly: number;
  };
  popular?: boolean;
  description: string;
  features: {
    name: string;
    included: boolean;
    premium?: boolean;
  }[];
  gradient: string;
  icon: React.ReactNode;
}

interface PricingCardProps {
  plan?: PricingPlan;
  item?: any;
  isYearly?: boolean;
  user: User | null;
  onCheckout?: (planId: string, isYearly: boolean) => void;
}

const defaultPlans: PricingPlan[] = [
  {
    id: "creator",
    name: "Creator",
    price: { monthly: 3999, yearly: 38399 }, // $39.99/month, $383.99/year (20% off)
    description: "Perfect for aspiring creators",
    gradient: "from-blue-500 to-blue-600",
    icon: <Sparkles className="w-6 h-6" />,
    features: [
      { name: "AI Persona Builder", included: true },
      { name: "50 AI Posts/Month", included: true },
      { name: "2 Social Platforms", included: true },
      { name: "Basic Analytics", included: true },
      { name: "Email Support", included: true },
      { name: "Advanced AI Content", included: false },
      { name: "Unlimited Posts", included: false },
      { name: "All Platforms", included: false },
      { name: "Viral Score Predictor", included: false },
      { name: "Priority Support", included: false },
      { name: "Custom Branding", included: false },
      { name: "API Access", included: false },
    ],
  },
  {
    id: "influencer",
    name: "Influencer",
    price: { monthly: 5999, yearly: 57599 }, // $59.99/month, $575.99/year (20% off)
    popular: true,
    description: "Most popular for serious creators",
    gradient: "from-blue-600 to-blue-700",
    icon: <TrendingUp className="w-6 h-6" />,
    features: [
      { name: "Everything in Creator", included: true },
      { name: "Unlimited AI Posts", included: true, premium: true },
      { name: "All Social Platforms", included: true, premium: true },
      { name: "Advanced Analytics", included: true, premium: true },
      { name: "Priority Support", included: true, premium: true },
      { name: "Viral Score Predictor", included: true, premium: true },
      { name: "Advanced AI Content", included: true, premium: true },
      { name: "Auto-Scheduling", included: true, premium: true },
      { name: "Custom Branding", included: false },
      { name: "API Access", included: false },
      { name: "White Label", included: false },
      { name: "Dedicated Manager", included: false },
    ],
  },
  {
    id: "superstar",
    name: "Superstar",
    price: { monthly: 9999, yearly: 95999 }, // $99.99/month, $959.99/year (20% off)
    description: "For influencer superstars",
    gradient: "from-blue-700 to-blue-800",
    icon: <Crown className="w-6 h-6" />,
    features: [
      { name: "Everything in Influencer", included: true },
      { name: "Custom Branding", included: true, premium: true },
      { name: "API Access", included: true, premium: true },
      { name: "White Label Solution", included: true, premium: true },
      { name: "Dedicated Account Manager", included: true, premium: true },
      { name: "Custom Integrations", included: true, premium: true },
      { name: "Advanced Monetization", included: true, premium: true },
      { name: "Team Collaboration", included: true, premium: true },
      { name: "Priority Feature Requests", included: true, premium: true },
      { name: "1-on-1 Strategy Calls", included: true, premium: true },
      { name: "Custom AI Training", included: true, premium: true },
      { name: "Revenue Optimization", included: true, premium: true },
    ],
  },
];

// Define Stripe price IDs at component level
const STRIPE_PRICE_IDS = {
  creator: {
    monthly: "price_1RtPLJGD1jjgy8XwgAEntohZ", // Creator Monthly
    yearly: "price_1RtPPCGD1jjgy8XwDETBm2fy", // Creator Annual
  },
  influencer: {
    monthly: "price_1RtPMgGD1jjgy8Xwr9kyrte3", // Influencer Monthly
    yearly: "price_1RtPQEGD1jjgy8Xw3yValVVn", // Influencer Annual
  },
  superstar: {
    monthly: "price_1RtPMzGD1jjgy8XwNjrcGVTq", // Superstar Monthly
    yearly: "price_1RtPS2GD1jjgy8XwUZef8Jsl", // Superstar Annual
  },
};

export default function PricingCard({
  plan,
  item,
  isYearly = false,
  user,
  onCheckout,
}: PricingCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<string | null>(null);
  const supabase = createClient();

  // Test function to verify Edge Function connectivity
  const testEdgeFunction = async () => {
    try {
      setTestResult("Testing connection...");
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            planId: "test",
            isYearly: false,
            userId: user?.id || "test",
            userEmail: user?.email || "test@example.com",
          },
        }
      );

      if (error) {
        setTestResult(`Test FAILED: ${error.message}`);
      } else {
        setTestResult("Test PASSED: Edge Function is working");
      }
    } catch (error) {
      setTestResult(
        `Test ERROR: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };

  // Ensure price object exists with defaults
  const safePlan = plan || {
    id: "starter",
    name: "Starter",
    price: { monthly: 0, yearly: 0 },
    description: "Get started with basic features",
    features: [],
    gradient: "from-gray-500 to-gray-700",
    icon: <Zap className="w-6 h-6" />,
    popular: false,
  };

  // Helper function to format prices
  function to99(n: number) {
    return Math.round(n / 100) * 100;
  }

  // Calculate savings
  const savings =
    isYearly && safePlan.price.monthly > 0
      ? ((safePlan.price.monthly * 12 - safePlan.price.yearly) /
          (safePlan.price.monthly * 12)) *
        100
      : 0;

  const handleCheckout = async () => {
    if (!user) {
      // Redirect to sign-in instead of showing error
      window.location.href = "/sign-in";
      return;
    }

    setIsLoading(true);
    setPaymentError(null);

    try {
      // Call Supabase Edge Function with enhanced error handling
      const planId = safePlan.id as keyof typeof STRIPE_PRICE_IDS;
      const billingType = isYearly ? "yearly" : "monthly" as const;
      
      if (!STRIPE_PRICE_IDS[planId]) {
        throw new Error(`Invalid plan ID: ${planId}`);
      }
      
      const checkoutPayload = {
        price_id: STRIPE_PRICE_IDS[planId][billingType],
        billing_cycle: billingType,
        user_id: user.id,
        customer_email: user.email,
        plan_name: safePlan.name,
        return_url: `${window.location.origin}/success`,
        cancel_url: `${window.location.origin}/pricing?cancelled=true`,
      };

      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: checkoutPayload,
        }
      );

      if (error) {
        if (error.message?.includes("rate limit")) {
          throw new Error("Too many requests. Please wait a moment and try again.");
        }
        throw new Error(`Payment setup failed: ${error.message || "Unknown error"}`);
      }

      if (!data) {
        throw new Error("No response data received from checkout function");
      }

      if (data.error) {
        throw new Error(data?.error || "Checkout function returned failure");
      }

      if (!data.url) {
        throw new Error("No checkout URL in response");
      }

      // Track checkout initiation for analytics
      if (typeof window !== "undefined") {
        try {
          if ((window as any).gtag) {
            (window as any).gtag("event", "begin_checkout", {
              currency: "USD",
              value: isYearly
                ? safePlan.price.yearly / 100
                : safePlan.price.monthly / 100,
              items: [
                {
                  item_id: safePlan.id,
                  item_name: safePlan.name,
                  category: "subscription",
                  quantity: 1,
                  price: isYearly
                    ? safePlan.price.yearly / 100
                    : safePlan.price.monthly / 100,
                },
              ],
            });
          }
        } catch (analyticsError) {
          // Don't fail checkout for analytics errors
        }

        // Store checkout session info for tracking
        localStorage.setItem("checkout_session", JSON.stringify({
          planId: safePlan.id,
          planName: safePlan.name,
          isYearly,
          timestamp: new Date().toISOString(),
        }));

        window.location.href = data.url;
      } else {
        throw new Error("Window object not available for redirect");
      }
    } catch (error) {
      setPaymentError(
        error instanceof Error ? error.message : "Unknown error occurred",
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch user's current active plan and billing cycle
  const [userPlan, setUserPlan] = useState<string | null>(null);
  const [userBilling, setUserBilling] = useState<string | null>(null);
  useEffect(() => {
    if (!user) return;
    (async () => {
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_name,billing_cycle,status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      if (sub) {
        setUserPlan(sub.plan_name?.toLowerCase() || null);
        setUserBilling(sub.billing_cycle?.toLowerCase() || null);
      }
    })();
    // eslint-disable-next-line
  }, [user]);

  // Determine button state - only allow upgrades, no downgrades
  const isCurrentPlan =
    userPlan && 
    (userPlan.toLowerCase() === safePlan.id.toLowerCase() ||
     userPlan.toLowerCase() === safePlan.name.toLowerCase()) &&
    userBilling === (isYearly ? "yearly" : "monthly");
  
  const isUpgrade =
    userPlan &&
    ["creator", "influencer", "superstar"].indexOf(safePlan.id) >
      ["creator", "influencer", "superstar"].indexOf(userPlan);
  
  // Check if user can upgrade to annual (if currently on monthly)
  const canUpgradeToAnnual = 
    userPlan && 
    userBilling === "monthly" &&
    userPlan.toLowerCase() === safePlan.id.toLowerCase() &&
    isYearly;
  
  // Check if user can upgrade plan level
  const canUpgradePlan = 
    userPlan &&
    ["creator", "influencer", "superstar"].indexOf(safePlan.id) >
      ["creator", "influencer", "superstar"].indexOf(userPlan);
  
  // Hide downgrade options - users can only upgrade or stay on current plan
  const shouldShowPlan = !userPlan || isUpgrade || isCurrentPlan || canUpgradeToAnnual || canUpgradePlan;

  return (
    <div
      className={`relative group transition-all duration-500 magnetic preview-hover pricing-card hover-target interactive-element ${
        safePlan.popular ? "scale-105" : "hover:scale-105"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-pricing-card
      data-interactive
    >
      {/* Popular badge */}
      {safePlan.popular && (
        <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-1.5 rounded-full text-sm font-bold shadow-lg">
            ⭐ Most Popular
          </div>
        </div>
      )}

      {/* Glow effect - removed for mobile */}
      {(safePlan.popular || isHovered) && (
        <div
          className={`hidden md:block absolute -inset-1 bg-gradient-to-r ${safePlan.gradient} rounded-3xl blur opacity-25 transition-opacity duration-300`}
        />
      )}

      <div
        className={`bg-white p-1.5 md:p-8 h-full relative overflow-hidden transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl border ${
          safePlan.popular
            ? "border-2 border-blue-500/50"
            : "border-gray-200 hover:border-blue-400/50"
        }`}
      >
        {/* Background gradient overlay */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${safePlan.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
        />

        {/* Header */}
        <div className="relative z-10">
          <div className="flex items-center gap-1 md:gap-4 mb-1.5 md:mb-6">
            <div
              className={`p-1 md:p-3 rounded-md md:rounded-2xl bg-gradient-to-r ${safePlan.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
            >
              {safePlan.icon}
            </div>
            <div>
              <h3 className="text-lg md:text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-all duration-300">
                {safePlan.name}
              </h3>
              <p className="text-gray-600 text-sm md:text-sm -mt-3 md:-mt-1">{safePlan.description}</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-center mb-3 md:mb-6">
            {isYearly ? (
              <>
                <div className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 mb-2">
                  <span className="text-xl md:text-[1.78rem] font-bold text-gray-900">
                    ${((safePlan.price.yearly / 12 / 100) - 0.01).toFixed(2)}
                  </span>
                  <span className="text-sm md:text-lg text-gray-400 line-through">
                    ${(safePlan.price.monthly / 100).toFixed(2)}
                  </span>
                  <span className="px-1.5 md:px-2 py-0.5 md:py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                    Save 20%
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="text-xs text-gray-500 text-center">
                    /month
                  </span>
                </div>
                {/* Show upgrade prompt for monthly users */}
                {userPlan && userBilling === "monthly" && userPlan.toLowerCase() === safePlan.id.toLowerCase() && (
                  <div className="mt-2 px-2 md:px-3 py-1 bg-blue-50 border border-blue-200 rounded-full">
                    <span className="text-xs text-blue-700 font-medium">
                      💡 Upgrade to save 20%
                    </span>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xl md:text-[1.78rem] font-bold text-gray-900">
                  ${(safePlan.price.monthly / 100).toFixed(2)}
                </span>
                <span className="text-xs text-gray-500">
                  /month
                </span>
              </div>
            )}
          </div>

          {/* Features */}
          <div className="space-y-1.5 md:space-y-3 mb-3 md:mb-6 max-h-32 md:max-h-48 overflow-y-auto custom-scrollbar">
            {safePlan.features
              .slice(0, 6)
              .map(
                (feature: PricingPlan["features"][number], index: number) => (
                  <div
                    key={index}
                    className={`flex items-center gap-1.5 md:gap-2 transition-all duration-300 ${
                      feature.included ? "text-gray-700" : "text-gray-500"
                    }`}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-shrink-0">
                      {feature.included ? (
                        <div
                          className={`w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-gradient-to-r ${safePlan.gradient} flex items-center justify-center`}
                        >
                          <Check className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-2.5 h-2.5 md:w-4 md:h-4 rounded-full bg-gray-400 flex items-center justify-center">
                          <X className="w-1.5 h-1.5 md:w-2.5 md:h-2.5 text-gray-300" />
                        </div>
                      )}
                    </div>
                    <span
                      className={`text-xs leading-tight ${
                        feature.premium && feature.included ? "font-medium" : ""
                      }`}
                    >
                      {feature.name}
                      {feature.premium && feature.included && (
                        <span
                          className={`ml-1 text-xs px-1 py-0.5 rounded-full bg-gradient-to-r ${safePlan.gradient} text-white`}
                        >
                          PRO
                        </span>
                      )}
                    </span>
                  </div>
                ),
              )}
            {safePlan.features.length > 6 && (
              <div className="text-xs text-gray-500 text-center pt-1 md:pt-2">
                +{safePlan.features.length - 6} more features
              </div>
            )}
          </div>

          {/* Payment Error Section */}
          {paymentError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <h4 className="text-sm font-semibold text-red-800 mb-1">
                    Payment Failed
                  </h4>
                  <p className="text-xs text-red-700 mb-3">{paymentError}</p>
                  <Button
                    onClick={() => setPaymentError(null)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Dismiss
                  </Button>
                </div>
              </div>
            </div>
          )}



          {/* CTA Button */}
          <div className="space-y-2">
            {shouldShowPlan ? (
              <Button
                onClick={handleCheckout}
                disabled={isLoading || !!isCurrentPlan}
                className={`w-full py-2 sm:py-3 text-xs sm:text-sm font-bold transition-all duration-300 magnetic interactive-element hover-target pricing-button checkout-button stripe-button button ${
                  safePlan.popular
                    ? `bg-gradient-to-r ${safePlan.gradient} hover:shadow-premium-lg text-white`
                    : "bg-gray-800 hover:bg-gray-700 text-white"
                } ${
                  isLoading || !!isCurrentPlan
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:scale-105"
                }`}
                data-interactive="true"
                data-pricing-button="true"
                data-checkout-button="true"
                data-stripe-checkout="true"
                data-button="true"
                aria-label={`Subscribe to ${safePlan.name} plan`}
              >
                {isLoading ? (
                  <ButtonLoadingSpinner text="Processing..." />
                ) : paymentError ? (
                  <span className="text-sm">Retry Payment</span>
                ) : isCurrentPlan ? (
                  <span className="text-sm">Current Plan</span>
                ) : canUpgradeToAnnual ? (
                  <span className="text-sm">Upgrade to Annual</span>
                ) : canUpgradePlan ? (
                  <span className="text-sm">Upgrade Plan</span>
                ) : isUpgrade ? (
                  <span className="text-sm">Upgrade</span>
                ) : safePlan.popular ? (
                  <span className="text-sm">Start Building Fame</span>
                ) : (
                  <span className="text-sm">Get Started</span>
                )}
              </Button>
            ) : (
              <div className="w-full py-3 text-sm text-center text-gray-500 bg-gray-100 rounded-lg">
                                        <span>Unavailable</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the default plans for use in pricing page
export { defaultPlans, type PricingPlan };
