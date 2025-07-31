"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Recycle,
  Wand2,
  Copy,
  Download,
  Share2,
  Zap,
  RefreshCw,
  Play,
  Image as ImageIcon,
  FileText,
  Video,
  ArrowRight,
  CheckCircle,
  Clock,
  TrendingUp,
  Target,
  Sparkles,
  Settings,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface ContentRepurposingProps {
  userId: string;
  hasActiveSubscription: boolean;
  subscriptionTier: string;
}

interface OriginalContent {
  id: string;
  title: string;
  content: string;
  platform: string;
  content_type: string;
  performance_data: any;
  created_at: string;
  viral_score: number;
}

interface RepurposedContent {
  id: string;
  original_id: string;
  title: string;
  content: string;
  platform: string;
  content_type: string;
  adaptations: string[];
  viral_score: number;
  status: "draft" | "ready" | "scheduled";
  created_at: string;
}

interface RepurposingRule {
  id: string;
  name: string;
  source_platform: string;
  target_platforms: string[];
  content_types: string[];
  min_performance_score: number;
  auto_adapt: boolean;
  adaptations: string[];
}

const platforms = [
  { id: "tiktok", name: "TikTok", icon: "🎵", color: "bg-pink-500" },
  { id: "instagram", name: "Instagram", icon: "📸", color: "bg-purple-500" },
  { id: "youtube", name: "YouTube", icon: "📺", color: "bg-red-500" },
      { id: "twitter", name: "X", icon: "🐦", color: "bg-blue-500" },
  { id: "linkedin", name: "LinkedIn", icon: "💼", color: "bg-blue-600" },
];

const adaptationTypes = [
  {
    id: "format_change",
    name: "Format Change",
    description: "Convert between video, image, text",
  },
  {
    id: "length_adjust",
    name: "Length Adjustment",
    description: "Shorten or expand content",
  },
  {
    id: "tone_shift",
    name: "Tone Shift",
    description: "Adjust tone for platform audience",
  },
  {
    id: "hashtag_optimize",
    name: "Hashtag Optimization",
    description: "Platform-specific hashtags",
  },
  {
    id: "cta_adapt",
    name: "CTA Adaptation",
    description: "Platform-appropriate calls-to-action",
  },
  {
    id: "visual_resize",
    name: "Visual Resize",
    description: "Adjust dimensions and aspect ratios",
  },
];

