"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DollarSign, TrendingUp, TrendingDown, Target, Calendar, BarChart3 } from "lucide-react";

interface DashboardRevenueProps {
  userProfile: any;
  subscription: any;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardRevenue({ userProfile, subscription, hasFeatureAccess }: DashboardRevenueProps) {
  // Mock revenue data - in production this would come from real analytics
  const revenueData = {
    currentMonth: 1250,
    previousMonth: 980,
    growth: 27.6,
    topPlatform: "Instagram",
    topContentType: "Sponsored Posts",
    monthlyGoal: 2000,
    progress: 62.5,
  };

  const recentTransactions = [
    { id: 1, platform: "Instagram", amount: 450, type: "Sponsored Post", date: "2024-01-15" },
    { id: 2, platform: "YouTube", amount: 320, type: "Ad Revenue", date: "2024-01-12" },
    { id: 3, platform: "TikTok", amount: 280, type: "Brand Deal", date: "2024-01-10" },
    { id: 4, platform: "Instagram", amount: 200, type: "Affiliate", date: "2024-01-08" },
  ];

  if (!hasFeatureAccess("revenue")) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-green-600" />
              Revenue Tracking
            </CardTitle>
            <CardDescription>
              Track your monetization performance across all platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <DollarSign className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade Required</h3>
              <p className="text-gray-600 mb-4">
                Revenue tracking is available for Influencer and Superstar plans
              </p>
              <Button>Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Revenue Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Month Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.currentMonth}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.growth > 0 ? (
                <span className="text-green-600 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3" />
                  +{revenueData.growth}% from last month
                </span>
              ) : (
                <span className="text-red-600 flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  {revenueData.growth}% from last month
                </span>
              )}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Goal</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">${revenueData.monthlyGoal}</div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full" 
                style={{ width: `${revenueData.progress}%` }}
              ></div>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {revenueData.progress}% complete
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Top Platform</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{revenueData.topPlatform}</div>
            <p className="text-xs text-muted-foreground">
              {revenueData.topContentType}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>Revenue Breakdown</CardTitle>
          <CardDescription>
            Your revenue sources and performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">45%</div>
                <div className="text-sm text-gray-600">Sponsored Posts</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">25%</div>
                <div className="text-sm text-gray-600">Ad Revenue</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">20%</div>
                <div className="text-sm text-gray-600">Brand Deals</div>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <div className="text-2xl font-bold text-orange-600">10%</div>
                <div className="text-sm text-gray-600">Affiliate</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Transactions</CardTitle>
          <CardDescription>
            Your latest revenue-generating activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentTransactions.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="font-medium">{transaction.platform}</div>
                    <div className="text-sm text-gray-500">{transaction.type}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-green-600">+${transaction.amount}</div>
                  <div className="text-sm text-gray-500">{transaction.date}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Monetization Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Monetization Tips</CardTitle>
          <CardDescription>
            Strategies to increase your revenue
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Optimize Your Content Schedule</h4>
                <p className="text-sm text-gray-600">
                  Post during peak engagement hours to maximize ad revenue
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Diversify Revenue Streams</h4>
                <p className="text-sm text-gray-600">
                  Combine sponsored content with affiliate marketing and merchandise
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Build Brand Relationships</h4>
                <p className="text-sm text-gray-600">
                  Long-term partnerships often provide better rates than one-off deals
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 