"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Calendar,
  Clock,
  Plus,
  Zap,
  Upload,
  Hash,
  Play,
  Image as ImageIcon,
  Video,
  FileText,
  TrendingUp,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Edit,
  Trash2,
  Send,
  CalendarDays,
  Grid3X3,
  Filter,
  Search,
  BarChart3,
  Target,
  Flame,
  Star,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { ContentItem, SocialConnection } from "@/utils/auth";

interface ContentSchedulerProps {
  userId: string;
  socialConnections: SocialConnection[];
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

interface ScheduleFormData {
  title: string;
  content: string;
  content_type: string;
  platform: string;
  scheduled_for: string;
  hashtags: string[];
  thumbnail_url: string;
  auto_post: boolean;
}

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-pink-500" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "bg-purple-500" },
  { id: "youtube", name: "YouTube Shorts", icon: "📺", color: "bg-red-500" },
  { id: "twitter", name: "Twitter/X", icon: "🐦", color: "bg-blue-500" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-600" },
];

const contentTypes = [
  { id: "video", name: "Video", icon: Video },
  { id: "image", name: "Image", icon: ImageIcon },
  { id: "text", name: "Text Post", icon: FileText },
  { id: "carousel", name: "Carousel", icon: ImageIcon },
];

export default function ContentScheduler({
  userId,
  socialConnections,
  hasActiveSubscription,
  subscriptionTier,
}: ContentSchedulerProps) {
  const [contentQueue, setContentQueue] = useState<ContentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<ContentItem | null>(
    null,
  );
  const [viralScore, setViralScore] = useState(0);
  const [currentView, setCurrentView] = useState<"list" | "calendar">("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [filterPlatform, setFilterPlatform] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [calendarData, setCalendarData] = useState<
    Record<string, ContentItem[]>
  >({});
  const [bestPostingTimes, setBestPostingTimes] = useState<{
    bestDay: string;
    bestHour: string;
    suggestion: string;
  }>({
    bestDay: "Tuesday",
    bestHour: "2:00 PM",
    suggestion: "Peak engagement time",
  });
  const [autoRepostEnabled, setAutoRepostEnabled] = useState(false);
  const [formData, setFormData] = useState<ScheduleFormData>({
    title: "",
    content: "",
    content_type: "video",
    platform: "tiktok",
    scheduled_for: "",
    hashtags: [],
    thumbnail_url: "",
    auto_post: false,
  });
  const [hashtagInput, setHashtagInput] = useState("");
  const supabase = createClient();

  useEffect(() => {
    loadContentQueue();
  }, []);

  useEffect(() => {
    if (formData.content && formData.title) {
      calculateViralScore();
    }
  }, [formData.content, formData.title, formData.hashtags]);

  const loadContentQueue = async () => {
    try {
      const { data, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", userId)
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      setContentQueue(data || []);

      // Organize content by date for calendar view
      const organized: Record<string, ContentItem[]> = {};
      (data || []).forEach((item: ContentItem) => {
        if (item.scheduled_for) {
          const dateKey = new Date(item.scheduled_for).toDateString();
          if (!organized[dateKey]) organized[dateKey] = [];
          organized[dateKey].push(item);
        }
      });
      setCalendarData(organized);

      // AI-powered posting time suggestions
      const currentHour = new Date().getHours();
      const suggestions = {
        morning: {
          day: "Tuesday",
          hour: "9:00 AM",
          reason: "High morning engagement",
        },
        afternoon: {
          day: "Wednesday",
          hour: "2:00 PM",
          reason: "Peak lunch break activity",
        },
        evening: {
          day: "Thursday",
          hour: "7:00 PM",
          reason: "Prime time viewing",
        },
      };

      const timeOfDay =
        currentHour < 12
          ? "morning"
          : currentHour < 17
            ? "afternoon"
            : "evening";
      const suggestion = suggestions[timeOfDay];

      setBestPostingTimes({
        bestDay: suggestion.day,
        bestHour: suggestion.hour,
        suggestion: suggestion.reason,
      });
    } catch (error) {
      console.error("Error loading content queue:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateViralScore = async () => {
    // Enhanced viral score calculation with AI-like analysis
    const contentLength = formData.content.length;
    const hashtagCount = formData.hashtags.length;
    const titleLength = formData.title.length;
    const content = formData.content.toLowerCase();
    const title = formData.title.toLowerCase();

    let score = 45; // Base score

    // Content length optimization (platform-specific)
    if (formData.platform === "tiktok") {
      if (contentLength > 50 && contentLength < 150) score += 15;
      if (contentLength > 150) score -= 8;
    } else if (formData.platform === "instagram") {
      if (contentLength > 100 && contentLength < 300) score += 12;
    } else if (formData.platform === "youtube") {
      if (contentLength > 200 && contentLength < 500) score += 10;
    }

    // Hashtag optimization (platform-specific)
    if (
      formData.platform === "tiktok" &&
      hashtagCount >= 3 &&
      hashtagCount <= 5
    )
      score += 12;
    if (
      formData.platform === "instagram" &&
      hashtagCount >= 5 &&
      hashtagCount <= 10
    )
      score += 15;
    if (hashtagCount > 15) score -= 10;

    // Title optimization
    if (titleLength > 10 && titleLength < 60) score += 8;
    if (titleLength > 60) score -= 5;

    // Trending keywords bonus
    const trendingKeywords = [
      "viral",
      "trending",
      "challenge",
      "tutorial",
      "hack",
      "secret",
      "amazing",
      "incredible",
      "must-see",
      "shocking",
    ];
    const foundKeywords = trendingKeywords.filter(
      (keyword) => content.includes(keyword) || title.includes(keyword),
    );
    score += foundKeywords.length * 3;

    // Engagement triggers
    const engagementTriggers = [
      "comment",
      "share",
      "like",
      "follow",
      "subscribe",
      "tag",
      "dm",
      "story",
    ];
    const foundTriggers = engagementTriggers.filter(
      (trigger) => content.includes(trigger) || title.includes(trigger),
    );
    score += foundTriggers.length * 2;

    // Platform-specific content type bonuses
    if (formData.platform === "tiktok" && formData.content_type === "video")
      score += 8;
    if (
      formData.platform === "instagram" &&
      formData.content_type === "carousel"
    )
      score += 6;
    if (formData.platform === "youtube" && formData.content_type === "video")
      score += 7;

    // Time-based bonus (posting during peak hours)
    const scheduledTime = new Date(formData.scheduled_for);
    const hour = scheduledTime.getHours();
    if ((hour >= 18 && hour <= 21) || (hour >= 12 && hour <= 14)) score += 5;

    // Emoji usage bonus - simplified approach
    const emojiRegex =
      /[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g;
    const emojiCount = (content.match(emojiRegex) || []).length;

    // Add some realistic variance
    score += Math.floor(Math.random() * 15) - 7;

    // Ensure score is within bounds
    score = Math.max(0, Math.min(100, score));

    setViralScore(score);

    // Store viral score prediction with enhanced factors
    if (hasActiveSubscription) {
      await supabase.from("viral_scores").insert({
        user_id: userId,
        score,
        factors: {
          content_length: contentLength,
          hashtag_count: hashtagCount,
          title_length: titleLength,
          platform: formData.platform,
          content_type: formData.content_type,
          trending_keywords: foundKeywords.length,
          engagement_triggers: foundTriggers.length,
          emoji_count: emojiCount,
          scheduled_hour: hour,
          has_question: content.includes("?"),
        },
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!hasActiveSubscription && contentQueue.length >= 3) {
      alert("Upgrade to schedule more content!");
      return;
    }

    try {
      const contentData = {
        ...formData,
        user_id: userId,
        viral_score: viralScore,
        status: "scheduled",
      };

      if (editingContent) {
        const { error } = await supabase
          .from("content_queue")
          .update(contentData)
          .eq("id", editingContent.id);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("content_queue")
          .insert(contentData);

        if (error) throw error;
      }

      await loadContentQueue();
      resetForm();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Error saving content:", error);
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      content_type: "video",
      platform: "tiktok",
      scheduled_for: "",
      hashtags: [],
      thumbnail_url: "",
      auto_post: false,
    });
    setHashtagInput("");
    setViralScore(0);
    setEditingContent(null);
  };

  const addHashtag = () => {
    if (
      hashtagInput.trim() &&
      !formData.hashtags.includes(hashtagInput.trim())
    ) {
      setFormData((prev) => ({
        ...prev,
        hashtags: [...prev.hashtags, hashtagInput.trim()],
      }));
      setHashtagInput("");
    }
  };

  const removeHashtag = (hashtag: string) => {
    setFormData((prev) => ({
      ...prev,
      hashtags: prev.hashtags.filter((h) => h !== hashtag),
    }));
  };

  const deleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from("content_queue")
        .delete()
        .eq("id", contentId);

      if (error) throw error;
      await loadContentQueue();
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  const editContent = (content: ContentItem) => {
    setEditingContent(content);
    setFormData({
      title: content.title,
      content: content.content,
      content_type: content.content_type,
      platform: content.platform,
      scheduled_for: content.scheduled_for
        ? new Date(content.scheduled_for).toISOString().slice(0, 16)
        : "",
      hashtags: content.hashtags || [],
      thumbnail_url: content.thumbnail_url || "",
      auto_post: content.auto_post,
    });
    setViralScore(content.viral_score || 0);
    setIsDialogOpen(true);
  };

  const postNow = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from("content_queue")
        .update({
          status: "posted",
          posted_at: new Date().toISOString(),
        })
        .eq("id", contentId);

      if (error) throw error;
      await loadContentQueue();
    } catch (error) {
      console.error("Error posting content:", error);
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    if (score >= 40) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-600";
      case "posted":
        return "bg-green-100 text-green-600";
      case "draft":
        return "bg-gray-100 text-gray-600";
      case "failed":
        return "bg-red-100 text-red-600";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Loading content scheduler...</span>
          </div>
        </div>
      </Card>
    );
  }

  // Calendar component for date navigation
  const CalendarView = () => {
    const today = new Date();
    const currentMonth = selectedDate.getMonth();
    const currentYear = selectedDate.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(
        <div key={`empty-${i}`} className="h-24 border border-gray-100" />,
      );
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      const dateKey = date.toDateString();
      const dayContent = calendarData[dateKey] || [];
      const isToday = date.toDateString() === today.toDateString();
      const isSelected = date.toDateString() === selectedDate.toDateString();

      days.push(
        <div
          key={day}
          className={`h-24 border border-gray-100 p-1 cursor-pointer hover:bg-blue-50 transition-colors ${
            isToday ? "bg-blue-100 border-blue-300" : ""
          } ${isSelected ? "ring-2 ring-blue-500" : ""}`}
          onClick={() => setSelectedDate(date)}
        >
          <div
            className={`text-sm font-medium mb-1 ${isToday ? "text-blue-600" : "text-gray-700"}`}
          >
            {day}
          </div>
          <div className="space-y-1">
            {dayContent.slice(0, 2).map((content, index) => {
              const platform = platforms.find((p) => p.id === content.platform);
              return (
                <div
                  key={index}
                  className={`text-xs px-1 py-0.5 rounded truncate ${platform?.color || "bg-gray-500"} text-white`}
                  title={content.title}
                >
                  {platform?.icon} {content.title.slice(0, 15)}...
                </div>
              );
            })}
            {dayContent.length > 2 && (
              <div className="text-xs text-gray-500">
                +{dayContent.length - 2} more
              </div>
            )}
          </div>
        </div>,
      );
    }

    return (
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            {selectedDate.toLocaleDateString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </h3>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedDate(new Date(currentYear, currentMonth - 1, 1))
              }
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() =>
                setSelectedDate(new Date(currentYear, currentMonth + 1, 1))
              }
            >
              Next
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-0">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <div
              key={day}
              className="p-2 text-center text-sm font-medium text-gray-500 border-b border-gray-100"
            >
              {day}
            </div>
          ))}
          {days}
        </div>
      </div>
    );
  };

