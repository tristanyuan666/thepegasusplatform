"use client";

import { TrendingUp, Sparkles, Zap, Target, Users, BarChart3, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Rocket, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function GrowthEnginePage() {
  return (
    <PremiumFeatureIntro
      featureName="Growth Engine"
      featureDescription="Accelerate your social media growth with AI-powered strategies and automation. Our growth engine analyzes your content, audience, and competitors to create personalized growth strategies that deliver measurable results."
      requiredPlan="influencer"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
      features={[
        {
          title: "AI Growth Strategies",
          description: "Get personalized growth strategies based on your niche, audience, and content performance",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Competitor Analysis",
          description: "Analyze your competitors' strategies and identify opportunities to outperform them",
          icon: <Target className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Audience Expansion",
          description: "Discover new audience segments and expand your reach with targeted strategies",
          icon: <Users className="w-8 h-8 text-green-600" />
        },
        {
          title: "Viral Opportunity Detection",
          description: "Identify trending topics and viral opportunities before they peak",
          icon: <Rocket className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Growth Automation",
          description: "Automate routine growth tasks and focus on creating amazing content",
          icon: <Zap className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Performance Optimization",
          description: "Continuously optimize your growth strategy based on real-time performance data",
          icon: <Activity className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Accelerated Growth",
          description: "Grow your audience 5x faster with AI-optimized strategies and automation",
          stat: "5x"
        },
        {
          title: "Higher Engagement",
          description: "Increase engagement rates with data-driven content and audience strategies",
          stat: "73%"
        },
        {
          title: "Viral Success",
          description: "Create viral content consistently with trend prediction and optimization",
          stat: "12x"
        }
      ]}
    />
  );
}
