"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Progress } from "./ui/progress";
import { 
  Instagram, 
  Twitter, 
  Youtube, 
  Linkedin, 
  Facebook,
  Globe,
  Users,
  BarChart3,
  Calendar,
  Share2,
  Plus,
  Settings,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  TrendingUp,
  Eye,
  Heart,
  MessageCircle,
  Clock,
  Zap,
  Target,
  Smartphone,
  Video,
  Image,
  FileText,
  Camera,
  Play,
  Pause,
  Edit,
  Trash2,
  ExternalLink
} from "lucide-react";

interface SocialPlatformHubProps {
  user: any;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

interface PlatformAccount {
  id: string;
  platform: string;
  username: string;
  followers: number;
  following: number;
  posts: number;
  engagement_rate: number;
  connected_at: string;
  status: "active" | "inactive" | "error";
  profile_picture?: string;
}

interface CrossPlatformAnalytics {
  total_followers: number;
  total_engagement: number;
  total_posts: number;
  engagement_rate: number;
  reach_this_month: number;
  impressions_this_month: number;
  followers_growth: number;
  top_performing_platform: string;
  best_posting_time: string;
}

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  platforms: string[];
  scheduled_time: string;
  status: "scheduled" | "draft" | "published";
  estimated_reach: number;
  content_type: "post" | "story" | "reel" | "video";
}

