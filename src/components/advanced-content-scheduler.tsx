"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Calendar } from "./ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import {
  Calendar as CalendarIcon, Clock, Sparkles, TrendingUp, Target, Users, 
  Copy, Eye, CheckCircle, AlertCircle, RefreshCw, FileText, Video,
  Camera, MessageCircle, Play, Globe, Zap, Crown, Save, Send,
  BarChart3, Brain, Rocket, Settings, Timer, Zap
} from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface ScheduledContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  contentType: string;
  scheduledFor: Date;
  status: "draft" | "scheduled" | "published" | "failed";
  viralScore: number;
  estimatedViews: string;
  hashtags: string[];
  targetAudience: string;
  optimizedTime: string;
  timezone: string;
  createdAt: string;
}

interface AdvancedContentSchedulerProps {
  userProfile: any;
  platformConnections: any[];
}

export default function AdvancedContentScheduler({
  userProfile,
  platformConnections
}: AdvancedContentSchedulerProps) {
  const [isScheduling, setIsScheduling] = useState(false);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [contentTitle, setContentTitle] = useState("");
  const [contentText, setContentText] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  const [selectedTime, setSelectedTime] = useState("");
  const [targetAudience, setTargetAudience] = useState("general");
  const [scheduledContent, setScheduledContent] = useState<ScheduledContent[]>([]);
  const [optimizedTimes, setOptimizedTimes] = useState<any>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("schedule");

  // Advanced Content Scheduling
  const scheduleAdvancedContent = async () => {
    if (!contentTitle.trim() || !contentText.trim() || !selectedDate || !selectedTime) {
      setError("Please fill in all required fields");
      return;
    }

    setIsScheduling(true);
    setError(null);

    try {
      // Simulate advanced scheduling processing
      await new Promise(resolve => setTimeout(resolve, 2000));

      const platformData = getPlatformData(selectedPlatform);
      const audienceData = getAudienceData(targetAudience);
      const optimizedTime = await optimizePostingTime(selectedPlatform, selectedDate, audienceData);
      const viralScore = calculateViralScore(platformData, audienceData);
      const estimatedViews = calculateEstimatedViews(viralScore, platformData);

      const newScheduledContent: ScheduledContent = {
        id: `scheduled_${Date.now()}`,
        title: contentTitle,
        content: contentText,
        platform: selectedPlatform,
        contentType: selectedContentType,
        scheduledFor: selectedDate,
        status: "scheduled",
        viralScore,
        estimatedViews,
        hashtags: generateHashtags(contentTitle, selectedPlatform),
        targetAudience,
        optimizedTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        createdAt: new Date().toISOString()
      };

      setScheduledContent(prev => [newScheduledContent, ...prev]);
      setSuccess("Content scheduled successfully!");
      setTimeout(() => setSuccess(null), 3000);

      // Reset form
      setContentTitle("");
      setContentText("");
      setSelectedDate(undefined);
      setSelectedTime("");

    } catch (error) {
      console.error("Error scheduling content:", error);
      setError("Failed to schedule content. Please try again.");
    } finally {
      setIsScheduling(false);
    }
  };

  // Advanced Time Optimization
  const optimizeAllTiming = async () => {
    setIsOptimizing(true);
    setError(null);

    try {
      // Simulate advanced optimization processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const platforms = ['instagram', 'tiktok', 'youtube', 'x', 'linkedin', 'facebook'];
      const optimizedTimesData: any = {};

      for (const platform of platforms) {
        const platformData = getPlatformData(platform);
        const audienceData = getAudienceData(targetAudience);
        
        optimizedTimesData[platform] = {
          bestTimes: await getOptimalTimes(platform, audienceData),
          engagementRate: calculateEngagementRate(platform, audienceData),
          viralPotential: calculateViralPotential(platform, audienceData),
          audienceActivity: getAudienceActivity(platform, audienceData)
        };
      }

      setOptimizedTimes(optimizedTimesData);
      setSuccess("Timing optimization completed!");
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error("Error optimizing timing:", error);
      setError("Failed to optimize timing. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  // Platform-specific data
  const getPlatformData = (platform: string) => {
    const platformData = {
      instagram: {
        bestPostingTimes: ['09:00', '12:00', '18:00', '21:00'],
        engagementRate: 0.85,
        viralMultiplier: 1.2,
        audiencePeakHours: [9, 12, 18, 21],
        contentTypes: ['post', 'story', 'reel', 'carousel']
      },
      tiktok: {
        bestPostingTimes: ['19:00', '20:00', '21:00', '22:00'],
        engagementRate: 1.1,
        viralMultiplier: 1.5,
        audiencePeakHours: [19, 20, 21, 22],
        contentTypes: ['video', 'duet', 'stitch']
      },
      youtube: {
        bestPostingTimes: ['15:00', '16:00', '17:00', '18:00'],
        engagementRate: 0.6,
        viralMultiplier: 1.0,
        audiencePeakHours: [15, 16, 17, 18],
        contentTypes: ['video', 'short', 'live']
      },
      x: {
        bestPostingTimes: ['12:00', '13:00', '14:00', '15:00'],
        engagementRate: 0.4,
        viralMultiplier: 0.8,
        audiencePeakHours: [12, 13, 14, 15],
        contentTypes: ['tweet', 'thread', 'poll']
      },
      linkedin: {
        bestPostingTimes: ['08:00', '09:00', '10:00', '11:00'],
        engagementRate: 0.3,
        viralMultiplier: 0.6,
        audiencePeakHours: [8, 9, 10, 11],
        contentTypes: ['post', 'article', 'poll']
      },
      facebook: {
        bestPostingTimes: ['18:00', '19:00', '20:00', '21:00'],
        engagementRate: 0.5,
        viralMultiplier: 0.9,
        audiencePeakHours: [18, 19, 20, 21],
        contentTypes: ['post', 'story', 'video', 'poll']
      }
    };

    return platformData[platform as keyof typeof platformData] || platformData.instagram;
  };

  // Audience data
  const getAudienceData = (audience: string) => {
    const audienceData = {
      general: {
        ageRange: '18-65',
        activeHours: [9, 12, 18, 21],
        engagementStyle: 'passive',
        timezonePreferences: ['local', 'peak_hours']
      },
      professionals: {
        ageRange: '25-55',
        activeHours: [8, 12, 18, 20],
        engagementStyle: 'active',
        timezonePreferences: ['business_hours', 'lunch_break']
      },
      creators: {
        ageRange: '18-35',
        activeHours: [10, 14, 19, 22],
        engagementStyle: 'very_active',
        timezonePreferences: ['peak_engagement', 'trending_hours']
      },
      entrepreneurs: {
        ageRange: '25-45',
        activeHours: [7, 12, 18, 21],
        engagementStyle: 'active',
        timezonePreferences: ['early_morning', 'evening']
      },
      students: {
        ageRange: '16-25',
        activeHours: [10, 15, 19, 23],
        engagementStyle: 'moderate',
        timezonePreferences: ['after_school', 'evening']
      }
    };

    return audienceData[audience as keyof typeof audienceData] || audienceData.general;
  };

  // Optimize posting time for specific platform and audience
  const optimizePostingTime = async (platform: string, date: Date, audienceData: any) => {
    const platformData = getPlatformData(platform);
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Adjust times based on day of week and audience
    let optimalTimes = [...platformData.bestPostingTimes];
    
    if (isWeekend) {
      // Weekend times are typically later
      optimalTimes = optimalTimes.map(time => {
        const [hour, minute] = time.split(':').map(Number);
        return `${hour + 1}:${minute.toString().padStart(2, '0')}`;
      });
    }

    // Select the best time based on audience activity
    const bestTimeIndex = audienceData.activeHours.findIndex((hour: number) => 
      optimalTimes.some(time => parseInt(time.split(':')[0]) === hour)
    );

    return optimalTimes[bestTimeIndex] || optimalTimes[0];
  };

  // Get optimal times for platform
  const getOptimalTimes = async (platform: string, audienceData: any) => {
    const platformData = getPlatformData(platform);
    const audienceHours = audienceData.activeHours;
    
    return platformData.bestPostingTimes.map(time => {
      const hour = parseInt(time.split(':')[0]);
      const isPeakHour = audienceHours.includes(hour);
      return {
        time,
        isOptimal: isPeakHour,
        engagementScore: isPeakHour ? 95 : 75,
        reason: isPeakHour ? 'Peak audience activity' : 'Standard posting time'
      };
    });
  };

  // Calculate engagement rate
  const calculateEngagementRate = (platform: string, audienceData: any) => {
    const platformData = getPlatformData(platform);
    const baseRate = platformData.engagementRate;
    const audienceMultiplier = audienceData.engagementStyle === 'very_active' ? 1.3 : 
                              audienceData.engagementStyle === 'active' ? 1.1 : 0.9;
    
    return Math.round(baseRate * audienceMultiplier * 100);
  };

  // Calculate viral potential
  const calculateViralPotential = (platform: string, audienceData: any) => {
    const platformData = getPlatformData(platform);
    const basePotential = platformData.viralMultiplier;
    const audienceMultiplier = audienceData.engagementStyle === 'very_active' ? 1.4 : 
                              audienceData.engagementStyle === 'active' ? 1.2 : 1.0;
    
    return Math.round(basePotential * audienceMultiplier * 100);
  };

  // Get audience activity data
  const getAudienceActivity = (platform: string, audienceData: any) => {
    const platformData = getPlatformData(platform);
    const peakHours = platformData.audiencePeakHours;
    const audienceHours = audienceData.activeHours;
    
    const overlap = peakHours.filter(hour => audienceHours.includes(hour));
    const activityScore = (overlap.length / Math.max(peakHours.length, audienceHours.length)) * 100;
    
    return {
      score: Math.round(activityScore),
      peakHours: overlap,
      description: activityScore > 70 ? 'High alignment' : 
                  activityScore > 40 ? 'Moderate alignment' : 'Low alignment'
    };
  };

  // Calculate viral score
  const calculateViralScore = (platformData: any, audienceData: any) => {
    let baseScore = 75;

    // Platform optimization
    baseScore *= platformData.viralMultiplier;

    // Audience engagement
    if (audienceData.engagementStyle === 'very_active') baseScore += 10;
    if (audienceData.engagementStyle === 'active') baseScore += 5;

    // Add realistic randomness
    baseScore += Math.floor(Math.random() * 15) - 5;

    return Math.max(65, Math.min(95, Math.round(baseScore)));
  };

  // Calculate estimated views
  const calculateEstimatedViews = (viralScore: number, platformData: any) => {
    const baseViews = 10000;
    const engagementMultiplier = viralScore / 100;
    const platformMultiplier = platformData.engagementRate;
    
    const estimatedViews = baseViews * engagementMultiplier * platformMultiplier;
    return Math.floor(estimatedViews).toLocaleString();
  };

  // Generate hashtags
  const generateHashtags = (title: string, platform: string) => {
    const cleanTitle = title.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanTitle.split(' ').filter(word => word.length > 2);
    const topic = words.slice(0, 3).join(' ').replace(/\s+/g, '');

    const platformHashtags = {
      instagram: ['viral', 'trending', 'lifestyle', 'inspiration', 'success', 'motivation'],
      tiktok: ['fyp', 'viral', 'trending', 'success', 'motivation', 'lifechanging'],
      youtube: ['viral', 'success', 'motivation', 'tutorial', 'educational'],
      x: ['viral', 'success', 'motivation', 'thread', 'insights'],
      linkedin: ['professional', 'success', 'business', 'leadership', 'career'],
      facebook: ['viral', 'success', 'motivation', 'community', 'lifechanging']
    };

    const baseHashtags = [topic, 'success', 'motivation'];
    const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.instagram;
    
    return [...baseHashtags, ...platformSpecific].slice(0, 8);
  };

  // Handle content actions
  const handleEditContent = (contentId: string) => {
    const content = scheduledContent.find(c => c.id === contentId);
    if (content) {
      setContentTitle(content.title);
      setContentText(content.content);
      setSelectedPlatform(content.platform);
      setSelectedContentType(content.contentType);
      setSelectedDate(content.scheduledFor);
      setTargetAudience(content.targetAudience);
      setActiveTab("schedule");
    }
  };

  const handleDeleteContent = (contentId: string) => {
    setScheduledContent(prev => prev.filter(c => c.id !== contentId));
    setSuccess("Content deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCopyContent = (content: ScheduledContent) => {
    const contentText = `${content.title}\n\n${content.content}\n\nPlatform: ${content.platform}\nScheduled for: ${format(content.scheduledFor, 'PPP p')}\nViral Score: ${content.viralScore}%\nEstimated Views: ${content.estimatedViews}\n\nHashtags: ${content.hashtags.map(tag => `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(contentText);
    setSuccess("Content copied to clipboard!");
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-green-600 via-green-700 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-green-500/25">
            <CalendarIcon className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-green-900 to-slate-900 bg-clip-text text-transparent">
              Advanced Content Scheduler
            </h1>
            <p className="text-slate-600 font-medium">Schedule content with AI-optimized timing and advanced analytics</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="schedule">Schedule Content</TabsTrigger>
          <TabsTrigger value="calendar">Content Calendar</TabsTrigger>
          <TabsTrigger value="optimization">Timing Optimization</TabsTrigger>
        </TabsList>

        <TabsContent value="schedule" className="space-y-6">
          {/* Scheduling Form */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Send className="w-5 h-5 text-green-600" />
                Schedule New Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="content-title" className="text-sm font-medium text-gray-700">
                      Content Title
                    </Label>
                    <Input
                      id="content-title"
                      value={contentTitle}
                      onChange={(e) => setContentTitle(e.target.value)}
                      placeholder="Enter your content title"
                      className="border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="content-text" className="text-sm font-medium text-gray-700">
                      Content Text
                    </Label>
                    <Textarea
                      id="content-text"
                      value={contentText}
                      onChange={(e) => setContentText(e.target.value)}
                      placeholder="Enter your content text"
                      className="min-h-[120px] border-gray-300 focus:border-green-500 focus:ring-green-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Platform</Label>
                      <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="instagram">📸 Instagram</SelectItem>
                          <SelectItem value="tiktok">🎬 TikTok</SelectItem>
                          <SelectItem value="youtube">🎥 YouTube</SelectItem>
                          <SelectItem value="x">🐦 X (Twitter)</SelectItem>
                          <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                          <SelectItem value="facebook">📱 Facebook</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-gray-700">Content Type</Label>
                      <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="post">📝 Post</SelectItem>
                          <SelectItem value="story">📱 Story</SelectItem>
                          <SelectItem value="reel">🎬 Reel</SelectItem>
                          <SelectItem value="video">📹 Video</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Schedule Date</Label>
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

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Schedule Time</Label>
                    <Select value={selectedTime} onValueChange={setSelectedTime}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select time" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="09:00">09:00 AM</SelectItem>
                        <SelectItem value="12:00">12:00 PM</SelectItem>
                        <SelectItem value="15:00">03:00 PM</SelectItem>
                        <SelectItem value="18:00">06:00 PM</SelectItem>
                        <SelectItem value="19:00">07:00 PM</SelectItem>
                        <SelectItem value="20:00">08:00 PM</SelectItem>
                        <SelectItem value="21:00">09:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                    <Select value={targetAudience} onValueChange={setTargetAudience}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">👥 General</SelectItem>
                        <SelectItem value="professionals">💼 Professionals</SelectItem>
                        <SelectItem value="creators">🎨 Creators</SelectItem>
                        <SelectItem value="entrepreneurs">🚀 Entrepreneurs</SelectItem>
                        <SelectItem value="students">🎓 Students</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="pt-4">
                    <Button
                      onClick={scheduleAdvancedContent}
                      disabled={isScheduling || !contentTitle.trim() || !contentText.trim() || !selectedDate || !selectedTime}
                      className="w-full bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isScheduling ? (
                        <>
                          <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                          <span className="text-lg">Scheduling Content...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5 mr-3" />
                          <span className="text-lg">Schedule Content</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="calendar" className="space-y-6">
          {/* Content Calendar */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-green-600" />
                Scheduled Content
              </CardTitle>
            </CardHeader>
            <CardContent>
              {scheduledContent.length > 0 ? (
                <div className="space-y-4">
                  {scheduledContent.map((content) => (
                    <Card key={content.id} className="p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{content.title}</h3>
                            <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white">
                              {content.viralScore}% Viral
                            </Badge>
                            <Badge variant="outline" className="bg-blue-50 text-blue-700">
                              {content.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{content.content.substring(0, 100)}...</p>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Platform</Label>
                              <p className="text-sm text-gray-900 capitalize">{content.platform}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Scheduled For</Label>
                              <p className="text-sm text-gray-900">{format(content.scheduledFor, 'PPP p')}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Estimated Views</Label>
                              <p className="text-sm text-gray-900">{content.estimatedViews}</p>
                            </div>
                            <div>
                              <Label className="text-xs font-medium text-gray-500">Optimized Time</Label>
                              <p className="text-sm text-gray-900">{content.optimizedTime}</p>
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label className="text-xs font-medium text-gray-500">Hashtags</Label>
                            <div className="flex flex-wrap gap-1">
                              {content.hashtags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 ml-4">
                          <Button
                            onClick={() => handleEditContent(content.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Settings className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            onClick={() => handleCopyContent(content)}
                            size="sm"
                            variant="outline"
                          >
                            <Copy className="w-4 h-4 mr-1" />
                            Copy
                          </Button>
                          <Button
                            onClick={() => handleDeleteContent(content.id)}
                            size="sm"
                            variant="outline"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <AlertCircle className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <CalendarIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Scheduled Content</h3>
                  <p className="text-gray-600">Schedule your first content to see it here.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimization" className="space-y-6">
          {/* Timing Optimization */}
          <Card className="p-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="w-5 h-5 text-green-600" />
                AI Timing Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Button
                  onClick={optimizeAllTiming}
                  disabled={isOptimizing}
                  className="bg-gradient-to-r from-green-600 via-green-700 to-emerald-600 hover:from-green-700 hover:via-green-800 hover:to-emerald-700 text-white font-semibold py-4 px-8 rounded-2xl shadow-lg shadow-green-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                      <span className="text-lg">Optimizing Timing...</span>
                    </>
                  ) : (
                    <>
                      <Zap className="w-5 h-5 mr-3" />
                      <span className="text-lg">Optimize All Timing</span>
                    </>
                  )}
                </Button>
              </div>

              {Object.keys(optimizedTimes).length > 0 && (
                <div className="grid gap-6">
                  {Object.entries(optimizedTimes).map(([platform, data]: [string, any]) => (
                    <Card key={platform} className="p-4">
                      <div className="flex items-center gap-3 mb-4">
                        <h3 className="text-lg font-semibold text-gray-900 capitalize">{platform}</h3>
                        <Badge className="bg-green-600 text-white">
                          {data.engagementRate}% Engagement
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2">Optimal Posting Times</Label>
                          <div className="space-y-2">
                            {data.bestTimes.map((time: any, index: number) => (
                              <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                <span className="text-sm font-medium">{time.time}</span>
                                <Badge variant={time.isOptimal ? "default" : "outline"} className="text-xs">
                                  {time.engagementScore}% Score
                                </Badge>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Viral Potential</Label>
                            <p className="text-2xl font-bold text-green-600">{data.viralPotential}%</p>
                          </div>
                          
                          <div>
                            <Label className="text-sm font-medium text-gray-700">Audience Activity</Label>
                            <p className="text-sm text-gray-600">{data.audienceActivity.description}</p>
                            <p className="text-lg font-semibold text-blue-600">{data.audienceActivity.score}%</p>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 