"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
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
  Yoga,
  BookOpen as BookOpenIcon,
  PenTool,
  Code,
  Paintbrush,
  Camera as CameraIcon2,
  Video as VideoIcon2,
  Mic as MicIcon,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon2,
  Palette as PaletteIcon2,
  Droplets,
  Sun,
  Moon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
  Calendar,
  Download,
  Upload,
  PieChart,
  LineChart,
  BarChart,
  ScatterChart,
  AreaChart,
  Activity as ActivityIcon,
  Target,
  Zap,
  Brain,
  Palette,
  User,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

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

export default function AnalyticsPage() {
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
      if (!currentUser) {
        window.location.href = "/sign-in";
        return;
      }
      setUser(currentUser);
    } catch (error) {
      console.error("Error checking user:", error);
      window.location.href = "/sign-in";
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
              { interest: "Fitness", percentage: 35 },
              { interest: "Technology", percentage: 25 },
              { interest: "Business", percentage: 20 },
              { interest: "Lifestyle", percentage: 15 },
              { interest: "Education", percentage: 5 },
            ],
          },
          performanceTrends: [
            { date: "2024-01-01", followers: 10000, engagement: 3.8, reach: 40000, impressions: 80000 },
            { date: "2024-01-08", followers: 10500, engagement: 4.0, reach: 42000, impressions: 84000 },
            { date: "2024-01-15", followers: 11000, engagement: 4.1, reach: 43000, impressions: 86000 },
            { date: "2024-01-22", followers: 11500, engagement: 4.2, reach: 44000, impressions: 88000 },
            { date: "2024-01-29", followers: 12000, engagement: 4.3, reach: 45000, impressions: 90000 },
          ],
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          platform: "TikTok",
          followers: 8500,
          engagement: 6.8,
          reach: 35000,
          impressions: 75000,
          likes: 12000,
          shares: 2500,
          comments: 1800,
          growthRate: 18.2,
          viralScore: 85,
          topContent: [
            {
              id: "3",
              title: "Tutorial Video",
              platform: "TikTok",
              contentType: "video",
              views: 25000,
              likes: 1800,
              shares: 450,
              comments: 320,
              engagement: 10.2,
              viralScore: 92,
              postedAt: new Date().toISOString(),
            },
          ],
          audienceDemographics: {
            ageGroups: [
              { range: "13-17", percentage: 15 },
              { range: "18-24", percentage: 45 },
              { range: "25-34", percentage: 30 },
              { range: "35+", percentage: 10 },
            ],
            genders: [
              { gender: "Female", percentage: 55 },
              { gender: "Male", percentage: 45 },
            ],
            locations: [
              { location: "United States", percentage: 50 },
              { location: "United Kingdom", percentage: 20 },
              { location: "Canada", percentage: 15 },
              { location: "Australia", percentage: 10 },
              { location: "Other", percentage: 5 },
            ],
            interests: [
              { interest: "Entertainment", percentage: 40 },
              { interest: "Fitness", percentage: 25 },
              { interest: "Technology", percentage: 20 },
              { interest: "Education", percentage: 10 },
              { interest: "Lifestyle", percentage: 5 },
            ],
          },
          performanceTrends: [
            { date: "2024-01-01", followers: 7000, engagement: 6.0, reach: 30000, impressions: 65000 },
            { date: "2024-01-08", followers: 7500, engagement: 6.2, reach: 32000, impressions: 68000 },
            { date: "2024-01-15", followers: 8000, engagement: 6.5, reach: 33000, impressions: 72000 },
            { date: "2024-01-22", followers: 8250, engagement: 6.7, reach: 34000, impressions: 74000 },
            { date: "2024-01-29", followers: 8500, engagement: 6.8, reach: 35000, impressions: 75000 },
          ],
          createdAt: new Date().toISOString(),
        },
      ];
      setAnalyticsData(mockAnalytics);
    } catch (error) {
      console.error("Error loading analytics data:", error);
    }
  };

  const refreshAnalytics = async () => {
    setIsRefreshing(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate data refresh
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadAnalyticsData();
      setSuccess("Analytics data refreshed successfully!");
    } catch (error) {
      console.error("Error refreshing analytics:", error);
      setError("Failed to refresh analytics. Please try again.");
    } finally {
      setIsRefreshing(false);
    }
  };

  const getGrowthColor = (rate: number) => {
    if (rate > 0) return "text-green-600";
    if (rate < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getEngagementColor = (rate: number) => {
    if (rate >= 5) return "text-green-600";
    if (rate >= 3) return "text-yellow-600";
    return "text-red-600";
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="content">Content</TabsTrigger>
              <TabsTrigger value="audience">Audience</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              {/* Platform Performance */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Platform Performance</h3>
                  <Button onClick={refreshAnalytics} disabled={isRefreshing}>
                    {isRefreshing ? (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                        Refreshing...
                      </>
                    ) : (
                      <>
                        <RefreshCw className="w-4 h-4 mr-2" />
                        Refresh
                      </>
                    )}
                  </Button>
                </div>

                <div className="space-y-4">
                  {analyticsData.map((data) => (
                    <div key={data.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <span className="text-sm font-medium">{data.platform.charAt(0)}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{data.platform}</h4>
                            <p className="text-sm text-gray-600">{data.followers.toLocaleString()} followers</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge className={getGrowthColor(data.growthRate)}>
                            +{data.growthRate}% growth
                          </Badge>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-4 gap-4">
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Engagement</p>
                          <p className={`text-lg font-bold ${getEngagementColor(data.engagement)}`}>
                            {data.engagement}%
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Reach</p>
                          <p className="text-lg font-bold text-blue-600">
                            {data.reach.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Impressions</p>
                          <p className="text-lg font-bold text-purple-600">
                            {data.impressions.toLocaleString()}
                          </p>
                        </div>
                        <div className="text-center">
                          <p className="text-sm text-gray-600">Viral Score</p>
                          <p className={`text-lg font-bold ${getViralScoreColor(data.viralScore)}`}>
                            {data.viralScore}%
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Performance Insights */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Content</h3>
                  <div className="space-y-3">
                    {analyticsData[0]?.topContent.slice(0, 3).map((content) => (
                      <div key={content.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.platform} • {content.contentType}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium">{content.views.toLocaleString()} views</p>
                          <p className={`text-xs ${getEngagementColor(content.engagement)}`}>
                            {content.engagement}% engagement
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Insights</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-green-800">Growing Strong</h4>
                        <p className="text-sm text-green-700">Your engagement rate is above average for your niche</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                      <Eye className="w-5 h-5 text-blue-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-blue-800">High Reach</h4>
                        <p className="text-sm text-blue-700">Your content is reaching a broad audience</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                      <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-800">Optimization Tip</h4>
                        <p className="text-sm text-yellow-700">Try posting more video content to boost engagement</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="content" className="space-y-6">
              {/* Content Analytics */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Performance</h3>
                <div className="space-y-4">
                  {analyticsData.flatMap(data => data.topContent).map((content) => (
                    <div key={content.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-gray-900">{content.title}</h4>
                          <p className="text-sm text-gray-600">{content.platform} • {content.contentType}</p>
                        </div>
                        <Badge className={getViralScoreColor(content.viralScore)}>
                          {content.viralScore}% viral
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-5 gap-4 text-sm">
                        <div className="text-center">
                          <p className="text-gray-600">Views</p>
                          <p className="font-medium">{content.views.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Likes</p>
                          <p className="font-medium">{content.likes.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Shares</p>
                          <p className="font-medium">{content.shares.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Comments</p>
                          <p className="font-medium">{content.comments.toLocaleString()}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-gray-600">Engagement</p>
                          <p className={`font-medium ${getEngagementColor(content.engagement)}`}>
                            {content.engagement}%
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
                    {analyticsData[0]?.audienceDemographics.ageGroups.map((group) => (
                      <div key={group.range} className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{group.range}</span>
                        <div className="flex items-center gap-2">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full"
                              style={{ width: `${group.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium">{group.percentage}%</span>
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
