"use client";

import { Facebook, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function FacebookIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="Facebook Integration"
      featureDescription="Connect your Facebook account and unlock powerful tools for page management, content scheduling, and audience engagement. Manage your Facebook presence professionally with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Facebook className="w-6 h-6 text-white" />}
      platform="facebook"
      features={[
        {
          title: "Page Management",
          description: "Manage multiple Facebook pages from one centralized dashboard with ease",
          icon: <Users className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Content Scheduling",
          description: "Schedule posts at optimal times when your audience is most active",
          icon: <Camera className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Engagement Analytics",
          description: "Track likes, shares, comments, and reach with detailed performance insights",
          icon: <BarChart3 className="w-8 h-8 text-green-600" />
        },
        {
          title: "Audience Insights",
          description: "Understand your Facebook audience demographics and behavior patterns",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Ad Performance Tracking",
          description: "Monitor your Facebook ad performance and optimize your campaigns",
          icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Community Management",
          description: "Manage comments, messages, and community engagement efficiently",
          icon: <MessageCircle className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Increased Reach",
          description: "Optimize your content timing to reach more of your audience",
          stat: "3x"
        },
        {
          title: "Better Engagement",
          description: "Improve engagement rates with data-driven content strategies",
          stat: "52%"
        },
        {
          title: "Time Savings",
          description: "Automate routine tasks and focus on creating great content",
          stat: "6hrs/week"
        }
      ]}
    />
  );
} 