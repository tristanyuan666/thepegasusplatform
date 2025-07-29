"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  Sparkles,
  Wand2, 
  Target, 
  TrendingUp, 
  Eye, 
  Heart, 
  MessageCircle, 
  Share2, 
  Copy, 
  Save, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Lightbulb,
  Brain,
  Palette,
  Music,
  Camera,
  FileText,
  Video,
  Hash,
  Send,
  Clock,
  BarChart3,
  Zap,
  Globe,
  Smartphone,
  Play,
  Image,
  Plus,
  Edit3,
  Trash2
} from "lucide-react";
import FeatureAccessControl from "@/components/feature-access-control";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

function AIContentGenerator() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [contentType, setContentType] = useState("post");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<any>(null);
  const [contentIdeas, setContentIdeas] = useState<ContentIdea[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [activeTab, setActiveTab] = useState("create");

  const platforms = [
    { id: "all", name: "All Platforms", icon: Globe },
    { id: "instagram", name: "Instagram", icon: Camera },
    { id: "tiktok", name: "TikTok", icon: Video },
    { id: "youtube", name: "YouTube", icon: Play },
    { id: "twitter", name: "Twitter/X", icon: MessageCircle },
    { id: "linkedin", name: "LinkedIn", icon: FileText },
  ];

  const contentTypes = [
    { id: "post", name: "Social Post", icon: FileText },
    { id: "video", name: "Video Script", icon: Video },
    { id: "story", name: "Story Content", icon: Camera },
    { id: "reel", name: "Reel Script", icon: Play },
  ];

  const contentTemplates: ContentTemplate[] = [
    {
      id: "1",
      name: "Viral Hook Formula",
      category: "Engagement",
      description: "Proven hook patterns that stop the scroll",
      template: "POV: You just discovered [shocking fact about your niche]\n\nHere's what nobody tells you about [topic]:\n\n1. [Surprising insight]\n2. [Counter-intuitive truth]\n3. [Game-changing tip]\n\nSave this post if you found it helpful! 👆",
      platforms: ["All Platforms"],
      viralScore: 94,
    },
    {
      id: "2",
      name: "Tutorial Breakdown",
      category: "Educational",
      description: "Step-by-step tutorial format",
      template: "How to [achieve desired outcome] in [timeframe]:\n\nStep 1: [First action]\nStep 2: [Second action]\nStep 3: [Third action]\n\nBonus tip: [Extra value]\n\nTry this and let me know your results! 💪",
      platforms: ["All Platforms"],
      viralScore: 87,
    },
    {
      id: "3",
      name: "Behind the Scenes",
      category: "Personal",
      description: "Authentic behind-the-scenes content",
      template: "A day in my life as [your role/profession]:\n\n🌅 Morning: [morning routine]\n☕ Midday: [work/main activity]\n🌙 Evening: [evening routine]\n\nWhat does your typical day look like? Comment below! 👇",
      platforms: ["All Platforms"],
      viralScore: 82,
    },
    {
      id: "4",
      name: "Myth Buster",
      category: "Educational",
      description: "Debunk common misconceptions",
      template: "Myth: [Common belief in your niche]\n\nReality: [The actual truth]\n\nWhy this matters:\n• [Reason 1]\n• [Reason 2]\n• [Reason 3]\n\nWhat other myths should I bust next? 🤔",
      platforms: ["All Platforms"],
      viralScore: 89,
    },
    {
      id: "5",
      name: "Quick Tips List",
      category: "Value",
      description: "Actionable tips in list format",
      template: "[Number] [topic] tips that changed my [life/business/results]:\n\n1. [Tip with brief explanation]\n2. [Tip with brief explanation]\n3. [Tip with brief explanation]\n4. [Tip with brief explanation]\n5. [Tip with brief explanation]\n\nWhich tip resonates with you most? 💭",
      platforms: ["All Platforms"],
      viralScore: 85,
    },
  ];

  useEffect(() => {
    checkUser();
    loadContentIdeas();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
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
          platform: "All Platforms",
          contentType: "post",
          viralScore: 87,
          estimatedViews: "125K",
          hashtags: ["#productivity", "#morningroutine", "#success", "#motivation"],
          createdAt: new Date().toISOString(),
          status: "draft",
        },
        {
          id: "2",
          title: "5 Mistakes Everyone Makes",
          description: "Common mistakes in your niche that people should avoid",
          platform: "All Platforms",
          contentType: "video",
          viralScore: 92,
          estimatedViews: "250K",
          hashtags: ["#mistakes", "#tips", "#advice", "#learn"],
          createdAt: new Date().toISOString(),
          status: "scheduled",
        },
        {
          id: "3",
          title: "Behind the Scenes",
          description: "Show your authentic work process and daily life",
          platform: "All Platforms",
          contentType: "story",
          viralScore: 78,
          estimatedViews: "89K",
          hashtags: ["#behindthescenes", "#authentic", "#reallife", "#work"],
          createdAt: new Date().toISOString(),
          status: "published",
        },
      ];
      setContentIdeas(mockIdeas);
    } catch (error) {
      console.error("Error loading content ideas:", error);
    }
  };

  const generateContent = async () => {
    if (!contentInput.trim()) return;

    setIsGenerating(true);
    try {
      // Simulate AI content generation
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const mockGenerated = {
        content: `🔥 ${contentInput}\n\nHere's what you need to know:\n\n✨ Key insight #1\n💡 Key insight #2\n🚀 Key insight #3\n\nDouble tap if this helped you! 👆\n\n#contentcreation #socialmedia #growth #viral`,
        hashtags: ["#contentcreation", "#socialmedia", "#growth", "#viral", "#tips"],
        viralScore: Math.floor(Math.random() * 20) + 80,
        estimatedViews: `${Math.floor(Math.random() * 500 + 100)}K`,
        platforms: [selectedPlatform],
        suggestions: [
          "Add a compelling hook in the first line",
          "Include a call-to-action",
          "Use trending hashtags for better reach",
        ],
      };

      setGeneratedContent(mockGenerated);
    } catch (error) {
      console.error("Error generating content:", error);
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
      platform: selectedPlatform,
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2 flex items-center gap-2">
                <Sparkles className="w-8 h-8" />
                AI Content Generator
              </h1>
              <p className="text-blue-100">
                Create viral content with AI-powered suggestions and templates
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white">
                AI-Powered
              </Badge>
              <Button variant="outline" size="sm" onClick={loadContentIdeas}>
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
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
                    <Label>Target Platform</Label>
                    <div className="grid grid-cols-2 gap-2">
                      {platforms.map((platform) => {
                        const Icon = platform.icon;
                        const isSelected = selectedPlatform === platform.id;
                        return (
                          <button
                            key={platform.id}
                            onClick={() => setSelectedPlatform(platform.id)}
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
                      onClick={() => navigator.clipboard.writeText(generatedContent.content)}
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
                <Card key={template.id} className="p-6 hover:shadow-lg transition-shadow">
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
    </div>
  );
}

export default function AIContentPage() {
  return (
    <FeatureAccessControl
      featureName="AI Content Generator"
      featureDescription="Create viral content with AI-powered suggestions, templates, and optimization tools. Generate engaging posts, scripts, and captions that resonate with your audience."
      requiredPlan="creator"
      icon={<Sparkles className="w-10 h-10 text-white" />}
    >
      <AIContentGenerator />
    </FeatureAccessControl>
  );
}
