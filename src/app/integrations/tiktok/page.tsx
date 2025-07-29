"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { 
  ArrowRight, 
  Zap, 
  Target, 
  TrendingUp,
  Plus,
  Settings,
  AlertCircle,
  BarChart3,
  Users,
  Video,
  Heart,
  MessageCircle,
  Share2,
  RefreshCw,
  CheckCircle2,
  X,
  Edit,
  Trash2,
  Play,
  Pause,
  Clock,
  Music,
  TrendingDown,
  Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function TikTokIntegrationPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [analytics, setAnalytics] = useState<any>({});

  useEffect(() => {
    checkUser();
    loadTikTokData();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadTikTokData = async () => {
    if (!user) return;
    
    try {
      // Simulate loading TikTok account data
      const mockAccountData = {
        username: "@tiktok_creator",
        followers: 89200,
        following: 1200,
        videos: 156,
        likes: 2340000,
        profile_picture: "https://via.placeholder.com/150",
        bio: "Creating viral content that makes you laugh 😂",
        verified: true,
        connected_at: "2024-01-15T10:30:00Z"
      };
      
      setAccountData(mockAccountData);
      setIsConnected(true);
      
      // Load mock videos
      const mockVideos = [
        {
          id: 1,
          title: "Morning Routine Gone Wrong 😂",
          description: "When your morning routine doesn't go as planned...",
          video_url: "https://via.placeholder.com/400x600",
          views: 1250000,
          likes: 89000,
          comments: 3400,
          shares: 12000,
          posted_at: "2024-01-20T15:30:00Z",
          viral_score: 94
        },
        {
          id: 2,
          title: "Life Hack That Actually Works",
          description: "This simple trick changed my life!",
          video_url: "https://via.placeholder.com/400x600",
          views: 890000,
          likes: 67000,
          comments: 2100,
          shares: 8900,
          posted_at: "2024-01-19T09:15:00Z",
          viral_score: 87
        }
      ];
      
      setVideos(mockVideos);
      
      // Load mock analytics
      const mockAnalytics = {
        total_views: 45600000,
        total_likes: 2340000,
        total_comments: 89000,
        total_shares: 156000,
        engagement_rate: 12.5,
        viral_videos: 23,
        average_views: 890000,
        top_sounds: ["Original Sound", "Trending Beat", "Viral Song"],
        trending_hashtags: ["#fyp", "#viral", "#trending", "#funny"]
      };
      
      setAnalytics(mockAnalytics);
      
    } catch (error) {
      console.error("Error loading TikTok data:", error);
    }
  };

  const connectTikTok = async () => {
    try {
      // Simulate TikTok OAuth process
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      loadTikTokData();
    } catch (error) {
      console.error("Error connecting TikTok:", error);
    }
  };

  const disconnectTikTok = async () => {
    try {
      setIsConnected(false);
      setAccountData(null);
      setVideos([]);
      setAnalytics({});
    } catch (error) {
      console.error("Error disconnecting TikTok:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading TikTok integration...</p>
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
          <p className="text-gray-600 mb-4">Please sign in to access TikTok integration.</p>
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

      <section className="py-12 bg-gradient-to-br from-pink-50 to-white">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-pink-500 to-pink-600 rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  TikTok Integration
                </h1>
                <p className="text-gray-600">
                  Manage your TikTok content and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                  <Button variant="outline" onClick={disconnectTikTok}>
                    Disconnect
                  </Button>
                </>
              ) : (
                <Button onClick={connectTikTok}>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect TikTok
                </Button>
              )}
            </div>
          </div>

          {isConnected && accountData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.followers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-pink-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Videos</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.videos}</p>
                    </div>
                    <Video className="w-8 h-8 text-red-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Total Likes</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.likes.toLocaleString()}</p>
                    </div>
                    <Heart className="w-8 h-8 text-pink-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Avg Views</p>
                      <p className="text-2xl font-bold text-gray-900">{analytics.average_views?.toLocaleString()}</p>
                    </div>
                    <Eye className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {isConnected ? (
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <svg className="w-5 h-5 text-pink-600" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                    </svg>
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {accountData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={accountData.profile_picture} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{accountData.username}</h3>
                          <p className="text-gray-600">{accountData.bio}</p>
                          {accountData.verified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-4 pt-4 border-t">
                        <div className="text-center">
                          <p className="text-2xl font-bold">{accountData.videos}</p>
                          <p className="text-sm text-gray-600">Videos</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{accountData.followers.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Followers</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl font-bold">{accountData.likes.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Likes</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-pink-500 to-pink-600">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Video
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Video className="w-4 h-4 mr-2" />
                      Schedule Video
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-md mx-auto">
              <svg className="w-16 h-16 text-pink-600 mx-auto mb-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
              </svg>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your TikTok Account
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your TikTok account to start managing your content, scheduling videos, and tracking analytics.
              </p>
              <Button 
                className="bg-gradient-to-r from-pink-500 to-pink-600"
                onClick={connectTikTok}
              >
                <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
                </svg>
                Connect TikTok
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
