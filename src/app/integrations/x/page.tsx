"use client";

import { Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import XIcon from "@/components/x-icon";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function XIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="X Integration"
      featureDescription="Connect your X account and unlock enterprise-grade tools for content scheduling, analytics, and audience engagement. Transform your X presence with AI-powered optimization and professional management features."
      requiredPlan="creator"
      icon={<XIcon className="w-6 h-6 text-white" />}
      platform="x"
      features={[
        {
          title: "AI-Powered Scheduling",
          description: "Automatically schedule posts at optimal times when your audience is most engaged",
          icon: <Camera className="w-8 h-8 text-black" />
        },
        {
          title: "Professional Thread Creation",
          description: "Create compelling multi-post threads that drive meaningful conversations",
          icon: <FileText className="w-8 h-8 text-black" />
        },
        {
          title: "Advanced Analytics",
          description: "Track engagement metrics with enterprise-grade insights and reporting",
          icon: <BarChart3 className="w-8 h-8 text-black" />
        },
        {
          title: "Smart Hashtag Optimization",
          description: "AI-powered hashtag suggestions to maximize your post reach and visibility",
          icon: <Target className="w-8 h-8 text-black" />
        },
        {
          title: "Audience Intelligence",
          description: "Deep insights into your X audience demographics, behavior, and preferences",
          icon: <Users className="w-8 h-8 text-black" />
        },
        {
          title: "Conversation Management",
          description: "Monitor and engage with mentions, replies, and brand conversations",
          icon: <MessageCircle className="w-8 h-8 text-black" />
        }
      ]}
      benefits={[
        {
          title: "Enhanced Reach",
          description: "AI-optimized timing to maximize your audience reach",
          stat: "4x"
        },
        {
          title: "Improved Engagement",
          description: "Data-driven strategies that boost interaction rates",
          stat: "58%"
        },
        {
          title: "Viral Growth",
          description: "Create content with higher viral potential and impact",
          stat: "7x"
        }
      ]}
    />
  );
} 