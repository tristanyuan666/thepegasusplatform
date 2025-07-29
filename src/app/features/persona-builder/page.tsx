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
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Brain,
  User,
  Palette,
  Target,
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
  Palette as PaletteIcon,
  UserCheck,
  Users as UsersIcon,
  MessageSquare,
  Hash,
  Tag,
  BookOpen,
  Mic,
  Camera as CameraIcon,
  Video as VideoIcon,
  Image as ImageIcon,
  FileText as FileTextIcon,
  Music,
  Gamepad2,
  Coffee,
  Car,
  Home,
  Briefcase,
  GraduationCap,
  Heart as HeartIcon,
  ShoppingBag,
  Utensils,
  Plane,
  Car as CarIcon,
  Bike,
  Dumbbell,
  Yoga,
  BookOpen as BookOpenIcon,
  PenTool,
  Code,
  Paintbrush,
  Camera as CameraIcon2,
  Video as VideoIcon2,
  Mic as MicIcon,
  Type,
  Bold,
  Italic,
  Underline,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Link,
  Image as ImageIcon2,
  Palette as PaletteIcon2,
  Droplets,
  Sun,
  Moon,
  Star as StarIcon,
  Sparkles as SparklesIcon,
} from "lucide-react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface Persona {
  id: string;
  name: string;
  description: string;
  niche: string;
  targetAudience: string;
  brandVoice: string;
  visualStyle: string;
  contentThemes: string[];
  hashtags: string[];
  competitors: string[];
  uniqueValue: string;
  brandColors: string[];
  typography: string;
  completion: number;
  createdAt: string;
  updatedAt: string;
}

interface NicheOption {
  id: string;
  name: string;
  description: string;
  icon: any;
  difficulty: "easy" | "medium" | "hard";
  marketSize: string;
  competition: "low" | "medium" | "high";
  growthPotential: number;
}

interface BrandElement {
  id: string;
  name: string;
  type: "color" | "font" | "style" | "voice";
  value: string;
  description: string;
}

