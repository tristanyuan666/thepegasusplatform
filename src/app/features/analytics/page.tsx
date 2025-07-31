"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import FeatureAccessControl from "@/components/feature-access-control";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  BarChart3,
  TrendingUp,
  Eye,
  Users,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Heart,
  Share2,
  MessageCircle,
  Clock,
  Globe,
  Smartphone,
  Video,
  Image,
  FileText,
  Camera,
  Plus,
  Edit3,
  Save,
  Copy,
  Send,
  Settings,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus as PlusIcon,
  Sparkles,
  Crown,
  Star,
  Award,
  Trophy,
  Target as TargetIcon,
  TrendingDown,
  AlertTriangle,
  Info,
  Rocket,
  ChartBar,
  TestTube,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Activity,
  Target as TargetIcon2,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
  Palette as PaletteIcon,
  UserCheck,
  Users as UsersIcon,
  MessageSquare,
  Hash,
  Tag,
  BookOpen,
  Mic,
  Camera as CameraIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Music,
  Gamepad2,
  Coffee,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  Heart as HeartIcon,
  ShoppingBag,
  Utensils,
  Plane,
  Car as CarIcon,
  Bike,
  Dumbbell,
  BookOpen as BookOpenIcon,
  PenTool,
  Code,
  Paintbrush,
  Camera as CameraIcon2,
  Video as VideoIcon2,
} from "lucide-react";

interface AnalyticsData {
  id: string;
  platform: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  likes: number;
  shares: number;
  comments: number;
  growthRate: number;
  viralScore: number;
  topContent: ContentPerformance[];
  audienceDemographics: Demographics;
  performanceTrends: TrendData[];
  createdAt: string;
}

interface ContentPerformance {
  id: string;
  title: string;
  platform: string;
  contentType: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  engagement: number;
  viralScore: number;
  postedAt: string;
}

interface Demographics {
  ageGroups: { range: string; percentage: number }[];
  genders: { gender: string; percentage: number }[];
  locations: { location: string; percentage: number }[];
  interests: { interest: string; percentage: number }[];
}

interface TrendData {
  date: string;
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
}

function AnalyticsPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [dateRange, setDateRange] = useState<string>("30d");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadAnalyticsData();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      setUser(currentUser);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAnalyticsData = async () => {
    try {
      // Mock data for demonstration
      const mockAnalytics: AnalyticsData[] = [
        {
          id: "1",
          platform: "Instagram",
          followers: 12500,
          engagement: 4.2,
          reach: 45000,
          impressions: 89000,
          likes: 8500,
          shares: 1200,
          comments: 950,
          growthRate: 12.5,
          viralScore: 78,
          topContent: [
            {
              id: "1",
              title: "Morning Motivation Post",
              platform: "Instagram",
              contentType: "post",
              views: 12500,
              likes: 850,
              shares: 120,
              comments: 95,
              engagement: 8.5,
              viralScore: 87,
              postedAt: new Date().toISOString(),
            },
            {
              id: "2",
              title: "Behind the Scenes Story",
              platform: "Instagram",
              contentType: "story",
              views: 8900,
              likes: 420,
              shares: 85,
              comments: 65,
              engagement: 6.4,
              viralScore: 72,
              postedAt: new Date().toISOString(),
            },
          ],
          audienceDemographics: {
            ageGroups: [
              { range: "18-24", percentage: 25 },
              { range: "25-34", percentage: 45 },
              { range: "35-44", percentage: 20 },
              { range: "45+", percentage: 10 },
            ],
            genders: [
              { gender: "Female", percentage: 65 },
              { gender: "Male", percentage: 35 },
            ],
            locations: [
              { location: "United States", percentage: 40 },
              { location: "United Kingdom", percentage: 25 },
              { location: "Canada", percentage: 15 },
              { location: "Australia", percentage: 10 },
              { location: "Other", percentage: 10 },
            ],
            interests: [
              { interest: "Fitness & Health", percentage: 35 },
              { interest: "Technology", percentage: 25 },
              { interest: "Travel", percentage: 20 },
              { interest: "Fashion", percentage: 15 },
              { interest: "Food", percentage: 5 },
            ],
          },
          performanceTrends: [
            {
              date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
              followers: 11000,
              engagement: 3.8,
              reach: 40000,
              impressions: 75000,
            },
            {
              date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
              followers: 11500,
              engagement: 4.0,
              reach: 42000,
              impressions: 80000,
            },
            {
              date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
              followers: 12000,
              engagement: 4.1,
              reach: 43000,
              impressions: 85000,
            },
            {
              date: new Date().toISOString(),
              followers: 12500,
              engagement: 4.2,
              reach: 45000,
              impressions: 89000,
            },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error("Error loading analytics data:", error);
      setError("Failed to load analytics data");
    }
  };

  const refreshAnalytics = async () => {
    setIsRefreshing(true);
    try {
      await loadAnalyticsData();
      setSuccess("Analytics data refreshed successfully");
    } catch (error) {
      setError("Failed to refresh analytics data");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getGrowthColor = (rate: number) => {
    return rate > 0 ? "text-green-600" : "text-red-600";
  };

  const getEngagementColor = (rate: number) => {
    return rate > 5 ? "text-green-600" : rate > 3 ? "text-yellow-600" : "text-red-600";
  };

  const getViralScoreColor = (score: number) => {
    return score > 80 ? "text-green-600" : score > 60 ? "text-yellow-600" : "text-red-600";
  };

  const totalFollowers = analyticsData.reduce((sum, data) => sum + data.followers, 0);
  const avgEngagement = analyticsData.reduce((sum, data) => sum + data.engagement, 0) / analyticsData.length;
  const totalReach = analyticsData.reduce((sum, data) => sum + data.reach, 0);
  const avgGrowthRate = analyticsData.reduce((sum, data) => sum + data.growthRate, 0) / analyticsData.length;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />

      <main className="pt-20 pb-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full mb-6 shadow-lg border border-white/30">
              <BarChart3 className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Analytics Dashboard
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Track Your Growth with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Advanced Analytics
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Get detailed insights into your content performance, audience
              behavior, and growth metrics across all platforms.
            </p>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>{success}</AlertDescription>
            </Alert>
          )}

          {/* Quick Stats */}
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Followers</p>
                  <p className="text-xl font-bold text-blue-600">{totalFollowers.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Heart className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg Engagement</p>
                  <p className="text-xl font-bold text-green-600">{avgEngagement.toFixed(1)}%</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Reach</p>
                  <p className="text-xl font-bold text-purple-600">{totalReach.toLocaleString()}</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Growth Rate</p>
                  <p className="text-xl font-bold text-orange-600">+{avgGrowthRate.toFixed(1)}%</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div className="flex items-center gap-2">
              <Label htmlFor="platform-select" className="text-sm font-medium">
                Platform:
              </Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  <SelectItem value="instagram">Instagram</SelectItem>
                  <SelectItem value="tiktok">TikTok</SelectItem>
                  <SelectItem value="youtube">YouTube</SelectItem>
                  <SelectItem value="twitter">Twitter/X</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Label htmlFor="date-range" className="text-sm font-medium">
                Date Range:
              </Label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="1y">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              onClick={refreshAnalytics}
              disabled={isRefreshing}
              variant="outline"
              size="sm"
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
          </div>

          {/* Analytics Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Platform Performance */}
              <div className="grid md:grid-cols-2 gap-6">
                {analyticsData.map((data) => (
                  <Card key={data.id} className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {data.platform} Performance
                      </h3>
                      <Badge variant="outline" className={getViralScoreColor(data.viralScore)}>
                        {data.viralScore}% viral
                      </Badge>
                    </div>

                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Followers</p>
                          <p className="text-2xl font-bold text-blue-600">
                            {data.followers.toLocaleString()}
                          </p>
                          <p className={`text-xs ${getGrowthColor(data.growthRate)}`}>
                            +{data.growthRate}% from last month
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className={`text-2xl font-bold ${getEngagementColor(data.engagement)}`}>
                            {data.engagement}%
                          </p>
                          <p className="text-xs text-gray-500">Avg engagement rate</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <p className="text-sm text-gray-600">Likes</p>
                          <p className="text-lg font-semibold text-green-600">
                            {data.likes.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Shares</p>
                          <p className="text-lg font-semibold text-purple-600">
                            {data.shares.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Comments</p>
                          <p className="text-lg font-semibold text-orange-600">
                            {data.comments.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Top Performing Content */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
                <div className="space-y-4">
                  {analyticsData[0]?.topContent.map((content) => (
                    <div key={content.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          {content.contentType === "post" && <FileText className="w-4 h-4 text-blue-600" />}
                          {content.contentType === "story" && <Camera className="w-4 h-4 text-blue-600" />}
                          {content.contentType === "video" && <Video className="w-4 h-4 text-blue-600" />}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.platform} • {content.contentType}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Views</p>
                          <p className="text-sm font-medium">{content.views.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Engagement</p>
                          <p className={`text-sm font-medium ${getEngagementColor(content.engagement)}`}>
                            {content.engagement}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-xs text-gray-600">Viral Score</p>
                          <p className={`text-sm font-medium ${getViralScoreColor(content.viralScore)}`}>
                            {content.viralScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="audience" className="space-y-6">
              {/* Audience Demographics */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Age Distribution</h3>
                  <div className="space-y-3">
                    {analyticsData[0]?.audienceDemographics.ageGroups.map((age) => (
                      <div key={age.range} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{age.range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${age.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{age.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Gender Distribution</h3>
                  <div className="space-y-3">
                    {analyticsData[0]?.audienceDemographics.genders.map((gender) => (
                      <div key={gender.gender} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{gender.gender}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-green-600 h-2 rounded-full"
                              style={{ width: `${gender.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{gender.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Locations</h3>
                  <div className="space-y-3">
                    {analyticsData[0]?.audienceDemographics.locations.map((location) => (
                      <div key={location.location} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{location.location}</span>
                        <span className="text-sm font-medium">{location.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Interests</h3>
                  <div className="space-y-3">
                    {analyticsData[0]?.audienceDemographics.interests.map((interest) => (
                      <div key={interest.interest} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{interest.interest}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-600 h-2 rounded-full"
                              style={{ width: `${interest.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{interest.percentage}%</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              {/* Performance Trends */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Growth Trends</h3>
                <div className="space-y-4">
                  {analyticsData[0]?.performanceTrends.map((trend, index) => (
                    <div key={trend.date} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-600">{new Date(trend.date).toLocaleDateString()}</span>
                        <div className="flex items-center gap-6">
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Followers</p>
                            <p className="text-sm font-medium">{trend.followers.toLocaleString()}</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Engagement</p>
                            <p className="text-sm font-medium">{trend.engagement}%</p>
                          </div>
                          <div className="text-center">
                            <p className="text-xs text-gray-600">Reach</p>
                            <p className="text-sm font-medium">{trend.reach.toLocaleString()}</p>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant="outline">
                          {index > 0 ? 
                            `${((trend.followers - analyticsData[0].performanceTrends[index - 1].followers) / analyticsData[0].performanceTrends[index - 1].followers * 100).toFixed(1)}%`
                            : "0%"
                          }
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function AnalyticsPageWrapper() {
  return (
    <FeatureAccessControl
      featureName="Analytics Dashboard"
      featureDescription="Track your growth with advanced analytics, audience insights, and performance metrics across all your social media platforms."
      requiredPlan="creator"
      icon={<BarChart3 className="w-10 h-10 text-white" />}
    >
      <AnalyticsPage />
    </FeatureAccessControl>
  );
}
