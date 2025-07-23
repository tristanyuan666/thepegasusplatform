"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  DollarSign, 
  TrendingUp, 
  BarChart3, 
  Calendar,
  ExternalLink,
  AlertCircle
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

  // Calculate estimated revenue based on followers and engagement
  const calculateEstimatedRevenue = () => {
    if (!analyticsData || !hasConnectedPlatforms) return 0;
    
    // Rough estimate: $0.01 per follower per month + engagement bonus
    const baseRevenue = analyticsData.total_followers * 0.01;
    const engagementBonus = analyticsData.engagement_rate * 10;
    return baseRevenue + engagementBonus;
  };

  const estimatedRevenue = calculateEstimatedRevenue();

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
              Track your earnings from brand partnerships and sponsored content
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-green-600 border-green-600">
              <DollarSign className="w-3 h-3 mr-1" />
              Monetization Active
            </Badge>
          </div>
        </div>
      </div>

      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {hasConnectedPlatforms ? formatCurrency(analyticsData?.revenue || 0) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              All time earnings
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Estimate</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatCurrency(estimatedRevenue) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Based on current metrics
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Brand Partnerships</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? "3" : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Active partnerships
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Per Post</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatCurrency(estimatedRevenue / 10) : "$0.00"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average sponsored post
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Revenue Sources</CardTitle>
          </CardHeader>
          <CardContent>
            {hasConnectedPlatforms ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Sponsored Posts</p>
                      <p className="text-sm text-gray-600">Brand collaborations</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(estimatedRevenue * 0.6)}</p>
                    <p className="text-xs text-gray-500">60%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Affiliate Marketing</p>
                      <p className="text-sm text-gray-600">Product commissions</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(estimatedRevenue * 0.25)}</p>
                    <p className="text-xs text-gray-500">25%</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-purple-600 rounded-full"></div>
                    <div>
                      <p className="font-medium">Digital Products</p>
                      <p className="text-sm text-gray-600">Courses & guides</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{formatCurrency(estimatedRevenue * 0.15)}</p>
                    <p className="text-xs text-gray-500">15%</p>
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

        {/* Platform Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Platform Performance</CardTitle>
          </CardHeader>
          <CardContent>
            {hasConnectedPlatforms ? (
              <div className="space-y-4">
                {connectedPlatforms.map((connection) => (
                  <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <span className="text-sm font-medium capitalize">
                          {connection.platform.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium capitalize">{connection.platform}</p>
                        <p className="text-sm text-gray-600">@{connection.platform_username}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{formatCurrency(estimatedRevenue / connectedPlatforms.length)}</p>
                      <p className="text-xs text-gray-500">Monthly</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No platforms connected</p>
                <p className="text-sm">Connect social media accounts to see performance</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monetization Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Monetization Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <DollarSign className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Rate Calculator</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Calculate your worth based on followers and engagement
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Calculate Rate
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <ExternalLink className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium">Brand Partnerships</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Find and connect with relevant brands
              </p>
              <Button variant="outline" size="sm" className="w-full">
                Find Brands
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
                <h3 className="font-medium">Revenue Analytics</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Track earnings trends and optimize performance
              </p>
              <Button variant="outline" size="sm" className="w-full">
                View Analytics
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Monetization Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Optimize your content for engagement</p>
                <p className="text-sm text-gray-600">Higher engagement rates lead to better brand deals</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Build authentic relationships with brands</p>
                <p className="text-sm text-gray-600">Long-term partnerships are more valuable than one-off posts</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Diversify your revenue streams</p>
                <p className="text-sm text-gray-600">Don't rely solely on sponsored content</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 