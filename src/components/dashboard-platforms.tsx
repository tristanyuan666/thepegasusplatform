"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Music,
  CheckCircle,
  X,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar
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
  follower_count?: number; // Added for new getPlatformStats
}

interface DashboardPlatformsProps {
  userProfile: UserProfile;
  subscription: Subscription | null;
  platformConnections: PlatformConnection[];
  onConnectionsUpdate: () => void;
  hasFeatureAccess: (feature: string) => boolean;
}

const PLATFORMS = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Instagram,
    color: "from-pink-500 to-purple-600",
    description: "Share photos, stories, and reels",
    features: ["Post scheduling", "Story creation", "Reel optimization"],
    oauthUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    scopes: ["instagram_basic", "instagram_content_publish", "pages_read_engagement"]
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Youtube,
    color: "from-red-500 to-red-700",
    description: "Upload videos and build a channel",
    features: ["Video upload", "Channel analytics", "Live streaming"],
    oauthUrl: "https://accounts.google.com/o/oauth2/v2/auth",
    scopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"]
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "from-black to-gray-800",
    description: "Create short-form videos",
    features: ["Video creation", "Trend analysis", "Hashtag optimization"],
    oauthUrl: "https://www.tiktok.com/v2/auth/authorize",
    scopes: ["user.info.basic", "video.list", "video.upload"]
  },
  {
    id: "x",
    name: "X",
    icon: X,
    color: "from-black to-gray-700",
    description: "Share thoughts and engage with your audience",
    features: ["Tweet scheduling", "Thread creation", "Engagement tracking"],
    oauthUrl: "https://twitter.com/i/oauth2/authorize",
    scopes: ["tweet.read", "tweet.write", "users.read"]
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "from-blue-500 to-blue-700",
    description: "Connect with friends and family",
    features: ["Post creation", "Page management", "Group engagement"],
    oauthUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    scopes: ["public_profile", "email", "pages_manage_posts"]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "from-blue-600 to-blue-800",
    description: "Build your professional network",
    features: ["Article publishing", "Network building", "Professional content"],
    oauthUrl: "https://www.linkedin.com/oauth/v2/authorization",
    scopes: ["r_liteprofile", "w_member_social"]
  }
];

