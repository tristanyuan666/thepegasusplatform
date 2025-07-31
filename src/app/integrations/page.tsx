"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import FeatureAccessControl from "@/components/feature-access-control";
import {
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Globe,
  Smartphone,
  Share2,
  Calendar,
  BarChart3,
  Target,
  Settings,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AnalyticsData {
  total_posts: number;
  connected_platforms: number;
  engagement_rate: number;
  total_reach: number;
  posts_this_month: number;
  growth_rate: number;
  total_engagement: number;
}

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function IntegrationsPageContent() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [connectedAccounts, setConnectedAccounts] = useState<any[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<{[key: string]: string}>({});
  const [analytics, setAnalytics] = useState<AnalyticsData>({
    total_posts: 0,
    connected_platforms: 0,
    engagement_rate: 0,
    total_reach: 0,
    posts_this_month: 0,
    growth_rate: 0,
    total_engagement: 0
  });
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    checkUser();
  }, []);

  useEffect(() => {
    if (user) {
      loadConnectedAccounts();
      loadAnalytics();
    }
  }, [user]);

  const checkUser = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loadConnectedAccounts = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("social_accounts")
        .select("*")
        .eq("user_id", user.id);
      
      if (error) throw error;
      setConnectedAccounts(data || []);
    } catch (error) {
      console.error("Error loading connected accounts:", error);
    }
  };

  const loadAnalytics = async () => {
    if (!user) return;
    
    try {
      const { data, error } = await supabase
        .from("integration_analytics")
        .select("*")
        .eq("user_id", user.id)
        .single();
      
      if (error && error.code !== 'PGRST116') throw error;
      setAnalytics(data || {
        total_posts: 0,
        total_engagement: 0,
        total_followers: 0,
        connected_platforms: 0,
        posts_this_month: 0,
        engagement_rate: 0
      });
    } catch (error) {
      console.error("Error loading analytics:", error);
    }
  };

  const connectPlatform = async (platform: string) => {
    setConnectionStatus(prev => ({ ...prev, [platform]: "connecting" }));
    
    try {
      // Simulate API connection process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Add to connected accounts
      const newAccount = {
        id: Date.now(),
        platform,
        username: `@user_${platform}`,
        connected_at: new Date().toISOString(),
        status: "active",
        followers: Math.floor(Math.random() * 10000) + 1000,
        posts_count: Math.floor(Math.random() * 100) + 10
      };
      
      setConnectedAccounts(prev => [...prev, newAccount]);
      setConnectionStatus(prev => ({ ...prev, [platform]: "connected" }));
      
      // Update analytics
      setAnalytics((prev: AnalyticsData) => ({
        ...prev,
        connected_platforms: prev.connected_platforms + 1
      }));
      
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [platform]: "failed" }));
      console.error(`Error connecting to ${platform}:`, error);
    }
  };

  const disconnectPlatform = async (platform: string) => {
    try {
      setConnectedAccounts(prev => prev.filter(account => account.platform !== platform));
      setConnectionStatus(prev => ({ ...prev, [platform]: "disconnected" }));
      
      // Update analytics
      setAnalytics((prev: AnalyticsData) => ({
        ...prev,
        connected_platforms: Math.max(0, prev.connected_platforms - 1)
      }));
    } catch (error) {
      console.error(`Error disconnecting from ${platform}:`, error);
    }
  };

  const refreshConnection = async (platform: string) => {
    setConnectionStatus(prev => ({ ...prev, [platform]: "refreshing" }));
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setConnectionStatus(prev => ({ ...prev, [platform]: "connected" }));
    } catch (error) {
      setConnectionStatus(prev => ({ ...prev, [platform]: "failed" }));
      console.error(`Error refreshing ${platform}:`, error);
    }
  };

  const platforms = [
    {
      name: "TikTok",
      description: "Connect your TikTok account for viral short-form content",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      color: "from-pink-500 to-pink-600",
      features: ["Auto-posting to TikTok", "Viral trend analysis", "Hashtag optimization", "Best time scheduling"],
    },
    {
      name: "Instagram",
      description: "Sync with Instagram for Stories, Reels, and Posts",
      icon: <Instagram className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      features: ["Stories & Reels posting", "Feed optimization", "Engagement tracking", "Story highlights"],
    },
    {
      name: "YouTube",
      description: "Manage YouTube Shorts and long-form content",
      icon: <Youtube className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      features: ["YouTube Shorts", "Video optimization", "Thumbnail generation", "Analytics integration"],
    },
    {
      name: "Twitter/X",
      description: "Post and engage on Twitter/X platform",
      icon: <Twitter className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      features: ["Tweet scheduling", "Thread creation", "Trend monitoring", "Engagement tracking"],
    },
    {
      name: "LinkedIn",
      description: "Professional networking and content sharing",
      icon: <Linkedin className="w-8 h-8" />,
      color: "from-blue-600 to-blue-700",
      features: ["Professional posts", "Article publishing", "Network growth", "B2B targeting"],
    },
    {
      name: "Facebook",
      description: "Connect Facebook pages and groups",
      icon: <Facebook className="w-8 h-8" />,
      color: "from-blue-700 to-blue-800",
      features: ["Page management", "Group posting", "Event promotion", "Audience insights"],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading integrations...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access integrations.</p>
          <Button onClick={() => window.location.href = "/auth/signin"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Header */}
      <section className="py-12 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Platform Integrations
              </h1>
              <p className="text-gray-600">
                Connect and manage all your social media accounts
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                {connectedAccounts.length} Connected
              </Badge>
              <Button variant="outline" onClick={loadConnectedAccounts}>
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Connected Platforms</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.connected_platforms}</p>
                  </div>
                  <Globe className="w-8 h-8 text-blue-600" />
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
                  <Share2 className="w-8 h-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Engagement</p>
                    <p className="text-2xl font-bold text-gray-900">{analytics.total_engagement.toLocaleString()}</p>
              </div>
                  <Users className="w-8 h-8 text-purple-600" />
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
                  <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8">
        <div className="container mx-auto px-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="connected">Connected ({connectedAccounts.length})</TabsTrigger>
              <TabsTrigger value="available">Available</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="mt-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Connected Accounts Summary */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-green-600" />
                      Connected Accounts
                    </CardTitle>
                    <CardDescription>
                      Manage your connected social media platforms
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    {connectedAccounts.length === 0 ? (
                      <div className="text-center py-8">
                        <Globe className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-gray-600 mb-4">No platforms connected yet</p>
                        <Button onClick={() => setActiveTab("available")}>
                          <Plus className="w-4 h-4 mr-2" />
                          Connect Platform
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {connectedAccounts.map((account) => (
                          <div key={account.id} className="flex items-center justify-between p-4 border rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-semibold text-sm">
                                  {account.platform.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-semibold">{account.platform}</p>
                                <p className="text-sm text-gray-600">{account.username}</p>
                </div>
                  </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                {account.followers.toLocaleString()} followers
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => refreshConnection(account.platform)}
                              >
                                <RefreshCw className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => disconnectPlatform(account.platform)}
                              >
                                <Trash2 className="w-4 h-4 text-red-500" />
                              </Button>
                </div>
              </div>
            ))}
          </div>
                    )}
                  </CardContent>
                </Card>

                {/* Analytics Overview */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                      Performance Overview
                    </CardTitle>
                    <CardDescription>
                      Your cross-platform performance metrics
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Posts This Month</span>
                          <span className="text-sm text-gray-600">{analytics.posts_this_month}</span>
                        </div>
                        <Progress value={Math.min(100, (analytics.posts_this_month / 30) * 100)} className="h-2" />
        </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Engagement Rate</span>
                          <span className="text-sm text-gray-600">{analytics.engagement_rate}%</span>
                        </div>
                        <Progress value={analytics.engagement_rate} className="h-2" />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <span className="text-sm font-medium">Platform Coverage</span>
                          <span className="text-sm text-gray-600">{analytics.connected_platforms}/6</span>
                        </div>
                        <Progress value={(analytics.connected_platforms / 6) * 100} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="connected" className="mt-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Accounts</CardTitle>
                  <CardDescription>
                    Manage your connected social media platforms
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {connectedAccounts.length === 0 ? (
                    <div className="text-center py-12">
                      <Globe className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">No Connected Accounts</h3>
                      <p className="text-gray-600 mb-6">Connect your social media platforms to get started</p>
                      <Button onClick={() => setActiveTab("available")}>
                        <Plus className="w-4 h-4 mr-2" />
                        Connect Platform
                      </Button>
                    </div>
                  ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                      {connectedAccounts.map((account) => (
                        <Card key={account.id} className="relative">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                                  <span className="text-white font-semibold">
                                    {account.platform.charAt(0).toUpperCase()}
              </span>
                                </div>
                                <div>
                                  <h3 className="font-semibold text-lg">{account.platform}</h3>
                                  <p className="text-gray-600">{account.username}</p>
                                </div>
                              </div>
                              <Badge variant="secondary" className="bg-green-100 text-green-800">
                                Connected
                              </Badge>
          </div>

                            <div className="grid grid-cols-2 gap-4 mb-4">
                              <div>
                                <p className="text-sm text-gray-600">Followers</p>
                                <p className="font-semibold">{account.followers.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600">Posts</p>
                                <p className="font-semibold">{account.posts_count}</p>
                              </div>
                            </div>

                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1">
                                <Settings className="w-4 h-4 mr-2" />
                                Settings
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1">
                                <BarChart3 className="w-4 h-4 mr-2" />
                                Analytics
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => disconnectPlatform(account.platform)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="available" className="mt-6">
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {platforms.map((platform) => {
                  const isConnected = connectedAccounts.some(acc => acc.platform === platform.name);
                  const status = connectionStatus[platform.name];
                  
                  return (
                    <Card key={platform.name} className="relative group hover:shadow-lg transition-all duration-300">
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div
                            className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${platform.color} group-hover:scale-110 transition-transform duration-300`}
                          >
                            <div className="text-white">{platform.icon}</div>
                          </div>
                          {isConnected ? (
                            <Badge variant="secondary" className="bg-green-100 text-green-800">
                              Connected
                            </Badge>
                          ) : status === "connecting" ? (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Connecting...
                            </Badge>
                          ) : status === "failed" ? (
                            <Badge variant="secondary" className="bg-red-100 text-red-800">
                              Failed
                            </Badge>
                          ) : null}
                </div>

                        <h3 className="text-xl font-semibold mb-2">{platform.name}</h3>
                        <p className="text-gray-600 mb-4">{platform.description}</p>

                        <div className="space-y-2 mb-6">
                          {platform.features.map((feature, idx) => (
                            <div key={idx} className="flex items-center gap-2 text-sm text-gray-600">
                              <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${platform.color}`} />
                              <span>{feature}</span>
              </div>
            ))}
          </div>

                        {isConnected ? (
                          <div className="flex gap-2">
                            <Button variant="outline" className="flex-1">
                              <Settings className="w-4 h-4 mr-2" />
                              Manage
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => disconnectPlatform(platform.name)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
        </div>
                        ) : (
                          <Button
                            className={`w-full bg-gradient-to-r ${platform.color} hover:shadow-lg transition-all duration-300 ${
                              status === "connecting" ? "opacity-50 cursor-not-allowed" : ""
                            }`}
                            onClick={() => !status && connectPlatform(platform.name)}
                            disabled={status === "connecting"}
                          >
                            {status === "connecting" ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Connecting...
                              </>
                            ) : (
                              <>
                                <Plus className="w-4 h-4 mr-2" />
                                Connect {platform.name}
                              </>
                            )}
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
          </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function IntegrationsPage() {
  return (
    <FeatureAccessControl
      featureName="Platform Integrations"
      featureDescription="Connect your social media accounts to sync data, schedule posts, and track performance across all platforms in one unified dashboard."
      requiredPlan="creator"
      icon={<Globe className="w-10 h-10 text-white" />}
    >
      <IntegrationsPageContent />
    </FeatureAccessControl>
  );
}
