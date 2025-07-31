"use client";

import { Users, Sparkles, Zap, Target, TrendingUp, BarChart3, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, UserCheck, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function PersonaBuilderPage() {
  return (
    <PremiumFeatureIntro
      featureName="Persona Builder"
      featureDescription="Create detailed audience personas and understand your target market like never before. Our AI-powered persona builder analyzes your audience data to create comprehensive profiles that drive better content and marketing strategies."
      requiredPlan="creator"
      icon={<Users className="w-6 h-6 text-white" />}
      features={[
        {
          title: "AI Persona Generation",
          description: "Automatically generate detailed audience personas based on your real audience data",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Behavioral Analysis",
          description: "Understand your audience's behavior patterns, preferences, and engagement habits",
          icon: <Activity className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Demographic Insights",
          description: "Get comprehensive demographic data including age, location, interests, and more",
          icon: <UserCheck className="w-8 h-8 text-green-600" />
        },
        {
          title: "Content Preference Mapping",
          description: "Identify what content types and topics resonate most with each persona",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Persona Validation",
          description: "Test and validate your personas with real audience feedback and data",
          icon: <CheckCircle className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Strategy Recommendations",
          description: "Get personalized content and marketing strategies for each persona",
          icon: <Sparkles className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Better Content Targeting",
          description: "Create content that resonates with your specific audience segments",
          stat: "89%"
        },
        {
          title: "Higher Engagement",
          description: "Increase engagement by targeting content to the right personas",
          stat: "67%"
        },
        {
          title: "Faster Growth",
          description: "Grow your audience faster with persona-driven content strategies",
          stat: "3x"
        }
      ]}
      testimonials={[
        {
          name: "Amanda Chen",
          role: "Marketing Manager",
          content: "The Persona Builder helped us understand our audience so much better. Our content engagement increased by 75%!"
        },
        {
          name: "James Wilson",
          role: "Content Creator",
          content: "I now create content specifically for each persona. My audience growth rate doubled in just 2 months."
        },
        {
          name: "Rachel Green",
          role: "Brand Strategist",
          content: "The behavioral analysis is incredible. We can now predict what content will perform best before we create it."
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "Basic Persona Builder",
            "Demographic Analysis",
            "Behavioral Insights",
            "Content Recommendations",
            "3 Personas",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "AI Persona Generation",
            "Advanced Behavioral Analysis",
            "Persona Validation",
            "Unlimited Personas",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$199",
          features: [
            "Everything in Influencer",
            "Custom Persona Models",
            "White-label Solutions",
            "API Access",
            "Dedicated Strategy Manager",
            "Custom Integrations"
          ]
        }
      ]}
    />
  );
}
