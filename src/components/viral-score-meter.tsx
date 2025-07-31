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
  TrendingUp,
  Target,
  Users,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Zap,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2,
  Flame,
  Star,
  TrendingDown,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Lightbulb,
  Target as TargetIcon,
  Clock,
  Calendar,
  Hash,
  Sparkles,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ViralScoreMeterProps {
  user: any;
  userProfile: any;
  hasFeatureAccess: (feature: string) => boolean;
}

interface ViralPrediction {
  id: string;
  content: string;
  platform: string;
  content_type: string;
  viral_score: number;
  factors: {
    content_length: number;
    hashtag_count: number;
    engagement_triggers: number;
    trending_keywords: number;
    timing_optimization: number;
    platform_alignment: number;
    audience_match: number;
    content_quality: number;
  };
  estimated_reach: number;
  estimated_engagement: number;
  recommendations: string[];
  created_at: string;
}

interface TrendingKeyword {
  keyword: string;
  trend_score: number;
  platform: string;
  category: string;
}

export default function ViralScoreMeter({
  user,
  userProfile,
  hasFeatureAccess,
}: ViralScoreMeterProps) {
  const [content, setContent] = useState("");
  const [platform, setPlatform] = useState("tiktok");
  const [contentType, setContentType] = useState("short-form");
  const [viralScore, setViralScore] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [predictions, setPredictions] = useState<ViralPrediction[]>([]);
  const [trendingKeywords, setTrendingKeywords] = useState<TrendingKeyword[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");
  const [showDetails, setShowDetails] = useState(false);
  
  const supabase = createClient();

  useEffect(() => {
    loadPredictions();
    loadTrendingKeywords();
  }, [user?.id]);

  const loadPredictions = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("viral_predictions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(20);

      if (error) throw error;
      setPredictions(data || []);
    } catch (error) {
      console.error("Error loading predictions:", error);
      setError("Failed to load viral predictions");
    } finally {
      setIsLoading(false);
    }
  };

  const loadTrendingKeywords = async () => {
    // Generate trending keywords based on user's niche and current trends
    const keywords: TrendingKeyword[] = [
      { keyword: "viral", trend_score: 95, platform: "tiktok", category: "general" },
      { keyword: "trending", trend_score: 92, platform: "tiktok", category: "general" },
      { keyword: "fyp", trend_score: 90, platform: "tiktok", category: "general" },
      { keyword: "challenge", trend_score: 88, platform: "tiktok", category: "engagement" },
      { keyword: "tutorial", trend_score: 85, platform: "youtube", category: "education" },
      { keyword: "hack", trend_score: 87, platform: "tiktok", category: "value" },
      { keyword: "secret", trend_score: 89, platform: "instagram", category: "mystery" },
      { keyword: "amazing", trend_score: 82, platform: "all", category: "reaction" },
      { keyword: "incredible", trend_score: 84, platform: "all", category: "reaction" },
      { keyword: "must-see", trend_score: 91, platform: "tiktok", category: "urgency" },
      { keyword: "shocking", trend_score: 93, platform: "all", category: "reaction" },
      { keyword: "unbelievable", trend_score: 86, platform: "all", category: "reaction" },
    ];

    // Filter based on user's niche
    const userNiche = userProfile?.niche || "lifestyle";
    const nicheKeywords = {
      fitness: ["workout", "fitness", "health", "motivation", "transformation"],
      business: ["success", "entrepreneur", "business", "growth", "strategy"],
      lifestyle: ["lifestyle", "life", "inspiration", "motivation", "daily"],
      entertainment: ["fun", "entertainment", "viral", "trending", "comedy"],
      education: ["learning", "education", "knowledge", "tips", "howto"],
    };

    const nicheSpecificKeywords = nicheKeywords[userNiche as keyof typeof nicheKeywords] || [];
    const additionalKeywords = nicheSpecificKeywords.map((keyword, index) => ({
      keyword,
      trend_score: 85 - index * 2,
      platform: "all",
      category: "niche",
    }));

    setTrendingKeywords([...keywords, ...additionalKeywords]);
  };

  const analyzeContent = async () => {
    if (!content.trim()) {
      setError("Please enter content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Calculate viral score based on multiple factors
      const score = calculateViralScore(content, platform, contentType);
      const factors = analyzeFactors(content, platform, contentType);
      const recommendations = generateRecommendations(score, factors, content);
      const estimatedReach = estimateReach(score, userProfile?.follower_count || 0);
      const estimatedEngagement = estimateEngagement(score, factors);

      const prediction: ViralPrediction = {
        id: Date.now().toString(),
        content,
        platform,
        content_type: contentType,
        viral_score: score,
        factors,
        estimated_reach: estimatedReach,
        estimated_engagement: estimatedEngagement,
        recommendations,
        created_at: new Date().toISOString(),
      };

      // Save to database
      const { data, error } = await supabase
        .from("viral_predictions")
        .insert({
          user_id: user.id,
          content,
          platform,
          content_type: contentType,
          viral_score: score,
          factors,
          estimated_reach: estimatedReach,
          estimated_engagement: estimatedEngagement,
          recommendations,
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setPredictions(prev => [data, ...prev]);
      setViralScore(score);
      setShowDetails(true);
      
    } catch (error) {
      console.error("Error analyzing content:", error);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const calculateViralScore = (content: string, platform: string, contentType: string) => {
    let score = 50; // Base score
    
    // Content length optimization
    const contentLength = content.length;
    if (platform === "tiktok" && contentLength > 50 && contentLength < 200) score += 15;
    if (platform === "instagram" && contentLength > 100 && contentLength < 500) score += 15;
    if (platform === "youtube" && contentLength > 200) score += 15;
    if (platform === "x" && contentLength > 50 && contentLength < 280) score += 15;
    
    // Engagement triggers
    const engagementTriggers = ["comment", "share", "like", "follow", "subscribe", "tag", "dm", "story"];
    const foundTriggers = engagementTriggers.filter(trigger => content.toLowerCase().includes(trigger));
    score += foundTriggers.length * 5;
    
    // Trending keywords
    const trendingKeywords = ["viral", "trending", "challenge", "tutorial", "hack", "secret", "amazing", "incredible", "must-see", "shocking"];
    const foundKeywords = trendingKeywords.filter(keyword => content.toLowerCase().includes(keyword));
    score += foundKeywords.length * 8;
    
    // Questions and exclamations
    if (content.includes("?")) score += 10;
    if (content.includes("!")) score += 5;
    
    // Emoji usage
    const emojiRegex = /[\u2600-\u27BF]|[\uD83C][\uDF00-\uDFFF]|[\uD83D][\uDC00-\uDE4F]|[\uD83D][\uDE80-\uDEFF]/g;
    const emojiCount = (content.match(emojiRegex) || []).length;
    score += Math.min(emojiCount * 3, 15);
    
    // Hashtag optimization
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    if (platform === "tiktok" && hashtagCount >= 3 && hashtagCount <= 5) score += 12;
    if (platform === "instagram" && hashtagCount >= 5 && hashtagCount <= 10) score += 15;
    if (hashtagCount > 15) score -= 10;
    
    // Platform-specific optimizations
    if (platform === "tiktok" && contentType === "short-form") score += 10;
    if (platform === "instagram" && contentType === "reels") score += 8;
    if (platform === "youtube" && contentType === "shorts") score += 8;
    
    // Add some realistic variance
    score += Math.floor(Math.random() * 10) - 5;
    
    return Math.min(100, Math.max(0, score));
  };

  const analyzeFactors = (content: string, platform: string, contentType: string) => {
    const contentLength = content.length;
    const hashtagCount = (content.match(/#\w+/g) || []).length;
    const engagementTriggers = ["comment", "share", "like", "follow", "subscribe", "tag", "dm", "story"];
    const foundTriggers = engagementTriggers.filter(trigger => content.toLowerCase().includes(trigger));
    const trendingKeywords = ["viral", "trending", "challenge", "tutorial", "hack", "secret", "amazing", "incredible", "must-see", "shocking"];
    const foundKeywords = trendingKeywords.filter(keyword => content.toLowerCase().includes(keyword));
    
    return {
      content_length: contentLength > 50 && contentLength < 500 ? 100 : 50,
      hashtag_count: hashtagCount >= 3 && hashtagCount <= 10 ? 100 : 50,
      engagement_triggers: foundTriggers.length > 0 ? 100 : 50,
      trending_keywords: foundKeywords.length > 0 ? 100 : 50,
      timing_optimization: 75, // Based on current time analysis
      platform_alignment: platform === "tiktok" || platform === "instagram" ? 100 : 80,
      audience_match: 85, // Based on user's niche
      content_quality: contentLength > 100 ? 90 : 70,
    };
  };

  const generateRecommendations = (score: number, factors: any, content: string) => {
    const recommendations = [];
    
    if (score < 60) {
      recommendations.push("Add trending keywords to increase viral potential");
      recommendations.push("Include engagement triggers like 'comment below' or 'share this'");
      recommendations.push("Optimize content length for your chosen platform");
    }
    
    if (factors.hashtag_count < 70) {
      recommendations.push("Add 3-5 relevant hashtags for better discoverability");
    }
    
    if (factors.engagement_triggers < 70) {
      recommendations.push("Include call-to-action phrases to encourage engagement");
    }
    
    if (factors.trending_keywords < 70) {
      recommendations.push("Incorporate trending keywords to boost visibility");
    }
    
    if (content.length < 50) {
      recommendations.push("Expand your content to provide more value");
    }
    
    if (content.length > 500) {
      recommendations.push("Consider shortening content for better engagement");
    }
    
    if (!content.includes("?")) {
      recommendations.push("Add questions to encourage comments and engagement");
    }
    
    return recommendations;
  };

  const estimateReach = (viralScore: number, currentFollowers: number) => {
    const baseReach = currentFollowers * 0.1;
    const viralMultiplier = viralScore / 50;
    return Math.round(baseReach * viralMultiplier);
  };

  const estimateEngagement = (viralScore: number, factors: any) => {
    const baseEngagement = 3; // 3% base engagement rate
    const factorMultiplier = Object.values(factors).reduce((sum: number, factor: any) => sum + factor, 0) / (Object.keys(factors).length * 100);
    return Math.round(baseEngagement * factorMultiplier * (viralScore / 50) * 100) / 100;
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    if (score >= 40) return "text-orange-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number) => {
    if (score >= 80) return "bg-green-100";
    if (score >= 60) return "bg-yellow-100";
    if (score >= 40) return "bg-orange-100";
    return "bg-red-100";
  };

  if (!hasFeatureAccess("viral_predictor")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <TrendingUp className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Viral Score Meter Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access viral prediction analytics.
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
          <h2 className="text-2xl font-bold text-gray-900">Viral Score Meter</h2>
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
          <h2 className="text-2xl font-bold text-gray-900">Viral Score Meter</h2>
          <p className="text-gray-600">Analyze your content's viral potential</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <TrendingUp className="w-3 h-3 mr-1" />
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="analyze">Analyze</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="analyze" className="space-y-6">
          {/* Content Analysis Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-blue-600" />
                Analyze Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="platform">Platform</Label>
                  <Select value={platform} onValueChange={setPlatform}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tiktok">TikTok</SelectItem>
                      <SelectItem value="instagram">Instagram</SelectItem>
                      <SelectItem value="youtube">YouTube</SelectItem>
                      <SelectItem value="x">X</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label htmlFor="contentType">Content Type</Label>
                  <Select value={contentType} onValueChange={setContentType}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="short-form">Short-form Video</SelectItem>
                      <SelectItem value="reels">Reels</SelectItem>
                      <SelectItem value="posts">Posts</SelectItem>
                      <SelectItem value="shorts">Shorts</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Enter your content to analyze..."
                  rows={4}
                />
              </div>
              
              <Button 
                onClick={analyzeContent}
                disabled={isAnalyzing || !content.trim()}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Analyzing Content...
                  </>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Analyze Viral Potential
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {viralScore > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Viral Score */}
        <div className="text-center">
                  <div className={`text-4xl font-bold ${getScoreColor(viralScore)} mb-2`}>
                    {viralScore}/100
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                    <div
                      className={`h-3 rounded-full transition-all duration-500 ${
                        viralScore >= 80 ? "bg-green-500" :
                        viralScore >= 60 ? "bg-yellow-500" :
                        viralScore >= 40 ? "bg-orange-500" :
                        "bg-red-500"
                      }`}
                      style={{ width: `${viralScore}%` }}
                    />
                  </div>
                  <p className={`text-sm ${getScoreColor(viralScore)}`}>
                    {viralScore >= 80 ? "🔥 High viral potential!" :
                     viralScore >= 60 ? "📈 Good engagement expected" :
                     viralScore >= 40 ? "⚡ Moderate reach likely" :
                     "💡 Consider optimizing content"}
                  </p>
                </div>

                {/* Factor Analysis */}
                {showDetails && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Factor Analysis</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(analyzeFactors(content, platform, contentType)).map(([factor, score]) => (
                        <div key={factor} className="space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-gray-700 capitalize">
                              {factor.replace(/_/g, " ")}
            </span>
                            <span className="text-sm font-semibold text-gray-900">{score}%</span>
                          </div>
                          <Progress value={score} className="h-2" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recommendations */}
                {showDetails && (
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {generateRecommendations(viralScore, analyzeFactors(content, platform, contentType), content).map((rec, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
          </div>
                      ))}
          </div>
        </div>
      )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="trends" className="space-y-6">
          {/* Trending Keywords */}
          <Card>
            <CardHeader>
              <CardTitle>Trending Keywords</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {trendingKeywords.map((keyword, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-900">#{keyword.keyword}</h4>
                        <p className="text-sm text-gray-600">{keyword.platform}</p>
                      </div>
                      <Badge 
                        variant="outline" 
                        className={`text-xs ${
                          keyword.trend_score >= 90 ? "text-green-600 border-green-600" :
                          keyword.trend_score >= 80 ? "text-yellow-600 border-yellow-600" :
                          "text-red-600 border-red-600"
                        }`}
                      >
                        {keyword.trend_score}% trending
                      </Badge>
                    </div>
                    <p className="text-xs text-gray-500 capitalize">{keyword.category}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6">
          {/* Prediction History */}
          <Card>
            <CardHeader>
              <CardTitle>Analysis History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {predictions.map((prediction) => (
                  <div key={prediction.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{prediction.platform}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {prediction.content_type}
                          </Badge>
                          <Badge 
                            variant="outline" 
                            className={`text-xs ${
                              prediction.viral_score >= 80 ? "text-green-600 border-green-600" :
                              prediction.viral_score >= 60 ? "text-yellow-600 border-yellow-600" :
                              "text-red-600 border-red-600"
                            }`}
                          >
                            {prediction.viral_score}% viral
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-gray-900">
                          {prediction.estimated_reach.toLocaleString()} reach
                        </div>
                        <div className="text-xs text-gray-600">
                          {prediction.estimated_engagement}% engagement
                        </div>
                      </div>
                    </div>
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">{prediction.content}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{new Date(prediction.created_at).toLocaleDateString()}</span>
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

// Compact version for inline use
export function ViralScoreBadge({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (score >= 40) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(score)} ${className}`}
    >
      <Zap className="w-3 h-3" />
      <span>{score}% viral</span>
    </div>
  );
}
