"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  Download,
  RefreshCw,
  Instagram,
  Youtube,
  Music,
  Twitter
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
  plan_status: string | null;
  plan_billing: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface Subscription {
  stripe_id: string;
  user_id: string;
  plan_name: string;
  billing_cycle: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface RevenueTransaction {
  id: string;
  user_id: string;
  platform: string;
  transaction_type: string;
  amount: number;
  currency: string;
  description: string;
  transaction_date: string;
  status: string;
  created_at: string;
}

interface RevenueData {
  current_month: number;
  previous_month: number;
  monthly_goal: number;
  growth_percentage: number;
  top_platform: string;
  top_source: string;
  transactions: RevenueTransaction[];
  breakdown: {
    sponsored_posts: number;
    ad_revenue: number;
    brand_deals: number;
    affiliate: number;
  };
}

interface DashboardRevenueProps {
  userProfile: UserProfile;
  subscription: Subscription | null;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardRevenue({
  userProfile,
  subscription,
  hasFeatureAccess,
}: DashboardRevenueProps) {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createClient();

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const fetchRevenueData = async () => {
    if (!hasFeatureAccess("revenue")) {
      setError("Revenue tracking requires an active subscription");
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      // Fetch revenue transactions from database
      const { data: transactions, error: transactionsError } = await supabase
        .from("revenue_transactions")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .order("transaction_date", { ascending: false })
        .limit(50);

      if (transactionsError) throw transactionsError;

      // Calculate revenue data from transactions
      const now = new Date();
      const currentMonth = now.getMonth();
      const currentYear = now.getFullYear();
      const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
      const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

      const currentMonthTransactions = transactions?.filter((t: RevenueTransaction) => {
        const date = new Date(t.transaction_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }) || [];

      const previousMonthTransactions = transactions?.filter((t: RevenueTransaction) => {
        const date = new Date(t.transaction_date);
        return date.getMonth() === previousMonth && date.getFullYear() === previousYear;
      }) || [];

      const currentMonthRevenue = currentMonthTransactions.reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0);
      const previousMonthRevenue = previousMonthTransactions.reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0);
      const growthPercentage = previousMonthRevenue > 0 
        ? ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100 
        : 0;

      // Calculate breakdown
      const breakdown = {
        sponsored_posts: currentMonthTransactions.filter((t: RevenueTransaction) => t.transaction_type === "sponsored_post").reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0),
        ad_revenue: currentMonthTransactions.filter((t: RevenueTransaction) => t.transaction_type === "ad_revenue").reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0),
        brand_deals: currentMonthTransactions.filter((t: RevenueTransaction) => t.transaction_type === "brand_deal").reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0),
        affiliate: currentMonthTransactions.filter((t: RevenueTransaction) => t.transaction_type === "affiliate").reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0)
      };

      // Find top platform and source
      const platformRevenue = currentMonthTransactions.reduce((acc: Record<string, number>, t: RevenueTransaction) => {
        acc[t.platform] = (acc[t.platform] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const sourceRevenue = currentMonthTransactions.reduce((acc: Record<string, number>, t: RevenueTransaction) => {
        acc[t.transaction_type] = (acc[t.transaction_type] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const topPlatform = Object.keys(platformRevenue).length > 0 
        ? Object.entries(platformRevenue).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
        : "None";

      const topSource = Object.keys(sourceRevenue).length > 0
        ? Object.entries(sourceRevenue).sort(([,a], [,b]) => (b as number) - (a as number))[0][0]
        : "None";

      // Set monthly goal based on plan
      const monthlyGoal = subscription?.plan_name?.toLowerCase() === "superstar" ? 5000 :
                         subscription?.plan_name?.toLowerCase() === "influencer" ? 2000 : 1000;

      const revenueData: RevenueData = {
        current_month: currentMonthRevenue,
        previous_month: previousMonthRevenue,
        monthly_goal: monthlyGoal,
        growth_percentage: growthPercentage,
        top_platform: topPlatform,
        top_source: topSource,
        transactions: transactions || [],
        breakdown
      };

      setRevenueData(revenueData);
    } catch (err) {
      console.error("Revenue fetch error:", err);
      setError(`Failed to load revenue data: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRevenueData();
    setIsRefreshing(false);
    setSuccess("Revenue data refreshed successfully!");
  };

  const handleAddTransaction = async () => {
    // In a real app, this would open a modal to add a transaction
    setError("Transaction management requires platform connections. Connect your social media accounts first.");
  };

  const handleExportData = async () => {
    if (!revenueData) return;

    try {
      const csvData = [
        ["Date", "Platform", "Type", "Amount", "Description"],
        ...revenueData.transactions.map(t => [
          new Date(t.transaction_date).toLocaleDateString(),
          t.platform,
          t.transaction_type,
          `$${t.amount.toFixed(2)}`,
          t.description
        ])
      ];

      const csvContent = csvData.map(row => row.join(",")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `revenue-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess("Revenue data exported successfully!");
    } catch (err) {
      console.error("Export error:", err);
      setError("Failed to export revenue data");
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [userProfile.user_id, hasFeatureAccess]);

  if (!hasFeatureAccess("revenue")) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Revenue Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade Required</h3>
              <p className="text-gray-600 mb-4">
                Revenue tracking is available for Influencer and Superstar plans
              </p>
              <Button onClick={() => window.location.href = "/pricing"}>
                Upgrade Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!revenueData) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-blue-600" />
              Revenue Tracking
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Revenue Data</h3>
              <p className="text-gray-600 mb-4">
                Connect your social media platforms to start tracking revenue
              </p>
              <Button onClick={() => window.location.href = "/dashboard?tab=platforms"}>
                Connect Platforms
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "tiktok":
        return <Music className="w-4 h-4" />;
      case "twitter":
        return <Twitter className="w-4 h-4" />;
      default:
        return <BarChart3 className="w-4 h-4" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "sponsored_post":
        return "Sponsored Post";
      case "ad_revenue":
        return "Ad Revenue";
      case "brand_deal":
        return "Brand Deal";
      case "affiliate":
        return "Affiliate";
      default:
        return type.replace("_", " ").replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Revenue Tracking</h1>
          <p className="text-gray-600 mt-1">
            Monitor your earnings from brand partnerships and sponsored content
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleRefresh} disabled={isRefreshing}>
            {isRefreshing ? (
              <RefreshCw className="w-4 h-4 animate-spin" />
            ) : (
              <RefreshCw className="w-4 h-4" />
            )}
          </Button>
          <Button variant="outline" onClick={handleExportData}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.current_month)}</div>
            <div className="flex items-center text-xs text-muted-foreground">
              {revenueData.growth_percentage >= 0 ? (
                <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
              ) : (
                <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
              )}
              {Math.abs(revenueData.growth_percentage).toFixed(1)}% from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(revenueData.monthly_goal)}</div>
            <div className="flex items-center space-x-2">
              <Progress 
                value={(revenueData.current_month / revenueData.monthly_goal) * 100} 
                className="flex-1" 
              />
              <span className="text-xs text-muted-foreground">
                {((revenueData.current_month / revenueData.monthly_goal) * 100).toFixed(1)}%
              </span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              {getPlatformIcon(revenueData.top_platform)}
              <span className="text-2xl font-bold capitalize">{revenueData.top_platform}</span>
            </div>
            <p className="text-xs text-muted-foreground">Highest revenue source</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Revenue Source</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold capitalize">
              {getTransactionTypeLabel(revenueData.top_source)}
            </div>
            <p className="text-xs text-muted-foreground">Most profitable type</p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Sponsored Posts</span>
                <span className="text-sm text-muted-foreground">
                  {((revenueData.breakdown.sponsored_posts / revenueData.current_month) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(revenueData.breakdown.sponsored_posts)}</div>
              <Progress value={(revenueData.breakdown.sponsored_posts / revenueData.current_month) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Ad Revenue</span>
                <span className="text-sm text-muted-foreground">
                  {((revenueData.breakdown.ad_revenue / revenueData.current_month) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(revenueData.breakdown.ad_revenue)}</div>
              <Progress value={(revenueData.breakdown.ad_revenue / revenueData.current_month) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Brand Deals</span>
                <span className="text-sm text-muted-foreground">
                  {((revenueData.breakdown.brand_deals / revenueData.current_month) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(revenueData.breakdown.brand_deals)}</div>
              <Progress value={(revenueData.breakdown.brand_deals / revenueData.current_month) * 100} />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Affiliate</span>
                <span className="text-sm text-muted-foreground">
                  {((revenueData.breakdown.affiliate / revenueData.current_month) * 100).toFixed(1)}%
                </span>
              </div>
              <div className="text-2xl font-bold">{formatCurrency(revenueData.breakdown.affiliate)}</div>
              <Progress value={(revenueData.breakdown.affiliate / revenueData.current_month) * 100} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <Button variant="outline" size="sm" onClick={handleAddTransaction}>
              <Plus className="w-4 h-4 mr-2" />
              Add Transaction
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {revenueData.transactions.length > 0 ? (
            <div className="space-y-4">
              {revenueData.transactions.slice(0, 10).map((transaction) => (
                <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      {getPlatformIcon(transaction.platform)}
                      <span className="font-medium capitalize">{transaction.platform}</span>
                    </div>
                    <div>
                      <div className="font-medium">{getTransactionTypeLabel(transaction.transaction_type)}</div>
                      <div className="text-sm text-muted-foreground">{transaction.description}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-bold">{formatCurrency(transaction.amount)}</div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(transaction.transaction_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Transactions Yet</h3>
              <p className="text-gray-600 mb-4">
                Start earning revenue by connecting your platforms and creating content
              </p>
              <Button onClick={() => window.location.href = "/dashboard?tab=platforms"}>
                Connect Platforms
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Monetization Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Monetization Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Optimize Your Content Schedule</h4>
              <p className="text-blue-700 text-sm">Post during peak engagement hours to maximize ad revenue</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Diversify Revenue Streams</h4>
              <p className="text-blue-700 text-sm">Combine sponsored content with affiliate marketing and merchandise</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Build Brand Relationships</h4>
              <p className="text-blue-700 text-sm">Long-term partnerships often provide better rates than one-off deals</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 