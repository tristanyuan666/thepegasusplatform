"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar as CalendarIcon,
  Clock,
  Target,
  Users,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Copy,
  Edit,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  CalendarDays,
  Clock as Schedule,
  Play,
  Pause,
  RefreshCw,
  BarChart3,
  Filter,
  SortAsc,
  SortDesc,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ContentSchedulerProps {
  user: any;
  userProfile: any;
  hasFeatureAccess: (feature: string) => boolean;
}

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  content_type: string;
  scheduled_for: string;
  status: "draft" | "scheduled" | "published" | "failed";
  viral_score: number;
  estimated_reach: number;
  hashtags: string[];
  created_at: string;
  posted_at?: string;
  performance_data?: {
    views: number;
    likes: number;
    shares: number;
    comments: number;
  };
}

interface OptimalTime {
  platform: string;
  day: string;
  time: string;
  engagement_rate: number;
  reason: string;
}

export default function ContentScheduler({
  user,
  userProfile,
  hasFeatureAccess,
}: ContentSchedulerProps) {
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const [contentTitle, setContentTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");
  const [optimalTimes, setOptimalTimes] = useState<OptimalTime[]>([]);
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("scheduled_for");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  
  const supabase = createClient();

  useEffect(() => {
    loadScheduledContent();
    loadOptimalTimes();
  }, [user?.id]);

  const loadScheduledContent = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .in("status", ["scheduled", "draft"])
        .order("scheduled_for", { ascending: true });

      if (error) throw error;
      setScheduledContent(data || []);
    } catch (error) {
      console.error("Error loading scheduled content:", error);
      setError("Failed to load scheduled content");
    } finally {
      setIsLoading(false);
    }
  };

  const loadOptimalTimes = async () => {
    // Generate optimal posting times based on user's niche and platform
    const times: OptimalTime[] = [
      {
        platform: "tiktok",
        day: "Monday",
        time: "7:00 PM",
        engagement_rate: 85,
        reason: "Peak evening scrolling time"
      },
      {
        platform: "tiktok",
          day: "Wednesday",
        time: "6:00 PM",
        engagement_rate: 82,
        reason: "Midweek entertainment boost"
      },
      {
        platform: "tiktok",
        day: "Friday",
        time: "8:00 PM",
        engagement_rate: 88,
        reason: "Weekend anticipation"
      },
      {
        platform: "instagram",
        day: "Tuesday",
        time: "2:00 PM",
        engagement_rate: 78,
        reason: "Lunch break browsing"
      },
      {
        platform: "instagram",
          day: "Thursday",
        time: "5:00 PM",
        engagement_rate: 81,
        reason: "After-work social media"
      },
      {
        platform: "youtube",
        day: "Saturday",
        time: "10:00 AM",
        engagement_rate: 75,
        reason: "Weekend learning time"
      },
      {
        platform: "youtube",
        day: "Sunday",
        time: "3:00 PM",
        engagement_rate: 79,
        reason: "Relaxed weekend viewing"
      },
      {
        platform: "twitter",
        day: "Monday",
        time: "9:00 AM",
        engagement_rate: 72,
        reason: "Start of workweek engagement"
      },
      {
        platform: "twitter",
        day: "Wednesday",
        time: "12:00 PM",
        engagement_rate: 76,
        reason: "Midday news consumption"
      }
    ];

    // Filter based on user's connected platforms
    const userPlatforms = userProfile?.connected_platforms || ["tiktok", "instagram"];
    const filteredTimes = times.filter(time => userPlatforms.includes(time.platform));
    setOptimalTimes(filteredTimes);
  };

  const handleScheduleContent = async () => {
    if (!selectedDate || !selectedTime || !contentTitle.trim() || !contentText.trim()) {
      setError("Please fill in all required fields");
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      const scheduledDateTime = new Date(selectedDate);
      const [hours, minutes] = selectedTime.split(":").map(Number);
      scheduledDateTime.setHours(hours, minutes, 0, 0);

      // Calculate viral score based on content and timing
      const viralScore = calculateViralScore(contentText, selectedPlatform, scheduledDateTime);
      
      // Estimate reach based on timing and user's following
      const estimatedReach = estimateReach(viralScore, userProfile?.follower_count || 0, scheduledDateTime);

      const { data, error } = await supabase
        .from("content_queue")
        .insert({
          user_id: user.id,
          title: contentTitle,
          content: contentText,
          platform: selectedPlatform,
          content_type: "scheduled",
          scheduled_for: scheduledDateTime.toISOString(),
          status: "scheduled",
          viral_score: viralScore,
          estimated_reach: estimatedReach,
          hashtags: generateHashtags(userProfile?.niche || "lifestyle", selectedPlatform),
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setScheduledContent(prev => [data, ...prev]);
      
      // Clear form
      setContentTitle("");
      setContentText("");
      setSelectedDate(undefined);
      setSelectedTime("");
      
      setSuccess("Content scheduled successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error("Error scheduling content:", error);
      setError("Failed to schedule content. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  const calculateViralScore = (content: string, platform: string, scheduledTime: Date) => {
    let score = 50; // Base score
    
    // Content quality factors
    if (content.length > 50 && content.length < 500) score += 15;
    if (content.includes("?")) score += 10; // Questions
    if (content.includes("!")) score += 5; // Excitement
    if (content.includes("💡") || content.includes("🔥") || content.includes("🎯")) score += 10;
    
    // Timing optimization
    const hour = scheduledTime.getHours();
    const day = scheduledTime.getDay();
    
    // Platform-specific optimal times
    if (platform === "tiktok") {
      if ((hour >= 18 && hour <= 22) && (day === 1 || day === 3 || day === 5)) score += 20;
      if (hour >= 19 && hour <= 21) score += 15;
    }
    
    if (platform === "instagram") {
      if ((hour >= 13 && hour <= 15) || (hour >= 17 && hour <= 19)) score += 15;
      if (day === 2 || day === 4) score += 10;
    }
    
    if (platform === "youtube") {
      if ((hour >= 9 && hour <= 11) || (hour >= 14 && hour <= 16)) score += 15;
      if (day === 0 || day === 6) score += 10;
    }
    
    if (platform === "twitter") {
      if ((hour >= 8 && hour <= 10) || (hour >= 11 && hour <= 13)) score += 15;
      if (day === 1 || day === 3) score += 10;
    }
    
    return Math.min(100, Math.max(0, score));
  };

  const estimateReach = (viralScore: number, currentFollowers: number, scheduledTime: Date) => {
    const baseReach = currentFollowers * 0.1;
    const viralMultiplier = viralScore / 50;
    
    // Time-based multiplier
    const hour = scheduledTime.getHours();
    let timeMultiplier = 1;
    
    if (hour >= 18 && hour <= 22) timeMultiplier = 1.3; // Evening peak
    else if (hour >= 12 && hour <= 14) timeMultiplier = 1.2; // Lunch time
    else if (hour >= 8 && hour <= 10) timeMultiplier = 1.1; // Morning
    
    return Math.round(baseReach * viralMultiplier * timeMultiplier);
  };

  const generateHashtags = (niche: string, platform: string) => {
    const baseHashtags = {
      fitness: ["fitness", "health", "workout", "motivation"],
      business: ["business", "entrepreneur", "success", "growth"],
      lifestyle: ["lifestyle", "life", "inspiration", "motivation"],
      entertainment: ["entertainment", "fun", "viral", "trending"],
      education: ["education", "learning", "knowledge", "tips"],
    };
    
    const platformHashtags = {
      tiktok: ["fyp", "viral", "trending", "tiktok"],
      instagram: ["instagram", "reels", "viral", "trending"],
      youtube: ["youtube", "viral", "trending", "shorts"],
      twitter: ["twitter", "viral", "trending", "thread"],
    };
    
    const nicheTags = baseHashtags[niche as keyof typeof baseHashtags] || ["viral", "trending"];
    const platformTags = platformHashtags[platform as keyof typeof platformHashtags] || ["viral"];
    
    return [...nicheTags, ...platformTags].slice(0, 8);
  };

  const handleUpdateStatus = async (contentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from("content_queue")
        .update({ status: newStatus })
        .eq("id", contentId);

      if (error) throw error;
      
      // Update local state
      setScheduledContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, status: newStatus as any }
            : content
        )
      );
    } catch (error) {
      console.error("Error updating content status:", error);
      setError("Failed to update content status");
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from("content_queue")
        .delete()
        .eq("id", contentId);

      if (error) throw error;
      
      // Remove from local state
      setScheduledContent(prev => prev.filter(content => content.id !== contentId));
    } catch (error) {
      console.error("Error deleting content:", error);
      setError("Failed to delete content");
    }
  };

  const getFilteredAndSortedContent = () => {
    let filtered = scheduledContent;
    
    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter(content => content.status === filterStatus);
    }
    
    // Sort content
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;
      
      switch (sortBy) {
        case "scheduled_for":
          aValue = new Date(a.scheduled_for);
          bValue = new Date(b.scheduled_for);
          break;
        case "viral_score":
          aValue = a.viral_score;
          bValue = b.viral_score;
          break;
        case "estimated_reach":
          aValue = a.estimated_reach;
          bValue = b.estimated_reach;
          break;
        case "created_at":
          aValue = new Date(a.created_at);
          bValue = new Date(b.created_at);
          break;
        default:
          aValue = new Date(a.scheduled_for);
          bValue = new Date(b.scheduled_for);
      }
      
      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });
    
    return filtered;
  };

  if (!hasFeatureAccess("scheduler")) {
              return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Content Scheduler Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access advanced content scheduling.
            </p>
            <Button onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>
                </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Content Scheduler</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading...</span>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Content Scheduler</h2>
          <p className="text-gray-600">Schedule and optimize your content for maximum reach</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Schedule className="w-3 h-3 mr-1" />
            Smart Scheduling
          </Badge>
        </div>
          </div>

      {/* Success/Error Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="optimal">Optimal Times</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          {/* Scheduling Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-blue-600" />
                Schedule New Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">X</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                  <Label htmlFor="date">Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div>
                <Label htmlFor="time">Time</Label>
                <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                    <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                    {Array.from({ length: 24 }, (_, i) => {
                      const hour = i.toString().padStart(2, "0");
                          return (
                        <SelectItem key={hour} value={`${hour}:00`}>
                          {hour}:00
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                </div>

                <div>
                <Label htmlFor="title">Content Title</Label>
                  <Input
                  id="title"
                  value={contentTitle}
                  onChange={(e) => setContentTitle(e.target.value)}
                  placeholder="Enter content title..."
                  />
                </div>

                <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={contentText}
                  onChange={(e) => setContentText(e.target.value)}
                  placeholder="Enter your content..."
                  rows={4}
                />
                </div>

              <Button 
                onClick={handleScheduleContent}
                disabled={isScheduling || !selectedDate || !selectedTime || !contentTitle.trim() || !contentText.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isScheduling ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Scheduling Content...
                  </>
                ) : (
                  <>
                    <Schedule className="w-4 h-4 mr-2" />
                    Schedule Content
                  </>
                )}
                  </Button>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="queue" className="space-y-6">
          {/* Content Queue */}
          <Card>
            <CardHeader>
          <div className="flex items-center justify-between">
                <CardTitle>Content Queue</CardTitle>
            <div className="flex items-center gap-2">
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                </SelectContent>
              </Select>
                  
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="scheduled_for">Scheduled Date</SelectItem>
                      <SelectItem value="viral_score">Viral Score</SelectItem>
                      <SelectItem value="estimated_reach">Estimated Reach</SelectItem>
                      <SelectItem value="created_at">Created Date</SelectItem>
                    </SelectContent>
                  </Select>
                  
              <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              >
                    {sortOrder === "asc" ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />}
              </Button>
            </div>
                          </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {getFilteredAndSortedContent().map((content) => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                          <div>
                        <h4 className="font-semibold text-gray-900">{content.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {content.platform}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              content.status === "published" ? "text-green-600 border-green-600" :
                              content.status === "scheduled" ? "text-blue-600 border-blue-600" :
                              "text-gray-600 border-gray-600"
                            }`}
                          >
                            {content.status}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              content.viral_score >= 80 ? "text-green-600 border-green-600" :
                              content.viral_score >= 60 ? "text-yellow-600 border-yellow-600" :
                              "text-red-600 border-red-600"
                            }`}
                          >
                                  {content.viral_score}% viral
                          </Badge>
                            </div>
                          </div>
                      <div className="flex items-center gap-2">
                            <Button
                              variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(content.id, "published")}
                          disabled={content.status === "published"}
                            >
                          <Play className="w-4 h-4" />
                            </Button>
                          <Button
                            variant="outline"
                          size="sm"
                          onClick={() => handleUpdateStatus(content.id, "draft")}
                          >
                          <Pause className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                          size="sm"
                          onClick={() => handleDeleteContent(content.id)}
                          >
                          <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    <p className="text-gray-700 text-sm mb-3">{content.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-4">
                        <span>
                          <Clock className="w-3 h-3 inline mr-1" />
                          {format(new Date(content.scheduled_for), "MMM dd, yyyy 'at' h:mm a")}
                        </span>
                        <span>
                          <Eye className="w-3 h-3 inline mr-1" />
                          {content.estimated_reach.toLocaleString()} estimated reach
                        </span>
                    </div>
                      <div className="flex items-center gap-1">
                        {content.hashtags?.slice(0, 3).map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            #{tag}
                          </Badge>
                        ))}
                  </div>
            </div>
                  </div>
                ))}
              </div>
            </CardContent>
        </Card>
        </TabsContent>

        <TabsContent value="optimal" className="space-y-6">
          {/* Optimal Times */}
          <Card>
            <CardHeader>
              <CardTitle>Optimal Posting Times</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {optimalTimes.map((time, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{time.platform}</h4>
                        <p className="text-sm text-gray-600">{time.day} at {time.time}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          time.engagement_rate >= 80 ? "text-green-600 border-green-600" :
                          time.engagement_rate >= 70 ? "text-yellow-600 border-yellow-600" :
                          "text-red-600 border-red-600"
                        }`}
                      >
                        {time.engagement_rate}% engagement
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{time.reason}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Scheduling Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Scheduling Analytics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {scheduledContent.filter(c => c.status === "scheduled").length}
                  </div>
                  <p className="text-sm text-gray-600">Scheduled</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {scheduledContent.filter(c => c.status === "published").length}
                  </div>
                  <p className="text-sm text-gray-600">Published</p>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {Math.round(scheduledContent.reduce((sum, c) => sum + c.viral_score, 0) / Math.max(scheduledContent.length, 1))}%
                  </div>
                  <p className="text-sm text-gray-600">Avg Viral Score</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
