"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Alert, AlertDescription } from "./ui/alert";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
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
  Eye,
  EyeOff,
  Lock,
  Unlock,
  ArrowRight,
  Plus,
  Minus,
  RotateCcw,
  Check,
  AlertCircle,
  Info,
  Gift,
  Award,
  Rocket,
  Crown as CrownIcon,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import {
  SubscriptionData,
  getSubscriptionTier,
  getUsageLimit,
  hasFeatureAccess,
} from "@/utils/auth";
import { FeatureAccess } from "@/utils/feature-access";
import Link from "next/link";

interface SubscriptionManagementProps {
  userId: string;
  subscription: SubscriptionData | null;
  featureAccess: FeatureAccess;
}

interface BillingHistoryItem {
  id: string;
  amount: number;
  currency: string;
  status: "paid" | "pending" | "failed";
  created: number;
  description: string;
  invoice_url?: string;
}

interface UsageStats {
  postsThisMonth: number;
  platformsConnected: number;
  storageUsed: number;
  apiCalls: number;
  aiGenerations: number;
  scheduledPosts: number;
  viralPredictions: number;
  analyticsReports: number;
}

interface PlanUpgrade {
  from: string;
  to: string;
  price: number;
  savings: number;
  features: string[];
}

export default function SubscriptionManagement({
  userId,
  subscription,
  featureAccess,
}: SubscriptionManagementProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [billingHistory, setBillingHistory] = useState<BillingHistoryItem[]>([]);
  const [usageStats, setUsageStats] = useState<UsageStats>({
    postsThisMonth: 0,
    platformsConnected: 0,
    storageUsed: 0,
    apiCalls: 0,
    aiGenerations: 0,
    scheduledPosts: 0,
    viralPredictions: 0,
    analyticsReports: 0,
  });
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const [showUsageDetails, setShowUsageDetails] = useState(false);
  const [upgradeOptions, setUpgradeOptions] = useState<PlanUpgrade[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [isLoadingUsage, setIsLoadingUsage] = useState(true);
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
      limits: { posts: 5, platforms: 1, storage: 1, aiGenerations: 10, viralPredictions: 5 },
      price: { monthly: 0, yearly: 0 },
      features: ["Basic content creation", "1 platform connection", "Limited analytics"],
    },
    creator: {
      name: "Creator",
      icon: <Zap className="w-6 h-6" />,
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-700",
      limits: { posts: 50, platforms: 2, storage: 5, aiGenerations: 100, viralPredictions: 25 },
      price: { monthly: 29.99, yearly: 287.99 },
      features: ["AI content generation", "2 platform connections", "Basic analytics", "Content scheduling"],
    },
    influencer: {
      name: "Influencer",
      icon: <TrendingUp className="w-6 h-6" />,
      color: "from-blue-600 to-cyan-500",
      bgColor: "bg-cyan-50",
      textColor: "text-cyan-700",
      limits: { posts: -1, platforms: -1, storage: 50, aiGenerations: -1, viralPredictions: -1 },
      price: { monthly: 59.99, yearly: 575.99 },
      features: ["Unlimited content", "All platforms", "Advanced analytics", "Viral predictor", "Growth engine"],
    },
    superstar: {
      name: "Superstar",
      icon: <Crown className="w-6 h-6" />,
      color: "from-cyan-500 to-blue-700",
      bgColor: "bg-purple-50",
      textColor: "text-purple-700",
      limits: { posts: -1, platforms: -1, storage: 500, aiGenerations: -1, viralPredictions: -1 },
      price: { monthly: 99.99, yearly: 959.99 },
      features: ["Everything in Influencer", "Custom branding", "API access", "Dedicated manager", "White label"],
    },
  };

  const currentPlan = planDetails[currentTier as keyof typeof planDetails] || planDetails.free;

  useEffect(() => {
    loadUsageStats();
      loadBillingHistory();
    loadPaymentMethods();
    generateUpgradeOptions();
  }, [subscription]);

  const loadUsageStats = async () => {
    setIsLoadingUsage(true);
    try {
      // Get current month usage
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      // Load real usage data from database
      const [contentData, connectionsData] = await Promise.all([
        supabase
          .from("content_queue")
          .select("*")
          .eq("user_id", userId)
          .gte("created_at", startOfMonth.toISOString()),
        supabase
          .from("platform_connections")
          .select("*")
          .eq("user_id", userId)
          .eq("is_active", true)
      ]);

      if (contentData.error) throw contentData.error;
      if (connectionsData.error) throw connectionsData.error;

      const content = contentData.data || [];
      const connections = connectionsData.data || [];

      // Calculate real usage statistics
      const realUsage: UsageStats = {
        postsThisMonth: content.length,
        platformsConnected: connections.length,
        storageUsed: Math.floor(content.length * 0.1) + 1, // Estimate storage based on content
        apiCalls: content.length * 3 + connections.length * 2, // Estimate API calls
        aiGenerations: content.filter((item: any) => item.viral_score > 70).length,
        scheduledPosts: content.filter((item: any) => item.status === "scheduled").length,
        viralPredictions: content.filter((item: any) => item.viral_score > 80).length,
        analyticsReports: Math.floor(content.length / 10) + 1,
      };

      setUsageStats(realUsage);
    } catch (error) {
      console.error("Error loading usage stats:", error);
    } finally {
      setIsLoadingUsage(false);
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

  const loadPaymentMethods = async () => {
    try {
      // Mock payment methods
      const mockPaymentMethods = [
        {
          id: "pm_1",
          type: "card",
          last4: "4242",
          brand: "visa",
          exp_month: 12,
          exp_year: 2025,
          is_default: true,
        },
      ];
      setPaymentMethods(mockPaymentMethods);
    } catch (error) {
      console.error("Error loading payment methods:", error);
    }
  };

  const generateUpgradeOptions = () => {
    const tierOrder = { free: 0, creator: 1, influencer: 2, superstar: 3 };
    const currentLevel = tierOrder[currentTier as keyof typeof tierOrder] || 0;
    
    const options: PlanUpgrade[] = [];
    
    Object.entries(planDetails).forEach(([tier, plan]) => {
      const tierLevel = tierOrder[tier as keyof typeof tierOrder] || 0;
      if (tierLevel > currentLevel) {
        const currentPlanPrice = currentPlan.price.monthly;
        const newPlanPrice = plan.price.monthly;
        const savings = currentPlanPrice > 0 ? currentPlanPrice - newPlanPrice : 0;
        
        options.push({
          from: currentTier,
          to: tier,
          price: newPlanPrice,
          savings,
          features: plan.features.filter(f => !currentPlan.features.includes(f)),
        });
      }
    });
    
    setUpgradeOptions(options);
  };

  const handleManageBilling = async () => {
    setIsManagingBilling(true);
    try {
      // For Stripe, redirect to the customer portal URL
      const customerPortalUrl = `/api/create-portal-session?customer_id=${subscription?.stripe_customer_id}`;
      
      if (customerPortalUrl) {
        window.location.href = customerPortalUrl;
      } else {
        // Fallback to pricing page
        window.location.href = "/pricing";
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
            subscription_id: subscription?.stripe_id,
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
        error instanceof Error
          ? error.message
          : "Failed to cancel subscription. Please try again or contact support."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number, currency: string = "usd") => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: currency.toUpperCase(),
    }).format(amount / 100);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getUsagePercentage = (used: number, limit: number) => {
    if (limit === -1) return 0; // Unlimited
    return Math.min((used / limit) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 70) return "bg-green-500";
    if (percentage < 90) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getUsageStatus = (percentage: number) => {
    if (percentage < 70) return "Good";
    if (percentage < 90) return "Warning";
    return "Critical";
  };

  return (
    <div className="space-y-6">
      {/* Current Plan Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg bg-gradient-to-r ${currentPlan.color}`}>
              {currentPlan.icon}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{currentPlan.name} Plan</h2>
              <p className="text-gray-600">
                {isActive ? "Active subscription" : "No active subscription"}
              </p>
              </div>
            </div>
          <div className="text-right">
                <div className="text-3xl font-bold text-gray-900">
              {currentPlan.price.monthly === 0 ? "Free" : `$${currentPlan.price.monthly}`}
                </div>
            <div className="text-sm text-gray-600">per month</div>
                  </div>
              </div>

        {/* Plan Features */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          {currentPlan.features.map((feature, index) => (
            <div key={index} className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-green-600" />
              <span className="text-sm text-gray-700">{feature}</span>
          </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          {isActive ? (
            <>
              <Button onClick={handleManageBilling} disabled={isManagingBilling}>
                {isManagingBilling ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Loading...
                  </>
                ) : (
                  <>
                    <Settings className="w-4 h-4 mr-2" />
                    Manage Billing
                  </>
                )}
              </Button>
              <Button variant="outline" asChild>
              <Link href="/pricing">
                  <ArrowRight className="w-4 h-4 mr-2" />
                Upgrade Plan
              </Link>
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleCancelSubscription}
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Canceling...
                </>
              ) : (
                <>
                  <XCircle className="w-4 h-4 mr-2" />
                  Cancel Subscription
                </>
              )}
            </Button>
            </>
          ) : (
            <Button asChild className="bg-gradient-to-r from-blue-600 to-purple-600">
                <Link href="/pricing">
                <Crown className="w-4 h-4 mr-2" />
                Choose a Plan
                </Link>
              </Button>
          )}
        </div>
      </Card>

      <Tabs defaultValue="usage" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="usage">Usage</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="upgrades">Upgrades</TabsTrigger>
        </TabsList>

        <TabsContent value="usage" className="space-y-6">
          {/* Usage Overview */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries({
              "Posts This Month": { used: usageStats.postsThisMonth, limit: currentPlan.limits.posts },
              "Platforms Connected": { used: usageStats.platformsConnected, limit: currentPlan.limits.platforms },
              "Storage Used (GB)": { used: usageStats.storageUsed, limit: currentPlan.limits.storage },
              "AI Generations": { used: usageStats.aiGenerations, limit: currentPlan.limits.aiGenerations },
            }).map(([label, { used, limit }]) => {
              const percentage = getUsagePercentage(used, limit);
              const isUnlimited = limit === -1;
              
              return (
                <Card key={label} className="p-6">
              <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900">{label}</h3>
                    <Badge variant={isUnlimited ? "default" : "outline"}>
                      {isUnlimited ? "Unlimited" : `${used}/${limit}`}
                </Badge>
              </div>
                  
                  {!isUnlimited && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Usage</span>
                        <span className="text-gray-900">{percentage.toFixed(1)}%</span>
                </div>
                      <Progress value={percentage} className="h-2" />
                      <div className="flex items-center gap-2 text-xs">
                        <div className={`w-2 h-2 rounded-full ${getUsageColor(percentage)}`} />
                        <span className="text-gray-600">{getUsageStatus(percentage)}</span>
              </div>
              </div>
                  )}
            </Card>
              );
            })}
          </div>

          {/* Detailed Usage */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Detailed Usage</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowUsageDetails(!showUsageDetails)}
              >
                {showUsageDetails ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                {showUsageDetails ? "Hide Details" : "Show Details"}
              </Button>
                </div>

            {showUsageDetails && (
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Content Creation</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">AI Content Generated</span>
                      <span className="text-sm font-medium">{usageStats.aiGenerations}</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Scheduled Posts</span>
                      <span className="text-sm font-medium">{usageStats.scheduledPosts}</span>
              </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Viral Predictions</span>
                      <span className="text-sm font-medium">{usageStats.viralPredictions}</span>
              </div>
          </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Analytics & API</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">API Calls</span>
                      <span className="text-sm font-medium">{usageStats.apiCalls}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Analytics Reports</span>
                      <span className="text-sm font-medium">{usageStats.analyticsReports}</span>
                  </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600">Storage Used</span>
                      <span className="text-sm font-medium">{usageStats.storageUsed} GB</span>
            </div>
                  </div>
                </div>
              </div>
            )}
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
                      <div className="flex justify-between">
                      <span className="text-gray-600">Next Billing:</span>
                        <span className="font-medium">
                        {subscription.current_period_end
                          ? formatDate(subscription.current_period_end * 1000)
                          : "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                      <span className="text-gray-600">Customer ID:</span>
                      <span className="font-mono text-sm">
                        {subscription.stripe_customer_id || "N/A"}
                        </span>
                      </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subscription ID:</span>
                      <span className="font-mono text-sm">
                        {subscription.stripe_id || "N/A"}
                        </span>
                      </div>
                  </div>
                </div>
              </Card>

              {/* Payment Methods */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Payment Methods
                </h3>
                <div className="space-y-3">
                  {paymentMethods.map((method) => (
                    <div
                      key={method.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <CreditCard className="w-5 h-5 text-gray-600" />
                        <div>
                          <p className="font-medium">
                            {method.brand.toUpperCase()} •••• {method.last4}
                          </p>
                          <p className="text-sm text-gray-600">
                            Expires {method.exp_month}/{method.exp_year}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {method.is_default && (
                          <Badge variant="secondary">Default</Badge>
                        )}
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                  </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Payment Method
                  </Button>
                </div>
              </Card>

              {/* Billing History */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Billing History
                  </h3>
                <div className="space-y-3">
                  {billingHistory.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                        <div>
                        <p className="font-medium">{item.description}</p>
                        <p className="text-sm text-gray-600">
                          {formatDate(item.created)}
                        </p>
                          </div>
                      <div className="flex items-center gap-3">
                        <span className="font-medium">
                          {formatCurrency(item.amount, item.currency)}
                        </span>
                        <Badge
                          variant={
                            item.status === "paid"
                              ? "default"
                              : item.status === "pending"
                                ? "secondary"
                                : "destructive"
                          }
                        >
                          {item.status}
                        </Badge>
                        {item.invoice_url && (
                          <Button variant="ghost" size="sm">
                            <Download className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </>
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <AlertTriangle className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No Active Subscription
              </h3>
              <p className="text-gray-600 mb-4">
                  You don't have an active subscription. Choose a plan to get started.
              </p>
                <Button asChild>
                <Link href="/pricing">
                  <Crown className="w-4 h-4 mr-2" />
                    Choose a Plan
                </Link>
              </Button>
              </div>
            </Card>
          )}
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
                  description: "Generate viral content with AI",
                },
                {
                  key: "basic_analytics",
                  name: "Basic Analytics",
                  icon: BarChart3,
                  description: "Track your performance",
                },
                {
                  key: "advanced_analytics",
                  name: "Advanced Analytics",
                  icon: TrendingUp,
                  description: "Deep insights and predictions",
                },
                {
                  key: "viral_predictor",
                  name: "Viral Score Predictor",
                  icon: Zap,
                  description: "Predict content performance",
                },
                {
                  key: "auto_scheduling",
                  name: "Auto Scheduling",
                  icon: Clock,
                  description: "Schedule content automatically",
                },
                { 
                  key: "all_platforms", 
                  name: "All Platforms", 
                  icon: Globe,
                  description: "Connect unlimited platforms",
                },
                {
                  key: "priority_support",
                  name: "Priority Support",
                  icon: Shield,
                  description: "Get help faster",
                },
                { 
                  key: "custom_branding", 
                  name: "Custom Branding", 
                  icon: Star,
                  description: "White label solution",
                },
                { 
                  key: "api_access", 
                  name: "API Access", 
                  icon: Settings,
                  description: "Integrate with your tools",
                },
                {
                  key: "dedicated_manager",
                  name: "Dedicated Manager",
                  icon: Users,
                  description: "Personal account manager",
                },
              ].map((feature) => {
                const hasAccess = hasFeatureAccess(subscription, feature.key);
                const Icon = feature.icon;

                return (
                  <div
                    key={feature.key}
                    className={`flex items-center justify-between p-4 rounded-lg border transition-colors ${
                      hasAccess
                        ? "bg-green-50 border-green-200"
                        : "bg-gray-50 border-gray-200"
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon
                        className={`w-5 h-5 ${hasAccess ? "text-green-600" : "text-gray-400"}`}
                      />
                <div>
                        <span
                          className={`font-medium ${hasAccess ? "text-green-900" : "text-gray-600"}`}
                        >
                          {feature.name}
                        </span>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                </div>
              </div>
                    {hasAccess ? (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    ) : (
                      <Lock className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                );
              })}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="upgrades" className="space-y-6">
          {/* Upgrade Options */}
          {upgradeOptions.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upgradeOptions.map((upgrade) => {
                const targetPlan = planDetails[upgrade.to as keyof typeof planDetails];
                
                return (
                  <Card key={upgrade.to} className="p-6 hover:shadow-lg transition-shadow">
                    <div className="text-center mb-6">
                      <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-r ${targetPlan.color} mb-4`}>
                        {targetPlan.icon}
                </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        Upgrade to {targetPlan.name}
                      </h3>
                      <div className="text-3xl font-bold text-gray-900 mb-1">
                        ${upgrade.price}
                      </div>
                      <div className="text-sm text-gray-600">per month</div>
                      {upgrade.savings > 0 && (
                        <Badge variant="secondary" className="mt-2">
                          Save ${upgrade.savings}/month
                        </Badge>
                      )}
              </div>

                    <div className="space-y-3 mb-6">
                      <h4 className="font-medium text-gray-900">New Features:</h4>
                      {upgrade.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Plus className="w-4 h-4 text-green-600" />
                          <span className="text-sm text-gray-700">{feature}</span>
                </div>
                      ))}
                    </div>

                <Button
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
                      asChild
                    >
                      <Link href={`/pricing?plan=${upgrade.to}`}>
                        <Rocket className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </Link>
                </Button>
                  </Card>
                );
              })}
              </div>
          ) : (
            <Card className="p-6">
              <div className="text-center">
                <Crown className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  You're at the Top Tier!
                </h3>
                <p className="text-gray-600">
                  You already have access to all features. Enjoy your Superstar plan!
                </p>
              </div>
            </Card>
          )}

          {/* Plan Comparison */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Plan Comparison
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Feature</th>
                    <th className="text-center py-3 px-4">Free</th>
                    <th className="text-center py-3 px-4">Creator</th>
                    <th className="text-center py-3 px-4">Influencer</th>
                    <th className="text-center py-3 px-4">Superstar</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: "Posts per month", free: "5", creator: "50", influencer: "∞", superstar: "∞" },
                    { feature: "Platform connections", free: "1", creator: "2", influencer: "∞", superstar: "∞" },
                    { feature: "Storage (GB)", free: "1", creator: "5", influencer: "50", superstar: "500" },
                    { feature: "AI generations", free: "10", creator: "100", influencer: "∞", superstar: "∞" },
                    { feature: "Viral predictions", free: "5", creator: "25", influencer: "∞", superstar: "∞" },
                    { feature: "Priority support", free: false, creator: false, influencer: true, superstar: true },
                    { feature: "Custom branding", free: false, creator: false, influencer: false, superstar: true },
                    { feature: "API access", free: false, creator: false, influencer: false, superstar: true },
                    { feature: "Dedicated manager", free: false, creator: false, influencer: false, superstar: true },
                  ].map((row, index) => (
                    <tr key={index} className="border-b">
                      <td className="py-3 px-4 font-medium">{row.feature}</td>
                      <td className="text-center py-3 px-4">
                        {typeof row.free === "boolean" ? (
                          row.free ? <Check className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          row.free
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.creator === "boolean" ? (
                          row.creator ? <Check className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          row.creator
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.influencer === "boolean" ? (
                          row.influencer ? <Check className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          row.influencer
                        )}
                      </td>
                      <td className="text-center py-3 px-4">
                        {typeof row.superstar === "boolean" ? (
                          row.superstar ? <Check className="w-5 h-5 text-green-600" /> : <XCircle className="w-5 h-5 text-gray-400" />
                        ) : (
                          row.superstar
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
