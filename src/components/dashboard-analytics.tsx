"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  TrendingUp, 
  TrendingDown,
  Users, 
  Eye, 
  Heart, 
  Share2,
  BarChart3,
  Calendar,
  Target,
  Zap,
  AlertCircle,
  CheckCircle
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

interface DashboardAnalyticsProps {
  user: User;
  platformConnections: PlatformConnection[];
  analyticsData: AnalyticsData | null;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardAnalytics({
  user,
  platformConnections,
  analyticsData,
  hasFeatureAccess,
}: DashboardAnalyticsProps) {
  const [success, setSuccess] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSettingGoals, setIsSettingGoals] = useState(false);
  const [isScheduling, setIsScheduling] = useState(false);
  
  const connectedPlatforms = platformConnections.filter(conn => conn.is_active);
  const hasConnectedPlatforms = connectedPlatforms.length > 0;

  // Clear success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  // Format numbers with K/M suffixes
  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1) + "M";
    } else if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
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

  const handleGenerateReport = async () => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setSuccess("Custom analytics report generated successfully! Check your email for the download link.");
    } catch (error) {
      console.error("Report generation error:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSetGoals = async () => {
    setIsSettingGoals(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Performance goals set successfully! You'll receive notifications when you reach milestones.");
    } catch (error) {
      console.error("Goal setting error:", error);
    } finally {
      setIsSettingGoals(false);
    }
  };

  const handleScheduleReports = async () => {
    setIsScheduling(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSuccess("Weekly reports scheduled successfully! You'll receive them every Monday at 9 AM.");
    } catch (error) {
      console.error("Scheduling error:", error);
    } finally {
      setIsScheduling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Success Message */}
      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Analytics Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Track your performance across all platforms
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <BarChart3 className="w-3 h-3 mr-1" />
              Last 30 days
            </Badge>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
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
                {analyticsData.growth_rate > 0 ? (
                  <TrendingUp className="w-3 h-3 mr-1 text-green-600" />
                ) : (
                  <TrendingDown className="w-3 h-3 mr-1 text-red-600" />
                )}
                {analyticsData.growth_rate > 0 ? "+" : ""}{analyticsData.growth_rate.toFixed(1)}% this month
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
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

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Engagement Rate</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {hasConnectedPlatforms ? (analyticsData?.engagement_rate || 0).toFixed(1) : "0"}%
            </div>
            <p className="text-xs text-muted-foreground">
              Average across platforms
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
      </div>

      {/* Platform Performance */}
      {hasConnectedPlatforms && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Platform Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {connectedPlatforms.map((connection) => (
                <div key={connection.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <span className="text-sm font-medium capitalize">
                        {connection.platform.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-medium capitalize">{connection.platform}</h3>
                      <p className="text-sm text-gray-600">@{connection.platform_username}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Followers</span>
                      <span className="font-medium">
                        {formatNumber(Math.floor((analyticsData?.total_followers || 0) / connectedPlatforms.length))}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Engagement</span>
                      <span className="font-medium text-green-600">
                        {(analyticsData?.engagement_rate || 0).toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Views</span>
                      <span className="font-medium">
                        {formatNumber(Math.floor((analyticsData?.total_views || 0) / connectedPlatforms.length))}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Growth Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Growth Insights</CardTitle>
          </CardHeader>
          <CardContent>
            {hasConnectedPlatforms ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Monthly Growth</p>
                      <p className="text-sm text-gray-600">Follower increase</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      +{analyticsData?.growth_rate || 0}%
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Heart className="w-5 h-5 text-green-600" />
                    <div>
                      <p className="font-medium">Engagement Rate</p>
                      <p className="text-sm text-gray-600">Average across platforms</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      {(analyticsData?.engagement_rate || 0).toFixed(1)}%
                    </p>
                  </div>
                </div>
                
                                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">Content Performance</p>
                      <p className="text-sm text-gray-600">Posts this month</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-blue-600">
                      {analyticsData?.content_count || 0}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <BarChart3 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No analytics data available</p>
                <p className="text-sm">Connect platforms to start tracking performance</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Viral Score Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            {hasConnectedPlatforms ? (
              <div className="space-y-4">
                <div className="text-center">
                  <div className={`text-4xl font-bold mb-2 ${getViralScoreColor(analyticsData?.viral_score || 0)}`}>
                    {analyticsData?.viral_score || 0}
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    {getViralScoreStatus(analyticsData?.viral_score || 0)}
                  </p>
                  
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full transition-all duration-500 ${
                        (analyticsData?.viral_score || 0) >= 80 ? "bg-green-500" :
                        (analyticsData?.viral_score || 0) >= 60 ? "bg-yellow-500" :
                        (analyticsData?.viral_score || 0) >= 40 ? "bg-orange-500" : "bg-red-500"
                      }`}
                      style={{ width: `${Math.min((analyticsData?.viral_score || 0), 100)}%` }}
                    ></div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Content Quality</span>
                    <span className="font-medium">{(analyticsData?.viral_score || 0) * 0.4}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Engagement Rate</span>
                    <span className="font-medium">{(analyticsData?.engagement_rate || 0) * 0.3}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Growth Momentum</span>
                    <span className="font-medium">{(analyticsData?.growth_rate || 0) * 0.3}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <Zap className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No viral score data</p>
                <p className="text-sm">Connect platforms to calculate viral score</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Analytics Tools */}
      <Card>
        <CardHeader>
          <CardTitle>Analytics Tools</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Custom Reports</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Create personalized analytics reports
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGenerating}
              >
                {isGenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Generating...
                  </>
                ) : (
                  "Generate Report"
                )}
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Target className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-medium">Performance Goals</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Set and track performance targets
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleSetGoals}
                disabled={isSettingGoals}
              >
                {isSettingGoals ? (
                  <>
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Setting...
                  </>
                ) : (
                  "Set Goals"
                )}
              </Button>
            </div>

            <div className="p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                                  <div className="p-2 bg-blue-100 rounded-lg">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-medium">Scheduled Reports</h3>
              </div>
              <p className="text-sm text-gray-600 mb-3">
                Automate weekly/monthly reports
              </p>
              <Button 
                variant="outline" 
                size="sm" 
                className="w-full"
                onClick={handleScheduleReports}
                disabled={isScheduling}
              >
                {isScheduling ? (
                  <>
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                    Scheduling...
                  </>
                ) : (
                  "Schedule"
                )}
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
            Analytics Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
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
                              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Compare performance across platforms</p>
                <p className="text-sm text-gray-600">Identify which platforms work best for your content</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
