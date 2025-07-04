"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Users,
  TrendingUp,
  Globe,
  Clock,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  Target,
  Zap,
  Calendar,
  BarChart3,
  PieChart,
  Activity,
  Smartphone,
  Monitor,
  Tablet,
  MapPin,
  Star,
  ThumbsUp,
  RefreshCw,
  Download,
  Filter,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  Video,
  FileText,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface AudienceInsightsProps {
  userId: string;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

interface DemographicData {
  ageGroups: Record<string, number>;
  genders: Record<string, number>;
  locations: Array<{ country: string; percentage: number; growth: number }>;
  languages: Record<string, number>;
  interests: Array<{
    category: string;
    percentage: number;
    engagement: number;
  }>;
}

interface BehaviorData {
  activeHours: Record<string, number>;
  activeDays: Record<string, number>;
  deviceTypes: Record<string, number>;
  sessionDuration: number;
  bounceRate: number;
  returnVisitorRate: number;
}

interface EngagementData {
  totalEngagements: number;
  engagementRate: number;
  avgLikesPerPost: number;
  avgCommentsPerPost: number;
  avgSharesPerPost: number;
  topEngagers: Array<{ username: string; engagements: number; type: string }>;
}

interface ContentPreferences {
  contentTypes: Record<string, number>;
  topicPreferences: Array<{
    topic: string;
    engagement: number;
    growth: number;
  }>;
  hashtagPerformance: Array<{
    hashtag: string;
    reach: number;
    engagement: number;
  }>;
  optimalPostLength: { min: number; max: number; avg: number };
}

export default function AudienceInsights({
  userId,
  hasActiveSubscription,
  subscriptionTier,
}: AudienceInsightsProps) {
  const [demographics, setDemographics] = useState<DemographicData | null>(
    null,
  );
  const [behavior, setBehavior] = useState<BehaviorData | null>(null);
  const [engagement, setEngagement] = useState<EngagementData | null>(null);
  const [contentPrefs, setContentPrefs] = useState<ContentPreferences | null>(
    null,
  );
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTimeRange, setSelectedTimeRange] = useState("30d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [activeTab, setActiveTab] = useState("demographics");
  const supabase = createClient();

  useEffect(() => {
    loadAudienceData();
  }, [selectedTimeRange, selectedPlatform]);

  const loadAudienceData = async () => {
    setIsLoading(true);
    try {
      // Simulate loading real audience data
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock demographic data
      setDemographics({
        ageGroups: {
          "13-17": 8,
          "18-24": 35,
          "25-34": 42,
          "35-44": 12,
          "45-54": 2,
          "55+": 1,
        },
        genders: {
          Female: 58,
          Male: 40,
          "Non-binary": 2,
        },
        locations: [
          { country: "United States", percentage: 45, growth: 12 },
          { country: "United Kingdom", percentage: 18, growth: 8 },
          { country: "Canada", percentage: 12, growth: 15 },
          { country: "Australia", percentage: 8, growth: 22 },
          { country: "Germany", percentage: 7, growth: -3 },
          { country: "France", percentage: 5, growth: 5 },
          { country: "Brazil", percentage: 3, growth: 28 },
          { country: "India", percentage: 2, growth: 45 },
        ],
        languages: {
          English: 78,
          Spanish: 12,
          French: 5,
          German: 3,
          Portuguese: 2,
        },
        interests: [
          { category: "Lifestyle", percentage: 68, engagement: 8.5 },
          { category: "Technology", percentage: 45, engagement: 12.3 },
          { category: "Fitness", percentage: 38, engagement: 9.8 },
          { category: "Travel", percentage: 32, engagement: 11.2 },
          { category: "Food", percentage: 28, engagement: 7.9 },
          { category: "Fashion", percentage: 25, engagement: 6.4 },
          { category: "Business", percentage: 22, engagement: 14.1 },
          { category: "Entertainment", percentage: 18, engagement: 5.7 },
        ],
      });

      // Mock behavior data
      setBehavior({
        activeHours: {
          "0": 2,
          "1": 1,
          "2": 1,
          "3": 1,
          "4": 2,
          "5": 3,
          "6": 8,
          "7": 15,
          "8": 22,
          "9": 18,
          "10": 12,
          "11": 10,
          "12": 25,
          "13": 28,
          "14": 32,
          "15": 20,
          "16": 18,
          "17": 22,
          "18": 35,
          "19": 42,
          "20": 38,
          "21": 28,
          "22": 15,
          "23": 8,
        },
        activeDays: {
          Monday: 85,
          Tuesday: 92,
          Wednesday: 88,
          Thursday: 95,
          Friday: 78,
          Saturday: 65,
          Sunday: 72,
        },
        deviceTypes: {
          Mobile: 78,
          Desktop: 18,
          Tablet: 4,
        },
        sessionDuration: 4.2, // minutes
        bounceRate: 32, // percentage
        returnVisitorRate: 68, // percentage
      });

      // Mock engagement data
      setEngagement({
        totalEngagements: 125430,
        engagementRate: 8.7,
        avgLikesPerPost: 1250,
        avgCommentsPerPost: 89,
        avgSharesPerPost: 156,
        topEngagers: [
          { username: "@sarah_creates", engagements: 2340, type: "Super Fan" },
          { username: "@tech_enthusiast", engagements: 1890, type: "Regular" },
          {
            username: "@lifestyle_guru",
            engagements: 1650,
            type: "Influencer",
          },
          { username: "@creative_mind", engagements: 1420, type: "Regular" },
          { username: "@trend_setter", engagements: 1280, type: "Super Fan" },
        ],
      });

      // Mock content preferences
      setContentPrefs({
        contentTypes: {
          Video: 65,
          Image: 25,
          Carousel: 8,
          Text: 2,
        },
        topicPreferences: [
          { topic: "Productivity Tips", engagement: 12.5, growth: 25 },
          { topic: "Morning Routines", engagement: 11.8, growth: 18 },
          { topic: "Tech Reviews", engagement: 10.9, growth: -5 },
          { topic: "Life Hacks", engagement: 9.7, growth: 32 },
          { topic: "Motivation", engagement: 8.4, growth: 12 },
          { topic: "Behind the Scenes", engagement: 7.9, growth: 45 },
        ],
        hashtagPerformance: [
          { hashtag: "#productivity", reach: 45000, engagement: 8.9 },
          { hashtag: "#lifehacks", reach: 38000, engagement: 12.3 },
          { hashtag: "#motivation", reach: 32000, engagement: 7.8 },
          { hashtag: "#morningroutine", reach: 28000, engagement: 11.2 },
          { hashtag: "#viral", reach: 25000, engagement: 15.6 },
        ],
        optimalPostLength: { min: 50, max: 150, avg: 95 },
      });
    } catch (error) {
      console.error("Error loading audience data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exportData = () => {
    const data = {
      demographics,
      behavior,
      engagement,
      contentPrefs,
      exportedAt: new Date().toISOString(),
      timeRange: selectedTimeRange,
      platform: selectedPlatform,
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `audience-insights-${new Date().toISOString().split("T")[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!hasActiveSubscription) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <Users className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Advanced Audience Insights
        </h3>
        <p className="text-gray-600 mb-6">
          Get deep insights into your audience demographics, behavior, and
          preferences
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <BarChart3 className="w-4 h-4" />
            <span>Demographic analysis</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Activity className="w-4 h-4" />
            <span>Behavior tracking</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Heart className="w-4 h-4" />
            <span>Engagement insights</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>Content preferences</span>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Star className="w-4 h-4 mr-2" />
          Upgrade for Audience Insights
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Loading audience insights...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-purple-600" />
            Audience Insights
          </h2>
          <p className="text-gray-600">
            Deep dive into your audience demographics and behavior
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedTimeRange}
            onValueChange={setSelectedTimeRange}
          >
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7d">Last 7 days</SelectItem>
              <SelectItem value="30d">Last 30 days</SelectItem>
              <SelectItem value="90d">Last 3 months</SelectItem>
              <SelectItem value="1y">Last year</SelectItem>
            </SelectContent>
          </Select>
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              <SelectItem value="instagram">📸 Instagram</SelectItem>
              <SelectItem value="youtube">📺 YouTube</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={exportData} variant="outline" size="sm">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button onClick={loadAudienceData} variant="outline" size="sm">
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {engagement?.totalEngagements.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total Engagements</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-green-100 rounded-lg">
              <Heart className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {engagement?.engagementRate}%
              </div>
              <div className="text-sm text-gray-600">Engagement Rate</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Clock className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {behavior?.sessionDuration}m
              </div>
              <div className="text-sm text-gray-600">Avg Session</div>
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-orange-100 rounded-lg">
              <TrendingUp className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">
                {behavior?.returnVisitorRate}%
              </div>
              <div className="text-sm text-gray-600">Return Rate</div>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Insights Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="demographics">Demographics</TabsTrigger>
          <TabsTrigger value="behavior">Behavior</TabsTrigger>
          <TabsTrigger value="engagement">Engagement</TabsTrigger>
          <TabsTrigger value="content">Content Prefs</TabsTrigger>
        </TabsList>

        <TabsContent value="demographics" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {/* Age Groups */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Age Distribution
              </h3>
              <div className="space-y-3">
                {demographics &&
                  Object.entries(demographics.ageGroups).map(
                    ([age, percentage]) => (
                      <div
                        key={age}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {age}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-blue-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </Card>

            {/* Gender Distribution */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Gender Distribution
              </h3>
              <div className="space-y-3">
                {demographics &&
                  Object.entries(demographics.genders).map(
                    ([gender, percentage]) => (
                      <div
                        key={gender}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {gender}
                        </span>
                        <div className="flex items-center gap-3">
                          <div className="w-24 bg-gray-200 rounded-full h-2">
                            <div
                              className="bg-purple-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-900 w-8">
                            {percentage}%
                          </span>
                        </div>
                      </div>
                    ),
                  )}
              </div>
            </Card>
          </div>

          {/* Geographic Distribution */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Geographic Distribution
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {demographics?.locations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span className="font-medium text-gray-900">
                      {location.country}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-900">
                      {location.percentage}%
                    </span>
                    <div
                      className={`flex items-center gap-1 text-xs ${
                        location.growth > 0 ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {location.growth > 0 ? (
                        <ArrowUp className="w-3 h-3" />
                      ) : (
                        <ArrowDown className="w-3 h-3" />
                      )}
                      {Math.abs(location.growth)}%
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Interests */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Audience Interests
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {demographics?.interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {interest.category}
                    </div>
                    <div className="text-sm text-gray-600">
                      {interest.percentage}% interested
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-green-600">
                      {interest.engagement}% engagement
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="behavior" className="space-y-6">
          {/* Device Usage */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Device Usage
              </h3>
              <div className="space-y-3">
                {behavior &&
                  Object.entries(behavior.deviceTypes).map(
                    ([device, percentage]) => {
                      const icons = {
                        Mobile: Smartphone,
                        Desktop: Monitor,
                        Tablet: Tablet,
                      };
                      const Icon =
                        icons[device as keyof typeof icons] || Smartphone;

                      return (
                        <div
                          key={device}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {device}
                            </span>
                          </div>
                          <span className="text-sm font-medium text-gray-900">
                            {percentage}%
                          </span>
                        </div>
                      );
                    },
                  )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Session Metrics
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Avg Session Duration
                  </span>
                  <span className="font-semibold text-gray-900">
                    {behavior?.sessionDuration}m
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Bounce Rate</span>
                  <span className="font-semibold text-gray-900">
                    {behavior?.bounceRate}%
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Return Visitors</span>
                  <span className="font-semibold text-green-600">
                    {behavior?.returnVisitorRate}%
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Best Days
              </h3>
              <div className="space-y-2">
                {behavior &&
                  Object.entries(behavior.activeDays)
                    .sort(([, a], [, b]) => b - a)
                    .slice(0, 3)
                    .map(([day, activity]) => (
                      <div
                        key={day}
                        className="flex items-center justify-between p-2 bg-green-50 rounded"
                      >
                        <span className="text-sm font-medium text-gray-700">
                          {day}
                        </span>
                        <span className="text-sm font-medium text-green-600">
                          {activity}% active
                        </span>
                      </div>
                    ))}
              </div>
            </Card>
          </div>

          {/* Activity Heatmap */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Activity Throughout the Day
            </h3>
            <div className="grid grid-cols-12 gap-1 mb-4">
              {behavior &&
                Object.entries(behavior.activeHours).map(([hour, activity]) => {
                  const intensity = Math.min((activity / 45) * 100, 100); // Normalize to max activity
                  return (
                    <div
                      key={hour}
                      className="h-8 rounded flex items-center justify-center text-xs font-medium transition-all duration-300 hover:scale-110"
                      style={{
                        backgroundColor: `rgba(59, 130, 246, ${intensity / 100})`,
                        color: intensity > 50 ? "white" : "#374151",
                      }}
                      title={`${hour}:00 - ${activity}% active`}
                    >
                      {hour}
                    </div>
                  );
                })}
            </div>
            <div className="text-center text-sm text-gray-600">
              Peak activity: 7-9 PM • Lowest activity: 1-5 AM
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="engagement" className="space-y-6">
          {/* Engagement Metrics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-5 h-5 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900">Likes</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {engagement?.avgLikesPerPost.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Average per post</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Comments
                </h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {engagement?.avgCommentsPerPost}
              </div>
              <div className="text-sm text-gray-600">Average per post</div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <Share2 className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">Shares</h3>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                {engagement?.avgSharesPerPost}
              </div>
              <div className="text-sm text-gray-600">Average per post</div>
            </Card>
          </div>

          {/* Top Engagers */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Engagers
            </h3>
            <div className="space-y-3">
              {engagement?.topEngagers.map((engager, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {engager.username}
                      </div>
                      <div className="text-sm text-gray-600">
                        {engager.type}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-gray-900">
                      {engager.engagements.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">engagements</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Content Type Preferences */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Content Type Performance
              </h3>
              <div className="space-y-3">
                {contentPrefs &&
                  Object.entries(contentPrefs.contentTypes).map(
                    ([type, percentage]) => {
                      const icons = {
                        Video: Video,
                        Image: Eye,
                        Carousel: PieChart,
                        Text: FileText,
                      };
                      const Icon =
                        icons[type as keyof typeof icons] || FileText;

                      return (
                        <div
                          key={type}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <Icon className="w-4 h-4 text-gray-500" />
                            <span className="text-sm font-medium text-gray-700">
                              {type}
                            </span>
                          </div>
                          <div className="flex items-center gap-3">
                            <div className="w-24 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-green-500 h-2 rounded-full transition-all duration-500"
                                style={{ width: `${percentage}%` }}
                              />
                            </div>
                            <span className="text-sm font-medium text-gray-900 w-8">
                              {percentage}%
                            </span>
                          </div>
                        </div>
                      );
                    },
                  )}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Optimal Post Length
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Minimum</span>
                  <span className="font-semibold text-gray-900">
                    {contentPrefs?.optimalPostLength.min} chars
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Maximum</span>
                  <span className="font-semibold text-gray-900">
                    {contentPrefs?.optimalPostLength.max} chars
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Sweet Spot</span>
                  <span className="font-semibold text-green-600">
                    {contentPrefs?.optimalPostLength.avg} chars
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* Topic Preferences */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Topic Performance
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {contentPrefs?.topicPreferences.map((topic, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <div>
                    <div className="font-medium text-gray-900">
                      {topic.topic}
                    </div>
                    <div className="text-sm text-gray-600">
                      {topic.engagement}% engagement
                    </div>
                  </div>
                  <div
                    className={`flex items-center gap-1 text-sm ${
                      topic.growth > 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {topic.growth > 0 ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    {Math.abs(topic.growth)}%
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Hashtag Performance */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performing Hashtags
            </h3>
            <div className="space-y-3">
              {contentPrefs?.hashtagPerformance.map((hashtag, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-blue-50 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                      #{index + 1}
                    </div>
                    <div>
                      <div className="font-medium text-blue-900">
                        {hashtag.hashtag}
                      </div>
                      <div className="text-sm text-blue-700">
                        {hashtag.reach.toLocaleString()} reach
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-blue-900">
                      {hashtag.engagement}%
                    </div>
                    <div className="text-sm text-blue-700">engagement</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
