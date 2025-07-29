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
  TrendingUp,
  Zap,
  Target,
  BarChart3,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Lightbulb,
  Eye,
  Heart,
  Share2,
  MessageCircle,
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
  Brain,
  Rocket,
  ChartBar,
  TestTube,
  Filter,
  Search,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  Minimize2,
  Activity,
  Target as TargetIcon2,
  Zap as ZapIcon,
  TrendingUp as TrendingUpIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface GrowthStrategy {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: "easy" | "medium" | "hard";
  estimatedGrowth: number;
  timeToImplement: string;
  status: "not_started" | "in_progress" | "completed";
  createdAt: string;
}

interface ABTest {
  id: string;
  name: string;
  description: string;
  variantA: string;
  variantB: string;
  platform: string;
  status: "running" | "completed" | "paused";
  startDate: string;
  endDate?: string;
  results: {
    variantA: {
      views: number;
      engagement: number;
      conversions: number;
    };
    variantB: {
      views: number;
      engagement: number;
      conversions: number;
    };
  };
  winner?: "A" | "B" | "tie";
}

interface GrowthMetrics {
  followers: number;
  engagement: number;
  reach: number;
  impressions: number;
  growthRate: number;
  viralScore: number;
}

export default function GrowthEnginePage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [growthStrategies, setGrowthStrategies] = useState<GrowthStrategy[]>([]);
  const [abTests, setAbTests] = useState<ABTest[]>([]);
  const [growthMetrics, setGrowthMetrics] = useState<GrowthMetrics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("strategies");
  const [isOptimizing, setIsOptimizing] = useState(false);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadGrowthData();
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

  const loadGrowthData = async () => {
    try {
      // Mock data for demonstration
      const mockStrategies: GrowthStrategy[] = [
        {
          id: "1",
          name: "Viral Hook Optimization",
          description: "Optimize your content hooks to grab attention in the first 3 seconds",
          category: "Content",
          difficulty: "medium",
          estimatedGrowth: 45,
          timeToImplement: "2-3 hours",
          status: "in_progress",
          createdAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "Smart Hashtag Strategy",
          description: "Research and implement trending hashtags for maximum discoverability",
          category: "Discovery",
          difficulty: "easy",
          estimatedGrowth: 30,
          timeToImplement: "1 hour",
          status: "completed",
          createdAt: new Date().toISOString(),
        },
        {
          id: "3",
          name: "A/B Testing Framework",
          description: "Set up systematic A/B testing for content optimization",
          category: "Optimization",
          difficulty: "hard",
          estimatedGrowth: 60,
          timeToImplement: "4-6 hours",
          status: "not_started",
          createdAt: new Date().toISOString(),
        },
        {
          id: "4",
          name: "Engagement Optimization",
          description: "Optimize content for maximum engagement and interaction",
          category: "Engagement",
          difficulty: "medium",
          estimatedGrowth: 35,
          timeToImplement: "2-4 hours",
          status: "not_started",
          createdAt: new Date().toISOString(),
        },
      ];

      const mockABTests: ABTest[] = [
        {
          id: "1",
          name: "Hook vs No Hook",
          description: "Testing the impact of compelling hooks on engagement",
          variantA: "🔥 Transform your mornings with this 5-minute routine...",
          variantB: "Transform your mornings with this 5-minute routine...",
          platform: "Instagram",
          status: "running",
          startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          results: {
            variantA: {
              views: 12500,
              engagement: 4.2,
              conversions: 850,
            },
            variantB: {
              views: 8900,
              engagement: 2.8,
              conversions: 420,
            },
          },
        },
        {
          id: "2",
          name: "Hashtag Strategy",
          description: "Testing different hashtag approaches for reach",
          variantA: "Using 5 trending hashtags",
          variantB: "Using 10 niche hashtags",
          platform: "TikTok",
          status: "completed",
          startDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
          endDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          results: {
            variantA: {
              views: 25000,
              engagement: 6.8,
              conversions: 1200,
            },
            variantB: {
              views: 18000,
              engagement: 5.2,
              conversions: 950,
            },
          },
          winner: "A",
        },
      ];

      const mockMetrics: GrowthMetrics = {
        followers: 12500,
        engagement: 4.2,
        reach: 45000,
        impressions: 89000,
        growthRate: 12.5,
        viralScore: 78,
      };

      setGrowthStrategies(mockStrategies);
      setAbTests(mockABTests);
      setGrowthMetrics(mockMetrics);
    } catch (error) {
      console.error("Error loading growth data:", error);
    }
  };

  const optimizeGrowth = async () => {
    setIsOptimizing(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate optimization process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      setSuccess("Growth optimization completed! Check your strategies for updates.");
    } catch (error) {
      console.error("Error optimizing growth:", error);
      setError("Failed to optimize growth. Please try again.");
    } finally {
      setIsOptimizing(false);
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "hard":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "not_started":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getTestStatusColor = (status: string) => {
    switch (status) {
      case "running":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "paused":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
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
              <TrendingUp className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Growth Engine
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Accelerate Your Growth with{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Smart Optimization
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Maximize your reach and engagement with AI-powered growth
              strategies, viral hook optimization, and intelligent hashtag
              systems.
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

          {/* Growth Metrics Overview */}
          {growthMetrics && (
            <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Followers</p>
                    <p className="text-xl font-bold text-blue-600">{growthMetrics.followers.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Heart className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Engagement</p>
                    <p className="text-xl font-bold text-green-600">{growthMetrics.engagement}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 rounded-lg">
                    <Eye className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Reach</p>
                    <p className="text-xl font-bold text-purple-600">{growthMetrics.reach.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <BarChart3 className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Impressions</p>
                    <p className="text-xl font-bold text-orange-600">{growthMetrics.impressions.toLocaleString()}</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <TrendingUp className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Growth Rate</p>
                    <p className="text-xl font-bold text-red-600">+{growthMetrics.growthRate}%</p>
                  </div>
                </div>
              </Card>

              <Card className="p-4">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-yellow-100 rounded-lg">
                    <Zap className="w-5 h-5 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Viral Score</p>
                    <p className="text-xl font-bold text-yellow-600">{growthMetrics.viralScore}%</p>
                  </div>
                </div>
              </Card>
            </div>
          )}

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="strategies">Growth Strategies</TabsTrigger>
              <TabsTrigger value="testing">A/B Testing</TabsTrigger>
              <TabsTrigger value="optimization">Optimization</TabsTrigger>
            </TabsList>

            <TabsContent value="strategies" className="space-y-6">
              {/* Growth Strategies */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Growth Strategies</h3>
                <Button onClick={optimizeGrowth} disabled={isOptimizing}>
                  {isOptimizing ? (
                    <>
                      <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                      Optimizing...
                    </>
                  ) : (
                    <>
                      <Rocket className="w-4 h-4 mr-2" />
                      Optimize Growth
                    </>
                  )}
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {growthStrategies.map((strategy) => (
                  <Card key={strategy.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{strategy.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{strategy.description}</p>
                      </div>
                      <Badge className={getDifficultyColor(strategy.difficulty)}>
                        {strategy.difficulty}
                      </Badge>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Estimated Growth</span>
                        <span className="font-medium text-green-600">+{strategy.estimatedGrowth}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Time to Implement</span>
                        <span className="font-medium">{strategy.timeToImplement}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600">Status</span>
                        <Badge className={getStatusColor(strategy.status)}>
                          {strategy.status.replace("_", " ")}
                        </Badge>
          </div>
        </div>

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        <Play className="w-4 h-4 mr-2" />
                        Start
                      </Button>
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="testing" className="space-y-6">
              {/* A/B Testing */}
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">A/B Testing</h3>
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Create New Test
                </Button>
              </div>

              <div className="space-y-6">
                {abTests.map((test) => (
                  <Card key={test.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h4 className="font-semibold text-gray-900">{test.name}</h4>
                        <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                      </div>
                      <Badge className={getTestStatusColor(test.status)}>
                        {test.status}
                      </Badge>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Variant A */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Variant A</h5>
                        <p className="text-sm text-gray-600 mb-3">{test.variantA}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Views</span>
                            <span className="font-medium">{test.results.variantA.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Engagement</span>
                            <span className="font-medium">{test.results.variantA.engagement}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversions</span>
                            <span className="font-medium">{test.results.variantA.conversions}</span>
                          </div>
                        </div>
                      </div>

                      {/* Variant B */}
                      <div className="p-4 border border-gray-200 rounded-lg">
                        <h5 className="font-medium text-gray-900 mb-2">Variant B</h5>
                        <p className="text-sm text-gray-600 mb-3">{test.variantB}</p>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Views</span>
                            <span className="font-medium">{test.results.variantB.views.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Engagement</span>
                            <span className="font-medium">{test.results.variantB.engagement}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Conversions</span>
                            <span className="font-medium">{test.results.variantB.conversions}</span>
                          </div>
                        </div>
                      </div>
            </div>

                    {test.winner && (
                      <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-green-600" />
                          <span className="font-medium text-green-800">
                            Winner: Variant {test.winner}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className="mt-4 flex gap-2">
                      <Button variant="outline" size="sm">
                        <BarChart3 className="w-4 h-4 mr-2" />
                        View Details
                      </Button>
                      <Button variant="outline" size="sm">
                        <Edit3 className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button variant="outline" size="sm">
                        {test.status === "running" ? (
                          <>
                            <Pause className="w-4 h-4 mr-2" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="w-4 h-4 mr-2" />
                            Resume
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="optimization" className="space-y-6">
              {/* Growth Optimization Tools */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <Zap className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Viral Hook Optimizer</h3>
                      <p className="text-sm text-gray-600">Optimize your content hooks</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    AI analyzes successful content patterns to create compelling hooks that grab attention in the first 3 seconds.
                  </p>
                  <Button className="w-full">
                    <Brain className="w-4 h-4 mr-2" />
                    Optimize Hooks
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-green-100 rounded-lg">
                      <Target className="w-5 h-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Smart Hashtags</h3>
                      <p className="text-sm text-gray-600">Research trending hashtags</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Intelligent hashtag research and optimization to maximize discoverability and reach the right audience.
                  </p>
                  <Button className="w-full">
                    <Search className="w-4 h-4 mr-2" />
                    Find Hashtags
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                      <TestTube className="w-5 h-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">A/B Testing</h3>
                      <p className="text-sm text-gray-600">Test content variations</p>
                    </div>
            </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Test different content variations to find what works best for your audience and optimize performance.
                  </p>
                  <Button className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Test
                  </Button>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="p-2 bg-orange-100 rounded-lg">
                      <Activity className="w-5 h-5 text-orange-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Engagement Optimizer</h3>
                      <p className="text-sm text-gray-600">Boost interaction rates</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    Optimize your content for maximum engagement and interaction with your audience.
                  </p>
                  <Button className="w-full">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    Optimize Engagement
                  </Button>
                </Card>
              </div>

              {/* Performance Insights */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Insights</h3>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-8 h-8 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Growth Rate</h4>
                    <p className="text-2xl font-bold text-blue-600">+12.5%</p>
                    <p className="text-sm text-gray-600">This month</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Heart className="w-8 h-8 text-green-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Engagement Rate</h4>
                    <p className="text-2xl font-bold text-green-600">4.2%</p>
                    <p className="text-sm text-gray-600">Above average</p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-8 h-8 text-purple-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900">Viral Score</h4>
                    <p className="text-2xl font-bold text-purple-600">78%</p>
                    <p className="text-sm text-gray-600">Good potential</p>
            </div>
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
