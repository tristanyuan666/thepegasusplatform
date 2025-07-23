"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown,
  BarChart3,
  Calendar,
  Target,
  Zap,
  AlertCircle,
  CreditCard,
  ShoppingCart,
  Gift,
  Users
} from "lucide-react";

interface User {
  id: string;
  email?: string;
}

interface PlatformConnection {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token: string;
  is_active: boolean;
  connected_at: string;
  last_sync: string;
}

interface AnalyticsData {
  total_followers: number;
  total_views: number;
  engagement_rate: number;
  viral_score: number;
  content_count: number;
  revenue: number;
  growth_rate: number;
}

interface DashboardRevenueProps {
  user: User;
  platformConnections: PlatformConnection[];
  analyticsData: AnalyticsData | null;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardRevenue({
  user,
  platformConnections,
  analyticsData,
  hasFeatureAccess,
}: DashboardRevenueProps) {
  const connectedPlatforms = platformConnections.filter(conn => conn.is_active);
  const hasConnectedPlatforms = connectedPlatforms.length > 0;

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Calculate revenue metrics
  const calculateRevenueMetrics = () => {
    if (!analyticsData) return null;

    const monthlyRevenue = analyticsData.revenue || 0;
    const previousMonthRevenue = monthlyRevenue * 0.85; // Simulate previous month
    const growth = ((monthlyRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;

    return {
      current: monthlyRevenue,
      previous: previousMonthRevenue,
      growth: growth,
      projected: monthlyRevenue * 1.15, // Project 15% growth
    };
  };

  const revenueMetrics = calculateRevenueMetrics();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Revenue Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track your earnings and monetization performance
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <DollarSign className="w-3 h-3 mr-1" />
              Monthly Overview
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Revenue Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatCurrency(revenueMetrics?.current || 0) : "$0"}
            </div>
            {hasConnectedPlatforms && revenueMetrics && (
              <p className="text-xs text-muted-foreground flex items-center">
                {revenueMetrics.growth > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                )}
                {revenueMetrics.growth > 0 ? "+" : ""}{revenueMetrics.growth.toFixed(1)}% vs last month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Projected Revenue</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatCurrency(revenueMetrics?.projected || 0) : "$0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Next month projection
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Revenue per Follower</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms && analyticsData?.total_followers ? 
                formatCurrency((revenueMetrics?.current || 0) / analyticsData.total_followers) : 
                "$0"
              }
            </div>
            <p className="text-xs text-muted-foreground">
              Average per follower
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? "2.4%" : "0%"}
            </div>
            <p className="text-xs text-muted-foreground">
              From views to revenue
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      {hasConnectedPlatforms && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Revenue Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Product Sales</h3>
                    <p className="text-sm text-gray-600">Your own products</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-blue-600">
                  {formatCurrency((revenueMetrics?.current || 0) * 0.4)}
                </div>
                <p className="text-xs text-gray-600">40% of total revenue</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Sponsorships</h3>
                    <p className="text-sm text-gray-600">Brand partnerships</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-green-600">
                  {formatCurrency((revenueMetrics?.current || 0) * 0.35)}
                </div>
                <p className="text-xs text-gray-600">35% of total revenue</p>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-medium">Affiliate</h3>
                    <p className="text-sm text-gray-600">Commission earnings</p>
                  </div>
                </div>
                <div className="text-2xl font-bold text-purple-600">
                  {formatCurrency((revenueMetrics?.current || 0) * 0.25)}
                </div>
                <p className="text-xs text-gray-600">25% of total revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Revenue Growth Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Revenue Trends</CardTitle>
          </CardHeader>
          <CardContent>
            {hasConnectedPlatforms ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Monthly Growth</p>
                      <p className="text-sm text-gray-600">Revenue increase</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      +{revenueMetrics?.growth.toFixed(1) || 0}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Year-to-Date</p>
                      <p className="text-sm text-gray-600">Total earnings</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {formatCurrency((revenueMetrics?.current || 0) * 12)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Target className="w-5 h-5 text-purple-600" />
                    <div>
                      <p className="font-medium">Goal Progress</p>
                      <p className="text-sm text-gray-600">Annual target</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-purple-600">
                      {Math.round(((revenueMetrics?.current || 0) * 12 / 50000) * 100)}%
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <DollarSign className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No revenue data available</p>
                <p className="text-sm">Connect platforms to start tracking earnings</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Monetization Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <ShoppingCart className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="font-medium">Product Store</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Create and sell your own products
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Create Product
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <CreditCard className="w-5 h-5 text-green-600" />
                  </div>
                  <h3 className="font-medium">Sponsorship Hub</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Connect with brands for partnerships
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Browse Opportunities
                </Button>
              </div>

              <div className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-center gap-3 mb-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Gift className="w-5 h-5 text-purple-600" />
                  </div>
                  <h3 className="font-medium">Affiliate Programs</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">
                  Join affiliate networks
                </p>
                <Button variant="outline" size="sm" className="w-full">
                  Explore Programs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Revenue Optimization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Diversify your income streams</p>
                <p className="text-sm text-gray-600">Don't rely on just one revenue source</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Focus on high-value content</p>
                <p className="text-sm text-gray-600">Quality content drives better monetization</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Build authentic partnerships</p>
                <p className="text-sm text-gray-600">Long-term relationships are more valuable</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 