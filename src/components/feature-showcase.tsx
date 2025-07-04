"use client";

import { useState } from "react";
import {
  Brain,
  Palette,
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Sparkles,
  ArrowRight,
  Play,
  Users,
  Zap,
  Target,
} from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  gradient: string;
  delay: number;
}

function FeatureCard({
  icon,
  title,
  description,
  features,
  gradient,
  delay,
}: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={`group glass-card p-8 hover-lift hover-glow transition-all duration-500 animate-slide-up`}
      style={{ animationDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative">
        {/* Icon */}
        <div
          className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${gradient} mb-6 group-hover:scale-110 transition-transform duration-300`}
        >
          <div className="text-white">{icon}</div>
        </div>

        {/* Content */}
        <h3 className="text-2xl font-bold mb-4 text-white group-hover:gradient-text transition-all duration-300">
          {title}
        </h3>
        <p className="text-gray-300 mb-6 leading-relaxed">{description}</p>

        {/* Features List */}
        <ul className="space-y-3 mb-6">
          {features.map((feature, index) => (
            <li
              key={index}
              className="flex items-center gap-3 text-gray-300 group-hover:text-white transition-colors duration-300"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <div
                className={`w-2 h-2 rounded-full bg-gradient-to-r ${gradient}`}
              />
              <span className="text-sm">{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <div
          className={`flex items-center gap-2 text-sm font-medium transition-all duration-300 ${
            isHovered ? "text-neon-blue" : "text-gray-400"
          }`}
        >
          <span>Learn More</span>
          <ArrowRight
            className={`w-4 h-4 transition-transform duration-300 ${
              isHovered ? "translate-x-1" : ""
            }`}
          />
        </div>

        {/* Hover Glow Effect */}
        <div
          className={`absolute inset-0 rounded-3xl bg-gradient-to-r ${gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-300 -z-10`}
        />
      </div>
    </div>
  );
}

function DemoVideo() {
  const [isPlaying, setIsPlaying] = useState(false);

  return (
    <div className="relative glass-card p-8 hover-lift group">
      <div className="aspect-video bg-gradient-to-br from-purple-900/50 to-blue-900/50 rounded-2xl relative overflow-hidden">
        {/* Fake video thumbnail */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-blue-600/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-4 mx-auto group-hover:scale-110 transition-transform duration-300">
              <Play className="w-8 h-8 text-white ml-1" />
            </div>
            <p className="text-white font-medium">Watch Pegasus in Action</p>
            <p className="text-gray-300 text-sm mt-1">2:30 Demo Video</p>
          </div>
        </div>

        {/* Animated elements */}
        <div className="absolute top-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
          <span className="text-white text-xs">LIVE</span>
        </div>

        <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-black/50 backdrop-blur-sm rounded-full px-3 py-1">
          <Users className="w-4 h-4 text-white" />
          <span className="text-white text-xs">1.2K watching</span>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-bold text-white mb-2">
          See the Magic Happen
        </h3>
        <p className="text-gray-300 text-sm">
          Watch how Pegasus transforms ordinary users into viral content
          creators
        </p>
      </div>
    </div>
  );
}

export default function FeatureShowcase() {
  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Persona Builder",
      description:
        "Create your unique influencer identity with AI-guided onboarding, niche selection, and brand personality development.",
      features: [
        "AI-powered niche recommendations",
        "Visual identity generator",
        "Tone & voice customization",
        "Brand consistency tools",
      ],
      gradient: "from-purple-500 to-pink-500",
      delay: 0,
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "AI Content Generator",
      description:
        "Auto-scriptwriter, voiceover generation, and video assembly with stock footage, avatars, and custom cutouts.",
      features: [
        "AI script generation",
        "Voice cloning & synthesis",
        "Automated video assembly",
        "Stock footage integration",
      ],
      gradient: "from-blue-500 to-cyan-500",
      delay: 200,
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Auto Posting",
      description:
        "Smart scheduler for TikTok, Instagram Reels, YouTube Shorts with optimal timing algorithms.",
      features: [
        "Multi-platform scheduling",
        "Best-time algorithms",
        "Content queue management",
        "Auto-optimization",
      ],
      gradient: "from-green-500 to-emerald-500",
      delay: 400,
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Engine",
      description:
        "Viral hook optimizer, intelligent hashtag system, engagement boosts, and A/B testing for maximum reach.",
      features: [
        "Viral hook optimization",
        "Smart hashtag research",
        "A/B testing suite",
        "Engagement automation",
      ],
      gradient: "from-orange-500 to-red-500",
      delay: 600,
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Fame Dashboard",
      description:
        "Real-time analytics, top content insights, weekly roadmaps, and viral score predictions.",
      features: [
        "Real-time analytics",
        "Viral score predictor",
        "Content performance insights",
        "Growth roadmaps",
      ],
      gradient: "from-indigo-500 to-purple-500",
      delay: 800,
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Monetization Suite",
      description:
        "Auto-link integration, AI-powered DM sales, revenue forecasting, and brand partnership tools.",
      features: [
        "Affiliate link automation",
        "AI sales assistant",
        "Revenue forecasting",
        "Brand partnership matching",
      ],
      gradient: "from-yellow-500 to-orange-500",
      delay: 1000,
    },
  ];

  return (
    <section className="py-16 bg-black relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 via-transparent to-blue-900/10" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-neon-purple mr-2" />
            <span className="text-neon-purple text-sm font-medium">
              Platform Features
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
            Everything You Need to{" "}
            <span className="gradient-text">Go Viral</span>
          </h2>
          <p className="text-gray-300 max-w-3xl mx-auto text-base">
            Transform your social media presence with our comprehensive suite of
            AI-powered tools designed for content creators and aspiring
            influencers.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {features.map((feature, index) => (
            <FeatureCard key={index} {...feature} />
          ))}
        </div>

        {/* Demo Video Section */}
        <div className="max-w-4xl mx-auto">
          <DemoVideo />
        </div>
      </div>
    </section>
  );
}