export default function SocialPlatformHub({
  user,
  hasActiveSubscription,
  subscriptionTier,
}: SocialPlatformHubProps) {
  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<PlatformAccount[]>([]);
  const [analytics, setAnalytics] = useState<CrossPlatformAnalytics | null>(null);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const supabase = createClient();

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "from-purple-500 to-pink-500" },
    { id: "twitter", name: "Twitter/X", icon: Twitter, color: "from-blue-500 to-blue-600" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-600" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "from-blue-600 to-blue-700" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-700 to-blue-800" },
    { id: "tiktok", name: "TikTok", icon: Globe, color: "from-pink-500 to-pink-600" }
  ];

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      // Mock connected accounts data
      const mockAccounts: PlatformAccount[] = [
        {
          id: "1",
          platform: "instagram",
          username: "@creative_creator",
          followers: 15420,
          following: 892,
          posts: 234,
          engagement_rate: 9.2,
          connected_at: "2024-01-15T10:30:00Z",
          status: "active",
          profile_picture: "https://via.placeholder.com/150"
        },
        {
          id: "2",
          platform: "twitter",
          username: "@tech_innovator",
          followers: 8920,
          following: 456,
          posts: 156,
          engagement_rate: 7.8,
          connected_at: "2024-01-10T14:20:00Z",
          status: "active"
        },
        {
          id: "3",
          platform: "youtube",
          username: "Creative Creator",
          followers: 23400,
          following: 0,
          posts: 89,
          engagement_rate: 12.5,
          connected_at: "2024-01-05T09:15:00Z",
          status: "active"
        }
      ];

      setConnectedAccounts(mockAccounts);

      // Mock cross-platform analytics
      const mockAnalytics: CrossPlatformAnalytics = {
        total_followers: 47740,
        total_engagement: 45678,
        total_posts: 479,
        engagement_rate: 9.8,
        reach_this_month: 125000,
        impressions_this_month: 189000,
        followers_growth: 12.5,
        top_performing_platform: "Instagram",
        best_posting_time: "18:00"
      };

      setAnalytics(mockAnalytics);

      // Mock scheduled content
      const mockScheduled: ScheduledContent[] = [
        {
          id: "1",
          title: "Product Launch Announcement",
          content: "🚀 Exciting news! Our new product is launching next week...",
          platforms: ["instagram", "twitter", "linkedin"],
          scheduled_time: "2024-01-25T10:00:00Z",
          status: "scheduled",
          estimated_reach: 25000,
          content_type: "post"
        },
        {
          id: "2",
          title: "Behind the Scenes",
          content: "A day in the life of a content creator...",
          platforms: ["instagram", "tiktok"],
          scheduled_time: "2024-01-26T15:30:00Z",
          status: "draft",
          estimated_reach: 18000,
          content_type: "story"
        }
      ];

      setScheduledContent(mockScheduled);
    } catch (error) {
      console.error("Error loading social data:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platformId: string) => {
    try {
      // Simulate platform connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newAccount: PlatformAccount = {
        id: Date.now().toString(),
        platform: platformId,
        username: `@user_${platformId}`,
        followers: Math.floor(Math.random() * 10000) + 1000,
        following: Math.floor(Math.random() * 500) + 100,
        posts: Math.floor(Math.random() * 100) + 10,
        engagement_rate: Math.random() * 15 + 5,
        connected_at: new Date().toISOString(),
        status: "active"
      };

      setConnectedAccounts(prev => [...prev, newAccount]);
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
    }
  };

  const disconnectPlatform = async (platformId: string) => {
    try {
      setConnectedAccounts(prev => prev.filter(account => account.platform !== platformId));
    } catch (error) {
      console.error(`Error disconnecting from ${platformId}:`, error);
    }
  };

  const publishContent = async (contentId: string) => {
    try {
      setScheduledContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, status: "published" as const }
            : content
        )
      );
    } catch (error) {
      console.error("Error publishing content:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading social platform hub...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Globe className="w-6 h-6 text-blue-600" />
            Social Platform Hub
          </h2>
          <p className="text-gray-600">
            Manage all your social media accounts and cross-platform content
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
            {subscriptionTier} Plan
          </Badge>
          <Button variant="outline" size="sm" onClick={loadSocialData}>
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="accounts">Accounts ({connectedAccounts.length})</TabsTrigger>
          <TabsTrigger value="scheduled">Scheduled ({scheduledContent.length})</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Cross-Platform Analytics */}
          {analytics && (
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.total_followers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Posts</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.total_posts}</p>
                    </div>
                    <FileText className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.engagement_rate}%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Reach This Month</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.reach_this_month.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-orange-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Platform Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Connected Platforms</CardTitle>
              <CardDescription>
                Manage your social media accounts and view performance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                  const account = connectedAccounts.find(acc => acc.platform === platform.id);
                  const Icon = platform.icon;
                  
                  return (
                    <Card key={platform.id} className="relative">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${platform.color}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          {account ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Connected
                            </Badge>
                          ) : (
                            <Badge variant="secondary" className="bg-gray-100 text-gray-600">
                              Not Connected
                            </Badge>
                          )}
                        </div>

                        <h3 className="font-semibold text-lg mb-2">{platform.name}</h3>
                        
                        {account ? (
                          <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-gray-600">Followers</p>
                                <p className="font-semibold">{account.followers.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-gray-600">Engagement</p>
                                <p className="font-semibold">{account.engagement_rate}%</p>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <BarChart3 className="w-4 h-4 mr-1" />
                                Analytics
                              </Button>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="text-red-600"
                                onClick={() => disconnectPlatform(platform.id)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <p className="text-sm text-gray-600">Connect your {platform.name} account to start managing content</p>
                            <Button 
                              className={`w-full bg-gradient-to-r ${platform.color}`}
                              onClick={() => connectPlatform(platform.id)}
                            >
                              <Plus className="w-4 h-4 mr-2" />
                              Connect {platform.name}
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="accounts" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Connected Accounts</CardTitle>
              <CardDescription>
                Detailed view of all your connected social media accounts
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {connectedAccounts.map((account) => {
                  const platform = platforms.find(p => p.id === account.platform);
                  const Icon = platform?.icon || Globe;
                  
                  return (
                    <div key={account.id} className="border rounded-lg p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${platform?.color || "from-gray-500 to-gray-600"}`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{account.username}</h3>
                            <p className="text-gray-600 capitalize">{account.platform}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <div className="text-right">
                            <p className="text-sm text-gray-600">Connected</p>
                            <p className="text-sm font-medium">{new Date(account.connected_at).toLocaleDateString()}</p>
                          </div>
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            {account.status}
                          </Badge>
                        </div>
                      </div>
                      
                      <div className="grid md:grid-cols-4 gap-4 mt-4">
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{account.followers.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{account.following.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Following</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{account.posts}</p>
                          <p className="text-sm text-gray-600">Posts</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold text-gray-900">{account.engagement_rate}%</p>
                          <p className="text-sm text-gray-600">Engagement</p>
                        </div>
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Button variant="outline" size="sm" className="flex-1">
                          <BarChart3 className="w-4 h-4 mr-2" />
                          View Analytics
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Calendar className="w-4 h-4 mr-2" />
                          Schedule Content
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <Settings className="w-4 h-4 mr-2" />
                          Settings
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-red-600"
                          onClick={() => disconnectPlatform(account.platform)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="scheduled" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Scheduled Content</CardTitle>
                  <CardDescription>
                    Manage your cross-platform content schedule
                  </CardDescription>
                </div>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Schedule Content
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {scheduledContent.map((content) => (
                  <div key={content.id} className="border rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{content.title}</h3>
                          <Badge 
                            variant={
                              content.status === "published" 
                                ? "default" 
                                : content.status === "scheduled" 
                                  ? "secondary" 
                                  : "outline"
                            }
                          >
                            {content.status}
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{content.content}</p>
                        
                        <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-4 h-4" />
                            {new Date(content.scheduled_time).toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-4 h-4" />
                            {content.estimated_reach.toLocaleString()} reach
                          </span>
                          <span className="flex items-center gap-1">
                            <Share2 className="w-4 h-4" />
                            {content.platforms.length} platforms
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {content.platforms.map((platform) => {
                            const platformInfo = platforms.find(p => p.id === platform);
                            const Icon = platformInfo?.icon || Globe;
                            
                            return (
                              <Badge key={platform} variant="outline" className="flex items-center gap-1">
                                <Icon className="w-3 h-3" />
                                {platformInfo?.name || platform}
                              </Badge>
                            );
                          })}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {content.status === "scheduled" && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => publishContent(content.id)}
                          >
                            <Play className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-600">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {analytics && (
            <>
              {/* Performance Metrics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <TrendingUp className="w-5 h-5 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Followers Growth</h3>
                        <p className="text-2xl font-bold text-blue-600">+{analytics.followers_growth}%</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">This month</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <BarChart3 className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Best Platform</h3>
                        <p className="text-2xl font-bold text-green-600">{analytics.top_performing_platform}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">Highest engagement</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Clock className="w-5 h-5 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Best Time</h3>
                        <p className="text-2xl font-bold text-purple-600">{analytics.best_posting_time}</p>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600">To post content</p>
                  </CardContent>
                </Card>
              </div>

              {/* Engagement Progress */}
              <Card>
                <CardHeader>
                  <CardTitle>Engagement Performance</CardTitle>
                  <CardDescription>
                    Track your engagement rate across all platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Overall Engagement Rate</span>
                        <span className="text-sm text-gray-600">{analytics.engagement_rate}%</span>
                      </div>
                      <Progress value={analytics.engagement_rate} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Monthly Reach</span>
                        <span className="text-sm text-gray-600">{analytics.reach_this_month.toLocaleString()}</span>
                      </div>
                      <Progress value={Math.min(100, (analytics.reach_this_month / 200000) * 100)} className="h-2" />
                    </div>

                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">Platform Coverage</span>
                        <span className="text-sm text-gray-600">{connectedAccounts.length}/6</span>
                      </div>
                      <Progress value={(connectedAccounts.length / 6) * 100} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
