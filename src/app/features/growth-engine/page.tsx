"use client";

import { TrendingUp, Sparkles, Zap, Target, Users, BarChart3, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Rocket, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function GrowthEnginePage() {
  return (
    <PremiumFeatureIntro
      featureName="Growth Engine"
      featureDescription="Accelerate your social media growth with AI-powered strategies and automation. Our growth engine analyzes your content, audience, and competitors to create personalized growth strategies that deliver real results."
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
      testimonials={[
        {
          name: "Carlos Mendez",
          role: "Tech Influencer",
          content: "The Growth Engine helped me go from 10K to 100K followers in just 3 months. The AI strategies are incredibly accurate!"
        },
        {
          name: "Sophie Williams",
          role: "Fitness Coach",
          content: "I've had 5 posts go viral this month alone. The viral opportunity detection feature is absolutely game-changing."
        },
        {
          name: "Mike Johnson",
          role: "Business Coach",
          content: "The competitor analysis helped me identify gaps in my niche. My growth rate increased by 300%!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$49",
          features: [
            "Basic Growth Strategies",
            "Audience Analysis",
            "Content Optimization",
            "Growth Tracking",
            "Basic Automation",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$99",
          features: [
            "Everything in Creator",
            "AI Growth Engine",
            "Competitor Analysis",
            "Viral Opportunity Detection",
            "Advanced Automation",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$249",
          features: [
            "Everything in Influencer",
            "Custom Growth Strategies",
            "White-label Solutions",
            "API Access",
            "Dedicated Growth Manager",
            "Custom Integrations"
          ]
        }
      ]}
    />
  );
}
