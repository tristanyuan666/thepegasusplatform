"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Users, 
  Video, 
  Zap, 
  Calendar,
  Target,
  BarChart3,
  DollarSign,
  Instagram,
  Youtube,
  Music
} from "lucide-react";
import Link from "next/link";

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription: string | null;
  niche: string | null;
  tone: string | null;
  content_format: string | null;
  fame_goals: string | null;
  follower_count: number | null;
  viral_score: number | null;
  monetization_forecast: number | null;
  onboarding_completed: boolean | null;
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

interface DashboardHomeProps {
  user: User;
  userProfile: UserProfile;
  subscription: Subscription | null;
  platformConnections: PlatformConnection[];
  analyticsData: AnalyticsData | null;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardHome({
  user,
  userProfile,
  subscription,
  platformConnections,
  analyticsData,
  hasFeatureAccess,
}: DashboardHomeProps) {
  const [isLoading, setIsLoading] = useState(false);

  // Format numbers with K/M suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  // Get platform icon
  const getPlatformIcon = (platform: string) => {
    switch (platform.toLowerCase()) {
      case "instagram":
        return <Instagram className="w-5 h-5" />;
      case "youtube":
        return <Youtube className="w-5 h-5" />;
      case "tiktok":
        return <Music className="w-5 h-5" />;
      default:
        return <Video className="w-5 h-5" />;
    }
  };

  // Calculate viral score color
  const getViralScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  // Get viral score status
  const getViralScoreStatus = (score: number): string => {
    if (score >= 80) return "VIRAL";
    if (score >= 60) return "Trending";
    if (score >= 40) return "Growing";
    return "Needs Work";
  };

  const isPlanActive = subscription && subscription.status === "active";
  const connectedPlatforms = platformConnections.filter(conn => conn.is_active);
  const hasConnectedPlatforms = connectedPlatforms.length > 0;

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Welcome back, {userProfile.full_name || user.email}!
            </h1>
            <p className="text-gray-600 mt-1">
              Ready to create some viral content today?
            </p>
          </div>
          <div className="text-right">
            <Badge 
              variant={isPlanActive ? "default" : "secondary"}
              className="text-sm"
            >
              {subscription?.plan_name || "No Plan"} ({subscription?.billing_cycle || "none"})
            </Badge>
            <p className="text-xs text-gray-500 mt-1">
              {isPlanActive ? "Active" : "Inactive"}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Followers</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatNumber(analyticsData?.total_followers || 0) : "0"}
            </div>
            {hasConnectedPlatforms && analyticsData?.growth_rate && (
              <p className="text-xs text-muted-foreground flex items-center">
                <TrendingUp className="w-3 h-3 mr-1" />
                +{analyticsData.growth_rate.toFixed(1)}% this month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Content Queue</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {analyticsData?.content_count || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              Scheduled posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Viral Score</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${getViralScoreColor(analyticsData?.viral_score || 0)}`}>
              {analyticsData?.viral_score || 0}
            </div>
            <p className="text-xs text-muted-foreground">
              {getViralScoreStatus(analyticsData?.viral_score || 0)}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? formatNumber(analyticsData?.total_views || 0) : "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Across all platforms
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Platform Connections */}
      {hasFeatureAccess("platforms") && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Connected Platforms
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectedPlatforms.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {connectedPlatforms.map((connection) => (
                  <div
                    key={connection.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                  >
                    {getPlatformIcon(connection.platform)}
                    <div>
                      <p className="font-medium text-sm capitalize">
                        {connection.platform}
                      </p>
                      <p className="text-xs text-gray-500">
                        @{connection.platform_username}
                      </p>
                    </div>
                    <Badge variant="outline" className="ml-auto text-xs">
                      Connected
                    </Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No platforms connected
                </h3>
                <p className="text-gray-600 mb-4">
                  Connect your social media accounts to start tracking analytics and auto-posting content.
                </p>
                <Link href="/dashboard?tab=platforms">
                  <Button>
                    Connect Platforms
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {hasFeatureAccess("ai_content") && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/content-hub">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="w-5 h-5 text-blue-600" />
                  Create Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Generate viral content with AI and schedule posts across all platforms.
                </p>
                <Button className="w-full">
                  Start Creating
                </Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {hasFeatureAccess("analytics") && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard?tab=analytics">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <BarChart3 className="w-5 h-5 text-green-600" />
                  View Analytics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Track your performance, engagement rates, and growth across all platforms.
                </p>
                <Button variant="outline" className="w-full">
                  View Insights
                </Button>
              </CardContent>
            </Link>
          </Card>
        )}

        {hasFeatureAccess("revenue") && (
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/dashboard?tab=revenue">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  Track Revenue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Monitor your earnings from brand partnerships and sponsored content.
                </p>
                <Button variant="outline" className="w-full">
                  View Earnings
                </Button>
              </CardContent>
            </Link>
          </Card>
        )}
      </div>

      {/* Recent Activity */}
      {hasConnectedPlatforms && (
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analyticsData?.content_count ? (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <p className="text-sm font-medium">Content Performance</p>
                      <p className="text-xs text-gray-600">
                        {analyticsData.content_count} posts published this month
                      </p>
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {analyticsData.engagement_rate.toFixed(1)}% engagement
                  </Badge>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Calendar className="w-8 h-8 mx-auto mb-2" />
                  <p>No recent activity</p>
                  <p className="text-sm">Start creating content to see your activity here</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
