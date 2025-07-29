"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../../supabase/client";
import { User } from "@supabase/supabase-js";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Zap,
  Brain,
  Target,
  TrendingUp,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  BarChart3,
  Users,
  Clock,
  Globe,
  Smartphone,
  Video,
  Image,
  FileText,
  Camera,
  Plus,
  Edit3,
  Save,
  Copy,
  Send,
  Settings,
  ArrowRight,
  ArrowUp,
  ArrowDown,
  Minus,
  Plus as PlusIcon,
  Sparkles,
  Crown,
  Star,
  Award,
  Trophy,
  Target as TargetIcon,
  TrendingDown,
  AlertTriangle,
  Info,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface ViralAnalysis {
  id: string;
  content: string;
  platform: string;
  contentType: string;
  viralScore: number;
  confidence: number;
  estimatedViews: string;
  estimatedEngagement: number;
  estimatedShares: number;
  estimatedComments: number;
  hashtags: string[];
  recommendations: string[];
  factors: {
    hook: number;
    timing: number;
    hashtags: number;
    callToAction: number;
    visualAppeal: number;
    trending: number;
  };
  createdAt: string;
}

interface ViralFactor {
  name: string;
  score: number;
  impact: "positive" | "negative" | "neutral";
  description: string;
  suggestion: string;
}

