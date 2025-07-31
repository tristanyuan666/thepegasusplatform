"use client";

import { Youtube, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function YouTubeIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="YouTube Integration"
      featureDescription="Connect your YouTube channel and unlock powerful tools for video optimization, analytics, and audience growth. Manage your YouTube presence professionally with our comprehensive suite of features."
      requiredPlan="influencer"
      icon={<Youtube className="w-6 h-6 text-white" />}
      platform="youtube"
      features={[
        {
          title: "Video Performance Analytics",
          description: "Track views, watch time, engagement, and subscriber growth with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-red-600" />
        },
        {
          title: "SEO Optimization",
          description: "Optimize video titles, descriptions, and tags for better search visibility",
          icon: <Target className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Thumbnail Optimization",
          description: "Create compelling thumbnails that increase click-through rates",
          icon: <Camera className="w-8 h-8 text-green-600" />
        },
        {
          title: "Audience Retention Analysis",
          description: "Analyze viewer retention patterns to create more engaging content",
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Comment Management",
          description: "Monitor and respond to comments to build community engagement",
          icon: <MessageCircle className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Competitor Analysis",
          description: "Analyze competitor channels to identify content opportunities",
          icon: <Users className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Increased Views",
          description: "Optimize your videos for maximum visibility and reach",
          stat: "5x"
        },
        {
          title: "Higher Engagement",
          description: "Improve watch time and engagement with data-driven insights",
          stat: "67%"
        },
        {
          title: "Faster Growth",
          description: "Grow your subscriber base with optimized content strategies",
          stat: "4x"
        }
      ]}
    />
  );
} 