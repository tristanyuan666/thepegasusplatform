"use client";

import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  MessageCircle,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
  Sparkles,
  ArrowRight,
  Crown,
  Lock,
  Infinity,
  Timer,
} from "lucide-react";
import XIcon from "@/components/x-icon";

export default function IntegrationsPage() {
  const integrations = [
    {
      icon: <MessageCircle className="w-10 h-10" />,
      title: "X Integration",
      description:
        "Connect your X account and unlock enterprise-grade tools for content scheduling, analytics, and audience engagement",
      gradient: "from-blue-500 to-blue-600",
      premium: true,
      features: [
        "AI-powered scheduling",
        "Professional thread creation",
        "Advanced analytics",
      ],
    },
    {
      icon: <Instagram className="w-8 h-8" />,
      title: "Instagram Integration",
      description:
        "Sync with Instagram for Stories, Reels, and Posts with AI-powered optimization and engagement tracking",
      gradient: "from-purple-500 to-pink-500",
      premium: true,
      features: [
        "Stories & Reels posting",
        "Feed optimization",
        "Engagement tracking",
      ],
    },
    {
      icon: <Youtube className="w-8 h-8" />,
      title: "YouTube Integration",
      description:
        "Manage YouTube Shorts and long-form content with automated video optimization and thumbnail generation",
      gradient: "from-red-500 to-red-600",
      premium: true,
      features: [
        "YouTube Shorts",
        "Video optimization",
        "Thumbnail generation",
      ],
    },
    {
      icon: <XIcon className="w-8 h-8" />,
      title: "TikTok Integration",
      description:
        "Connect your TikTok account for viral short-form content with trend analysis and hashtag optimization",
      gradient: "from-pink-500 to-pink-600",
      premium: true,
      features: [
        "Auto-posting to TikTok",
        "Viral trend analysis",
        "Hashtag optimization",
      ],
    },
    {
      icon: <Linkedin className="w-8 h-8" />,
      title: "LinkedIn Integration",
      description:
        "Professional networking and content sharing with B2B targeting and network growth tools",
      gradient: "from-blue-600 to-blue-700",
      premium: true,
      features: [
        "Professional posts",
        "Article publishing",
        "Network growth",
      ],
    },
    {
      icon: <Facebook className="w-8 h-8" />,
      title: "Facebook Integration",
      description:
        "Connect Facebook pages and groups with event promotion and audience insights",
      gradient: "from-blue-700 to-blue-800",
      premium: true,
      features: [
        "Page management",
        "Group posting",
        "Event promotion",
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 glass-premium mb-8 hover-lift">
              <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Complete Platform Integrations
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Go Multi-Platform
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Connect and manage all your social media platforms with our comprehensive suite
              of AI-powered integration tools designed for content creators and aspiring
              influencers.
            </p>

            {/* Premium feature highlights */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Premium Only Integrations
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Unlimited Connections
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-green-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Real-time Sync
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-24 section-gradient relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group glass-premium p-8 hover-lift transition-all duration-200 hover:shadow-premium-lg card-3d relative overflow-hidden"
              >
                {/* Premium badge */}
                {integration.premium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}

                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${integration.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${integration.gradient} mb-6 group-hover:scale-105 transition-transform duration-200 shadow-lg`}
                  >
                    <div className="text-white">{integration.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:gradient-text-premium transition-all duration-200">
                    {integration.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {integration.description}
                  </p>
                  <ul className="space-y-3">
                    {integration.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${integration.gradient} shadow-sm`}
                        />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Lock indicator for premium integrations */}
                  <div className="mt-6 pt-4 border-t border-gray-200">
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Lock className="w-3 h-3" />
                      <span>Requires Premium Subscription</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
