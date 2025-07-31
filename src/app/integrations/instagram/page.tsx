"use client";

import { Instagram, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function InstagramIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="Instagram Integration"
      featureDescription="Connect your Instagram account and unlock powerful tools for content scheduling, analytics, and audience growth. Manage your Instagram presence professionally with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Instagram className="w-6 h-6 text-white" />}
      platform="instagram"
      features={[
        {
          title: "Smart Content Scheduling",
          description: "Schedule posts at optimal times when your audience is most active",
          icon: <Camera className="w-8 h-8 text-pink-600" />
        },
        {
          title: "Advanced Analytics",
          description: "Track performance metrics, audience growth, and engagement rates with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Hashtag Optimization",
          description: "AI-powered hashtag suggestions that increase your post reach and discoverability",
          icon: <Target className="w-8 h-8 text-green-600" />
        },
        {
          title: "Engagement Automation",
          description: "Automatically respond to comments and messages to build stronger relationships",
          icon: <MessageCircle className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Content Performance Tracking",
          description: "Monitor which posts perform best and optimize your content strategy accordingly",
          icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Multi-Account Management",
          description: "Manage multiple Instagram accounts from one dashboard with ease",
          icon: <Users className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "3x Faster Growth",
          description: "Optimized posting schedules and content strategies accelerate your follower growth",
          stat: "3x"
        },
        {
          title: "Higher Engagement",
          description: "Smart automation and optimization tools boost your engagement rates significantly",
          stat: "67%"
        },
        {
          title: "Time Savings",
          description: "Automate routine tasks and focus on creating amazing content",
          stat: "5hrs/week"
        }
      ]}
    />
  );
}
