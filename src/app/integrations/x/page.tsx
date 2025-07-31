"use client";

import { MessageSquare, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function XIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="X Integration"
      featureDescription="Connect your X account and unlock powerful tools for post scheduling, analytics, and audience engagement. Manage your X presence professionally with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<MessageSquare className="w-6 h-6 text-white" />}
      platform="x"
      features={[
        {
          title: "Smart Post Scheduling",
          description: "Schedule posts at optimal times when your audience is most active",
          icon: <Camera className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Thread Management",
          description: "Create and schedule engaging post threads that drive conversation",
          icon: <FileText className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Engagement Analytics",
          description: "Track reposts, likes, replies, and impressions with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-green-600" />
        },
        {
          title: "Hashtag Optimization",
          description: "AI-powered hashtag suggestions to increase your post reach",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Audience Insights",
          description: "Understand your X audience demographics and behavior patterns",
          icon: <Users className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Conversation Monitoring",
          description: "Monitor mentions, replies, and conversations about your brand",
          icon: <MessageCircle className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Increased Reach",
          description: "Optimize your post timing to reach more of your audience",
          stat: "4x"
        },
        {
          title: "Higher Engagement",
          description: "Improve engagement rates with data-driven post strategies",
          stat: "58%"
        },
        {
          title: "Viral Potential",
          description: "Create posts that have higher potential to go viral",
          stat: "7x"
        }
      ]}
    />
  );
} 