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
    id: "twitter",
    name: "Twitter",
    icon: Twitter,
    color: "from-blue-400 to-blue-600",
    description: "Share thoughts and engage with community",
    features: ["Tweet scheduling", "Thread creation", "Engagement tracking"],
    oauthUrl: "https://twitter.com/i/oauth2/authorize",
    scopes: ["tweet.read", "tweet.write", "users.read"]
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Facebook,
    color: "from-blue-600 to-blue-800",
    description: "Connect with friends and family",
    features: ["Page management", "Post scheduling", "Audience insights"],
    oauthUrl: "https://www.facebook.com/v18.0/dialog/oauth",
    scopes: ["pages_manage_posts", "pages_read_engagement", "pages_show_list"]
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: Linkedin,
    color: "from-blue-700 to-blue-900",
    description: "Professional networking and content",
    features: ["Article publishing", "Company updates", "Professional networking"],
    oauthUrl: "https://www.linkedin.com/oauth/v2/authorization",
    scopes: ["r_liteprofile", "w_member_social", "r_organization_social"]
  }
];

export default function DashboardPlatforms({
  userProfile,
  subscription,
  platformConnections,
  onConnectionsUpdate,
  hasFeatureAccess,
}: DashboardPlatformsProps) {
  const [connecting, setConnecting] = useState<string | null>(null);
  const [disconnecting, setDisconnecting] = useState<string | null>(null);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const supabase = createClient();

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
    if (!hasFeatureAccess("platforms")) {
      setError("Platform connections require an active subscription");
      return;
    }

    setConnecting(platformId);
    setError(null);
    setSuccess(null);

    try {
      const platform = PLATFORMS.find(p => p.id === platformId);
      if (!platform) throw new Error("Platform not found");

      // Generate OAuth state for security
      const state = Math.random().toString(36).substring(7);
      
      // Store OAuth state in localStorage for verification
      localStorage.setItem(`oauth_state_${platformId}`, state);
      
      // Construct OAuth URL
      const params = new URLSearchParams({
        client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID || "your_client_id",
        redirect_uri: `${window.location.origin}/auth/callback?platform=${platformId}`,
        response_type: "code",
        scope: platform.scopes.join(" "),
        state: state
      });

      const oauthUrl = `${platform.oauthUrl}?${params.toString()}`;
      
      // Open OAuth popup
      const popup = window.open(
        oauthUrl,
        `oauth_${platformId}`,
        "width=600,height=700,scrollbars=yes,resizable=yes"
      );

      // Listen for OAuth completion
      const checkPopup = setInterval(() => {
        if (popup?.closed) {
          clearInterval(checkPopup);
          setConnecting(null);
          
          // Check if connection was successful
          setTimeout(() => {
            onConnectionsUpdate();
          }, 1000);
        }
      }, 1000);

    } catch (err) {
      console.error("OAuth error:", err);
      setError(`Failed to connect to ${platformId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    setDisconnecting(platformId);
    setError(null);
    setSuccess(null);

    try {
      const connection = getConnectedPlatform(platformId);
      if (!connection) throw new Error("Connection not found");

      // Revoke OAuth tokens
      const { error: revokeError } = await supabase
        .from("platform_connections")
        .update({
          is_active: false,
          access_token: null,
          refresh_token: null,
          updated_at: new Date().toISOString()
        })
        .eq("id", connection.id);

      if (revokeError) throw revokeError;

      setSuccess(`Successfully disconnected from ${platformId}`);
      onConnectionsUpdate();
    } catch (err) {
      console.error("Disconnect error:", err);
      setError(`Failed to disconnect from ${platformId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setDisconnecting(null);
    }
  };

  const handleSync = async (platformId: string) => {
    setSyncing(platformId);
    setError(null);
    setSuccess(null);

    try {
      const connection = getConnectedPlatform(platformId);
      if (!connection) throw new Error("Connection not found");

      // Simulate API call to sync data
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update last sync time
      const { error: syncError } = await supabase
        .from("platform_connections")
        .update({
          last_sync: new Date().toISOString()
        })
        .eq("id", connection.id);

      if (syncError) throw syncError;

      setSuccess(`Successfully synced ${platformId} data`);
      onConnectionsUpdate();
    } catch (err) {
      console.error("Sync error:", err);
      setError(`Failed to sync ${platformId}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setSyncing(null);
    }
  };

  const getPlatformStats = (platformId: string) => {
    const connection = getConnectedPlatform(platformId);
    if (!connection) return null;

    // Return real stats if available, otherwise show placeholder
    return {
      followers: connection.platform_username ? "Connected" : "Syncing...",
      lastSync: new Date(connection.last_sync).toLocaleDateString(),
      status: connection.is_active ? "Active" : "Inactive"
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
          const isConnecting = connecting === platform.id;
          const isDisconnecting = disconnecting === platform.id;
          const isSyncing = syncing === platform.id;

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
                      <span className="font-medium">{stats?.lastSync || "Never"}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Status:</span>
                      <span className="font-medium text-green-600">{stats?.status}</span>
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
                        disabled={isSyncing}
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
                        disabled={isDisconnecting}
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
                      disabled={isConnecting || !hasFeatureAccess("platforms")}
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