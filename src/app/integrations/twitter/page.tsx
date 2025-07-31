"use client";

import { Twitter, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function TwitterIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="Twitter Integration"
      featureDescription="Connect your Twitter account and unlock powerful tools for tweet scheduling, analytics, and audience engagement. Manage your Twitter presence professionally with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Twitter className="w-6 h-6 text-white" />}
      platform="twitter"
      features={[
        {
          title: "Smart Tweet Scheduling",
          description: "Schedule tweets at optimal times when your audience is most active",
          icon: <Camera className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Thread Management",
          description: "Create and schedule engaging tweet threads that drive conversation",
          icon: <FileText className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Engagement Analytics",
          description: "Track retweets, likes, replies, and impressions with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-green-600" />
        },
        {
          title: "Hashtag Optimization",
          description: "AI-powered hashtag suggestions to increase your tweet reach",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Audience Insights",
          description: "Understand your Twitter audience demographics and behavior patterns",
          icon: <Users className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Conversation Monitoring",
          description: "Monitor mentions, replies, and conversations about your brand",
          icon: <MessageCircle className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Increased Reach",
          description: "Optimize your tweet timing to reach more of your audience",
          stat: "4x"
        },
        {
          title: "Higher Engagement",
          description: "Improve engagement rates with data-driven tweet strategies",
          stat: "58%"
        },
        {
          title: "Viral Potential",
          description: "Create tweets that have higher potential to go viral",
          stat: "7x"
        }
      ]}
      testimonials={[
        {
          name: "Michael Brown",
          role: "Tech Influencer",
          content: "The Twitter integration helped me grow from 10K to 100K followers in just 3 months. The scheduling and analytics are incredible!"
        },
        {
          name: "Sarah Johnson",
          role: "Marketing Consultant",
          content: "I can now schedule weeks of tweets in advance. My engagement rate increased by 60% since using this tool."
        },
        {
          name: "David Lee",
          role: "Content Creator",
          content: "The hashtag optimization feature is a game-changer. My tweets now reach 4x more people than before!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "Twitter Integration",
            "Basic Analytics",
            "Tweet Scheduling",
            "Hashtag Suggestions",
            "1 Twitter Account",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "Advanced Analytics",
            "Thread Management",
            "Audience Insights",
            "Conversation Monitoring",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$199",
          features: [
            "Everything in Influencer",
            "Custom Automation Rules",
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