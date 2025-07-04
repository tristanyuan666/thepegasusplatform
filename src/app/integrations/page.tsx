import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import Link from "next/link";
import {
  MessageCircle,
  Instagram,
  Youtube,
  Twitter,
  Linkedin,
  Facebook,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Zap,
  Users,
  Globe,
  Smartphone,
  Share2,
  Calendar,
  BarChart3,
  Target,
} from "lucide-react";

export default function IntegrationsPage() {
  const integrations = [
    {
      name: "TikTok",
      description: "Connect your TikTok account for viral short-form content",
      icon: (
        <svg className="w-8 h-8" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      color: "from-pink-500 to-pink-600",
      features: [
        "Auto-posting to TikTok",
        "Viral trend analysis",
        "Hashtag optimization",
        "Best time scheduling",
      ],
      status: "Available",
    },
    {
      name: "Instagram",
      description: "Sync with Instagram for Stories, Reels, and Posts",
      icon: <Instagram className="w-8 h-8" />,
      color: "from-purple-500 to-pink-500",
      features: [
        "Stories & Reels posting",
        "Feed optimization",
        "Engagement tracking",
        "Story highlights",
      ],
      status: "Available",
    },
    {
      name: "YouTube",
      description: "Manage YouTube Shorts and long-form content",
      icon: <Youtube className="w-8 h-8" />,
      color: "from-red-500 to-red-600",
      features: [
        "YouTube Shorts",
        "Video optimization",
        "Thumbnail generation",
        "Analytics integration",
      ],
      status: "Available",
    },
    {
      name: "Twitter/X",
      description: "Post and engage on Twitter/X platform",
      icon: <Twitter className="w-8 h-8" />,
      color: "from-blue-500 to-blue-600",
      features: [
        "Tweet scheduling",
        "Thread creation",
        "Trend monitoring",
        "Engagement tracking",
      ],
      status: "Available",
    },
    {
      name: "LinkedIn",
      description: "Professional networking and content sharing",
      icon: <Linkedin className="w-8 h-8" />,
      color: "from-blue-600 to-blue-700",
      features: [
        "Professional posts",
        "Article publishing",
        "Network growth",
        "B2B targeting",
      ],
      status: "Available",
    },
    {
      name: "Facebook",
      description: "Connect Facebook pages and groups",
      icon: <Facebook className="w-8 h-8" />,
      color: "from-blue-700 to-blue-800",
      features: [
        "Page management",
        "Group posting",
        "Event promotion",
        "Audience insights",
      ],
      status: "Available",
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
              <Globe className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Platform Integrations
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Connect All Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Social Platforms
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Seamlessly integrate with all major social media platforms and
              manage your entire content empire from one powerful dashboard.
            </p>

            {/* Integration stats */}
            <div className="flex flex-wrap justify-center gap-4">
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    6+ Platforms Supported
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-blue-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    One-Click Setup
                  </span>
                </div>
              </div>
              <div className="glass-premium px-6 py-3 rounded-full hover-lift">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-purple-600" />
                  <span className="text-gray-800 font-semibold text-sm">
                    Cross-Platform Analytics
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Integrations Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {integrations.map((integration, index) => (
              <div
                key={index}
                className="group glass-premium p-8 hover-lift transition-all duration-300 hover:shadow-premium-lg relative overflow-hidden"
              >
                {/* Status badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs px-3 py-1 rounded-full font-bold">
                  {integration.status}
                </div>

                {/* Background gradient overlay */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${integration.color} opacity-5 group-hover:opacity-10 transition-opacity duration-300`}
                />

                <div className="relative z-10">
                  <div
                    className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${integration.color} mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <div className="text-white">{integration.icon}</div>
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-gray-900 group-hover:gradient-text-premium transition-all duration-300">
                    {integration.name}
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    {integration.description}
                  </p>
                  <ul className="space-y-3 mb-6">
                    {integration.features.map((feature, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-3 text-sm text-gray-700"
                      >
                        <div
                          className={`w-2 h-2 rounded-full bg-gradient-to-r ${integration.color} shadow-sm`}
                        />
                        <span className="font-medium">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Connect button */}
                  <button
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-3 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 flex items-center justify-center gap-2 group/btn hover-target interactive-element"
                    data-interactive="true"
                    data-platform={integration.name.toLowerCase()}
                  >
                    <span>Connect {integration.name}</span>
                    <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Why Choose Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Integrations?
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features that make managing multiple platforms effortless
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <Smartphone className="w-8 h-8" />,
                title: "Cross-Platform Posting",
                description:
                  "Post to all platforms simultaneously with one click",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <Calendar className="w-8 h-8" />,
                title: "Smart Scheduling",
                description: "AI-optimized posting times for each platform",
                color: "from-blue-600 to-blue-700",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Unified Analytics",
                description:
                  "Track performance across all platforms in one dashboard",
                color: "from-blue-700 to-blue-800",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Platform Optimization",
                description:
                  "Content automatically optimized for each platform",
                color: "from-blue-800 to-blue-900",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-premium p-6 text-center hover-lift group"
              >
                <div
                  className={`inline-flex p-4 rounded-2xl bg-gradient-to-r ${feature.color} mb-4 group-hover:scale-110 transition-transform duration-300`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 text-sm">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-900 to-purple-900 relative overflow-hidden">
        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold mb-8 text-white">
            Ready to Connect{" "}
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Everything?
            </span>
          </h2>
          <p className="text-xl text-gray-200 mb-12 max-w-3xl mx-auto">
            Start managing all your social media platforms from one powerful
            dashboard
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              href="/pricing"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-lg rounded-xl shadow-lg hover-lift overflow-hidden"
            >
              <span className="relative z-10 flex items-center gap-2">
                Get Started Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
