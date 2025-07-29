"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Zap,
  CheckCircle,
  AlertCircle
} from "lucide-react";
import Link from "next/link";

interface FeatureAccessControlProps {
  children: React.ReactNode;
  featureName: string;
  featureDescription: string;
  requiredPlan?: "creator" | "influencer" | "superstar";
  icon?: React.ReactNode;
}

export default function FeatureAccessControl({
  children,
  featureName,
  featureDescription,
  requiredPlan,
  icon
}: FeatureAccessControlProps) {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const supabase = createClient();

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        // Check subscription status
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        setSubscription(subscriptionData);
        setHasActiveSubscription(!!subscriptionData);
        
        if (subscriptionData) {
          const planName = subscriptionData.plan_name?.toLowerCase();
          if (planName?.includes("superstar")) setSubscriptionTier("superstar");
          else if (planName?.includes("influencer")) setSubscriptionTier("influencer");
          else if (planName?.includes("creator")) setSubscriptionTier("creator");
          else setSubscriptionTier("free");
        }
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasFeatureAccess = () => {
    if (!hasActiveSubscription) return false;
    if (!requiredPlan) return true;
    
    const tierOrder = { creator: 1, influencer: 2, superstar: 3 };
    const userTier = tierOrder[subscriptionTier as keyof typeof tierOrder] || 0;
    const requiredTier = tierOrder[requiredPlan];
    
    return userTier >= requiredTier;
  };

  const getGetStartedHref = () => {
    if (!user) {
      // Non-signed in user: Go to sign-in
      return "/sign-in";
    } else if (!hasActiveSubscription) {
      // Signed in user with no plan: Go to pricing
      return "/pricing";
    } else if (!hasFeatureAccess()) {
      // Signed in user with plan but insufficient tier: Go to pricing with upgrade
      return `/pricing?upgrade=${requiredPlan}`;
    } else {
      // Signed in user with sufficient plan: Access feature
      return null; // Will render the actual feature
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has access, render the feature
  if (user && hasActiveSubscription && hasFeatureAccess()) {
    return <>{children}</>;
  }

  // Otherwise, show the feature introduction with appropriate CTA
  const getStartedHref = getGetStartedHref();
  const isUpgrade = user && hasActiveSubscription && !hasFeatureAccess();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Feature Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6">
              {icon || <Sparkles className="w-10 h-10 text-white" />}
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {featureName}
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              {featureDescription}
            </p>
          </div>

          {/* Feature Benefits */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Zap className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                AI-Powered
              </h3>
              <p className="text-gray-600">
                Advanced artificial intelligence that learns from your content and audience to deliver better results.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Professional Grade
              </h3>
              <p className="text-gray-600">
                Enterprise-level tools used by top creators and brands to maximize their social media impact.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Proven Results
              </h3>
              <p className="text-gray-600">
                Trusted by thousands of creators who have grown their audiences and increased their engagement.
              </p>
            </Card>
          </div>

          {/* Access Control */}
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-4">
                {isUpgrade ? (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    Upgrade Required
                  </Badge>
                ) : !user ? (
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    Sign In Required
                  </Badge>
                ) : (
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Plan Required
                  </Badge>
                )}
              </div>
              <CardTitle className="text-2xl">
                {isUpgrade 
                  ? `Upgrade to ${requiredPlan?.charAt(0).toUpperCase() + requiredPlan?.slice(1)} Plan`
                  : !user 
                    ? "Sign In to Access This Feature"
                    : "Choose a Plan to Get Started"
                }
              </CardTitle>
              <CardDescription className="text-lg">
                {isUpgrade 
                  ? `This feature requires the ${requiredPlan} plan or higher. Upgrade now to unlock ${featureName}.`
                  : !user 
                    ? "Create your account to start using our advanced features and grow your social media presence."
                    : "Select a plan that fits your needs and start creating viral content today."
                }
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <div className="space-y-4">
                {isUpgrade && (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="w-5 h-5" />
                      <span className="font-medium">Current Plan: {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)}</span>
                    </div>
                    <p className="text-sm text-orange-700 mt-1">
                      You need the {requiredPlan} plan to access this feature.
                    </p>
                  </div>
                )}

                <Button 
                  asChild 
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 text-lg"
                  size="lg"
                >
                  <Link href={getStartedHref!}>
                    {isUpgrade 
                      ? "Upgrade Now"
                      : !user 
                        ? "Sign In to Get Started"
                        : "Choose Your Plan"
                    }
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </Link>
                </Button>

                {!user && (
                  <p className="text-sm text-gray-500">
                    Don't have an account?{" "}
                    <Link href="/sign-up" className="text-blue-600 hover:text-blue-700 font-medium">
                      Sign up here
                    </Link>
                  </p>
                )}

                {user && !hasActiveSubscription && (
                  <p className="text-sm text-gray-500">
                    Already have an account?{" "}
                    <Link href="/dashboard" className="text-blue-600 hover:text-blue-700 font-medium">
                      Go to dashboard
                    </Link>
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}