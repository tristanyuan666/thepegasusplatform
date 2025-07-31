"use client";

import { BarChart3, Sparkles, Zap, Target, TrendingUp, Users, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Eye, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function AnalyticsPage() {
  return (
    <PremiumFeatureIntro
      featureName="Advanced Analytics"
      featureDescription="Get deep insights into your social media performance with AI-powered analytics. Track engagement, audience growth, and content performance across all platforms in one comprehensive dashboard."
      requiredPlan="creator"
      icon={<BarChart3 className="w-6 h-6 text-white" />}
      features={[
        {
          title: "Real-Time Analytics",
          description: "Monitor your performance metrics in real-time with instant updates and live data",
          icon: <Activity className="w-8 h-8 text-blue-600" />
        },
        {
          title: "AI-Powered Insights",
          description: "Get intelligent recommendations and predictions based on your data patterns",
          icon: <Brain className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Cross-Platform Tracking",
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
          title: "Custom Reports",
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
          title: "Faster Growth",
          description: "Optimize your strategy with insights that accelerate your audience growth",
          stat: "4x"
        },
        {
          title: "Higher ROI",
          description: "Maximize your social media investment with proven optimization strategies",
          stat: "156%"
        }
      ]}
      testimonials={[
        {
          name: "Maria Santos",
          role: "Marketing Director",
          content: "The analytics dashboard gives us insights we never had before. Our engagement rates increased by 60% in just 2 months!"
        },
        {
          name: "Ryan Thompson",
          role: "Content Creator",
          content: "I can now see exactly what content works and what doesn't. My growth strategy is completely data-driven now."
        },
        {
          name: "Lisa Park",
          role: "Brand Manager",
          content: "The cross-platform analytics are incredible. We track all our social media performance in one place."
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "Basic Analytics Dashboard",
            "Real-Time Metrics",
            "Content Performance Tracking",
            "Audience Insights",
            "Export Reports",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "AI-Powered Insights",
            "Advanced Demographics",
            "Custom Reports",
            "Cross-Platform Analytics",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$199",
          features: [
            "Everything in Influencer",
            "Predictive Analytics",
            "White-label Reports",
            "API Access",
            "Dedicated Analytics Manager",
            "Custom Integrations"
          ]
        }
      ]}
    />
  );
}