export default function ContentRepurposing({
  userId,
  hasActiveSubscription,
  subscriptionTier,
}: ContentRepurposingProps) {
  const [originalContent, setOriginalContent] = useState<OriginalContent[]>([]);
  const [repurposedContent, setRepurposedContent] = useState<
    RepurposedContent[]
  >([]);
  const [repurposingRules, setRepurposingRules] = useState<RepurposingRule[]>(
    [],
  );
  const [isLoading, setIsLoading] = useState(true);
  const [isRepurposing, setIsRepurposing] = useState(false);
  const [selectedContent, setSelectedContent] = useState<string | null>(null);
  const [targetPlatforms, setTargetPlatforms] = useState<string[]>([]);
  const [selectedAdaptations, setSelectedAdaptations] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("repurpose");
  const supabase = createClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      // Load original content with good performance
      const { data: contentData } = await supabase
        .from("content_queue")
        .select("*")
        .eq("user_id", userId)
        .eq("status", "posted")
        .gte("viral_score", 60)
        .order("created_at", { ascending: false })
        .limit(20);

      if (contentData) {
        setOriginalContent(contentData);
      }

      // Load existing repurposed content
      const mockRepurposed: RepurposedContent[] = [
        {
          id: "1",
          original_id: "orig_1",
          title: "Morning Routine Tips - LinkedIn Version",
          content:
            "Professional morning routine strategies that boost productivity...",
          platform: "linkedin",
          content_type: "text",
          adaptations: ["tone_shift", "cta_adapt"],
          viral_score: 78,
          status: "ready",
          created_at: new Date().toISOString(),
        },
        {
          id: "2",
          original_id: "orig_1",
          title: "Quick Morning Hacks - X Thread",
          content: "🧵 Thread: 5 morning hacks that changed my life...",
          platform: "twitter",
          content_type: "text",
          adaptations: ["length_adjust", "hashtag_optimize"],
          viral_score: 82,
          status: "scheduled",
          created_at: new Date().toISOString(),
        },
      ];
      setRepurposedContent(mockRepurposed);

      // Load repurposing rules
      const mockRules: RepurposingRule[] = [
        {
          id: "1",
          name: "TikTok to All Platforms",
          source_platform: "tiktok",
          target_platforms: ["instagram", "youtube", "twitter"],
          content_types: ["video"],
          min_performance_score: 70,
          auto_adapt: true,
          adaptations: ["format_change", "length_adjust", "hashtag_optimize"],
        },
        {
          id: "2",
          name: "High-Performing to LinkedIn",
          source_platform: "all",
          target_platforms: ["linkedin"],
          content_types: ["text", "image"],
          min_performance_score: 80,
          auto_adapt: false,
          adaptations: ["tone_shift", "cta_adapt"],
        },
      ];
      setRepurposingRules(mockRules);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const repurposeContent = async (contentId: string) => {
    if (!hasActiveSubscription) {
      alert("Upgrade to access content repurposing!");
      return;
    }

    setIsRepurposing(true);
    try {
      const originalItem = originalContent.find((c) => c.id === contentId);
      if (!originalItem) return;

      // Simulate AI repurposing process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newRepurposed: RepurposedContent[] = targetPlatforms.map(
        (platform, index) => {
          const platformInfo = platforms.find((p) => p.id === platform);
          return {
            id: `repurposed_${Date.now()}_${index}`,
            original_id: contentId,
            title: `${originalItem.title} - ${platformInfo?.name} Version`,
            content: adaptContentForPlatform(originalItem.content, platform),
            platform,
            content_type: getOptimalContentType(
              platform,
              originalItem.content_type,
            ),
            adaptations: selectedAdaptations,
            viral_score: Math.floor(Math.random() * 20) + 70,
            status: "ready" as const,
            created_at: new Date().toISOString(),
          };
        },
      );

      setRepurposedContent((prev) => [...prev, ...newRepurposed]);
      setSelectedContent(null);
      setTargetPlatforms([]);
      setSelectedAdaptations([]);
    } catch (error) {
      console.error("Error repurposing content:", error);
    } finally {
      setIsRepurposing(false);
    }
  };

  const adaptContentForPlatform = (
    content: string,
    platform: string,
  ): string => {
    const adaptations = {
      linkedin: `Professional insight: ${content.slice(0, 200)}... \n\nWhat are your thoughts on this approach? Share your experience in the comments. #ProfessionalDevelopment #Productivity`,
              twitter: `🧵 ${content.slice(0, 100)}...\n\nThread below 👇\n\n#XTips #Viral`,
      instagram: `✨ ${content}\n\n📸 Swipe for more tips!\n\n#InstagramTips #ContentCreator #Viral`,
      youtube: `🎥 ${content}\n\nFull tutorial in the description!\n\n#YouTubeShorts #Tutorial #Viral`,
      tiktok: `🔥 ${content.slice(0, 150)}...\n\n#TikTokTips #Viral #FYP`,
    };
    return adaptations[platform as keyof typeof adaptations] || content;
  };

  const getOptimalContentType = (
    platform: string,
    originalType: string,
  ): string => {
    const platformOptimal = {
      tiktok: "video",
      instagram: originalType === "video" ? "video" : "carousel",
      youtube: "video",
      twitter: "text",
      linkedin: "text",
    };
    return (
      platformOptimal[platform as keyof typeof platformOptimal] || originalType
    );
  };

  const scheduleRepurposedContent = async (repurposedId: string) => {
    try {
      // Add to content queue
      const repurposed = repurposedContent.find((r) => r.id === repurposedId);
      if (!repurposed) return;

      const scheduleData = {
        user_id: userId,
        title: repurposed.title,
        content: repurposed.content,
        content_type: repurposed.content_type,
        platform: repurposed.platform,
        scheduled_for: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
        viral_score: repurposed.viral_score,
        status: "scheduled",
        hashtags: extractHashtags(repurposed.content),
        auto_post: true,
      };

      const { error } = await supabase
        .from("content_queue")
        .insert(scheduleData);

      if (error) throw error;

      // Update repurposed content status
      setRepurposedContent((prev) =>
        prev.map((r) =>
          r.id === repurposedId ? { ...r, status: "scheduled" as const } : r,
        ),
      );
    } catch (error) {
      console.error("Error scheduling content:", error);
    }
  };

  const extractHashtags = (content: string): string[] => {
    const hashtags = content.match(/#\w+/g) || [];
    return hashtags.map((tag) => tag.slice(1));
  };

  const deleteRepurposedContent = async (repurposedId: string) => {
    setRepurposedContent((prev) => prev.filter((r) => r.id !== repurposedId));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ready":
        return "bg-green-100 text-green-700";
      case "scheduled":
        return "bg-blue-100 text-blue-700";
      case "draft":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getViralScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  if (!hasActiveSubscription) {
    return (
      <Card className="p-8 text-center border-2 border-dashed border-gray-300">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mb-4">
          <Recycle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">
          Content Repurposing Suite
        </h3>
        <p className="text-gray-600 mb-6">
          Automatically adapt your high-performing content for multiple
          platforms
        </p>
        <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Wand2 className="w-4 h-4" />
            <span>AI-powered adaptation</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Target className="w-4 h-4" />
            <span>Platform optimization</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <Zap className="w-4 h-4" />
            <span>Automated repurposing</span>
          </div>
          <div className="flex items-center justify-center gap-2 text-gray-600">
            <TrendingUp className="w-4 h-4" />
            <span>Performance tracking</span>
          </div>
        </div>
        <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
          <Sparkles className="w-4 h-4 mr-2" />
          Upgrade to Access Repurposing
        </Button>
      </Card>
    );
  }

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Loading content repurposing...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Recycle className="w-6 h-6 text-green-600" />
            Content Repurposing
          </h2>
          <p className="text-gray-600">
            Transform your best content for multiple platforms automatically
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="bg-green-50 text-green-700">
            {repurposedContent.length} repurposed
          </Badge>
          <Button
            onClick={loadData}
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

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="repurpose">Repurpose Content</TabsTrigger>
          <TabsTrigger value="repurposed">Repurposed Content</TabsTrigger>
          <TabsTrigger value="rules">Automation Rules</TabsTrigger>
        </TabsList>

        <TabsContent value="repurpose" className="space-y-6">
          {/* Content Selection */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Select High-Performing Content
            </h3>
            <div className="grid gap-4">
              {originalContent.map((content) => {
                const platform = platforms.find(
                  (p) => p.id === content.platform,
                );
                const isSelected = selectedContent === content.id;

                return (
                  <div
                    key={content.id}
                    onClick={() => setSelectedContent(content.id)}
                    className={`p-4 border rounded-lg cursor-pointer transition-all ${
                      isSelected
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-10 h-10 ${platform?.color} rounded-lg flex items-center justify-center text-white`}
                        >
                          {platform?.icon}
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {content.title}
                          </h4>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {content.content}
                          </p>
                          <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                            <span>
                              {new Date(
                                content.created_at,
                              ).toLocaleDateString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {content.performance_data?.views || "N/A"} views
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge
                          className={`${getViralScoreColor(content.viral_score)} border-0`}
                        >
                          <Zap className="w-3 h-3 mr-1" />
                          {content.viral_score}%
                        </Badge>
                        {isSelected && (
                          <CheckCircle className="w-5 h-5 text-blue-600" />
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          {/* Repurposing Configuration */}
          {selectedContent && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Configure Repurposing
              </h3>

              <div className="grid md:grid-cols-2 gap-6">
                {/* Target Platforms */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Target Platforms
                  </Label>
                  <div className="space-y-2">
                    {platforms.map((platform) => (
                      <label
                        key={platform.id}
                        className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={targetPlatforms.includes(platform.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setTargetPlatforms((prev) => [
                                ...prev,
                                platform.id,
                              ]);
                            } else {
                              setTargetPlatforms((prev) =>
                                prev.filter((p) => p !== platform.id),
                              );
                            }
                          }}
                          className="rounded"
                        />
                        <div
                          className={`w-6 h-6 ${platform.color} rounded flex items-center justify-center text-white text-sm`}
                        >
                          {platform.icon}
                        </div>
                        <span className="font-medium">{platform.name}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Adaptations */}
                <div>
                  <Label className="text-base font-medium mb-3 block">
                    Content Adaptations
                  </Label>
                  <div className="space-y-2">
                    {adaptationTypes.map((adaptation) => (
                      <label
                        key={adaptation.id}
                        className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded"
                      >
                        <input
                          type="checkbox"
                          checked={selectedAdaptations.includes(adaptation.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setSelectedAdaptations((prev) => [
                                ...prev,
                                adaptation.id,
                              ]);
                            } else {
                              setSelectedAdaptations((prev) =>
                                prev.filter((a) => a !== adaptation.id),
                              );
                            }
                          }}
                          className="rounded mt-0.5"
                        />
                        <div>
                          <div className="font-medium text-sm">
                            {adaptation.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            {adaptation.description}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-gray-200">
                <Button
                  onClick={() => repurposeContent(selectedContent)}
                  disabled={isRepurposing || targetPlatforms.length === 0}
                  className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
                >
                  {isRepurposing ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Repurposing Content...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Wand2 className="w-4 h-4" />
                      Repurpose Content ({targetPlatforms.length} platforms)
                    </div>
                  )}
                </Button>
              </div>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="repurposed" className="space-y-6">
          {/* Repurposed Content List */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Repurposed Content ({repurposedContent.length})
              </h3>
            </div>

            {repurposedContent.length === 0 ? (
              <div className="text-center py-12">
                <Recycle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No repurposed content yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Start repurposing your high-performing content for multiple
                  platforms
                </p>
                <Button
                  onClick={() => setActiveTab("repurpose")}
                  className="bg-green-600 hover:bg-green-700"
                >
                  <Wand2 className="w-4 h-4 mr-2" />
                  Start Repurposing
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {repurposedContent.map((content) => {
                  const platform = platforms.find(
                    (p) => p.id === content.platform,
                  );
                  const originalItem = originalContent.find(
                    (o) => o.id === content.original_id,
                  );

                  return (
                    <div
                      key={content.id}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div
                              className={`w-8 h-8 ${platform?.color} rounded-lg flex items-center justify-center text-white text-sm`}
                            >
                              {platform?.icon}
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {content.title}
                              </h4>
                              <div className="flex items-center gap-4 text-sm text-gray-600">
                                <span>
                                  From: {originalItem?.title || "Unknown"}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {new Date(
                                    content.created_at,
                                  ).toLocaleDateString()}
                                </span>
                              </div>
                            </div>
                          </div>

                          <p className="text-gray-700 text-sm mb-3 line-clamp-3">
                            {content.content}
                          </p>

                          <div className="flex flex-wrap gap-2 mb-3">
                            {content.adaptations.map((adaptation, index) => {
                              const adaptationType = adaptationTypes.find(
                                (a) => a.id === adaptation,
                              );
                              return (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs"
                                >
                                  {adaptationType?.name || adaptation}
                                </span>
                              );
                            })}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 ml-4">
                          <Badge
                            className={`${getStatusColor(content.status)} border-0`}
                          >
                            {content.status}
                          </Badge>
                          <Badge
                            className={`${getViralScoreColor(content.viral_score)} border-0`}
                          >
                            <Zap className="w-3 h-3 mr-1" />
                            {content.viral_score}%
                          </Badge>

                          <div className="flex items-center gap-1">
                            {content.status === "ready" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  scheduleRepurposedContent(content.id)
                                }
                                className="bg-blue-600 hover:bg-blue-700"
                              >
                                <Share2 className="w-3 h-3" />
                              </Button>
                            )}
                            <Button size="sm" variant="outline">
                              <Edit className="w-3 h-3" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                deleteRepurposedContent(content.id)
                              }
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </Card>
        </TabsContent>

        <TabsContent value="rules" className="space-y-6">
          {/* Automation Rules */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Automation Rules
              </h3>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Settings className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
            </div>

            <div className="space-y-4">
              {repurposingRules.map((rule) => (
                <div
                  key={rule.id}
                  className="border border-gray-200 rounded-lg p-4"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-2">
                        {rule.name}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                        <div>
                          <span className="font-medium">Source:</span>{" "}
                          {rule.source_platform === "all"
                            ? "All Platforms"
                            : rule.source_platform}
                        </div>
                        <div>
                          <span className="font-medium">Targets:</span>{" "}
                          {rule.target_platforms.join(", ")}
                        </div>
                        <div>
                          <span className="font-medium">Min Score:</span>{" "}
                          {rule.min_performance_score}%
                        </div>
                        <div>
                          <span className="font-medium">Auto-adapt:</span>{" "}
                          {rule.auto_adapt ? "Yes" : "No"}
                        </div>
                      </div>
                      <div className="mt-2">
                        <span className="text-sm font-medium text-gray-700">
                          Adaptations:{" "}
                        </span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {rule.adaptations.map((adaptation, index) => {
                            const adaptationType = adaptationTypes.find(
                              (a) => a.id === adaptation,
                            );
                            return (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                              >
                                {adaptationType?.name || adaptation}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Badge
                        className={
                          rule.auto_adapt
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-700"
                        }
                      >
                        {rule.auto_adapt ? "Active" : "Manual"}
                      </Badge>
                      <Button size="sm" variant="outline">
                        <Edit className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
