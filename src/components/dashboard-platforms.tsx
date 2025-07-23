"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Instagram, 
  Youtube, 
  Music, 
  Twitter, 
  Facebook, 
  Linkedin,
  CheckCircle,
  XCircle,
  ExternalLink,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { createClient } from "@/supabase/client";

interface User {
  id: string;
  email: string;
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
  user: User;
  platformConnections: PlatformConnection[];
  onConnectionsUpdate: (connections: PlatformConnection[]) => void;
  hasFeatureAccess: (feature: string) => boolean;
}

interface PlatformConfig {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
  features: string[];
  oauthUrl: string;
  scopes: string[];
}

export default function DashboardPlatforms({
  user,
  platformConnections,
  onConnectionsUpdate,
  hasFeatureAccess,
}: DashboardPlatformsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);

  const supabase = createClient();

  const platformConfigs: Record<string, PlatformConfig> = {
    instagram: {
      name: "Instagram",
      icon: <Instagram className="w-6 h-6" />,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "Share posts, stories, and reels automatically",
      features: ["Posts & Stories", "Reels", "Analytics"],
      oauthUrl: "/api/auth/instagram",
      scopes: ["basic", "comments", "relationships", "likes"],
    },
    tiktok: {
      name: "TikTok",
      icon: <Music className="w-6 h-6" />,
      color: "bg-gradient-to-r from-pink-500 to-rose-500",
      description: "Connect to auto-post short videos and track viral content",
      features: ["Auto-posting", "Viral tracking", "Hashtag optimization"],
      oauthUrl: "/api/auth/tiktok",
      scopes: ["user.info.basic", "video.list", "video.upload"],
    },
    youtube: {
      name: "YouTube",
      icon: <Youtube className="w-6 h-6" />,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      description: "Upload shorts and track performance metrics",
      features: ["YouTube Shorts", "Performance tracking", "SEO optimization"],
      oauthUrl: "/api/auth/youtube",
      scopes: ["https://www.googleapis.com/auth/youtube.upload", "https://www.googleapis.com/auth/youtube.readonly"],
    },
    twitter: {
      name: "Twitter/X",
      icon: <Twitter className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-400 to-blue-600",
      description: "Post to Twitter/X automatically",
      features: ["Auto-posting", "Thread creation", "Analytics"],
      oauthUrl: "/api/auth/twitter",
      scopes: ["tweet.read", "tweet.write", "users.read"],
    },
    facebook: {
      name: "Facebook",
      icon: <Facebook className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-600 to-blue-800",
      description: "Connect Facebook pages",
      features: ["Page posts", "Stories", "Analytics"],
      oauthUrl: "/api/auth/facebook",
      scopes: ["pages_manage_posts", "pages_read_engagement"],
    },
    linkedin: {
      name: "LinkedIn",
      icon: <Linkedin className="w-6 h-6" />,
      color: "bg-gradient-to-r from-blue-700 to-blue-900",
      description: "Professional networking content",
      features: ["Company posts", "Articles", "Analytics"],
      oauthUrl: "/api/auth/linkedin",
      scopes: ["r_liteprofile", "w_member_social"],
    },
  };

  const handleConnect = async (platform: string) => {
    if (!hasFeatureAccess("platforms")) {
      setError("Platform connections are not available in your current plan. Please upgrade to connect social media accounts.");
      return;
    }

    setIsConnecting(platform);
    setError(null);
    setSuccess(null);

    try {
      const config = platformConfigs[platform];
      if (!config) {
        throw new Error(`Platform ${platform} not configured`);
      }

      // For now, we'll simulate the OAuth flow
      // In production, this would redirect to the actual OAuth URL
      console.log(`Connecting to ${platform}...`);
      
      // Simulate connection delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Create a mock connection (in production, this would come from OAuth callback)
      const mockConnection: PlatformConnection = {
        id: `mock-${platform}-${Date.now()}`,
        user_id: user.id,
        platform: platform,
        platform_user_id: `user_${Math.random().toString(36).substr(2, 9)}`,
        platform_username: `@${platform}_user_${Math.random().toString(36).substr(2, 5)}`,
        access_token: `mock_token_${Math.random().toString(36).substr(2, 20)}`,
        refresh_token: `mock_refresh_${Math.random().toString(36).substr(2, 20)}`,
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
      };

      // Save to database
      const { error: dbError } = await supabase
        .from("platform_connections")
        .insert(mockConnection);

      if (dbError) {
        throw dbError;
      }

      // Update local state
      onConnectionsUpdate([...platformConnections, mockConnection]);
      setSuccess(`Successfully connected to ${config.name}!`);
      
    } catch (err) {
      console.error(`Error connecting to ${platform}:`, err);
      setError(`Failed to connect to ${platform}. Please try again.`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (connection: PlatformConnection) => {
    setError(null);
    setSuccess(null);

    try {
      // Update database
      const { error: dbError } = await supabase
        .from("platform_connections")
        .update({ is_active: false })
        .eq("id", connection.id);

      if (dbError) {
        throw dbError;
      }

      // Update local state
      const updatedConnections = platformConnections.map(conn =>
        conn.id === connection.id ? { ...conn, is_active: false } : conn
      );
      onConnectionsUpdate(updatedConnections);
      
      setSuccess(`Disconnected from ${connection.platform}`);
      
    } catch (err) {
      console.error("Error disconnecting:", err);
      setError("Failed to disconnect. Please try again.");
    }
  };

  const handleRefresh = async (connection: PlatformConnection) => {
    setIsRefreshing(connection.platform);
    setError(null);
    setSuccess(null);

    try {
      // Simulate refresh delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Update last sync time
      const { error: dbError } = await supabase
        .from("platform_connections")
        .update({ last_sync: new Date().toISOString() })
        .eq("id", connection.id);

      if (dbError) {
        throw dbError;
      }

      // Update local state
      const updatedConnections = platformConnections.map(conn =>
        conn.id === connection.id ? { ...conn, last_sync: new Date().toISOString() } : conn
      );
      onConnectionsUpdate(updatedConnections);
      
      setSuccess(`Refreshed ${connection.platform} connection`);
      
    } catch (err) {
      console.error("Error refreshing connection:", err);
      setError("Failed to refresh connection. Please try again.");
    } finally {
      setIsRefreshing(null);
    }
  };

  const getConnectionStatus = (platform: string) => {
    const connection = platformConnections.find(
      conn => conn.platform === platform && conn.is_active
    );
    return connection;
  };

  const getConnectedCount = () => {
    return platformConnections.filter(conn => conn.is_active).length;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Platform Connections
            </h1>
            <p className="text-gray-600 mt-1">
              Connect your social media accounts to enable auto-posting and analytics
            </p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-blue-600">
              {getConnectedCount()} / {Object.keys(platformConfigs).length}
            </div>
            <div className="text-sm text-gray-500">Connected</div>
          </div>
        </div>
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
        {Object.entries(platformConfigs).map(([platform, config]) => {
          const connection = getConnectionStatus(platform);
          const isConnecting = isConnecting === platform;
          const isRefreshing = isRefreshing === platform;

          return (
            <Card key={platform} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-3 rounded-xl text-white ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{config.name}</CardTitle>
                      <p className="text-sm text-gray-600">{config.description}</p>
                    </div>
                  </div>
                  {connection && (
                    <Badge variant="outline" className="text-green-600 border-green-600">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Features */}
                <div className="space-y-2">
                  {config.features.map((feature, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                      <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Connection Status */}
                {connection ? (
                  <div className="space-y-3">
                    <div className="bg-green-50 rounded-lg p-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-700 font-medium">
                          @{connection.platform_username}
                        </span>
                        <span className="text-green-600">
                          Connected {new Date(connection.connected_at).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefresh(connection)}
                        disabled={isRefreshing}
                        className="flex-1"
                      >
                        {isRefreshing ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Refresh
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(connection)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <XCircle className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <Button
                    onClick={() => handleConnect(platform)}
                    disabled={isConnecting || !hasFeatureAccess("platforms")}
                    className="w-full"
                  >
                    {isConnecting ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
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
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            Need Help Connecting?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600 mb-4">
            Follow our step-by-step guides to connect your social media accounts securely.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" size="sm">
              View Guides
            </Button>
            <Button variant="outline" size="sm">
              Contact Support
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 