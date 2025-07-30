"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  Twitter,
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
      const platformRevenue = currentMonthTransactions.reduce((acc, t) => {
        acc[t.platform] = (acc[t.platform] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const sourceRevenue = currentMonthTransactions.reduce((acc, t) => {
        acc[t.transaction_type] = (acc[t.transaction_type] || 0) + t.amount;
        return acc;
      }, {} as Record<string, number>);

      const topPlatform = Object.entries(platformRevenue).sort(([,a], [,b]) => b - a)[0]?.[0] || "None";
      const topSource = Object.entries(sourceRevenue).sort(([,a], [,b]) => b - a)[0]?.[0] || "None";

      // Generate trends data
      const trends = Array.from({ length: 30 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayTransactions = transactions?.filter(t => {
          const tDate = new Date(t.transaction_date);
          return tDate.toDateString() === date.toDateString();
        }) || [];
        
        return {
          date: date.toISOString().split('T')[0],
          revenue: dayTransactions.reduce((sum, t) => sum + t.amount, 0),
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
      case "twitter": return <Twitter className="w-4 h-4" />;
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
    if (!revenueData) return null;
    
    const insights = {
      topPerformingPlatform: revenueData.top_platform,
      topRevenueSource: revenueData.top_source,
      growthRate: revenueData.growth_percentage,
      goalProgress: (revenueData.current_month / revenueData.monthly_goal) * 100,
      projectedAnnualRevenue: revenueData.current_month * 12,
      averageTransactionValue: revenueData.transactions.length > 0 
        ? revenueData.transactions.reduce((sum: number, t: RevenueTransaction) => sum + t.amount, 0) / revenueData.transactions.length 
        : 0,
      transactionFrequency: revenueData.transactions.length / 30, // per day
    };
    
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
          <Button onClick={handleAddTransaction}>
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
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
          {/* Revenue Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Current Month</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(revenueData.current_month)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {revenueData.growth_percentage >= 0 ? (
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      ) : (
                        <TrendingDown className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${revenueData.growth_percentage >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {Math.abs(revenueData.growth_percentage).toFixed(1)}% from last month
                      </span>
                    </div>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Monthly Goal</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {formatCurrency(revenueData.monthly_goal)}
                    </p>
                    <div className="mt-2">
                      <Progress 
                        value={(revenueData.current_month / revenueData.monthly_goal) * 100} 
                        className="h-2"
                      />
                      <p className="text-xs text-gray-600 mt-1">
                        {((revenueData.current_month / revenueData.monthly_goal) * 100).toFixed(1)}% complete
                      </p>
                    </div>
                  </div>
                  <Target className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Platform</p>
                    <p className="text-2xl font-bold text-gray-900 capitalize">
                      {revenueData.top_platform}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      {getPlatformIcon(revenueData.top_platform)}
                      <span className="text-sm text-gray-600">highest revenue</span>
                    </div>
                  </div>
                  <Share2 className="w-8 h-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Top Source</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {getTransactionTypeLabel(revenueData.top_source)}
                    </p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm text-gray-600">best performing</span>
                    </div>
                  </div>
                  <Award className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="transactions">Transactions</TabsTrigger>
              <TabsTrigger value="breakdown">Breakdown</TabsTrigger>
              <TabsTrigger value="projections">Projections</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Revenue Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Breakdown</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-sm">Sponsored Posts</span>
                        </div>
                        <span className="font-medium">{formatCurrency(revenueData.breakdown.sponsored_posts)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                          <span className="text-sm">Ad Revenue</span>
                        </div>
                        <span className="font-medium">{formatCurrency(revenueData.breakdown.ad_revenue)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                          <span className="text-sm">Brand Deals</span>
                        </div>
                        <span className="font-medium">{formatCurrency(revenueData.breakdown.brand_deals)}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                          <span className="text-sm">Affiliate</span>
                        </div>
                        <span className="font-medium">{formatCurrency(revenueData.breakdown.affiliate)}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Trends</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {revenueData.trends.slice(-7).map((trend, index) => (
                        <div key={index} className="flex items-center justify-between">
                          <span className="text-sm text-gray-600">
                            {new Date(trend.date).toLocaleDateString()}
                          </span>
                          <div className="flex items-center gap-4">
                            <span className="text-sm">{trend.transactions} transactions</span>
                            <span className="font-medium">{formatCurrency(trend.revenue)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="transactions" className="space-y-6">
              {/* Transactions List */}
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Recent Transactions</CardTitle>
                    <div className="flex items-center gap-2">
                      <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="week">This Week</SelectItem>
                          <SelectItem value="month">This Month</SelectItem>
                          <SelectItem value="quarter">This Quarter</SelectItem>
                          <SelectItem value="year">This Year</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Select value={sortBy} onValueChange={setSortBy}>
                        <SelectTrigger className="w-40">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="amount">Amount</SelectItem>
                          <SelectItem value="platform">Platform</SelectItem>
                          <SelectItem value="type">Type</SelectItem>
                        </SelectContent>
                      </Select>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                      >
                        {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {getFilteredAndSortedTransactions().map((transaction) => (
                      <div key={transaction.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(transaction.platform)}
                            <span className="font-medium capitalize">{transaction.platform}</span>
                          </div>
                          <div>
                            <p className="font-medium">{getTransactionTypeLabel(transaction.transaction_type)}</p>
                            <p className="text-sm text-gray-600">{transaction.description}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-green-600">{formatCurrency(transaction.amount)}</p>
                          <p className="text-sm text-gray-600">
                            {new Date(transaction.transaction_date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="breakdown" className="space-y-6">
              {/* Detailed Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Platform Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(revenueData.transactions.reduce((acc, t) => {
                        acc[t.platform] = (acc[t.platform] || 0) + t.amount;
                        return acc;
                      }, {} as Record<string, number>)).map(([platform, amount]) => (
                        <div key={platform} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getPlatformIcon(platform)}
                            <span className="capitalize">{platform}</span>
                          </div>
                          <span className="font-medium">{formatCurrency(amount)}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Revenue Sources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(revenueData.transactions.reduce((acc, t) => {
                        acc[t.transaction_type] = (acc[t.transaction_type] || 0) + t.amount;
                        return acc;
                      }, {} as Record<string, number>)).map(([type, amount]) => (
                        <div key={type} className="flex items-center justify-between">
                          <span className="capitalize">{getTransactionTypeLabel(type)}</span>
                          <span className="font-medium">{formatCurrency(amount)}</span>
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