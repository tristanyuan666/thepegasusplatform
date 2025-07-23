"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Youtube, 
  Music,
  Link,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Users,
  Eye,
  Heart
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

interface DashboardPlatformsProps {
  user: User;
  platformConnections: PlatformConnection[];
  onConnectionsUpdate: (connections: PlatformConnection[]) => void;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardPlatforms({
  user,
  platformConnections,
  onConnectionsUpdate,
  hasFeatureAccess,
}: DashboardPlatformsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [isDisconnecting, setIsDisconnecting] = useState<string | null>(null);

  const connectedPlatforms = platformConnections.filter(conn => conn.is_active);

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "Share photos and stories with your audience",
      features: ["Stories", "Reels", "Posts", "IGTV"],
      connected: connectedPlatforms.some(conn => conn.platform === "instagram"),
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Music,
      color: "bg-gradient-to-r from-pink-500 to-red-500",
      description: "Create short-form videos and reach new audiences",
      features: ["Videos", "Lives", "Duets", "Trends"],
      connected: connectedPlatforms.some(conn => conn.platform === "tiktok"),
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      description: "Upload videos and build a subscriber base",
      features: ["Videos", "Shorts", "Lives", "Community"],
      connected: connectedPlatforms.some(conn => conn.platform === "youtube"),
    },
  ];

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newConnection: PlatformConnection = {
        id: `conn_${Date.now()}`,
        user_id: user.id,
        platform: platformId,
        platform_user_id: `user_${platformId}_${Date.now()}`,
        platform_username: `@user_${platformId}`,
        access_token: `token_${Date.now()}`,
        refresh_token: `refresh_${Date.now()}`,
        is_active: true,
        connected_at: new Date().toISOString(),
        last_sync: new Date().toISOString(),
      };

      onConnectionsUpdate([...platformConnections, newConnection]);
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleRefresh = async (platformId: string) => {
    setIsRefreshing(platformId);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const updatedConnections = platformConnections.map(conn => 
        conn.platform === platformId 
          ? { ...conn, last_sync: new Date().toISOString() }
          : conn
      );
      
      onConnectionsUpdate(updatedConnections);
    } catch (error) {
      console.error(`Error refreshing ${platformId}:`, error);
    } finally {
      setIsRefreshing(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    setIsDisconnecting(platformId);
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedConnections = platformConnections.filter(conn => 
        conn.platform !== platformId
      );
      
      onConnectionsUpdate(updatedConnections);
    } catch (error) {
      console.error(`Error disconnecting from ${platformId}:`, error);
    } finally {
      setIsDisconnecting(null);
    }
  };

  const getConnectionInfo = (platformId: string) => {
    return connectedPlatforms.find(conn => conn.platform === platformId);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
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
              Connect and manage your social media accounts
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Link className="w-3 h-3 mr-1" />
              {connectedPlatforms.length} Connected
            </Badge>
          </div>
        </div>
      </div>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {platforms.map((platform) => {
           const connection = getConnectionInfo(platform.id);
           const isConnectingPlatform = isConnecting === platform.id;
           const isRefreshingPlatform = isRefreshing === platform.id;
           const isDisconnectingPlatform = isDisconnecting === platform.id;

          return (
            <Card key={platform.id} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 ${platform.color} rounded-lg flex items-center justify-center`}>
                      <platform.icon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platform.name}</CardTitle>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  {platform.connected && (
                    <Badge className="bg-green-100 text-green-800">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      Connected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              
              <CardContent>
                {platform.connected ? (
                  <div className="space-y-4">
                    {/* Connection Info */}
                    <div className="bg-gray-50 rounded-lg p-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Connected as</span>
                        <span className="text-sm text-gray-600">{connection?.platform_username}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Last sync</span>
                        <span className="text-sm text-gray-600">
                          {connection ? formatDate(connection.last_sync) : 'Never'}
                        </span>
                      </div>
                    </div>

                    {/* Platform Stats */}
                    <div className="grid grid-cols-3 gap-2 text-center">
                      <div className="p-2 bg-blue-50 rounded">
                        <div className="text-lg font-bold text-blue-600">
                          {Math.floor(Math.random() * 10000) + 1000}
                        </div>
                        <div className="text-xs text-gray-600">Followers</div>
                      </div>
                      <div className="p-2 bg-green-50 rounded">
                        <div className="text-lg font-bold text-green-600">
                          {Math.floor(Math.random() * 100000) + 10000}
                        </div>
                        <div className="text-xs text-gray-600">Views</div>
                      </div>
                      <div className="p-2 bg-purple-50 rounded">
                        <div className="text-lg font-bold text-purple-600">
                          {(Math.random() * 10 + 2).toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-600">Engagement</div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                                           <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleRefresh(platform.id)}
                       disabled={isRefreshingPlatform}
                       className="flex-1"
                     >
                       {isRefreshingPlatform ? (
                         <RefreshCw className="w-4 h-4 animate-spin" />
                       ) : (
                         <RefreshCw className="w-4 h-4" />
                       )}
                       Refresh
                     </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => window.open(`https://${platform.id}.com`, '_blank')}
                        className="flex-1"
                      >
                        <ExternalLink className="w-4 h-4" />
                        View
                      </Button>
                                           <Button
                       variant="outline"
                       size="sm"
                       onClick={() => handleDisconnect(platform.id)}
                       disabled={isDisconnectingPlatform}
                       className="text-red-600 hover:text-red-700"
                     >
                       {isDisconnectingPlatform ? (
                         <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                       ) : (
                         <Trash2 className="w-4 h-4" />
                       )}
                     </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Features */}
                    <div>
                      <h4 className="text-sm font-medium mb-2">Available Features:</h4>
                      <div className="flex flex-wrap gap-1">
                        {platform.features.map((feature) => (
                          <Badge key={feature} variant="secondary" className="text-xs">
                            {feature}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Connect Button */}
                                         <Button
                       onClick={() => handleConnect(platform.id)}
                       disabled={isConnectingPlatform}
                       className="w-full"
                     >
                       {isConnectingPlatform ? (
                         <>
                           <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                           Connecting...
                         </>
                       ) : (
                         <>
                           <Link className="w-4 h-4 mr-2" />
                           Connect {platform.name}
                         </>
                       )}
                     </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Connection Status */}
      {connectedPlatforms.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Connection Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {connectedPlatforms.map((connection) => (
                <div key={connection.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="font-medium capitalize">{connection.platform}</p>
                      <p className="text-sm text-gray-600">{connection.platform_username}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">Connected</p>
                    <p className="text-xs text-gray-600">
                      {formatDate(connection.connected_at)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-blue-600" />
            Platform Connection Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Connect multiple platforms for better reach</p>
                <p className="text-sm text-gray-600">Cross-platform posting increases your audience</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Keep your connections active</p>
                <p className="text-sm text-gray-600">Regular syncing ensures up-to-date data</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
              <div>
                <p className="font-medium">Use platform-specific features</p>
                <p className="text-sm text-gray-600">Each platform has unique tools for engagement</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 