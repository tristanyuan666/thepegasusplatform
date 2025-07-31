"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  Wand2,
  Calendar,
  BarChart3,
  Target,
  Zap,
  Plus,
  Edit3,
  Save,
  Trash2,
  Copy,
  Share2,
  Eye,
  Heart,
  MessageCircle,
  TrendingUp,
  Clock,
  Globe,
  Smartphone,
  Play,
  Image,
  Video,
  FileText,
  Hash,
  Send,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Lightbulb,
  Brain,
  Palette,
  Music,
  Camera,
  Crown,
  Star,
  Rocket,
  Trophy,
  Diamond,
  Crown as CrownIcon,
  Briefcase,
  Users,
  Activity,
  Award,
  Target as TargetIcon,
  Zap as ZapIcon,
  Brain as BrainIcon,
  Palette as PaletteIcon,
  Calendar as CalendarIcon,
  BarChart3 as BarChart3Icon,
  DollarSign,
  ArrowRight,
  ChevronRight,
  Settings,
  Download,
  Upload,
  Filter,
  Search,
  Bookmark,
  BookmarkCheck,
  ThumbsUp,
  MessageSquare,
  Repeat,
  ExternalLink,
  Lock,
  Unlock,
  Infinity,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  HelpCircle,
  Maximize2,
  Minimize2,
  RotateCcw,
  RotateCw,
  ZoomIn,
  ZoomOut,
  Move,
  GripVertical,
  MoreHorizontal,
  MoreVertical,
  Grid,
  List,
  Columns,
  Layout,
  Sidebar,
  SidebarClose,
  PanelLeft,
  PanelRight,
  Split,
  SplitSquareVertical,
  SplitSquareHorizontal,
  Square,
  Circle,
  Triangle,
  Hexagon,
  Octagon,
  Star as StarIcon,
  Heart as HeartIcon,
  Smile,
  Frown,
  Meh,
  Laugh,
  Angry,
  Coffee,
  Beer,
  Wine,
  Pizza,
  IceCream,
  Cake,
  Cookie,
  Candy,
  Apple,
  Banana,
  Grape,
  Cherry,

} from "lucide-react";
import Link from "next/link";

interface ContentCreationHubProps {
  user: User;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
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
  aiGenerated?: boolean;
  premium?: boolean;
  engagement?: number;
  reach?: number;
  shares?: number;
  comments?: number;
  likes?: number;
  saves?: number;
}

interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  platforms: string[];
  viralScore: number;
  premium?: boolean;
  usageCount?: number;
  successRate?: number;
}

interface AnalyticsData {
  totalViews: number;
  totalEngagement: number;
  totalReach: number;
  totalShares: number;
  totalComments: number;
  totalLikes: number;
  totalSaves: number;
  averageViralScore: number;
  topPerformingContent: ContentIdea[];
  recentActivity: any[];
  platformBreakdown: any[];
  growthTrend: any[];
}

