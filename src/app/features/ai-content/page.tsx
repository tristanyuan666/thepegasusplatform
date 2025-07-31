"use client";

import { Brain, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Globe, Camera, Video, Play, FileText, CheckCircle, Star } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function AIContentPage() {
  return (
    <PremiumFeatureIntro
      featureName="AI Content Generator"
      featureDescription="Leverage advanced artificial intelligence to create compelling, high-performing content that resonates with your audience. Generate engaging posts, scripts, and captions optimized for maximum engagement and reach across all platforms."
      requiredPlan="creator"
      icon={<Brain className="w-6 h-6 text-white" />}
      features={[
        {
          title: "Intelligent Content Creation",
          description: "AI-powered content generation that understands your brand voice and audience preferences",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Performance Optimization",
          description: "Advanced algorithms that optimize content for maximum engagement and viral potential",
          icon: <Sparkles className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Multi-Platform Adaptation",
          description: "Automatically adapt content for Instagram, TikTok, YouTube, X, LinkedIn, and more",
          icon: <Globe className="w-8 h-8 text-green-600" />
        },
        {
          title: "Viral Prediction Engine",
          description: "Predict content performance before publishing with advanced analytics",
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Content Repurposing",
          description: "Transform single pieces of content into multiple formats for different platforms",
          icon: <Zap className="w-8 h-8 text-yellow-600" />
        },
        {
          title: "Real-time Analytics",
          description: "Track content performance and optimize strategies with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-indigo-600" />
        }
      ]}
      benefits={[
        {
          title: "10x Content Creation Speed",
          description: "Generate weeks worth of content in minutes, not hours",
          stat: "10x"
        },
        {
          title: "Higher Engagement Rates",
          description: "AI-optimized content consistently outperforms manual creation",
          stat: "47%"
        },
        {
          title: "Proven Viral Success",
          description: "Join thousands of creators who've achieved viral content using our AI",
          stat: "98%"
        }
      ]}
    />
  );
}
