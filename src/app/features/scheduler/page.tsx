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
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  Zap,
  Plus,
  Edit3,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Target,
  Eye,
  Share2,
  Copy,
  Send,
  Settings,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Filter,
  Search,
  TrendingUp,
  BarChart3,
  Users,
  MessageCircle,
  Heart,
  Instagram,
  Youtube,
  Twitter,
  Facebook,
  Linkedin,
  Music,
  FileText,
  Video,
  Image,
  Camera,
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  contentType: string;
  scheduledDate: Date;
  status: "scheduled" | "published" | "failed" | "draft";
  viralScore: number;
  estimatedViews: string;
  hashtags: string[];
  createdAt: string;
  updatedAt: string;
}

interface PlatformStats {
  platform: string;
  scheduledCount: number;
  publishedCount: number;
  engagementRate: number;
  bestTime: string;
}

export default function SchedulerPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [selectedContent, setSelectedContent] = useState<ScheduledContent | null>(null);
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [isScheduling, setIsScheduling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("calendar");
  const [showScheduler, setShowScheduler] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadScheduledContent();
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

  const loadScheduledContent = async () => {
    try {
      // Mock data for demonstration
      const mockScheduled: ScheduledContent[] = [
        {
          id: "1",
          title: "Morning Motivation Post",
          content: "🔥 Start your day with purpose!\n\nEvery morning is a new opportunity to:\n• Set your intentions\n• Take action on your goals\n• Make progress toward your dreams\n\nWhat's your biggest goal today? Comment below! 👇\n\n#motivation #morning #goals #success #mindset",
          platform: "Instagram",
          contentType: "post",
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
          status: "scheduled",
          viralScore: 87,
          estimatedViews: "125K",
          hashtags: ["#motivation", "#morning", "#goals", "#success", "#mindset"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "Behind the Scenes Story",
          content: "A day in my life as a content creator:\n\n🌅 6:00 AM - Morning routine\n💻 8:00 AM - Content planning\n📱 10:00 AM - Shooting content\n✍️ 2:00 PM - Writing captions\n📊 4:00 PM - Analytics review\n🌙 8:00 PM - Community engagement\n\nWhat does your typical day look like? Share below! 👇",
          platform: "Instagram",
          contentType: "story",
          scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Day after tomorrow
          status: "scheduled",
          viralScore: 78,
          estimatedViews: "89K",
          hashtags: ["#behindthescenes", "#authentic", "#reallife", "#work"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "3",
          title: "Tutorial Video Script",
          content: "How to create viral content in 5 simple steps:\n\nStep 1: Hook your audience in the first 3 seconds\nStep 2: Deliver value immediately\nStep 3: Keep it concise and clear\nStep 4: End with a strong call-to-action\nStep 5: Use trending hashtags strategically\n\nTry this formula and watch your engagement soar! 🚀",
          platform: "TikTok",
          contentType: "video",
          scheduledDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
          status: "scheduled",
          viralScore: 92,
          estimatedViews: "250K",
          hashtags: ["#tutorial", "#contentcreation", "#viral", "#tips", "#socialmedia"],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setScheduledContent(mockScheduled);
    } catch (error) {
      console.error("Error loading scheduled content:", error);
    }
  };

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Instagram, color: "from-pink-500 to-purple-600" },
    { id: "tiktok", name: "TikTok", icon: Music, color: "from-black to-gray-800" },
    { id: "youtube", name: "YouTube", icon: Youtube, color: "from-red-500 to-red-700" },
    { id: "twitter", name: "Twitter", icon: Twitter, color: "from-blue-400 to-blue-600" },
    { id: "facebook", name: "Facebook", icon: Facebook, color: "from-blue-600 to-blue-800" },
    { id: "linkedin", name: "LinkedIn", icon: Linkedin, color: "from-blue-700 to-blue-900" },
  ];

  const contentTypes = [
    { id: "post", name: "Post", icon: FileText },
    { id: "story", name: "Story", icon: Camera },
    { id: "video", name: "Video", icon: Video },
    { id: "image", name: "Image", icon: Image },
  ];

  const platformStats: PlatformStats[] = [
    { platform: "Instagram", scheduledCount: 5, publishedCount: 12, engagementRate: 4.2, bestTime: "9:00 AM" },
    { platform: "TikTok", scheduledCount: 3, publishedCount: 8, engagementRate: 6.8, bestTime: "7:00 PM" },
    { platform: "YouTube", scheduledCount: 2, publishedCount: 4, engagementRate: 3.1, bestTime: "2:00 PM" },
    { platform: "Twitter", scheduledCount: 4, publishedCount: 15, engagementRate: 2.9, bestTime: "12:00 PM" },
  ];

  const scheduleContent = async (content: Partial<ScheduledContent>) => {
    setIsScheduling(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate scheduling
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const newScheduled: ScheduledContent = {
        id: Date.now().toString(),
        title: content.title || "New Scheduled Content",
        content: content.content || "",
        platform: content.platform || "Instagram",
        contentType: content.contentType || "post",
        scheduledDate: content.scheduledDate || new Date(),
        status: "scheduled",
        viralScore: Math.floor(Math.random() * 20) + 80,
        estimatedViews: `${Math.floor(Math.random() * 500 + 100)}K`,
        hashtags: content.hashtags || ["#content", "#socialmedia"],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setScheduledContent((prev) => [newScheduled, ...prev]);
      setSuccess("Content scheduled successfully!");
      setShowScheduler(false);
    } catch (error) {
      console.error("Error scheduling content:", error);
      setError("Failed to schedule content. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  const getContentForDate = (date: Date) => {
    return scheduledContent.filter(
      (content) => format(content.scheduledDate, "yyyy-MM-dd") === format(date, "yyyy-MM-dd")
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "scheduled":
        return "bg-blue-100 text-blue-800";
      case "published":
        return "bg-green-100 text-green-800";
      case "failed":
        return "bg-red-100 text-red-800";
      case "draft":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

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
              <CalendarIcon className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Content Scheduler
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Schedule Content with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Smart Timing
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Automatically schedule your content at optimal times for maximum
              engagement across all your social media platforms.
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

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="calendar">Calendar View</TabsTrigger>
              <TabsTrigger value="list">Scheduled List</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="calendar" className="space-y-6">
              {/* Calendar View */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Content Calendar</h3>
                      <Button onClick={() => setShowScheduler(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Content
                      </Button>
        </div>
                    
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      className="rounded-md border"
                      modifiers={{
                        scheduled: (date) => getContentForDate(date).length > 0,
                      }}
                      modifiersStyles={{
                        scheduled: { backgroundColor: "#3b82f6", color: "white" },
                      }}
                    />
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Quick Stats */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">Scheduled Today</span>
                        <Badge variant="outline">{getContentForDate(new Date()).length}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">This Week</span>
                        <Badge variant="outline">
                          {scheduledContent.filter(c => 
                            c.scheduledDate >= new Date() && 
                            c.scheduledDate <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
                          ).length}
                        </Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">This Month</span>
                        <Badge variant="outline">
                          {scheduledContent.filter(c => 
                            c.scheduledDate >= new Date() && 
                            c.scheduledDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                          ).length}
                        </Badge>
                      </div>
                    </div>
                  </Card>

                  {/* Platform Performance */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
                    <div className="space-y-3">
                      {platformStats.map((stat) => (
                        <div key={stat.platform} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                          <div>
                            <p className="font-medium text-sm">{stat.platform}</p>
                            <p className="text-xs text-gray-600">Best time: {stat.bestTime}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm font-medium">{stat.scheduledCount} scheduled</p>
                            <p className="text-xs text-green-600">{stat.engagementRate}% engagement</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>

              {/* Selected Date Content */}
              {date && (
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Content for {format(date, "MMMM d, yyyy")}
              </h3>
                  <div className="space-y-4">
                    {getContentForDate(date).length > 0 ? (
                      getContentForDate(date).map((content) => (
                        <div key={content.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h4 className="font-medium text-gray-900">{content.title}</h4>
                              <Badge className={getStatusColor(content.status)}>
                                {content.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{content.content.substring(0, 100)}...</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <Clock className="w-3 h-3" />
                                {format(content.scheduledDate, "h:mm a")}
                              </span>
                              <span className="flex items-center gap-1">
                                <Target className="w-3 h-3" />
                                {content.viralScore}% viral
                              </span>
                              <span className="flex items-center gap-1">
                                <Eye className="w-3 h-3" />
                                {content.estimatedViews}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Copy className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>No content scheduled for this date</p>
                        <Button 
                          onClick={() => setShowScheduler(true)} 
                          className="mt-2"
                          variant="outline"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Schedule Content
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="list" className="space-y-6">
              {/* Scheduled Content List */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">Scheduled Content</h3>
                  <Button onClick={() => setShowScheduler(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Schedule New Content
                  </Button>
            </div>

                <div className="space-y-4">
                  {scheduledContent.length > 0 ? (
                    scheduledContent.map((content) => (
                      <div key={content.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">{content.title}</h4>
                            <Badge className={getStatusColor(content.status)}>
                              {content.status}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{content.content.substring(0, 150)}...</p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <CalendarIcon className="w-3 h-3" />
                              {format(content.scheduledDate, "MMM d, yyyy")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {format(content.scheduledDate, "h:mm a")}
                            </span>
                            <span className="flex items-center gap-1">
                              <Target className="w-3 h-3" />
                              {content.viralScore}% viral
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.estimatedViews}
                            </span>
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {content.hashtags.slice(0, 3).map((tag, index) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {content.hashtags.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{content.hashtags.length - 3} more
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Copy className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Play className="w-4 h-4" />
                          </Button>
                          <Button variant="ghost" size="sm" className="text-red-600">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CalendarIcon className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No content scheduled yet</p>
                      <Button 
                        onClick={() => setShowScheduler(true)} 
                        className="mt-2"
                        variant="outline"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Schedule Your First Content
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              {/* Scheduling Analytics */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Total Scheduled</h3>
                      <p className="text-2xl font-bold text-blue-600">{scheduledContent.length}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Content pieces scheduled</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Avg Engagement</h3>
                      <p className="text-2xl font-bold text-green-600">4.2%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Across all platforms</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Best Time</h3>
                      <p className="text-2xl font-bold text-purple-600">9:00 AM</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Optimal posting time</p>
                </Card>
              </div>

              {/* Platform Performance Chart */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Platform Performance</h3>
                <div className="space-y-4">
                  {platformStats.map((stat) => (
                    <div key={stat.platform} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-sm font-medium">{stat.platform.charAt(0)}</span>
                        </div>
                        <div>
                          <h4 className="font-medium">{stat.platform}</h4>
                          <p className="text-sm text-gray-600">Best time: {stat.bestTime}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{stat.scheduledCount} scheduled</p>
                        <p className="text-xs text-green-600">{stat.engagementRate}% engagement</p>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              {/* Scheduler Settings */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Scheduler Settings</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Auto-Scheduling</h4>
                      <p className="text-sm text-gray-600">Automatically schedule content at optimal times</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Configure
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Time Zone</h4>
                      <p className="text-sm text-gray-600">Set your local time zone for accurate scheduling</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Change
                    </Button>
            </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h4 className="font-medium">Notifications</h4>
                      <p className="text-sm text-gray-600">Get notified when content is scheduled or published</p>
              </div>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage
                    </Button>
            </div>
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
