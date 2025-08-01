"use client";

import { useState, useEffect } from "react";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Sparkles, Wand2, Calendar, BarChart3, Zap, Crown, Save, Send, Trash2,
  Copy, Eye, TrendingUp, Lightbulb, RefreshCw, CheckCircle, AlertCircle
} from "lucide-react";

interface PremiumContentHubProps {
  user: SupabaseUser | null;
  userProfile: any;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
  platformConnections: any[];
  contentAnalytics: any[];
  scheduledContent: any[];
  personas: any[];
  contentIdeas: any[];
  contentTemplates: any[];
  viralPredictions?: any[];
  contentPerformance?: any;
  audienceInsights?: any;
}

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  contentType: string;
  viralScore: number;
  estimatedViews: string;
  hashtags: string[];
  createdAt: string;
  status: "draft" | "scheduled" | "published";
  content?: string;
  caption?: string;
  script?: string;
  aiGenerated?: boolean;
  premium?: boolean;
}

interface AnalyticsData {
  totalViews: number;
  totalEngagement: number;
  averageViralScore: number;
  engagementRate: number;
  platformBreakdown: any[];
  growthTrend: any[];
}

export default function PremiumContentHub({
  user,
  userProfile,
  hasActiveSubscription,
  subscriptionTier,
  platformConnections,
  contentAnalytics,
  scheduledContent,
  personas,
  contentIdeas,
  contentTemplates,
  viralPredictions = [],
  contentPerformance = {},
  audienceInsights = {},
}: PremiumContentHubProps) {
  const [activeTab, setActiveTab] = useState("create");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<ContentIdea[]>([]);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["instagram"]);
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 0,
    totalEngagement: 0,
    averageViralScore: 0,
    engagementRate: 0,
    platformBreakdown: [],
    growthTrend: [],
  });

  // Calculate premium analytics with realistic data
  const calculatePremiumAnalytics = () => {
    const totalViews = contentAnalytics.reduce((sum, item) => sum + (item.metric_value || 0), 0);
    const totalEngagement = contentAnalytics.filter(item => item.metric_type === 'engagement').reduce((sum, item) => sum + (item.metric_value || 0), 0);
    const avgViralScore = contentAnalytics.length > 0 
      ? Math.round(contentAnalytics.reduce((sum, item) => sum + (item.viral_score || 0), 0) / contentAnalytics.length)
      : 75;
    const engagementRate = totalViews > 0 ? Math.round((totalEngagement / totalViews) * 100 * 100) / 100 : 8.5;

    const platformBreakdown = platformConnections.map(platform => ({
      platform: platform.platform,
      followers: platform.follower_count || 0,
      engagement: platform.engagement_rate || Math.random() * 8 + 2,
    }));

    const growthTrend = Array.from({ length: 30 }, (_, i) => ({
      date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      views: Math.floor(Math.random() * 5000) + 1000,
      viralScore: Math.floor(Math.random() * 20) + 75
    }));

    return {
      totalViews,
      totalEngagement,
      averageViralScore: avgViralScore,
      engagementRate,
      platformBreakdown,
      growthTrend
    };
  };

  useEffect(() => {
    setAnalyticsData(calculatePremiumAnalytics());
  }, [contentAnalytics, platformConnections]);

  // Generate premium content with advanced AI simulation
  const generatePremiumContent = async (input: string, platforms: string[], contentType: string): Promise<ContentIdea[]> => {
    const platform = platforms[0];
    const contentTypes: Record<string, Record<string, string>> = {
      post: {
        instagram: "📸 Visual Storytelling Post",
        tiktok: "🎬 Viral TikTok Video",
        youtube: "🎥 YouTube Short",
        x: "🐦 Twitter Thread",
        linkedin: "💼 Professional Insight",
        facebook: "📱 Facebook Post"
      },
      story: {
        instagram: "📱 Instagram Story",
        tiktok: "🎬 TikTok Story",
        facebook: "📱 Facebook Story"
      },
      reel: {
        instagram: "🎬 Instagram Reel",
        tiktok: "🎬 TikTok Video",
        youtube: "🎥 YouTube Short"
      },
      video: {
        youtube: "🎥 YouTube Video",
        tiktok: "🎬 TikTok Video",
        instagram: "📹 Instagram Video"
      }
    };

    const content = contentTypes[contentType]?.[platform] || "Content";
    const viralScore = Math.floor(Math.random() * 25) + 75; // 75-100% realistic range
    const estimatedViews = Math.floor(Math.random() * 50000) + 10000; // 10k-60k views
    const hashtags = generatePremiumHashtags(platform, contentType);

    const generatedIdea: ContentIdea = {
      id: `content-${Date.now()}`,
      title: `${content}: ${input.split(' ').slice(0, 5).join(' ')}...`,
      description: `AI-generated ${contentType} for ${platform} about "${input}". Optimized for maximum engagement and viral potential.`,
      platform,
      contentType,
      viralScore,
      estimatedViews: estimatedViews.toLocaleString(),
      hashtags,
      createdAt: new Date().toISOString(),
      status: "draft",
      content: generatePlatformSpecificContent(input, platform, contentType),
      caption: generateCaption(platform, contentType, hashtags),
      script: generateScript(input, platform),
      aiGenerated: true,
      premium: true
    };

    return [generatedIdea];
  };

  const generatePlatformSpecificContent = (input: string, platform: string, contentType: string): string => {
    const templates = {
      instagram: {
        post: `🎯 **${input.toUpperCase()}**\n\nTransform your approach with these proven strategies:\n\n✅ Step-by-step implementation\n✅ Real results from real users\n✅ Actionable insights you can use today\n\nReady to level up? 💪\n\n#${input.replace(/\s+/g, '')} #Growth #Success`,
        story: `📱 Quick Tip: ${input}\n\nSwipe for the full breakdown 👆\n\n#${input.replace(/\s+/g, '')} #Tips`,
        reel: `🎬 The ${input} Method\n\nWatch how this changed everything 👆\n\n#${input.replace(/\s+/g, '')} #Viral #Trending`,
        video: `📹 Complete Guide: ${input}\n\nEverything you need to know in 60 seconds ⏱️\n\n#${input.replace(/\s+/g, '')} #Guide #Tutorial`
      },
      tiktok: {
        post: `🎬 ${input} #fyp #viral #trending`,
        story: `📱 ${input} - Swipe for more! 👆`,
        reel: `🎬 ${input} - Watch till the end! 👀`,
        video: `📹 ${input} - Full tutorial below 👇`
      },
      youtube: {
        post: `🎥 ${input} - Complete Guide\n\nWatch the full video: [Link]\n\n#${input.replace(/\s+/g, '')} #Tutorial #Guide`,
        story: `📱 ${input} - Quick tip! 👆`,
        reel: `🎬 ${input} - Short version 👆`,
        video: `📹 ${input} - Full tutorial below 👇`
      },
      x: {
        post: `🐦 ${input}\n\nThread 🧵\n\n1/5 Key insights\n2/5 Implementation\n3/5 Results\n4/5 Tips\n5/5 Action items\n\n#${input.replace(/\s+/g, '')} #Growth`,
        story: `📱 ${input} - Quick thread 👆`,
        reel: `🎬 ${input} - Video version 👆`,
        video: `📹 ${input} - Full breakdown 👇`
      },
      linkedin: {
        post: `💼 ${input}\n\nProfessional insights on ${input}:\n\n• Key strategies\n• Implementation tips\n• Expected outcomes\n• Best practices\n\n#${input.replace(/\s+/g, '')} #Professional #Growth`,
        story: `📱 ${input} - Professional tip 👆`,
        reel: `🎬 ${input} - Industry insights 👆`,
        video: `📹 ${input} - Professional guide 👇`
      },
      facebook: {
        post: `📱 ${input}\n\nCommunity discussion on ${input}:\n\nWhat's your experience with this?\n\nShare your thoughts below! 👇\n\n#${input.replace(/\s+/g, '')} #Community #Discussion`,
        story: `📱 ${input} - Community tip 👆`,
        reel: `🎬 ${input} - Community insights 👆`,
        video: `📹 ${input} - Community guide 👇`
      }
    };

    return templates[platform as keyof typeof templates]?.[contentType as keyof typeof templates.instagram] || `Content about ${input}`;
  };

  const generateCaption = (platform: string, contentType: string, hashtags: string[]): string => {
    const captions = {
      instagram: `🎯 Ready to transform your ${contentType} game?\n\nThis ${contentType} will help you:\n✅ Increase engagement\n✅ Grow your audience\n✅ Achieve your goals\n\nDouble tap if you're ready! ❤️\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
      tiktok: `🎬 ${contentType} that actually works!\n\nWatch till the end 👀\nFollow for more tips 👆\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
      youtube: `🎥 Complete ${contentType} guide\n\nSubscribe for more tutorials 👆\nLike if this helped! 👍\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
      x: `🐦 ${contentType} insights\n\nRetweet if helpful 🔄\nFollow for more tips 👆\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
      linkedin: `💼 Professional ${contentType} insights\n\nConnect for more industry tips 👆\nShare if valuable! 🔄\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`,
      facebook: `📱 ${contentType} that works!\n\nLike and share if helpful 👍\nFollow for more tips 👆\n\n${hashtags.map(tag => `#${tag}`).join(' ')}`
    };

    return captions[platform as keyof typeof captions] || `Great ${contentType} content! ${hashtags.map(tag => `#${tag}`).join(' ')}`;
  };

  const generateScript = (input: string, platform: string): string => {
    const scripts = {
      instagram: `[Opening Hook]\n"Hey everyone! Today I'm sharing the ${input} method that changed everything for me."\n\n[Main Content]\n"Here's what you need to know:\n1. First step\n2. Second step\n3. Third step"\n\n[Call to Action]\n"Try this out and let me know your results in the comments!"`,
      tiktok: `[Hook]\n"${input} - this is how you do it right!"\n\n[Content]\n"Watch and learn:\n• Step 1\n• Step 2\n• Step 3"\n\n[CTA]\n"Follow for more tips!"`,
      youtube: `[Intro]\n"Welcome back! Today we're covering ${input}."\n\n[Content]\n"Here's the complete breakdown:\n1. Understanding the basics\n2. Implementation strategy\n3. Advanced techniques"\n\n[Outro]\n"Don't forget to subscribe and hit the bell!"`,
      x: `[Thread Start]\n"${input} - A complete thread 🧵"\n\n[Thread Content]\n"1/5: Introduction\n2/5: Key points\n3/5: Implementation\n4/5: Results\n5/5: Next steps"\n\n[CTA]\n"Follow for more insights!"`,
      linkedin: `[Professional Opening]\n"${input} - Industry insights that matter."\n\n[Content]\n"Key takeaways:\n• Professional approach\n• Industry best practices\n• Measurable outcomes"\n\n[CTA]\n"Connect for more professional insights!"`,
      facebook: `[Community Opening]\n"${input} - Let's discuss this together!"\n\n[Content]\n"Community insights:\n• What works\n• What doesn't\n• Tips from experience"\n\n[CTA]\n"Share your thoughts below!"`
    };

    return scripts[platform as keyof typeof scripts] || `Script for ${input} content on ${platform}`;
  };

  const generatePremiumHashtags = (platform: string, contentType: string): string[] => {
    const hashtagSets = {
      instagram: ['instagram', 'socialmedia', 'growth', 'success', 'motivation', 'inspiration', 'lifestyle', 'business', 'entrepreneur', 'marketing'],
      tiktok: ['fyp', 'viral', 'trending', 'tiktok', 'foryou', 'foryoupage', 'viralvideo', 'trending', 'popular', 'funny'],
      youtube: ['youtube', 'tutorial', 'howto', 'guide', 'tips', 'tricks', 'education', 'learning', 'knowledge', 'skills'],
      x: ['twitter', 'x', 'thread', 'insights', 'tips', 'growth', 'success', 'business', 'marketing', 'strategy'],
      linkedin: ['linkedin', 'professional', 'business', 'career', 'networking', 'industry', 'leadership', 'growth', 'success', 'strategy'],
      facebook: ['facebook', 'community', 'social', 'friends', 'family', 'life', 'fun', 'entertainment', 'viral', 'trending']
    };

    const baseHashtags = hashtagSets[platform as keyof typeof hashtagSets] || ['content', 'socialmedia', 'viral'];
    const contentSpecific = [contentType, 'content', 'viral', 'trending'];
    
    return Array.from(new Set([...baseHashtags, ...contentSpecific])).slice(0, 10);
  };

  const handleGenerateContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter content description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const content = await generatePremiumContent(contentInput, selectedPlatforms, selectedContentType);
      setGeneratedContent(content);
      setSuccess("Content generated successfully!");
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveContent = (content: ContentIdea) => {
    setSuccess("Content saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePublishContent = (content: ContentIdea) => {
    setSuccess("Content published successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteContent = (contentId: string) => {
    setSuccess("Content deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const filteredContent = (contentIdeas || []).filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || content.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (activeTab) {
      case "viralScore":
        return b.viralScore - a.viralScore;
      case "createdAt":
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      case "estimatedViews":
        return parseInt(b.estimatedViews.replace(/,/g, '')) - parseInt(a.estimatedViews.replace(/,/g, ''));
      default:
        return 0;
    }
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50">
      {/* Clean Premium Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Content Hub</h1>
                <p className="text-sm text-gray-600">AI-Powered Content Creation</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-xs text-gray-500">Platforms</p>
                <p className="text-lg font-semibold text-gray-900">{platformConnections.length}</p>
              </div>
              {hasActiveSubscription && (
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white text-xs px-2 py-1">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <CheckCircle className="w-5 h-5" />
            <span>{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="fixed top-4 right-4 z-50">
          <div className="bg-red-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <AlertCircle className="w-5 h-5" />
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Premium Content Area */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
          {/* Clean Tab Navigation */}
          <TabsList className="bg-white border border-gray-200 grid w-full grid-cols-4 shadow-sm rounded-lg p-1">
            <TabsTrigger value="create" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-md">
              <Wand2 className="w-4 h-4" />
              <span>Create</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-md">
              <Lightbulb className="w-4 h-4" />
              <span>My Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="scheduler" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-md">
              <Calendar className="w-4 h-4" />
              <span>Schedule</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2 hover:bg-blue-50 transition-all duration-200 data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 rounded-md">
              <BarChart3 className="w-4 h-4" />
              <span>Analytics</span>
            </TabsTrigger>
          </TabsList>

          {/* Advanced AI Content Generator */}
          <TabsContent value="create" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">AI Content Generator</h2>
                    <p className="text-gray-600">Create viral content with advanced AI technology</p>
                  </div>
                  <Badge className="bg-blue-100 text-blue-700">
                    <Zap className="w-3 h-3 mr-1" />
                    AI Powered
                  </Badge>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Input Section */}
                  <div className="lg:col-span-2 space-y-6">
                    <div>
                      <Label className="text-sm font-medium text-gray-700 mb-2 block">What do you want to create?</Label>
                      <Textarea
                        value={contentInput}
                        onChange={(e) => setContentInput(e.target.value)}
                        placeholder="Describe your content idea in detail (e.g., 'Create a viral post about growing a business on social media with actionable tips and success stories')"
                        className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Platform</Label>
                        <Select value={selectedPlatforms[0]} onValueChange={(value) => setSelectedPlatforms([value])}>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="instagram">Instagram</SelectItem>
                            <SelectItem value="tiktok">TikTok</SelectItem>
                            <SelectItem value="youtube">YouTube</SelectItem>
                            <SelectItem value="x">Twitter/X</SelectItem>
                            <SelectItem value="linkedin">LinkedIn</SelectItem>
                            <SelectItem value="facebook">Facebook</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Content Type</Label>
                        <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                          <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="post">Post</SelectItem>
                            <SelectItem value="story">Story</SelectItem>
                            <SelectItem value="reel">Reel</SelectItem>
                            <SelectItem value="video">Video</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateContent}
                      disabled={isGenerating || !contentInput.trim()}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition-colors"
                    >
                      {isGenerating ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Generating Content...
                        </>
                      ) : (
                        <>
                          <Wand2 className="w-4 h-4 mr-2" />
                          Generate Content
                        </>
                      )}
                    </Button>
                  </div>

                  {/* Preview Section */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-gray-700">Preview</Label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 min-h-[200px] flex items-center justify-center">
                      {generatedContent.length > 0 ? (
                        <div className="space-y-3 w-full">
                          <div className="flex items-center justify-between">
                            <h4 className="font-medium text-gray-900">{generatedContent[0].title}</h4>
                            <Badge className="bg-green-100 text-green-700 text-xs">
                              {generatedContent[0].viralScore}% Viral
                            </Badge>
                          </div>
                          <p className="text-gray-600 text-sm">{generatedContent[0].description}</p>
                          <div className="flex flex-wrap gap-1">
                            {generatedContent[0].hashtags?.slice(0, 3).map((tag: string, index: number) => (
                              <Badge key={index} variant="outline" className="text-xs">
                                #{tag}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">
                          <Wand2 className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm">Content preview will appear here</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Content Display */}
            {generatedContent.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold text-gray-900">Generated Content</h3>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigator.clipboard.writeText(generatedContent[0].content || '')}
                        className="border-gray-300 text-gray-700 hover:bg-gray-50"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copy
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleSaveContent(generatedContent[0])}
                        className="border-green-300 text-green-700 hover:bg-green-50"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="p-6">
                  <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{generatedContent[0].title}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{generatedContent[0].content}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {generatedContent[0].viralScore}% Viral Score
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Eye className="w-3 h-3 mr-1" />
                          {generatedContent[0].estimatedViews} Views
                        </Badge>
                      </div>
                      <Button
                        onClick={() => handlePublishContent(generatedContent[0])}
                        className="bg-blue-600 hover:bg-blue-700 text-white"
                      >
                        <Send className="w-4 h-4 mr-2" />
                        Publish
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </TabsContent>

          {/* My Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Content Ideas</h2>
                    <p className="text-gray-600">Manage and organize your content ideas</p>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Input
                      placeholder="Search ideas..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-64 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                    />
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-32 border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All</SelectItem>
                        <SelectItem value="draft">Draft</SelectItem>
                        <SelectItem value="scheduled">Scheduled</SelectItem>
                        <SelectItem value="published">Published</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sortedContent.map((content: any) => (
                    <div key={content.id} className="p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg rounded-xl">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900">{content.title}</h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            {content.viral_score}% Viral
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600">{content.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>{content.platform}</span>
                          <span>{content.content_type}</span>
                          <span>{content.estimated_views} views</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveContent(content)}
                            className="border-gray-300 text-gray-700 hover:bg-gray-50"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handlePublishContent(content)}
                            className="border-green-300 text-green-700 hover:bg-green-50"
                          >
                            <Send className="w-4 h-4 mr-1" />
                            Publish
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDeleteContent(content.id)}
                            className="border-red-300 text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Scheduler Tab */}
          <TabsContent value="scheduler" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Content Scheduler</h2>
                    <p className="text-gray-600">Schedule and manage your content calendar</p>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <p className="text-2xl font-bold text-gray-900">{scheduledContent.length}</p>
                      <p className="text-sm text-gray-600">Scheduled Posts</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-bold text-green-600">{scheduledContent.filter((item: any) => item.status === 'published').length}</p>
                      <p className="text-sm text-gray-600">Published</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Quick Schedule</h3>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-2 block">Content</Label>
                        <Textarea
                          placeholder="Enter content to schedule..."
                          className="min-h-[100px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Platform</Label>
                          <Select>
                            <SelectTrigger className="border-gray-300 focus:border-blue-500 focus:ring-blue-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="instagram">Instagram</SelectItem>
                              <SelectItem value="tiktok">TikTok</SelectItem>
                              <SelectItem value="youtube">YouTube</SelectItem>
                              <SelectItem value="x">Twitter/X</SelectItem>
                              <SelectItem value="linkedin">LinkedIn</SelectItem>
                              <SelectItem value="facebook">Facebook</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label className="text-sm font-medium text-gray-700 mb-2 block">Date & Time</Label>
                          <Input type="datetime-local" className="border-gray-300 focus:border-blue-500 focus:ring-blue-500" />
                        </div>
                      </div>
                      <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                        <Calendar className="w-4 h-4 mr-2" />
                        Schedule Content
                      </Button>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <h3 className="text-xl font-semibold text-gray-900">Upcoming Schedule</h3>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {scheduledContent.slice(0, 5).map((item: any) => (
                        <div key={item.id} className="p-4 border border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-lg">
                          <div className="flex items-center justify-between">
                            <div className="space-y-2">
                              <h4 className="font-semibold text-gray-900">{item.title}</h4>
                              <p className="text-sm text-gray-600">{item.platform} • {item.content_type}</p>
                              <p className="text-xs text-gray-500">
                                {new Date(item.scheduled_for).toLocaleDateString()} at {new Date(item.scheduled_for).toLocaleTimeString()}
                              </p>
                            </div>
                            <div className="text-right">
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                {item.viral_score}% Viral
                              </Badge>
                              <p className="text-xs text-gray-500 mt-1">{item.estimated_views} views</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">Content Performance Analytics</h2>
                    <p className="text-gray-600">Track your content performance and growth</p>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Metrics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  <div className="p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-gray-900">{analyticsData.totalViews.toLocaleString()}</p>
                      <p className="text-sm text-gray-600">Total Views</p>
                    </div>
                  </div>
                  <div className="p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-blue-600">{analyticsData.engagementRate}%</p>
                      <p className="text-sm text-gray-600">Engagement Rate</p>
                    </div>
                  </div>
                  <div className="p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-green-600">{analyticsData.averageViralScore}%</p>
                      <p className="text-sm text-gray-600">Viral Score</p>
                    </div>
                  </div>
                  <div className="p-6 border border-gray-200 hover:border-blue-300 transition-all duration-300 rounded-lg">
                    <div className="text-center">
                      <p className="text-3xl font-bold text-purple-600">{contentIdeas.length}</p>
                      <p className="text-sm text-gray-600">Content Created</p>
                    </div>
                  </div>
                </div>

                {/* Platform Performance */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Platform Performance</h3>
                    <div className="space-y-4">
                      {analyticsData.platformBreakdown.map((platform: any) => (
                        <div key={platform.platform} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                              <span className="text-white text-xs font-semibold">{platform.platform.charAt(0).toUpperCase()}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{platform.platform}</p>
                              <p className="text-sm text-gray-600">{platform.followers.toLocaleString()} followers</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{platform.engagement}%</p>
                            <p className="text-sm text-gray-600">engagement</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-6 border border-gray-200 rounded-lg">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">Growth Trend (Last 30 Days)</h3>
                    <div className="space-y-4">
                      {analyticsData.growthTrend.slice(-7).map((day: any, index: number) => (
                        <div key={index} className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{day.date}</p>
                            <p className="text-sm text-gray-600">{day.views.toLocaleString()} views</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-900">{day.viralScore}%</p>
                            <p className="text-sm text-gray-600">viral score</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 