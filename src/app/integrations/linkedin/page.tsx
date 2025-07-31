"use client";

import { Linkedin, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Camera, Video, Play, FileText, CheckCircle, Star, Share2, MessageCircle, Heart, Eye } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function LinkedInIntegrationPage() {
  return (
    <PremiumFeatureIntro
      featureName="LinkedIn Integration"
      featureDescription="Connect your LinkedIn account and unlock powerful tools for professional content scheduling, networking, and B2B audience growth. Manage your LinkedIn presence like a pro with our comprehensive suite of features."
      requiredPlan="creator"
      icon={<Linkedin className="w-6 h-6 text-white" />}
      platform="linkedin"
      features={[
        {
          title: "Professional Content Scheduling",
          description: "Schedule LinkedIn posts at optimal times for maximum professional engagement",
          icon: <Camera className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Article Management",
          description: "Create and schedule LinkedIn articles with professional formatting",
          icon: <FileText className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Network Analytics",
          description: "Track connection growth, profile views, and professional engagement",
          icon: <BarChart3 className="w-8 h-8 text-green-600" />
        },
        {
          title: "B2B Audience Insights",
          description: "Understand your professional audience demographics and industry focus",
          icon: <Target className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Thought Leadership Tools",
          description: "Build your professional brand with content that establishes expertise",
          icon: <Users className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Professional Networking",
          description: "Track and manage your professional connections and engagement",
          icon: <MessageCircle className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Professional Growth",
          description: "Build your professional brand and establish thought leadership",
          stat: "5x"
        },
        {
          title: "B2B Engagement",
          description: "Increase engagement with professional content strategies",
          stat: "73%"
        },
        {
          title: "Network Expansion",
          description: "Grow your professional network with strategic content",
          stat: "4x"
        }
      ]}
      testimonials={[
        {
          name: "Dr. Emily Chen",
          role: "Business Consultant",
          content: "The LinkedIn integration helped me establish myself as a thought leader in my industry. My network grew by 300%!"
        },
        {
          name: "James Rodriguez",
          role: "Sales Director",
          content: "I can now schedule professional content that drives real business opportunities. My lead generation increased by 200%."
        },
        {
          name: "Lisa Thompson",
          role: "Marketing Executive",
          content: "The B2B audience insights are invaluable. I can now target content to the right professional audience."
        }
      ]}
      pricing={[
        {
          plan: "Creator",
          price: "$29",
          features: [
            "LinkedIn Integration",
            "Basic Analytics",
            "Content Scheduling",
            "Article Management",
            "1 LinkedIn Account",
            "Email Support"
          ]
        },
        {
          plan: "Influencer",
          price: "$79",
          features: [
            "Everything in Creator",
            "Advanced Analytics",
            "B2B Audience Insights",
            "Thought Leadership Tools",
            "Professional Networking",
            "Priority Support"
          ],
          popular: true
        },
        {
          plan: "Superstar",
          price: "$199",
          features: [
            "Everything in Influencer",
            "Custom Professional Tools",
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