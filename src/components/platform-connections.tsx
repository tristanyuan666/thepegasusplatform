"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Link as LinkIcon,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Settings,
  TrendingUp,
  Users,
  Eye,
  ExternalLink,
  Unlink,
  Play,
  Camera,
  Music,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { SocialConnection } from "@/utils/auth";

interface PlatformConnectionsProps {
  userId: string;
  connections: SocialConnection[];
  onConnectionUpdate: () => void;
}

const platforms = [
  {
    id: "tiktok",
    name: "TikTok",
    icon: Music,
    color: "bg-pink-500",
    description: "Connect to auto-post short videos and track viral content",
    features: ["Auto-posting", "Viral tracking", "Hashtag optimization"],
  },
  {
    id: "instagram",
    name: "Instagram",
    icon: Camera,
    color: "bg-purple-500",
    description: "Share posts, stories, and reels automatically",
    features: ["Posts & Stories", "Reels", "Analytics"],
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Play,
    color: "bg-red-500",
    description: "Upload shorts and track performance metrics",
    features: ["YouTube Shorts", "Performance tracking", "SEO optimization"],
  },
];

export default function PlatformConnections({
  userId,
  connections,
  onConnectionUpdate,
}: PlatformConnectionsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const supabase = createClient();

  const getConnectionStatus = (platformId: string) => {
    return connections.find(
      (conn) => conn.platform === platformId && conn.is_active,
    );
  };

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);

    try {
      // Simulate OAuth flow - in real implementation, this would redirect to platform OAuth
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Mock successful connection
      const mockConnection = {
        user_id: userId,
        platform: platformId,
        platform_user_id: `mock_${platformId}_${Date.now()}`,
        username: `user_${platformId}`,
        follower_count: Math.floor(Math.random() * 10000) + 1000,
        is_active: true,
      };

      const { error } = await supabase
        .from("social_connections")
        .insert(mockConnection);

      if (error) throw error;

      onConnectionUpdate();
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
      alert(`Failed to connect to ${platformId}. Please try again.`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (
    connectionId: string,
    platformName: string,
  ) => {
    if (!confirm(`Are you sure you want to disconnect from ${platformName}?`)) {
      return;
    }

    try {
      const { error } = await supabase
        .from("social_connections")
        .update({ is_active: false })
        .eq("id", connectionId);

      if (error) throw error;

      onConnectionUpdate();
    } catch (error) {
      console.error("Error disconnecting:", error);
      alert("Failed to disconnect. Please try again.");
    }
  };

  const handleRefreshStats = async (
    connectionId: string,
    platformId: string,
  ) => {
    setIsRefreshing(connectionId);

    try {
      // Simulate API call to refresh stats
      await new Promise((resolve) => setTimeout(resolve, 1500));

      const newFollowerCount = Math.floor(Math.random() * 15000) + 5000;

      const { error } = await supabase
        .from("social_connections")
        .update({
          follower_count: newFollowerCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);

      if (error) throw error;

      onConnectionUpdate();
    } catch (error) {
      console.error("Error refreshing stats:", error);
    } finally {
      setIsRefreshing(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <LinkIcon className="w-6 h-6 text-blue-600" />
          Platform Connections
        </h2>
        <p className="text-gray-600">
          Connect your social media accounts to enable auto-posting and
          analytics
        </p>
      </div>

      {/* Connection Status Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Connection Status
          </h3>
          <Badge variant="outline" className="bg-white">
            {connections.filter((c) => c.is_active).length} / {platforms.length}{" "}
            Connected
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-4">
          {platforms.map((platform) => {
            const connection = getConnectionStatus(platform.id);
            const Icon = platform.icon;

            return (
              <div key={platform.id} className="text-center">
                <div
                  className={`w-12 h-12 ${platform.color} rounded-full flex items-center justify-center mx-auto mb-2 relative`}
                >
                  <Icon className="w-6 h-6 text-white" />
                  {connection && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
                <div className="text-sm font-medium text-gray-900">
                  {platform.name}
                </div>
                <div
                  className={`text-xs ${connection ? "text-green-600" : "text-gray-500"}`}
                >
                  {connection ? "Connected" : "Not connected"}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Platform Cards */}
      <div className="grid gap-6">
        {platforms.map((platform) => {
          const connection = getConnectionStatus(platform.id);
          const Icon = platform.icon;
          const isCurrentlyConnecting = isConnecting === platform.id;
          const isCurrentlyRefreshing = isRefreshing === connection?.id;

          return (
            <Card key={platform.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div
                    className={`w-16 h-16 ${platform.color} rounded-xl flex items-center justify-center`}
                  >
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900">
                        {platform.name}
                      </h3>
                      {connection ? (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <CheckCircle className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="text-gray-600">
                          <AlertCircle className="w-3 h-3 mr-1" />
                          Not connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-gray-600 mb-4">{platform.description}</p>

                    {/* Features */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {platform.features.map((feature, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>

                    {/* Connection Stats */}
                    {connection && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {connection.follower_count.toLocaleString()}
                          </div>
                          <div className="text-sm text-gray-600">Followers</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            @{connection.username}
                          </div>
                          <div className="text-sm text-gray-600">Username</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-green-600">
                            Active
                          </div>
                          <div className="text-sm text-gray-600">Status</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-2">
                  {connection ? (
                    <>
                      <Button
                        onClick={() =>
                          handleRefreshStats(connection.id, platform.id)
                        }
                        disabled={isCurrentlyRefreshing}
                        variant="outline"
                        size="sm"
                      >
                        {isCurrentlyRefreshing ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                      </Button>
                      <Button
                        onClick={() =>
                          handleDisconnect(connection.id, platform.name)
                        }
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.id)}
                      disabled={isCurrentlyConnecting}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isCurrentlyConnecting ? (
                        <div className="flex items-center gap-2">
                          <RefreshCw className="w-4 h-4 animate-spin" />
                          Connecting...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <LinkIcon className="w-4 h-4" />
                          Connect
                        </div>
                      )}
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Settings className="w-5 h-5 text-blue-600" />
          Need Help Connecting?
        </h3>
        <p className="text-gray-600 mb-4">
          Follow our step-by-step guides to connect your social media accounts
          securely.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Guides
          </Button>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
}
