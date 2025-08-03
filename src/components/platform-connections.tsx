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
  onConnectionsUpdate?: (connections: SocialConnection[]) => void;
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
  onConnectionsUpdate,
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
  const [localConnections, setLocalConnections] = useState<SocialConnection[]>(connections);
  const supabase = createClient();

  // Update local connections when props change
  useEffect(() => {
    setLocalConnections(connections);
  }, [connections]);

  const getConnectionStatus = (platformId: string) => {
    return localConnections.find(
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
      console.log("Attempting to connect account:", account);
      
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

      console.log("Storing connection in database...");
      
      // Store connection in database
      const { data: newConnection, error: dbError } = await supabase
        .from("platform_connections")
        .upsert({
          user_id: userId,
          platform: account.platform,
          platform_username: account.username,
          platform_user_id: account.username, // Use username as platform_user_id for now
          is_active: true,
          connection_attempted_at: new Date().toISOString(),
          connected_at: new Date().toISOString(),
          last_sync: new Date().toISOString(),
          follower_count: account.followerCount,
          engagement_rate: Math.random() * 5 + 2
        })
        .select()
        .single();

      if (dbError) {
        console.error("Database error:", dbError);
        throw new Error("Failed to save connection to database");
      }

      console.log("Connection saved successfully:", newConnection);

      // Update local connections state
      const updatedConnections = [...localConnections];
      const existingIndex = updatedConnections.findIndex(
        conn => conn.platform === account.platform
      );

      if (existingIndex >= 0) {
        // Update existing connection
        updatedConnections[existingIndex] = {
          ...updatedConnections[existingIndex],
          platform_username: account.username,
          follower_count: account.followerCount,
          is_active: true,
          updated_at: new Date().toISOString()
        };
      } else {
        // Add new connection
        const newSocialConnection: SocialConnection = {
          id: newConnection.id,
          user_id: userId,
          platform: account.platform,
          platform_user_id: account.username,
          platform_username: account.username,
          username: account.username,
          follower_count: account.followerCount,
          is_active: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        updatedConnections.push(newSocialConnection);
      }

      console.log("Updated local connections:", updatedConnections);
      setLocalConnections(updatedConnections);
      
      // Notify parent component of connection update
      if (onConnectionsUpdate) {
        console.log("Notifying parent component of connection update");
        onConnectionsUpdate(updatedConnections);
      }

      setSuccess(`Successfully connected to ${account.username} on ${account.platform}!`);
      setTimeout(() => setSuccess(null), 3000);
      
      // Close dialog and reset state
      setIsDialogOpen(false);
      setSearchQuery("");
      setSearchResults([]);
      setSelectedPlatform(null);

    } catch (error) {
      console.error("Connection error:", error);
      setError("Connection failed. Please try again.");
    } finally {
      setIsConnecting(null);
    }
  };

  const handleDisconnect = async (
    connectionId: string,
    platformName: string,
  ) => {
    try {
      const { error } = await supabase
        .from("platform_connections")
        .update({ is_active: false })
        .eq("id", connectionId);

      if (error) throw error;

      // Update local connections state
      const updatedConnections = localConnections.map(conn =>
        conn.id === connectionId ? { ...conn, is_active: false } : conn
      );
      setLocalConnections(updatedConnections);

      // Notify parent component of connection update
      if (onConnectionsUpdate) {
        onConnectionsUpdate(updatedConnections);
      }

      setSuccess(`Disconnected from ${platformName}`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error("Disconnect error:", error);
      setError("Failed to disconnect. Please try again.");
    }
  };

  const handleRefreshStats = async (
    connectionId: string,
    platformId: string,
  ) => {
    setIsRefreshing(platformId);
    setError(null);

    try {
      // Simulate API call to refresh stats
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Update follower count and engagement rate
      const newFollowerCount = Math.floor(Math.random() * 50000) + 1000;
      const newEngagementRate = Math.random() * 5 + 2;

      const { error } = await supabase
        .from("platform_connections")
        .update({
          follower_count: newFollowerCount,
          engagement_rate: newEngagementRate,
          last_sync: new Date().toISOString()
        })
        .eq("id", connectionId);

      if (error) throw error;

      // Update local connections state
      const updatedConnections = localConnections.map(conn =>
        conn.id === connectionId 
          ? { 
              ...conn, 
              follower_count: newFollowerCount,
              updated_at: new Date().toISOString()
            } 
          : conn
      );
      setLocalConnections(updatedConnections);

      // Notify parent component of connection update
      if (onConnectionsUpdate) {
        onConnectionsUpdate(updatedConnections);
      }

      setSuccess(`Stats refreshed for ${platformId}`);
      setTimeout(() => setSuccess(null), 3000);

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
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connection Status</h3>
            <p className="text-gray-600">
              {localConnections.filter(conn => conn.is_active).length} of {platforms.length} platforms connected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {platforms.slice(0, 4).map((platform) => {
                const connection = getConnectionStatus(platform.id);
                return (
                  <div
                    key={platform.id}
                    className={`w-8 h-8 rounded-full border-2 border-white flex items-center justify-center ${
                      connection ? "bg-green-500" : "bg-gray-300"
                    }`}
                    title={`${platform.name}: ${connection ? "Connected" : "Not Connected"}`}
                  >
                    {connection ? (
                      <CheckCircle className="w-4 h-4 text-white" />
                    ) : (
                      <Plus className="w-4 h-4 text-gray-600" />
                    )}
                  </div>
                );
              })}
            </div>
            {localConnections.filter(conn => conn.is_active).length > 4 && (
              <Badge variant="secondary" className="ml-2">
                +{localConnections.filter(conn => conn.is_active).length - 4} more
              </Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Total Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {localConnections
                .filter(conn => conn.is_active)
                .reduce((sum, conn) => sum + (conn.follower_count || 0), 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Active Platforms</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {localConnections.filter(conn => conn.is_active).length}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Eye className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Last Sync</span>
            </div>
            <p className="text-sm text-gray-600">
              {localConnections.filter(conn => conn.is_active).length > 0
                ? "Recently updated"
                : "No connections"}
            </p>
          </div>
        </div>
      </Card>

      {/* Platform Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const connection = getConnectionStatus(platform.id);
          const IconComponent = platform.icon;

          return (
            <Card key={platform.id} className="relative overflow-hidden">
              <div className={`absolute top-0 left-0 right-0 h-1 ${platform.bgColor}`} />
              
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg ${platform.bgColor} flex items-center justify-center`}>
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{platform.name}</h3>
                      <p className="text-sm text-gray-600">{platform.description}</p>
                    </div>
                  </div>
                  
                  {connection && (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      Connected
                    </Badge>
                  )}
                </div>

                {connection ? (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">@{connection.username}</span>
                        {connection.follower_count && (
                          <span className="text-sm text-gray-600">
                            {connection.follower_count.toLocaleString()} followers
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <CheckCircle className="w-4 h-4 text-green-600" />
                        <span>Connected {new Date(connection.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRefreshStats(connection.id, platform.id)}
                        disabled={isRefreshing === platform.id}
                        className="flex-1"
                      >
                        {isRefreshing === platform.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        Refresh
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDisconnect(connection.id, platform.name)}
                        className="text-red-600 hover:text-red-700 border-red-200 hover:border-red-300"
                      >
                        <Unlink className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-lg p-4 text-center">
                      <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                        <Plus className="w-6 h-6 text-gray-400" />
                      </div>
                      <p className="text-sm text-gray-600">Not connected</p>
                    </div>

                    <Button
                      onClick={() => openConnectionDialog(platform.id)}
                      className={`w-full ${platform.bgColor} text-white hover:opacity-90`}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Connect {platform.name}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      {/* Connection Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              Connect {selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.name : "Platform"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="search-query">Search for account</Label>
              <div className="flex gap-2 mt-2">
                <Input
                  id="search-query"
                  placeholder={selectedPlatform ? platforms.find(p => p.id === selectedPlatform)?.searchPlaceholder : "Enter username"}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === "Enter" && selectedPlatform && searchQuery.trim()) {
                      searchPlatformAccounts(selectedPlatform, searchQuery.trim());
                    }
                  }}
                />
                <Button
                  onClick={() => selectedPlatform && searchQuery.trim() && searchPlatformAccounts(selectedPlatform, searchQuery.trim())}
                  disabled={!selectedPlatform || !searchQuery.trim() || isSearching === selectedPlatform}
                >
                  {isSearching === selectedPlatform ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Search className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>

            {searchResults.length > 0 && (
              <div className="space-y-2">
                <Label>Select an account to connect:</Label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {searchResults.map((account, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                      onClick={() => handleConnectAccount(account)}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">@{account.username}</span>
                            {account.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-gray-600">{account.displayName}</p>
                          <p className="text-xs text-gray-500">{account.followerCount.toLocaleString()} followers</p>
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleConnectAccount(account);
                        }}
                        disabled={isConnecting === account.platform}
                      >
                        {isConnecting === account.platform ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Plus className="w-4 h-4" />
                        )}
                        Connect
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {searchResults.length === 0 && searchQuery && !isSearching && (
              <div className="text-center py-4 text-gray-500">
                No accounts found. Try a different username.
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
