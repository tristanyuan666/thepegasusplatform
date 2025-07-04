"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Crown,
  CreditCard,
  Calendar,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Download,
  Settings,
  Zap,
  TrendingUp,
  Users,
  BarChart3,
  Sparkles,
  ExternalLink,
  RefreshCw,
  Shield,
  Clock,
  DollarSign,
  FileText,
  Star,
  Target,
  Activity,
  Smartphone,
  Globe,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import {
  SubscriptionData,
  getSubscriptionTier,
  getUsageLimit,
  hasFeatureAccess,
} from "@/utils/auth";
import Link from "next/link";

interface SubscriptionManagementProps {
  userId: string;
  subscription: SubscriptionData | null;
}

interface BillingHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  invoice_url?: string;
  description?: string;
}

interface UsageStats {
  postsThisMonth: number;
  platformsConnected: number;
  storageUsed: number;
  apiCalls: number;
}

export default function SubscriptionManagement({
  userId,
  subscription,
}: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>(
    [],
  );
  const [usageStats, setUsageStats] = useState<UsageStats>({
    postsThisMonth: 0,
    platformsConnected: 0,
    storageUsed: 0,
    apiCalls: 0,
  });
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const supabase = createClient();

  const currentTier = getSubscriptionTier(subscription);
  const isActive = subscription?.status === "active";

  const planDetails = {
    free: {
      name: "Free",
      icon: <Sparkles className="w-6 h-6" />,
      color: "from-gray-500 to-gray-600",
      bgColor: "bg-gray-50",
      textColor: "text-gray-700",
      limits: { posts: 5, platforms: 1, storage: 1 },
      price: { monthly: 0, yearly: 0 },
    },
    creator: {
      name: "Creator",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      limits: { posts: 50, platforms: 2, storage: 5 },
      price: { monthly: 39.99, yearly: 383.99 },
    },
    influencer: {
      name: "Influencer",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      limits: { posts: -1, platforms: -1, storage: 50 },
      price: { monthly: 59.99, yearly: 575.99 },
    },
    superstar: {
      name: "Superstar",
      icon: <Crown className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      limits: { posts: -1, platforms: -1, storage: 500 },
      price: { monthly: 99.99, yearly: 959.99 },
    },
  };

  const currentPlan =
    planDetails[currentTier as keyof typeof planDetails] || planDetails.free;

  useEffect(() => {
    loadUsageStats();
    if (subscription) {
      loadBillingHistory();
    }
  }, [subscription]);

  const loadUsageStats = async () => {
    try {
      // Load current month usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const { count: postsCount } = await supabase
        .from("content_queue")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .gte("created_at", startOfMonth.toISOString());

      const { count: platformsCount } = await supabase
        .from("social_connections")
        .select("*", { count: "exact", head: true })
        .eq("user_id", userId)
        .eq("is_active", true);

      // Mock API calls and storage for demo
      const mockApiCalls = Math.floor(Math.random() * 1000) + 500;
      const mockStorageUsed = Math.random() * currentPlan.limits.storage;

      setUsageStats({
        postsThisMonth: postsCount || 0,
        platformsConnected: platformsCount || 0,
        storageUsed: mockStorageUsed,
        apiCalls: mockApiCalls,
      });
    } catch (error) {
      console.error("Error loading usage stats:", error);
    }
  };

  const loadBillingHistory = async () => {
    try {
      // Mock billing history for demo
      const mockHistory: BillingHistoryItem[] = [
        {
          id: "1",
          amount: currentPlan.price.monthly * 100,
          currency: "usd",
          status: "paid",
          created: Date.now() - 30 * 24 * 60 * 60 * 1000,
          description: `${currentPlan.name} Plan - Monthly`,
          invoice_url: "#",
        },
        {
          id: "2",
          amount: currentPlan.price.monthly * 100,
          currency: "usd",
          status: "paid",
          created: Date.now() - 60 * 24 * 60 * 60 * 1000,
          description: `${currentPlan.name} Plan - Monthly`,
          invoice_url: "#",
        },
      ];
      setBillingHistory(mockHistory);
    } catch (error) {
      console.error("Error loading billing history:", error);
    }
  };

  const handleManageBilling = async () => {
    setIsManagingBilling(true);
    try {
      // Create Stripe customer portal session
      const { data, error } = await supabase.functions.invoke(
        "create-portal-session",
        {
          body: {
            customer_id: subscription?.customer_id || subscription?.stripe_id,
            return_url: window.location.href,
          },
        },
      );

      if (error) throw error;

      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error creating portal session:", error);
      // Fallback to pricing page
      window.location.href = "/pricing";
    } finally {
      setIsManagingBilling(false);
    }
  };

  const handleCancelSubscription = async () => {
    if (
      !confirm(
        "Are you sure you want to cancel your subscription? You'll lose access to all premium features at the end of your current billing period.",
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke(
        "cancel-subscription",
        {
          body: {
            subscription_id:
              subscription?.stripe_id || subscription?.stripe_subscription_id,
            user_id: userId,
          },
        },
      );

      if (error) {
        console.error("Cancel subscription error:", error);
        throw new Error(error.message || "Failed to cancel subscription");
      }

      if (data?.success) {
        alert(
          "Subscription canceled successfully. You'll retain access until the end of your current billing period.",
        );
        // Refresh the page to show updated status
        window.location.reload();
      } else {
        throw new Error("Failed to cancel subscription");
      }
    } catch (error) {
      console.error("Error canceling subscription:", error);
      alert(
        error.message ||
          "Failed to cancel subscription. Please try again or contact support.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((current / limit) * 100, 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            Subscription Management
          </h2>
          <p className="text-gray-600">
            Manage your subscription, billing, and usage
          </p>
        </div>
        <Button
          onClick={loadUsageStats}
          variant="outline"
          size="sm"
          disabled={isLoading}
        >
          <RefreshCw
            className={`w-4 h-4 mr-2 ${isLoading ? "animate-spin" : ""}`}
          />
          Refresh
        </Button>
      </div>

      {/* Current Plan Card */}
      <Card className={`p-6 ${currentPlan.bgColor} border-2`}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div
              className={`p-3 rounded-xl bg-gradient-to-r ${currentPlan.color} text-white`}
            >
              {currentPlan.icon}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                {currentPlan.name} Plan
              </h3>
              <div className="flex items-center gap-3">
                <Badge
                  variant={isActive ? "default" : "secondary"}
                  className={isActive ? "bg-green-500" : ""}
                >
                  <div
                    className={`w-2 h-2 rounded-full mr-2 ${isActive ? "bg-white" : "bg-gray-400"}`}
                  />
                  {isActive ? "Active" : "Inactive"}
                </Badge>
                {subscription && (
                  <span className="text-sm text-gray-600">
                    {subscription.interval === "year" ? "Yearly" : "Monthly"}{" "}
                    billing
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="text-right">
            {currentTier !== "free" && subscription ? (
              <div>
                <div className="text-3xl font-bold text-gray-900">
                  $
                  {subscription.interval === "year"
                    ? currentPlan.price.yearly
                    : currentPlan.price.monthly}
                  <span className="text-lg font-normal text-gray-600">
                    /{subscription.interval === "year" ? "year" : "month"}
                  </span>
                </div>
                {subscription.current_period_end && (
                  <div className="text-sm text-gray-600">
                    Next billing:{" "}
                    {formatDate(subscription.current_period_end * 1000)}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-2xl font-bold text-gray-900">Free</div>
            )}
          </div>
        </div>

        {/* Plan Actions */}
        <div className="flex gap-3">
          {currentTier === "free" ? (
            <Button
              asChild
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
            >
              <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Link>
            </Button>
          ) : (
            <>
              <Button
                onClick={handleManageBilling}
                disabled={isManagingBilling}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <CreditCard className="w-4 h-4 mr-2" />
                {isManagingBilling ? "Loading..." : "Manage Billing"}
              </Button>
              <Button asChild variant="outline">
                <Link href="/pricing">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Change Plan
                </Link>
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Tabs for detailed information */}
      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage Statistics */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Posts Usage */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-blue-600" />
                  <h3 className="font-semibold text-gray-900">
                    Posts This Month
                  </h3>
                </div>
                <Badge variant="outline">
                  {usageStats.postsThisMonth} /{" "}
                  {currentPlan.limits.posts === -1
                    ? "∞"
                    : currentPlan.limits.posts}
                </Badge>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.postsThisMonth,
                  currentPlan.limits.posts,
                )}
                className="mb-2"
              />
              <div className="text-sm text-gray-600">
                {currentPlan.limits.posts === -1
                  ? "Unlimited posts available"
                  : `${currentPlan.limits.posts - usageStats.postsThisMonth} posts remaining`}
              </div>
            </Card>

            {/* Platforms Usage */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Smartphone className="w-5 h-5 text-purple-600" />
                  <h3 className="font-semibold text-gray-900">
                    Connected Platforms
                  </h3>
                </div>
                <Badge variant="outline">
                  {usageStats.platformsConnected} /{" "}
                  {currentPlan.limits.platforms === -1
                    ? "∞"
                    : currentPlan.limits.platforms}
                </Badge>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.platformsConnected,
                  currentPlan.limits.platforms,
                )}
                className="mb-2"
              />
              <div className="text-sm text-gray-600">
                {currentPlan.limits.platforms === -1
                  ? "All platforms available"
                  : `${currentPlan.limits.platforms - usageStats.platformsConnected} platforms remaining`}
              </div>
            </Card>

            {/* Storage Usage */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Activity className="w-5 h-5 text-green-600" />
                  <h3 className="font-semibold text-gray-900">Storage Used</h3>
                </div>
                <Badge variant="outline">
                  {usageStats.storageUsed.toFixed(1)} /{" "}
                  {currentPlan.limits.storage} GB
                </Badge>
              </div>
              <Progress
                value={getUsagePercentage(
                  usageStats.storageUsed,
                  currentPlan.limits.storage,
                )}
                className="mb-2"
              />
              <div className="text-sm text-gray-600">
                {(currentPlan.limits.storage - usageStats.storageUsed).toFixed(
                  1,
                )}{" "}
                GB remaining
              </div>
            </Card>

            {/* API Calls */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <Globe className="w-5 h-5 text-orange-600" />
                  <h3 className="font-semibold text-gray-900">API Calls</h3>
                </div>
                <Badge variant="outline">
                  {usageStats.apiCalls.toLocaleString()}
                </Badge>
              </div>
              <div className="text-sm text-gray-600">
                {currentTier === "free"
                  ? "Limited API access"
                  : "Unlimited API calls"}
              </div>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="features" className="space-y-6">
          {/* Feature Access */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Feature Access
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                {
                  key: "ai_content",
                  name: "AI Content Generation",
                  icon: Sparkles,
                },
                {
                  key: "basic_analytics",
                  name: "Basic Analytics",
                  icon: BarChart3,
                },
                {
                  key: "advanced_analytics",
                  name: "Advanced Analytics",
                  icon: TrendingUp,
                },
                {
                  key: "viral_predictor",
                  name: "Viral Score Predictor",
                  icon: Zap,
                },
                {
                  key: "auto_scheduling",
                  name: "Auto Scheduling",
                  icon: Clock,
                },
                { key: "all_platforms", name: "All Platforms", icon: Globe },
                {
                  key: "priority_support",
                  name: "Priority Support",
                  icon: Shield,
                },
                { key: "custom_branding", name: "Custom Branding", icon: Star },
                { key: "api_access", name: "API Access", icon: Settings },
                {
                  key: "dedicated_manager",
                  name: "Dedicated Manager",
                  icon: Users,
                },
              ].map((feature) => {
                const hasAccess = hasFeatureAccess(subscription, feature.key);
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.key}
                    className={`flex items-center justify-between p-3 rounded-lg ${
                      hasAccess
                        ? "bg-green-50 border border-green-200"
                        : "bg-gray-50 border border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-4 h-4 ${hasAccess ? "text-green-600" : "text-gray-400"}`}
                      />
                      <span
                        className={`font-medium ${hasAccess ? "text-green-900" : "text-gray-600"}`}
                      >
                        {feature.name}
                      </span>
                    </div>
                    {hasAccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <XCircle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing Information */}
          {subscription ? (
            <>
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Current Subscription
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Plan:</span>
                      <span className="font-medium">{currentPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Billing Cycle:</span>
                      <span className="font-medium capitalize">
                        {subscription.interval}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Amount:</span>
                      <span className="font-medium">
                        {formatCurrency(
                          subscription.amount || 0,
                          subscription.currency || "usd",
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Status:</span>
                      <Badge
                        variant={
                          subscription.status === "active"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {subscription.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-3">
                    {subscription.current_period_start && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Current Period:</span>
                        <span className="font-medium">
                          {formatDate(subscription.current_period_start * 1000)}
                        </span>
                      </div>
                    )}
                    {subscription.current_period_end && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Next Billing:</span>
                        <span className="font-medium">
                          {formatDate(subscription.current_period_end * 1000)}
                        </span>
                      </div>
                    )}
                    {subscription.cancel_at_period_end && (
                      <div className="flex items-center gap-2 text-orange-600">
                        <AlertTriangle className="w-4 h-4" />
                        <span className="text-sm font-medium">
                          Cancels at period end
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              {/* Billing History */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Billing History
                  </h3>
                  <Button variant="outline" size="sm">
                    <Download className="w-4 h-4 mr-2" />
                    Download All
                  </Button>
                </div>
                <div className="space-y-3">
                  {billingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            item.status === "paid"
                              ? "bg-green-100"
                              : "bg-red-100"
                          }`}
                        >
                          {item.status === "paid" ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {formatCurrency(item.amount, item.currency)}
                          </div>
                          <div className="text-sm text-gray-600">
                            {item.description} • {formatDate(item.created)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.status === "paid" ? "default" : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.invoice_url && (
                          <Button variant="ghost" size="sm" asChild>
                            <a
                              href={item.invoice_url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-8 text-center">
              <CreditCard className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-600 mb-4">
                You're currently on the free plan. Upgrade to unlock premium
                features.
              </p>
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                <Link href="/pricing">
                  <Crown className="w-4 h-4 mr-2" />
                  View Plans
                </Link>
              </Button>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="settings" className="space-y-6">
          {/* Account Settings */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Settings
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">
                    Email Notifications
                  </h4>
                  <p className="text-sm text-gray-600">
                    Receive updates about your subscription
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Configure
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-900">Payment Method</h4>
                  <p className="text-sm text-gray-600">
                    Manage your payment methods
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleManageBilling}
                >
                  Manage
                </Button>
              </div>

              <div className="flex items-center justify-between p-4 bg-red-50 rounded-lg border border-red-200">
                <div>
                  <h4 className="font-medium text-red-900">
                    Cancel Subscription
                  </h4>
                  <p className="text-sm text-red-600">
                    Cancel your subscription at any time
                  </p>
                </div>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={handleCancelSubscription}
                  disabled={isLoading}
                >
                  {isLoading ? "Canceling..." : "Cancel"}
                </Button>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
