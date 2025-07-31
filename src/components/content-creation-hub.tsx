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
} from "lucide-react";
import { createClient } from "../../supabase/client";
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
}

interface ContentTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  template: string;
  platforms: string[];
  viralScore: number;
}

export default function ContentCreationHub({
  user,
  hasActiveSubscription,
  subscriptionTier,
}: ContentCreationHubProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [selectedTemplate, setSelectedTemplate] =
    useState<ContentTemplate | null>(null);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);
  const [contentType, setContentType] = useState("post");
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [hasError, setHasError] = useState(false);

  // Add error boundary
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">
            Please sign in to access the content creation hub.
          </p>
          <Button asChild>
            <Link href="/sign-in">Sign In</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Error state
  if (hasError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Content Hub Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We're experiencing some technical difficulties. Please try again in a few moments.
          </p>
          <div className="space-y-2">
            <Button onClick={() => window.location.reload()} className="w-full">
              Try Again
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const contentTemplates: ContentTemplate[] = [
    {
      id: "1",
      name: "Viral Hook Formula",
      category: "Engagement",
      description: "Proven hook patterns that stop the scroll",
      template:
        "POV: You just discovered [shocking fact about your niche]\n\nHere's what nobody tells you about [topic]:\n\n1. [Surprising insight]\n2. [Counter-intuitive truth]\n3. [Game-changing tip]\n\nSave this post if you found it helpful! 👆",
      platforms: ["Social Media", "All Platforms"],
      viralScore: 94,
    },
    {
      id: "2",
      name: "Tutorial Breakdown",
      category: "Educational",
      description: "Step-by-step tutorial format",
      template:
        "How to [achieve desired outcome] in [timeframe]:\n\nStep 1: [First action]\nStep 2: [Second action]\nStep 3: [Third action]\n\nBonus tip: [Extra value]\n\nTry this and let me know your results! 💪",
      platforms: ["Social Media", "All Platforms"],
      viralScore: 87,
    },
    {
      id: "3",
      name: "Behind the Scenes",
      category: "Personal",
      description: "Authentic behind-the-scenes content",
      template:
        "A day in my life as [your role/profession]:\n\n🌅 Morning: [morning routine]\n☕ Midday: [work/main activity]\n🌙 Evening: [evening routine]\n\nWhat does your typical day look like? Comment below! 👇",
      platforms: ["Social Media", "All Platforms"],
      viralScore: 82,
    },
    {
      id: "4",
      name: "Myth Buster",
      category: "Educational",
      description: "Debunk common misconceptions",
      template:
        "Myth: [Common belief in your niche]\n\nReality: [The actual truth]\n\nWhy this matters:\n• [Reason 1]\n• [Reason 2]\n• [Reason 3]\n\nWhat other myths should I bust next? 🤔",
      platforms: ["Social Media", "All Platforms"],
      viralScore: 89,
    },
    {
      id: "5",
      name: "Quick Tips List",
      category: "Value",
      description: "Actionable tips in list format",
      template:
        "[Number] [topic] tips that changed my [life/business/results]:\n\n1. [Tip with brief explanation]\n2. [Tip with brief explanation]\n3. [Tip with brief explanation]\n4. [Tip with brief explanation]\n5. [Tip with brief explanation]\n\nWhich tip resonates with you most? 💭",
      platforms: ["Social Media", "All Platforms"],
      viralScore: 85,
    },
  ];

  const platforms = [
    { id: "all", name: "All Platforms", icon: Globe },
    { id: "social", name: "Social Media", icon: Smartphone },
    { id: "video", name: "Video Content", icon: Video },
    { id: "image", name: "Image Posts", icon: Image },
  ];

  const contentTypes = [
    { id: "post", name: "Social Post", icon: FileText },
    { id: "video", name: "Video Script", icon: Video },
    { id: "story", name: "Story Content", icon: Camera },
    { id: "carousel", name: "Carousel Post", icon: Image },
  ];

  useEffect(() => {
    // Add error boundary for the entire component
    const handleError = (error: ErrorEvent) => {
      console.error("Content hub error:", error);
      setHasError(true);
    };

    window.addEventListener('error', handleError);
    window.addEventListener('unhandledrejection', (event) => {
      console.error("Unhandled promise rejection:", event.reason);
      setHasError(true);
    });

    return () => {
      window.removeEventListener('error', handleError);
    };
  }, []);

  // Load mock content ideas instead of database
  useEffect(() => {
    const mockContentIdeas: ContentIdea[] = [
      {
        id: "1",
        title: "Engaging Instagram Post",
        description: "Create a visually appealing post with trending hashtags",
        platform: "instagram",
        contentType: "post",
        viralScore: 85,
        estimatedViews: "2.5K",
        hashtags: ["#trending", "#engagement", "#viral"],
        createdAt: new Date().toISOString(),
        status: "draft"
      },
      {
        id: "2", 
        title: "TikTok Challenge Video",
        description: "Participate in the latest TikTok challenge with creative editing",
        platform: "tiktok",
        contentType: "video",
        viralScore: 92,
        estimatedViews: "15K",
        hashtags: ["#challenge", "#tiktok", "#viral"],
        createdAt: new Date().toISOString(),
        status: "draft"
      }
    ];
    setContentIdeas(mockContentIdeas);
  }, []);

  const generateContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter some content to generate ideas");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate content generation with premium feel
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const generatedIdeas = await generateContentIdeas(contentInput, selectedPlatforms, contentType);
      
      if (!generatedIdeas || generatedIdeas.length === 0) {
        setError("No content ideas were generated. Please try with different input.");
        return;
      }

      // Update local state only (no database save)
      setContentIdeas(prev => [...generatedIdeas, ...prev]);
      setGeneratedContent(generatedIdeas[0]);
      
      setSuccess("✨ Content ideas generated successfully!");
      setTimeout(() => setSuccess(null), 4000);
      
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContentIdeas = async (
    input: string, 
    platforms: string[], 
    contentType: string
  ): Promise<ContentIdea[]> => {
    // Enhanced content generation algorithm
    const ideas: ContentIdea[] = [];
    const targetPlatforms = platforms.includes("all") 
      ? ["instagram", "tiktok", "youtube", "x"] 
      : platforms;

    for (const platform of targetPlatforms) {
      const idea = await generatePlatformSpecificContent(input, platform, contentType);
      ideas.push(idea);
    }

    return ideas.sort((a, b) => b.viralScore - a.viralScore);
  };

  const generatePlatformSpecificContent = async (
    input: string, 
    platform: string, 
    contentType: string
  ): Promise<ContentIdea> => {
    // Platform-specific content generation
    const platformTemplates = {
      instagram: {
        title: `Instagram ${contentType}: ${input}`,
        description: generateInstagramContent(input, contentType),
        hashtags: ["instagram", "reels", "viral", "trending", "fyp", "engagement"]
      },
      tiktok: {
        title: `TikTok ${contentType}: ${input}`,
        description: generateTikTokContent(input, contentType),
        hashtags: ["tiktok", "fyp", "viral", "trending", "hook", "engagement"]
      },
      youtube: {
        title: `YouTube ${contentType}: ${input}`,
        description: generateYouTubeContent(input, contentType),
        hashtags: ["youtube", "viral", "trending", "subscribe", "content"]
      },
      x: {
        title: `X ${contentType}: ${input}`,
        description: generateTwitterContent(input, contentType),
        hashtags: ["x", "thread", "viral", "trending", "engagement"]
      }
    };

    const template = platformTemplates[platform as keyof typeof platformTemplates];
    const viralScore = calculateViralScore(template.description, platform);
    const estimatedViews = calculateEstimatedViews(viralScore, platform);

    return {
      id: Date.now().toString(),
      title: template.title,
      description: template.description,
      platform,
      contentType,
      viralScore,
      estimatedViews: estimatedViews.toString(),
      hashtags: template.hashtags,
      createdAt: new Date().toISOString(),
      status: "draft"
    };
  };

  const generateInstagramContent = (input: string, contentType: string): string => {
    const hooks = [
      "🔥 The secret nobody talks about...",
      "💡 Here's what I learned the hard way...",
      "🎯 This changed everything for me...",
      "⚡ You won't believe what happened...",
      "💪 The truth about..."
    ];
    
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    return `${hook}\n\n${input}\n\n💭 What's your take on this?\n\n#instagram #reels #viral #trending`;
  };

  const generateTikTokContent = (input: string, contentType: string): string => {
    const hooks = [
      "POV: You just discovered...",
      "Wait for it...",
      "This is what happens when...",
      "You won't believe...",
      "The moment I realized..."
    ];
    
    const hook = hooks[Math.floor(Math.random() * hooks.length)];
    return `${hook}\n\n${input}\n\n#fyp #viral #trending #tiktok`;
  };

  const generateYouTubeContent = (input: string, contentType: string): string => {
    return `🎥 ${input}\n\nIn this ${contentType}, I'll show you everything you need to know about this topic.\n\n📚 Key takeaways:\n• Point 1\n• Point 2\n• Point 3\n\n💡 Don't forget to subscribe for more content like this!\n\n#youtube #content #viral`;
  };

  const generateTwitterContent = (input: string, contentType: string): string => {
    const baseContent = `🎯 ${input}\n\n💭 What do you think? Drop your thoughts below! 👇\n\n#X #thread #viral #trending`;
    return contentType === "thread" ? `${baseContent}\n\n🧵 Thread below 👇` : baseContent;
  };

  const calculateViralScore = (content: string, platform: string): number => {
    let score = 50; // Base score
    
    // Content length optimization
    if (content.length > 50 && content.length < 500) score += 20;
    
    // Engagement triggers
    if (content.includes("?")) score += 15; // Questions
    if (content.includes("!")) score += 10; // Excitement
    if (content.includes("💡") || content.includes("🔥") || content.includes("🎯")) score += 15; // Emojis
    if (content.includes("you") || content.includes("your")) score += 15; // Personalization
    if (content.includes("secret") || content.includes("hidden")) score += 10; // Curiosity
    if (content.includes("never") || content.includes("always")) score += 10; // Controversy
    
    // Platform-specific optimizations
    if (platform === "tiktok" && content.includes("fyp")) score += 10;
    if (platform === "instagram" && content.includes("reels")) score += 10;
    if (platform === "youtube" && content.includes("subscribe")) score += 10;
    if (platform === "x" && content.includes("thread")) score += 10;
    
    return Math.min(100, Math.max(0, score));
  };

  const calculateEstimatedViews = (viralScore: number, platform: string): number => {
    const baseViews = {
      instagram: 5000,
      tiktok: 15000,
      youtube: 3000,
      x: 2000
    };
    
    const multiplier = viralScore / 50;
    return Math.round(baseViews[platform as keyof typeof baseViews] * multiplier);
  };

  const saveContent = async () => {
    if (!generatedContent) return;

    const newIdea: ContentIdea = {
      id: Date.now().toString(),
      title: contentInput.substring(0, 50) + "...",
      description: generatedContent.description.substring(0, 100) + "...",
      platform: selectedPlatforms.join(", "),
      contentType: contentType,
      viralScore: generatedContent.viralScore,
      estimatedViews: generatedContent.estimatedViews,
      hashtags: generatedContent.hashtags,
      createdAt: new Date().toISOString(),
      status: "draft",
    };

    setContentIdeas((prev) => [newIdea, ...prev]);
    setGeneratedContent(null);
    setContentInput("");
  };

  const useTemplate = (template: ContentTemplate) => {
    setSelectedTemplate(template);
    setContentInput(template.template);
  };

  return (
    <div className="space-y-6 bg-white">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-blue-600" />
            Content Creation Hub
          </h2>
          <p className="text-gray-600">
            Create viral content with AI-powered suggestions and templates
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant={hasActiveSubscription ? "default" : "secondary"}>
            {subscriptionTier} Plan
          </Badge>
          <Button
            onClick={() => window.location.reload()}
            variant="outline"
            size="sm"
            disabled={isLoading}
          >
            <RefreshCw
              className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="create" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="create">Create Content</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="ideas">My Ideas</TabsTrigger>
          <TabsTrigger value="analytics">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Content Creation Form */}
          <Card className="p-6">
            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Platform Selection */}
                <div className="space-y-3">
                  <Label>Target Platforms</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {platforms.map((platform) => {
                      const Icon = platform.icon;
                      const isSelected = selectedPlatforms.includes(
                        platform.id,
                      );
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
                                  : [
                                      ...prev.filter((p) => p !== "all"),
                                      platform.id,
                                    ],
                              );
                            }
                          }}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {platform.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content Type Selection */}
                <div className="space-y-3">
                  <Label>Content Type</Label>
                  <div className="grid grid-cols-2 gap-2">
                    {contentTypes.map((type) => {
                      const Icon = type.icon;
                      const isSelected = contentType === type.id;
                      return (
                        <button
                          key={type.id}
                          onClick={() => setContentType(type.id)}
                          className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                            isSelected
                              ? "border-blue-500 bg-blue-50 text-blue-700"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium">
                            {type.name}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Content Input */}
              <div className="space-y-3">
                <Label htmlFor="content-input">Content Idea or Topic</Label>
                <Textarea
                  id="content-input"
                  value={contentInput}
                  onChange={(e) => setContentInput(e.target.value)}
                  placeholder="Describe your content idea, topic, or paste a template here..."
                  rows={6}
                  className="resize-none"
                />
                {error && <p className="text-red-500 text-sm">{error}</p>}
                {success && <p className="text-green-500 text-sm">{success}</p>}
              </div>

              {/* Generate Button */}
              <div className="flex justify-center">
                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !contentInput.trim()}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                  size="lg"
                >
                  {isGenerating ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Wand2 className="w-4 h-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </div>
            </div>
          </Card>

          {/* Generated Content */}
          {generatedContent && (
            <Card className="p-6 border-green-200 bg-green-50">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    Generated Content
                  </h3>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4 text-purple-600" />
                      <span className="text-sm font-medium text-purple-600">
                        Viral Score: {generatedContent.viralScore}%
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Eye className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-600">
                        Est. Views: {generatedContent.estimatedViews}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border">
                  <pre className="whitespace-pre-wrap text-gray-800 font-medium leading-relaxed">
                    {generatedContent.description}
                  </pre>
                </div>

                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map(
                    (tag: string, index: number) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="text-blue-600"
                      >
                        {tag}
                      </Badge>
                    ),
                  )}
                </div>

                {generatedContent.suggestions && (
                  <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4" />
                      AI Suggestions
                    </h4>
                    <ul className="space-y-1">
                      {generatedContent.suggestions.map(
                        (suggestion: string, index: number) => (
                          <li
                            key={index}
                            className="text-sm text-yellow-700 flex items-start gap-2"
                          >
                            <span className="text-yellow-500 mt-1">•</span>
                            {suggestion}
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex gap-3">
                  <Button onClick={saveContent} className="flex-1">
                    <Save className="w-4 h-4 mr-2" />
                    Save to Ideas
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      navigator.clipboard.writeText(generatedContent.description)
                    }
                  >
                    <Copy className="w-4 h-4 mr-2" />
                    Copy
                  </Button>
                  <Button variant="outline">
                    <Send className="w-4 h-4 mr-2" />
                    Schedule
                  </Button>
                </div>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Content Templates */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {contentTemplates.map((template) => (
              <Card
                key={template.id}
                className="p-6 hover:shadow-lg transition-shadow"
              >
                <div className="space-y-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {template.name}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-purple-600">
                      {template.viralScore}% viral
                    </Badge>
                  </div>

                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="text-xs text-gray-700 line-clamp-4">
                      {template.template}
                    </p>
                  </div>

                  <div className="flex items-center justify-between">
                    <Badge variant="secondary">{template.category}</Badge>
                    <Button
                      onClick={() => useTemplate(template)}
                      size="sm"
                      className="bg-gradient-to-r from-blue-600 to-purple-600"
                    >
                      <Wand2 className="w-3 h-3 mr-1" />
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ideas" className="space-y-6">
          {/* Saved Content Ideas */}
          <div className="space-y-4">
            {contentIdeas.map((idea) => (
              <Card key={idea.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-gray-900">
                        {idea.title}
                      </h3>
                      <Badge
                        variant={
                          idea.status === "published"
                            ? "default"
                            : idea.status === "scheduled"
                              ? "secondary"
                              : "outline"
                        }
                      >
                        {idea.status}
                      </Badge>
                    </div>
                    <p className="text-gray-600 mb-3">{idea.description}</p>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <span className="flex items-center gap-1">
                        <Target className="w-3 h-3" />
                        {idea.viralScore}% viral
                      </span>
                      <span className="flex items-center gap-1">
                        <Eye className="w-3 h-3" />
                        {idea.estimatedViews} views
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(idea.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {idea.hashtags.slice(0, 3).map((tag, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {idea.hashtags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{idea.hashtags.length - 3} more
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
                      <Share2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          {/* Content Performance Analytics */}
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BarChart3 className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Total Content</h3>
                  <p className="text-2xl font-bold text-blue-600">
                    {contentIdeas.length}
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Content pieces created</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-green-100 rounded-lg">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">
                    Avg Viral Score
                  </h3>
                  <p className="text-2xl font-bold text-green-600">
                    {Math.round(
                      contentIdeas.reduce(
                        (acc, idea) => acc + idea.viralScore,
                        0,
                      ) / contentIdeas.length || 0,
                    )}
                    %
                  </p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Average viral potential</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Eye className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">Est. Reach</h3>
                  <p className="text-2xl font-bold text-purple-600">2.4M</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">Estimated total views</p>
            </Card>
          </div>

          {/* Performance Chart */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Content Performance Trend
            </h3>
            <div className="h-64 flex items-end justify-between gap-2">
              {[65, 78, 82, 71, 89, 94, 87, 92, 85, 96, 88, 91].map(
                (height, index) => (
                  <div
                    key={index}
                    className="flex-1 flex flex-col items-center"
                  >
                    <div
                      className="w-full bg-gradient-to-t from-blue-500 to-blue-400 rounded-t transition-all duration-1000 ease-out"
                      style={{
                        height: `${height}%`,
                        transitionDelay: `${index * 100}ms`,
                      }}
                    />
                    <span className="text-xs text-gray-500 mt-2">
                      {new Date(
                        Date.now() - (11 - index) * 24 * 60 * 60 * 1000,
                      ).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                ),
              )}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
