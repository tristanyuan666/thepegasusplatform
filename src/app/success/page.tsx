"use client";

import { useEffect, useState } from "react";
import {
  CheckCircle2,
  Crown,
  Sparkles,
  Zap,
  TrendingUp,
  Gift,
  ArrowRight,
  Star,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/navbar";
import { Suspense } from "react";
import { createClient } from "@/supabase/client";

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function SuccessContent() {
  // Get URL parameters for plan details
  const searchParams =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search)
      : null;
  const urlPlan = searchParams?.get("plan") || "creator";
  const urlBilling = searchParams?.get("billing") || "monthly";

  const [plan, setPlan] = useState<string | null>(null);
  const [billing, setBilling] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlan = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setPlan(urlPlan);
        setBilling(urlBilling);
        setLoading(false);
        return;
      }
      const { data: sub } = await supabase
        .from("subscriptions")
        .select("plan_name,billing_cycle,status")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();
      if (sub) {
        setPlan(sub.plan_name?.toLowerCase() || urlPlan);
        setBilling(sub.billing_cycle?.toLowerCase() || urlBilling);
      } else {
        setPlan(urlPlan);
        setBilling(urlBilling);
      }
      setLoading(false);
    };
    fetchPlan();
    // eslint-disable-next-line
  }, []);

  // Show a loading spinner if loading
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
      </div>
    );
  }

  // Use plan and billing from state
  const planDetails = {
    creator: {
      name: "Creator",
      icon: <Sparkles className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      features: ["50 AI Posts/Month", "2 Social Platforms", "Basic Analytics"],
    },
    influencer: {
      name: "Influencer",
      icon: <TrendingUp className="w-8 h-8" />,
      color: "from-blue-600 to-cyan-500",
      features: [
        "Unlimited AI Posts",
        "All Platforms",
        "Viral Score Predictor",
        "Growth Engine",
        "Monetization Suite",
        "Advanced Analytics",
        "Priority Support",
      ],
    },
    superstar: {
      name: "Superstar",
      icon: <Crown className="w-8 h-8" />,
      color: "from-cyan-500 to-blue-700",
      features: [
        "Everything in Influencer",
        "Custom Branding",
        "Dedicated Manager",
        "API Access",
        "Team Collaboration",
        "White Label",
      ],
    },
  };

  const currentPlan =
    planDetails[plan as keyof typeof planDetails] || planDetails.creator;

  // Format billing period
  let billingDisplay = billing;
  if (billing === "annual" || billing === "yearly") billingDisplay = "Annual";
  else if (billing === "monthly") billingDisplay = "Monthly";
  else if (billing) billingDisplay = billing.charAt(0).toUpperCase() + billing.slice(1);
  else billingDisplay = "";

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4 mt-20 md:mt-24">
        <div className="max-w-2xl w-full">
          {/* Main Success Card */}
          <Card className="glass-premium border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div
                  className={`p-3 rounded-xl bg-gradient-to-r ${currentPlan.color} text-white`}
                >
                  {currentPlan.icon}
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold gradient-text-primary">
                    Welcome to {currentPlan.name}!
                  </CardTitle>
                  <CardDescription className="text-lg mt-2">
                    Your payment was successful and your account is now active
                  </CardDescription>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {/* Plan Features */}
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Gift className="w-5 h-5 text-blue-600" />
                  What's included in your {currentPlan.name} plan:
                </h3>
                <div className="grid gap-3">
                  {currentPlan.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-gray-700 font-medium">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Next Steps */}
              <div className="bg-white rounded-xl p-6 border border-gray-100">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  Get started in 3 easy steps:
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Complete your profile
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Set up your creator persona and preferences
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center font-bold text-sm">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Connect your platforms
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Link your social media accounts for seamless posting
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center font-bold text-sm">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        Create your first content
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Use AI to generate viral-ready content
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Confirmation Details */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Plan:</span>
                  <span className="font-medium text-gray-900">
                    {currentPlan.name} ({billingDisplay})
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm mt-2">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium text-green-600 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    Active
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-4">
                <Button
                  asChild
                  className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Link href="/dashboard" className="flex items-center gap-2">
                    Go to Dashboard
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" className="flex-1">
                  <Link href="/features/ai-content" className="flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Explore Features
                  </Link>
                </Button>
              </div>

              {/* Support Note */}
              <div className="text-center pt-4 border-t border-gray-100">
                <p className="text-gray-600 text-sm">
                  📧 Confirmation email sent to your inbox
                </p>
                <p className="text-gray-500 text-xs mt-1">
                  Need help? Contact our support team anytime
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}

export default function SuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
