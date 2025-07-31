"use client";

import { Facebook, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function FacebookIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="Facebook Integration"
      featureDescription="Connect your Facebook account and unlock powerful tools for page management, content scheduling, and audience engagement. Manage your Facebook presence professionally with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Facebook className="w-6 h-6 text-white" />}
      platform="facebook"
      features={[
        {
          title: "Page Management",
          description: "Manage multiple Facebook pages from one centralized dashboard with ease",
          icon: <Users className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Content Scheduling",
          description: "Schedule posts at optimal times when your audience is most active",
          icon: <Camera className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Engagement Analytics",
          description: "Track likes, shares, comments, and reach with detailed performance insights",
          icon: <BarChart3 className="w-8 h-8 text-green-600" />
        },
        {
          title: "Audience Insights",
          description: "Understand your Facebook audience demographics and behavior patterns",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Ad Performance Tracking",
          description: "Monitor your Facebook ad performance and optimize your campaigns",
          icon: <TrendingUp className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Community Management",
          description: "Manage comments, messages, and community engagement efficiently",
          icon: <MessageCircle className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Increased Reach",
          description: "Optimize your content timing to reach more of your audience",
          stat: "3x"
        },
        {
          title: "Better Engagement",
          description: "Improve engagement rates with data-driven content strategies",
          stat: "52%"
        },
        {
          title: "Time Savings",
          description: "Automate routine tasks and focus on creating great content",
          stat: "6hrs/week"
        }
      ]}
      testimonials={[
        {
          name: "Jennifer Smith",
          role: "Business Owner",
          content: "The Facebook integration helped us grow our page from 5K to 50K followers in just 6 months. The scheduling and analytics are incredible!"
        },
        {
          name: "Robert Chen",
          role: "Marketing Manager",
          content: "Managing multiple client Facebook pages is now effortless. The engagement analytics help us optimize every post."
        },
        {
          name: "Amanda Wilson",
          role: "Content Creator",
          content: "The audience insights feature helped me understand my followers better. My engagement rate increased by 40%!"
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "Facebook Integration",
            "Basic Analytics",
            "Content Scheduling",
            "Page Management",
            "1 Facebook Page",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "Advanced Analytics",
            "Multiple Page Management",
            "Ad Performance Tracking",
            "Community Management",
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