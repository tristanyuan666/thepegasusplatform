"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import {
  Sparkles, Wand2, Brain, Target, Users, Clock, Star, TrendingUp, 
  Copy, Eye, CheckCircle, AlertCircle, RefreshCw, FileText, Video,
  Camera, MessageCircle, Play, Globe, Zap, Crown, Save, Send,
  Calendar, BarChart3, Rocket, Lightbulb, Timer
} from "lucide-react";
import AdvancedContentGenerator from "./advanced-content-generator";
import AdvancedContentIdeas from "./advanced-content-ideas";
import AdvancedContentScheduler from "./advanced-content-scheduler";

interface PremiumContentHubProps {
  userProfile: any;
  platformConnections: any[];
  featureAccess: any;
}

export default function PremiumContentHub({
  userProfile,
  platformConnections,
  featureAccess
}: PremiumContentHubProps) {
  const [activeTab, setActiveTab] = useState("create");
  const [isLoading, setIsLoading] = useState(false);

  // Check if user has access to premium features
  const hasPremiumAccess = featureAccess?.premiumFeatures || false;

  if (!hasPremiumAccess) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
              <Crown className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
                Premium Content Hub
              </h1>
              <p className="text-slate-600 font-medium">Unlock advanced AI-powered content creation tools</p>
            </div>
          </div>
        </div>

        <Card className="p-8 text-center">
          <Crown className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Upgrade to Premium</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Get access to advanced AI content generation, viral content ideas, smart scheduling, 
            and real-time analytics to supercharge your social media presence.
          </p>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg">
                <Brain className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">AI Content Generator</h3>
                <p className="text-sm text-gray-600">Advanced AI that creates unique, viral content</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg">
                <Lightbulb className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Content Ideas</h3>
                <p className="text-sm text-gray-600">Generate trending content ideas with AI</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg">
                <Timer className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h3 className="font-semibold text-gray-900 mb-1">Smart Scheduling</h3>
                <p className="text-sm text-gray-600">AI-optimized posting times</p>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold py-3 px-8 rounded-xl">
              <Crown className="w-5 h-5 mr-2" />
              Upgrade to Premium
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-600 via-purple-700 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/25">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 bg-clip-text text-transparent">
              Premium Content Hub
            </h1>
            <p className="text-slate-600 font-medium">Advanced AI-powered content creation and management</p>
          </div>
        </div>
      </div>

      {/* Feature Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">AI Content Generator</h3>
              <p className="text-sm text-gray-600">Create viral content with advanced AI</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
              <Lightbulb className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Content Ideas</h3>
              <p className="text-sm text-gray-600">Generate trending content ideas</p>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <Timer className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Smart Scheduling</h3>
              <p className="text-sm text-gray-600">AI-optimized posting times</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create" className="flex items-center gap-2">
            <Brain className="w-4 h-4" />
            Create
          </TabsTrigger>
          <TabsTrigger value="ideas" className="flex items-center gap-2">
            <Lightbulb className="w-4 h-4" />
            Ideas
          </TabsTrigger>
          <TabsTrigger value="schedule" className="flex items-center gap-2">
            <Timer className="w-4 h-4" />
            Schedule
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          <AdvancedContentGenerator 
            userProfile={userProfile}
            platformConnections={platformConnections}
          />
        </TabsContent>

        <TabsContent value="ideas" className="space-y-6">
          <AdvancedContentIdeas 
            userProfile={userProfile}
            platformConnections={platformConnections}
          />
        </TabsContent>

        <TabsContent value="schedule" className="space-y-6">
          <AdvancedContentScheduler 
            userProfile={userProfile}
            platformConnections={platformConnections}
          />
        </TabsContent>
      </Tabs>

      {/* Quick Stats */}
      <Card className="p-6 bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-purple-600" />
            Content Performance Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">15</div>
              <div className="text-sm text-gray-600">Content Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">8</div>
              <div className="text-sm text-gray-600">Scheduled Posts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">12</div>
              <div className="text-sm text-gray-600">Saved Ideas</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">95%</div>
              <div className="text-sm text-gray-600">Avg Viral Score</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tips Section */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-600" />
            Pro Tips for Maximum Impact
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <Target className="w-4 h-4 text-blue-600" />
                Content Creation
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Use specific, actionable content descriptions</li>
                <li>• Target your ideal audience persona</li>
                <li>• Include psychological triggers in your content</li>
                <li>• Test different tones and styles</li>
              </ul>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-green-600" />
                Optimization
              </h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Schedule posts during peak engagement hours</li>
                <li>• Use platform-specific hashtags</li>
                <li>• Monitor viral scores and adjust strategy</li>
                <li>• A/B test different content formats</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 