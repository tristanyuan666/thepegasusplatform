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
  Video, 
  Zap, 
  Calendar,
  Target,
  BarChart3,
  DollarSign,
  Instagram,
  Youtube,
  Music,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Globe,
  Sparkles,
  Crown,
  AlertCircle,
  CheckCircle,
  Clock,
  Activity,
  ArrowRight,
  Plus,
  Settings,
  RefreshCw,
  Play,
  Camera,
  Smartphone,
  ExternalLink,
  Star,
  Gift,
  Rocket,
  TrendingDown,
  Minus,
  Equal,
  Info,
  FileText,
  Edit3,
  User,
  Bell,
  Search,
  Filter
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../supabase/client";

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
  viral_score: number;
  monetization_forecast: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string | null;
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
  platform_breakdown: {
    instagram: { followers: number; engagement: number; posts: number };
    tiktok: { followers: number; engagement: number; posts: number };
    youtube: { followers: number; engagement: number; posts: number };
    x: { followers: number; engagement: number; posts: number };
  };
  recent_performance: {
    date: string;
    views: number;
    engagement: number;
    viral_score: number;
  }[];
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  viral_score: number;
  status: "draft" | "scheduled" | "published";
  scheduled_date?: string;
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

export default function DashboardHome({
  user,
  userProfile,
  subscription,
  platformConnections,
  analyticsData,
  hasFeatureAccess,
}: {
  user: User;
  userProfile: UserProfile | null;
  subscription: Subscription | null;
  platformConnections: PlatformConnection[];
  analyticsData: AnalyticsData | null;
  hasFeatureAccess: (feature: string) => boolean;
}) {
  const [recentContent, setRecentContent] = useState<ContentIdea[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const hasConnectedPlatforms = platformConnections.length > 0;

  useEffect(() => {
    if (user?.id) {
      loadRecentContent();
      // Set up real-time updates
      const interval = setInterval(() => {
        loadRecentContent();
      }, 30000); // Refresh every 30 seconds

      return () => clearInterval(interval);
    }
  }, [user?.id]);

  const loadRecentContent = async () => {
    if (!user?.id) return;
    
    try {
      setIsLoading(true);
      
      const supabase = createClient();
      
      // Fetch recent content with enhanced data
      const { data: content, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) throw error;

      // Transform data to match interface
      const transformedContent: ContentIdea[] = (content || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        description: item.content,
        platform: item.platform,
        viral_score: item.viral_score,
        status: item.status,
        scheduled_date: item.scheduled_for,
      }));

      setRecentContent(transformedContent);
    } catch (error) {
      console.error("Error loading recent content:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const getGrowthIcon = (rate: number) => {
    if (rate > 0) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (rate < 0) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Equal className="w-4 h-4 text-gray-600" />;
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-600";
    if (rate < 0) return "text-red-600";
    return "text-gray-600";
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getViralScoreBadge = (score: number) => {
    if (score >= 80) return <Badge className="bg-green-100 text-green-800">Viral</Badge>;
    if (score >= 60) return <Badge className="bg-yellow-100 text-yellow-800">Good</Badge>;
    return <Badge className="bg-red-100 text-red-800">Needs Work</Badge>;
  };

  const getQuickActions = () => {
    const actions = [
      {
        title: "Create Content",
        description: "Generate AI-powered content",
        icon: Sparkles,
        href: "/content-hub",
        color: "from-blue-500 to-blue-600",
        available: hasFeatureAccess("ai_content")
      },
      {
        title: "View Analytics",
        description: "Check your performance",
        icon: BarChart3,
        href: "/dashboard?tab=analytics",
        color: "from-green-500 to-green-600",
        available: hasFeatureAccess("analytics")
      },
      {
        title: "Manage Platforms",
        description: "Manage your connections",
        icon: Globe,
        href: "/dashboard?tab=platforms",
        color: "from-purple-500 to-purple-600",
        available: hasFeatureAccess("platforms")
      },
      {
        title: "Track Revenue",
        description: "Monitor your earnings",
        icon: DollarSign,
        href: "/dashboard?tab=revenue",
        color: "from-yellow-500 to-yellow-600",
        available: hasFeatureAccess("revenue")
      }
    ];

    return actions.filter(action => action.available);
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section - Enhanced Gradient */}
      <Card className="bg-gradient-to-r from-blue-600 via-blue-500 to-blue-700 text-white">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                <User className="w-6 h-6" />
                Welcome back, {userProfile?.full_name || userProfile?.name || "Creator"}!
              </h1>
              <p className="text-blue-100 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Ready to create some viral content today?
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                {userProfile?.subscription || "Free"} Plan
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Followers</p>
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData ? formatNumber(analyticsData.total_followers) : "0"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  {analyticsData && getGrowthIcon(analyticsData.growth_rate)}
                  <span className={`text-sm font-medium ${getGrowthColor(analyticsData?.growth_rate || 0)}`}>
                    {analyticsData?.growth_rate || 0}% this month
                  </span>
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
                  {analyticsData ? formatNumber(analyticsData.total_views) : "0"}
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Eye className="w-4 h-4 text-gray-400" />
                  <span className="text-sm text-gray-600">lifetime views</span>
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
                <p className="text-2xl font-bold text-gray-900">
                  {analyticsData ? analyticsData.engagement_rate.toFixed(1) : "0"}%
                </p>
                <div className="flex items-center gap-1 mt-1">
                  <Heart className="w-4 h-4 text-red-400" />
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
                  <p className={`text-2xl font-bold ${getViralScoreColor(analyticsData?.viral_score || 0)}`}>
                    {analyticsData?.viral_score || 0}%
                  </p>
                  {analyticsData && getViralScoreBadge(analyticsData.viral_score)}
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

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 h-12 bg-gray-50 border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="overview" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <Activity className="w-4 h-4" />
            <span className="font-medium">Overview</span>
          </TabsTrigger>
          <TabsTrigger 
            value="content" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <FileText className="w-4 h-4" />
            <span className="font-medium">Content</span>
          </TabsTrigger>
          <TabsTrigger 
            value="analytics" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <BarChart3 className="w-4 h-4" />
            <span className="font-medium">Analytics</span>
          </TabsTrigger>
          <TabsTrigger 
            value="platforms" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <Globe className="w-4 h-4" />
            <span className="font-medium">Platforms</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-8 mt-8">
          {/* Quick Actions */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <span className="text-sm text-gray-500">Get started with your content strategy</span>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {getQuickActions().map((action, index) => (
                <Card key={index} className="hover:shadow-lg transition-all duration-200 border border-gray-200">
                  <Link href={action.href}>
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-lg">
                        <div className={`p-2 rounded-lg bg-gradient-to-r ${action.color}`}>
                          <action.icon className="w-5 h-5 text-white" />
                        </div>
                        {action.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                        {action.description}
                      </p>
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                        Get Started
                      </Button>
                    </CardContent>
                  </Link>
                </Card>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          {hasConnectedPlatforms && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
                <Button variant="ghost" size="sm" onClick={loadRecentContent} className="text-blue-600 hover:text-blue-700">
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="space-y-4">
                    {analyticsData?.content_count ? (
                      <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">Content Performance</p>
                            <p className="text-xs text-gray-600">
                              {analyticsData.content_count} posts published this month
                            </p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs border-blue-200 text-blue-700">
                          {analyticsData.engagement_rate.toFixed(1)}% engagement
                        </Badge>
                      </div>
                    ) : null}

                    {recentContent.slice(0, 3).map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-3 h-3 bg-green-600 rounded-full"></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{content.title}</p>
                            <p className="text-xs text-gray-600">
                              {content.platform} • {content.status}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          {getViralScoreBadge(content.viral_score)}
                          <span className="text-xs text-gray-500">
                            {content.viral_score}% viral
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Connected Platforms */}
          {hasConnectedPlatforms && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Connected Platforms</h3>
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  {platformConnections.filter(p => p.is_active).length} Connected
                </Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {platformConnections.filter(p => p.is_active).map((connection) => {
                  const platformName = connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1);
                  const platformStats = analyticsData?.platform_breakdown?.[connection.platform as keyof typeof analyticsData.platform_breakdown];
                  
                  return (
                    <Card key={connection.id} className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                              <span className="text-white font-bold text-sm">
                                {platformName.charAt(0)}
                              </span>
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{platformName}</h4>
                              <p className="text-xs text-gray-600">@{connection.platform_username}</p>
                            </div>
                          </div>
                          <Badge className="bg-green-500 text-white border-0">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Active
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white/50 p-2 rounded-lg border border-green-100">
                            <div className="text-lg font-bold text-gray-900">
                              {platformStats?.followers?.toLocaleString() || "0"}
                            </div>
                            <div className="text-xs text-gray-600">Followers</div>
                          </div>
                          <div className="bg-white/50 p-2 rounded-lg border border-green-100">
                            <div className="text-lg font-bold text-gray-900">
                              {platformStats?.posts || "0"}
                            </div>
                            <div className="text-xs text-gray-600">Posts</div>
                          </div>
                          <div className="bg-white/50 p-2 rounded-lg border border-green-100">
                            <div className="text-lg font-bold text-gray-900">
                              {platformStats?.engagement?.toFixed(1) || "0"}%
                            </div>
                            <div className="text-xs text-gray-600">Engagement</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          )}

          {/* Platform Performance */}
          {analyticsData?.platform_breakdown && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
                <span className="text-sm text-gray-500">Cross-platform insights</span>
              </div>
              <Card className="border border-gray-200">
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {Object.entries(analyticsData.platform_breakdown).map(([platform, data]) => (
                      <div key={platform} className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                        <div className="flex items-center gap-3 mb-4">
                          {platform === "instagram" && <Camera className="w-5 h-5 text-pink-600" />}
                          {platform === "tiktok" && <Video className="w-5 h-5 text-black" />}
                          {platform === "youtube" && <Play className="w-5 h-5 text-red-600" />}
                          {platform === "x" && <MessageCircle className="w-5 h-5 text-blue-600" />}
                          <span className="font-medium capitalize text-gray-900">{platform}</span>
                        </div>
                        <div className="space-y-3">
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Followers</span>
                            <span className="font-medium text-gray-900">{formatNumber(data.followers)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Engagement</span>
                            <span className="font-medium text-gray-900">{data.engagement.toFixed(1)}%</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-600">Posts</span>
                            <span className="font-medium text-gray-900">{data.posts}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Overview */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {analyticsData?.content_count || 0}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Scheduled</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentContent.filter(c => c.status === "scheduled").length}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Drafts</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {recentContent.filter(c => c.status === "draft").length}
                    </p>
                  </div>
                  <Edit3 className="w-8 h-8 text-yellow-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Recent Content */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Recent Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentContent.map((content) => (
                  <div key={content.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        <FileText className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{content.title}</h3>
                        <p className="text-sm text-gray-600">{content.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {content.platform}
                          </Badge>
                          <Badge 
                            variant={content.status === "published" ? "default" : "secondary"}
                            className="text-xs"
                          >
                            {content.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-sm font-medium">{content.viral_score}%</p>
                        <p className="text-xs text-gray-500">Viral Score</p>
                      </div>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Performance Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Performance Trend
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-between gap-2">
                {(analyticsData?.recent_performance && analyticsData.recent_performance.length > 0) ? (
                  analyticsData.recent_performance.map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-out"
                        style={{
                          height: `${(day.views / Math.max(...analyticsData.recent_performance.map(d => d.views))) * 100}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))
                ) : (
                  // Default performance data for the last 7 days
                  Array.from({ length: 7 }, (_, index) => {
                    const date = new Date();
                    date.setDate(date.getDate() - (6 - index));
                    const views = Math.floor(Math.random() * 1000) + 500;
                    return { date: date.toISOString().split('T')[0], views };
                  }).map((day, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center">
                      <div
                        className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-out"
                        style={{
                          height: `${(day.views / 1500) * 100}%`,
                          transitionDelay: `${index * 100}ms`,
                        }}
                      />
                      <span className="text-xs text-gray-500 mt-2">
                        {new Date(day.date).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>

          {/* Analytics Summary */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Engagement Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Engagement Rate</span>
                      <span>{analyticsData?.engagement_rate.toFixed(1)}%</span>
                    </div>
                    <Progress value={analyticsData?.engagement_rate || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Viral Score</span>
                      <span>{analyticsData?.viral_score}%</span>
                    </div>
                    <Progress value={analyticsData?.viral_score || 0} className="h-2" />
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Growth Rate</span>
                      <span>{analyticsData?.growth_rate}%</span>
                    </div>
                    <Progress value={Math.abs(analyticsData?.growth_rate || 0)} className="h-2" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  Content Insights
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Best Performing Platform</span>
                    <span className="font-medium">Instagram</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Optimal Posting Time</span>
                    <span className="font-medium">7-9 PM</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Content Type</span>
                    <span className="font-medium">Video</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Avg. Views</span>
                    <span className="font-medium">{formatNumber(analyticsData?.total_views || 0)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="platforms" className="space-y-6">
          {/* Connected Platforms */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {platformConnections.filter(p => p.is_active).map((connection) => {
              const platformName = connection.platform.charAt(0).toUpperCase() + connection.platform.slice(1);
              const platformStats = analyticsData?.platform_breakdown?.[connection.platform as keyof typeof analyticsData.platform_breakdown];
              
              return (
                <Card key={connection.id} className="border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 shadow-lg hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-md">
                          <span className="text-white font-bold text-sm">
                            {platformName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg">{platformName}</h3>
                          <p className="text-sm text-gray-600">@{connection.platform_username}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500 text-white border-0 animate-pulse">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Active
                      </Badge>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-3 text-center mb-4">
                      <div className="bg-white/50 p-3 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-gray-900">
                          {platformStats?.followers?.toLocaleString() || "0"}
                        </div>
                        <div className="text-xs text-gray-600">Followers</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-gray-900">
                          {platformStats?.posts || "0"}
                        </div>
                        <div className="text-xs text-gray-600">Posts</div>
                      </div>
                      <div className="bg-white/50 p-3 rounded-lg border border-green-100">
                        <div className="text-lg font-bold text-gray-900">
                          {platformStats?.engagement?.toFixed(1) || "0"}%
                        </div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Connected</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(connection.connected_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sync</span>
                        <span className="text-gray-900 font-medium">
                          {new Date(connection.last_sync).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {platformConnections.filter(p => p.is_active).length === 0 && (
              <Card className="col-span-full border-gray-200 bg-gradient-to-br from-gray-50 to-blue-50">
                <CardContent className="p-8 text-center">
                  <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No Platforms Connected
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Connect your social media accounts to start tracking performance and creating content with premium analytics.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
