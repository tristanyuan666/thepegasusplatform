"use client";

import { Video, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function TikTokIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="TikTok Integration"
      featureDescription="Connect your TikTok account and unlock powerful tools for video creation, trending analysis, and audience growth. Manage your TikTok presence professionally with our comprehensive suite of features."
      requiredPlan="influencer"
      icon={<Video className="w-6 h-6 text-white" />}
      platform="tiktok"
      features={[
        {
          title: "Trend Analysis",
          description: "Identify trending sounds, hashtags, and challenges before they peak",
          icon: <TrendingUp className="w-8 h-8 text-pink-600" />
        },
        {
          title: "Video Performance Analytics",
          description: "Track views, likes, shares, and engagement with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Hashtag Optimization",
          description: "AI-powered hashtag suggestions to increase your video reach",
          icon: <Target className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Content Scheduling",
          description: "Schedule TikTok videos at optimal times for maximum engagement",
          icon: <Camera className="w-8 h-8 text-green-600" />
        },
        {
          title: "Audience Insights",
          description: "Understand your TikTok audience demographics and behavior patterns",
          icon: <Users className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Viral Prediction",
          description: "Predict which videos have the highest potential to go viral",
          icon: <Sparkles className="w-8 h-8 text-indigo-600" />
        }
      ]}
      benefits={[
        {
          title: "Viral Success",
          description: "Create content that has higher potential to go viral",
          stat: "8x"
        },
        {
          title: "Faster Growth",
          description: "Grow your TikTok following with trend-driven content",
          stat: "6x"
        },
        {
          title: "Higher Engagement",
          description: "Increase engagement with optimized content strategies",
          stat: "73%"
        }
      ]}
    />
  );
}
