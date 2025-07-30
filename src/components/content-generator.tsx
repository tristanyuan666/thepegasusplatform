"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Sparkles,
  Target,
  Users,
  TrendingUp,
  Calendar,
  Clock,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Copy,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Loader2,
  Zap,
  Brain,
  Palette,
  Music,
  Video,
  Camera,
  FileText,
  Hash,
  Star,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ContentGeneratorProps {
  user: any;
  userProfile: any;
  hasFeatureAccess: (feature: string) => boolean;
}

interface GeneratedContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  content_type: string;
  hashtags: string[];
  viral_score: number;
  estimated_reach: number;
  created_at: string;
  status: "draft" | "scheduled" | "published";
}

interface ContentTemplate {
  id: string;
  name: string;
  description: string;
  platform: string;
  content_type: string;
  template: string;
  hashtags: string[];
  tips: string[];
}

export default function ContentGenerator({
  user,
  userProfile,
  hasFeatureAccess,
}: ContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent[]>([]);
  const [selectedPlatform, setSelectedPlatform] = useState("tiktok");
  const [selectedType, setSelectedType] = useState("short-form");
  const [contentPrompt, setContentPrompt] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  
  const supabase = createClient();

  useEffect(() => {
    loadGeneratedContent();
    loadContentTemplates();
  }, [user?.id]);

  const loadGeneratedContent = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setGeneratedContent(data || []);
    } catch (error) {
      console.error("Error loading generated content:", error);
      setError("Failed to load your content");
    } finally {
      setIsLoading(false);
    }
  };

  const loadContentTemplates = async () => {
    // Load predefined templates based on user's niche and preferences
    const templates: ContentTemplate[] = [
      {
        id: "viral-hook",
        name: "Viral Hook Template",
        description: "High-engagement opening hooks that grab attention",
        platform: "tiktok",
        content_type: "short-form",
        template: "🎯 [HOOK]: {topic}\n\n💡 [VALUE]: {value_proposition}\n\n🔥 [CALLBACK]: {callback}\n\n#viral #trending #fyp",
        hashtags: ["viral", "trending", "fyp", "hook", "engagement"],
        tips: ["Start with a strong hook", "Provide immediate value", "End with a callback"]
      },
      {
        id: "story-telling",
        name: "Storytelling Template",
        description: "Engaging narrative content that builds connection",
        platform: "instagram",
        content_type: "posts",
        template: "📖 [STORY]: {personal_story}\n\n💭 [REFLECTION]: {lesson_learned}\n\n💪 [ENCOURAGEMENT]: {motivation}\n\n#story #inspiration #growth",
        hashtags: ["story", "inspiration", "growth", "motivation", "personal"],
        tips: ["Be authentic and vulnerable", "Share relatable experiences", "End with encouragement"]
      },
      {
        id: "educational",
        name: "Educational Template",
        description: "Informative content that teaches and adds value",
        platform: "youtube",
        content_type: "long-form",
        template: "🎓 [TOPIC]: {educational_topic}\n\n📚 [KEY POINTS]:\n• {point_1}\n• {point_2}\n• {point_3}\n\n💡 [TAKEAWAY]: {main_lesson}\n\n#education #learning #tips",
        hashtags: ["education", "learning", "tips", "knowledge", "howto"],
        tips: ["Break down complex topics", "Use clear examples", "Provide actionable takeaways"]
      },
      {
        id: "trending",
        name: "Trending Topic Template",
        description: "Content that leverages current trends and hashtags",
        platform: "twitter",
        content_type: "posts",
        template: "🔥 [TREND]: {trending_topic}\n\n💭 [OPINION]: {your_take}\n\n🤔 [DISCUSSION]: {question_for_audience}\n\n#trending #discussion #opinion",
        hashtags: ["trending", "discussion", "opinion", "current", "viral"],
        tips: ["Stay relevant to current trends", "Share your unique perspective", "Encourage engagement"]
      }
    ];

    // Filter templates based on user's niche and preferences
    const userNiche = userProfile?.niche || "lifestyle";
    const filteredTemplates = templates.filter(template => {
      if (userNiche === "fitness") return template.id === "educational" || template.id === "viral-hook";
      if (userNiche === "business") return template.id === "educational" || template.id === "story-telling";
      if (userNiche === "entertainment") return template.id === "trending" || template.id === "viral-hook";
      return true; // Show all templates for other niches
    });

    return filteredTemplates;
  };

  const generateContent = async () => {
    if (!contentPrompt.trim()) {
      setError("Please enter a content prompt");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Generate content based on user's niche, tone, and preferences
      const userNiche = userProfile?.niche || "lifestyle";
      const userTone = userProfile?.tone || "authentic";
      const userGoals = userProfile?.fame_goals || "build-brand";

      const generatedContent = await generateContentBasedOnProfile(
        contentPrompt,
        selectedPlatform,
        selectedType,
        userNiche,
        userTone,
        userGoals
      );

      // Save to database
      const { data, error } = await supabase
        .from("content_queue")
        .insert({
          user_id: user.id,
          title: generatedContent.title,
          content: generatedContent.content,
          content_type: selectedType,
          platform: selectedPlatform,
          viral_score: generatedContent.viral_score,
          status: "draft",
          hashtags: generatedContent.hashtags,
          estimated_reach: generatedContent.estimated_reach,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setGeneratedContent(prev => [data, ...prev]);
      setContentPrompt("");
      
      // Show success message
      setError(null);
      
    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const generateContentBasedOnProfile = async (
    prompt: string,
    platform: string,
    type: string,
    niche: string,
    tone: string,
    goals: string
  ) => {
    // Advanced content generation algorithm based on user profile
    const templates = await loadContentTemplates();
    const selectedTemplate = templates.find(t => t.platform === platform) || templates[0];
    
    // Generate content based on template and user preferences
    const content = await processTemplate(selectedTemplate, prompt, niche, tone, goals);
    
    // Calculate viral score based on content characteristics
    const viralScore = calculateViralScore(content, platform, niche, tone);
    
    // Estimate reach based on user's current following and content quality
    const estimatedReach = estimateReach(viralScore, userProfile?.follower_count || 0);
    
    return {
      title: generateTitle(prompt, platform, type),
      content: content,
      viral_score: viralScore,
      estimated_reach: estimatedReach,
      hashtags: generateHashtags(niche, platform, content),
    };
  };

  const processTemplate = async (template: ContentTemplate, prompt: string, niche: string, tone: string, goals: string) => {
    // Process template with user's specific context
    let content = template.template;
    
    // Replace placeholders with context-aware content
    content = content.replace("{topic}", prompt);
    content = content.replace("{value_proposition}", generateValueProposition(niche, tone));
    content = content.replace("{callback}", generateCallback(goals));
    content = content.replace("{personal_story}", generatePersonalStory(niche, tone));
    content = content.replace("{lesson_learned}", generateLesson(niche, goals));
    content = content.replace("{motivation}", generateMotivation(tone, goals));
    content = content.replace("{educational_topic}", prompt);
    content = content.replace("{point_1}", generateKeyPoint(prompt, 1));
    content = content.replace("{point_2}", generateKeyPoint(prompt, 2));
    content = content.replace("{point_3}", generateKeyPoint(prompt, 3));
    content = content.replace("{main_lesson}", generateMainLesson(prompt, niche));
    content = content.replace("{trending_topic}", prompt);
    content = content.replace("{your_take}", generateOpinion(prompt, tone));
    content = content.replace("{question_for_audience}", generateQuestion(prompt, niche));
    
    return content;
  };

  const generateValueProposition = (niche: string, tone: string) => {
    const valueProps = {
      fitness: "Transform your body and mind with proven strategies",
      business: "Scale your business with data-driven insights",
      lifestyle: "Create the life you've always dreamed of",
      entertainment: "Escape reality and dive into pure entertainment",
      education: "Unlock knowledge that changes everything",
    };
    return valueProps[niche as keyof typeof valueProps] || "Discover something amazing";
  };

  const generateCallback = (goals: string) => {
    const callbacks = {
      "build-brand": "Follow for more insights like this!",
      "monetize": "Ready to level up? Join our community!",
      "become-expert": "Want to learn more? Drop a comment!",
      "launch-business": "Ready to start your journey?",
    };
    return callbacks[goals as keyof typeof callbacks] || "Stay tuned for more!";
  };

  const generatePersonalStory = (niche: string, tone: string) => {
    const stories = {
      fitness: "I used to struggle with consistency until I discovered this simple method",
      business: "When I first started, I made every mistake in the book",
      lifestyle: "There was a time when I felt completely stuck",
      entertainment: "You won't believe what happened when I tried this",
      education: "I learned this the hard way, so you don't have to",
    };
    return stories[niche as keyof typeof stories] || "Here's what I discovered";
  };

  const generateLesson = (niche: string, goals: string) => {
    const lessons = {
      fitness: "Consistency beats perfection every time",
      business: "Success is built on small daily actions",
      lifestyle: "Your environment shapes your results",
      entertainment: "Authenticity always wins",
      education: "Knowledge without action is wasted",
    };
    return lessons[niche as keyof typeof lessons] || "Every experience teaches us something";
  };

  const generateMotivation = (tone: string, goals: string) => {
    const motivations = {
      authentic: "You have everything you need to succeed",
      professional: "Your potential is unlimited",
      humorous: "You're already doing better than you think",
      inspirational: "The best is yet to come",
    };
    return motivations[tone as keyof typeof motivations] || "Keep pushing forward";
  };

  const generateKeyPoint = (prompt: string, pointNumber: number) => {
    const points = [
      "Start with a clear goal in mind",
      "Break it down into actionable steps",
      "Track your progress consistently",
      "Celebrate small wins along the way",
    ];
    return points[pointNumber - 1] || "Take action today";
  };

  const generateMainLesson = (prompt: string, niche: string) => {
    return `The key to success in ${niche} is consistent action and continuous learning`;
  };

  const generateOpinion = (prompt: string, tone: string) => {
    const opinions = {
      authentic: "Here's my honest take on this",
      professional: "From my experience, here's what I've learned",
      humorous: "Let me tell you what I really think",
      inspirational: "This is what I believe we all need to hear",
    };
    return opinions[tone as keyof typeof opinions] || "Here's my perspective";
  };

  const generateQuestion = (prompt: string, niche: string) => {
    const questions = {
      fitness: "What's your biggest fitness challenge right now?",
      business: "What's holding you back from your goals?",
      lifestyle: "What would you change about your current situation?",
      entertainment: "What's your favorite part about this?",
      education: "What would you like to learn more about?",
    };
    return questions[niche as keyof typeof questions] || "What do you think about this?";
  };

  const generateTitle = (prompt: string, platform: string, type: string) => {
    const titles = {
      "tiktok": `${prompt} - You Won't Believe What Happens Next!`,
      "instagram": `${prompt} - The Truth Nobody Talks About`,
      "youtube": `${prompt} - Complete Guide for Beginners`,
      "twitter": `${prompt} - Here's What I Learned`,
    };
    return titles[platform as keyof typeof titles] || `${prompt} - Must See!`;
  };

  const generateHashtags = (niche: string, platform: string, content: string) => {
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

  const calculateViralScore = (content: string, platform: string, niche: string, tone: string) => {
    let score = 50; // Base score
    
    // Enhanced content length optimization
    if (platform === "tiktok" && content.length > 50 && content.length < 200) score += 20;
    if (platform === "instagram" && content.length > 100 && content.length < 500) score += 20;
    if (platform === "youtube" && content.length > 200) score += 20;
    if (platform === "twitter" && content.length > 50 && content.length < 280) score += 20;
    
    // Enhanced engagement triggers
    if (content.includes("?")) score += 15; // Questions
    if (content.includes("!")) score += 10; // Excitement
    if (content.includes("💡") || content.includes("🔥") || content.includes("🎯")) score += 15; // Emojis
    if (content.includes("you") || content.includes("your")) score += 15; // Personalization
    if (content.includes("secret") || content.includes("hidden")) score += 10; // Curiosity
    if (content.includes("never") || content.includes("always")) score += 10; // Controversy
    if (content.includes("shocked") || content.includes("amazing")) score += 10; // Emotion
    
    // Enhanced niche optimization
    if (niche === "fitness" && (content.includes("workout") || content.includes("transform"))) score += 15;
    if (niche === "business" && (content.includes("success") || content.includes("strategy"))) score += 15;
    if (niche === "lifestyle" && (content.includes("life") || content.includes("dream"))) score += 15;
    if (niche === "entertainment" && (content.includes("viral") || content.includes("trending"))) score += 15;
    if (niche === "education" && (content.includes("learn") || content.includes("knowledge"))) score += 15;
    
    // Enhanced tone optimization
    if (tone === "authentic" && (content.includes("honest") || content.includes("real"))) score += 15;
    if (tone === "professional" && (content.includes("strategy") || content.includes("expert"))) score += 15;
    if (tone === "humorous" && (content.includes("funny") || content.includes("lol"))) score += 15;
    if (tone === "inspirational" && (content.includes("motivation") || content.includes("inspire"))) score += 15;
    
    // Platform-specific optimizations
    if (platform === "tiktok" && content.includes("fyp")) score += 10;
    if (platform === "instagram" && content.includes("reels")) score += 10;
    if (platform === "youtube" && content.includes("subscribe")) score += 10;
    if (platform === "twitter" && content.includes("thread")) score += 10;
    
    return Math.min(100, Math.max(0, score));
  };

  const estimateReach = (viralScore: number, currentFollowers: number) => {
    const baseReach = currentFollowers * 0.1; // 10% of followers see the content
    const viralMultiplier = viralScore / 50; // Higher viral score = more reach
    return Math.round(baseReach * viralMultiplier);
  };

  const handleSaveContent = async (contentId: string) => {
    try {
      const { error } = await supabase
        .from("content_queue")
        .update({ status: "scheduled" })
        .eq("id", contentId);

      if (error) throw error;
      
      // Update local state
      setGeneratedContent(prev => 
        prev.map(content => 
          content.id === contentId 
            ? { ...content, status: "scheduled" as const }
            : content
        )
      );
    } catch (error) {
      console.error("Error saving content:", error);
      setError("Failed to save content");
    }
  };

  const handleCopyContent = async (content: GeneratedContent) => {
    try {
      await navigator.clipboard.writeText(content.content);
      // Show success feedback
    } catch (error) {
      console.error("Error copying content:", error);
    }
  };

  if (!hasFeatureAccess("ai_content")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generator Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access AI-powered content generation.
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
          <h2 className="text-2xl font-bold text-gray-900">Content Generator</h2>
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
          <h2 className="text-2xl font-bold text-gray-900">Content Generator</h2>
          <p className="text-gray-600">Create engaging content tailored to your brand</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Brain className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
        </div>
      </div>

      {/* Error Alert */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="generate">Generate</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="optimize">Optimize</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-6">
          {/* Content Generation Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Generate New Content
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
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="type">Content Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-form">Short-form Video</SelectItem>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="stories">Stories</SelectItem>
                      <SelectItem value="long-form">Long-form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
            </div>

              <div>
                <Label htmlFor="prompt">Content Prompt</Label>
                <Textarea
                  id="prompt"
                  value={contentPrompt}
                  onChange={(e) => setContentPrompt(e.target.value)}
                  placeholder="Describe what you want to create content about..."
                  rows={4}
                />
              </div>

                    <Button
                onClick={generateContent}
                disabled={isGenerating || !contentPrompt.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Generating Content...
                  </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                    Generate Content
                        </>
                      )}
              </Button>
            </CardContent>
          </Card>

          {/* Generated Content Preview */}
          {generatedContent.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Recent Generations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {generatedContent.slice(0, 3).map((content) => (
                    <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-semibold text-gray-900">{content.title}</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {content.platform}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {content.content_type}
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
                            onClick={() => handleCopyContent(content)}
                          >
                            <Copy className="w-4 h-4" />
                    </Button>
                    <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleSaveContent(content.id)}
                          >
                            <CheckCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                      <p className="text-gray-700 text-sm mb-3">{content.content}</p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Eye className="w-3 h-3" />
                        <span>{content.estimated_reach.toLocaleString()} estimated reach</span>
                        <Clock className="w-3 h-3" />
                        <span>{new Date(content.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              </Card>
          )}
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(() => {
                  const templates = [
                    {
                      id: "viral-hook",
                      name: "Viral Hook Template",
                      description: "High-engagement opening hooks that grab attention",
                      platform: "tiktok",
                      content_type: "short-form",
                      template: "🎯 [HOOK]: {topic}\n\n💡 [VALUE]: {value_proposition}\n\n🔥 [CALLBACK]: {callback}\n\n#viral #trending #fyp",
                      hashtags: ["viral", "trending", "fyp", "hook", "engagement"],
                      tips: ["Start with a strong hook", "Provide immediate value", "End with a callback"]
                    },
                    {
                      id: "story-telling",
                      name: "Storytelling Template",
                      description: "Engaging narrative content that builds connection",
                      platform: "instagram",
                      content_type: "posts",
                      template: "📖 [STORY]: {personal_story}\n\n💭 [REFLECTION]: {lesson_learned}\n\n💪 [ENCOURAGEMENT]: {motivation}\n\n#story #inspiration #growth",
                      hashtags: ["story", "inspiration", "growth", "motivation", "personal"],
                      tips: ["Be authentic and vulnerable", "Share relatable experiences", "End with encouragement"]
                    },
                    {
                      id: "educational",
                      name: "Educational Template",
                      description: "Informative content that teaches and adds value",
                      platform: "youtube",
                      content_type: "long-form",
                      template: "🎓 [TOPIC]: {educational_topic}\n\n📚 [KEY POINTS]:\n• {point_1}\n• {point_2}\n• {point_3}\n\n💡 [TAKEAWAY]: {main_lesson}\n\n#education #learning #tips",
                      hashtags: ["education", "learning", "tips", "knowledge", "howto"],
                      tips: ["Break down complex topics", "Use clear examples", "Provide actionable takeaways"]
                    },
                    {
                      id: "trending",
                      name: "Trending Topic Template",
                      description: "Content that leverages current trends and hashtags",
                      platform: "twitter",
                      content_type: "posts",
                      template: "🔥 [TREND]: {trending_topic}\n\n💭 [OPINION]: {your_take}\n\n🤔 [DISCUSSION]: {question_for_audience}\n\n#trending #discussion #opinion",
                      hashtags: ["trending", "discussion", "opinion", "current", "viral"],
                      tips: ["Stay relevant to current trends", "Share your unique perspective", "Encourage engagement"]
                    }
                  ];
                  
                  return templates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {template.platform}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {template.content_type}
                      </Badge>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedTemplate(template.id);
                        setActiveTab("generate");
                      }}
                    >
                  Use Template
                </Button>
              </div>
                  ));
                })()}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="optimize" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5 text-purple-600" />
                Content Optimization
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="optimize-platform">Platform</Label>
                  <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="twitter">Twitter</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="optimize-type">Content Type</Label>
                  <Select value={selectedType} onValueChange={setSelectedType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-form">Short-form Video</SelectItem>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="stories">Stories</SelectItem>
                      <SelectItem value="long-form">Long-form</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="optimize-content">Content to Optimize</Label>
                <Textarea
                  id="optimize-content"
                  placeholder="Paste your content here to get optimization suggestions..."
                  rows={6}
                />
              </div>

              <Button
                onClick={() => {
                  // Optimize content logic would go here
                }}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
              >
                <Target className="w-4 h-4 mr-2" />
                Optimize Content
              </Button>
            </CardContent>
          </Card>

          {/* Optimization Tips */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Hook Optimization</h4>
                      <p className="text-xs text-gray-600">Start with curiosity, controversy, or emotion</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Engagement Triggers</h4>
                      <p className="text-xs text-gray-600">Use questions, calls-to-action, and personalization</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Hashtag Strategy</h4>
                      <p className="text-xs text-gray-600">Mix trending, niche, and branded hashtags</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-red-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Timing Optimization</h4>
                      <p className="text-xs text-gray-600">Post when your audience is most active</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-yellow-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Visual Elements</h4>
                      <p className="text-xs text-gray-600">Use emojis, formatting, and visual hierarchy</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full mt-2"></div>
                    <div>
                      <h4 className="font-semibold text-sm">Story Structure</h4>
                      <p className="text-xs text-gray-600">Follow the hero's journey or problem-solution format</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Content History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {generatedContent.map((content) => (
                  <div key={content.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{content.title}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {content.platform}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
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
                          onClick={() => handleCopyContent(content)}
                        >
                          <Copy className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                          size="sm"
                          onClick={() => handleSaveContent(content.id)}
                      >
                          <CheckCircle className="w-4 h-4" />
                      </Button>
                    </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3">{content.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Eye className="w-3 h-3" />
                      <span>{content.estimated_reach.toLocaleString()} estimated reach</span>
                      <Clock className="w-3 h-3" />
                      <span>{new Date(content.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
