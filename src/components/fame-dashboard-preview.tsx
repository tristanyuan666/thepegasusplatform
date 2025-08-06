"use client";

import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  Users,
  Eye,
  Heart,
  Share2,
  DollarSign,
  Zap,
  Target,
} from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  color: string;
}

function StatCard({ title, value, change, icon, color }: StatCardProps) {
  const [animatedValue, setAnimatedValue] = useState(0);
  const targetValue = parseInt(value.replace(/[^0-9]/g, ""));

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = targetValue / 50;
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetValue) {
          setAnimatedValue(targetValue);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, 30);
    }, 500);

    return () => clearTimeout(timer);
  }, [targetValue]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20 group hover:scale-105">
      <div className="flex items-center justify-between mb-2 sm:mb-4">
        <div className={`p-2 sm:p-3 rounded-xl bg-gradient-to-r ${color} shadow-lg`}>
          <div className="text-white">{React.cloneElement(icon as React.ReactElement, { className: "w-4 h-4 sm:w-6 sm:h-6" })}</div>
        </div>
        <div
          className={`text-xs sm:text-sm font-semibold px-2 sm:px-3 py-0.5 sm:py-1 rounded-full bg-gradient-to-r ${color} text-white shadow-md`}
        >
          {change}
        </div>
      </div>
      <div className="space-y-1 sm:space-y-2">
        <p className="text-lg sm:text-2xl font-bold text-gray-800">
          {value.includes("K") || value.includes("M") || value.includes("$")
            ? value
            : animatedValue.toLocaleString()}
        </p>
        <p className="text-gray-600 text-xs sm:text-sm font-medium">{title}</p>
      </div>
    </div>
  );
}

