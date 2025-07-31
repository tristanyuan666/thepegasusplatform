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

  // Premium content templates
  const premiumTemplates: ContentTemplate[] = [
    {
      id: "viral-story",
      name: "Viral Story Template",
      category: "Story",
      description: "Create engaging stories that go viral",
      template: "🎯 Hook: [Your attention-grabbing opening]\n\n💡 Value: [Share valuable insight/tip]\n\n🔥 Emotion: [Make them feel something]\n\n📱 Call to Action: [What should they do next?]\n\n#viral #trending #engagement",
      platforms: ["instagram", "tiktok"],
      viralScore: 95,
      premium: true
    },
    {
      id: "trending-reel",
      name: "Trending Reel Template",
      category: "Video",
      description: "Create reels that trend on Instagram",
      template: "🎬 Opening: [3-second hook]\n\n📖 Story: [15-second narrative]\n\n🎯 Point: [Key takeaway]\n\n💥 Ending: [Strong conclusion]\n\n#reels #trending #instagram",
      platforms: ["instagram"],
      viralScore: 92,
      premium: true
    },
    {
      id: "tiktok-challenge",
      name: "TikTok Challenge Template",
      category: "Video",
      description: "Participate in viral TikTok challenges",
      template: "🎵 [Trending Sound]\n\n🎭 [Your unique take]\n\n🔥 [Add your twist]\n\n📈 [Make it shareable]\n\n#challenge #tiktok #viral",
      platforms: ["tiktok"],
      viralScore: 98,
      premium: true
    }
  ];

  // Premium platforms with enhanced features
  const platforms = [
    { id: "all", name: "All Platforms", icon: Globe },
    { id: "instagram", name: "Instagram", icon: Camera, premium: true },
    { id: "tiktok", name: "TikTok", icon: Music, premium: true },
    { id: "youtube", name: "YouTube", icon: Play, premium: true },
    { id: "x", name: "X", icon: MessageCircle, premium: true },
    { id: "facebook", name: "Facebook", icon: Globe, premium: true },
    { id: "linkedin", name: "LinkedIn", icon: Briefcase, premium: true }
  ];

  const contentTypes = [
    { id: "post", name: "Post", icon: FileText },
    { id: "story", name: "Story", icon: Camera },
    { id: "reel", name: "Reel", icon: Video },
    { id: "video", name: "Video", icon: Play },
    { id: "carousel", name: "Carousel", icon: Image },
    { id: "thread", name: "Thread", icon: Hash }
  ];

  // Premium AI content generation
  const generatePremiumContent = async (input: string, platforms: string[], contentType: string): Promise<ContentIdea[]> => {
    // Simulate premium AI processing
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const ideas: ContentIdea[] = [];
    
    for (const platform of platforms) {
      if (platform === "all") continue;
      
      const viralScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
      const estimatedViews = Math.floor(Math.random() * 50000) + 10000;
      
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
        premium: true
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
        reel: `🎵 [Trending Sound]\n\n🎭 ${input}\n\n🔥 The plot twist you didn't see coming\n\n📱 Double tap if you agree!`
      },
      tiktok: {
        video: `🎵 [Viral Sound]\n\n🎭 ${input}\n\n🔥 The tea you've been waiting for\n\n📱 Follow for more drama!`,
        post: `🎯 ${input}\n\n💡 Life hack alert!\n\n🔥 This will blow your mind\n\n📱 Share with a friend!`
      },
      youtube: {
        video: `🎬 ${input}\n\n📖 In this video, I'll show you everything you need to know about [topic]\n\n🔥 The secret that nobody talks about\n\n📱 Subscribe for more!`
      }
    };
    
    return templates[platform]?.[contentType] || `${input}\n\n🔥 Premium content generated by AI\n\n📱 Follow for more!`;
  };

  const generatePremiumHashtags = (platform: string, contentType: string): string[] => {
    const hashtags: Record<string, string[]> = {
      instagram: ["#viral", "#trending", "#instagram", "#reels", "#engagement", "#growth"],
      tiktok: ["#tiktok", "#viral", "#fyp", "#trending", "#foryou", "#challenge"],
      youtube: ["#youtube", "#viral", "#trending", "#subscribe", "#content", "#creator"],
      x: ["#twitter", "#viral", "#trending", "#engagement", "#growth", "#content"]
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Premium Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
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
              <Button variant="outline" size="sm">
                <BarChart3 className="w-4 h-4 mr-2" />
                Analytics
              </Button>
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                Schedule
          </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-gray-200">
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
                              ? "border-purple-500 bg-purple-50 text-purple-700 shadow-lg"
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
                    className="min-h-[120px] text-lg border-2 border-gray-200 focus:border-purple-500 focus:ring-purple-500"
                />
              </div>

              {/* Generate Button */}
                <Button
                  onClick={handleGenerateContent}
                  disabled={isGenerating || !contentInput.trim()}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white text-lg py-4 rounded-xl shadow-lg"
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
              <Card className="p-8 bg-gradient-to-br from-purple-50 to-pink-50 border-0 shadow-xl">
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
                        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-pink-600">
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
                      <Badge variant="outline" className="bg-purple-50 text-purple-700">
                        <TrendingUp className="w-3 h-3 mr-1" />
                        {template.viralScore}% Viral Score
                    </Badge>
                  </div>

                    <Button
                      onClick={() => handleUseTemplate(template)}
                      className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {contentIdeas.map((idea) => (
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
                        <Badge variant="outline" className="bg-purple-50 text-purple-700">
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
                  <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-6 rounded-xl border border-purple-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Total Views</p>
                        <p className="text-2xl font-bold text-gray-900">2.4M</p>
                      </div>
                      <Eye className="w-8 h-8 text-purple-600" />
                    </div>
                </div>
                  
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between">
                <div>
                        <p className="text-sm text-gray-600">Engagement Rate</p>
                        <p className="text-2xl font-bold text-gray-900">8.5%</p>
                      </div>
                      <Heart className="w-8 h-8 text-green-600" />
                </div>
              </div>
                  
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-600">Viral Score</p>
                        <p className="text-2xl font-bold text-gray-900">92</p>
                      </div>
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                </div>
                  
                  <div className="bg-gradient-to-br from-yellow-50 to-orange-50 p-6 rounded-xl border border-yellow-200">
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
