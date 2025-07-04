import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import TestimonialCarousel from "@/components/testimonial-carousel";
import {
  CheckCircle2,
  Users,
  Shield,
  Zap,
  Star,
  TrendingUp,
  ArrowRight,
  Sparkles,
  Crown,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  DollarSign,
  BarChart3,
  Target,
  Rocket,
  Globe,
  Award,
  Verified,
  Brain,
  Calendar,
} from "lucide-react";
import Link from "next/link";

function TestimonialCard({
  name,
  handle,
  avatar,
  content,
  metrics,
  verified,
}: any) {
  return (
    <div className="glass-premium p-6 hover-lift h-full">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
          />
          {verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center">
              <Verified className="w-3 h-3 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-semibold text-gray-900">{name}</h4>
            {verified && <Verified className="w-4 h-4 text-blue-500" />}
          </div>
          <p className="text-blue-600 text-sm font-medium">{handle}</p>
        </div>
        <div className="flex items-center">
          <Verified className="w-4 h-4 text-blue-500" />
        </div>
      </div>

      <p className="text-gray-700 mb-4 leading-relaxed">"{content}"</p>

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Users className="w-4 h-4 text-blue-500" />
            <span className="font-semibold text-gray-900">
              {metrics.followers}
            </span>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp className="w-4 h-4 text-green-500" />
            <span className="font-semibold text-green-600">
              {metrics.growth}
            </span>
          </div>
        </div>
        <div className="text-xs text-blue-600 bg-blue-50 px-3 py-1 rounded-full font-semibold">
          {metrics.platform}
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <Hero />

      {/* Top Navigation */}
      <Navbar />

      {/* Trust Bar */}
      <section className="py-12 bg-white border-b border-gray-100">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Setup in under 5 minutes</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Shield className="w-4 h-4 text-blue-500" />
              <span>Enterprise-grade security</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Award className="w-4 h-4 text-blue-500" />
              <span>30-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Users className="w-4 h-4 text-blue-500" />
              <span>50,000+ Active Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Stats Snapshot */}
      <section className="py-16 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                metric: "87%",
                label: "Viral Prediction Accuracy",
                icon: <Target className="w-8 h-8" />,
                color: "from-red-500 to-red-600",
              },
              {
                metric: "340%",
                label: "Average Growth Rate",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "from-green-500 to-green-600",
              },
              {
                metric: "$25M+",
                label: "Creator Revenue Generated",
                icon: <DollarSign className="w-8 h-8" />,
                color: "from-yellow-500 to-yellow-600",
              },
              {
                metric: "1B+",
                label: "Viral Views Generated",
                icon: <Eye className="w-8 h-8" />,
                color: "from-purple-500 to-purple-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group hover-target interactive-element button"
                data-interactive="true"
                data-button="true"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-white">{item.icon}</div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {item.metric}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.label}
                </h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Creator Dashboard */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-8">
              Interactive{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Creator Dashboard
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Experience the power of AI-driven content creation with real-time
              analytics
            </p>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="glass-premium p-8 hover-lift transition-all duration-300">
              <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
                {/* Analytics Header */}
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      Content Analytics Dashboard
                    </h3>
                    <p className="text-gray-600">
                      Track posts, scheduling, and performance metrics
                    </p>
                  </div>
                  <div className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="font-medium">Live Data</span>
                  </div>
                </div>

                {/* Analytics Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                  {[
                    {
                      label: "Posts Scheduled",
                      value: "24",
                      change: "+8",
                      color: "text-blue-500",
                      bgColor: "bg-blue-50",
                    },
                    {
                      label: "Engagement Rate",
                      value: "8.7%",
                      change: "+12%",
                      color: "text-green-500",
                      bgColor: "bg-green-50",
                    },
                    {
                      label: "Viral Score",
                      value: "94",
                      change: "+23%",
                      color: "text-purple-500",
                      bgColor: "bg-purple-50",
                    },
                    {
                      label: "Revenue",
                      value: "$12.4K",
                      change: "+67%",
                      color: "text-orange-500",
                      bgColor: "bg-orange-50",
                    },
                  ].map((metric, index) => (
                    <div
                      key={index}
                      className={`${metric.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300`}
                    >
                      <div className="text-sm text-gray-600 mb-2">
                        {metric.label}
                      </div>
                      <div className="text-3xl font-bold text-gray-900 mb-2">
                        {metric.value}
                      </div>
                      <div className={`text-sm font-medium ${metric.color}`}>
                        {metric.change} this week
                      </div>
                    </div>
                  ))}
                </div>

                {/* Content Scheduling & Performance */}
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Scheduled Posts */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-blue-500" />
                      Scheduled Posts
                    </h4>
                    <div className="space-y-3">
                      {[
                        {
                          title: "Morning Motivation Tips",
                          platform: "Social",
                          time: "Today 9:00 AM",
                          status: "scheduled",
                        },
                        {
                          title: "Productivity Hacks",
                          platform: "Social",
                          time: "Today 2:00 PM",
                          status: "scheduled",
                        },
                        {
                          title: "Weekly Recap Video",
                          platform: "Social",
                          time: "Tomorrow 6:00 PM",
                          status: "draft",
                        },
                      ].map((post, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                            S
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm font-medium text-gray-900 truncate">
                              {post.title}
                            </div>
                            <div className="text-xs text-gray-500">
                              {post.time}
                            </div>
                          </div>
                          <div
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              post.status === "scheduled"
                                ? "bg-green-100 text-green-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}
                          >
                            {post.status}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Performance Chart */}
                  <div className="bg-white rounded-xl p-6 border border-gray-200">
                    <h4 className="text-lg font-semibold text-gray-900 mb-4">
                      Weekly Performance
                    </h4>
                    <div className="h-32 flex items-end justify-between gap-2">
                      {[
                        20, 35, 25, 45, 40, 60, 55, 75, 70, 85, 80, 95, 90, 100,
                      ].map((height, index) => (
                        <div
                          key={index}
                          className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t flex-1 transition-all duration-1000 ease-out"
                          style={{
                            height: `${height}%`,
                            transitionDelay: `${index * 100}ms`,
                            minHeight: "8px",
                          }}
                        />
                      ))}
                    </div>
                    <div className="flex justify-between text-xs text-gray-500 mt-2">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Premium AI Platform Overview */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 glass-premium mb-8 hover-lift">
              <Crown className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Premium Features
              </span>
            </div>
            <h2 className="text-5xl font-bold text-black mb-8">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Go Viral
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Our AI-powered platform provides all the tools you need to create,
              optimize, and monetize viral content across all social platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Content Generator",
                description:
                  "Create viral-ready content with our advanced AI that understands your niche and audience.",
                color: "from-blue-500 to-blue-600",
              },
              {
                icon: <BarChart3 className="w-8 h-8" />,
                title: "Viral Score Predictor",
                description:
                  "Know which content will go viral before you post with our 87% accurate prediction algorithm.",
                color: "from-purple-500 to-purple-600",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Multi-Platform Publishing",
                description:
                  "Publish to TikTok, Instagram, YouTube, Twitter, and LinkedIn simultaneously with optimized formats.",
                color: "from-green-500 to-green-600",
              },
              {
                icon: <TrendingUp className="w-8 h-8" />,
                title: "Growth Analytics",
                description:
                  "Track your growth with detailed analytics and insights to optimize your content strategy.",
                color: "from-orange-500 to-orange-600",
              },
              {
                icon: <DollarSign className="w-8 h-8" />,
                title: "Monetization Suite",
                description:
                  "Turn your influence into income with brand partnerships, affiliate marketing, and direct monetization.",
                color: "from-pink-500 to-pink-600",
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Automation Tools",
                description:
                  "Automate your posting schedule, engagement, and growth strategies to scale your influence.",
                color: "from-indigo-500 to-indigo-600",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="glass-premium p-8 hover-lift transition-all duration-300 group hover-target interactive-element card"
                data-interactive="true"
                data-card="true"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-white">{feature.icon}</div>
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Proven Results */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-8">
              Proven{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Results
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Real metrics from creators who transformed their social presence
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {[
              {
                metric: "87%",
                label: "Viral Prediction Accuracy",
                description:
                  "Our AI predicts viral content with industry-leading precision",
                icon: <Target className="w-8 h-8" />,
                color: "from-red-500 to-red-600",
              },
              {
                metric: "340%",
                label: "Average Growth Rate",
                description:
                  "Creators see explosive follower growth within 30 days",
                icon: <TrendingUp className="w-8 h-8" />,
                color: "from-green-500 to-green-600",
              },
              {
                metric: "$25M+",
                label: "Creator Revenue Generated",
                description:
                  "Total earnings generated by our creator community",
                icon: <DollarSign className="w-8 h-8" />,
                color: "from-yellow-500 to-yellow-600",
              },
              {
                metric: "1B+",
                label: "Viral Views Generated",
                description: "Combined views across all creator content",
                icon: <Eye className="w-8 h-8" />,
                color: "from-purple-500 to-purple-600",
              },
            ].map((item, index) => (
              <div
                key={index}
                className="text-center group hover-target interactive-element button"
                data-interactive="true"
                data-button="true"
              >
                <div
                  className={`w-16 h-16 bg-gradient-to-r ${item.color} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                >
                  <div className="text-white">{item.icon}</div>
                </div>
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {item.metric}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {item.label}
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section
        id="testimonials"
        className="py-24 bg-gradient-to-br from-gray-50 to-white"
      >
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-8">
              What Our{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Creators Say
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Real results from real creators who transformed their social media
              presence
            </p>
          </div>

          <TestimonialCarousel />
        </div>
      </section>

      {/* Dashboard Experience */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-black mb-8">
              Dashboard{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Experience
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Join thousands of successful creators who have transformed their
              social media presence with Pegasus AI.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            <div
              className="group text-center hover-target interactive-element button"
              data-interactive="true"
              data-button="true"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <CheckCircle2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                Premium AI
              </h3>
              <p className="text-gray-600 text-sm">Advanced algorithms</p>
            </div>

            <div
              className="group text-center hover-target interactive-element button"
              data-interactive="true"
              data-button="true"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                50K+ Users
              </h3>
              <p className="text-gray-600 text-sm">Global community</p>
            </div>

            <div
              className="group text-center hover-target interactive-element button"
              data-interactive="true"
              data-button="true"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-700 to-blue-800 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600 text-sm">Enterprise-grade</p>
            </div>

            <div
              className="group text-center hover-target interactive-element button"
              data-interactive="true"
              data-button="true"
            >
              <div className="w-12 h-12 mx-auto mb-3 bg-gradient-to-r from-blue-800 to-cyan-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">
                500% Growth
              </h3>
              <p className="text-gray-600 text-sm">Average results</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-8">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Pegasus Works
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              From zero to viral in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Define Your Persona",
                description:
                  "Tell our AI about your niche, style, and goals. Our persona builder creates a custom content strategy tailored to your unique voice and audience.",
                icon: <Brain className="w-12 h-12" />,
                color: "from-blue-500 to-blue-600",
              },
              {
                step: "02",
                title: "Generate Viral Content",
                description:
                  "Our AI creates high-quality content optimized for each platform. Get scripts, captions, hashtags, and posting schedules that maximize engagement.",
                icon: <Sparkles className="w-12 h-12" />,
                color: "from-purple-500 to-purple-600",
              },
              {
                step: "03",
                title: "Scale & Monetize",
                description:
                  "Watch your following grow exponentially. Our monetization suite helps you turn your influence into income through brand partnerships and direct monetization.",
                icon: <DollarSign className="w-12 h-12" />,
                color: "from-green-500 to-green-600",
              },
            ].map((step, index) => (
              <div key={index} className="text-center group">
                <div className="relative mb-8">
                  <div className="text-8xl font-bold text-gray-100 absolute -top-4 left-1/2 transform -translate-x-1/2 -z-10">
                    {step.step}
                  </div>
                  <div
                    className={`w-20 h-20 bg-gradient-to-r ${step.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                  >
                    <div className="text-white">{step.icon}</div>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-4">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action – Ready to Go Viral? */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 glass-premium mb-8 hover-lift">
              <Rocket className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Ready to Go Viral?
              </span>
            </div>
            <h2 className="text-5xl font-bold text-black mb-8">
              Start Building Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Content Empire
              </span>
            </h2>
            <p className="text-2xl text-black mb-12 leading-relaxed">
              Join 50,000+ creators who are already using AI to create viral
              content and build their influence. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Link
                href="/pricing"
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-2xl shadow-xl hover-lift overflow-hidden transition-all duration-300 hover-target interactive-element magnetic pricing-nav pricing-link"
                data-interactive="true"
                data-pricing-nav="true"
                data-pricing-link="true"
              >
                <span className="relative z-10 flex items-center gap-3">
                  <Crown className="w-6 h-6" />
                  Get Started Now
                  <ArrowRight className="w-6 h-6" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-gray-600">
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Zap className="w-4 h-4 text-blue-500" />
                <span>Setup in under 5 minutes</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Shield className="w-4 h-4 text-blue-500" />
                <span>Enterprise-grade security</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Award className="w-4 h-4 text-blue-500" />
                <span>30-day money-back guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
