"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Facebook, 
  Linkedin, 
  Globe, 
  Link, 
  RefreshCw, 
  X,
  CheckCircle,
  AlertCircle,
  Settings,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle
} from "lucide-react";

interface DashboardPlatformsProps {
  userProfile: any;
  subscription: any;
  platformConnections: any[];
  onConnectionsUpdate: () => void;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardPlatforms({ 
  userProfile, 
  subscription, 
  platformConnections, 
  onConnectionsUpdate,
  hasFeatureAccess 
}: DashboardPlatformsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);

  const platforms = [
    {
      id: "instagram",
      name: "Instagram",
      icon: Instagram,
      color: "bg-gradient-to-r from-purple-500 to-pink-500",
      description: "Share photos, stories, and reels",
      connected: platformConnections.some(conn => conn.platform === "instagram"),
      stats: { followers: 12500, posts: 156, engagement: 4.2 }
    },
    {
      id: "youtube",
      name: "YouTube",
      icon: Youtube,
      color: "bg-gradient-to-r from-red-500 to-red-600",
      description: "Upload videos and build a channel",
      connected: platformConnections.some(conn => conn.platform === "youtube"),
      stats: { subscribers: 8900, videos: 45, views: 125000 }
    },
    {
      id: "tiktok",
      name: "TikTok",
      icon: Globe,
      color: "bg-gradient-to-r from-black to-gray-800",
      description: "Create short-form videos",
      connected: platformConnections.some(conn => conn.platform === "tiktok"),
      stats: { followers: 23400, videos: 89, likes: 456000 }
    },
    {
      id: "twitter",
      name: "Twitter",
      icon: Twitter,
      color: "bg-gradient-to-r from-blue-400 to-blue-500",
      description: "Share thoughts and engage with community",
      connected: platformConnections.some(conn => conn.platform === "twitter"),
      stats: { followers: 6700, tweets: 234, engagement: 3.8 }
    },
    {
      id: "facebook",
      name: "Facebook",
      icon: Facebook,
      color: "bg-gradient-to-r from-blue-600 to-blue-700",
      description: "Connect with friends and family",
      connected: platformConnections.some(conn => conn.platform === "facebook"),
      stats: { followers: 3400, posts: 78, engagement: 2.1 }
    },
    {
      id: "linkedin",
      name: "LinkedIn",
      icon: Linkedin,
      color: "bg-gradient-to-r from-blue-700 to-blue-800",
      description: "Professional networking and content",
      connected: platformConnections.some(conn => conn.platform === "linkedin"),
      stats: { connections: 1200, posts: 23, engagement: 5.4 }
    }
  ];

