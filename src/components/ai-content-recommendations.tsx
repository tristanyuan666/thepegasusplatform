"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Zap,
  RefreshCw,
  ThumbsUp,
  ThumbsDown,
  Copy,
  Calendar,
  Hash,
  Play,
  Image as ImageIcon,
  FileText,
  Flame,
  Star,
  Users,
  Eye,
  Heart,
  MessageCircle,
  Share2,
  Filter,
  Search,
  Lightbulb,
  Wand2,
  Brain,
  Rocket,
} from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { createClient } from "../../supabase/client";

interface ContentRecommendation {
  id: string;
  title: string;
  content: string;
  platform: string;
  contentType: string;
  viralScore: number;
  trendingScore: number;
  hashtags: string[];
  estimatedReach: number;
  bestPostingTime: string;
  reasoning: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  timeToCreate: number;
  inspiration?: {
    source: string;
    url?: string;
    performance: {
      views: number;
      likes: number;
      shares: number;
    };
  };
}

interface TrendingTopic {
  id: string;
  topic: string;
  platform: string;
  growth: number;
  volume: number;
  difficulty: "low" | "medium" | "high";
  hashtags: string[];
  description: string;
  exampleContent: string;
}

interface AIContentRecommendationsProps {
  userId: string;
  userProfile?: any;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

export default function AIContentRecommendations({
  userId,
  userProfile,
  hasActiveSubscription,
  subscriptionTier,
}: AIContentRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<
    ContentRecommendation[]
  >([]);
  const [trendingTopics, setTrendingTopics] = useState<TrendingTopic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("recommendations");
  const supabase = createClient();

  useEffect(() => {
    loadRecommendations();
    loadTrendingTopics();
  }, [selectedPlatform, selectedCategory]);

  const loadRecommendations = async () => {
    setIsLoading(true);
    try {
      // Simulate AI-powered content recommendations
      const mockRecommendations: ContentRecommendation[] = [
        {
          id: "1",
          title: "Morning Routine That Changed My Life",
          content:
            "Share your authentic morning routine with a twist - include one unusual habit that viewers wouldn't expect. Start with \"You won't believe what I do every morning at 5 AM...\"",
          platform: "tiktok",
          contentType: "video",
          viralScore: 87,
          trendingScore: 94,
          hashtags: [
            "#morningroutine",
            "#productivity",
            "#lifehacks",
            "#wellness",
            "#motivation",
          ],
          estimatedReach: 125000,
          bestPostingTime: "7:00 AM",
          reasoning:
            "Morning routine content is trending 340% this week. Your audience is most active at 7 AM.",
          category: "lifestyle",
          difficulty: "easy",
          timeToCreate: 30,
          inspiration: {
            source: "Similar creator @wellness_guru",
            performance: { views: 2400000, likes: 340000, shares: 12000 },
          },
        },
        {
          id: "2",
          title: "3 Productivity Hacks Nobody Talks About",
          content:
            "Reveal lesser-known productivity techniques that actually work. Focus on actionable tips that viewers can implement immediately.",
          platform: "instagram",
          contentType: "carousel",
          viralScore: 78,
          trendingScore: 85,
          hashtags: [
            "#productivity",
            "#lifehacks",
            "#workfromhome",
            "#entrepreneur",
            "#success",
          ],
          estimatedReach: 89000,
          bestPostingTime: "2:00 PM",
          reasoning:
            "Productivity content performs 67% better on Instagram during lunch hours.",
          category: "business",
          difficulty: "medium",
          timeToCreate: 45,
        },
        {
          id: "3",
          title: "Why I Quit My 6-Figure Job",
          content:
            "Share a personal story about a major life decision. Be vulnerable and authentic about the challenges and rewards.",
          platform: "youtube",
          contentType: "video",
          viralScore: 92,
          trendingScore: 88,
          hashtags: [
            "#entrepreneurship",
            "#career",
            "#lifestyle",
            "#motivation",
            "#success",
          ],
          estimatedReach: 156000,
          bestPostingTime: "7:00 PM",
          reasoning:
            "Personal story content has 3x higher engagement. Evening posts get 45% more views.",
          category: "personal",
          difficulty: "hard",
          timeToCreate: 120,
        },
        {
          id: "4",
          title: "Day in My Life as a Content Creator",
          content:
            "Behind-the-scenes content showing the reality of content creation. Include both struggles and wins.",
          platform: "tiktok",
          contentType: "video",
          viralScore: 83,
          trendingScore: 91,
          hashtags: [
            "#dayinmylife",
            "#contentcreator",
            "#behindthescenes",
            "#creator",
            "#hustle",
          ],
          estimatedReach: 98000,
          bestPostingTime: "6:00 PM",
          reasoning:
            "DIML content is trending. Your audience loves authentic behind-the-scenes content.",
          category: "lifestyle",
          difficulty: "easy",
          timeToCreate: 60,
        },
        {
          id: "5",
          title: "Mistakes I Made Building My Brand",
          content:
            "Educational content about common branding mistakes. Provide actionable advice to help others avoid these pitfalls.",
          platform: "linkedin",
          contentType: "text",
          viralScore: 75,
          trendingScore: 82,
          hashtags: [
            "#branding",
            "#marketing",
            "#entrepreneur",
            "#business",
            "#lessons",
          ],
          estimatedReach: 45000,
          bestPostingTime: "9:00 AM",
          reasoning:
            "Educational business content performs well on LinkedIn during work hours.",
          category: "business",
          difficulty: "medium",
          timeToCreate: 25,
        },
      ];

      // Filter recommendations based on user preferences
      let filteredRecommendations = mockRecommendations;

      if (selectedPlatform !== "all") {
        filteredRecommendations = filteredRecommendations.filter(
          (r) => r.platform === selectedPlatform,
        );
      }

      if (selectedCategory !== "all") {
        filteredRecommendations = filteredRecommendations.filter(
          (r) => r.category === selectedCategory,
        );
      }

      if (searchQuery) {
        filteredRecommendations = filteredRecommendations.filter(
          (r) =>
            r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            r.hashtags.some((tag) =>
              tag.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        );
      }

      setRecommendations(filteredRecommendations);
    } catch (error) {
      console.error("Error loading recommendations:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingTopics = async () => {
    try {
      const mockTrending: TrendingTopic[] = [
        {
          id: "1",
          topic: "AI Productivity Tools",
          platform: "all",
          growth: 340,
          volume: 2400000,
          difficulty: "medium",
          hashtags: ["#AI", "#productivity", "#tools", "#tech", "#automation"],
          description:
            "Content about AI tools for productivity is exploding across all platforms",
          exampleContent:
            "Show how you use ChatGPT, Notion AI, or other tools in your daily workflow",
        },
        {
          id: "2",
          topic: "Sustainable Living",
          platform: "instagram",
          growth: 180,
          volume: 890000,
          difficulty: "low",
          hashtags: [
            "#sustainable",
            "#ecofriendly",
            "#zerowaste",
            "#green",
            "#climate",
          ],
          description:
            "Eco-conscious content is trending, especially among Gen Z",
          exampleContent: "Share simple swaps for a more sustainable lifestyle",
        },
        {
          id: "3",
          topic: "Remote Work Setup",
          platform: "tiktok",
          growth: 220,
          volume: 1200000,
          difficulty: "low",
          hashtags: [
            "#remotework",
            "#workfromhome",
            "#desksetup",
            "#productivity",
            "#workspace",
          ],
          description:
            "Home office and remote work content continues to perform well",
          exampleContent:
            "Show your workspace transformation or productivity setup",
        },
        {
          id: "4",
          topic: "Mental Health Awareness",
          platform: "all",
          growth: 156,
          volume: 3200000,
          difficulty: "high",
          hashtags: [
            "#mentalhealth",
            "#selfcare",
            "#wellness",
            "#mindfulness",
            "#therapy",
          ],
          description:
            "Mental health content requires sensitivity but has high engagement",
          exampleContent:
            "Share your mental health journey or coping strategies (be authentic and responsible)",
        },
      ];

      setTrendingTopics(mockTrending);
    } catch (error) {
      console.error("Error loading trending topics:", error);
    }
  };

  const generateNewRecommendations = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI generation delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      await loadRecommendations();
    } finally {
      setIsGenerating(false);
    }
  };

  const copyContent = (content: string) => {
    navigator.clipboard.writeText(content);
    // You could add a toast notification here
  };

  const scheduleContent = (recommendation: ContentRecommendation) => {
    // This would integrate with your content scheduler
    
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600 bg-green-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    if (score >= 50) return "text-orange-600 bg-orange-100";
    return "text-red-600 bg-red-100";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "text-green-600 bg-green-100";
      case "medium":
        return "text-yellow-600 bg-yellow-100";
      case "hard":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getPlatformIcon = (platform: string) => {
    switch (platform) {
      case "tiktok":
        return "🎵";
      case "instagram":
        return "📸";
      case "youtube":
        return "📺";
      case "linkedin":
        return "💼";
      case "x":
        return "🐦";
      default:
        return "📱";
    }
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />;
      case "image":
        return <ImageIcon className="w-4 h-4" />;
      case "carousel":
        return <ImageIcon className="w-4 h-4" />;
      case "text":
        return <FileText className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (!hasActiveSubscription) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4">
          <Brain className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          AI Content Recommendations
        </h3>
        <p className="text-gray-600 mb-6">
          Get personalized, AI-powered content ideas that are trending in your
          niche
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Sparkles className="w-4 h-4" />
            <span>Personalized suggestions</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Trending topics</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>Viral score predictions</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Clock className="w-4 h-4" />
            <span>Optimal posting times</span>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
          <Rocket className="w-4 h-4 mr-2" />
          Upgrade to Access AI Recommendations
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            AI Content Recommendations
          </h2>
          <p className="text-gray-600">
            Personalized content ideas powered by AI and trending data
          </p>
        </div>
        <Button
          onClick={generateNewRecommendations}
          disabled={isGenerating}
          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
        >
          {isGenerating ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Wand2 className="w-4 h-4 mr-2" />
          )}
          {isGenerating ? "Generating..." : "Generate New Ideas"}
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Search className="w-4 h-4 text-gray-500" />
          <Input
            placeholder="Search recommendations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-64"
          />
        </div>
        <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Platforms</SelectItem>
            <SelectItem value="tiktok">🎵 TikTok</SelectItem>
            <SelectItem value="instagram">📸 Instagram</SelectItem>
            <SelectItem value="youtube">📺 YouTube</SelectItem>
            <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
          </SelectContent>
        </Select>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="lifestyle">Lifestyle</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="personal">Personal</SelectItem>
            <SelectItem value="education">Education</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="recommendations">AI Recommendations</TabsTrigger>
          <TabsTrigger value="trending">Trending Topics</TabsTrigger>
        </TabsList>

        <TabsContent value="recommendations" className="space-y-4">
          {isLoading ? (
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-6">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-20 bg-gray-200 rounded mb-4"></div>
                    <div className="flex gap-2">
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                      <div className="h-6 bg-gray-200 rounded w-16"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid gap-6">
              {recommendations.map((rec) => (
                <Card
                  key={rec.id}
                  className="p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">
                        {getPlatformIcon(rec.platform)}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {rec.title}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span className="flex items-center gap-1">
                            {getContentTypeIcon(rec.contentType)}
                            {rec.contentType}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {rec.timeToCreate}min
                          </span>
                          <span className="flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {(rec.estimatedReach / 1000).toFixed(0)}K reach
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        className={`${getViralScoreColor(rec.viralScore)} border-0`}
                      >
                        <Zap className="w-3 h-3 mr-1" />
                        {rec.viralScore}% viral
                      </Badge>
                      <Badge
                        className={`${getDifficultyColor(rec.difficulty)} border-0`}
                      >
                        {rec.difficulty}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-4 leading-relaxed">
                    {rec.content}
                  </p>

                  <div className="bg-blue-50 p-4 rounded-lg mb-4">
                    <div className="flex items-start gap-2">
                      <Lightbulb className="w-4 h-4 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-blue-900 mb-1">
                          AI Insight
                        </p>
                        <p className="text-sm text-blue-700">{rec.reasoning}</p>
                        <p className="text-xs text-blue-600 mt-1">
                          Best time to post: {rec.bestPostingTime}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {rec.hashtags.map((tag, index) => (
                      <span
                        key={index}
                        className="text-blue-600 text-sm bg-blue-50 px-2 py-1 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {rec.inspiration && (
                    <div className="bg-gray-50 p-3 rounded-lg mb-4">
                      <p className="text-xs font-medium text-gray-700 mb-1">
                        Inspired by:
                      </p>
                      <p className="text-xs text-gray-600">
                        {rec.inspiration.source}
                      </p>
                      <div className="flex gap-4 text-xs text-gray-500 mt-1">
                        <span>
                          {(
                            rec.inspiration.performance.views / 1000000
                          ).toFixed(1)}
                          M views
                        </span>
                        <span>
                          {(rec.inspiration.performance.likes / 1000).toFixed(
                            0,
                          )}
                          K likes
                        </span>
                        <span>
                          {(rec.inspiration.performance.shares / 1000).toFixed(
                            1,
                          )}
                          K shares
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2">
                    <Button
                      onClick={() => scheduleContent(rec)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                    >
                      <Calendar className="w-4 h-4 mr-2" />
                      Schedule Content
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => copyContent(rec.content)}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <ThumbsUp className="w-4 h-4" />
                    </Button>
                    <Button variant="outline">
                      <ThumbsDown className="w-4 h-4" />
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="trending" className="space-y-4">
          <div className="grid gap-4">
            {trendingTopics.map((topic) => (
              <Card key={topic.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {topic.topic}
                    </h3>
                    <p className="text-gray-600 text-sm mb-3">
                      {topic.description}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <TrendingUp className="w-4 h-4" />+{topic.growth}%
                        growth
                      </span>
                      <span className="flex items-center gap-1 text-blue-600">
                        <Eye className="w-4 h-4" />
                        {(topic.volume / 1000000).toFixed(1)}M volume
                      </span>
                      <Badge
                        className={`${getDifficultyColor(topic.difficulty)} border-0`}
                      >
                        {topic.difficulty} competition
                      </Badge>
                    </div>
                  </div>
                  <div className="text-2xl">
                    {getPlatformIcon(topic.platform)}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">
                    Content Idea:
                  </p>
                  <p className="text-sm text-gray-600">
                    {topic.exampleContent}
                  </p>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {topic.hashtags.map((tag, index) => (
                    <span
                      key={index}
                      className="text-purple-600 text-sm bg-purple-50 px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Create Content for This Trend
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
