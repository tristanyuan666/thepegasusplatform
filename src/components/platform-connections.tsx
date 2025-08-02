"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
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
  MessageCircle,
  FileText,
  Video,
  Globe,
  Search,
  User,
  Plus,
  X,
  Loader2,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { SocialConnection } from "@/utils/auth";
import { FeatureAccess } from "@/utils/feature-access";

interface PlatformConnectionsProps {
  userId: string;
  connections: SocialConnection[];
  featureAccess: FeatureAccess;
}

interface PlatformAccount {
  username: string;
  displayName: string;
  followerCount: number;
  profileImage?: string;
  verified: boolean;
  bio?: string;
  platform: string;
}

const platforms = [
  {
    id: "instagram",
    name: "Instagram",
    icon: Camera,
    color: "from-pink-500 to-purple-600",
    bgColor: "bg-gradient-to-r from-pink-500 to-purple-600",
    borderColor: "border-pink-200",
    textColor: "text-pink-600",
    description: "Share photos and stories with your audience",
    searchPlaceholder: "Enter Instagram username (e.g., @username)"
  },
  {
    id: "tiktok",
    name: "TikTok",
    icon: Video,
    color: "from-black to-gray-800",
    bgColor: "bg-gradient-to-r from-black to-gray-800",
    borderColor: "border-gray-200",
    textColor: "text-black",
    description: "Create short-form video content",
    searchPlaceholder: "Enter TikTok username (e.g., @username)"
  },
  {
    id: "youtube",
    name: "YouTube",
    icon: Play,
    color: "from-red-500 to-red-600",
    bgColor: "bg-gradient-to-r from-red-500 to-red-600",
    borderColor: "border-red-200",
    textColor: "text-red-600",
    description: "Upload videos and grow your channel",
    searchPlaceholder: "Enter YouTube channel name or username"
  },
  {
    id: "x",
    name: "X",
    icon: MessageCircle,
    color: "from-black to-gray-900",
    bgColor: "bg-gradient-to-r from-black to-gray-900",
    borderColor: "border-gray-200",
    textColor: "text-black",
    description: "Share thoughts and engage with followers",
    searchPlaceholder: "Enter X username (e.g., @username)"
  },
  {
    id: "linkedin",
    name: "LinkedIn",
    icon: FileText,
    color: "from-blue-600 to-blue-700",
    bgColor: "bg-gradient-to-r from-blue-600 to-blue-700",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    description: "Share professional content and network",
    searchPlaceholder: "Enter LinkedIn profile URL or username"
  },
  {
    id: "facebook",
    name: "Facebook",
    icon: Globe,
    color: "from-blue-500 to-blue-600",
    bgColor: "bg-gradient-to-r from-blue-500 to-blue-600",
    borderColor: "border-blue-200",
    textColor: "text-blue-600",
    description: "Connect with friends and family",
    searchPlaceholder: "Enter Facebook page name or username"
  }
];