export default function PersonaBuilderPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);
  const [selectedNiche, setSelectedNiche] = useState<string>("");
  const [isBuilding, setIsBuilding] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("builder");
  const [currentStep, setCurrentStep] = useState(1);

  const supabase = createClient();

  useEffect(() => {
    checkUser();
    loadPersonas();
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

  const loadPersonas = async () => {
    try {
      // Mock data for demonstration
      const mockPersonas: Persona[] = [
        {
          id: "1",
          name: "The Wellness Warrior",
          description: "A fitness and wellness creator focused on helping people transform their lives through healthy habits and mindful living.",
          niche: "Health & Wellness",
          targetAudience: "Young professionals aged 25-35 interested in fitness, mental health, and work-life balance",
          brandVoice: "Motivational, authentic, and supportive",
          visualStyle: "Clean, bright, and energetic with natural lighting",
          contentThemes: ["Morning routines", "Workout tips", "Mental health", "Healthy recipes", "Work-life balance"],
          hashtags: ["#wellnesswarrior", "#healthyhabits", "#mindfulmornings", "#fitnessmotivation", "#worklifebalance"],
          competitors: ["@fitnessguru", "@wellnesscoach", "@healthylifestyle"],
          uniqueValue: "Combines fitness with mental wellness and practical lifestyle tips for busy professionals",
          brandColors: ["#4F46E5", "#10B981", "#F59E0B", "#EF4444"],
          typography: "Modern sans-serif with bold headings",
          completion: 85,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        {
          id: "2",
          name: "The Tech Explorer",
          description: "A tech enthusiast sharing the latest in AI, productivity tools, and digital transformation for entrepreneurs.",
          niche: "Technology",
          targetAudience: "Entrepreneurs and professionals aged 30-45 interested in AI, productivity, and business growth",
          brandVoice: "Professional, innovative, and forward-thinking",
          visualStyle: "Modern, tech-focused with blue and dark themes",
          contentThemes: ["AI tools", "Productivity hacks", "Business growth", "Tech reviews", "Digital transformation"],
          hashtags: ["#techexplorer", "#aitools", "#productivity", "#businessgrowth", "#digitaltransformation"],
          competitors: ["@techguru", "@productivityexpert", "@aienthusiast"],
          uniqueValue: "Focuses on practical AI applications and productivity tools for business growth",
          brandColors: ["#1E40AF", "#3B82F6", "#6366F1", "#8B5CF6"],
          typography: "Clean tech fonts with data visualization",
          completion: 72,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ];
      setPersonas(mockPersonas);
    } catch (error) {
      console.error("Error loading personas:", error);
    }
  };

  const niches: NicheOption[] = [
    {
      id: "health-wellness",
      name: "Health & Wellness",
      description: "Fitness, nutrition, mental health, and lifestyle",
      icon: HeartIcon,
      difficulty: "medium",
      marketSize: "Large",
      competition: "high",
      growthPotential: 85,
    },
    {
      id: "technology",
      name: "Technology",
      description: "AI, productivity, software, and digital tools",
      icon: Code,
      difficulty: "hard",
      marketSize: "Very Large",
      competition: "high",
      growthPotential: 90,
    },
    {
      id: "lifestyle",
      name: "Lifestyle",
      description: "Personal development, travel, and daily life",
      icon: Coffee,
      difficulty: "easy",
      marketSize: "Large",
      competition: "medium",
      growthPotential: 75,
    },
    {
      id: "business",
      name: "Business & Entrepreneurship",
      description: "Startups, marketing, and business growth",
      icon: Briefcase,
      difficulty: "medium",
      marketSize: "Large",
      competition: "high",
      growthPotential: 80,
    },
    {
      id: "education",
      name: "Education",
      description: "Learning, skills, and knowledge sharing",
      icon: GraduationCap,
      difficulty: "medium",
      marketSize: "Medium",
      competition: "medium",
      growthPotential: 70,
    },
    {
      id: "entertainment",
      name: "Entertainment",
      description: "Gaming, movies, and pop culture",
      icon: Gamepad2,
      difficulty: "easy",
      marketSize: "Very Large",
      competition: "high",
      growthPotential: 85,
    },
  ];

  const brandElements: BrandElement[] = [
    {
      id: "1",
      name: "Primary Color",
      type: "color",
      value: "#4F46E5",
      description: "Main brand color for headers and CTAs",
    },
    {
      id: "2",
      name: "Secondary Color",
      type: "color",
      value: "#10B981",
      description: "Accent color for highlights and success states",
    },
    {
      id: "3",
      name: "Typography",
      type: "font",
      value: "Inter",
      description: "Modern sans-serif for clean, professional look",
    },
    {
      id: "4",
      name: "Brand Voice",
      type: "voice",
      value: "Authentic & Motivational",
      description: "Warm, encouraging, and relatable tone",
    },
  ];

  const buildPersona = async () => {
    setIsBuilding(true);
    setError(null);
    setSuccess(null);

    try {
      // Simulate persona building process
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const newPersona: Persona = {
        id: Date.now().toString(),
        name: "New Persona",
        description: "Your unique creator identity",
        niche: selectedNiche || "General",
        targetAudience: "Your ideal audience",
        brandVoice: "Your authentic voice",
        visualStyle: "Your visual aesthetic",
        contentThemes: ["Theme 1", "Theme 2", "Theme 3"],
        hashtags: ["#yourbrand", "#yourniche", "#authentic"],
        competitors: ["Competitor 1", "Competitor 2"],
        uniqueValue: "Your unique value proposition",
        brandColors: ["#4F46E5", "#10B981"],
        typography: "Modern sans-serif",
        completion: 25,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      setPersonas((prev) => [newPersona, ...prev]);
      setCurrentPersona(newPersona);
      setSuccess("Persona created successfully!");
    } catch (error) {
      console.error("Error building persona:", error);
      setError("Failed to build persona. Please try again.");
    } finally {
      setIsBuilding(false);
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

  const getCompetitionColor = (competition: string) => {
    switch (competition) {
      case "low":
        return "bg-green-100 text-green-800";
      case "medium":
        return "bg-yellow-100 text-yellow-800";
      case "high":
        return "bg-red-100 text-red-800";
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
              <Brain className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Persona Builder
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Build Your Creator{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Identity
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Create a unique and authentic creator persona that resonates with
              your target audience and stands out in your niche.
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
              <TabsTrigger value="builder">Persona Builder</TabsTrigger>
              <TabsTrigger value="niches">Niche Explorer</TabsTrigger>
              <TabsTrigger value="branding">Brand Identity</TabsTrigger>
            </TabsList>

            <TabsContent value="builder" className="space-y-6">
              {/* Persona Builder */}
              <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                  <Card className="p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold text-gray-900">Create Your Persona</h3>
                      <Button onClick={buildPersona} disabled={isBuilding}>
                        {isBuilding ? (
                          <>
                            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                            Building...
                          </>
                        ) : (
                          <>
                            <Plus className="w-4 h-4 mr-2" />
                            Build New Persona
                          </>
                        )}
                      </Button>
                    </div>

                    {/* Step Progress */}
                    <div className="mb-6">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{currentStep}/4 steps</span>
                      </div>
                      <Progress value={(currentStep / 4) * 100} className="w-full" />
                    </div>

                    {/* Step Content */}
                    <div className="space-y-6">
                      {currentStep === 1 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Step 1: Choose Your Niche</h4>
                          <p className="text-gray-600">Select a niche that aligns with your interests and has growth potential.</p>
                          <div className="grid md:grid-cols-2 gap-4">
                            {niches.slice(0, 4).map((niche) => {
                              const Icon = niche.icon;
                              return (
                                <button
                                  key={niche.id}
                                  onClick={() => setSelectedNiche(niche.id)}
                                  className={`p-4 border rounded-lg text-left transition-all ${
                                    selectedNiche === niche.id
                                      ? "border-blue-500 bg-blue-50"
                                      : "border-gray-200 hover:border-gray-300"
                                  }`}
                                >
                                  <div className="flex items-center gap-3 mb-2">
                                    <Icon className="w-5 h-5 text-blue-600" />
                                    <h5 className="font-medium">{niche.name}</h5>
                                  </div>
                                  <p className="text-sm text-gray-600 mb-2">{niche.description}</p>
                                  <div className="flex gap-2">
                                    <Badge className={getDifficultyColor(niche.difficulty)}>
                                      {niche.difficulty}
                                    </Badge>
                                    <Badge className={getCompetitionColor(niche.competition)}>
                                      {niche.competition} competition
                                    </Badge>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      )}

                      {currentStep === 2 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Step 2: Define Your Audience</h4>
                          <p className="text-gray-600">Describe your ideal audience to create content that resonates.</p>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="audience-age">Age Range</Label>
                              <Input id="audience-age" placeholder="e.g., 25-35" />
                            </div>
                            <div>
                              <Label htmlFor="audience-interests">Interests</Label>
                              <Input id="audience-interests" placeholder="e.g., fitness, technology, business" />
                            </div>
                            <div>
                              <Label htmlFor="audience-pain-points">Pain Points</Label>
                              <Textarea id="audience-pain-points" placeholder="What problems does your audience face?" />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 3 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Step 3: Develop Your Brand Voice</h4>
                          <p className="text-gray-600">Define how you want to communicate with your audience.</p>
                          <div className="space-y-4">
                            <div>
                              <Label htmlFor="brand-voice">Brand Voice</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your brand voice" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="authentic">Authentic & Relatable</SelectItem>
                                  <SelectItem value="professional">Professional & Authoritative</SelectItem>
                                  <SelectItem value="energetic">Energetic & Motivational</SelectItem>
                                  <SelectItem value="casual">Casual & Friendly</SelectItem>
                                  <SelectItem value="educational">Educational & Informative</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                            <div>
                              <Label htmlFor="unique-value">Unique Value Proposition</Label>
                              <Textarea id="unique-value" placeholder="What makes you different from others in your niche?" />
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 4 && (
                        <div className="space-y-4">
                          <h4 className="text-lg font-semibold text-gray-900">Step 4: Visual Identity</h4>
                          <p className="text-gray-600">Choose your brand colors and visual style.</p>
                          <div className="space-y-4">
                            <div>
                              <Label>Brand Colors</Label>
                              <div className="flex gap-2 mt-2">
                                {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map((color) => (
                                  <button
                                    key={color}
                                    className="w-8 h-8 rounded-full border-2 border-gray-200 hover:border-gray-300"
                                    style={{ backgroundColor: color }}
                                  />
                                ))}
                              </div>
                            </div>
                            <div>
                              <Label htmlFor="visual-style">Visual Style</Label>
                              <Select>
                                <SelectTrigger>
                                  <SelectValue placeholder="Select your visual style" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="clean">Clean & Minimal</SelectItem>
                                  <SelectItem value="bold">Bold & Vibrant</SelectItem>
                                  <SelectItem value="natural">Natural & Organic</SelectItem>
                                  <SelectItem value="modern">Modern & Tech</SelectItem>
                                  <SelectItem value="vintage">Vintage & Retro</SelectItem>
                                </SelectContent>
                              </Select>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Navigation */}
                      <div className="flex justify-between pt-4">
                        <Button
                          variant="outline"
                          onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                          disabled={currentStep === 1}
                        >
                          Previous
                        </Button>
                        <Button
                          onClick={() => {
                            if (currentStep < 4) {
                              setCurrentStep(currentStep + 1);
                            } else {
                              buildPersona();
                            }
                          }}
                        >
                          {currentStep === 4 ? "Create Persona" : "Next"}
                        </Button>
                      </div>
                    </div>
                  </Card>
                </div>

                <div className="space-y-6">
                  {/* Quick Tips */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Tips</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Lightbulb className="w-5 h-5 text-yellow-600 mt-0.5" />
                        <p className="text-sm text-gray-600">Choose a niche you're passionate about</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Target className="w-5 h-5 text-blue-600 mt-0.5" />
                        <p className="text-sm text-gray-600">Be specific about your target audience</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <User className="w-5 h-5 text-green-600 mt-0.5" />
                        <p className="text-sm text-gray-600">Stay authentic to your true self</p>
                      </div>
                      <div className="flex items-start gap-3">
                        <Palette className="w-5 h-5 text-purple-600 mt-0.5" />
                        <p className="text-sm text-gray-600">Consistency is key for brand recognition</p>
                      </div>
                    </div>
                  </Card>

                  {/* Persona Stats */}
                  <Card className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Personas</h3>
                    <div className="space-y-3">
                      {personas.map((persona) => (
                        <div key={persona.id} className="p-3 border border-gray-200 rounded-lg">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium text-gray-900">{persona.name}</h4>
                            <Badge variant="outline">{persona.completion}%</Badge>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{persona.description}</p>
                          <div className="flex items-center gap-2">
                            <Button variant="ghost" size="sm">
                              <Edit3 className="w-4 h-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Eye className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="niches" className="space-y-6">
              {/* Niche Explorer */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Explore Niches</h3>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {niches.map((niche) => {
                    const Icon = niche.icon;
                    return (
                      <Card key={niche.id} className="p-6 hover:shadow-lg transition-all">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-blue-100 rounded-lg">
                            <Icon className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">{niche.name}</h4>
                            <p className="text-sm text-gray-600">{niche.description}</p>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Market Size</span>
                            <span className="font-medium">{niche.marketSize}</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Growth Potential</span>
                            <span className="font-medium text-green-600">{niche.growthPotential}%</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Difficulty</span>
                            <Badge className={getDifficultyColor(niche.difficulty)}>
                              {niche.difficulty}
                            </Badge>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Competition</span>
                            <Badge className={getCompetitionColor(niche.competition)}>
                              {niche.competition}
                            </Badge>
                          </div>
                        </div>

                        <Button className="w-full mt-4">
                          <Target className="w-4 h-4 mr-2" />
                          Select Niche
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="branding" className="space-y-6">
              {/* Brand Identity Tools */}
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Elements</h3>
                  <div className="space-y-4">
                    {brandElements.map((element) => (
                      <div key={element.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div>
                          <h4 className="font-medium">{element.name}</h4>
                          <p className="text-sm text-gray-600">{element.description}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          {element.type === "color" && (
                            <div
                              className="w-6 h-6 rounded-full border border-gray-200"
                              style={{ backgroundColor: element.value }}
                            />
                          )}
                          <span className="text-sm font-medium">{element.value}</span>
                          <Button variant="ghost" size="sm">
                            <Edit3 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                <Card className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Visual Style Guide</h3>
                  <div className="space-y-4">
                    <div>
                      <Label>Typography</Label>
                      <div className="mt-2 space-y-2">
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <h4 className="text-lg font-bold">Heading Font</h4>
                          <p className="text-sm text-gray-600">Inter Bold - 24px</p>
                        </div>
                        <div className="p-3 border border-gray-200 rounded-lg">
                          <h4 className="text-base font-medium">Body Font</h4>
                          <p className="text-sm text-gray-600">Inter Regular - 16px</p>
                        </div>
                      </div>
                    </div>

                    <div>
                      <Label>Color Palette</Label>
                      <div className="flex gap-2 mt-2">
                        {["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"].map((color) => (
                          <div key={color} className="text-center">
                            <div
                              className="w-12 h-12 rounded-lg border border-gray-200 mb-1"
                              style={{ backgroundColor: color }}
                            />
                            <p className="text-xs text-gray-600">{color}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Content Themes */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Content Themes</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {[
                    { name: "Educational", icon: BookOpen, color: "blue" },
                    { name: "Entertainment", icon: Video, color: "purple" },
                    { name: "Inspirational", icon: Sparkles, color: "yellow" },
                    { name: "Behind the Scenes", icon: Camera, color: "green" },
                    { name: "Tutorial", icon: Play, color: "red" },
                    { name: "Q&A", icon: MessageSquare, color: "indigo" },
                  ].map((theme) => {
                    const Icon = theme.icon;
                    return (
                      <div key={theme.name} className="p-4 border border-gray-200 rounded-lg text-center">
                        <div className={`w-12 h-12 bg-${theme.color}-100 rounded-lg flex items-center justify-center mx-auto mb-3`}>
                          <Icon className={`w-6 h-6 text-${theme.color}-600`} />
                        </div>
                        <h4 className="font-medium text-gray-900">{theme.name}</h4>
                      </div>
                    );
                  })}
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