  const handleConnect = async (platformId: string) => {
    setIsConnecting(platformId);
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, this would redirect to OAuth flow
      console.log(`Connecting to ${platformId}...`);
      
      // For demo purposes, we'll just show success
      alert(`${platformId} connection successful!`);
      onConnectionsUpdate();
    } catch (error) {
      console.error(`Error connecting to ${platformId}:`, error);
      alert(`Failed to connect to ${platformId}. Please try again.`);
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (platformId: string) => {
    try {
      // Simulate disconnection
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log(`Disconnecting from ${platformId}...`);
      alert(`${platformId} disconnected successfully!`);
      onConnectionsUpdate();
    } catch (error) {
      console.error(`Error disconnecting from ${platformId}:`, error);
      alert(`Failed to disconnect from ${platformId}. Please try again.`);
    }
  };

  const handleRefresh = async (platformId: string) => {
    setIsRefreshing(platformId);
    try {
      // Simulate data refresh
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log(`Refreshing ${platformId} data...`);
      alert(`${platformId} data refreshed!`);
      onConnectionsUpdate();
    } catch (error) {
      console.error(`Error refreshing ${platformId}:`, error);
      alert(`Failed to refresh ${platformId} data. Please try again.`);
    } finally {
      setIsRefreshing(null);
    }
  };

  if (!hasFeatureAccess("platforms")) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-blue-600" />
              Platform Connections
            </CardTitle>
            <CardDescription>
              Connect your social media accounts to sync data and manage content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <Globe className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Upgrade Required</h3>
              <p className="text-gray-600 mb-4">
                Platform connections are available for Creator, Influencer, and Superstar plans
              </p>
              <Button>Upgrade Plan</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Platform Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="w-5 h-5 text-blue-600" />
            Connected Platforms
          </CardTitle>
          <CardDescription>
            Manage your social media accounts and view performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {platforms.map((platform) => {
              const IconComponent = platform.icon;
              const connection = platformConnections.find(conn => conn.platform === platform.id);
              
              return (
                <Card key={platform.id} className="relative">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <IconComponent className="w-6 h-6 text-white" />
                      </div>
                      <div className="flex items-center gap-2">
                        {platform.connected ? (
                          <Badge variant="default" className="bg-green-100 text-green-800">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Connected
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="text-gray-500">
                            <AlertCircle className="w-3 h-3 mr-1" />
                            Not Connected
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <h3 className="font-semibold text-lg mb-1">{platform.name}</h3>
                    <p className="text-sm text-gray-600 mb-4">{platform.description}</p>
                    
                    {platform.connected ? (
                      <div className="space-y-3">
                        {/* Platform Stats */}
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          <div className="flex items-center gap-1">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span className="font-medium">
                              {platform.stats.followers || platform.stats.subscribers || platform.stats.connections || 0}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3 h-3 text-gray-500" />
                            <span className="font-medium">
                              {platform.stats.views || platform.stats.posts || platform.stats.videos || 0}
                            </span>
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleRefresh(platform.id)}
                            disabled={isRefreshing === platform.id}
                            className="flex-1"
                          >
                            {isRefreshing === platform.id ? (
                              <RefreshCw className="w-3 h-3 animate-spin" />
                            ) : (
                              <RefreshCw className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDisconnect(platform.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        onClick={() => handleConnect(platform.id)}
                        disabled={isConnecting === platform.id}
                        className="w-full"
                      >
                        {isConnecting === platform.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin mr-2" />
                        ) : (
                          <Link className="w-4 h-4 mr-2" />
                        )}
                        {isConnecting === platform.id ? "Connecting..." : "Connect"}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Platform Analytics */}
      {platformConnections.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Platform Performance
            </CardTitle>
            <CardDescription>
              Compare performance across your connected platforms
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {platformConnections.map((connection) => {
                const platform = platforms.find(p => p.id === connection.platform);
                if (!platform) return null;
                
                const IconComponent = platform.icon;
                
                return (
                  <div key={connection.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${platform.color}`}>
                        <IconComponent className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-medium">{platform.name}</div>
                        <div className="text-sm text-gray-500">
                          Connected {new Date(connection.connected_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-4 text-sm">
                        <div className="flex items-center gap-1">
                          <Users className="w-3 h-3 text-gray-500" />
                          <span>{platform.stats.followers || platform.stats.subscribers || 0}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Heart className="w-3 h-3 text-gray-500" />
                          <span>{platform.stats.engagement || 0}%</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <MessageCircle className="w-3 h-3 text-gray-500" />
                          <span>{platform.stats.posts || platform.stats.videos || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Tips */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Platform Management Tips
          </CardTitle>
          <CardDescription>
            Best practices for managing your social media accounts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-blue-600 text-sm font-bold">1</span>
              </div>
              <div>
                <h4 className="font-medium">Regular Data Sync</h4>
                <p className="text-sm text-gray-600">
                  Refresh your platform data regularly to get the latest metrics and insights
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-green-600 text-sm font-bold">2</span>
              </div>
              <div>
                <h4 className="font-medium">Cross-Platform Strategy</h4>
                <p className="text-sm text-gray-600">
                  Connect multiple platforms to create a unified content strategy
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-purple-600 text-sm font-bold">3</span>
              </div>
              <div>
                <h4 className="font-medium">Monitor Performance</h4>
                <p className="text-sm text-gray-600">
                  Track engagement rates and follower growth across all platforms
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 