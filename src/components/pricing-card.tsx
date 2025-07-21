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
    price: { monthly: 39.99, yearly: 383.99 },
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
    price: { monthly: 59.99, yearly: 575.99 },
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
    price: { monthly: 99.99, yearly: 959.99 },
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
    monthly: "price_1RnBOY4Qsqtj5fxtmeZvp9hD", // Creator Monthly
    yearly: "price_1RnBQl4Qsqtj5fxtlUBgr5DV", // Creator Annual
  },
  influencer: {
    monthly: "price_1RnBPS4Qsqtj5fxtbip0cUVO", // Influencer Monthly
    yearly: "price_1RnBRW4Qsqtj5fxtCjfe7jRC", // Influencer Annual
  },
  superstar: {
    monthly: "price_1RnBQ74Qsqtj5fxtQCMxGyjd", // Superstar Monthly
    yearly: "price_1RnBRx4Qsqtj5fxt7pSn1ltF", // Superstar Annual
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
      console.log("Testing Edge Function connectivity...");
      const { data, error } = await supabase.functions.invoke(
        "create-checkout",
        {
          body: {
            test_mode: true,
            price_id: "test",
            user_id: "test",
            timestamp: new Date().toISOString(),
          },
        },
      );

      console.log("Test result:", { data, error });

      if (error) {
        setTestResult(`Test FAILED: ${error.message}`);
      } else if (data?.success) {
        setTestResult(`Test PASSED: ${data.message}`);
      } else {
        setTestResult(`Test FAILED: Unexpected response`);
      }
    } catch (error) {
      console.error("Test error:", error);
      setTestResult(
        `Test ERROR: ${error instanceof Error ? error.message : "Unknown error"}`,
      );
    }
  };
  // Use either plan prop or item prop, fallback to default plans if neither
  const actualPlan = plan || item;

  // If no plan is provided, use the first default plan
  if (!actualPlan) {
    const defaultPlan = defaultPlans[0];
    return (
      <PricingCard
        plan={{
          id: "creator",
          name: "Creator",
          price: { monthly: 39.99, yearly: 383.88 },
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
          ],
        }}
        user={user}
      />
    );
  }

  // Ensure all required properties exist with defaults
  const safePlan = {
    id: actualPlan.id || "starter",
    name: actualPlan.name || "Plan",
    price: actualPlan.price || { monthly: 0, yearly: 0 },
    popular: actualPlan.popular || false,
    description: actualPlan.description || "Description",
    features: actualPlan.features || [],
    gradient: actualPlan.gradient || "from-blue-500 to-cyan-500",
    icon: actualPlan.icon || <Sparkles className="w-6 h-6" />,
  };

  // Ensure price object exists with defaults
  const priceData = safePlan.price;

  // Helper to round to .99
  function to99(n: number) {
    return Math.floor(n) + 0.99;
  }

  // Calculate current and original prices
  const currentPrice = isYearly ? to99(priceData.yearly) : to99(priceData.monthly);
  const originalPrice = to99(currentPrice * 2);

  // For annual, calculate per month price (ending in .99)
  const perMonthAnnual = isYearly ? to99(priceData.yearly / 12) : null;
  const originalPerMonthAnnual = isYearly ? to99((priceData.yearly / 12) * 2) : null;

  // Calculate savings
  const savings =
    isYearly && priceData.monthly > 0
      ? Math.round(
          ((priceData.monthly * 12 - priceData.yearly) /
            (priceData.monthly * 12)) *
            100,
        )
      : 0;

  // Use displayPrice directly to avoid hydration issues

  const handleCheckout = async () => {
    if (!user) {
      if (typeof window !== "undefined") {
        // Store the selected plan in localStorage for after sign-in
        localStorage.setItem(
          "selectedPlan",
          JSON.stringify({
            planId: safePlan.id,
            isYearly: isYearly,
            planName: safePlan.name,
          }),
        );
        window.location.href = `/sign-in?redirect=${encodeURIComponent(`/pricing?plan=${safePlan.id}&billing=${isYearly ? "yearly" : "monthly"}`)}`;
      }
      return;
    }

    setIsLoading(true);

    try {
      if (onCheckout) {
        await onCheckout(safePlan.id, isYearly);
      } else {
        // Checkout logic
        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "https://thepegasus.ca";
        const returnUrl = `${baseUrl}/success?plan=${safePlan.id}&billing=${isYearly ? "yearly" : "monthly"}`;
        const cancelUrl = `${baseUrl}/pricing?cancelled=true`;

            // Use the component-level STRIPE_PRICE_IDS constant
    const priceId =
      STRIPE_PRICE_IDS[safePlan.id as keyof typeof STRIPE_PRICE_IDS]?.[
            isYearly ? "yearly" : "monthly"
          ];

        if (!priceId) {
          throw new Error(
            `Price configuration not found for ${safePlan.name} (${isYearly ? "yearly" : "monthly"})`,
          );
        }

        if (!user.id || !user.email) {
          throw new Error(
            "User information is incomplete. Please sign in again.",
          );
        }

        const checkoutPayload = {
          price_id: priceId,
          user_id: user.id,
          return_url: returnUrl,
          cancel_url: cancelUrl,
          customer_email: user.email,
          plan_name: safePlan.name,
          billing_cycle: isYearly ? "yearly" : "monthly",
          metadata: {
            user_id: user.id,
            plan_id: safePlan.id,
            billing_cycle: isYearly ? "yearly" : "monthly",
            plan_name: safePlan.name,
            timestamp: new Date().toISOString(),
          },
        };

        // Call Supabase Edge Function
        console.log("Invoking Edge Function:", "create-checkout");
        console.log("Payload:", checkoutPayload);

        // Get the user's access token for authorization
        const { data: { session } } = await supabase.auth.getSession();
        const accessToken = session?.access_token;

        const { data, error } = await supabase.functions.invoke(
          "create-checkout",
          {
            body: checkoutPayload,
            headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
          },
        );

        console.log("Checkout response:", { data, error });
        console.log("Raw error object:", error);
        console.log("Raw data object:", data);

        if (error) {
          console.error("Edge function error details:", {
            message: error.message,
            details: error.details,
            context: error.context,
            hint: error.hint,
          });
          throw new Error(`Failed to start checkout process: ${error.message}`);
        }

        if (!data) {
          throw new Error("No response data received from checkout function");
        }

        if (!data.success) {
          console.error("Checkout function returned failure:", data);
          throw new Error(data?.error || "Checkout function returned failure");
        }

        if (!data.url) {
          console.error("No checkout URL in response:", data);
          throw new Error("No checkout URL received from Stripe");
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
            console.warn("Analytics tracking failed:", analyticsError);
            // Don't fail checkout for analytics errors
          }

          window.location.href = data.url;
        } else {
          throw new Error("Window object not available for redirect");
        }
      }
    } catch (error) {
      console.error("=== CHECKOUT ERROR DETAILS ===");
      console.error("Error type:", typeof error);
      console.error("Error:", error);
      console.error(
        "Error message:",
        error instanceof Error ? error.message : "Unknown",
      );
      console.error(
        "Error stack:",
        error instanceof Error ? error.stack : "No stack",
      );
      console.error("User context:", {
        userId: user?.id,
        userEmail: user?.email,
        planId: safePlan.id,
        planName: safePlan.name,
        isYearly,
        priceId:
          STRIPE_PRICE_IDS[safePlan.id as keyof typeof STRIPE_PRICE_IDS]?.[
            isYearly ? "yearly" : "monthly"
          ],
      });
      console.error("Supabase client info:", {
        hasAuth: !!supabase.auth,
      });

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";
      setPaymentError(errorMessage);

      // Show user-friendly error message with more details for debugging
      if (typeof window !== "undefined") {
        const debugInfo = `\n\nDebug Info:\n- Plan: ${safePlan.name}\n- Billing: ${isYearly ? "yearly" : "monthly"}\n- User ID: ${user?.id}\n- Error: ${errorMessage}`;
        alert(
          `Payment Error: ${errorMessage}\n\nPlease try again or contact support if the issue persists.${debugInfo}`,
        );
      }
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

  // Determine button state
  const isCurrentPlan =
    userPlan === safePlan.id &&
    userBilling === (isYearly ? "yearly" : "monthly");
  const isUpgrade =
    userPlan &&
    ["creator", "influencer", "superstar"].indexOf(safePlan.id) >
      ["creator", "influencer", "superstar"].indexOf(userPlan);

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
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg">
            ⭐ Most Popular
          </div>
        </div>
      )}

      {/* Glow effect */}
      {(safePlan.popular || isHovered) && (
        <div
          className={`absolute -inset-1 bg-gradient-to-r ${safePlan.gradient} rounded-3xl blur opacity-25 transition-opacity duration-300`}
        />
      )}

      <div
        className={`bg-white p-8 h-full relative overflow-hidden transition-all duration-300 rounded-2xl shadow-lg hover:shadow-xl border ${
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
          <div className="flex items-center gap-4 mb-6">
            <div
              className={`p-3 rounded-2xl bg-gradient-to-r ${safePlan.gradient} text-white group-hover:scale-110 transition-transform duration-300`}
            >
              {safePlan.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-all duration-300">
                {safePlan.name}
              </h3>
              <p className="text-gray-600 text-sm">{safePlan.description}</p>
            </div>
          </div>

          {/* Price Section */}
          <div className="flex flex-col items-center mb-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-3xl font-bold text-gray-900">
                {isYearly ? `$${perMonthAnnual?.toFixed(2)}` : `$${currentPrice.toFixed(2)}`}
              </span>
              <span className="text-lg text-gray-400 line-through">
                {isYearly ? `$${originalPerMonthAnnual?.toFixed(2)}` : `$${originalPrice.toFixed(2)}`}
              </span>
              <span className="ml-2 px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded-full animate-pulse">
                50% OFF
              </span>
            </div>
            <span className="text-xs text-gray-500">
              {isYearly ? `/month` : "/month"}
            </span>
            {isYearly && (
              <span className="text-xs text-gray-400 mt-1">Billed annually at ${currentPrice.toFixed(2)}</span>
            )}
          </div>

          {/* Features */}
          <div className="space-y-3 mb-6 max-h-48 overflow-y-auto custom-scrollbar">
            {safePlan.features
              .slice(0, 8)
              .map(
                (feature: PricingPlan["features"][number], index: number) => (
                  <div
                    key={index}
                    className={`flex items-center gap-2 transition-all duration-300 ${
                      feature.included ? "text-gray-700" : "text-gray-500"
                    }`}
                    style={{ transitionDelay: `${index * 30}ms` }}
                  >
                    <div className="flex-shrink-0">
                      {feature.included ? (
                        <div
                          className={`w-4 h-4 rounded-full bg-gradient-to-r ${safePlan.gradient} flex items-center justify-center`}
                        >
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      ) : (
                        <div className="w-4 h-4 rounded-full bg-gray-400 flex items-center justify-center">
                          <X className="w-2.5 h-2.5 text-gray-300" />
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
                          className={`ml-1 text-xs px-1.5 py-0.5 rounded-full bg-gradient-to-r ${safePlan.gradient} text-white`}
                        >
                          PRO
                        </span>
                      )}
                    </span>
                  </div>
                ),
              )}
            {safePlan.features.length > 8 && (
              <div className="text-xs text-gray-500 text-center pt-2">
                +{safePlan.features.length - 8} more features
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

          {/* Test Section - Temporary for debugging */}
          {process.env.NODE_ENV === "development" && (
            <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-yellow-800">
                  Debug Mode
                </span>
                <Button
                  onClick={testEdgeFunction}
                  variant="outline"
                  size="sm"
                  className="text-xs"
                >
                  Test Connection
                </Button>
              </div>
              {testResult && (
                <div
                  className={`text-xs p-2 rounded ${testResult.includes("PASSED") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}
                >
                  {testResult}
                </div>
              )}
            </div>
          )}

          {/* CTA Button */}
          <div className="space-y-2">
            <Button
              onClick={handleCheckout}
              disabled={isLoading || isCurrentPlan}
              className={`w-full py-3 text-sm font-bold transition-all duration-300 magnetic interactive-element hover-target pricing-button checkout-button stripe-button button ${
                safePlan.popular
                  ? `bg-gradient-to-r ${safePlan.gradient} hover:shadow-premium-lg text-white`
                  : "bg-gray-800 hover:bg-gray-700 text-white"
              } ${
                isLoading || isCurrentPlan
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
              ) : isUpgrade ? (
                <span className="text-sm">Upgrade</span>
              ) : safePlan.popular ? (
                <span className="text-sm">Start Building Fame</span>
              ) : (
                <span className="text-sm">Get Started</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Export the default plans for use in pricing page
export { defaultPlans, type PricingPlan };
