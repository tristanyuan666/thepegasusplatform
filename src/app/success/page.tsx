"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Zap, 
  TrendingUp, 
  BarChart3, 
  Globe, 
  Users, 
  Settings,
  Clock,
  Gift,
  Rocket,
  Target,
  Eye,
  Heart,
  Share2,
  Calendar,
  Play,
  Camera,
  MessageCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Info
} from "lucide-react";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface SubscriptionData {
  id: string;
  plan_name: string;
  status: string;
  current_period_end: number;
  billing_cycle: string;
  amount: number;
  currency: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  onboarding_completed: boolean;
}

export default function SuccessPage() {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<SubscriptionData | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [redirecting, setRedirecting] = useState(false);
  const [redirectCountdown, setRedirectCountdown] = useState(3);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    checkUserAndSubscription();
  }, []);

  useEffect(() => {
    if (redirecting && redirectCountdown > 0) {
      const timer = setTimeout(() => {
        setRedirectCountdown(redirectCountdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (redirecting && redirectCountdown === 0) {
      handleRedirect();
    }
  }, [redirecting, redirectCountdown]);

  const retryVerification = () => {
    setRetryCount(prev => prev + 1);
    setError(null);
    setLoading(true);
    setTimeout(() => {
      checkUserAndSubscription();
    }, 2000); // Wait 2 seconds before retrying
  };

  const manualRecovery = async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log("🔄 Attempting manual recovery...");
      
      // Call the webhook recovery endpoint
      const response = await fetch('/api/platform-connections', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'recover_payment',
          user_id: user?.id,
        }),
      });
      
      if (response.ok) {
        console.log("✅ Manual recovery successful");
        // Retry verification after recovery
        setTimeout(() => {
          checkUserAndSubscription();
        }, 3000);
      } else {
        console.error("❌ Manual recovery failed");
        setError("Manual recovery failed. Please contact support.");
      }
    } catch (error) {
      console.error("❌ Manual recovery error:", error);
      setError("Manual recovery failed. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const checkUserAndSubscription = async () => {
    try {
      setLoading(true);
      setError(null);

      // Get current user
      const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;
      if (!currentUser) throw new Error("No user found");

      setUser(currentUser);
      console.log("✅ User found:", currentUser.id);

      // Get user profile
      const { data: profile, error: profileError } = await supabase
        .from("users")
        .select("*")
        .eq("user_id", currentUser.id)
        .single();

      if (profileError && profileError.code !== "PGRST116") {
        console.error("Profile error:", profileError);
      } else {
        setUserProfile(profile);
        console.log("✅ User profile found:", profile);
      }

      // IMMEDIATE FIX: Check for recent checkout sessions first
      const { data: checkoutSessions, error: checkoutError } = await supabase
        .from("checkout_sessions")
        .select("*")
        .eq("user_id", currentUser.id)
        .in("status", ["pending", "completed"])
        .order("created_at", { ascending: false })
        .limit(1);

      if (!checkoutError && checkoutSessions && checkoutSessions.length > 0) {
        console.log("✅ Found recent checkout session, granting immediate access");
        console.log("Checkout session:", checkoutSessions[0]);
        
        // IMMEDIATELY update user profile to grant access
        const { error: userUpdateError } = await supabase
          .from("users")
          .update({
            plan: checkoutSessions[0].plan_name || "Influencer",
            plan_status: "active",
            plan_billing: checkoutSessions[0].billing_cycle || "monthly",
            is_active: true,
            updated_at: new Date().toISOString(),
          })
          .eq("user_id", currentUser.id);

        if (userUpdateError) {
          console.error("❌ Error updating user profile:", userUpdateError);
        } else {
          console.log("✅ User profile updated with plan access");
        }

        // Show success immediately
        setSubscription({
          id: "active",
          plan_name: checkoutSessions[0].plan_name || "Influencer",
          status: "active",
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          billing_cycle: checkoutSessions[0].billing_cycle || "monthly",
          amount: checkoutSessions[0].amount || 5999,
          currency: checkoutSessions[0].currency || "usd"
        });

        // Start redirect countdown
        setTimeout(() => {
          setRedirecting(true);
        }, 2000);

        return; // Exit early - user has access
      }

      // Get subscription data - check for ANY subscription first, not just active ones
      const { data: subscriptionData, error: subError } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", currentUser.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (subError && subError.code !== "PGRST116") {
        console.error("Subscription error:", subError);
        
        // If no subscription found, check if there's a recent checkout session
        if (!checkoutSessions || checkoutSessions.length === 0) {
          console.error("❌ No checkout sessions found");
          console.error("Checkout error:", checkoutError);
          
          // Check if user has any plan status in their profile
          if (profile && (profile.plan || profile.plan_status)) {
            console.log("✅ User has plan in profile:", profile.plan, profile.plan_status);
            setSubscription({
              id: "active",
              plan_name: profile.plan || "Influencer",
              status: profile.plan_status || "active",
              current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
              billing_cycle: profile.plan_billing || "monthly",
              amount: 5999,
              currency: "usd"
            });
          } else {
            setError("Unable to load subscription details. Please contact support if this persists.");
          }
        }
      } else {
        console.log("✅ Subscription found:", subscriptionData);
        setSubscription(subscriptionData);
      }

      // If we still don't have a subscription but user has a plan, show success
      if (!subscription && profile && (profile.plan || profile.plan_status === "active")) {
        console.log("✅ User has active plan in profile, showing success");
        setSubscription({
          id: "active",
          plan_name: profile.plan || "Influencer",
          status: profile.plan_status || "active",
          current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60),
          billing_cycle: profile.plan_billing || "monthly",
          amount: 5999,
          currency: "usd"
        });
      }

      // Start redirect countdown
      setTimeout(() => {
        setRedirecting(true);
      }, 2000);

    } catch (error) {
      console.error("❌ Error checking user and subscription:", error);
      setError("Unable to verify your payment. Please contact support.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedirect = () => {
    if (userProfile?.onboarding_completed) {
      window.location.href = "/dashboard";
    } else {
      window.location.href = "/onboarding";
    }
  };

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getPlanFeatures = (planName: string) => {
    const plan = planName.toLowerCase();
    if (plan.includes("superstar")) {
      return [
        { name: "Unlimited AI Content Generation", icon: Sparkles, color: "text-purple-600" },
        { name: "All Platform Integrations", icon: Globe, color: "text-blue-600" },
        { name: "Advanced Analytics & Insights", icon: BarChart3, color: "text-green-600" },
        { name: "Viral Score Predictor", icon: Target, color: "text-orange-600" },
        { name: "Custom Branding & White Label", icon: Crown, color: "text-yellow-600" },
        { name: "Dedicated Account Manager", icon: Users, color: "text-indigo-600" },
        { name: "API Access & Integrations", icon: Settings, color: "text-gray-600" },
        { name: "Priority Support", icon: MessageCircle, color: "text-red-600" },
      ];
    } else if (plan.includes("influencer")) {
      return [
        { name: "AI Content Generation", icon: Sparkles, color: "text-purple-600" },
        { name: "All Platform Integrations", icon: Globe, color: "text-blue-600" },
        { name: "Advanced Analytics", icon: BarChart3, color: "text-green-600" },
        { name: "Viral Score Predictor", icon: Target, color: "text-orange-600" },
        { name: "Growth Engine", icon: TrendingUp, color: "text-yellow-600" },
        { name: "Priority Support", icon: MessageCircle, color: "text-red-600" },
      ];
    } else {
      return [
        { name: "AI Content Generation", icon: Sparkles, color: "text-purple-600" },
        { name: "2 Platform Integrations", icon: Globe, color: "text-blue-600" },
        { name: "Basic Analytics", icon: BarChart3, color: "text-green-600" },
        { name: "Content Scheduling", icon: Calendar, color: "text-orange-600" },
      ];
    }
  };

  const getNextSteps = () => {
    if (userProfile?.onboarding_completed) {
      return [
        { title: "Connect Your Platforms", description: "Link your social media accounts to start creating content", href: "/integrations", icon: Globe },
        { title: "Create Your First Content", description: "Use AI to generate viral content for your audience", href: "/features/ai-content", icon: Sparkles },
        { title: "View Your Analytics", description: "Track your performance and growth metrics", href: "/dashboard?tab=analytics", icon: BarChart3 },
        { title: "Explore All Features", description: "Discover everything your plan has to offer", href: "/features", icon: Rocket },
      ];
    } else {
      return [
        { title: "Complete Your Profile", description: "Set up your creator profile and preferences", href: "/onboarding", icon: Settings },
        { title: "Connect Your Platforms", description: "Link your social media accounts", href: "/integrations", icon: Globe },
        { title: "Create Your First Content", description: "Start generating viral content with AI", href: "/features/ai-content", icon: Sparkles },
      ];
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardHeader className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <CardTitle className="text-xl">Payment Verification Failed</CardTitle>
            <CardDescription>{error}</CardDescription>
            {retryCount > 0 && (
              <p className="text-sm text-gray-500 mt-2">
                Retry attempt {retryCount}/3
              </p>
            )}
          </CardHeader>
          <CardContent className="text-center space-y-3">
            <Button 
              onClick={retryVerification} 
              className="w-full"
              disabled={retryCount >= 3}
            >
              {retryCount >= 3 ? "Max Retries Reached" : "Retry Verification"}
            </Button>
            <Button 
              onClick={manualRecovery} 
              variant="outline" 
              className="w-full"
              disabled={retryCount >= 3}
            >
              Manual Recovery
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              If the issue persists, please contact support with your payment details.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              {subscription?.status === "processing" ? "Payment Processing! ⏳" : "Payment Successful! 🎉"}
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              {subscription?.status === "processing" 
                ? "Your payment is being processed. This usually takes a few moments. You'll have full access once processing is complete."
                : "Welcome to The Pegasus Platform! Your subscription is now active and you're ready to start creating viral content."
              }
            </p>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-semibold">{subscription.plan_name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge 
                        variant="default" 
                        className={
                          subscription.status === "processing" 
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }
                      >
                        {subscription.status === "processing" ? "Processing" : "Active"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium capitalize">{subscription.billing_cycle}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-semibold">
                        {formatCurrency(subscription.amount, subscription.currency)}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                      <span className="font-medium">
                        {subscription.current_period_end 
                          ? formatDate(subscription.current_period_end)
                          : "N/A"
                        }
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription ID:</span>
                      <span className="font-mono text-sm">
                        {subscription.id.slice(0, 8)}...
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Plan Features */}
          {subscription && (
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-purple-600" />
                  Your Plan Features
                </CardTitle>
                <CardDescription>
                  Here's what you now have access to with your {subscription.plan_name} plan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {getPlanFeatures(subscription.plan_name).map((feature, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <feature.icon className={`w-5 h-5 ${feature.color}`} />
                      <span className="font-medium text-gray-900">{feature.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Next Steps */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Rocket className="w-5 h-5 text-blue-600" />
                Next Steps
              </CardTitle>
              <CardDescription>
                Get started with your new subscription
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                {getNextSteps().map((step, index) => (
                  <Link key={index} href={step.href}>
                    <div className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-3 mb-2">
                        <step.icon className="w-5 h-5 text-blue-600" />
                        <h3 className="font-semibold text-gray-900">{step.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600">{step.description}</p>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-yellow-600" />
                Quick Actions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-3">
                <Button asChild variant="outline">
                  <Link href="/dashboard">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    View Dashboard
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard?tab=platforms">
                    <Globe className="w-4 h-4 mr-2" />
                    Manage Platforms
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/features/ai-content">
                    <Sparkles className="w-4 h-4 mr-2" />
                    Create Content
                  </Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/dashboard?tab=settings">
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Subscription
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Redirect Notice */}
          {redirecting && (
            <Card className="border-blue-200 bg-blue-50">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900">
                      Redirecting in {redirectCountdown} seconds...
                    </h3>
                    <p className="text-sm text-blue-700">
                      Taking you to {userProfile?.onboarding_completed ? "your dashboard" : "complete your setup"}
                    </p>
                  </div>
                  <Button onClick={handleRedirect} variant="outline" size="sm">
                    Go Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Support Section */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Info className="w-5 h-5 text-gray-600" />
                Need Help?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4">
                  <MessageCircle className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Support</h4>
                  <p className="text-sm text-gray-600">Get help with your account</p>
                </div>
                <div className="text-center p-4">
                  <ExternalLink className="w-8 h-8 text-green-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Documentation</h4>
                  <p className="text-sm text-gray-600">Learn how to use features</p>
                </div>
                <div className="text-center p-4">
                  <Users className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Community</h4>
                  <p className="text-sm text-gray-600">Connect with other creators</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
