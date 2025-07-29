"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { createClient } from "../../supabase/client";
import {
  ArrowRight,
  Play,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Star,
  Flame,
  Crown,
  Rocket,
  Heart,
  MessageCircle,
  Share2,
  Eye,
  DollarSign,
} from "lucide-react";

// Simple typewriter component without dynamic import
function TypewriterText({ isMounted }: { isMounted: boolean }) {
  const [currentText, setCurrentText] = useState(0);
  const [displayText, setDisplayText] = useState(
    "Create Viral Content with AI",
  );
  const [isDeleting, setIsDeleting] = useState(false);

  const texts = [
    "Create Viral Content with AI",
    "Build Your Content Empire",
    "Transform Ideas into Fame",
    "Grow Your Influence",
  ];

  useEffect(() => {
    if (
      !isMounted ||
      typeof window === "undefined" ||
      typeof setTimeout === "undefined"
    ) {
      return;
    }

    try {
      const currentFullText = texts[currentText];
      const timeout = setTimeout(
        () => {
          if (!isDeleting) {
            if (displayText.length < currentFullText.length) {
              setDisplayText(currentFullText.slice(0, displayText.length + 1));
            } else {
              setTimeout(() => setIsDeleting(true), 2500);
            }
          } else {
            if (displayText.length > 0) {
              setDisplayText(displayText.slice(0, -1));
            } else {
              setIsDeleting(false);
              setCurrentText((prev) => (prev + 1) % texts.length);
            }
          }
        },
        isDeleting ? 50 : 120,
      );
      return () => {
        if (typeof clearTimeout !== "undefined") {
          clearTimeout(timeout);
        }
      };
    } catch (error) {
      console.warn("Typewriter effect error:", error);
    }
  }, [displayText, isDeleting, currentText, texts, isMounted]);

  // Always show the same content on server and initial client render
  const staticText = "Create Viral Content with AI";
  const showText =
    isMounted && typeof window !== "undefined" ? displayText : staticText;

  return (
    <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-gray-900 mb-4 tracking-tight animate-slide-up min-h-[3rem] sm:min-h-[4rem] flex items-center justify-center text-center px-4 sm:px-0 leading-tight">
      <span className="gradient-text-hero">{showText}</span>
      {isMounted && typeof window !== "undefined" && (
        <span className="border-r-2 border-blue-600 animate-pulse ml-2 h-6 sm:h-8">
          |
        </span>
      )}
    </h1>
  );
}

// Simple floating particles without dynamic import
function FloatingParticles({ isMounted }: { isMounted: boolean }) {
  const [particles, setParticles] = useState<
    Array<{
      id: number;
      left: number;
      delay: number;
      size: number;
      color: string;
    }>
  >([]);

  useEffect(() => {
    if (
      !isMounted ||
      typeof window === "undefined" ||
      typeof Math === "undefined"
    ) {
      return;
    }

    try {
      const colors = ["#3B82F6", "#1D4ED8", "#1E40AF", "#2563EB", "#1E3A8A"];
      setParticles(
        Array.from({ length: 40 }, (_, i) => ({
          id: i,
          left: Math.random() * 100,
          delay: Math.random() * 20,
          size: 3 + Math.random() * 5,
          color: colors[Math.floor(Math.random() * colors.length)],
        })),
      );
    } catch (error) {
      console.warn("Particles initialization error:", error);
    }
  }, [isMounted]);

  if (!isMounted || particles.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className="particle"
          style={{
            left: `${particle.left}%`,
            animationDelay: `${particle.delay}s`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            background: `linear-gradient(45deg, ${particle.color}, ${particle.color}80)`,
            boxShadow: `0 0 ${particle.size * 2}px ${particle.color}40`,
          }}
        />
      ))}
    </div>
  );
}

