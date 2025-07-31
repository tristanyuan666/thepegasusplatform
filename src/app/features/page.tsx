import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  Brain,
  Palette,
  Calendar,
  TrendingUp,
  BarChart3,
  DollarSign,
  Sparkles,
  ArrowRight,
  Crown,
  Lock,
  Infinity,
  Timer,
} from "lucide-react";

export default function FeaturesPage() {
  const features = [
    {
      icon: <Brain className="w-10 h-10" />,
      title: "Persona Builder",
      description:
        "Create your unique influencer identity with AI-guided onboarding, niche selection, and brand personality development",
      gradient: "from-blue-500 to-blue-600",
      premium: true,
      features: [
        "AI-powered niche recommendations",
        "Visual identity generator",
        "Brand consistency tools",
      ],
    },
    {
      icon: <Palette className="w-8 h-8" />,
      title: "AI Content Generator",
      description:
        "Auto-scriptwriter, voiceover generation, and video assembly with stock footage, avatars, and custom cutouts",
      gradient: "from-blue-600 to-blue-700",
      premium: true,
      features: [
        "AI script generation",
        "Voice cloning & synthesis",
        "Automated video assembly",
      ],
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Auto Posting",
      description:
        "Smart scheduler for TikTok, Instagram Reels, YouTube Shorts with optimal timing algorithms",
      gradient: "from-blue-700 to-blue-800",
      premium: true,
      features: [
        "Multi-platform scheduling",
        "Best-time algorithms",
        "Content queue management",
      ],
    },
    {
      icon: <TrendingUp className="w-8 h-8" />,
      title: "Growth Engine",
      description:
        "Viral hook optimizer, intelligent hashtag system, engagement boosts, and A/B testing for maximum reach",
      gradient: "from-blue-800 to-blue-900",
      premium: true,
      features: [
        "Viral hook optimization",
        "Smart hashtag research",
        "A/B testing suite",
      ],
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Fame Dashboard",
      description:
        "Real-time analytics, top content insights, weekly roadmaps, and viral score predictions",
      gradient: "from-blue-500 to-cyan-500",
      premium: true,
      features: [
        "Real-time analytics",
        "Viral score predictor",
        "Growth roadmaps",
      ],
    },
    {
      icon: <DollarSign className="w-8 h-8" />,
      title: "Monetization Suite",
      description:
        "Auto-link integration, AI-powered DM sales, revenue forecasting, and brand partnership tools",
      gradient: "from-cyan-500 to-blue-600",
      premium: true,
      features: [
        "Affiliate link automation",
        "AI sales assistant",
        "Revenue forecasting",
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
                Complete Platform Features
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Go Viral
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Transform your social media presence with our comprehensive suite
              of AI-powered tools designed for content creators and aspiring
              influencers.
            </p>

            {/* Premium feature highlights */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Premium Only Features
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Infinity className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Unlimited Everything
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Timer className="w-4 h-4 text-green-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Results in 24-48h
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 section-gradient relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group glass-premium p-8 hover-lift transition-all duration-200 hover:shadow-premium-lg card-3d relative overflow-hidden"
              >
                {/* Premium badge */}
                {feature.premium && (
                  <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1 rounded-full font-bold flex items-center gap-1">
                    <Crown className="w-3 h-3" />
                    PREMIUM
                  </div>
                )}

                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-5 group-hover:opacity-10 transition-opacity duration-200`}
                />

                <div className="relative z-10">
                                  <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.gradient} mb-6 group-hover:scale-105 transition-transform duration-200 shadow-lg`}
                >
                    <div className="text-white">{feature.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:gradient-text-premium transition-all duration-200">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  <ul className="space-y-3">
                    {feature.features.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${feature.gradient} shadow-sm`}
                        />
                        <span className="font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Lock indicator for premium features */}
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
