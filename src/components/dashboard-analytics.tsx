"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  BarChart3,
  Calendar,
  Target,
  AlertCircle,
  RefreshCw,
  Download,
  Filter,
  Settings,
  Loader2,
  FileText,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DashboardAnalyticsProps {
  user: any;
  platformConnections: any[];
  analyticsData: any;
  hasFeatureAccess: (feature: string) => boolean;
}

interface RealAnalyticsData {
  total_followers: number;
  total_views: number;
  engagement_rate: number;
  viral_score: number;
  content_count: number;
  revenue: number;
  growth_rate: number;
  platform_breakdown: {
    [platform: string]: {
      followers: number;
      engagement: number;
      posts: number;
      views: number;
    };
  };
  recent_performance: {
    date: string;
    views: number;
    engagement: number;
    viral_score: number;
  }[];
}

export default function DashboardAnalytics({
  user,
  platformConnections,
  analyticsData,
  hasFeatureAccess,
}: DashboardAnalyticsProps) {
  const [realAnalytics, setRealAnalytics] = useState<RealAnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [dateRange, setDateRange] = useState("30d");
  const [isScheduling, setIsScheduling] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    loadRealAnalytics();
  }, [user?.id, dateRange]);

  const loadRealAnalytics = async () => {
    if (!user?.id) return;
    
    try {
    setIsLoading(true);
    setError(null);
    
      // Fetch real analytics data from multiple sources
      const [analyticsResult, platformData, contentData] = await Promise.all([
        // Get analytics from database
        supabase
        .from("analytics")
        .select("*")
        .eq("user_id", user.id)
          .gte("date", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order("date", { ascending: true }),
        
        // Get platform connections for real data
        supabase
          .from("platform_connections")
          .select("*")
          .eq("user_id", user.id)
          .eq("is_active", true),
        
        // Get content performance data
        supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
          .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
          .order("created_at", { ascending: false })
      ]);

      if (analyticsResult.error) throw analyticsResult.error;
      if (platformData.error) throw platformData.error;
      if (contentData.error) throw contentData.error;

      // Process real analytics data
      const analytics = analyticsResult.data || [];
      const platforms = platformData.data || [];
      const content = contentData.data || [];

      // Calculate total followers from real platform connections
      const totalFollowers = platforms.reduce((sum: number, platform: any) => {
        const connection = platformConnections.find(conn => conn.platform === platform.platform);
        return sum + (connection?.follower_count || 0);
      }, 0);

      const totalViews = content.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
      const engagementRate = content.length > 0 
        ? content.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / content.length 
        : 0;

      // Calculate growth rate
      const recentContent = content.filter((item: any) => 
        new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      );
      const previousContent = content.filter((item: any) => {
        const date = new Date(item.created_at);
        const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        return date <= weekAgo && date > twoWeeksAgo;
      });

      const recentViews = recentContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
      const previousViews = previousContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
      const growthRate = previousViews > 0 ? ((recentViews - previousViews) / previousViews) * 100 : 0;

      // Build platform breakdown with real data
      const platformBreakdown = platforms.reduce((acc: any, platform: any) => {
        // Get real platform data from connections
        const connection = platformConnections.find(conn => conn.platform === platform.platform);
        
        if (connection && connection.is_active) {
          // Calculate real metrics based on content performance
          const platformContent = content.filter((item: any) => item.platform === platform.platform);
          const totalViews = platformContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
          const avgEngagement = platformContent.length > 0 
            ? platformContent.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / platformContent.length 
            : 0;
          
          acc[platform.platform] = {
            followers: connection.follower_count || 0,
            engagement: avgEngagement,
            posts: platformContent.length,
            views: totalViews
          };
        } else {
          // Platform not connected
          acc[platform.platform] = {
            followers: 0,
            engagement: 0,
            posts: 0,
            views: 0
          };
        }
        return acc;
      }, {} as any);

      // Generate recent performance data
      const recentPerformance = Array.from({ length: 7 }, (_, i) => {
        const date = new Date();
        date.setDate(date.getDate() - i);
        const dayContent = content.filter((item: any) => {
          const itemDate = new Date(item.created_at);
          return itemDate.toDateString() === date.toDateString();
        });
        
        return {
          date: date.toISOString().split('T')[0],
          views: dayContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0),
          engagement: dayContent.length > 0 
            ? dayContent.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / dayContent.length 
            : 0,
          viral_score: dayContent.length > 0 
            ? dayContent.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / dayContent.length 
            : 0
        };
      }).reverse();

      const realAnalyticsData: RealAnalyticsData = {
        total_followers: totalFollowers,
        total_views: totalViews,
        engagement_rate: engagementRate,
        viral_score: content.length > 0 
          ? content.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / content.length 
          : 0,
        content_count: content.length,
        revenue: 0, // Would come from revenue tracking
        growth_rate: growthRate,
        platform_breakdown: platformBreakdown,
        recent_performance: recentPerformance
      };

      setRealAnalytics(realAnalyticsData);
    } catch (error) {
      console.error("Error loading real analytics:", error);
      setError("Failed to load analytics data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const processAnalyticsData = (
    analytics: any[],
    content: any[],
    connections: any[]
  ): RealAnalyticsData => {
    // Calculate totals
    const totalFollowers = connections.reduce((sum, conn) => sum + (conn.follower_count || 0), 0);
    const totalViews = analytics.reduce((sum, item) => sum + (item.metric_value || 0), 0);
    const totalContent = content.length;
    
    // Calculate engagement rate
    const totalEngagement = analytics
      .filter(item => item.metric_type === "engagement")
      .reduce((sum, item) => sum + (item.metric_value || 0), 0);
    const engagementRate = totalFollowers > 0 ? (totalEngagement / totalFollowers) * 100 : 0;
    
    // Calculate viral score
    const viralScore = Math.min(100, Math.max(0, engagementRate * 2 + (totalViews / 1000)));
    
    // Calculate growth rate
    const recentFollowers = analytics
      .filter(item => item.metric_type === "followers")
      .slice(-7)
      .reduce((sum, item) => sum + (item.metric_value || 0), 0);
    const growthRate = totalFollowers > 0 ? (recentFollowers / totalFollowers) * 100 : 0;
    
    // Process platform breakdown
    const platformBreakdown: any = {};
    connections.forEach(conn => {
      platformBreakdown[conn.platform] = {
        followers: conn.follower_count || 0,
        engagement: 0,
        posts: content.filter(c => c.platform === conn.platform).length,
        views: 0,
      };
    });
    
    // Add analytics data to platform breakdown
    analytics.forEach(item => {
      if (platformBreakdown[item.platform]) {
        if (item.metric_type === "engagement") {
          platformBreakdown[item.platform].engagement += item.metric_value || 0;
        } else if (item.metric_type === "views") {
          platformBreakdown[item.platform].views += item.metric_value || 0;
        }
      }
    });
    
    // Process recent performance
    const recentPerformance = analytics
      .filter(item => item.metric_type === "views")
      .slice(-7)
      .map(item => ({
        date: item.date,
        views: item.metric_value || 0,
        engagement: 0,
        viral_score: 0,
      }));
    
    return {
      total_followers: totalFollowers,
      total_views: totalViews,
      engagement_rate: engagementRate,
      viral_score: viralScore,
      content_count: totalContent,
      revenue: 0, // Will be calculated from monetization data
      growth_rate: growthRate,
      platform_breakdown: platformBreakdown,
      recent_performance: recentPerformance,
    };
  };

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await loadRealAnalytics();
    setIsRefreshing(false);
  };

  const handleScheduleReports = async () => {
    setIsScheduling(true);
    try {
      // Implement report scheduling logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Add success notification
    } catch (error) {
      console.error("Error scheduling reports:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getViralScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Viral</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Trending</Badge>;
    if (score >= 40) return <Badge className="bg-orange-100 text-orange-800">Growing</Badge>;
    return <Badge className="bg-red-100 text-red-800">Starting</Badge>;
  };

  if (!hasFeatureAccess("analytics")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Analytics Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access detailed analytics and insights.
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
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading analytics...</span>
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

  if (error) {
    return (
      <Alert className="border-red-200 bg-red-50">
        <AlertCircle className="h-4 w-4 text-red-600" />
        <AlertDescription className="text-red-800">
          {error}
          <Button 
            variant="link" 
            className="p-0 h-auto text-red-800 underline ml-2"
            onClick={loadRealAnalytics}
          >
            Try again
          </Button>
        </AlertDescription>
      </Alert>
    );
  }

  const data = realAnalytics || analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
          <p className="text-gray-600">Track your content performance and growth</p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1 text-sm"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
          </select>
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            disabled={isRefreshing}
          >
            <RefreshCw className={`w-4 h-4 ${isRefreshing ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.total_followers?.toLocaleString() || "0"}
                  </p>
                  {data?.growth_rate && (
                    <span className={`text-sm ${data.growth_rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {data.growth_rate >= 0 ? "+" : ""}{data.growth_rate.toFixed(1)}%
                    </span>
                  )}
                </div>
              </div>
              <Users className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Views</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data?.total_views?.toLocaleString() || "0"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Eye className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-gray-600">content reach</span>
                </div>
              </div>
              <Eye className="w-8 h-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Engagement Rate</p>
                <div className="flex items-center gap-2">
                  <p className="text-2xl font-bold text-gray-900">
                    {data?.engagement_rate?.toFixed(1) || "0"}%
                  </p>
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="w-4 h-4 text-red-500" />
                  <span className="text-sm text-gray-600">avg engagement</span>
                </div>
              </div>
              <Heart className="w-8 h-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Viral Score</p>
                <div className="flex items-center gap-2">
                  <p className={`text-2xl font-bold ${getViralScoreColor(data?.viral_score || 0)}`}>
                    {data?.viral_score?.toFixed(0) || "0"}%
                  </p>
                  {data && getViralScoreBadge(data.viral_score)}
                </div>
                <div className="flex items-center gap-1 mt-1">
                  <Target className="w-4 h-4 text-blue-400" />
                  <span className="text-sm text-gray-600">content potential</span>
                </div>
              </div>
              <Target className="w-8 h-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Analytics */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="platforms">Platforms</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="growth">Growth</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Performance Chart */}
          <Card>
            <CardHeader>
              <CardTitle>Performance Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              {data?.recent_performance && data.recent_performance.length > 0 ? (
                <div className="space-y-4">
                  {data.recent_performance.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{item.date}</span>
                        <span className="font-medium">{item.views.toLocaleString()} views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">{item.engagement}% engagement</span>
                        <span className={`text-sm ${getViralScoreColor(item.viral_score)}`}>
                          {item.viral_score}% viral score
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No performance data available</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleScheduleReports}
              disabled={isScheduling}
            >
              {isScheduling ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Scheduling...
                </>
              ) : (
                <>
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Reports
                </>
              )}
            </Button>
            <Button variant="outline" className="w-full">
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {/* Platform Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Object.entries(data?.platform_breakdown || {}).map(([platform, stats]: [string, any]) => (
              <Card key={platform}>
                <CardHeader>
                  <CardTitle className="capitalize">{platform}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Followers</span>
                    <span className="font-medium">{stats.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Posts</span>
                    <span className="font-medium">{stats.posts}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Views</span>
                    <span className="font-medium">{stats.views.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Engagement</span>
                    <span className="font-medium">{stats.engagement.toFixed(1)}%</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Total Posts</span>
                    </div>
                    <p className="text-2xl font-bold">{data?.content_count || 0}</p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Top Performing</span>
                    </div>
                    <p className="text-2xl font-bold">{data?.viral_score?.toFixed(0) || 0}%</p>
                    <p className="text-sm text-gray-600">Viral score</p>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Eye className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Avg Views</span>
                    </div>
                    <p className="text-2xl font-bold">{data?.total_views ? Math.floor(data.total_views / (data.content_count || 1)) : 0}</p>
                    <p className="text-sm text-gray-600">Per post</p>
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium mb-3">Content Insights</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      <span className="text-sm">Video content performs 3x better than images</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                      <span className="text-sm">Posts with questions get 40% more engagement</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                      <span className="text-sm">Optimal posting time: 7-9 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="growth" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Growth Insights</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Follower Growth</span>
                  <span className={`font-medium ${data?.growth_rate >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {data?.growth_rate >= 0 ? "+" : ""}{data?.growth_rate?.toFixed(1) || "0"}%
                  </span>
                </div>
                <Progress value={Math.min(100, Math.max(0, data?.growth_rate || 0))} className="w-full" />
                
                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Focus on engagement rate over follower count</p>
                      <p className="text-sm text-gray-600">High engagement indicates quality audience</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Track viral score trends over time</p>
                      <p className="text-sm text-gray-600">Consistent improvement shows content strategy success</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <p className="font-medium">Optimize posting times for maximum reach</p>
                      <p className="text-sm text-gray-600">Use analytics to find your audience's peak activity</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
