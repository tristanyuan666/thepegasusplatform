"use client";

import { useState, useEffect, useRef } from "react";
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
  Settings,
  Bell,
  Search,
  Plus,
  MoreHorizontal,
  ChevronDown,
  Star,
  Crown,
  Sparkles,
} from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Progress } from "./ui/progress";

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  trend: "up" | "down";
  icon: React.ReactNode;
  color: string;
  isAnimated?: boolean;
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
  color,
  isAnimated = true,
}: MetricCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    if (!isAnimated) return;
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
  }, [targetValue, isAnimated]);

  return (
    <div
      className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 group cursor-pointer transform hover:scale-105 ${
        isHovered ? "ring-2 ring-blue-500/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center justify-between mb-4">
        <div
          className={`p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg group-hover:scale-110 transition-transform duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>
        <div
          className={`flex items-center gap-1 text-sm font-semibold px-3 py-1 rounded-full transition-all duration-300 ${
            trend === "up"
              ? "text-green-600 bg-green-50 group-hover:bg-green-100"
              : "text-red-600 bg-red-50 group-hover:bg-red-100"
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
        <p className="text-2xl font-bold text-gray-900 transition-colors group-hover:text-blue-600">
          {value.includes("K") || value.includes("M") || value.includes("$")
            ? value
            : isAnimated
              ? animatedValue.toLocaleString()
              : targetValue.toLocaleString()}
        </p>
        <p className="text-gray-600 text-sm font-medium group-hover:text-gray-700 transition-colors">
          {title}
        </p>
      </div>
    </div>
  );
}

function AdvancedGrowthAnalytics() {
  const [animateChart, setAnimateChart] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState("30d");
  const [hoveredBar, setHoveredBar] = useState<number | null>(null);
  const [selectedMetric, setSelectedMetric] = useState("followers");
  const [realTimeGrowth, setRealTimeGrowth] = useState(127);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeGrowth((prev) => prev + Math.floor(Math.random() * 3));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const dataPoints = {
    followers:
      selectedPeriod === "7d"
        ? [65, 72, 68, 81, 78, 95, 89]
        : [45, 52, 48, 61, 58, 72, 69, 78, 85, 92, 88, 95],
    engagement:
      selectedPeriod === "7d"
        ? [8.2, 8.7, 8.1, 9.2, 8.9, 9.8, 9.1]
        : [7.5, 7.8, 7.2, 8.1, 7.9, 8.5, 8.2, 8.8, 9.1, 9.4, 9.0, 9.6],
    revenue:
      selectedPeriod === "7d"
        ? [1200, 1450, 1300, 1680, 1520, 1890, 1750]
        : [800, 950, 850, 1100, 980, 1250, 1150, 1400, 1600, 1850, 1700, 2100],
  };

  const currentData = dataPoints[selectedMetric as keyof typeof dataPoints];
  const labels =
    selectedPeriod === "7d"
      ? ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
      : [
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

  const metrics = [
    {
      key: "followers",
      label: "Followers",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      icon: Users,
    },
    {
      key: "engagement",
      label: "Engagement",
      color: "text-green-600",
      bgColor: "bg-green-50",
      icon: Heart,
    },
    {
      key: "revenue",
      label: "Revenue",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      icon: DollarSign,
    },
  ];

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 gap-4">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-blue-600" />
            Creator Dashboard Analytics
          </h3>
          <p className="text-gray-600 text-sm">
            AI-powered insights and predictions
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
            <SelectTrigger className="w-28 bg-white border-gray-200 hover:border-blue-400 transition-colors">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-xl">
              <SelectItem value="7d">7 days</SelectItem>
              <SelectItem value="30d">30 days</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
            <TrendingUp className="w-4 h-4" />
            <span className="text-sm font-semibold">+{realTimeGrowth}%</span>
          </div>
        </div>
      </div>

      {/* Metric Selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto">
        {metrics.map((metric) => {
          const IconComponent = metric.icon;
          return (
            <button
              key={metric.key}
              onClick={() => setSelectedMetric(metric.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                selectedMetric === metric.key
                  ? `${metric.color} ${metric.bgColor} shadow-md`
                  : "text-gray-600 bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <IconComponent className="w-4 h-4" />
              {metric.label}
            </button>
          );
        })}
      </div>

      {/* Enhanced Chart */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-lg font-bold text-blue-600 mb-1">
              {selectedMetric === "followers"
                ? "127K"
                : selectedMetric === "engagement"
                  ? "9.2%"
                  : "$2.1K"}
            </div>
            <div className="text-xs text-gray-600">Current</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-green-600 mb-1">
              +{realTimeGrowth}%
            </div>
            <div className="text-xs text-gray-600">Growth</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-purple-600 mb-1">
              {selectedMetric === "followers"
                ? "2.4M"
                : selectedMetric === "engagement"
                  ? "89K"
                  : "$12.4K"}
            </div>
            <div className="text-xs text-gray-600">
              {selectedMetric === "followers"
                ? "Views"
                : selectedMetric === "engagement"
                  ? "Likes"
                  : "Monthly"}
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-orange-600 mb-1">94%</div>
            <div className="text-xs text-gray-600">Viral Score</div>
          </div>
        </div>

        <div className="h-24 flex items-end justify-between gap-1">
          {[40, 65, 45, 80, 60, 95, 75, 100, 85, 120, 95, 140].map(
            (height, index) => (
              <div
                key={index}
                className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t flex-1 transition-all duration-1000 ease-out shadow-sm"
                style={{
                  height: animateChart ? `${height}%` : "0px",
                  transitionDelay: `${index * 100}ms`,
                  minHeight: "4px",
                }}
              />
            ),
          )}
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-6 h-6 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <h4 className="font-semibold text-gray-900">AI Insights</h4>
        </div>
        <div className="grid md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full" />
            <span className="text-gray-700">Peak engagement: 2-4 PM</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            <span className="text-gray-700">Best content: Video tutorials</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full" />
            <span className="text-gray-700">
              Trending hashtags: #productivity
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-orange-500 rounded-full" />
            <span className="text-gray-700">Next viral prediction: 96%</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function ContentQueue() {
  const [selectedTab, setSelectedTab] = useState("scheduled");
  const [contentItems] = useState([
    {
      id: 1,
      title: "Morning Routine That Changed My Life",
      platform: "TikTok",
      scheduledFor: "Today, 2:00 PM",
      status: "scheduled",
      viralScore: 94,
      icon: Play,
      engagement: "2.1M views",
      type: "Video",
      color: "bg-black",
    },
    {
      id: 2,
      title: "5-Minute Productivity Hack",
      platform: "Instagram",
      scheduledFor: "Tomorrow, 9:00 AM",
      status: "scheduled",
      viralScore: 87,
      icon: Heart,
      engagement: "890K views",
      type: "Reel",
      color: "bg-pink-500",
    },
    {
      id: 3,
      title: "Budget-Friendly Home Office Setup",
      platform: "YouTube",
      scheduledFor: "Dec 15, 6:00 PM",
      status: "draft",
      viralScore: 76,
      icon: Play,
      engagement: "1.5M views",
      type: "Long-form",
      color: "bg-red-500",
    },
    {
      id: 4,
      title: "Remote Work Tips Thread",
      platform: "Twitter",
      scheduledFor: "Dec 16, 11:00 AM",
      status: "scheduled",
      viralScore: 91,
      icon: MessageCircle,
      engagement: "450K impressions",
      type: "Thread",
      color: "bg-blue-400",
    },
    {
      id: 5,
      title: "Career Growth Strategies",
      platform: "LinkedIn",
      scheduledFor: "Dec 17, 8:00 AM",
      status: "draft",
      viralScore: 83,
      icon: Users,
      engagement: "125K views",
      type: "Article",
      color: "bg-blue-600",
    },
    {
      id: 6,
      title: "Daily Motivation Stories",
      platform: "Instagram",
      scheduledFor: "Dec 18, 7:00 AM",
      status: "scheduled",
      viralScore: 89,
      icon: Star,
      engagement: "320K views",
      type: "Story",
      color: "bg-pink-500",
    },
  ]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Content Pipeline
        </h3>
        <Button
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 transition-colors hover-target interactive-element"
        >
          <Plus className="w-3 h-3 mr-1" />
          <span className="hidden sm:inline">Create Content</span>
          <span className="sm:hidden">Create</span>
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100">
          <TabsTrigger
            value="scheduled"
            className="data-[state=active]:bg-white"
          >
            Scheduled (
            {contentItems.filter((item) => item.status === "scheduled").length})
          </TabsTrigger>
          <TabsTrigger value="draft" className="data-[state=active]:bg-white">
            Drafts (
            {contentItems.filter((item) => item.status === "draft").length})
          </TabsTrigger>
          <TabsTrigger
            value="published"
            className="data-[state=active]:bg-white"
          >
            Published
          </TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid gap-3 max-h-80 overflow-y-auto custom-scrollbar">
        {contentItems
          .filter(
            (item) =>
              selectedTab === "scheduled" || item.status === selectedTab,
          )
          .map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl hover:from-blue-50 hover:to-blue-100/50 transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200 hover:shadow-md"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="relative w-12 h-12 rounded-xl flex-shrink-0 shadow-md flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200 group-hover:scale-110 transition-transform duration-300">
                <div
                  className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}
                >
                  <item.icon className="w-4 h-4 text-white" />
                </div>
                <div className="absolute -bottom-1 -right-1 text-xs text-white font-bold bg-blue-500 px-1.5 py-0.5 rounded-full text-[10px]">
                  {item.type.charAt(0)}
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors text-sm leading-tight mb-1 truncate">
                  {item.title}
                </h4>
                <div className="flex items-center gap-3 text-xs text-gray-600">
                  <div className="flex items-center gap-1">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        item.platform === "TikTok"
                          ? "bg-black"
                          : item.platform === "Instagram"
                            ? "bg-pink-500"
                            : item.platform === "YouTube"
                              ? "bg-red-500"
                              : item.platform === "Twitter"
                                ? "bg-blue-400"
                                : "bg-blue-600"
                      }`}
                    />
                    <span className="font-medium">{item.platform}</span>
                  </div>
                  <span>{item.scheduledFor}</span>
                </div>
                <div className="flex items-center gap-3 mt-2">
                  <div className="flex items-center gap-1">
                    <Zap className="w-3 h-3 text-yellow-500" />
                    <span className="text-xs font-semibold text-yellow-600">
                      {item.viralScore}% viral
                    </span>
                  </div>
                  <span className="text-xs text-gray-500">
                    {item.engagement}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={
                    item.status === "scheduled" ? "default" : "secondary"
                  }
                  className={`capitalize text-xs ${
                    item.status === "scheduled"
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600"
                  }`}
                >
                  {item.status}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  className="hover-target opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
      </div>

      {/* Quick Stats */}
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">
              {
                contentItems.filter((item) => item.status === "scheduled")
                  .length
              }
            </div>
            <div className="text-xs text-gray-600">Scheduled</div>
          </div>
          <div>
            <div className="text-lg font-bold text-orange-600">
              {contentItems.filter((item) => item.status === "draft").length}
            </div>
            <div className="text-xs text-gray-600">Drafts</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">12</div>
            <div className="text-xs text-gray-600">Published</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ViralScorePredictor() {
  const [score, setScore] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const targetScore = 87;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = targetScore / 100;
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setScore(targetScore);
          clearInterval(counter);
        } else {
          setScore(Math.floor(current));
        }
      }, 20);
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetScore]);

  return (
    <div
      className={`bg-white rounded-xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 cursor-pointer ${
        isHovered ? "ring-2 ring-blue-500/20" : ""
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="text-center">
        <h3 className="text-xl font-bold text-gray-900 mb-6">
          Viral Score Predictor
        </h3>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 314} 314`}
              className="transition-all duration-1000 ease-out drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))`,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#1D4ED8" />
                <stop offset="100%" stopColor="#1E40AF" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                {score}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                VIRAL SCORE
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          Your next post has an {score}% chance of going viral
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-gray-500">AI analyzing trends...</span>
        </div>
      </div>
    </div>
  );
}

function RealtimeActivity() {
  const [activities] = useState([
    {
      action: "Productivity post went viral",
      user: "@productivity_pro",
      time: "2 min ago",
      type: "viral",
      color: "bg-blue-500",
      icon: TrendingUp,
      metric: "+2.4K followers",
    },
    {
      action: "Morning routine hit trending",
      user: "@morning_guru",
      time: "5 min ago",
      type: "trending",
      color: "bg-red-500",
      icon: Zap,
      metric: "#1 in Lifestyle",
    },
    {
      action: "Brand partnership secured",
      user: "@creator_success",
      time: "8 min ago",
      type: "revenue",
      color: "bg-green-500",
      icon: DollarSign,
      metric: "$5.2K earned",
    },
    {
      action: "Motivation post engaged",
      user: "@inspire_daily",
      time: "12 min ago",
      type: "engagement",
      color: "bg-purple-500",
      icon: Heart,
      metric: "89% engagement",
    },
    {
      action: "Tutorial saved 50K times",
      user: "@skill_builder",
      time: "15 min ago",
      type: "saves",
      color: "bg-orange-500",
      icon: Bookmark,
      metric: "50K saves",
    },
    {
      action: "Success story reached 1M",
      user: "@success_stories",
      time: "18 min ago",
      type: "milestone",
      color: "bg-pink-500",
      icon: Star,
      metric: "1M+ views",
    },
  ]);

  return (
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
          <Activity className="w-5 h-5 text-white" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
          <p className="text-gray-600 text-sm">Real-time updates</p>
        </div>
      </div>

      <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/20 rounded-xl hover:from-blue-50 hover:to-blue-100/30 transition-all duration-300 cursor-pointer group border border-gray-100 hover:border-blue-200 hover:shadow-md"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="relative flex-shrink-0">
              <div
                className={`w-10 h-10 ${activity.color} rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <activity.icon className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse border-2 border-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 group-hover:text-blue-600 transition-colors leading-tight mb-1">
                {activity.action}
              </p>
              <div className="flex items-center gap-3">
                <p className="text-xs text-blue-600 font-medium">
                  {activity.user}
                </p>
                <div className="text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                  {activity.metric}
                </div>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <span className="text-xs text-gray-500 font-medium">
                {activity.time}
              </span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-4 border-t border-gray-100">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <div className="text-lg font-bold text-blue-600">1,247</div>
            <div className="text-xs text-gray-600">Active Now</div>
          </div>
          <div>
            <div className="text-lg font-bold text-green-600">24/7</div>
            <div className="text-xs text-gray-600">Live Updates</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState<Date | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentTime(new Date());
  }, []);

  useEffect(() => {
    if (!isMounted) return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [isMounted]);

  return (
    <div className="bg-white rounded-xl p-4 md:p-6 shadow-lg border border-gray-100 mb-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900 mb-1">
            Welcome back, Sarah! 👋
          </h1>
          <p className="text-gray-600 text-sm md:text-base">
            Ready to create some viral content today?
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {isMounted && currentTime
                ? currentTime.toLocaleDateString()
                : "Loading..."}
            </div>
            <div className="text-xs text-gray-600">
              {isMounted && currentTime
                ? currentTime.toLocaleTimeString()
                : "--:--:--"}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" className="hover-target text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-300">
              <Bell className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" className="hover-target text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-300">
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function InteractiveDashboardPreview() {
  const [realTimeData, setRealTimeData] = useState({
    followers: 127543,
    views: 2456789,
    engagement: 8.7,
    revenue: 12450,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Enhanced Intersection Observer with instant mobile loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
          // Instant loading on mobile, delayed on desktop
          if (window.innerWidth <= 768) {
            setShowPopup(true);
          } else {
            setTimeout(() => setShowPopup(true), 800);
          }
        }
      },
      { threshold: window.innerWidth <= 768 ? 0.1 : 0.2 },
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, [hasAnimated]);

  // Real-time updates simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData((prev) => ({
        ...prev,
        followers: prev.followers + Math.floor(Math.random() * 15),
        views: prev.views + Math.floor(Math.random() * 150),
        engagement: Math.max(0, prev.engagement + (Math.random() - 0.5) * 0.2),
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="py-20 relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20"
    >
      {/* Enhanced Premium Background */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-gradient-to-r from-blue-400/8 to-cyan-400/6 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-gradient-to-l from-purple-400/8 to-blue-400/6 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-br from-indigo-400/4 to-blue-400/4 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-8 py-4 bg-white/70 backdrop-blur-md rounded-full mb-8 shadow-xl border border-white/40 hover:scale-105 transition-all duration-300">
            <BarChart3 className="w-6 h-6 text-blue-600 mr-3" />
            <span className="text-gray-800 font-semibold">
              Creator Dashboard Previewer
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">
            Your Premium{" "}
            <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
              Creator Dashboard
            </span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-lg leading-relaxed">
            Experience the power of AI-driven content creation with real-time
            analytics, growth insights, and intelligent optimization tools
            designed for creators
          </p>
        </div>

        {/* Enhanced Interactive Dashboard Container with Popup Animation */}
        <div
          className={`max-w-7xl mx-auto transition-all duration-1000 transform ${
            isVisible
              ? "opacity-100 translate-y-0 scale-100"
              : "opacity-0 translate-y-12 scale-95"
          }`}
        >
          {/* Enhanced Dashboard Header */}
          <div className="bg-white/80 backdrop-blur-md rounded-2xl p-4 md:p-8 shadow-xl border border-white/30 mb-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-xl md:text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                  Creator Dashboard
                </h1>
                <p className="text-gray-600 text-sm md:text-lg">
                  Real-time insights powering your content empire
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-sm font-medium text-gray-900">Today</div>
                  <div className="text-xs text-gray-600">Live Analytics</div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" className="hover-target">
                    <Bell className="w-4 h-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="hover-target">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Enhanced Key Metrics Grid with Staggered Animation */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {[
              {
                title: "Total Followers",
                value: realTimeData.followers.toLocaleString(),
                change: "+23.4%",
                icon: <Users className="w-5 h-5" />,
                color: "from-blue-500 to-blue-600",
                delay: "0ms",
              },
              {
                title: "Monthly Views",
                value: `${(realTimeData.views / 1000000).toFixed(1)}M`,
                change: "+45.2%",
                icon: <Eye className="w-5 h-5" />,
                color: "from-blue-600 to-blue-700",
                delay: "200ms",
              },
              {
                title: "Engagement Rate",
                value: `${realTimeData.engagement.toFixed(1)}%`,
                change: "+12.1%",
                icon: <Heart className="w-5 h-5" />,
                color: "from-blue-700 to-blue-800",
                delay: "400ms",
              },
              {
                title: "Revenue",
                value: `${realTimeData.revenue.toLocaleString()}`,
                change: "+67.8%",
                icon: <DollarSign className="w-5 h-5" />,
                color: "from-blue-800 to-blue-900",
                delay: "600ms",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className={`transition-all duration-700 hover-target ${
                  isVisible
                    ? "opacity-100 translate-y-0"
                    : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: metric.delay }}
              >
                <MetricCard
                  title={metric.title}
                  value={metric.value}
                  change={metric.change}
                  trend="up"
                  icon={metric.icon}
                  color={metric.color}
                />
              </div>
            ))}
          </div>

          {/* Enhanced Main Dashboard Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            {/* Enhanced Growth Analytics */}
            <div className="md:col-span-2">
              <AdvancedGrowthAnalytics />
            </div>

            {/* Enhanced Viral Score Predictor */}
            <div>
              <ViralScorePredictor />
            </div>
          </div>

          {/* Enhanced Content & Activity Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {/* Enhanced Content Queue */}
            <div className="md:col-span-2">
              <ContentQueue />
            </div>

            {/* Enhanced Real-time Activity */}
            <div>
              <RealtimeActivity />
            </div>
          </div>
        </div>

        {/* Enhanced Call to Action */}
        <div className="text-center mt-20">
          <div className="bg-gradient-to-r from-white/90 to-blue-50/90 backdrop-blur-md p-10 rounded-3xl shadow-2xl border border-white/40 max-w-3xl mx-auto hover:scale-105 transition-all duration-500">
            <div className="mb-6">
              <div className="inline-flex items-center px-4 py-2 bg-blue-100 rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
                <span className="text-blue-800 font-semibold text-sm">
                  Premium Dashboard Access
                </span>
              </div>
            </div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Command Your Content Empire?
            </h3>
            <p className="text-gray-600 mb-8 text-lg leading-relaxed">
              This interactive preview shows just a glimpse. Get full access to
              advanced analytics, AI insights, and growth optimization tools.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 px-10 py-4 text-lg font-semibold hover-target">
                <Crown className="w-5 h-5 mr-2" />
                Unlock Full Dashboard
              </Button>
              <Button
                variant="outline"
                className="px-10 py-4 text-lg font-semibold hover-target"
              >
                View All Features
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
