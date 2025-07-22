"use client";

import { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Zap,
  Target,
  BarChart3,
  Activity,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  Clock,
  Globe,
  Smartphone,
  Play,
  MessageCircle,
  Bookmark,
  Download,
  Filter,
  RefreshCw,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import ViralScoreMeter from "./viral-score-meter";
import { createClient } from "../../supabase/client";
import Link from "next/link";
import { Lock, Crown } from "lucide-react";
import { FeatureAccess } from "@/utils/feature-access";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = targetValue / 60;
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setAnimatedValue(targetValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 25);
    }, Math.random() * 500);

    return () => clearTimeout(timer);
  }, [targetValue]);

  return (
    <div className="glass-premium p-6 hover-lift preview-hover group">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          <div className="text-white">{icon}</div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full ${
            trend === "up"
              ? "text-green-600 bg-green-50"
              : "text-red-600 bg-red-50"
          }`}
        >
          {trend === "up" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
          {change}
        </div>
      </div>
      <div className="space-y-2">
        <p className="text-2xl font-bold text-gray-900">
          {value.includes("K") || value.includes("M") || value.includes("$")
            ? value
            : animatedValue.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

function AnalyticsChart() {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dataPoints = [45, 52, 48, 61, 58, 72, 69, 78, 85, 92, 88, 95];
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div className="glass-premium p-8 hover-lift">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Growth Analytics
          </h3>
          <p className="text-gray-600 text-sm">Monthly performance overview</p>
        </div>
        <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
          <TrendingUp className="w-4 h-4" />
          <span className="text-sm font-semibold">+127% YoY</span>
        </div>
      </div>

      <div className="h-64 flex items-end justify-between gap-3 mb-4">
        {dataPoints.map((height, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg transition-all duration-1000 ease-out shadow-lg"
              style={{
                height: animateChart ? `${height}%` : "0%",
                transitionDelay: `${index * 100}ms`,
              }}
            />
            <span className="text-xs text-gray-500 mt-2 font-medium">
              {months[index]}
            </span>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-100">
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">2.4M</div>
          <div className="text-xs text-gray-600">Total Views</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">8.7%</div>
          <div className="text-xs text-gray-600">Engagement</div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-gray-900">127K</div>
          <div className="text-xs text-gray-600">New Followers</div>
        </div>
      </div>
    </div>
  );
}

function RealtimeActivity() {
  const [activities] = useState([
    {
      action: "New follower gained",
      user: "@sarah_creates",
      time: "2 min ago",
      type: "follower",
      color: "bg-blue-500",
    },
    {
      action: "Post went viral",
      user: "@viral_marcus",
      time: "5 min ago",
      type: "viral",
      color: "bg-red-500",
    },
    {
      action: "Revenue milestone",
      user: "@emma_lifestyle",
      time: "8 min ago",
      type: "revenue",
      color: "bg-green-500",
    },
    {
      action: "Engagement spike",
      user: "@tech_alex",
      time: "12 min ago",
      type: "engagement",
      color: "bg-purple-500",
    },
  ]);

  return (
    <div className="glass-premium p-6 hover-lift">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
          <p className="text-gray-600 text-sm">Real-time updates</p>
        </div>
      </div>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-3 bg-white/50 rounded-xl hover:bg-white/70 transition-colors"
          >
            <div
              className={`w-3 h-3 ${activity.color} rounded-full animate-pulse`}
            />
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">
                {activity.action}
              </p>
              <p className="text-xs text-gray-600">{activity.user}</p>
            </div>
            <span className="text-xs text-gray-500">{activity.time}</span>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Active users</span>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="font-semibold text-gray-900">1,247 online</span>
          </div>
        </div>
      </div>
    </div>
  );
}

interface DashboardAnalyticsProps {
  userId: string;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
  className?: string;
  featureAccess: FeatureAccess;
}

function LockedFeatureOverlay() {
  return (
    <div className="absolute inset-0 bg-white/90 backdrop-blur-sm flex items-center justify-center z-10 rounded-lg">
      <div className="text-center p-8">
        <Lock className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Premium Feature
        </h3>
        <p className="text-gray-600 mb-4">
          Upgrade to access advanced analytics
        </p>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default function DashboardAnalytics({
  userId,
  hasActiveSubscription,
  subscriptionTier,
  className = "",
  featureAccess,
}: DashboardAnalyticsProps) {
  const [timeRange, setTimeRange] = useState("30d");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const [realTimeData, setRealTimeData] = useState({
    followers: 127543,
    views: 2456789,
    engagement: 8.7,
    revenue: 12450,
    viralScore: 87,
  });
  const [predictiveInsights, setPredictiveInsights] = useState({
    nextViralContent: "Tutorial-style videos",
    bestPostingTime: "Tuesday 2:00 PM",
    growthPrediction: "+34% next month",
    audienceGrowth: "127 new followers/day",
  });
  const supabase = createClient();

  // Enhanced analytics data with more detailed metrics
  const [analyticsData, setAnalyticsData] = useState({
    overview: {
      totalFollowers: 127543,
      monthlyViews: 2456789,
      engagementRate: 8.7,
      revenue: 12450,
      growth: {
        followers: 23.4,
        views: 45.2,
        engagement: 12.1,
        revenue: 67.8,
      },
    },
    platforms: {
      tiktok: { followers: 85432, engagement: 9.2, views: 1234567 },
      instagram: { followers: 32109, engagement: 7.8, views: 876543 },
      youtube: { followers: 10002, engagement: 12.4, views: 345679 },
    },
    topContent: [
      {
        title: "Morning Routine Hack",
        platform: "tiktok",
        views: 234567,
        engagement: 12.3,
        viralScore: 94,
      },
      {
        title: "Productivity Tips",
        platform: "instagram",
        views: 123456,
        engagement: 8.9,
        viralScore: 78,
      },
      {
        title: "Life Changing Advice",
        platform: "youtube",
        views: 87654,
        engagement: 15.2,
        viralScore: 89,
      },
    ],
    demographics: {
      ageGroups: {
        "18-24": 35,
        "25-34": 42,
        "35-44": 18,
        "45+": 5,
      },
      topCountries: [
        { country: "United States", percentage: 45 },
        { country: "United Kingdom", percentage: 18 },
        { country: "Canada", percentage: 12 },
        { country: "Australia", percentage: 8 },
      ],
    },
    bestTimes: {
      days: ["Tuesday", "Wednesday", "Thursday"],
      hours: ["2:00 PM", "7:00 PM", "9:00 PM"],
    },
  });

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 10),
        views: prev.views + Math.floor(Math.random() * 100),
        engagement: prev.engagement + (Math.random() - 0.5) * 0.1,
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with Controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Track your performance across all platforms
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Select value={timeRange} onValueChange={setTimeRange}>
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

          <Button
            variant="outline"
            size="sm"
            onClick={refreshData}
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 relative">
        <MetricCard
          title="Total Followers"
          value="---"
          change="---%"
          trend="up"
          icon={<Users className="w-5 h-5" />}
          color="from-gray-400 to-gray-500"
        />
        <MetricCard
          title="Monthly Views"
          value="---"
          change="---%"
          trend="up"
          icon={<Eye className="w-5 h-5" />}
          color="from-gray-400 to-gray-500"
        />
        <MetricCard
          title="Engagement Rate"
          value="---%"
          change="---%"
          trend="up"
          icon={<Heart className="w-5 h-5" />}
          color="from-gray-400 to-gray-500"
        />
        <MetricCard
          title="Revenue"
          value="$---"
          change="---%"
          trend="up"
          icon={<DollarSign className="w-5 h-5" />}
          color="from-gray-400 to-gray-500"
        />
        <LockedFeatureOverlay />
      </div>

      {/* Main Analytics Tabs */}
      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="audience">Audience</TabsTrigger>
          <TabsTrigger value="revenue">Revenue</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6 relative">
            {/* Growth Chart */}
            <div className="md:col-span-2 relative">
              <div className="filter blur-sm opacity-50">
                <AnalyticsChart />
              </div>
              <LockedFeatureOverlay />
            </div>

            {/* Enhanced Viral Score Meter */}
            <Card className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200 relative">
              <div className="filter blur-sm opacity-50">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Zap className="w-5 h-5 text-gray-600" />
                  Real-Time Viral Score
                </h3>
                <ViralScoreMeter score={0} size="lg" />
                <div className="mt-4 text-center">
                  <div className="text-sm text-gray-600 mb-2">
                    Score updates every 5 minutes
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <div className="w-2 h-2 bg-gray-500 rounded-full" />
                    <span>Premium feature</span>
                  </div>
                </div>
              </div>
              <LockedFeatureOverlay />
            </Card>
          </div>

          {/* Platform Breakdown */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Platform Performance
            </h3>
            <div className="grid md:grid-cols-3 gap-6">
              {Object.entries(analyticsData.platforms).map(
                ([platform, data]) => {
                  const platformInfo = {
                    tiktok: {
                      name: "TikTok",
                      icon: "🎵",
                      color: "bg-pink-500",
                    },
                    instagram: {
                      name: "Instagram",
                      icon: "📸",
                      color: "bg-purple-500",
                    },
                    youtube: {
                      name: "YouTube",
                      icon: "📺",
                      color: "bg-red-500",
                    },
                  }[platform];

                  return (
                    <div key={platform} className="bg-gray-50 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div
                          className={`w-8 h-8 ${platformInfo?.color} rounded-lg flex items-center justify-center text-white text-sm`}
                        >
                          {platformInfo?.icon}
                        </div>
                        <h4 className="font-medium text-gray-900">
                          {platformInfo?.name}
                        </h4>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Followers</span>
                          <span className="font-medium">
                            {data.followers.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Engagement</span>
                          <span className="font-medium">
                            {data.engagement}%
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Views</span>
                          <span className="font-medium">
                            {(data.views / 1000).toFixed(0)}K
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                },
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-6">
          {/* Top Performing Content */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Top Performing Content
            </h3>
            <div className="space-y-4">
              {analyticsData.topContent.map((content, index) => {
                const platformInfo = {
                  tiktok: { name: "TikTok", icon: "🎵", color: "bg-pink-500" },
                  instagram: {
                    name: "Instagram",
                    icon: "📸",
                    color: "bg-purple-500",
                  },
                  youtube: { name: "YouTube", icon: "📺", color: "bg-red-500" },
                }[content.platform];

                return (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-10 h-10 ${platformInfo?.color} rounded-lg flex items-center justify-center text-white`}
                      >
                        {platformInfo?.icon}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {content.title}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {content.views.toLocaleString()} views
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {content.engagement}% engagement
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium ${
                          content.viralScore >= 80
                            ? "bg-green-100 text-green-700"
                            : content.viralScore >= 60
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        <Zap className="w-3 h-3 inline mr-1" />
                        {content.viralScore}% viral
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Best Posting Times */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Optimal Posting Times
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Best Days
                </h4>
                <div className="space-y-2">
                  {analyticsData.bestTimes.days.map((day, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-blue-50 rounded"
                    >
                      <span className="text-sm font-medium">{day}</span>
                      <span className="text-xs text-blue-600">
                        Peak engagement
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Best Hours
                </h4>
                <div className="space-y-2">
                  {analyticsData.bestTimes.hours.map((hour, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 bg-green-50 rounded"
                    >
                      <span className="text-sm font-medium">{hour}</span>
                      <span className="text-xs text-green-600">
                        High activity
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          {/* Demographics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Age Demographics
              </h3>
              <div className="space-y-3">
                {Object.entries(analyticsData.demographics.ageGroups).map(
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

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Top Countries
              </h3>
              <div className="space-y-3">
                {analyticsData.demographics.topCountries.map(
                  (country, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-3">
                        <Globe className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium text-gray-700">
                          {country.country}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {country.percentage}%
                      </span>
                    </div>
                  ),
                )}
              </div>
            </Card>
          </div>

          {/* Real-time Activity */}
          <RealtimeActivity />
        </TabsContent>

        <TabsContent value="revenue" className="space-y-6">
          {/* Revenue Analytics */}
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Revenue Breakdown
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-medium">Sponsorships</span>
                  </div>
                  <span className="font-bold text-green-600">$8,200</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Smartphone className="w-5 h-5 text-blue-600" />
                    <span className="font-medium">Creator Fund</span>
                  </div>
                  <span className="font-bold text-blue-600">$2,850</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <Share2 className="w-5 h-5 text-purple-600" />
                    <span className="font-medium">Affiliate</span>
                  </div>
                  <span className="font-bold text-purple-600">$1,400</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Earnings Forecast
              </h3>
              <div className="text-center">
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  $18,750
                </div>
                <div className="text-sm text-gray-600 mb-4">
                  Projected next month
                </div>
                <div className="flex items-center justify-center gap-2 text-green-600">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-sm font-medium">
                    +34% growth expected
                  </span>
                </div>
              </div>
            </Card>
          </div>

          {/* AI Predictive Insights */}
          {hasActiveSubscription && (
            <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                AI Predictive Insights
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Next Viral Content Type
                    </span>
                    <span className="text-sm font-bold text-purple-600">
                      {predictiveInsights.nextViralContent}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Optimal Posting Time
                    </span>
                    <span className="text-sm font-bold text-blue-600">
                      {predictiveInsights.bestPostingTime}
                    </span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Growth Prediction
                    </span>
                    <span className="text-sm font-bold text-green-600">
                      {predictiveInsights.growthPrediction}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-white/70 rounded-lg">
                    <span className="text-sm font-medium text-gray-700">
                      Daily Follower Growth
                    </span>
                    <span className="text-sm font-bold text-orange-600">
                      {predictiveInsights.audienceGrowth}
                    </span>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