function ViralScorePredictor() {
  const [score, setScore] = useState(0);
  const targetScore = 87;

  useEffect(() => {
    const timer = setTimeout(() => {
      let current = 0;
      const increment = targetScore / 100;
      const counter = setInterval(() => {
        current += increment;
        if (current >= targetScore) {
          setScore(targetScore);
          clearInterval(counter);
        } else {
          setScore(Math.floor(current));
        }
      }, 20);
    }, 1000);

    return () => clearTimeout(timer);
  }, [targetScore]);

  return (
    <div className="bg-white/80 backdrop-blur-sm p-4 sm:p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="text-center">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
          Viral Score Predictor
        </h3>
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="rgba(59, 130, 246, 0.1)"
              strokeWidth="8"
              fill="none"
            />
            <circle
              cx="60"
              cy="60"
              r="50"
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 314} 314`}
              className="transition-all duration-1000 ease-out drop-shadow-lg"
              style={{
                filter: `drop-shadow(0 0 8px rgba(59, 130, 246, 0.6))`,
              }}
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3B82F6" />
                <stop offset="50%" stopColor="#8B5CF6" />
                <stop offset="100%" stopColor="#06B6D4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {score}
              </div>
              <div className="text-xs text-gray-500 font-medium">
                VIRAL SCORE
              </div>
            </div>
          </div>
        </div>
        <p className="text-gray-600 text-sm font-medium">
          Your next post has an {score}% chance of going viral
        </p>
      </div>
    </div>
  );
}

function GrowthChart() {
  const [animateChart, setAnimateChart] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setAnimateChart(true), 1000);
    return () => clearTimeout(timer);
  }, []);

  const dataPoints = [30, 45, 40, 65, 55, 75, 70, 85, 80, 95];

  return (
    <div className="bg-white/80 backdrop-blur-sm p-3 sm:p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h3 className="text-base sm:text-lg font-bold text-gray-800">Growth Analytics</h3>
        <div className="flex items-center gap-1 sm:gap-2 text-emerald-600 bg-emerald-50 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full shadow-sm">
          <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4" />
          <span className="text-xs sm:text-sm font-semibold">+85%</span>
        </div>
      </div>
      <div className="h-32 sm:h-40 flex items-end justify-between gap-2 sm:gap-3 p-2 sm:p-4 bg-gray-50/50 rounded-xl">
        {dataPoints.map((height, index) => (
          <div
            key={index}
            className="bg-gradient-to-t from-blue-500 to-blue-400 rounded-t-lg flex-1 transition-all duration-1000 ease-out shadow-md relative"
            style={{
              height: animateChart ? `${height}%` : "0%",
              transitionDelay: `${index * 100}ms`,
              filter: `drop-shadow(0 4px 8px rgba(59, 130, 246, 0.3))`,
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-blue-600/20 to-transparent rounded-t-lg" />
          </div>
        ))}
      </div>
      <div className="flex justify-between text-xs text-gray-500 mt-4 font-medium">
        <span>Jan</span>
        <span>Mar</span>
        <span>May</span>
        <span>Jul</span>
        <span>Sep</span>
      </div>
    </div>
  );
}

export default function FameDashboardPreview() {
  return (
    <section className="py-20 relative overflow-hidden">
      {/* Premium Background with Blur Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50" />
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-10 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-cyan-400/15 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full mb-8 shadow-lg border border-white/30 hover:scale-105 transition-transform duration-300">
            <Zap className="w-5 h-5 text-blue-600 mr-3" />
            <span className="text-gray-800 text-sm font-semibold">
              Analytics Dashboard Preview
            </span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-gray-800">
            Track Your{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Growth Journey
            </span>
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg font-medium">
            Monitor your progress with elegant analytics and real-time insights
          </p>
        </div>

        <div className="max-w-7xl mx-auto">
          {/* Stats Grid with Neumorphic Design - Mobile Optimized */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-8 sm:mb-12">
            <StatCard
              title="Total Followers"
              value="23K"
              change="+18%"
              icon={<Users className="w-6 h-6" />}
              color="from-blue-500 to-cyan-500"
            />
            <StatCard
              title="Monthly Views"
              value="340K"
              change="+25%"
              icon={<Eye className="w-6 h-6" />}
              color="from-purple-500 to-pink-500"
            />
            <StatCard
              title="Engagement Rate"
              value="6.2%"
              change="+8%"
              icon={<Heart className="w-6 h-6" />}
              color="from-pink-500 to-red-500"
            />
            <StatCard
              title="Revenue"
              value="$2,450"
              change="+32%"
              icon={<DollarSign className="w-6 h-6" />}
              color="from-emerald-500 to-green-500"
            />
          </div>

          {/* Dashboard Grid with Glass Morphism - Mobile Optimized */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-8 sm:mb-12">
            <div className="lg:col-span-2">
              <GrowthChart />
            </div>
            <div>
              <ViralScorePredictor />
            </div>
          </div>

          {/* Recent Activity with Enhanced Glass Effect - Mobile Optimized */}
          <div className="bg-white/70 backdrop-blur-md p-4 sm:p-8 rounded-2xl shadow-xl border border-white/30 hover:shadow-2xl transition-all duration-300">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6">
              Recent Activity
            </h3>
            <div className="space-y-4">
              {[
                {
                  platform: "TikTok",
                  content: "Morning routine video",
                  metric: "45K views",
                  color: "text-pink-600",
                  bgColor: "bg-pink-50",
                },
                {
                  platform: "Instagram",
                  content: "Fitness transformation post",
                  metric: "12K likes",
                  color: "text-purple-600",
                  bgColor: "bg-purple-50",
                },
                {
                  platform: "YouTube",
                  content: "How I built my brand",
                  metric: "8K views",
                  color: "text-red-600",
                  bgColor: "bg-red-50",
                },
              ].map((item, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 rounded-xl bg-white/60 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md border border-white/20"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`w-3 h-3 rounded-full ${item.color.replace("text-", "bg-")} shadow-lg`}
                      style={{
                        filter: `drop-shadow(0 0 4px ${item.color.replace("text-", "rgba(").replace("-600", ", 0.5)")})`,
                      }}
                    />
                    <div>
                      <p className="text-gray-900 font-semibold text-sm">
                        {item.content}
                      </p>
                      <p className="text-gray-600 text-xs font-medium">
                        {item.platform}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`font-bold text-sm ${item.color} px-3 py-1 rounded-full ${item.bgColor}`}
                  >
                    {item.metric}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
