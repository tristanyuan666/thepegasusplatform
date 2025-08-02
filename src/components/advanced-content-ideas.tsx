"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Lightbulb, Sparkles, TrendingUp, Target, Users, Clock, Star, 
  Copy, Eye, CheckCircle, AlertCircle, RefreshCw, FileText, Video,
  Camera, MessageCircle, Play, Globe, Zap, Crown, Save, Send,
  Calendar, BarChart3, Brain, Rocket
} from "lucide-react";

interface ContentIdea {
  id: string;
  title: string;
  description: string;
  platform: string;
  contentType: string;
  viralScore: number;
  estimatedViews: string;
  hashtags: string[];
  targetAudience: string;
  contentCategory: string;
  trendingTopics: string[];
  psychologicalTriggers: string[];
  createdAt: string;
  status: "draft" | "scheduled" | "published";
}

interface AdvancedContentIdeasProps {
  userProfile: any;
  platformConnections: any[];
}

export default function AdvancedContentIdeas({
  userProfile,
  platformConnections
}: AdvancedContentIdeasProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [targetAudience, setTargetAudience] = useState("all");
  const [generatedIdeas, setGeneratedIdeas] = useState<ContentIdea[]>([]);
  const [savedIdeas, setSavedIdeas] = useState<ContentIdea[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("generate");

  // Advanced Content Ideas Generation
  const generateAdvancedIdeas = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      // Simulate advanced AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      const platformData = getPlatformData(selectedPlatform);
      const audienceData = getAudienceData(targetAudience);
      const categoryData = getCategoryData(selectedCategory);

      // Generate unique content ideas based on parameters
      const ideas: ContentIdea[] = Array.from({ length: 5 }, (_, index) => {
        const idea = generateUniqueIdea(index, platformData, audienceData, categoryData);
        return {
          ...idea,
          id: `idea_${Date.now()}_${index}`,
          createdAt: new Date().toISOString(),
          status: "draft" as const
        };
      });

      setGeneratedIdeas(ideas);
      setSuccess(`Generated ${ideas.length} unique content ideas!`);
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error("Error generating ideas:", error);
      setError("Failed to generate ideas. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Platform-specific data
  const getPlatformData = (platform: string) => {
    const platformData = {
      instagram: {
        trendingTopics: ['lifestyle', 'fitness', 'food', 'travel', 'fashion', 'beauty', 'motivation', 'business'],
        contentTypes: ['post', 'story', 'reel', 'carousel'],
        viralElements: ['before_after', 'transformation', 'behind_scenes', 'tips_tricks'],
        engagementStyle: 'visual',
        bestPostingTimes: ['09:00', '12:00', '18:00', '21:00']
      },
      tiktok: {
        trendingTopics: ['dance', 'comedy', 'education', 'lifestyle', 'challenges', 'tutorial', 'storytime', 'trending'],
        contentTypes: ['video', 'duet', 'stitch'],
        viralElements: ['trending_sounds', 'challenges', 'storytime', 'tutorial'],
        engagementStyle: 'entertaining',
        bestPostingTimes: ['19:00', '20:00', '21:00', '22:00']
      },
      youtube: {
        trendingTopics: ['tutorial', 'review', 'vlog', 'educational', 'entertainment', 'gaming', 'tech', 'lifestyle'],
        contentTypes: ['video', 'short', 'live'],
        viralElements: ['tutorial', 'review', 'story', 'challenge'],
        engagementStyle: 'educational',
        bestPostingTimes: ['15:00', '16:00', '17:00', '18:00']
      },
      x: {
        trendingTopics: ['news', 'politics', 'technology', 'business', 'sports', 'entertainment', 'crypto', 'ai'],
        contentTypes: ['tweet', 'thread', 'poll'],
        viralElements: ['hot_take', 'thread', 'poll', 'news'],
        engagementStyle: 'conversational',
        bestPostingTimes: ['12:00', '13:00', '14:00', '15:00']
      },
      linkedin: {
        trendingTopics: ['business', 'career', 'leadership', 'networking', 'industry', 'professional_development', 'entrepreneurship'],
        contentTypes: ['post', 'article', 'poll'],
        viralElements: ['career_advice', 'industry_insights', 'leadership_tips', 'networking'],
        engagementStyle: 'professional',
        bestPostingTimes: ['08:00', '09:00', '10:00', '11:00']
      },
      facebook: {
        trendingTopics: ['community', 'family', 'entertainment', 'news', 'local', 'events', 'groups', 'memories'],
        contentTypes: ['post', 'story', 'video', 'poll'],
        viralElements: ['community', 'family', 'memories', 'events'],
        engagementStyle: 'social',
        bestPostingTimes: ['18:00', '19:00', '20:00', '21:00']
      },
      all: {
        trendingTopics: ['lifestyle', 'business', 'entertainment', 'education', 'motivation', 'trending', 'viral'],
        contentTypes: ['post', 'video', 'story'],
        viralElements: ['transformation', 'tips', 'story', 'trending'],
        engagementStyle: 'mixed',
        bestPostingTimes: ['12:00', '18:00', '20:00']
      }
    };

    return platformData[platform as keyof typeof platformData] || platformData.all;
  };

  // Audience data
  const getAudienceData = (audience: string) => {
    const audienceData = {
      general: {
        interests: ['lifestyle', 'entertainment', 'general'],
        ageRange: '18-65',
        engagementStyle: 'passive',
        contentPreferences: ['entertaining', 'informative', 'relatable']
      },
      professionals: {
        interests: ['business', 'career', 'networking', 'professional_development'],
        ageRange: '25-55',
        engagementStyle: 'active',
        contentPreferences: ['educational', 'professional', 'insightful']
      },
      creators: {
        interests: ['content', 'creativity', 'social_media', 'trending'],
        ageRange: '18-35',
        engagementStyle: 'very_active',
        contentPreferences: ['trendy', 'creative', 'viral']
      },
      entrepreneurs: {
        interests: ['business', 'startup', 'growth', 'entrepreneurship'],
        ageRange: '25-45',
        engagementStyle: 'active',
        contentPreferences: ['motivational', 'educational', 'actionable']
      },
      students: {
        interests: ['education', 'lifestyle', 'entertainment', 'study_tips'],
        ageRange: '16-25',
        engagementStyle: 'moderate',
        contentPreferences: ['relatable', 'entertaining', 'educational']
      },
      all: {
        interests: ['general', 'lifestyle', 'entertainment', 'education'],
        ageRange: '18-65',
        engagementStyle: 'mixed',
        contentPreferences: ['entertaining', 'informative', 'relatable']
      }
    };

    return audienceData[audience as keyof typeof audienceData] || audienceData.all;
  };

  // Category data
  const getCategoryData = (category: string) => {
    const categoryData = {
      educational: {
        contentTypes: ['tutorial', 'how_to', 'tips', 'guide'],
        viralElements: ['step_by_step', 'before_after', 'tips_tricks'],
        engagementStyle: 'informative',
        targetAudience: 'learners'
      },
      entertainment: {
        contentTypes: ['story', 'comedy', 'challenge', 'trending'],
        viralElements: ['humor', 'relatable', 'trending', 'challenge'],
        engagementStyle: 'entertaining',
        targetAudience: 'general'
      },
      motivational: {
        contentTypes: ['inspiration', 'transformation', 'success_story', 'mindset'],
        viralElements: ['transformation', 'success_story', 'motivation'],
        engagementStyle: 'inspirational',
        targetAudience: 'aspiring'
      },
      business: {
        contentTypes: ['tips', 'insights', 'case_study', 'strategy'],
        viralElements: ['industry_insights', 'tips_tricks', 'success_story'],
        engagementStyle: 'professional',
        targetAudience: 'professionals'
      },
      lifestyle: {
        contentTypes: ['daily_life', 'routine', 'tips', 'behind_scenes'],
        viralElements: ['relatable', 'behind_scenes', 'routine'],
        engagementStyle: 'relatable',
        targetAudience: 'general'
      },
      all: {
        contentTypes: ['mixed', 'various', 'trending'],
        viralElements: ['trending', 'relatable', 'entertaining'],
        engagementStyle: 'mixed',
        targetAudience: 'general'
      }
    };

    return categoryData[category as keyof typeof categoryData] || categoryData.all;
  };

  // Generate unique content idea
  const generateUniqueIdea = (index: number, platformData: any, audienceData: any, categoryData: any): Omit<ContentIdea, 'id' | 'createdAt' | 'status'> => {
    const ideaTemplates = [
      {
        title: "The [Topic] Secret That Changed Everything",
        description: "Reveal a game-changing insight about [topic] that most people miss",
        category: "educational",
        viralElements: ["transformation", "secret", "insight"]
      },
      {
        title: "How I [Achievement] in [Timeframe]",
        description: "Share your personal journey of achieving [achievement] in a specific timeframe",
        category: "motivational",
        viralElements: ["success_story", "transformation", "journey"]
      },
      {
        title: "[Number] [Topic] Tips That Actually Work",
        description: "Provide actionable tips about [topic] that you've personally tested",
        category: "educational",
        viralElements: ["tips_tricks", "actionable", "tested"]
      },
      {
        title: "The [Topic] Method Nobody Talks About",
        description: "Expose an overlooked approach to [topic] that delivers results",
        category: "educational",
        viralElements: ["secret", "overlooked", "results"]
      },
      {
        title: "Why [Common Belief] is Actually Wrong",
        description: "Challenge a common misconception about [topic] with evidence",
        category: "educational",
        viralElements: ["controversy", "debunk", "insight"]
      },
      {
        title: "The [Topic] Hack That Saves [Time/Money]",
        description: "Share a practical hack that helps people save time or money on [topic]",
        category: "tips",
        viralElements: ["hack", "savings", "practical"]
      },
      {
        title: "[Topic] - The Complete Guide",
        description: "Create a comprehensive guide covering all aspects of [topic]",
        category: "educational",
        viralElements: ["comprehensive", "guide", "complete"]
      },
      {
        title: "The Psychology Behind [Topic]",
        description: "Explore the psychological aspects of [topic] that drive behavior",
        category: "educational",
        viralElements: ["psychology", "insight", "behavior"]
      },
      {
        title: "[Topic] Mistakes That Cost You [Loss]",
        description: "Highlight common mistakes in [topic] and their consequences",
        category: "educational",
        viralElements: ["mistakes", "lessons", "avoidance"]
      },
      {
        title: "The [Topic] Formula for Success",
        description: "Present a proven formula or framework for achieving [topic]",
        category: "educational",
        viralElements: ["formula", "framework", "success"]
      }
    ];

    const template = ideaTemplates[index % ideaTemplates.length];
    const topic = getRandomTopic(platformData.trendingTopics);
    const platform = selectedPlatform === "all" ? getRandomPlatform() : selectedPlatform;
    const contentType = getRandomContentType(platformData.contentTypes);
    const viralScore = calculateViralScore(platformData, audienceData, categoryData);
    const estimatedViews = calculateEstimatedViews(viralScore, platformData);

    return {
      title: template.title.replace('[Topic]', topic).replace('[Achievement]', getRandomAchievement()).replace('[Timeframe]', getRandomTimeframe()).replace('[Number]', getRandomNumber()).replace('[Common Belief]', getRandomBelief()).replace('[Time/Money]', getRandomSavings()).replace('[Loss]', getRandomLoss()),
      description: template.description.replace('[topic]', topic),
      platform,
      contentType,
      viralScore,
      estimatedViews,
      hashtags: generateHashtags(topic, platform, template.viralElements),
      targetAudience: audienceData.interests[0],
      contentCategory: template.category,
      trendingTopics: [topic, ...platformData.trendingTopics.slice(0, 3)],
      psychologicalTriggers: generatePsychologicalTriggers(template.viralElements)
    };
  };

  // Helper functions
  const getRandomTopic = (topics: string[]) => {
    return topics[Math.floor(Math.random() * topics.length)];
  };

  const getRandomPlatform = () => {
    const platforms = ['instagram', 'tiktok', 'youtube', 'x', 'linkedin', 'facebook'];
    return platforms[Math.floor(Math.random() * platforms.length)];
  };

  const getRandomContentType = (contentTypes: string[]) => {
    return contentTypes[Math.floor(Math.random() * contentTypes.length)];
  };

  const getRandomAchievement = () => {
    const achievements = ['10x my income', 'built a 6-figure business', 'quit my 9-5 job', 'gained 100k followers', 'launched a successful product', 'became debt-free', 'started a profitable side hustle'];
    return achievements[Math.floor(Math.random() * achievements.length)];
  };

  const getRandomTimeframe = () => {
    const timeframes = ['30 days', '90 days', '6 months', '1 year', '3 months', '2 years'];
    return timeframes[Math.floor(Math.random() * timeframes.length)];
  };

  const getRandomNumber = () => {
    return Math.floor(Math.random() * 10) + 3;
  };

  const getRandomBelief = () => {
    const beliefs = ['you need a degree to succeed', 'overnight success is real', 'hard work always pays off', 'social media is easy money', 'you need money to make money'];
    return beliefs[Math.floor(Math.random() * beliefs.length)];
  };

  const getRandomSavings = () => {
    const savings = ['$500/month', '2 hours/day', '$1000/year', '5 hours/week', '$200/month'];
    return savings[Math.floor(Math.random() * savings.length)];
  };

  const getRandomLoss = () => {
    const losses = ['thousands of dollars', 'years of time', 'opportunities', 'clients', 'revenue'];
    return losses[Math.floor(Math.random() * losses.length)];
  };

  const calculateViralScore = (platformData: any, audienceData: any, categoryData: any) => {
    let baseScore = 75;

    // Platform optimization
    if (platformData.engagementStyle === 'entertaining') baseScore += 10;
    if (platformData.engagementStyle === 'educational') baseScore += 8;

    // Audience engagement
    if (audienceData.engagementStyle === 'very_active') baseScore += 8;
    if (audienceData.engagementStyle === 'active') baseScore += 5;

    // Category optimization
    if (categoryData.engagementStyle === 'inspirational') baseScore += 10;
    if (categoryData.engagementStyle === 'entertaining') baseScore += 8;

    // Add realistic randomness
    baseScore += Math.floor(Math.random() * 15) - 5;

    return Math.max(65, Math.min(95, Math.round(baseScore)));
  };

  const calculateEstimatedViews = (viralScore: number, platformData: any) => {
    const baseViews = 10000;
    const engagementMultiplier = viralScore / 100;
    const platformMultiplier = platformData.engagementStyle === 'entertaining' ? 1.3 : 1.0;
    
    const estimatedViews = baseViews * engagementMultiplier * platformMultiplier;
    return Math.floor(estimatedViews).toLocaleString();
  };

  const generateHashtags = (topic: string, platform: string, viralElements: string[]) => {
    const cleanTopic = topic.replace(/\s+/g, '');
    const platformHashtags = {
      instagram: ['viral', 'trending', 'lifestyle', 'inspiration', 'success', 'motivation'],
      tiktok: ['fyp', 'viral', 'trending', 'success', 'motivation', 'lifechanging'],
      youtube: ['viral', 'success', 'motivation', 'tutorial', 'educational'],
      x: ['viral', 'success', 'motivation', 'thread', 'insights'],
      linkedin: ['professional', 'success', 'business', 'leadership', 'career'],
      facebook: ['viral', 'success', 'motivation', 'community', 'lifechanging']
    };

    const baseHashtags = [cleanTopic, 'success', 'motivation'];
    const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.instagram;
    const viralHashtags = viralElements.map(element => element.replace('_', ''));
    
    return [...baseHashtags, ...platformSpecific, ...viralHashtags].slice(0, 8);
  };

  const generatePsychologicalTriggers = (viralElements: string[]) => {
    const triggers = ['scarcity', 'authority', 'social_proof', 'reciprocity', 'commitment', 'liking', 'urgency', 'fomo'];
    return triggers.slice(0, 4);
  };

  const handleSaveIdea = (idea: ContentIdea) => {
    setSavedIdeas(prev => [...prev, idea]);
    setSuccess("Idea saved successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleCopyIdea = (idea: ContentIdea) => {
    const ideaText = `${idea.title}\n\n${idea.description}\n\nPlatform: ${idea.platform}\nContent Type: ${idea.contentType}\nViral Score: ${idea.viralScore}%\nEstimated Views: ${idea.estimatedViews}\n\nHashtags: ${idea.hashtags.map(tag => `#${tag}`).join(' ')}`;
    navigator.clipboard.writeText(ideaText);
    setSuccess("Idea copied to clipboard!");
    setTimeout(() => setSuccess(null), 3000);
  };

  const handleDeleteIdea = (ideaId: string) => {
    setSavedIdeas(prev => prev.filter(idea => idea.id !== ideaId));
    setSuccess("Idea deleted successfully!");
    setTimeout(() => setSuccess(null), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Lightbulb className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
              Advanced Content Ideas Generator
            </h1>
            <p className="text-slate-600 font-medium">Generate unique, trending content ideas with AI-powered insights</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Parameters Card */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-purple-600" />
            Idea Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">🌐 All Platforms</SelectItem>
                  <SelectItem value="instagram">📸 Instagram</SelectItem>
                  <SelectItem value="tiktok">🎬 TikTok</SelectItem>
                  <SelectItem value="youtube">🎥 YouTube</SelectItem>
                  <SelectItem value="x">🐦 X (Twitter)</SelectItem>
                  <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                  <SelectItem value="facebook">📱 Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Category</Label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">📚 All Categories</SelectItem>
                  <SelectItem value="educational">🎓 Educational</SelectItem>
                  <SelectItem value="entertainment">🎭 Entertainment</SelectItem>
                  <SelectItem value="motivational">🔥 Motivational</SelectItem>
                  <SelectItem value="business">💼 Business</SelectItem>
                  <SelectItem value="lifestyle">🌟 Lifestyle</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">👥 All Audiences</SelectItem>
                  <SelectItem value="general">👤 General</SelectItem>
                  <SelectItem value="professionals">💼 Professionals</SelectItem>
                  <SelectItem value="creators">🎨 Creators</SelectItem>
                  <SelectItem value="entrepreneurs">🚀 Entrepreneurs</SelectItem>
                  <SelectItem value="students">🎓 Students</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateAdvancedIdeas}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-purple-600 via-purple-700 to-pink-600 hover:from-purple-700 hover:via-purple-800 hover:to-pink-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-purple-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                <span className="text-lg">Generating Advanced Ideas...</span>
              </>
            ) : (
              <>
                <Lightbulb className="w-5 h-5 mr-3" />
                <span className="text-lg">Generate Advanced Ideas</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Content Ideas Display */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="generate">Generated Ideas</TabsTrigger>
          <TabsTrigger value="saved">Saved Ideas</TabsTrigger>
        </TabsList>

        <TabsContent value="generate" className="space-y-4">
          {generatedIdeas.length > 0 ? (
            <div className="grid gap-4">
              {generatedIdeas.map((idea) => (
                <Card key={idea.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                        <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                          {idea.viralScore}% Viral
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{idea.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Platform</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.platform}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Content Type</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.contentType}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Estimated Views</Label>
                          <p className="text-sm text-gray-900">{idea.estimatedViews}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Category</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.contentCategory}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-500">Hashtags</Label>
                        <div className="flex flex-wrap gap-1">
                          {idea.hashtags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-2 mt-3">
                        <Label className="text-xs font-medium text-gray-500">Psychological Triggers</Label>
                        <div className="flex flex-wrap gap-1">
                          {idea.psychologicalTriggers.map((trigger, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                              {trigger}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleSaveIdea(idea)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button
                        onClick={() => handleCopyIdea(idea)}
                        variant="outline"
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Lightbulb className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ideas Generated Yet</h3>
              <p className="text-gray-600">Click "Generate Advanced Ideas" to create unique content ideas based on your parameters.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="saved" className="space-y-4">
          {savedIdeas.length > 0 ? (
            <div className="grid gap-4">
              {savedIdeas.map((idea) => (
                <Card key={idea.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h3 className="text-lg font-semibold text-gray-900">{idea.title}</h3>
                        <Badge className="bg-green-600 text-white">
                          Saved
                        </Badge>
                      </div>
                      <p className="text-gray-600 mb-4">{idea.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Platform</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.platform}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Content Type</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.contentType}</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Viral Score</Label>
                          <p className="text-sm text-gray-900">{idea.viralScore}%</p>
                        </div>
                        <div>
                          <Label className="text-xs font-medium text-gray-500">Category</Label>
                          <p className="text-sm text-gray-900 capitalize">{idea.contentCategory}</p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label className="text-xs font-medium text-gray-500">Hashtags</Label>
                        <div className="flex flex-wrap gap-1">
                          {idea.hashtags.map((tag, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              #{tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        onClick={() => handleCopyIdea(idea)}
                        size="sm"
                      >
                        <Copy className="w-4 h-4 mr-1" />
                        Copy
                      </Button>
                      <Button
                        onClick={() => handleDeleteIdea(idea.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <AlertCircle className="w-4 h-4 mr-1" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-8 text-center">
              <Save className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No Saved Ideas</h3>
              <p className="text-gray-600">Save ideas from the generated list to access them later.</p>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
} 