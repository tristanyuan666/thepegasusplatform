"use client";

import { Instagram, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function InstagramIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="Instagram Integration"
      featureDescription="Connect your Instagram account and unlock powerful tools for content scheduling, analytics, and audience growth. Manage your Instagram presence like a pro with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Instagram className="w-6 h-6 text-white" />}
      platform="instagram"
      features={[
        {
          title: "Smart Content Scheduling",
          description: "Schedule posts at optimal times when your audience is most active for maximum engagement",
          icon: <Camera className="w-8 h-8 text-pink-600" />
        },
        {
          title: "Advanced Analytics",
          description: "Track performance metrics, audience growth, and engagement rates with detailed insights",
          icon: <BarChart3 className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Hashtag Optimization",
          description: "AI-powered hashtag suggestions that increase your post reach and discoverability",
          icon: <Target className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Engagement Automation",
          description: "Automatically respond to comments and messages to build stronger relationships",
          icon: <MessageCircle className="w-8 h-8 text-green-600" />
        },
        {
          title: "Content Performance Tracking",
          description: "Monitor which posts perform best and optimize your content strategy accordingly",
          icon: <TrendingUp className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Multi-Account Management",
          description: "Manage multiple Instagram accounts from one dashboard with ease",
          icon: <Users className="w-8 h-8 text-indigo-600" />
        }
      ]}
      benefits={[
        {
          title: "3x Faster Growth",
          description: "Optimized posting schedules and content strategies accelerate your follower growth",
          stat: "3x"
        },
        {
          title: "Higher Engagement",
          description: "Smart automation and optimization tools boost your engagement rates significantly",
          stat: "67%"
        },
        {
          title: "Time Savings",
          description: "Automate routine tasks and focus on creating amazing content",
          stat: "5hrs/week"
        }
      ]}
      testimonials={[
        {
          name: "Alex Rivera",
          role: "Fashion Influencer",
          content: "The Instagram integration helped me grow from 50K to 200K followers in just 4 months. The scheduling and analytics features are incredible!"
        },
        {
          name: "Jessica Kim",
          role: "Food Blogger",
          content: "I save 3 hours every day with automated posting and engagement. My engagement rate went up 40% since using this tool."
        },
        {
          name: "David Chen",
          role: "Travel Creator",
          content: "The hashtag optimization feature is a game-changer. My posts now reach 3x more people than before!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "Instagram Integration",
            "Basic Analytics",
            "Content Scheduling",
            "Hashtag Suggestions",
            "1 Instagram Account",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "Advanced Analytics",
            "Engagement Automation",
            "Multi-Account Management",
            "Performance Tracking",
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
