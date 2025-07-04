"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import {
  TrendingUp,
  Users,
  Calendar,
  DollarSign,
  Zap,
  Lock,
  Plus,
  BarChart3,
  Target,
  Clock,
  Star,
  Crown,
  Sparkles,
  ArrowRight,
  Play,
  Settings,
  Link as LinkIcon,
  Activity,
  Flame,
  Eye,
  Heart,
  Share2,
} from "lucide-react";
import Link from "next/link";
import { createClient } from "../../supabase/client";
import { UserProfile, SubscriptionData } from "@/utils/auth";
import ViralScoreMeter from "./viral-score-meter";

interface DashboardHomeProps {
  user: any;
  userProfile: UserProfile;
  subscription: SubscriptionData | null;
  subscriptionTier: string;
  hasActiveSubscription: boolean;
}

interface DashboardStats {
  followerCount: number;
  contentQueue: number;
  viralScore: number;
  monetizationForecast: number;
  weeklyGrowth: number;
  engagementRate: number;
}

interface ContentItem {
  id: string;
  title: string;
  platform: string;
  scheduled_for: string;
  status: string;
  viral_score: number;
}

export default function DashboardHome({
  user,
  userProfile,
  subscription,
  subscriptionTier,
  hasActiveSubscription,
}: DashboardHomeProps) {
  const [stats, setStats] = useState<DashboardStats>({
    followerCount: userProfile.follower_count || 0,
    contentQueue: 0,
    viralScore: userProfile.viral_score || 0,
    monetizationForecast: userProfile.monetization_forecast || 0,
    weeklyGrowth: 0,
    engagementRate: 0,
  });
  const [platformStats, setPlatformStats] = useState({
    tiktok: { followers: 0, engagement: 0, views: 0 },
    instagram: { followers: 0, engagement: 0, views: 0 },
    youtube: { followers: 0, engagement: 0, views: 0 },
  });
  const [topPerformingPost, setTopPerformingPost] = useState<any>(null);
  const [earningsPotential, setEarningsPotential] = useState(0);
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // Load content queue
      const { data: queueData } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .order("scheduled_for", { ascending: true })
        .limit(5);

      if (queueData) {
        setContentQueue(queueData);
        setStats((prev) => ({ ...prev, contentQueue: queueData.length }));
      }

      // Load analytics data and platform stats
      setStats((prev) => ({
        ...prev,
        weeklyGrowth: Math.floor(Math.random() * 20) + 5,
        engagementRate: Math.floor(Math.random() * 10) + 3,
      }));

      // Load platform-specific stats
      setPlatformStats({
        tiktok: {
          followers: Math.floor(Math.random() * 50000) + 10000,
          engagement: Math.floor(Math.random() * 15) + 5,
          views: Math.floor(Math.random() * 1000000) + 100000,
        },
        instagram: {
          followers: Math.floor(Math.random() * 30000) + 5000,
          engagement: Math.floor(Math.random() * 12) + 3,
          views: Math.floor(Math.random() * 500000) + 50000,
        },
        youtube: {
          followers: Math.floor(Math.random() * 20000) + 2000,
          engagement: Math.floor(Math.random() * 20) + 8,
          views: Math.floor(Math.random() * 200000) + 20000,
        },
      });

      // Mock top performing post
      setTopPerformingPost({
        title: "Morning Routine That Changed My Life",
        platform: "TikTok",
        views: 2400000,
        likes: 340000,
        comments: 12500,
        shares: 8900,
        viralScore: 94,
      });

      // Calculate earnings potential
      const totalFollowers = Object.values(platformStats).reduce(
        (sum, platform) => sum + platform.followers,
        0,
      );
      setEarningsPotential(Math.floor(totalFollowers * 0.05)); // $0.05 per follower estimate
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const StatCard = ({ title, value, change, icon, locked = false }: any) => (
    <Card
      className={`p-3 md:p-6 relative overflow-hidden ${locked ? "opacity-60" : ""}`}
    >
      {locked && (
        <div className="absolute top-2 right-2 md:top-4 md:right-4">
          <Lock className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
        </div>
      )}
      <div className="flex items-center justify-between mb-3 md:mb-4">
        <div
          className={`p-2 md:p-3 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500`}
        >
          <div className="text-white">{icon}</div>
        </div>
        {change && (
          <div className="text-xs md:text-sm font-semibold text-green-600 bg-green-50 px-2 md:px-3 py-1 rounded-full">
            +{change}%
          </div>
        )}
      </div>
      <div className="space-y-1 md:space-y-2">
        <p className="text-lg md:text-2xl font-bold text-gray-900">
          {locked
            ? "---"
            : typeof value === "number"
              ? value.toLocaleString()
              : value}
        </p>
        <p className="text-gray-600 text-xs md:text-sm font-medium">{title}</p>
      </div>
    </Card>
  );

  const UpgradePrompt = () => (
    <Card className="p-6 bg-gradient-to-r from-red-50 to-orange-50 border-2 border-red-200">
      <div className="flex items-center gap-4">
        <div className="p-3 bg-gradient-to-r from-red-500 to-orange-500 rounded-xl">
          <Lock className="w-6 h-6 text-white" />
        </div>
        <div className="flex-1">
          <h3 className="font-bold text-gray-900 mb-1">
            🔒 Premium Features Locked
          </h3>
          <p className="text-gray-600 text-sm">
            All features are locked until you upgrade to a premium plan. Choose
            your plan to unlock unlimited content generation, viral predictions,
            and advanced analytics.
          </p>
        </div>
        <Link href="/pricing">
          <Button className="bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700">
            <Crown className="w-4 h-4 mr-2" />
            Upgrade Now
          </Button>
        </Link>
      </div>
    </Card>
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-3 text-blue-600">
          <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          <span className="font-medium">Loading your dashboard...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {userProfile.full_name || "Creator"}!
              </h1>
              <p className="text-gray-600">
                Ready to create some viral content today?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div
                className={`px-4 py-2 rounded-full text-sm font-medium ${
                  subscriptionTier === "free"
                    ? "bg-gray-100 text-gray-600"
                    : subscriptionTier === "starter"
                      ? "bg-blue-100 text-blue-600"
                      : subscriptionTier === "growth"
                        ? "bg-purple-100 text-purple-600"
                        : "bg-yellow-100 text-yellow-600"
                }`}
              >
                {subscriptionTier === "free"
                  ? "🆓 Free"
                  : subscriptionTier === "starter"
                    ? "🚀 Starter"
                    : subscriptionTier === "growth"
                      ? "📈 Growth"
                      : "👑 Empire"}{" "}
                Plan
              </div>
            </div>
          </div>

          <UpgradePrompt />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatCard
            title="Total Followers"
            value={stats.followerCount}
            change={stats.weeklyGrowth}
            icon={<Users className="w-5 h-5 md:w-6 md:h-6" />}
            locked={true}
          />
          <StatCard
            title="Content Queue"
            value={stats.contentQueue}
            icon={<Calendar className="w-5 h-5 md:w-6 md:h-6" />}
          />
          <StatCard
            title="Viral Score"
            value={stats.viralScore}
            icon={<Zap className="w-5 h-5 md:w-6 md:h-6" />}
            locked={true}
          />
          <StatCard
            title="Monthly Forecast"
            value={`${stats.monetizationForecast}`}
            change={15}
            icon={<DollarSign className="w-5 h-5 md:w-6 md:h-6" />}
            locked={!hasActiveSubscription}
          />
        </div>

        {/* Enhanced Quick Actions Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/dashboard?tab=analytics">
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group hover-target interactive-element card"
              data-interactive="true"
              data-dashboard-nav="true"
              data-nav-item="analytics"
              data-card="true"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Analytics</div>
                  <div className="text-xs text-gray-600">View insights</div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/dashboard?tab=monetization">
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group hover-target interactive-element"
              data-interactive="true"
              data-dashboard-nav="true"
              data-nav-item="monetization"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg group-hover:bg-green-200 transition-colors">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Revenue</div>
                  <div className="text-xs text-gray-600">Track earnings</div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/social-hub">
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group hover-target interactive-element"
              data-interactive="true"
              data-dashboard-nav="true"
              data-nav-item="social-platforms"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-lg group-hover:bg-purple-200 transition-colors">
                  <LinkIcon className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Platforms</div>
                  <div className="text-xs text-gray-600">Connect accounts</div>
                </div>
              </div>
            </Card>
          </Link>

          <Link href="/content-hub">
            <Card
              className="p-4 hover:shadow-md transition-shadow cursor-pointer group hover-target interactive-element"
              data-interactive="true"
              data-dashboard-nav="true"
              data-nav-item="content-creation"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg group-hover:bg-orange-200 transition-colors">
                  <Sparkles className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <div className="font-medium text-gray-900">Create</div>
                  <div className="text-xs text-gray-600">AI content tools</div>
                </div>
              </div>
            </Card>
          </Link>
        </div>

        {/* Enhanced Analytics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Enhanced Growth Analytics */}
          <Card className="lg:col-span-2 p-6">
            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              Growth Analytics
              <Link href="/dashboard?tab=analytics">
                <Button variant="ghost" size="sm" className="ml-auto">
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </Link>
            </h3>

            {/* Growth Insights */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-700">Growth Insights</h4>
                <div className="text-sm font-semibold text-green-600 bg-green-50 px-3 py-1 rounded-full">
                  +{stats.weeklyGrowth * 4}% this month
                </div>
              </div>
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6">
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {stats.weeklyGrowth}%
                    </div>
                    <div className="text-xs text-gray-600">Weekly Growth</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {stats.engagementRate}%
                    </div>
                    <div className="text-xs text-gray-600">Engagement Rate</div>
                  </div>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  {[1, 2, 3, 4, 5, 6, 7].map((day, index) => {
                    const height = Math.random() * 40 + 20;
                    return (
                      <div key={day} className="flex flex-col items-center">
                        <div
                          className="w-4 bg-gradient-to-t from-blue-500 to-blue-400 rounded-t mb-1 transition-all duration-1000"
                          style={{
                            height: `${height}px`,
                            transitionDelay: `${index * 100}ms`,
                          }}
                        />
                        <div className="text-xs text-gray-500">
                          {["M", "T", "W", "T", "F", "S", "S"][index]}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Platform Performance Grid */}
            <div className="grid md:grid-cols-3 gap-4">
              {Object.entries(platformStats).map(([platform, data]) => {
                const platformInfo = {
                  tiktok: {
                    name: "TikTok",
                    icon: "🎵",
                    color: "bg-gradient-to-r from-pink-500 to-rose-500",
                  },
                  instagram: {
                    name: "Instagram",
                    icon: "📸",
                    color: "bg-gradient-to-r from-purple-500 to-pink-500",
                  },
                  youtube: {
                    name: "YouTube",
                    icon: "📺",
                    color: "bg-gradient-to-r from-red-500 to-red-600",
                  },
                }[platform];

                return (
                  <div
                    key={platform}
                    className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div
                        className={`w-10 h-10 ${platformInfo?.color} rounded-xl flex items-center justify-center text-white text-lg shadow-lg`}
                      >
                        {platformInfo?.icon}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm">
                          {platformInfo?.name}
                        </h4>
                        <div className="text-xs text-gray-600">
                          {data.followers.toLocaleString()} followers
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Engagement</span>
                        <span className="font-semibold text-green-600">
                          {data.engagement}%
                        </span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-gray-600">Monthly Views</span>
                        <span className="font-semibold text-gray-900">
                          {(data.views / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                        <div
                          className="bg-gradient-to-r from-blue-500 to-blue-600 h-1.5 rounded-full transition-all duration-1000"
                          style={{
                            width: `${Math.min(data.engagement * 5, 100)}%`,
                          }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Viral Score & Top Post */}
          <div className="space-y-6">
            {/* Viral Score Meter */}
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-purple-600" />
                Current Viral Score
              </h3>
              <div className="flex justify-center">
                <ViralScoreMeter
                  score={stats.viralScore}
                  size="md"
                  animated={true}
                />
              </div>
            </Card>

            {/* Top Performing Post */}
            <Card className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Top Performing Post
              </h3>
              {topPerformingPost ? (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">
                      {topPerformingPost.title}
                    </h4>
                    <div className="text-sm text-gray-600 mb-3">
                      {topPerformingPost.platform}
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div>
                        <div className="font-semibold text-gray-900">
                          {(topPerformingPost.views / 1000000).toFixed(1)}M
                        </div>
                        <div className="text-gray-600">Views</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {(topPerformingPost.likes / 1000).toFixed(0)}K
                        </div>
                        <div className="text-gray-600">Likes</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {(topPerformingPost.comments / 1000).toFixed(1)}K
                        </div>
                        <div className="text-gray-600">Comments</div>
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {topPerformingPost.viralScore}%
                        </div>
                        <div className="text-gray-600">Viral Score</div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Star className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No posts yet</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Enhanced Earnings & Opportunities */}
      </div>
    </div>
  );
}
