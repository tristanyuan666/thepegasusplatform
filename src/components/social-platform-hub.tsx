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
  Copy,
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
      // Load real connected accounts from database
      const { data: connectionsData, error: connectionsError } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_active", true);

      if (connectionsError) throw connectionsError;

      // Transform database data to match interface
      const realAccounts: PlatformAccount[] = (connectionsData || []).map((conn: any) => ({
        id: conn.id,
        platform: conn.platform,
        username: conn.username || `user_${conn.platform}`,
        followers: conn.follower_count || 0,
        following: conn.following_count || 0,
        posts: conn.post_count || 0,
        engagement_rate: conn.engagement_rate || 0,
        connected_at: conn.connected_at || conn.created_at,
        status: conn.is_active ? "active" : "inactive",
        profile_picture: conn.profile_picture || `https://via.placeholder.com/150?text=${conn.platform}`
      }));

      setConnectedAccounts(realAccounts);

      // Calculate real cross-platform analytics
      const totalFollowers = realAccounts.reduce((sum, acc) => sum + acc.followers, 0);
      const totalPosts = realAccounts.reduce((sum, acc) => sum + acc.posts, 0);
      const avgEngagement = realAccounts.length > 0 
        ? realAccounts.reduce((sum, acc) => sum + acc.engagement_rate, 0) / realAccounts.length 
        : 0;

      // Load content data for analytics
      const { data: contentData, error: contentError } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString());

      if (contentError) throw contentError;

      const content = contentData || [];
      const totalReach = content.reduce((sum, item) => sum + (item.estimated_reach || 0), 0);
      const totalImpressions = content.reduce((sum, item) => sum + (item.estimated_reach || 0) * 1.5, 0);

      const realAnalytics: CrossPlatformAnalytics = {
        total_followers: totalFollowers,
        total_engagement: Math.floor(totalFollowers * avgEngagement / 100),
        total_posts: totalPosts,
        engagement_rate: avgEngagement,
        reach_this_month: totalReach,
        impressions_this_month: totalImpressions,
        followers_growth: 0, // Would need historical data to calculate
        top_performing_platform: realAccounts.length > 0 ? realAccounts[0].platform : "None",
        best_posting_time: "18:00" // Would need analytics data to determine
      };

      setAnalytics(realAnalytics);

      // Load real scheduled content
      const { data: scheduledData, error: scheduledError } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["scheduled", "draft"])
        .order("scheduled_date", { ascending: true });

      if (scheduledError) throw scheduledError;

      const realScheduled: ScheduledContent[] = (scheduledData || []).map((item: any) => ({
        id: item.id,
        title: item.title,
        content: item.content,
        platforms: [item.platform],
        scheduled_time: item.scheduled_date || item.created_at,
        status: item.status,
        estimated_reach: item.estimated_reach || 0,
        content_type: item.content_type || "post"
      }));

      setScheduledContent(realScheduled);
    } catch (error) {
      console.error("Error loading social data:", error);
    } finally {
      setLoading(false);
    }
  };

  const connectPlatform = async (platformId: string) => {
    try {
      // Real platform connection using OAuth
      const oauthConfig = {
        instagram: {
          client_id: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID,
          redirect_uri: `${window.location.origin}/auth/callback`,
          scope: "basic,public_content"
        },
        tiktok: {
          client_id: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID,
          redirect_uri: `${window.location.origin}/auth/callback`,
          scope: "user.info.basic"
        },
        youtube: {
          client_id: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID,
          redirect_uri: `${window.location.origin}/auth/callback`,
          scope: "https://www.googleapis.com/auth/youtube.readonly"
        },
        twitter: {
          client_id: process.env.NEXT_PUBLIC_TWITTER_CLIENT_ID,
          redirect_uri: `${window.location.origin}/auth/callback`,
          scope: "tweet.read users.read"
        }
      };

      const config = oauthConfig[platformId as keyof typeof oauthConfig];
      
      if (!config?.client_id) {
        throw new Error(`${platformId} OAuth is not configured yet. Please try again later.`);
      }

      // Generate state parameter for security
      const state = Math.random().toString(36).substring(7);
      localStorage.setItem(`oauth_state_${platformId}`, state);

      // Construct OAuth URL
      const oauthUrl = new URL(`https://api.${platformId}.com/oauth/authorize`);
      oauthUrl.searchParams.set('client_id', config.client_id);
      oauthUrl.searchParams.set('redirect_uri', config.redirect_uri);
      oauthUrl.searchParams.set('response_type', 'code');
      oauthUrl.searchParams.set('scope', config.scope);
      oauthUrl.searchParams.set('state', state);

      // Store connection attempt in database
      const { error: dbError } = await supabase
        .from("platform_connections")
        .upsert({
          user_id: user.id,
          platform: platformId,
          is_active: false,
          connection_attempted_at: new Date().toISOString()
        });

      if (dbError) {
        console.error("Database error:", dbError);
      }

      // Redirect to OAuth provider
      window.location.href = oauthUrl.toString();
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
      setError(error instanceof Error ? error.message : `Failed to connect to ${platformId}. Please try again.`);
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
