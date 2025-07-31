"use client";

import { BarChart3, Sparkles, Zap, Target, TrendingUp, Users, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Eye, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function AnalyticsPage() {
  return (
    <PremiumFeatureIntro
      featureName="Advanced Analytics"
      featureDescription="Gain deep insights into your social media performance with enterprise-grade analytics. Track engagement, audience growth, and content performance across all platforms with comprehensive data-driven insights."
      requiredPlan="creator"
      icon={<BarChart3 className="w-6 h-6 text-white" />}
      features={[
        {
          title: "Real-Time Performance Tracking",
          description: "Monitor your metrics in real-time with instant updates and live data visualization",
          icon: <Activity className="w-8 h-8 text-blue-600" />
        },
        {
          title: "AI-Powered Insights",
          description: "Get intelligent recommendations and predictions based on comprehensive data analysis",
          icon: <Brain className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Cross-Platform Analytics",
          description: "Track performance across Instagram, TikTok, YouTube, X, LinkedIn, and more",
          icon: <Globe className="w-8 h-8 text-green-600" />
        },
        {
          title: "Audience Demographics",
          description: "Understand your audience with detailed demographic and behavioral insights",
          icon: <Users className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Content Performance Analysis",
          description: "Identify your best-performing content and optimize your strategy accordingly",
          icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Custom Reporting",
          description: "Create personalized reports and dashboards tailored to your specific needs",
          icon: <PieChart className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Data-Driven Decisions",
          description: "Make informed content decisions based on comprehensive analytics and insights",
          stat: "89%"
        },
        {
          title: "Accelerated Growth",
          description: "Optimize your strategy with insights that accelerate your audience growth",
          stat: "4x"
        },
        {
          title: "Higher ROI",
          description: "Maximize your social media investment with proven optimization strategies",
          stat: "156%"
        }
      ]}
    />
  );
}
