"use client";
// Trigger Vercel build

import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Suspense, lazy } from "react";
import { useState } from "react";
const TestimonialCarousel = lazy(() => import("@/components/testimonial-carousel"));
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
  ChevronRight,
  Clock,
  BarChart,
  Smartphone,
  Video,
  Instagram,
  MessageSquare,
  Youtube,
  Linkedin,
  Check,
  ArrowUpRight,
  Activity,
  CalendarDays,
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
  const [activeTab, setActiveTab] = useState("ai-generator");

  const handleFeatureClick = () => {
    window.location.href = "/pricing";
  };

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
              <Sparkles className="w-4 h-4 text-blue-500" />
              <span>AI-Powered Content Creation</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Target className="w-4 h-4 text-blue-500" />
              <span>87% Viral Prediction Accuracy</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <TrendingUp className="w-4 h-4 text-blue-500" />
              <span>340% Average Growth Rate</span>
            </div>
            <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
              <Users className="w-4 h-4 text-blue-500" />
              <span>50,000+ Active Creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature + Integration Showcase */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <div className="inline-flex items-center px-6 py-3 glass-premium mb-8 hover-lift">
              <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Experience the Power
              </span>
            </div>
            <h2 className="text-5xl font-bold text-black mb-8">
              AI-Driven Creation{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Platform
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              See how our platform transforms content creation across all social platforms with intelligent automation
            </p>
          </div>

          <div className="max-w-7xl mx-auto">
            {/* Enhanced Feature Tabs */}
            <div className="flex items-center justify-center gap-3 mb-12">
              {[
                { 
                  name: "AI Generator", 
                  icon: <Sparkles className="w-5 h-5" />, 
                  id: "ai-generator",
                  color: "from-blue-500 to-blue-600"
                },
                { 
                  name: "Analytics Dashboard", 
                  icon: <BarChart3 className="w-5 h-5" />, 
                  id: "analytics-dashboard",
                  color: "from-purple-500 to-purple-600"
                },
                { 
                  name: "Content Scheduler", 
                  icon: <CalendarDays className="w-5 h-5" />, 
                  id: "content-scheduler",
                  color: "from-green-500 to-green-600"
                },
              ].map((tab, index) => (
                <button
                      key={index}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-3 px-10 py-5 rounded-2xl font-semibold transition-all duration-500 hover:scale-105 ${
                    activeTab === tab.id
                      ? `bg-gradient-to-r ${tab.color} text-white shadow-2xl scale-110`
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:shadow-lg"
                  }`}
                >
                  {tab.icon}
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Main Demo Area */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Feature Demo */}
              <div className="glass-premium p-8 hover-lift">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  {activeTab === "ai-generator" && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                          <Sparkles className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">AI Content Generator</h3>
                          <p className="text-sm text-gray-600">Generate viral content in seconds</p>
                        </div>
                      </div>

                      {/* Enhanced Content Generation Interface */}
                      <div className="space-y-4">
                        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-200">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-gray-700">Generating content...</span>
                            <div className="flex gap-1">
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                              <div className="w-1 h-1 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                            </div>
                          </div>
                          
                          {/* Content Preview with Icons */}
                          <div className="bg-white rounded-lg p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-start gap-3">
                              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                <Sparkles className="w-4 h-4 text-white" />
                              </div>
                              <div className="flex-1">
                                <div className="text-sm text-gray-800 leading-relaxed mb-3">
                                  "Transform your morning routine with these 5 productivity hacks that successful entrepreneurs swear by! 💪✨"
                                </div>
                                <div className="flex items-center gap-2 text-xs text-gray-500">
                                  <div className="flex items-center gap-1">
                                    <Eye className="w-3 h-3" />
                                    <span>High engagement</span>
                                  </div>
                                  <div className="flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3" />
                                    <span>Viral potential</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">#</span>
                              </div>
                              <div className="text-xs text-blue-600 font-semibold">Trending Hashtags</div>
                            </div>
                            <div className="flex flex-wrap gap-1">
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">#ProductivityHacks</span>
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">#MorningRoutine</span>
                              <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded-full">#SuccessTips</span>
                            </div>
                          </div>
                          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                <Target className="w-2 h-2 text-white" />
                              </div>
                              <div className="text-xs text-green-600 font-semibold">Viral Score</div>
                            </div>
                            <div className="flex items-center gap-2">
                              <div className="text-lg font-bold text-green-700">94/100</div>
                              <div className="flex-1 bg-green-200 rounded-full h-2">
                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '94%' }}></div>
                              </div>
                            </div>
                          </div>
                      </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "analytics-dashboard" && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                          <BarChart3 className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Analytics Dashboard</h3>
                          <p className="text-sm text-gray-600">Track performance across all platforms</p>
                        </div>
                </div>

                      {/* Analytics Interface */}
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-purple-50 rounded-lg p-4">
                            <div className="text-xs text-purple-600 font-medium mb-1">Total Reach</div>
                            <div className="text-lg font-bold text-gray-900">2.4M</div>
                            <div className="text-xs text-green-600">+23% this week</div>
                          </div>
                          <div className="bg-blue-50 rounded-lg p-4">
                            <div className="text-xs text-blue-600 font-medium mb-1">Engagement Rate</div>
                            <div className="text-lg font-bold text-gray-900">8.7%</div>
                            <div className="text-xs text-green-600">+5% this week</div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-lg p-4">
                          <div className="text-xs text-gray-600 font-medium mb-2">Top Performing Content</div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">Productivity Tips Post</span>
                              <span className="text-green-600 font-medium">+340%</span>
                            </div>
                            <div className="flex items-center justify-between text-sm">
                              <span className="text-gray-700">Morning Routine Video</span>
                              <span className="text-green-600 font-medium">+280%</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "content-scheduler" && (
                    <div className="mb-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                          <CalendarDays className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">Content Scheduler</h3>
                          <p className="text-sm text-gray-600">Plan and automate your content</p>
                        </div>
                      </div>

                      {/* Enhanced Scheduler Interface */}
                      <div className="space-y-4">
                        <div className="bg-green-50 rounded-xl p-6">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-lg font-semibold text-gray-800">Today's Schedule</span>
                            <button className="text-sm text-green-600 hover:text-green-700 font-medium">+ Add Post</button>
                          </div>
                          <div className="space-y-4">
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-green-200 shadow-sm">
                              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-green-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                9
                              </div>
                              <div className="flex-1">
                                <div className="text-base font-semibold text-gray-900">Morning Motivation Tips</div>
                                <div className="text-sm text-gray-500">Instagram, X, LinkedIn</div>
                              </div>
                              <div className="text-sm text-green-600 font-semibold">9:00 AM</div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-blue-200 shadow-sm">
                              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                2
                              </div>
                              <div className="flex-1">
                                <div className="text-base font-semibold text-gray-900">Productivity Hacks</div>
                                <div className="text-sm text-gray-500">LinkedIn, TikTok, YouTube</div>
                              </div>
                              <div className="text-sm text-blue-600 font-semibold">2:00 PM</div>
                            </div>
                            <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-purple-200 shadow-sm">
                              <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-sm font-bold">
                                6
                              </div>
                              <div className="flex-1">
                                <div className="text-base font-semibold text-gray-900">Weekly Recap Video</div>
                                <div className="text-sm text-gray-500">YouTube, TikTok, Instagram</div>
                              </div>
                              <div className="text-sm text-purple-600 font-semibold">6:00 PM</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  <button 
                    className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105"
                    onClick={handleFeatureClick}
                  >
                    Try {activeTab === "ai-generator" ? "AI Generator" : activeTab === "analytics-dashboard" ? "Analytics" : "Scheduler"} Now
                  </button>
                </div>
              </div>

              {/* Integration Showcase */}
              <div className="glass-premium p-8 hover-lift">
                <div className="bg-white rounded-2xl p-8 border border-gray-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
                      <Globe className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Platform Integration</h3>
                      <p className="text-sm text-gray-600">Seamless cross-platform publishing</p>
                    </div>
                  </div>

                  {/* Platform Statistics */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="bg-purple-50 rounded-lg p-4 border border-purple-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-purple-500 rounded-full flex items-center justify-center">
                          <TrendingUp className="w-2 h-2 text-white" />
                        </div>
                        <div className="text-xs text-purple-600 font-semibold">Total Reach</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">12.4M</div>
                      <div className="text-xs text-green-600">+23% this week</div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                          <Users className="w-2 h-2 text-white" />
                        </div>
                        <div className="text-xs text-blue-600 font-semibold">Connected</div>
                      </div>
                      <div className="text-lg font-bold text-gray-900">3/6</div>
                      <div className="text-xs text-blue-600">Platforms</div>
                    </div>
                  </div>

                  {/* Platform Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    {[
                      { name: "Instagram", icon: <Instagram className="w-6 h-6" />, color: "text-pink-600", connected: true, followers: "847K" },
                      { name: "TikTok", icon: <Video className="w-6 h-6" />, color: "text-black", connected: true, followers: "2.1M" },
                      { name: "YouTube", icon: <Youtube className="w-6 h-6" />, color: "text-red-600", connected: true, followers: "456K" },
                      { name: "X", icon: <MessageSquare className="w-6 h-6" />, color: "text-blue-500", connected: false, followers: "0" },
                      { name: "LinkedIn", icon: <Linkedin className="w-6 h-6" />, color: "text-blue-700", connected: false, followers: "0" },
                      { name: "Facebook", icon: <MessageCircle className="w-6 h-6" />, color: "text-blue-600", connected: false, followers: "0" },
                    ].map((platform, index) => (
                      <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-gray-300 transition-colors">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                          platform.connected ? "bg-gray-50" : "bg-gray-100"
                        }`}>
                          <div className={platform.color}>{platform.icon}</div>
                        </div>
                        <div className="flex-1">
                          <div className="text-sm font-medium text-gray-900">{platform.name}</div>
                          <div className={`text-xs ${platform.connected ? "text-green-600" : "text-gray-500"}`}>
                            {platform.connected ? platform.followers : "Connect"}
                          </div>
                        </div>
                        {platform.connected && (
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Connection Status */}
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-semibold text-gray-700">Auto-sync enabled</span>
                    </div>
                    <div className="text-xs text-gray-600">
                      Content automatically publishes across all connected platforms
                    </div>
                  </div>

                  <button 
                    className="w-full bg-gradient-to-r from-purple-600 to-purple-700 text-white py-4 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 hover:scale-105 mt-6"
                    onClick={handleFeatureClick}
                  >
                    Connect Your Platforms
                  </button>
                </div>
              </div>
            </div>

            {/* Live Metrics */}
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  label: "Content Generated",
                  value: "2,847",
                  change: "+23%",
                  color: "text-blue-600",
                  bgColor: "bg-blue-50",
                  icon: <Sparkles className="w-5 h-5" />
                },
                {
                  label: "Viral Predictions",
                  value: "94%",
                  change: "+8%",
                  color: "text-purple-600",
                  bgColor: "bg-purple-50",
                  icon: <Target className="w-5 h-5" />
                },
                {
                  label: "Platform Reach",
                  value: "12.4M",
                  change: "+67%",
                  color: "text-green-600",
                  bgColor: "bg-green-50",
                  icon: <Globe className="w-5 h-5" />
                },
              ].map((metric, index) => (
                <div key={index} className={`${metric.bgColor} rounded-xl p-6 border border-gray-200 hover:shadow-md transition-all duration-300`}>
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`${metric.color}`}>{metric.icon}</div>
                    <div className="text-sm text-gray-600">{metric.label}</div>
                  </div>
                  <div className="text-2xl font-bold text-gray-900 mb-1">{metric.value}</div>
                  <div className={`text-sm font-medium ${metric.color}`}>{metric.change} this week</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Everything You Need to Go Viral */}
      <section className="py-24 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-8">
              Everything You Need to{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Go Viral
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Our comprehensive suite of AI-powered tools designed to maximize your social media success
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
            {[
              {
                icon: <Sparkles className="w-8 h-8" />,
                title: "AI Content Generator",
                description: "Create viral-ready content with our advanced AI that understands your niche, audience, and platform-specific requirements.",
                features: ["Multi-platform optimization", "Trending hashtag integration", "Engagement-focused captions"],
                color: "from-blue-500 to-blue-600",
                demo: "Generate content in seconds",
              },
              {
                icon: <Target className="w-8 h-8" />,
                title: "Viral Predictor",
                description: "Know which content will go viral before you post with our 87% accurate prediction algorithm powered by machine learning.",
                features: ["Real-time scoring", "Trend analysis", "Performance forecasting"],
                color: "from-purple-500 to-purple-600",
                demo: "Predict viral potential",
              },
              {
                icon: <Rocket className="w-8 h-8" />,
                title: "Growth Engine",
                description: "Automate your growth strategy with intelligent posting schedules, audience analysis, and performance optimization.",
                features: ["Smart scheduling", "Audience insights", "Growth automation"],
                color: "from-green-500 to-green-600",
                demo: "Scale your presence",
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
                <p className="text-gray-600 leading-relaxed mb-6">
                  {feature.description}
                </p>
                
                <div className="space-y-3 mb-6">
                  {feature.features.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-sm text-gray-700">{item}</span>
                    </div>
                  ))}
                </div>

                <button className="w-full bg-gradient-to-r from-gray-900 to-gray-800 text-white py-3 px-6 rounded-xl font-medium hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  {feature.demo}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold text-black mb-8">
              How{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Pegasus Works
              </span>
            </h2>
            <p className="text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              From zero to viral in three simple, powerful steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                step: "01",
                title: "Define Your Persona",
                description: "Tell our AI about your niche, style, and goals. Our persona builder creates a custom content strategy tailored to your unique voice and audience.",
                icon: <Brain className="w-12 h-12" />,
                color: "from-blue-500 to-blue-600",
                time: "2 minutes",
              },
              {
                step: "02",
                title: "Generate Viral Content",
                description: "Our AI creates high-quality content optimized for each platform. Get scripts, captions, hashtags, and posting schedules that maximize engagement.",
                icon: <Sparkles className="w-12 h-12" />,
                color: "from-purple-500 to-purple-600",
                time: "5 minutes",
              },
              {
                step: "03",
                title: "Scale & Monetize",
                description: "Watch your following grow exponentially. Our monetization suite helps you turn your influence into income through brand partnerships and direct monetization.",
                icon: <DollarSign className="w-12 h-12" />,
                color: "from-green-500 to-green-600",
                time: "Ongoing",
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
                <p className="text-gray-600 leading-relaxed text-lg mb-4">
                  {step.description}
                </p>
                <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                  <Clock className="w-4 h-4" />
                  {step.time}
                </div>
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
          <Suspense fallback={<div className="min-h-[300px] flex items-center justify-center">Loading testimonials…</div>}>
            <TestimonialCarousel />
          </Suspense>
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
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>340% Average Growth Rate</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Users className="w-4 h-4 text-blue-500" />
                <span>50,000+ Active Creators</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI-Powered Content Creation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