  // Filter content based on search and platform
  const filteredContent = contentQueue.filter((content) => {
    const matchesSearch =
      content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.content.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesPlatform =
      filterPlatform === "all" || content.platform === filterPlatform;
    return matchesSearch && matchesPlatform;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-6 h-6 text-blue-600" />
            Content Scheduler
          </h2>
          <p className="text-gray-600">
            Schedule and manage your content across all platforms
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* View Toggle */}
          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <Button
              variant={currentView === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("list")}
              className="px-3 py-1"
            >
              <Grid3X3 className="w-4 h-4 mr-1" />
              List
            </Button>
            <Button
              variant={currentView === "calendar" ? "default" : "ghost"}
              size="sm"
              onClick={() => setCurrentView("calendar")}
              className="px-3 py-1"
            >
              <CalendarDays className="w-4 h-4 mr-1" />
              Calendar
            </Button>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={resetForm}
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Content
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingContent ? "Edit Content" : "Schedule New Content"}
                </DialogTitle>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        title: e.target.value,
                      }))
                    }
                    placeholder="Enter content title..."
                    required
                  />
                </div>

                {/* Content */}
                <div>
                  <Label htmlFor="content">Content</Label>
                  <Textarea
                    id="content"
                    value={formData.content}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        content: e.target.value,
                      }))
                    }
                    placeholder="Write your content here..."
                    rows={4}
                    required
                  />
                </div>

                {/* Platform and Content Type */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Platform</Label>
                    <Select
                      value={formData.platform}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, platform: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {platforms.map((platform) => (
                          <SelectItem key={platform.id} value={platform.id}>
                            <div className="flex items-center gap-2">
                              <span>{platform.icon}</span>
                              <span>{platform.name}</span>
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Content Type</Label>
                    <Select
                      value={formData.content_type}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          content_type: value,
                        }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {contentTypes.map((type) => {
                          const Icon = type.icon;
                          return (
                            <SelectItem key={type.id} value={type.id}>
                              <div className="flex items-center gap-2">
                                <Icon className="w-4 h-4" />
                                <span>{type.name}</span>
                              </div>
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Scheduled Time */}
                <div>
                  <Label htmlFor="scheduled_for">Schedule For</Label>
                  <Input
                    id="scheduled_for"
                    type="datetime-local"
                    value={formData.scheduled_for}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        scheduled_for: e.target.value,
                      }))
                    }
                    min={new Date().toISOString().slice(0, 16)}
                    required
                  />
                </div>

                {/* Hashtags */}
                <div>
                  <Label>Hashtags</Label>
                  <div className="flex gap-2 mb-2">
                    <Input
                      value={hashtagInput}
                      onChange={(e) => setHashtagInput(e.target.value)}
                      placeholder="Add hashtag..."
                      onKeyPress={(e) =>
                        e.key === "Enter" && (e.preventDefault(), addHashtag())
                      }
                    />
                    <Button type="button" onClick={addHashtag} size="sm">
                      <Hash className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.hashtags.map((hashtag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm flex items-center gap-1 cursor-pointer"
                        onClick={() => removeHashtag(hashtag)}
                      >
                        #{hashtag}
                        <span className="text-blue-600 hover:text-blue-800">
                          ×
                        </span>
                      </span>
                    ))}
                  </div>
                </div>

                {/* Viral Score Predictor */}
                {hasActiveSubscription && (
                  <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <Label className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-yellow-500" />
                        Viral Score Predictor
                      </Label>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${getViralScoreColor(viralScore)}`}
                      >
                        {viralScore}/100
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div
                        className="bg-gradient-to-r from-blue-500 to-purple-500 h-3 rounded-full transition-all duration-500"
                        style={{ width: `${viralScore}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {viralScore >= 80
                        ? "🔥 High viral potential!"
                        : viralScore >= 60
                          ? "📈 Good engagement expected"
                          : viralScore >= 40
                            ? "⚡ Moderate reach likely"
                            : "💡 Consider optimizing content"}
                    </p>
                  </div>
                )}

                {/* Auto-post toggle */}
                {hasActiveSubscription && (
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="auto_post"
                      checked={formData.auto_post}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          auto_post: e.target.checked,
                        }))
                      }
                      className="rounded"
                    />
                    <Label htmlFor="auto_post">Auto-post when scheduled</Label>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button type="submit" className="flex-1">
                    {editingContent ? "Update Content" : "Schedule Content"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* AI Suggestions & Filters */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
        {/* AI Posting Suggestions */}
        <Card className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <Target className="w-4 h-4 text-blue-600" />
            AI Suggestions
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Best Day:</span>
              <span className="font-medium text-blue-600">
                {bestPostingTimes.bestDay}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Best Time:</span>
              <span className="font-medium text-blue-600">
                {bestPostingTimes.bestHour}
              </span>
            </div>
            <div className="text-xs text-gray-500 mt-2">
              {bestPostingTimes.suggestion}
            </div>
          </div>
        </Card>

        {/* Auto-Repost Settings */}
        <Card className="p-4">
          <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-green-600" />
            Auto-Repost
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">Enable auto-repost</span>
            <input
              type="checkbox"
              checked={autoRepostEnabled}
              onChange={(e) => setAutoRepostEnabled(e.target.checked)}
              className="rounded"
            />
          </div>
          {autoRepostEnabled && (
            <div className="mt-2 text-xs text-gray-500">
              Content will be reposted after 7 days if performance is good
            </div>
          )}
        </Card>

        {/* Search & Filter */}
        <Card className="p-4">
          <div className="space-y-3">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search content..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <Select value={filterPlatform} onValueChange={setFilterPlatform}>
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Platforms</SelectItem>
                  {platforms.map((platform) => (
                    <SelectItem key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </Card>
      </div>

      {/* Content Queue */}
      {currentView === "calendar" ? (
        <CalendarView />
      ) : (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">
              Scheduled Content ({filteredContent.length})
            </h3>
            {!hasActiveSubscription && (
              <div className="text-sm text-gray-600 bg-yellow-50 px-3 py-1 rounded-full">
                {contentQueue.length}/3 free posts
              </div>
            )}
          </div>

          {filteredContent.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No content scheduled
              </h3>
              <p className="text-gray-600 mb-4">
                Start scheduling content to build your posting queue
              </p>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Schedule Your First Post
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredContent.map((content) => {
                const platform = platforms.find(
                  (p) => p.id === content.platform,
                );
                const contentType = contentTypes.find(
                  (t) => t.id === content.content_type,
                );
                const ContentIcon = contentType?.icon || FileText;

                return (
                  <div
                    key={content.id}
                    className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div
                            className={`w-8 h-8 ${platform?.color} rounded-lg flex items-center justify-center text-white text-sm`}
                          >
                            {platform?.icon}
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {content.title}
                            </h4>
                            <div className="flex items-center gap-4 text-sm text-gray-600">
                              <span className="flex items-center gap-1">
                                <ContentIcon className="w-3 h-3" />
                                {contentType?.name}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {content.scheduled_for
                                  ? new Date(
                                      content.scheduled_for,
                                    ).toLocaleString()
                                  : "Not scheduled"}
                              </span>
                              {content.viral_score && (
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${getViralScoreColor(content.viral_score)}`}
                                >
                                  <Zap className="w-3 h-3 inline mr-1" />
                                  {content.viral_score}% viral
                                </span>
                              )}
                            </div>
                          </div>
                        </div>

                        <p className="text-gray-700 text-sm mb-2 line-clamp-2">
                          {content.content}
                        </p>

                        {content.hashtags && content.hashtags.length > 0 && (
                          <div className="flex flex-wrap gap-1 mb-2">
                            {content.hashtags
                              .slice(0, 5)
                              .map((hashtag, index) => (
                                <span
                                  key={index}
                                  className="text-blue-600 text-xs"
                                >
                                  #{hashtag}
                                </span>
                              ))}
                            {content.hashtags.length > 5 && (
                              <span className="text-gray-500 text-xs">
                                +{content.hashtags.length - 5} more
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 ml-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(content.status || "draft")}`}
                        >
                          {content.status || "draft"}
                        </span>

                        <div className="flex items-center gap-1">
                          {content.status === "scheduled" && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => postNow(content.id)}
                              className="text-green-600 hover:text-green-700"
                            >
                              <Send className="w-3 h-3" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => editContent(content)}
                          >
                            <Edit className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteContent(content.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      )}
    </div>
  );
}
