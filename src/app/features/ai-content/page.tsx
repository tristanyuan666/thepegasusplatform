"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Sparkles,
  Wand2,
  Brain,
  Target,
  Zap,
  Eye,
  Heart,
  Share2,
  Copy,
  Save,
  Send,
  Calendar,
  TrendingUp,
  Lightbulb,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Play,
  Pause,
  Clock,
  BarChart3,
  Users,
  MessageCircle,
  Hash,
  Globe,
  Smartphone,
  Video,
  Image,
  FileText,
  Camera,
  Plus,
  Edit3,
  Trash2,
  Settings,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  contentType: string;
  viralScore: number;
  estimatedViews: string;
  hashtags: string[];
  content: string;
  status: "draft" | "scheduled" | "published";
  scheduledDate?: string;
  createdAt: string;
}

interface GeneratedContent {
  content: string;
  hashtags: string[];
  viralScore: number;
  estimatedViews: string;
  platforms: string[];
  suggestions: string[];
  tone: string;
  length: string;
}

export default function AIContentPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(["all"]);
  const [contentType, setContentType] = useState("post");
  const [selectedTone, setSelectedTone] = useState("engaging");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadContentIdeas();
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

  const loadContentIdeas = async () => {
    try {
      // Mock data for demonstration
      const mockIdeas: ContentIdea[] = [
        {
          id: "1",
          title: "Morning Routine for Productivity",
          description: "Share your optimized morning routine that boosts daily productivity",
          platform: "Social Media",
          contentType: "post",
          viralScore: 87,
          estimatedViews: "125K",
          hashtags: ["#productivity", "#morningroutine", "#success", "#motivation"],
          content: "🔥 Transform your mornings with this 5-minute routine that changed my life:\n\n⏰ 5:00 AM - Cold shower\n🧘 5:05 AM - 10 min meditation\n📝 5:15 AM - Journal & plan\n💪 5:25 AM - Quick workout\n☕ 5:35 AM - Healthy breakfast\n\nDouble tap if you're ready to level up! 👆\n\n#productivity #morningroutine #success #motivation #lifestyle",
          status: "draft",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          title: "5 Mistakes Everyone Makes",
          description: "Common mistakes in your niche that people should avoid",
          platform: "Social Media",
          contentType: "video",
          viralScore: 92,
          estimatedViews: "250K",
          hashtags: ["#mistakes", "#tips", "#advice", "#learn"],
          content: "🚨 5 mistakes that are holding you back:\n\n1. Waiting for perfect conditions\n2. Comparing your journey to others\n3. Not taking action on your ideas\n4. Focusing on followers over engagement\n5. Ignoring your audience's feedback\n\nWhich one resonates with you? Comment below! 👇\n\n#mistakes #tips #advice #learn #growth",
          status: "scheduled",
          scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          createdAt: new Date().toISOString(),
        },
      ];
      setContentIdeas(mockIdeas);
    } catch (error) {
      console.error("Error loading content ideas:", error);
    }
  };

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

  const toneOptions = [
    { id: "engaging", name: "Engaging & Conversational" },
    { id: "professional", name: "Professional & Authoritative" },
    { id: "humorous", name: "Humorous & Entertaining" },
    { id: "inspirational", name: "Inspirational & Motivational" },
    { id: "educational", name: "Educational & Informative" },
  ];

  const generateContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter a content idea or topic");
      return;
    }

    setIsGenerating(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate AI content generation
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockGenerated: GeneratedContent = {
        content: `🔥 ${contentInput}\n\nHere's what you need to know:\n\n✨ Key insight #1: ${contentInput} is more important than you think\n💡 Key insight #2: Most people get this wrong\n🚀 Key insight #3: Here's how to do it right\n\nDouble tap if this helped you! 👆\n\n#contentcreation #socialmedia #growth #viral #tips`,
        hashtags: [
          "#contentcreation",
          "#socialmedia",
          "#growth",
          "#viral",
          "#tips",
          "#engagement",
        ],
        viralScore: Math.floor(Math.random() * 20) + 80,
        estimatedViews: `${Math.floor(Math.random() * 500 + 100)}K`,
        platforms: selectedPlatforms,
        suggestions: [
          "Add a compelling hook in the first line",
          "Include a call-to-action to boost engagement",
          "Use trending hashtags for better reach",
          "Consider adding a personal story",
        ],
        tone: selectedTone,
        length: "Medium",
      };

      setGeneratedContent(mockGenerated);
      setSuccess("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const saveContent = async () => {
    if (!generatedContent) return;

    const newIdea: ContentIdea = {
      id: Date.now().toString(),
      title: contentInput.substring(0, 50) + "...",
      description: generatedContent.content.substring(0, 100) + "...",
      platform: selectedPlatforms.join(", "),
      contentType: contentType,
      viralScore: generatedContent.viralScore,
      estimatedViews: generatedContent.estimatedViews,
      hashtags: generatedContent.hashtags,
      content: generatedContent.content,
      status: "draft",
      createdAt: new Date().toISOString(),
    };

    setContentIdeas((prev) => [newIdea, ...prev]);
    setGeneratedContent(null);
    setContentInput("");
    setSuccess("Content saved to your ideas!");
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setSuccess("Content copied to clipboard!");
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
              <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                AI Content Generator
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Create Viral Content with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AI Power
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Transform your ideas into engaging content that resonates with
              your audience and drives growth across all social media platforms.
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
              <TabsTrigger value="generate">Generate Content</TabsTrigger>
              <TabsTrigger value="templates">Templates</TabsTrigger>
              <TabsTrigger value="ideas">My Ideas</TabsTrigger>
              <TabsTrigger value="analytics">Performance</TabsTrigger>
            </TabsList>

            <TabsContent value="generate" className="space-y-6">
              {/* Content Generation Form */}
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Platform Selection */}
                    <div className="space-y-3">
                      <Label>Target Platforms</Label>
                      <div className="grid grid-cols-2 gap-2">
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
                              className={`flex items-center gap-2 p-3 rounded-lg border transition-all ${
                                isSelected
                                  ? "border-blue-500 bg-blue-50 text-blue-700"
                                  : "border-gray-200 hover:border-gray-300"
                              }`}
                            >
                              <Icon className="w-4 h-4" />
                              <span className="text-sm font-medium">{platform.name}</span>
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
                              <span className="text-sm font-medium">{type.name}</span>
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
                        {generatedContent.content}
                      </pre>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {generatedContent.hashtags.map((tag: string, index: number) => (
                        <Badge key={index} variant="outline" className="text-blue-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    {generatedContent.suggestions && (
                      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                        <h4 className="font-medium text-yellow-800 mb-2 flex items-center gap-2">
                          <Lightbulb className="w-4 h-4" />
                          AI Suggestions
                        </h4>
                        <ul className="space-y-1">
                          {generatedContent.suggestions.map((suggestion: string, index: number) => (
                            <li key={index} className="text-sm text-yellow-700 flex items-start gap-2">
                              <span className="text-yellow-500 mt-1">•</span>
                              {suggestion}
                            </li>
                          ))}
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
                        onClick={() => copyToClipboard(generatedContent.content)}
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

            <TabsContent value="ideas" className="space-y-6">
              {/* Saved Content Ideas */}
              <div className="space-y-4">
                {contentIdeas.map((idea) => (
                  <Card key={idea.id} className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900">{idea.title}</h3>
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
                            <Badge key={index} variant="outline" className="text-xs">
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
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => copyToClipboard(idea.content)}
                        >
                          <Copy className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm">
                          <Calendar className="w-4 h-4" />
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
                      <p className="text-2xl font-bold text-blue-600">{contentIdeas.length}</p>
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
                      <h3 className="font-semibold text-gray-900">Avg Viral Score</h3>
                      <p className="text-2xl font-bold text-green-600">
                        {Math.round(
                          contentIdeas.reduce((acc, idea) => acc + idea.viralScore, 0) / contentIdeas.length || 0
                        )}%
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
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