export default function PlatformConnections({
  userId,
  connections,
  featureAccess,
}: PlatformConnectionsProps) {
  const [isConnecting, setIsConnecting] = useState<string | null>(null);
  const [isRefreshing, setIsRefreshing] = useState<string | null>(null);
  const [isSearching, setIsSearching] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<PlatformAccount[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const supabase = createClient();

  const getConnectionStatus = (platformId: string) => {
    return connections.find(
      (conn) => conn.platform === platformId && conn.is_active,
    );
  };

  // Simulate searching for social media accounts
  const searchPlatformAccounts = async (platform: string, query: string) => {
    setIsSearching(platform);
    setError(null);

    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Clean the query (remove @ symbol if present)
      const cleanQuery = query.replace(/^@/, '').trim();

      if (!cleanQuery) {
        setError("Please enter a valid username");
        return;
      }

      // Simulate different search results based on platform
      const mockResults: PlatformAccount[] = [
        {
          username: cleanQuery,
          displayName: `${cleanQuery.charAt(0).toUpperCase() + cleanQuery.slice(1)}`,
          followerCount: Math.floor(Math.random() * 100000) + 1000,
          verified: Math.random() > 0.7,
          bio: `This is a ${platform} account for ${cleanQuery}`,
          platform: platform
        },
        {
          username: `${cleanQuery}_official`,
          displayName: `${cleanQuery} Official`,
          followerCount: Math.floor(Math.random() * 50000) + 500,
          verified: true,
          bio: `Official ${platform} account`,
          platform: platform
        },
        {
          username: `${cleanQuery}_verified`,
          displayName: `${cleanQuery} Verified`,
          followerCount: Math.floor(Math.random() * 25000) + 250,
          verified: true,
          bio: `Verified ${platform} profile`,
          platform: platform
        }
      ];

      setSearchResults(mockResults);
      setSuccess(`Found ${mockResults.length} accounts for "${cleanQuery}"`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error(`Error searching ${platform}:`, error);
      setError(`Failed to search ${platform}. Please try again.`);
    } finally {
      setIsSearching(null);
    }
  };

  const handleConnectAccount = async (account: PlatformAccount) => {
    setIsConnecting(account.platform);
    setError(null);

    try {
      // Check if this account is already connected by another user
      const { data: existingConnections, error: checkError } = await supabase
        .from("platform_connections")
        .select("*")
        .eq("platform_username", account.username)
        .eq("platform", account.platform)
        .eq("is_active", true);

      if (checkError) {
        console.error("Error checking existing connections:", checkError);
      }

      // If account is already connected by another user, allow it (as per requirements)
      // Multiple users can use the same social media account

      // Store connection in database
      const { error: dbError } = await supabase
        .from("platform_connections")
        .upsert({
          user_id: userId,
          platform: account.platform,
          platform_username: account.username,
          is_active: true,
          connection_attempted_at: new Date().toISOString(),
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString(),
          follower_count: account.followerCount,
          engagement_rate: Math.random() * 5 + 2
        });

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save connection to database");
      }

      setSuccess(`Successfully connected to ${account.username} on ${account.platform}!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Close dialog and reset state
      setIsDialogOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPlatform(null);

      // Refresh the page to show updated connections
      window.location.reload();

    } catch (error) {
      console.error(`Error connecting to ${account.platform}:`, error);
      setError(error instanceof Error ? error.message : `Failed to connect to ${account.platform}. Please try again.`);
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
        .from("platform_connections")
        .update({ is_active: false })
        .eq("id", connectionId);

      if (error) throw error;

      setSuccess(`Successfully disconnected from ${platformName}`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh the page to show updated connections
      window.location.reload();
    } catch (error) {
      console.error("Error disconnecting:", error);
      setError("Failed to disconnect. Please try again.");
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
        .from("platform_connections")
        .update({
          follower_count: newFollowerCount,
          updated_at: new Date().toISOString(),
        })
        .eq("id", connectionId);

      if (error) throw error;

      setSuccess("Stats refreshed successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
      // Refresh the page to show updated stats
      window.location.reload();
    } catch (error) {
      console.error("Error refreshing stats:", error);
      setError("Failed to refresh stats. Please try again.");
    } finally {
      setIsRefreshing(null);
    }
  };

  const openConnectionDialog = (platformId: string) => {
    setSelectedPlatform(platformId);
    setSearchQuery("");
    setSearchResults([]);
    setError(null);
    setIsDialogOpen(true);
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
          Search and connect your social media accounts by entering usernames
        </p>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

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
                  className={`w-12 h-12 ${platform.bgColor} rounded-full flex items-center justify-center mx-auto mb-2 relative`}
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
                    className={`w-16 h-16 ${platform.bgColor} rounded-xl flex items-center justify-center`}
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

                    {/* Connection Stats */}
                    {connection && (
                      <div className="grid grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                        <div className="text-center">
                          <div className="text-lg font-bold text-gray-900">
                            {connection.follower_count?.toLocaleString() || "N/A"}
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
                    <Dialog open={isDialogOpen && selectedPlatform === platform.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          onClick={() => openConnectionDialog(platform.id)}
                          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <div className="flex items-center gap-2">
                            <Plus className="w-4 h-4" />
                            Connect
                          </div>
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-md">
                        <DialogHeader>
                          <DialogTitle className="flex items-center gap-2">
                            <Icon className="w-5 h-5" />
                            Connect to {platform.name}
                          </DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="username" className="text-sm font-medium text-gray-700">
                              Search for Account
                            </Label>
                            <div className="mt-1 flex gap-2">
                              <Input
                                id="username"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder={platform.searchPlaceholder}
                                className="flex-1"
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') {
                                    searchPlatformAccounts(platform.id, searchQuery);
                                  }
                                }}
                              />
                              <Button
                                onClick={() => searchPlatformAccounts(platform.id, searchQuery)}
                                disabled={isSearching === platform.id || !searchQuery.trim()}
                                size="sm"
                              >
                                {isSearching === platform.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Search className="w-4 h-4" />
                                )}
                              </Button>
                            </div>
                          </div>

                          {/* Search Results */}
                          {searchResults.length > 0 && (
                            <div className="space-y-2">
                              <Label className="text-sm font-medium text-gray-700">
                                Found Accounts
                              </Label>
                              <div className="space-y-2 max-h-60 overflow-y-auto">
                                {searchResults.map((account, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50"
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <User className="w-5 h-5 text-gray-600" />
                                      </div>
                                      <div>
                                        <div className="flex items-center gap-2">
                                          <span className="font-medium">@{account.username}</span>
                                          {account.verified && (
                                            <Badge className="bg-blue-100 text-blue-700 text-xs">
                                              Verified
                                            </Badge>
                                          )}
                                        </div>
                                        <div className="text-sm text-gray-600">
                                          {account.followerCount.toLocaleString()} followers
                                        </div>
                                      </div>
                                    </div>
                                    <Button
                                      onClick={() => handleConnectAccount(account)}
                                      disabled={isConnecting === account.platform}
                                      size="sm"
                                      className="bg-green-600 hover:bg-green-700"
                                    >
                                      {isConnecting === account.platform ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                      ) : (
                                        <Plus className="w-4 h-4" />
                                      )}
                                    </Button>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* No Results */}
                          {searchQuery && searchResults.length === 0 && !isSearching && (
                            <div className="text-center py-4 text-gray-500">
                              No accounts found for "{searchQuery}"
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
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
          How to Connect
        </h3>
        <p className="text-gray-600 mb-4">
          Enter the username of the social media account you want to connect. 
          Multiple users can connect to the same account - this is useful for 
          managing shared accounts or collaborating with teams.
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
