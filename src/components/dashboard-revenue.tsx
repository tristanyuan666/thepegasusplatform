"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  Loader2,
  Filter,
  SortAsc,
  SortDesc,
  PieChart,
  LineChart,
  Activity,
  Zap,
  Star,
  Award,
  Trophy,
  Crown,
  Gift,
  Sparkles,
  Clock,
  Users,
  Share2,
  Heart,
  MessageCircle,
  ExternalLink,
} from "lucide-react";
import XIcon from "./x-icon";
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
  trends: {
    date: string;
    revenue: number;
    transactions: number;
  }[];
  projections: {
    next_month: number;
    next_quarter: number;
    next_year: number;
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
  const [activeTab, setActiveTab] = useState("overview");
  const [filterPeriod, setFilterPeriod] = useState("month");
  const [sortBy, setSortBy] = useState("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  
  const supabase = createClient();

  useEffect(() => {
    fetchRevenueData();
  }, [userProfile.user_id]);

  const fetchRevenueData = async () => {
    if (!userProfile.user_id) return;
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch real revenue data from database
      const { data: transactions, error: transactionsError } = await supabase
        .from("revenue_transactions")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .order("transaction_date", { ascending: false });

      if (transactionsError) throw transactionsError;

      // Calculate revenue metrics
      const currentMonth = new Date().getMonth();
      const currentYear = new Date().getFullYear();
      
      const currentMonthTransactions = transactions?.filter((t: RevenueTransaction) => {
        const date = new Date(t.transaction_date);
        return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
      }) || [];

      const previousMonthTransactions = transactions?.filter((t: RevenueTransaction) => {
        const date = new Date(t.transaction_date);
        const prevMonth = currentMonth === 0 ? 11 : currentMonth - 1;
        const prevYear = currentMonth === 0 ? currentYear - 1 : currentYear;
        return date.getMonth() === prevMonth && date.getFullYear() === prevYear;
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
        affiliate: currentMonthTransactions.filter((t: RevenueTransaction) => t.transaction_type === "affiliate").reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0),
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

      const topPlatform = Object.entries(platformRevenue).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || "None";
      const topSource = Object.entries(sourceRevenue).sort(([,a], [,b]) => (b as number) - (a as number))[0]?.[0] || "None";

      // Generate trends data
      const trends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayTransactions = transactions?.filter((t: RevenueTransaction) => {
          const tDate = new Date(t.transaction_date);
          return tDate.toDateString() === date.toDateString();
        }) || [];
        
        return {
          date: date.toISOString().split('T')[0],
          revenue: dayTransactions.reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0),
          transactions: dayTransactions.length,
        };
      }).reverse();

      // Calculate projections
      const avgDailyRevenue = trends.slice(-7).reduce((sum, t) => sum + t.revenue, 0) / 7;
      const nextMonth = avgDailyRevenue * 30;
      const nextQuarter = nextMonth * 3;
      const nextYear = nextMonth * 12;

      const revenueData: RevenueData = {
        current_month: currentMonthRevenue,
        previous_month: previousMonthRevenue,
        monthly_goal: 5000, // Default goal, could be user-configurable
        growth_percentage: growthPercentage,
        top_platform: topPlatform,
        top_source: topSource,
        transactions: transactions || [],
        breakdown,
        trends,
        projections: {
          next_month: nextMonth,
          next_quarter: nextQuarter,
          next_year: nextYear,
        },
      };

      setRevenueData(revenueData);
    } catch (error) {
      console.error("Error fetching revenue data:", error);
      setError("Failed to load revenue data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await fetchRevenueData();
    setIsRefreshing(false);
  };

  const handleAddTransaction = async () => {
    // This would open a modal or navigate to a transaction form
    setSuccess("Transaction form would open here");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleExportData = async () => {
    if (!revenueData) return;
    
    try {
      const csvContent = generateCSV(revenueData.transactions);
      const blob = new Blob([csvContent], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `revenue-data-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
      
      setSuccess("Revenue data exported successfully");
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error exporting data:", error);
      setError("Failed to export data");
    }
  };

  const generateCSV = (transactions: RevenueTransaction[]) => {
    const headers = ["Date", "Platform", "Type", "Amount", "Currency", "Description", "Status"];
    const rows = transactions.map(t => [
      t.transaction_date,
      t.platform,
      t.transaction_type,
      t.amount,
      t.currency,
      t.description,
      t.status,
    ]);
    
    return [headers, ...rows].map(row => row.join(",")).join("\n");
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram": return <Instagram className="w-4 h-4" />;
      case "youtube": return <Youtube className="w-4 h-4" />;
      case "tiktok": return <Music className="w-4 h-4" />;
      case "x": return <XIcon className="w-4 h-4" />;
      default: return <Share2 className="w-4 h-4" />;
    }
  };

  const getTransactionTypeLabel = (type: string) => {
    switch (type) {
      case "sponsored_post": return "Sponsored Post";
      case "ad_revenue": return "Ad Revenue";
      case "brand_deal": return "Brand Deal";
      case "affiliate": return "Affiliate";
      case "donation": return "Donation";
      case "subscription": return "Subscription";
      case "merchandise": return "Merchandise";
      case "course_sales": return "Course Sales";
      case "consulting": return "Consulting";
      case "speaking": return "Speaking";
      case "licensing": return "Licensing";
      default: return type.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
    }
  };

  const getRevenueInsights = () => {
    if (!revenueData) return [];
    
    const insights = [
      {
        title: "Increase Your Monthly Revenue",
        description: "Review your top-performing platforms and sources to identify opportunities for growth.",
        icon: <Sparkles className="w-6 h-6 text-blue-600" />,
        color: "bg-blue-100",
      },
      {
        title: "Optimize Ad Spend",
        description: "Analyze your ad revenue and identify which platforms are generating the most clicks and conversions.",
        icon: <Zap className="w-6 h-6 text-purple-600" />,
        color: "bg-purple-100",
      },
      {
        title: "Expand Your Brand Partnerships",
        description: "Leverage your brand deals and sponsored posts to increase your monthly revenue.",
        icon: <Award className="w-6 h-6 text-green-600" />,
        color: "bg-green-100",
      },
    ];
    
    return insights;
  };

  const getFilteredAndSortedTransactions = () => {
    if (!revenueData) return [];
    
    let filtered = revenueData.transactions;
    
    // Filter by period
    const now = new Date();
    const filterDate = new Date();
    
    switch (filterPeriod) {
      case "week":
        filterDate.setDate(now.getDate() - 7);
        break;
      case "month":
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case "quarter":
        filterDate.setMonth(now.getMonth() - 3);
        break;
      case "year":
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    filtered = filtered.filter(t => new Date(t.transaction_date) >= filterDate);
    
    // Sort transactions
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "date":
          aValue = new Date(a.transaction_date);
          bValue = new Date(b.transaction_date);
          break;
        case "amount":
          aValue = a.amount;
          bValue = b.amount;
          break;
        case "platform":
          aValue = a.platform;
          bValue = b.platform;
          break;
        case "type":
          aValue = a.transaction_type;
          bValue = b.transaction_type;
          break;
        default:
          aValue = new Date(a.transaction_date);
          bValue = new Date(b.transaction_date);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  if (!hasFeatureAccess("revenue")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Revenue Analytics Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access revenue tracking and analytics.
            </p>
            <Button onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Revenue Analytics</h2>
          <p className="text-gray-600">Track your earnings and monetization performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button
            variant="outline"
            onClick={handleExportData}
            disabled={!revenueData}
          >
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Success/Error Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      {revenueData && (
        <>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2 h-12 bg-gray-50 border border-gray-200 rounded-lg p-1">
              <TabsTrigger 
                value="overview" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="font-medium">Overview</span>
              </TabsTrigger>
              <TabsTrigger 
                value="projections" 
                className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
              >
                <TrendingUp className="w-4 h-4" />
                <span className="font-medium">Projections</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8 mt-8">
              {/* Revenue Overview */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Overview</h3>
                  <span className="text-sm text-gray-500">This month's performance</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <DollarSign className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Total Revenue</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(revenueData?.current_month || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {revenueData?.growth_percentage >= 0 ? (
                          <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                          <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={`text-sm font-medium ${
                          revenueData?.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {revenueData?.growth_percentage >= 0 ? '+' : ''}{revenueData?.growth_percentage?.toFixed(1) || 0}%
                        </span>
                        <span className="text-sm text-gray-600">vs last month</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Target className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Monthly Goal</p>
                          <p className="text-2xl font-bold text-gray-900">
                            {formatCurrency(revenueData?.monthly_goal || 0)}
                          </p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Progress</span>
                          <span className="font-medium text-gray-900">
                            {revenueData?.monthly_goal ? Math.round((revenueData.current_month / revenueData.monthly_goal) * 100) : 0}%
                          </span>
                        </div>
                        <Progress 
                          value={revenueData?.monthly_goal ? (revenueData.current_month / revenueData.monthly_goal) * 100 : 0} 
                          className="w-full" 
                        />
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <BarChart3 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Top Platform</p>
                          <p className="text-2xl font-bold text-gray-900 capitalize">
                            {revenueData?.top_platform || 'N/A'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Revenue source</span>
                        <span className="text-sm font-medium text-gray-900 capitalize">
                          {revenueData?.top_source || 'N/A'}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Revenue Breakdown */}
              {revenueData?.breakdown && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Revenue Breakdown</h3>
                    <span className="text-sm text-gray-500">By source</span>
                  </div>
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Instagram className="w-4 h-4 text-blue-600" />
                            <span className="font-medium text-blue-900">Sponsored Posts</span>
                          </div>
                          <p className="text-2xl font-bold text-blue-900">
                            {formatCurrency(revenueData.breakdown?.sponsored_posts || 0)}
                          </p>
                          <p className="text-sm text-blue-700">Brand partnerships</p>
                        </div>
                        
                        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Youtube className="w-4 h-4 text-green-600" />
                            <span className="font-medium text-green-900">Ad Revenue</span>
                          </div>
                          <p className="text-2xl font-bold text-green-900">
                            {formatCurrency(revenueData.breakdown?.ad_revenue || 0)}
                          </p>
                          <p className="text-sm text-green-700">Platform ads</p>
                        </div>
                        
                        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Star className="w-4 h-4 text-purple-600" />
                            <span className="font-medium text-purple-900">Brand Deals</span>
                          </div>
                          <p className="text-2xl font-bold text-purple-900">
                            {formatCurrency(revenueData.breakdown?.brand_deals || 0)}
                          </p>
                          <p className="text-sm text-purple-700">Direct partnerships</p>
                        </div>
                        
                        <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                          <div className="flex items-center gap-2 mb-2">
                            <Share2 className="w-4 h-4 text-orange-600" />
                            <span className="font-medium text-orange-900">Affiliate</span>
                          </div>
                          <p className="text-2xl font-bold text-orange-900">
                            {formatCurrency(revenueData.breakdown?.affiliate || 0)}
                          </p>
                          <p className="text-sm text-orange-700">Commission sales</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Revenue Insights */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">Revenue Insights</h3>
                  <span className="text-sm text-gray-500">Actionable tips</span>
                </div>
                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      {getRevenueInsights().map((insight, index) => (
                        <div key={index} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
                          <div className={`p-2 rounded-lg ${insight.color}`}>
                            {insight.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                            <p className="text-sm text-gray-600">{insight.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="projections" className="space-y-6">
              {/* Revenue Projections */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-600" />
                      Next Month
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">
                        {formatCurrency(revenueData.projections.next_month)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Projected revenue</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-purple-600" />
                      Next Quarter
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">
                        {formatCurrency(revenueData.projections.next_quarter)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Projected revenue</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      Next Year
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">
                        {formatCurrency(revenueData.projections.next_year)}
                      </p>
                      <p className="text-sm text-gray-600 mt-2">Projected revenue</p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  );
} 