export default function DashboardPlatforms({
  userProfile,
  subscription,
  platformConnections,
  onConnectionsUpdate,
  hasFeatureAccess,
}: DashboardPlatformsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);
  const [isSyncing, setIsSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [content, setContent] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadContentData();
  }, [userProfile?.user_id]);

  const loadContentData = async () => {
    if (!userProfile?.user_id) return;
    
    try {
      const { data: contentData, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContent(contentData || []);
    } catch (error) {
      console.error("Error loading content data:", error);
    }
  };

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const getConnectedPlatform = (platformId: string) => {
    return platformConnections.find(conn => conn.platform === platformId);
  };

  const handleConnect = async (platformId: string) => {
    if (!userProfile?.user_id) return;
    
    setIsConnecting(platformId);
    setError(null);
    
    try {
      const platform = PLATFORMS.find(p => p.id === platformId);
      if (!platform) throw new Error("Platform not found");
      
      // Enhanced OAuth flow with proper state management
      const state = btoa(JSON.stringify({
        user_id: userProfile.user_id,
        platform: platformId,
        timestamp: Date.now()
      }));
      
      // Store connection attempt in database
      const { error: storeError } = await supabase
        .from("platform_connections")
        .upsert({
          user_id: userProfile.user_id,
          platform: platformId,
          platform_username: "",
          access_token: "",
          refresh_token: "",
          is_active: false,
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString(),
        }, { onConflict: "user_id,platform" });
      
      if (storeError) throw storeError;
      
      // Build OAuth URL with enhanced parameters
      const oauthUrl = new URL(platform.oauthUrl);
      oauthUrl.searchParams.set("client_id", getClientId(platformId));
      oauthUrl.searchParams.set("redirect_uri", `${window.location.origin}/auth/callback`);
      oauthUrl.searchParams.set("response_type", "code");
      oauthUrl.searchParams.set("scope", platform.scopes.join(" "));
      oauthUrl.searchParams.set("state", state);
      
      // Store state in localStorage for verification
      localStorage.setItem("oauth_state", state);
      localStorage.setItem("oauth_platform", platformId);
      
      // Redirect to OAuth
      window.location.href = oauthUrl.toString();
      
    } catch (error) {
      console.error("Error initiating connection:", error);
      setError("Failed to connect platform. Please try again.");
      setIsConnecting(null);
    }
  };

  const getClientId = (platformId: string): string => {
    const clientIds = {
      instagram: process.env.NEXT_PUBLIC_INSTAGRAM_CLIENT_ID || "mock_instagram_client_id",
      youtube: process.env.NEXT_PUBLIC_YOUTUBE_CLIENT_ID || "mock_youtube_client_id",
      tiktok: process.env.NEXT_PUBLIC_TIKTOK_CLIENT_ID || "mock_tiktok_client_id",
      x: process.env.NEXT_PUBLIC_X_CLIENT_ID || "mock_x_client_id",
      facebook: process.env.NEXT_PUBLIC_FACEBOOK_CLIENT_ID || "mock_facebook_client_id",
      linkedin: process.env.NEXT_PUBLIC_LINKEDIN_CLIENT_ID || "mock_linkedin_client_id",
    };
    return clientIds[platformId as keyof typeof clientIds] || "mock_client_id";
  };

  const handleDisconnect = async (platformId: string) => {
    if (!userProfile?.user_id) return;
    
    setIsDisconnecting(platformId);
    setError(null);
    
    try {
      // Update connection status in database
      const { error } = await supabase
        .from("platform_connections")
        .update({
          is_active: false,
          access_token: "",
          refresh_token: "",
          last_sync: new Date().toISOString(),
        })
        .eq("user_id", userProfile.user_id)
        .eq("platform", platformId);
      
      if (error) throw error;
      
      // Update local state
      onConnectionsUpdate();
      
      // Show success feedback
      setSuccess(`Successfully disconnected from ${PLATFORMS.find(p => p.id === platformId)?.name}`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error("Error disconnecting platform:", error);
      setError("Failed to disconnect platform. Please try again.");
    } finally {
      setIsDisconnecting(null);
    }
  };

  const handleSync = async (platformId: string) => {
    if (!userProfile?.user_id) return;
    
    setIsSyncing(platformId);
    setError(null);
    
    try {
      // Simulate platform sync with enhanced data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update sync timestamp
      const { error } = await supabase
        .from("platform_connections")
        .update({
          last_sync: new Date().toISOString(),
        })
        .eq("user_id", userProfile.user_id)
        .eq("platform", platformId);
      
      if (error) throw error;
      
      // Update local state
      onConnectionsUpdate();
      
      // Show success feedback
      setSuccess(`Successfully synced ${PLATFORMS.find(p => p.id === platformId)?.name} data`);
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error("Error syncing platform:", error);
      setError("Failed to sync platform data. Please try again.");
    } finally {
      setIsSyncing(null);
    }
  };

  const getPlatformStats = (platformId: string) => {
    // Get real platform statistics from user's data
    const connection = platformConnections.find(conn => conn.platform === platformId);
    
    if (!connection || !connection.is_active) {
      return {
        followers: 0,
        posts: 0,
        engagement: 0,
        reach: 0,
        growth: 0
      };
    }

    // Calculate real metrics from content performance
    const platformContent = content?.filter((item: any) => item.platform === platformId) || [];
    const totalViews = platformContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
    const avgEngagement = platformContent.length > 0 
      ? platformContent.reduce((sum: number, item: any) => sum + (item.viral_score || 0), 0) / platformContent.length 
      : 0;
    
    // Calculate growth based on recent vs older content
    const recentContent = platformContent.filter((item: any) => 
      new Date(item.created_at) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
    );
    const olderContent = platformContent.filter((item: any) => {
      const date = new Date(item.created_at);
      const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const twoWeeksAgo = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
      return date <= weekAgo && date > twoWeeksAgo;
    });
    
    const recentViews = recentContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
    const olderViews = olderContent.reduce((sum: number, item: any) => sum + (item.estimated_reach || 0), 0);
    const growth = olderViews > 0 ? ((recentViews - olderViews) / olderViews) * 100 : 0;

    return {
      followers: connection.follower_count || 0,
      posts: platformContent.length,
      engagement: avgEngagement,
      reach: totalViews,
      growth: growth
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Connected Platforms</h1>
          <p className="text-gray-600 mt-1">
            Manage your social media accounts and view performance metrics
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          {platformConnections.filter(c => c.is_active).length} Connected
        </Badge>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PLATFORMS.map((platform) => {
                      const connection = getConnectedPlatform(platform.id);
            const stats = getPlatformStats(platform.id);
            const isConnectingPlatform = isConnecting === platform.id;
            const isDisconnectingPlatform = isDisconnecting === platform.id;
            const isSyncingPlatform = isSyncing === platform.id;

          return (
            <Card key={platform.id} className="relative overflow-hidden">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 bg-gradient-to-r ${platform.color} rounded-lg flex items-center justify-center`}>
                      <platform.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  {connection?.is_active && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                {/* Connection Status */}
                {connection?.is_active ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Username:</span>
                      <span className="font-medium">@{connection.platform_username || "Loading..."}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Last Sync:</span>
                      <span className="font-medium">{new Date(connection.last_sync).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">Active</span>
                    </div>
                  </div>
                ) : (
                  <div className="text-sm text-gray-600">
                    <p>Not connected</p>
                    <p className="mt-1">Connect to enable:</p>
                    <ul className="mt-2 space-y-1">
                      {platform.features.map((feature, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <div className="w-1 h-1 bg-gray-400 rounded-full" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2">
                  {connection?.is_active ? (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSync(platform.id)}
                        disabled={!!isSyncing}
                        className="flex-1"
                      >
                        {isSyncing ? (
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4 mr-2" />
                        )}
                        {isSyncing ? "Syncing..." : "Sync"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(platform.id)}
                        disabled={!!isDisconnecting}
                        className="text-red-600 hover:text-red-700"
                      >
                        {isDisconnecting ? (
                          <X className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={!!isConnecting || !hasFeatureAccess("platforms")}
                      className={`flex-1 bg-gradient-to-r ${platform.color} hover:opacity-90`}
                    >
                      {isConnecting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                          Connecting...
                        </>
                      ) : (
                        <>
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Connect
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Platform Management Tips */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Platform Management Tips</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Regular Data Sync</h4>
              <p className="text-blue-700 text-sm">Refresh your platform data regularly to get the latest metrics and insights</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Cross-Platform Strategy</h4>
              <p className="text-blue-700 text-sm">Connect multiple platforms to create a unified content strategy</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <h4 className="font-medium text-blue-900">Monitor Performance</h4>
              <p className="text-blue-700 text-sm">Track engagement rates and follower growth across all platforms</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 