export default function ContentCreationHub({
  user,
  hasActiveSubscription,
  subscriptionTier,
}: ContentCreationHubProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);
  const [contentType, setContentType] = useState("post");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);
  const [activeTab, setActiveTab] = useState("create");
  const [showPremiumUpgrade, setShowPremiumUpgrade] = useState(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalViews: 2450000,
    totalEngagement: 187500,
    totalReach: 890000,
    totalShares: 45600,
    totalComments: 23400,
    totalLikes: 118500,
    totalSaves: 15600,
    averageViralScore: 87,
    topPerformingContent: [],
    recentActivity: [],
    platformBreakdown: [],
    growthTrend: []
  });
  const [selectedContent, setSelectedContent] = useState<ContentIdea | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("viralScore");

  // Premium content templates with enhanced features
  const premiumTemplates: ContentTemplate[] = [
    {
      id: "viral-story",
      name: "Viral Story Template",
      category: "Story",
      description: "Create engaging stories that go viral with emotional hooks and compelling narratives",
      template: "🎯 Hook: [Your attention-grabbing opening]\n\n💡 Value: [Share valuable insight/tip]\n\n🔥 Emotion: [Make them feel something]\n\n📱 Call to Action: [What should they do next?]\n\n#viral #trending #engagement",
      platforms: ["instagram", "tiktok"],
      viralScore: 95,
      premium: true,
      usageCount: 1247,
      successRate: 89
    },
    {
      id: "trending-reel",
      name: "Trending Reel Template",
      category: "Video",
      description: "Create reels that trend on Instagram with perfect timing and engaging visuals",
      template: "🎬 Opening: [3-second hook]\n\n📖 Story: [15-second narrative]\n\n🎯 Point: [Key takeaway]\n\n💥 Ending: [Strong conclusion]\n\n#reels #trending #instagram",
      platforms: ["instagram"],
      viralScore: 92,
      premium: true,
      usageCount: 892,
      successRate: 94
    },
    {
      id: "tiktok-challenge",
      name: "TikTok Challenge Template",
      category: "Video",
      description: "Participate in viral TikTok challenges with your unique twist",
      template: "🎵 [Trending Sound]\n\n🎭 [Your unique take]\n\n🔥 [Add your twist]\n\n📈 [Make it shareable]\n\n#challenge #tiktok #viral",
      platforms: ["tiktok"],
      viralScore: 98,
      premium: true,
      usageCount: 1563,
      successRate: 91
    },
    {
      id: "professional-post",
      name: "Professional Post Template",
      category: "Post",
      description: "Create professional content for LinkedIn and business platforms",
      template: "📊 [Industry insight]\n\n💼 [Professional value]\n\n🎯 [Actionable tip]\n\n📈 [Results/impact]\n\n#professional #business #growth",
      platforms: ["linkedin", "x"],
      viralScore: 88,
      premium: true,
      usageCount: 567,
      successRate: 85
    },
    {
      id: "youtube-shorts",
      name: "YouTube Shorts Template",
      category: "Video",
      description: "Create engaging YouTube Shorts that drive subscriptions",
      template: "🎬 [Hook in first 3 seconds]\n\n📚 [Educational value]\n\n🎯 [Key takeaway]\n\n📱 [Subscribe call-to-action]\n\n#shorts #youtube #viral",
      platforms: ["youtube"],
      viralScore: 90,
      premium: true,
      usageCount: 734,
      successRate: 87
    },
    {
      id: "carousel-post",
      name: "Carousel Post Template",
      category: "Carousel",
      description: "Create multi-slide carousel posts that keep users engaged",
      template: "📱 Slide 1: [Hook]\n\n📊 Slide 2: [Data/statistics]\n\n💡 Slide 3: [Value proposition]\n\n🎯 Slide 4: [Call to action]\n\n#carousel #engagement #viral",
      platforms: ["instagram", "linkedin"],
      viralScore: 93,
      premium: true,
      usageCount: 445,
      successRate: 92
    }
  ];

  // Premium platforms with enhanced features
  const platforms = [
    { id: "all", name: "All Platforms", icon: Globe, color: "from-blue-500 to-blue-600" },
    { id: "instagram", name: "Instagram", icon: Camera, premium: true, color: "from-purple-500 to-pink-500" },
    { id: "tiktok", name: "TikTok", icon: Music, premium: true, color: "from-pink-500 to-purple-500" },
    { id: "youtube", name: "YouTube", icon: Play, premium: true, color: "from-red-500 to-red-600" },
    { id: "x", name: "X", icon: MessageCircle, premium: true, color: "from-blue-600 to-blue-700" },
    { id: "facebook", name: "Facebook", icon: Globe, premium: true, color: "from-blue-700 to-blue-800" },
    { id: "linkedin", name: "LinkedIn", icon: Briefcase, premium: true, color: "from-blue-800 to-blue-900" }
  ];

  const contentTypes = [
    { id: "post", name: "Post", icon: FileText, color: "from-blue-500 to-blue-600" },
    { id: "story", name: "Story", icon: Camera, color: "from-purple-500 to-pink-500" },
    { id: "reel", name: "Reel", icon: Video, color: "from-pink-500 to-purple-500" },
    { id: "video", name: "Video", icon: Play, color: "from-red-500 to-red-600" },
    { id: "carousel", name: "Carousel", icon: Image, color: "from-green-500 to-green-600" },
    { id: "thread", name: "Thread", icon: Hash, color: "from-blue-600 to-blue-700" }
  ];

  // Premium AI content generation with enhanced features
  const generatePremiumContent = async (input: string, platforms: string[], contentType: string): Promise<ContentIdea[]> => {
    // Simulate premium AI processing with enhanced features
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const ideas: ContentIdea[] = [];
    
    for (const platform of platforms) {
      if (platform === "all") continue;
      
      const viralScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
      const estimatedViews = Math.floor(Math.random() * 50000) + 10000;
      const engagement = Math.floor(Math.random() * 1000) + 100;
      const reach = Math.floor(Math.random() * 5000) + 1000;
      const shares = Math.floor(Math.random() * 500) + 50;
      const comments = Math.floor(Math.random() * 200) + 20;
      const likes = Math.floor(Math.random() * 1000) + 100;
      const saves = Math.floor(Math.random() * 300) + 30;
      
      const idea: ContentIdea = {
        id: Date.now().toString() + platform,
        title: `🔥 ${platform.charAt(0).toUpperCase() + platform.slice(1)} ${contentType} that will go viral`,
        description: generatePlatformSpecificContent(input, platform, contentType),
        platform,
        contentType,
        viralScore,
        estimatedViews: estimatedViews.toLocaleString(),
        hashtags: generatePremiumHashtags(platform, contentType),
        createdAt: new Date().toISOString(),
        status: "draft",
        aiGenerated: true,
        premium: true,
        engagement,
        reach,
        shares,
        comments,
        likes,
        saves
      };
      
      ideas.push(idea);
    }
    
    return ideas;
  };

  const generatePlatformSpecificContent = (input: string, platform: string, contentType: string): string => {
    const templates: Record<string, Record<string, string>> = {
      instagram: {
        post: `🎯 ${input}\n\n💡 Pro tip: [Your insight here]\n\n🔥 This will change everything you know about [topic]\n\n📱 Save this for later!\n\n#instagram #viral #trending`,
        story: `🎬 ${input}\n\n💭 Swipe to see the full story\n\n🔥 You won't believe what happened next\n\n📱 Follow for more!`,
        reel: `🎵 [Trending Sound]\n\n🎭 ${input}\n\n🔥 The plot twist you didn't see coming\n\n📱 Double tap if you agree!`,
        carousel: `📱 Slide 1: ${input}\n\n📊 Slide 2: [Supporting data]\n\n💡 Slide 3: [Key insights]\n\n🎯 Slide 4: [Call to action]`
      },
      tiktok: {
        video: `🎵 [Viral Sound]\n\n🎭 ${input}\n\n🔥 The tea you've been waiting for\n\n📱 Follow for more drama!`,
        post: `🎯 ${input}\n\n💡 Life hack alert!\n\n🔥 This will blow your mind\n\n📱 Share with a friend!`
      },
      youtube: {
        video: `🎬 ${input}\n\n📖 In this video, I'll show you everything you need to know about [topic]\n\n🔥 The secret that nobody talks about\n\n📱 Subscribe for more!`,
        shorts: `🎬 ${input}\n\n📚 Quick tip that will change your life\n\n🎯 Key takeaway\n\n📱 Subscribe for more!`
      },
      x: {
        post: `🎯 ${input}\n\n💡 Thread 🧵\n\n🔥 The truth about [topic]\n\n📱 Follow for more insights!`,
        thread: `🎯 ${input}\n\n1/5 [First point]\n\n2/5 [Second point]\n\n3/5 [Third point]\n\n4/5 [Fourth point]\n\n5/5 [Conclusion]`
      },
      linkedin: {
        post: `📊 ${input}\n\n💼 Professional insight\n\n🎯 Actionable advice\n\n📈 Results you can expect\n\n#professional #business #growth`
      },
      facebook: {
        post: `📱 ${input}\n\n💭 What do you think?\n\n🔥 Share your thoughts below\n\n📱 Tag a friend who needs to see this!`
      }
    };
    
    return templates[platform]?.[contentType] || `${input}\n\n🔥 Premium content generated by AI\n\n📱 Follow for more!`;
  };

  const generatePremiumHashtags = (platform: string, contentType: string): string[] => {
    const hashtags: Record<string, string[]> = {
      instagram: ["#viral", "#trending", "#instagram", "#reels", "#engagement", "#growth", "#content", "#creator"],
      tiktok: ["#tiktok", "#viral", "#fyp", "#trending", "#foryou", "#challenge", "#content", "#creator"],
      youtube: ["#youtube", "#viral", "#trending", "#subscribe", "#content", "#creator", "#shorts"],
      x: ["#x", "#viral", "#trending", "#engagement", "#growth", "#content", "#thread"],
      linkedin: ["#linkedin", "#professional", "#business", "#growth", "#networking", "#career"],
      facebook: ["#facebook", "#viral", "#trending", "#engagement", "#community", "#social"]
    };
    
    return hashtags[platform] || ["#viral", "#trending", "#content"];
  };

  const handleGenerateContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter some content to generate premium ideas");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      const generatedIdeas = await generatePremiumContent(contentInput, selectedPlatforms, contentType);
      
      if (generatedIdeas.length === 0) {
        setError("No premium content ideas were generated. Please try with different input.");
        return;
      }

      setContentIdeas(prev => [...generatedIdeas, ...prev]);
      setGeneratedContent(generatedIdeas[0]);
      
      setSuccess("✨ Premium content ideas generated successfully! Your viral content is ready.");
      setTimeout(() => setSuccess(null), 5000);
      
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate premium content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseTemplate = (template: ContentTemplate) => {
    if (template.premium && !hasActiveSubscription) {
      setShowPremiumUpgrade(true);
      return;
    }
    
    setSelectedTemplate(template);
    setContentInput(template.template);
    setActiveTab("create");
  };

  const handleSaveContent = (content: ContentIdea) => {
    setContentIdeas(prev => prev.map(item => 
      item.id === content.id ? { ...item, status: "draft" as const } : item
    ));
    setSuccess("Content saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handlePublishContent = (content: ContentIdea) => {
    setContentIdeas(prev => prev.map(item => 
      item.id === content.id ? { ...item, status: "published" as const } : item
    ));
    setSuccess("Content published successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteContent = (contentId: string) => {
    setContentIdeas(prev => prev.filter(item => item.id !== contentId));
    setSuccess("Content deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const filteredContent = contentIdeas.filter(content => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         content.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || content.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const sortedContent = [...filteredContent].sort((a, b) => {
    switch (sortBy) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">Content Creation Hub</h1>
              </div>
              {hasActiveSubscription && (
                <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0">
                  <Crown className="w-3 h-3 mr-1" />
                  Premium
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm" className="border-blue-200 text-blue-700 hover:bg-blue-50">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200 shadow-sm">
            <TabsTrigger value="create" className="flex items-center space-x-2">
              <Wand2 className="w-4 h-4" />
              <span>Create</span>
            </TabsTrigger>
            <TabsTrigger value="templates" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Templates</span>
            </TabsTrigger>
            <TabsTrigger value="ideas" className="flex items-center space-x-2">
              <Lightbulb className="w-4 h-4" />
              <span>My Ideas</span>
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4" />
              <span>Performance</span>
            </TabsTrigger>
          </TabsList>

          {/* Create Content Tab */}
          <TabsContent value="create" className="space-y-6">
            <Card className="p-8 bg-white border-0 shadow-xl">
              <div className="space-y-8">
                {/* Platform Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-900">Target Platforms</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(platform.id);
                      return (
                        <button
                          key={platform.id}
                          onClick={() => {
                            if (platform.id === "all") {
                              setSelectedPlatforms(["all"]);
                            } else {
                              setSelectedPlatforms((prev) =>
                                prev.includes(platform.id)
                                  ? prev.filter((p) => p !== platform.id)
                                  : [...prev.filter((p) => p !== "all"), platform.id]
                              );
                            }
                          }}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          } ${platform.premium && !hasActiveSubscription ? 'opacity-50' : ''}`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{platform.name}</span>
                          {platform.premium && (
                            <Crown className="w-4 h-4 text-yellow-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Type Selection */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-900">Content Type</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = contentType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-200 ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700 shadow-lg"
                              : "border-gray-200 hover:border-gray-300 bg-white"
                          }`}
                        >
                          <Icon className="w-5 h-5" />
                          <span className="font-medium">{type.name}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Input */}
                <div className="space-y-4">
                  <Label className="text-lg font-semibold text-gray-900">Your Content Idea</Label>
                  <Textarea
                    value={contentInput}
                    onChange={(e) => setContentInput(e.target.value)}
                    placeholder="Describe your content idea, target audience, or what you want to achieve..."
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                {/* Generate Button */}
                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !contentInput.trim()}
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white text-lg py-4 rounded-xl shadow-lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Generating Premium Content...
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-5 h-5 mr-2" />
                      Generate Premium Content
                    </>
                  )}
                </Button>
              </div>
            </Card>

            {/* Generated Content Display */}
            {generatedContent && (
              <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-0 shadow-xl">
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-2xl font-bold text-gray-900">✨ Generated Content</h3>
                    <Badge className="bg-gradient-to-r from-green-500 to-emerald-600 text-white">
                      <Star className="w-3 h-3 mr-1" />
                      Premium AI Generated
                    </Badge>
                  </div>

                  <div className="bg-white p-6 rounded-xl border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">{generatedContent.title}</h4>
                    <p className="text-gray-700 whitespace-pre-wrap mb-4">{generatedContent.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {generatedContent.viralScore}% Viral Score
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Eye className="w-3 h-3 mr-1" />
                          {generatedContent.estimatedViews} Views
                        </Badge>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Copy className="w-4 h-4 mr-1" />
                          Copy
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="bg-gradient-to-r from-blue-600 to-blue-700">
                          <Save className="w-4 h-4 mr-1" />
                          Save
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}
          </TabsContent>

          {/* Templates Tab */}
          <TabsContent value="templates" className="space-y-6">
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {premiumTemplates.map((template) => (
                <Card key={template.id} className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      {template.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm">{template.description}</p>
                    
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="bg-blue-50 text-blue-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {template.viralScore}% Viral Score
                      </Badge>
                      {template.usageCount && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Users className="w-3 h-3 mr-1" />
                          {template.usageCount} uses
                        </Badge>
                      )}
                    </div>

                    <Button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                    >
                      <Wand2 className="w-4 h-4 mr-2" />
                      Use Template
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* My Ideas Tab */}
          <TabsContent value="ideas" className="space-y-6">
            {/* Search and Filter Controls */}
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Search content ideas..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 border-2 border-gray-200 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="draft">Draft</option>
                  <option value="scheduled">Scheduled</option>
                  <option value="published">Published</option>
                </select>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-500"
                >
                  <option value="viralScore">Sort by Viral Score</option>
                  <option value="createdAt">Sort by Date</option>
                  <option value="estimatedViews">Sort by Views</option>
                </select>
              </div>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedContent.map((idea) => (
                <Card key={idea.id} className="p-6 bg-white border-0 shadow-lg hover:shadow-xl transition-all duration-200">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                      {idea.premium && (
                        <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                          <Crown className="w-3 h-3 mr-1" />
                          Premium
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-gray-600 text-sm line-clamp-3">{idea.description}</p>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="bg-blue-50 text-blue-700">
                          <TrendingUp className="w-3 h-3 mr-1" />
                          {idea.viralScore}%
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          <Eye className="w-3 h-3 mr-1" />
                          {idea.estimatedViews}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button size="sm" variant="outline">
                          <Edit3 className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <Share2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <Card className="p-8 bg-white border-0 shadow-xl">
              <div className="space-y-6">
                <h3 className="text-2xl font-bold text-gray-900">Content Performance Analytics</h3>
                
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">2.4M</p>
                      </div>
                      <Eye className="w-8 h-8 text-blue-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-900">8.5%</p>
                      </div>
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Viral Score</p>
                        <p className="text-2xl font-bold text-gray-900">92</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-purple-600" />
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-6 rounded-xl border border-yellow-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Content Created</p>
                        <p className="text-2xl font-bold text-gray-900">156</p>
                      </div>
                      <FileText className="w-8 h-8 text-yellow-600" />
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Premium Upgrade Modal */}
      {showPremiumUpgrade && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto">
                <Crown className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900">Upgrade to Premium</h3>
              <p className="text-gray-600">Access premium templates and advanced AI features to create viral content.</p>
              <div className="flex space-x-4">
                <Button variant="outline" onClick={() => setShowPremiumUpgrade(false)}>
                  Cancel
                </Button>
                <Button asChild className="bg-gradient-to-r from-yellow-400 to-orange-500">
                  <Link href="/pricing">Upgrade Now</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