// Simple animated background without dynamic import
function AnimatedBackground({ isMounted }: { isMounted: boolean }) {
  return (
    <>
      {/* Enhanced Premium Background with Blue Blur Gradients */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-blue-50/30 to-white" />

      {/* Enhanced Blue Blur Gradient Circles with More Intensity */}
      <div className="absolute top-10 left-5 w-[500px] h-[500px] bg-gradient-to-r from-blue-500/25 to-cyan-500/18 rounded-full blur-3xl animate-float" />
      <div
        className="absolute top-32 right-10 w-[450px] h-[450px] bg-gradient-to-l from-blue-600/22 to-indigo-600/15 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "2s" }}
      />
      <div
        className="absolute bottom-10 left-1/3 w-[400px] h-[400px] bg-gradient-to-br from-blue-400/20 to-blue-700/12 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "4s" }}
      />
      <div
        className="absolute top-1/2 right-1/4 w-[350px] h-[350px] bg-gradient-to-tl from-purple-500/15 to-blue-500/10 rounded-full blur-3xl animate-float"
        style={{ animationDelay: "6s" }}
      />

      {/* Floating Particles */}
      <FloatingParticles isMounted={isMounted} />

      {/* Additional Floating Blue Gradient Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Particle 1 */}
        <div className="particle" style={{ left: '5%', animationDelay: '0s' }}></div>
        <div className="particle" style={{ left: '15%', animationDelay: '1s' }}></div>
        <div className="particle" style={{ left: '25%', animationDelay: '2s' }}></div>
        <div className="particle" style={{ left: '35%', animationDelay: '3s' }}></div>
        <div className="particle" style={{ left: '45%', animationDelay: '4s' }}></div>
        <div className="particle" style={{ left: '55%', animationDelay: '5s' }}></div>
        <div className="particle" style={{ left: '65%', animationDelay: '6s' }}></div>
        <div className="particle" style={{ left: '75%', animationDelay: '7s' }}></div>
        <div className="particle" style={{ left: '85%', animationDelay: '8s' }}></div>
        <div className="particle" style={{ left: '95%', animationDelay: '9s' }}></div>
        <div className="particle" style={{ left: '10%', animationDelay: '10s' }}></div>
        <div className="particle" style={{ left: '20%', animationDelay: '11s' }}></div>
        <div className="particle" style={{ left: '30%', animationDelay: '12s' }}></div>
        <div className="particle" style={{ left: '40%', animationDelay: '13s' }}></div>
        <div className="particle" style={{ left: '50%', animationDelay: '14s' }}></div>
        <div className="particle" style={{ left: '60%', animationDelay: '15s' }}></div>
        <div className="particle" style={{ left: '70%', animationDelay: '16s' }}></div>
        <div className="particle" style={{ left: '80%', animationDelay: '17s' }}></div>
        <div className="particle" style={{ left: '90%', animationDelay: '18s' }}></div>
        <div className="particle" style={{ left: '8%', animationDelay: '19s' }}></div>
      </div>

      {/* Grid pattern overlay with premium feel */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg%20width%3D%2280%22%20height%3D%2280%22%20viewBox%3D%220%200%2080%2080%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%3Cg%20fill%3D%22%231d8ff2%22%20fill-opacity%3D%220.03%22%3E%3Ccircle%20cx%3D%2240%22%20cy%3D%2240%22%20r%3D%222%22/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-60" />
    </>
  );
}

// Simple interactive dashboard without dynamic import
function InteractiveDashboardDemo({ isMounted }: { isMounted: boolean }) {
  const [activeMetric, setActiveMetric] = useState(0);
  const [followerCount, setFollowerCount] = useState(127000);

  useEffect(() => {
    if (
      !isMounted ||
      typeof window === "undefined" ||
      typeof setInterval === "undefined"
    ) {
      return;
    }

    try {
      const interval = setInterval(() => {
        setActiveMetric((prev) => (prev + 1) % 3);
        if (Math.random() < 0.3) {
          setFollowerCount((prev) => prev + Math.floor(Math.random() * 50));
        }
      }, 2000);
      return () => {
        if (typeof clearInterval !== "undefined") {
          clearInterval(interval);
        }
      };
    } catch (error) {
      console.warn("Dashboard demo interval error:", error);
    }
  }, [isMounted]);

  if (!isMounted || typeof window === "undefined") {
    return (
      <div className="relative max-w-6xl mx-auto mt-16">
        <div className="glass-premium p-8 hover-lift transition-all duration-300">
          <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  Creator Dashboard
                </h3>
                <p className="text-sm text-gray-600">
                  Real-time performance metrics
                </p>
              </div>
              <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-500 rounded-full" />
                Live Data
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                {
                  label: "Followers",
                  value: "127,000",
                  change: "+23%",
                  color: "text-blue-500",
                  icon: "followers",
                },
                {
                  label: "Views",
                  value: "2.4M",
                  change: "+45%",
                  color: "text-purple-500",
                  icon: "views",
                },
                {
                  label: "Engagement",
                  value: "8.7%",
                  change: "+12%",
                  color: "text-green-500",
                  icon: "engagement",
                },
                {
                  label: "Revenue",
                  value: "$12.4K",
                  change: "+67%",
                  color: "text-orange-500",
                  icon: "revenue",
                },
              ].map((metric, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-3 border border-gray-200"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                      {metric.icon === "followers" && (
                        <Users className="w-3 h-3 text-white" />
                      )}
                      {metric.icon === "views" && (
                        <Eye className="w-3 h-3 text-white" />
                      )}
                      {metric.icon === "engagement" && (
                        <Heart className="w-3 h-3 text-white" />
                      )}
                      {metric.icon === "revenue" && (
                        <DollarSign className="w-3 h-3 text-white" />
                      )}
                    </div>
                    <div className="text-xs text-gray-600">{metric.label}</div>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1">
                    {metric.value}
                  </div>
                  <div className={`text-xs font-medium ${metric.color}`}>
                    {metric.change}
                  </div>
                </div>
              ))}
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Growth Analytics
                  </h4>
                  <div className="text-sm text-blue-600 font-medium">
                    +127% this month
                  </div>
                </div>
                <div className="h-40 flex items-end justify-between gap-1">
                  {[25, 40, 35, 55, 45, 70, 60, 80, 65, 90, 75, 100, 85, 110].map(
                    (height, index) => (
                      <div
                        key={index}
                        className="bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 rounded-t flex-1 hover:scale-y-110 transition-all duration-300 cursor-pointer"
                        style={{ 
                          height: `${height}%`, 
                          minHeight: "8px",
                          transitionDelay: `${index * 25}ms`
                        }}
                      />
                    ),
                  )}
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-2">
                  <span>Week 1</span>
                  <span>Week 2</span>
                  <span>Week 3</span>
                  <span>Week 4</span>
                </div>
              </div>
              <div className="bg-white rounded-xl p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">
                  Recent Content
                </h4>
                <div className="space-y-2">
                  {[
                    {
                      title: "How I Gained 100K Followers",
                      platform: "TikTok",
                      views: "2.1M",
                    },
                    {
                      title: "My $10K Creator Strategy",
                      platform: "Instagram",
                      views: "890K",
                    },
                    {
                      title: "AI Tools That Changed My Life",
                      platform: "YouTube",
                      views: "1.5M",
                    },
                  ].map((content, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg"
                    >
                      <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                        {content.platform === "TikTok" && "T"}
                        {content.platform === "Instagram" && "I"}
                        {content.platform === "YouTube" && "Y"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium text-gray-900 truncate">
                          {content.title}
                        </div>
                        <div className="text-xs text-gray-500">
                          {content.views} views
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 text-center">
            <h3 className="text-gray-900 font-semibold text-lg mb-2">
              Interactive Dashboard Experience
            </h3>
            <p className="text-gray-600 text-sm">
              Real-time analytics and growth tracking for your content empire
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative max-w-6xl mx-auto mt-16">
      <div className="glass-premium p-8 hover-lift transition-all duration-300">
        <div className="bg-gradient-to-br from-gray-50 to-white rounded-2xl p-6 border border-gray-200">
          {/* Dashboard Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Creator Dashboard
              </h3>
              <p className="text-sm text-gray-600">
                Real-time performance metrics
              </p>
            </div>
            <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              Live Data
            </div>
          </div>

          {/* Enhanced Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
            {[
              {
                label: "Followers",
                value: followerCount.toLocaleString(),
                change: "+23%",
                color: "text-blue-500",
                icon: "followers",
              },
              {
                label: "Views",
                value: "2.4M",
                change: "+45%",
                color: "text-purple-500",
                icon: "views",
              },
              {
                label: "Engagement",
                value: "8.7%",
                change: "+12%",
                color: "text-green-500",
                icon: "engagement",
              },
              {
                label: "Revenue",
                value: "$12.4K",
                change: "+67%",
                color: "text-orange-500",
                icon: "revenue",
              },
            ].map((metric, index) => (
              <div
                key={index}
                className={`bg-white rounded-xl p-3 border transition-all duration-300 hover:shadow-md ${
                  activeMetric === index
                    ? "border-blue-300 shadow-lg scale-105"
                    : "border-gray-200"
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-5 h-5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
                    {metric.icon === "followers" && (
                      <Users className="w-3 h-3 text-white" />
                    )}
                    {metric.icon === "views" && (
                      <Eye className="w-3 h-3 text-white" />
                    )}
                    {metric.icon === "engagement" && (
                      <Heart className="w-3 h-3 text-white" />
                    )}
                    {metric.icon === "revenue" && (
                      <DollarSign className="w-3 h-3 text-white" />
                    )}
                  </div>
                  <div className="text-xs text-gray-600">{metric.label}</div>
                </div>
                <div className="text-xl font-bold text-gray-900 mb-1">
                  {metric.value}
                </div>
                <div className={`text-xs font-medium ${metric.color}`}>
                  {metric.change}
                </div>
              </div>
            ))}
          </div>

          {/* Enhanced Chart with Content Preview */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium text-gray-900 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    Growth Analytics
                  </h4>
                <div className="text-sm text-blue-600 font-medium">
                  +127% this month
                </div>
              </div>
              <div className="h-40 flex items-end justify-between gap-1">
                {[25, 40, 35, 55, 45, 70, 60, 80, 65, 90, 75, 100, 85, 110].map(
                  (height, index) => (
                    <div
                      key={index}
                      className="bg-gradient-to-t from-blue-500 via-blue-400 to-blue-300 rounded-t flex-1 hover:scale-y-110 transition-all duration-300 cursor-pointer"
                      style={{
                        height: `${height}%`,
                        transitionDelay: `${index * 25}ms`,
                        minHeight: "8px",
                      }}
                    />
                  ),
                )}
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>Week 1</span>
                <span>Week 2</span>
                <span>Week 3</span>
                <span>Week 4</span>
              </div>
            </div>

            <div className="bg-white rounded-xl p-4 border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-3">Recent Content</h4>
              <div className="space-y-2">
                {[
                  {
                    title: "How I Gained 100K Followers",
                    platform: "TikTok",
                    views: "2.1M",
                  },
                  {
                    title: "My $10K Creator Strategy",
                    platform: "Instagram",
                    views: "890K",
                  },
                  {
                    title: "AI Tools That Changed My Life",
                    platform: "YouTube",
                    views: "1.5M",
                  },
                ].map((content, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-2 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                      {content.platform === "TikTok" && "T"}
                      {content.platform === "Instagram" && "I"}
                      {content.platform === "YouTube" && "Y"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-medium text-gray-900 truncate">
                        {content.title}
                      </div>
                      <div className="text-xs text-gray-500">
                        {content.views} views
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <h3 className="text-gray-900 font-semibold text-lg mb-2">
            Interactive Dashboard Experience
          </h3>
          <p className="text-gray-600 text-sm">
            Real-time analytics and growth tracking for your content empire
          </p>
        </div>
      </div>
    </div>
  );
}

// Simple stats counter without dynamic import
function StatsCounter({ isMounted }: { isMounted: boolean }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
      <div
        className="glass-premium p-4 text-center hover-lift card-3d micro-bounce group transform-3d hover-target interactive-element card"
        data-interactive="true"
        data-card="true"
      >
        <TrendingUp className="w-6 h-6 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold gradient-text-primary mb-1 font-display">
          50K+
        </div>
        <div className="text-gray-600 text-xs font-medium font-body">
          Creators Empowered
        </div>
      </div>

      <div
        className="glass-premium p-4 text-center hover-lift card-3d micro-bounce group transform-3d hover-target interactive-element card"
        data-interactive="true"
        data-card="true"
      >
        <Zap className="w-6 h-6 text-purple-600 mx-auto mb-2" />
        <div
          className="text-2xl font-bold gradient-text-primary mb-1 font-display"
          data-metric="1B+"
        >
          1B+
        </div>
        <div className="text-gray-600 text-xs font-medium font-body">
          Viral Views Generated
        </div>
      </div>

      <div
        className="glass-premium p-4 text-center hover-lift card-3d micro-bounce group transform-3d hover-target interactive-element card"
        data-interactive="true"
        data-card="true"
      >
        <Star className="w-6 h-6 text-pink-600 mx-auto mb-2" />
        <div
          className="text-2xl font-bold gradient-text-primary mb-1 font-display"
          data-metric="$25M+"
        >
          $25M+
        </div>
        <div className="text-gray-600 text-xs font-medium font-body">
          Creator Revenue Generated
        </div>
      </div>
    </div>
  );
}

// Simple floating icons without dynamic import
function FloatingIcons() {
  const icons = [
    { Icon: Crown, delay: 0, position: { top: "20%", left: "10%" } },
    { Icon: Flame, delay: 1, position: { top: "30%", right: "15%" } },
    { Icon: Rocket, delay: 2, position: { top: "60%", left: "5%" } },
    { Icon: Star, delay: 3, position: { top: "70%", right: "10%" } },
    { Icon: Zap, delay: 4, position: { top: "40%", left: "85%" } },
  ];

  return (
    <>
      {icons.map(({ Icon, delay, position }, index) => (
        <div
          key={index}
          className="absolute animate-float sparkle"
          style={{
            ...position,
            animationDelay: `${delay}s`,
          }}
        >
          <div className="glass-premium p-3 rounded-full">
            <Icon className="w-6 h-6 text-pegasus-primary" />
          </div>
        </div>
      ))}
    </>
  );
}

function CreatorShowcase() {
  return (
    <div className="max-w-4xl mx-auto mb-12">
      <div className="text-center mb-8">
        <p className="text-sm text-gray-600 font-medium">
          Trusted by 50,000+ creators worldwide
        </p>
      </div>
    </div>
  );
}

// Main Hero component - now a regular client component
export default function Hero() {
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkUserStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Check if user has active subscription
          const { data: subscription } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .single();

          setHasSubscription(!!subscription);
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [isMounted, supabase]);

  const getBuildFameHref = () => {
    if (isLoading) return "/pricing";

    if (!user) {
      // User not logged in: Take them to pricing page
      return "/pricing";
    } else if (hasSubscription) {
      // User logged in with subscription: Take them to dashboard
      return "/dashboard";
    } else {
      // User logged in without subscription: Take them to dashboard settings (subscription management)
      return "/dashboard?tab=settings";
    }
  };

  const getGetStartedHref = () => {
    if (isLoading) return "/pricing";

    if (!user) {
      // User not logged in: Take them to pricing page
      return "/pricing";
    } else if (hasSubscription) {
      // User logged in with subscription: Take them to dashboard
      return "/dashboard";
    } else {
      // User logged in without subscription: Take them to dashboard settings (subscription management)
      return "/dashboard?tab=settings";
    }
  };

  // Always render the same structure to prevent hydration mismatch
  const showAnimations = isMounted;

  return (
    <div className="relative min-h-screen overflow-hidden hero-gradient">
      <AnimatedBackground isMounted={isMounted} />
      <FloatingIcons />

      <div className="relative z-10 pt-24 pb-16">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-6xl mx-auto">
            {/* Premium Badge - Smaller */}
            <div
              className="inline-flex items-center px-6 py-2 glass-premium mb-8 animate-fade-in hover-lift hover-target interactive-element button"
              data-interactive="true"
              data-button="true"
            >
              <Sparkles className="w-4 h-4 text-blue-600 mr-2" />
              <span className="text-gray-800 text-sm font-medium">
                AI-Powered Content Creation Platform
              </span>
            </div>

            {/* Enhanced Typewriter Headline - Mobile Optimized */}
            <div className="mb-6">
              <TypewriterText isMounted={isMounted} />
            </div>

            {/* Premium Subheadline - Mobile Optimized */}
            <p
              className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-600 mb-8 sm:mb-10 max-w-5xl mx-auto leading-relaxed animate-slide-up px-4 sm:px-0"
              style={{ animationDelay: "200ms" }}
            >
              Transform into an{" "}
              <span className="gradient-text font-medium">
                influential content creator
              </span>{" "}
              with AI-powered automation. Build, grow, and monetize your social
              media presence.
            </p>

            {/* Enhanced CTA Buttons - Mobile Optimized */}
            <div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8 sm:mb-12 animate-slide-up px-4 sm:px-0"
              style={{ animationDelay: "400ms" }}
            >
              <Link
                href={getBuildFameHref()}
                className="group relative w-full sm:w-auto px-8 py-4 sm:py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold text-base sm:text-base rounded-xl shadow-lg hover-lift overflow-hidden transition-all duration-300 hover-target interactive-element magnetic button link min-h-[52px] flex items-center justify-center"
                data-interactive="true"
                data-button="true"
                data-link="true"
              >
                <span className="relative z-10 flex items-center gap-2">
                  {!user
                    ? "Start Creating"
                    : hasSubscription
                      ? "Go to Dashboard"
                      : "Start Creating"}
                  <ArrowRight className="w-5 h-5" />
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Link>

              <Link
                href={getGetStartedHref()}
                className="group glass-premium w-full sm:w-auto px-8 py-4 sm:py-4 text-gray-800 font-semibold text-base sm:text-base transition-all duration-300 hover:bg-white/60 flex items-center justify-center gap-3 hover-lift rounded-xl hover-target interactive-element magnetic button link min-h-[52px]"
                data-interactive="true"
                data-button="true"
                data-link="true"
              >
                <div className="w-6 h-6 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <span>{!user ? "Get Started" : "Explore Features"}</span>
              </Link>
            </div>

            {/* Creator Showcase - Smaller */}
            <div
              className="animate-slide-up mb-12"
              style={{ animationDelay: "600ms" }}
            >
              <CreatorShowcase />
            </div>

            {/* Enhanced Stats - Smaller */}
            <div
              className="animate-slide-up mb-16"
              style={{ animationDelay: "800ms" }}
            >
              <div data-hero-metrics>
                <StatsCounter isMounted={isMounted} />
              </div>
            </div>

            {/* Interactive Dashboard Demo */}
            <div
              className="animate-slide-up mb-12"
              style={{ animationDelay: "1000ms" }}
            >
              <InteractiveDashboardDemo isMounted={isMounted} />
            </div>

            {/* Trust Indicators - Smaller */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center text-gray-600 text-sm">
              <div className="flex items-center gap-2 glass-premium px-4 py-2 rounded-full hover-lift">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                <span className="font-medium">Results in 24-48 hours</span>
              </div>
              <div className="flex items-center gap-2 glass-premium px-4 py-2 rounded-full hover-lift">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-medium">Premium AI Platform</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
