"use client";

import { TrendingUp, Sparkles, Zap, Target, Users, BarChart3, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Activity, PieChart, Zap as Lightning } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function ViralPredictorPage() {
  return (
    <PremiumFeatureIntro
      featureName="Viral Predictor"
      featureDescription="Predict which content will go viral before you post it. Our AI-powered viral predictor analyzes millions of data points to give you accurate predictions and recommendations for creating viral content."
      requiredPlan="influencer"
      icon={<TrendingUp className="w-6 h-6 text-white" />}
      features={[
        {
          title: "AI Viral Prediction",
          description: "Get accurate predictions on content performance before you publish",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Trend Analysis",
          description: "Identify trending topics and viral opportunities in real-time",
          icon: <Activity className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Content Optimization",
          description: "Get specific recommendations to improve your content's viral potential",
          icon: <Target className="w-8 h-8 text-green-600" />
        },
        {
          title: "Viral Score Tracking",
          description: "Track your content's viral score and optimize for better performance",
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Competitor Monitoring",
          description: "Monitor what's going viral in your niche and adapt your strategy",
          icon: <Users className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Predictive Analytics",
          description: "Use historical data to predict future viral trends and opportunities",
          icon: <PieChart className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Higher Viral Rate",
          description: "Increase your chances of going viral with AI-powered predictions",
          stat: "8x"
        },
        {
          title: "Better Content",
          description: "Optimize your content based on viral prediction insights",
          stat: "67%"
        },
        {
          title: "Faster Growth",
          description: "Grow your audience faster by creating more viral content",
          stat: "5x"
        }
      ]}
      testimonials={[
        {
          name: "Emma Davis",
          role: "Lifestyle Influencer",
          content: "The Viral Predictor is incredibly accurate. I've had 12 posts go viral this year alone!"
        },
        {
          name: "Marcus Lee",
          role: "Comedy Creator",
          content: "I can now predict which videos will perform best before I even finish editing. Game-changer!"
        },
        {
          name: "Lisa Rodriguez",
          role: "Fitness Coach",
          content: "The trend analysis feature helped me catch viral trends early. My growth exploded!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$49",
          features: [
            "Basic Viral Prediction",
            "Content Optimization",
            "Viral Score Tracking",
            "Trend Analysis",
            "50 predictions/month",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$99",
          features: [
            "Everything in Creator",
            "Advanced AI Predictions",
            "Competitor Monitoring",
            "Predictive Analytics",
            "Unlimited Predictions",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$249",
          features: [
            "Everything in Influencer",
            "Custom Prediction Models",
            "White-label Solutions",
            "API Access",
            "Dedicated Success Manager",
            "Custom Integrations"
          ]
        }
      ]}
    />
  );
}