export default function ViralPredictorPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [contentType, setContentType] = useState("post");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [viralAnalysis, setViralAnalysis] = useState<ViralAnalysis | null>(null);
  const [analysisHistory, setAnalysisHistory] = useState<ViralAnalysis[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("analyze");

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadAnalysisHistory();
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

  const loadAnalysisHistory = async () => {
    try {
      // Mock data for demonstration
      const mockHistory: ViralAnalysis[] = [
        {
          id: "1",
          content: "🔥 Transform your mornings with this 5-minute routine that changed my life:\n\n⏰ 5:00 AM - Cold shower\n🧘 5:05 AM - 10 min meditation\n📝 5:15 AM - Journal & plan\n💪 5:25 AM - Quick workout\n☕ 5:35 AM - Healthy breakfast\n\nDouble tap if you're ready to level up! 👆",
          platform: "Instagram",
          contentType: "post",
          viralScore: 87,
          confidence: 92,
          estimatedViews: "125K",
          estimatedEngagement: 4.2,
          estimatedShares: 850,
          estimatedComments: 120,
          hashtags: ["#productivity", "#morningroutine", "#success", "#motivation"],
          recommendations: [
            "Add a personal story to increase relatability",
            "Include a question to boost engagement",
            "Use more trending hashtags",
          ],
          factors: {
            hook: 85,
            timing: 90,
            hashtags: 75,
            callToAction: 80,
            visualAppeal: 70,
            trending: 85,
          },
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          content: "🚨 5 mistakes that are holding you back:\n\n1. Waiting for perfect conditions\n2. Comparing your journey to others\n3. Not taking action on your ideas\n4. Focusing on followers over engagement\n5. Ignoring your audience's feedback\n\nWhich one resonates with you? Comment below! 👇",
          platform: "TikTok",
          contentType: "video",
          viralScore: 92,
          confidence: 88,
          estimatedViews: "250K",
          estimatedEngagement: 6.8,
          estimatedShares: 1200,
          estimatedComments: 180,
          hashtags: ["#mistakes", "#tips", "#advice", "#learn"],
          recommendations: [
            "Add a hook in the first 3 seconds",
            "Include more visual elements",
            "End with a stronger call-to-action",
          ],
          factors: {
            hook: 95,
            timing: 85,
            hashtags: 80,
            callToAction: 90,
            visualAppeal: 85,
            trending: 90,
          },
          createdAt: new Date().toISOString(),
        },
      ];
      setAnalysisHistory(mockHistory);
    } catch (error) {
      console.error("Error loading analysis history:", error);
    }
  };

  const platforms = [
    { id: "instagram", name: "Instagram", icon: Globe },
    { id: "tiktok", name: "TikTok", icon: Video },
    { id: "youtube", name: "YouTube", icon: Video },
    { id: "twitter", name: "Twitter", icon: FileText },
    { id: "facebook", name: "Facebook", icon: Globe },
    { id: "linkedin", name: "LinkedIn", icon: FileText },
  ];

  const contentTypes = [
    { id: "post", name: "Post", icon: FileText },
    { id: "story", name: "Story", icon: Camera },
    { id: "video", name: "Video", icon: Video },
    { id: "image", name: "Image", icon: Image },
  ];

  const analyzeContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter content to analyze");
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate AI analysis
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const mockAnalysis: ViralAnalysis = {
        id: Date.now().toString(),
        content: contentInput,
        platform: selectedPlatform,
        contentType: contentType,
        viralScore: Math.floor(Math.random() * 30) + 70, // 70-100
        confidence: Math.floor(Math.random() * 15) + 85, // 85-100
        estimatedViews: `${Math.floor(Math.random() * 500 + 100)}K`,
        estimatedEngagement: Math.random() * 8 + 2, // 2-10%
        estimatedShares: Math.floor(Math.random() * 1000 + 100),
        estimatedComments: Math.floor(Math.random() * 200 + 50),
        hashtags: [
          "#contentcreation",
          "#socialmedia",
          "#growth",
          "#viral",
          "#tips",
          "#engagement",
        ],
        recommendations: [
          "Add a compelling hook in the first line",
          "Include a question to boost engagement",
          "Use more trending hashtags",
          "Add a personal story for relatability",
          "End with a strong call-to-action",
        ],
        factors: {
          hook: Math.floor(Math.random() * 30) + 70,
          timing: Math.floor(Math.random() * 30) + 70,
          hashtags: Math.floor(Math.random() * 30) + 70,
          callToAction: Math.floor(Math.random() * 30) + 70,
          visualAppeal: Math.floor(Math.random() * 30) + 70,
          trending: Math.floor(Math.random() * 30) + 70,
        },
        createdAt: new Date().toISOString(),
      };

      setViralAnalysis(mockAnalysis);
      setAnalysisHistory((prev) => [mockAnalysis, ...prev]);
      setSuccess("Content analyzed successfully!");
    } catch (error) {
      console.error("Error analyzing content:", error);
      setError("Failed to analyze content. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getViralScoreColor = (score: number): string => {
    if (score >= 90) return "text-green-600";
    if (score >= 80) return "text-blue-600";
    if (score >= 70) return "text-yellow-600";
    return "text-red-600";
  };

  const getViralScoreStatus = (score: number): string => {
    if (score >= 90) return "VIRAL POTENTIAL";
    if (score >= 80) return "HIGH POTENTIAL";
    if (score >= 70) return "GOOD POTENTIAL";
    return "NEEDS IMPROVEMENT";
  };

  const getConfidenceColor = (confidence: number): string => {
    if (confidence >= 90) return "text-green-600";
    if (confidence >= 80) return "text-blue-600";
    return "text-yellow-600";
  };

  const getFactorIcon = (impact: string) => {
    switch (impact) {
      case "positive":
        return <ArrowUp className="w-4 h-4 text-green-600" />;
      case "negative":
        return <ArrowDown className="w-4 h-4 text-red-600" />;
      default:
        return <Minus className="w-4 h-4 text-gray-600" />;
    }
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
              <Zap className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Viral Score Predictor
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Predict Viral Content with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                AI Precision
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Know which content will go viral before you post it. Our AI
              analyzes millions of data points to predict content performance.
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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="analyze">Analyze Content</TabsTrigger>
              <TabsTrigger value="history">Analysis History</TabsTrigger>
              <TabsTrigger value="insights">Viral Insights</TabsTrigger>
            </TabsList>

            <TabsContent value="analyze" className="space-y-6">
              {/* Content Analysis Form */}
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
                    <Label htmlFor="content-input">Content to Analyze</Label>
                    <Textarea
                      id="content-input"
                      value={contentInput}
                      onChange={(e) => setContentInput(e.target.value)}
                      placeholder="Paste your content here to analyze its viral potential..."
                      rows={8}
                      className="resize-none"
                    />
                  </div>

                  {/* Analyze Button */}
                  <div className="flex justify-center">
                    <Button
                      onClick={analyzeContent}
                      disabled={isAnalyzing || !contentInput.trim()}
                      className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      size="lg"
                    >
                      {isAnalyzing ? (
                        <>
                          <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          <Brain className="w-4 h-4 mr-2" />
                          Analyze Viral Potential
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Analysis Results */}
              {viralAnalysis && (
                <div className="space-y-6">
                  {/* Viral Score Card */}
                  <Card className="p-6 border-green-200 bg-green-50">
                    <div className="text-center space-y-4">
                      <div className="flex items-center justify-center gap-3">
                        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center">
                          <Zap className="w-8 h-8 text-white" />
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900">Viral Score</h3>
                          <p className="text-sm text-gray-600">AI-powered prediction</p>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div className={`text-6xl font-bold ${getViralScoreColor(viralAnalysis.viralScore)}`}>
                          {viralAnalysis.viralScore}
              </div>
                        <p className="text-lg font-semibold text-gray-900">
                          {getViralScoreStatus(viralAnalysis.viralScore)}
                        </p>
                        <p className="text-sm text-gray-600">
                          Confidence: <span className={getConfidenceColor(viralAnalysis.confidence)}>{viralAnalysis.confidence}%</span>
              </p>
            </div>

                      <Progress value={viralAnalysis.viralScore} className="w-full" />
                    </div>
                  </Card>

                  {/* Performance Predictions */}
                  <div className="grid md:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                          <Eye className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Views</p>
                          <p className="text-xl font-bold text-blue-600">{viralAnalysis.estimatedViews}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                          <Heart className="w-5 h-5 text-green-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Engagement Rate</p>
                          <p className="text-xl font-bold text-green-600">{viralAnalysis.estimatedEngagement.toFixed(1)}%</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                          <Share2 className="w-5 h-5 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Shares</p>
                          <p className="text-xl font-bold text-purple-600">{viralAnalysis.estimatedShares}</p>
                        </div>
                      </div>
                    </Card>

                    <Card className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                          <MessageCircle className="w-5 h-5 text-orange-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Estimated Comments</p>
                          <p className="text-xl font-bold text-orange-600">{viralAnalysis.estimatedComments}</p>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Viral Factors Analysis */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Viral Factors Analysis</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(viralAnalysis.factors).map(([factor, score]) => (
                        <div key={factor} className="p-4 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium capitalize">{factor.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="text-sm font-medium">{score}%</span>
                          </div>
                          <Progress value={score} className="w-full" />
                        </div>
                      ))}
              </div>
                  </Card>

                  {/* Optimization Recommendations */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Lightbulb className="w-5 h-5 text-yellow-600" />
                      Optimization Recommendations
              </h3>
                    <div className="space-y-3">
                      {viralAnalysis.recommendations.map((recommendation, index) => (
                        <div key={index} className="flex items-start gap-3 p-3 bg-yellow-50 rounded-lg">
                          <div className="w-6 h-6 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
                            {index + 1}
                          </div>
                          <p className="text-sm text-yellow-800">{recommendation}</p>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Suggested Hashtags */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Suggested Hashtags</h3>
                    <div className="flex flex-wrap gap-2">
                      {viralAnalysis.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-blue-600">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              {/* Analysis History */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Analysis History</h3>
                <div className="space-y-4">
                  {analysisHistory.length > 0 ? (
                    analysisHistory.map((analysis) => (
                      <div key={analysis.id} className="flex items-start justify-between p-4 border border-gray-200 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h4 className="font-medium text-gray-900">
                              {analysis.content.substring(0, 50)}...
                            </h4>
                            <Badge className={getViralScoreColor(analysis.viralScore)}>
                              {analysis.viralScore}% viral
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">
                            {analysis.content.substring(0, 100)}...
                          </p>
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <Eye className="w-3 h-3" />
                              {analysis.estimatedViews}
                            </span>
                            <span className="flex items-center gap-1">
                              <Heart className="w-3 h-3" />
                              {analysis.estimatedEngagement.toFixed(1)}% engagement
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(analysis.createdAt).toLocaleDateString()}
                            </span>
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
                            <Save className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Brain className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                      <p>No analysis history yet</p>
                      <p className="text-sm">Analyze your first content to see history here</p>
                    </div>
                  )}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              {/* Viral Insights */}
              <div className="grid md:grid-cols-3 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <BarChart3 className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Accuracy Rate</h3>
                      <p className="text-2xl font-bold text-blue-600">87%</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Based on millions of posts analyzed</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Avg Viral Score</h3>
                      <p className="text-2xl font-bold text-green-600">82%</p>
                    </div>
            </div>
                  <p className="text-sm text-gray-600">Average across all analyzed content</p>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <Users className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Content Analyzed</h3>
                      <p className="text-2xl font-bold text-purple-600">2.4M+</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">Posts analyzed by our AI</p>
                </Card>
              </div>

              {/* Top Viral Factors */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Viral Factors</h3>
                <div className="space-y-4">
                  {[
                    { name: "Compelling Hook", score: 95, impact: "positive" as const, description: "First 3 seconds are crucial", suggestion: "Start with a shocking fact or question" },
                    { name: "Emotional Connection", score: 88, impact: "positive" as const, description: "Content that evokes emotions", suggestion: "Share personal stories or experiences" },
                    { name: "Trending Topics", score: 85, impact: "positive" as const, description: "Current popular subjects", suggestion: "Stay updated with trending hashtags" },
                    { name: "Call-to-Action", score: 82, impact: "positive" as const, description: "Encourages engagement", suggestion: "End with a question or request" },
                    { name: "Visual Appeal", score: 78, impact: "positive" as const, description: "High-quality visuals", suggestion: "Use bright colors and clear images" },
                  ].map((factor, index) => (
                    <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        {getFactorIcon(factor.impact)}
                        <div>
                          <h4 className="font-medium">{factor.name}</h4>
                          <p className="text-sm text-gray-600">{factor.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{factor.score}%</p>
                        <p className="text-xs text-gray-600">{factor.suggestion}</p>
            </div>
          </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
