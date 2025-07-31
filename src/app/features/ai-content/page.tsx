"use client";

import { Brain, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Globe, Camera, Video, Play, FileText, CheckCircle, Star } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function AIContentPage() {
  return (
    <PremiumFeatureIntro
      featureName="AI Content Generator"
      featureDescription="Create viral content with AI-powered suggestions, templates, and optimization tools. Generate engaging posts, scripts, and captions that resonate with your audience and drive real results."
      requiredPlan="creator"
      icon={<Brain className="w-6 h-6 text-white" />}
      features={[
        {
          title: "AI-Powered Generation",
          description: "Advanced AI that understands your niche and creates content that resonates with your audience",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Viral Templates",
          description: "Proven templates and formulas that have generated millions of views and engagement",
          icon: <Sparkles className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Multi-Platform Support",
          description: "Generate optimized content for Instagram, TikTok, YouTube, Twitter, LinkedIn, and more",
          icon: <Globe className="w-8 h-8 text-green-600" />
        },
        {
          title: "Viral Score Prediction",
          description: "Get instant predictions on how well your content will perform before you post",
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Content Repurposing",
          description: "Transform one piece of content into multiple formats for different platforms",
          icon: <Zap className="w-8 h-8 text-yellow-600" />
        },
        {
          title: "Performance Analytics",
          description: "Track how your AI-generated content performs and optimize for better results",
          icon: <BarChart3 className="w-8 h-8 text-indigo-600" />
        }
      ]}
      benefits={[
        {
          title: "10x Faster Content Creation",
          description: "Generate weeks worth of content in minutes, not hours",
          stat: "10x"
        },
        {
          title: "Higher Engagement Rates",
          description: "AI-optimized content that consistently outperforms manual creation",
          stat: "47%"
        },
        {
          title: "Proven Viral Success",
          description: "Join thousands of creators who've gone viral using our AI tools",
          stat: "98%"
        }
      ]}
      testimonials={[
        {
          name: "Sarah Chen",
          role: "Lifestyle Creator",
          content: "The AI Content Generator helped me grow from 10K to 500K followers in just 6 months. The viral templates are absolutely game-changing!"
        },
        {
          name: "Marcus Johnson",
          role: "Business Coach",
          content: "I was spending 4 hours a day on content. Now I create a week's worth in 30 minutes. This tool is revolutionary."
        },
        {
          name: "Emma Rodriguez",
          role: "Fitness Influencer",
          content: "The viral score prediction is incredibly accurate. I've had 3 posts go viral this month alone!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "AI Content Generation",
            "Viral Templates Library",
            "Multi-Platform Support",
            "Basic Analytics",
            "50 generations/month"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "Advanced AI Models",
            "Unlimited Generations",
            "Viral Score Prediction",
            "Content Repurposing",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$199",
          features: [
            "Everything in Influencer",
            "Custom AI Training",
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
