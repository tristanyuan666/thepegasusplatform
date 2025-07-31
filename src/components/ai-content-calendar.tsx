"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar,
  Brain,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Zap,
  Plus,
  RefreshCw,
  BarChart3,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Lightbulb,
  Wand2,
  CalendarDays,
  ArrowRight,
  CheckCircle,
  AlertTriangle,
  Star,
  Flame,
  Crown,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface AIContentCalendarProps {
  userId: string;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

interface ContentSuggestion {
  id: string;
  date: string;
  title: string;
  content: string;
  platform: string;
  contentType: string;
  viralScore: number;
  optimalTime: string;
  reasoning: string;
  hashtags: string[];
  trendingTopics: string[];
  competitorAnalysis: {
    similarContent: number;
    avgPerformance: number;
    opportunity: string;
  };
  aiConfidence: number;
}

interface ContentGap {
  date: string;
  platform: string;
  reason: string;
  severity: "low" | "medium" | "high";
  suggestion: string;
}

interface OptimalTime {
  platform: string;
  day: string;
  time: string;
  engagement: number;
  reasoning: string;
}

interface TrendingEvent {
  id: string;
  name: string;
  date: string;
  category: string;
  impact: "low" | "medium" | "high";
  platforms: string[];
  contentIdeas: string[];
  hashtags: string[];
}

export default function AIContentCalendar({
  userId,
  hasActiveSubscription,
  subscriptionTier,
}: AIContentCalendarProps) {
  const [contentSuggestions, setContentSuggestions] = useState<
    ContentSuggestion[]
  >([]);
  const [contentGaps, setContentGaps] = useState<ContentGap[]>([]);
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [trendingEvents, setTrendingEvents] = useState<TrendingEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [calendarView, setCalendarView] = useState<"month" | "week">("month");
  const [activeTab, setActiveTab] = useState("calendar");
  const supabase = createClient();

  useEffect(() => {
    loadAICalendarData();
  }, [selectedDate, selectedPlatform]);

  const loadAICalendarData = async () => {
    setIsLoading(true);
    try {
      // Simulate AI analysis delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Generate AI content suggestions for the next 30 days
      const suggestions: ContentSuggestion[] = [];
      const platforms = [
        "tiktok",
        "instagram",
        "youtube",
        "twitter",
        "linkedin",
      ];
      const contentTypes = ["video", "image", "text", "carousel"];

      for (let i = 0; i < 30; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        // Generate 1-3 suggestions per day
        const dailySuggestions = Math.floor(Math.random() * 3) + 1;

        for (let j = 0; j < dailySuggestions; j++) {
          const platform =
            platforms[Math.floor(Math.random() * platforms.length)];
          const contentType =
            contentTypes[Math.floor(Math.random() * contentTypes.length)];

          suggestions.push({
            id: `suggestion_${i}_${j}`,
            date: date.toISOString().split("T")[0],
            title: generateContentTitle(platform, i),
            content: generateContentDescription(platform, contentType),
            platform,
            contentType,
            viralScore: Math.floor(Math.random() * 40) + 60,
            optimalTime: generateOptimalTime(platform),
            reasoning: generateReasoning(platform, date),
            hashtags: generateHashtags(platform),
            trendingTopics: generateTrendingTopics(),
            competitorAnalysis: {
              similarContent: Math.floor(Math.random() * 50) + 10,
              avgPerformance: Math.floor(Math.random() * 30) + 40,
              opportunity: "High opportunity - low competition",
            },
            aiConfidence: Math.floor(Math.random() * 30) + 70,
          });
        }
      }

      setContentSuggestions(suggestions);

      // Generate content gaps analysis
      const gaps: ContentGap[] = [
        {
          date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          platform: "instagram",
          reason: "No content scheduled for peak engagement time",
          severity: "high",
          suggestion: "Schedule a Reel at 7 PM for maximum reach",
        },
        {
          date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          platform: "tiktok",
          reason: "Missing trending hashtag opportunity",
          severity: "medium",
          suggestion: "Create content around #MondayMotivation trend",
        },
        {
          date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          platform: "youtube",
          reason: "Long gap since last upload",
          severity: "low",
          suggestion: "Consider uploading a YouTube Short",
        },
      ];
      setContentGaps(gaps);

      // Generate optimal posting times
      const times: OptimalTime[] = [
        {
          platform: "tiktok",
          day: "Tuesday",
          time: "7:00 PM",
          engagement: 94,
          reasoning: "Peak Gen Z activity time with 94% higher engagement",
        },
        {
          platform: "instagram",
          day: "Wednesday",
          time: "2:00 PM",
          engagement: 87,
          reasoning: "Lunch break scrolling leads to 87% more interactions",
        },
        {
          platform: "youtube",
          day: "Saturday",
          time: "10:00 AM",
          engagement: 76,
          reasoning: "Weekend leisure viewing increases watch time by 76%",
        },
        {
          platform: "linkedin",
          day: "Thursday",
          time: "9:00 AM",
          engagement: 82,
          reasoning: "Professional networking peak with 82% more shares",
        },
      ];
      setOptimalTimes(times);

      // Generate trending events
      const events: TrendingEvent[] = [
        {
          id: "1",
          name: "World Mental Health Day",
          date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          category: "awareness",
          impact: "high",
          platforms: ["instagram", "tiktok", "linkedin"],
          contentIdeas: [
            "Share your mental health journey",
            "Tips for maintaining work-life balance",
            "Mindfulness exercises for creators",
          ],
          hashtags: [
            "#MentalHealthDay",
            "#SelfCare",
            "#Wellness",
            "#Mindfulness",
          ],
        },
        {
          id: "2",
          name: "Small Business Saturday",
          date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          category: "business",
          impact: "medium",
          platforms: ["instagram", "facebook", "twitter"],
          contentIdeas: [
            "Support local businesses in your area",
            "Share your entrepreneurship story",
            "Collaborate with small business owners",
          ],
          hashtags: [
            "#SmallBusinessSaturday",
            "#SupportLocal",
            "#Entrepreneur",
          ],
        },
      ];
      setTrendingEvents(events);
    } catch (error) {
      console.error("Error loading AI calendar data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateContentTitle = (
    platform: string,
    dayOffset: number,
  ): string => {
    const titles = {
      tiktok: [
        "Morning Routine That Changed My Life",
        "5 Productivity Hacks You Need",
        "Day in My Life as a Creator",
        "Things I Wish I Knew at 20",
        "Viral Content Secrets Revealed",
      ],
      instagram: [
        "Behind the Scenes of Content Creation",
        "My Favorite Tools for Creators",
        "Aesthetic Workspace Tour",
        "Growth Tips That Actually Work",
        "Mindset Shifts for Success",
      ],
      youtube: [
        "How I Gained 100K Followers",
        "Complete Guide to Going Viral",
        "My Content Creation Process",
        "Monetization Strategies Explained",
        "Building a Personal Brand",
      ],
      twitter: [
        "Thread: Lessons from 1 Year of Creating",
        "Hot Take: Why Most Content Fails",
        "Quick Tips for Better Engagement",
        "Industry Insights You Need to Know",
        "Mistakes I Made So You Don't Have To",
      ],
      linkedin: [
        "Professional Growth Through Content",
        "Building Authority in Your Industry",
        "Networking Strategies That Work",
        "Career Lessons from Content Creation",
        "Leadership Insights for Creators",
      ],
    };

    const platformTitles =
      titles[platform as keyof typeof titles] || titles.tiktok;
    return platformTitles[dayOffset % platformTitles.length];
  };

  const generateContentDescription = (
    platform: string,
    contentType: string,
  ): string => {
    return `Create engaging ${contentType} content for ${platform} that resonates with your audience and drives meaningful engagement.`;
  };

  const generateOptimalTime = (platform: string): string => {
    const times = {
      tiktok: ["7:00 PM", "9:00 PM", "6:00 PM"],
      instagram: ["2:00 PM", "7:00 PM", "11:00 AM"],
      youtube: ["10:00 AM", "3:00 PM", "8:00 PM"],
      twitter: ["9:00 AM", "1:00 PM", "5:00 PM"],
      linkedin: ["9:00 AM", "12:00 PM", "5:00 PM"],
    };

    const platformTimes = times[platform as keyof typeof times] || times.tiktok;
    return platformTimes[Math.floor(Math.random() * platformTimes.length)];
  };

  const generateReasoning = (platform: string, date: Date): string => {
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    return `${day}s show 23% higher engagement on ${platform}. AI analysis suggests this content type performs best during this time slot.`;
  };

  const generateHashtags = (platform: string): string[] => {
    const hashtags = {
      tiktok: ["#fyp", "#viral", "#trending", "#creator", "#contentcreator"],
      instagram: [
        "#instagram",
        "#content",
        "#creator",
        "#viral",
        "#engagement",
      ],
      youtube: ["#youtube", "#shorts", "#creator", "#viral", "#content"],
              twitter: ["#x", "#thread", "#viral", "#content", "#creator"],
      linkedin: [
        "#linkedin",
        "#professional",
        "#career",
        "#business",
        "#networking",
      ],
    };

    return hashtags[platform as keyof typeof hashtags] || hashtags.tiktok;
  };

  const generateTrendingTopics = (): string[] => {
    const topics = [
      "AI",
      "Productivity",
      "Wellness",
      "Technology",
      "Lifestyle",
      "Business",
      "Motivation",
    ];
    return topics.slice(0, Math.floor(Math.random() * 3) + 2);
  };

  const generateAICalendar = async () => {
    setIsGenerating(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 3000));
      await loadAICalendarData();
    } finally {
      setIsGenerating(false);
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "text-red-600 bg-red-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "low":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return "🎵";
      case "instagram":
        return "📸";
      case "youtube":
        return "📺";
      case "twitter":
        return "🐦";
      case "linkedin":
        return "💼";
      default:
        return "📱";
    }
  };

  if (!hasActiveSubscription) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          AI Content Calendar
        </h3>
        <p className="text-gray-600 mb-6">
          Get AI-powered content planning with optimal posting times, trend
          analysis, and content gap detection
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span>Smart scheduling</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Trend analysis</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>Content gap detection</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Zap className="w-4 h-4" />
            <span>Viral predictions</span>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          <Crown className="w-4 h-4 mr-2" />
          Upgrade for AI Calendar
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
            <span className="font-medium">
              AI is analyzing your content strategy...
            </span>
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
            <Brain className="w-6 h-6 text-purple-600" />
            AI Content Calendar
          </h2>
          <p className="text-gray-600">
            Intelligent content planning powered by AI analysis and trend
            prediction
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Platforms</SelectItem>
              <SelectItem value="tiktok">🎵 TikTok</SelectItem>
              <SelectItem value="instagram">📸 Instagram</SelectItem>
              <SelectItem value="youtube">📺 YouTube</SelectItem>
              <SelectItem value="twitter">🐦 X</SelectItem>
              <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
            </SelectContent>
          </Select>
          <Button
            onClick={generateAICalendar}
            disabled={isGenerating}
            className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700"
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="w-4 h-4 mr-2" />
            )}
            {isGenerating ? "Generating..." : "Regenerate Calendar"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="calendar">AI Calendar</TabsTrigger>
          <TabsTrigger value="gaps">Content Gaps</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
          <TabsTrigger value="trends">Trending Events</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          {/* Calendar View */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                AI-Generated Content Suggestions
              </h3>
              <div className="flex items-center gap-2">
                <Button
                  variant={calendarView === "week" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("week")}
                >
                  Week
                </Button>
                <Button
                  variant={calendarView === "month" ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCalendarView("month")}
                >
                  Month
                </Button>
              </div>
            </div>

            <div className="grid gap-4">
              {contentSuggestions
                .filter(
                  (s) =>
                    selectedPlatform === "all" ||
                    s.platform === selectedPlatform,
                )
                .slice(0, 10)
                .map((suggestion) => (
                  <Card
                    key={suggestion.id}
                    className="p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="text-2xl">
                          {getPlatformIcon(suggestion.platform)}
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {suggestion.title}
                          </h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <span>
                              {new Date(suggestion.date).toLocaleDateString()}
                            </span>
                            <span>{suggestion.optimalTime}</span>
                            <span className="capitalize">
                              {suggestion.contentType}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getViralScoreColor(suggestion.viralScore)} border-0`}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {suggestion.viralScore}%
                        </Badge>
                        <Badge variant="outline" className="text-purple-600">
                          AI: {suggestion.aiConfidence}%
                        </Badge>
                      </div>
                    </div>

                    <p className="text-gray-700 text-sm mb-3">
                      {suggestion.content}
                    </p>

                    <div className="bg-blue-50 p-3 rounded-lg mb-3">
                      <div className="flex items-start gap-2">
                        <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-900 mb-1">
                            AI Insight
                          </p>
                          <p className="text-sm text-blue-700">
                            {suggestion.reasoning}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {suggestion.hashtags.map((tag, index) => (
                        <span
                          key={index}
                          className="text-blue-600 text-xs bg-blue-50 px-2 py-1 rounded"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        Trending: {suggestion.trendingTopics.join(", ")}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-3 h-3 mr-1" />
                          Schedule
                        </Button>
                        <Button size="sm" variant="outline">
                          <Wand2 className="w-3 h-3 mr-1" />
                          Customize
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="gaps" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Content Gap Analysis
            </h3>
            <div className="space-y-4">
              {contentGaps.map((gap, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-xl">
                        {getPlatformIcon(gap.platform)}
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">
                          {gap.platform.charAt(0).toUpperCase() +
                            gap.platform.slice(1)}{" "}
                          Gap Detected
                        </h4>
                        <p className="text-sm text-gray-600">
                          {new Date(gap.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <Badge
                      className={`${getSeverityColor(gap.severity)} border-0`}
                    >
                      {gap.severity === "high" && (
                        <AlertTriangle className="w-3 h-3 mr-1" />
                      )}
                      {gap.severity.toUpperCase()}
                    </Badge>
                  </div>
                  <p className="text-gray-700 text-sm mb-2">{gap.reason}</p>
                  <div className="bg-green-50 p-3 rounded-lg">
                    <p className="text-sm font-medium text-green-900 mb-1">
                      AI Recommendation
                    </p>
                    <p className="text-sm text-green-700">{gap.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="optimal" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              AI-Optimized Posting Times
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {optimalTimes.map((time, index) => (
                <div
                  key={index}
                  className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border border-blue-200"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="text-2xl">
                      {getPlatformIcon(time.platform)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900 capitalize">
                        {time.platform}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {time.day}s at {time.time}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className="bg-green-100 text-green-700 border-0">
                      <TrendingUp className="w-3 h-3 mr-1" />+{time.engagement}%
                      engagement
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-700">{time.reasoning}</p>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Upcoming Trending Events
            </h3>
            <div className="space-y-4">
              {trendingEvents.map((event) => (
                <Card key={event.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {event.name}
                      </h4>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>{new Date(event.date).toLocaleDateString()}</span>
                        <span className="capitalize">{event.category}</span>
                      </div>
                    </div>
                    <Badge
                      className={`${
                        event.impact === "high"
                          ? "bg-red-100 text-red-700"
                          : event.impact === "medium"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                      } border-0`}
                    >
                      {event.impact === "high" && (
                        <Flame className="w-3 h-3 mr-1" />
                      )}
                      {event.impact.toUpperCase()} IMPACT
                    </Badge>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Platforms:
                    </p>
                    <div className="flex gap-2">
                      {event.platforms.map((platform, index) => (
                        <span key={index} className="text-lg">
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700 mb-2">
                      Content Ideas:
                    </p>
                    <ul className="text-sm text-gray-600 space-y-1">
                      {event.contentIdeas.map((idea, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle className="w-3 h-3 text-green-500" />
                          {idea}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {event.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-purple-600 text-xs bg-purple-50 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
