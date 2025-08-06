"use client";

import { useState, useEffect } from "react";
import {
  Star,
  TrendingUp,
  Users,
  Play,
  Heart,
  MessageCircle,
  Share2,
  Verified,
} from "lucide-react";

interface TestimonialProps {
  name: string;
  handle: string;
  avatar: string;
  content: string;
  metrics: {
    followers: string;
    growth: string;
    platform: string;
  };
  verified?: boolean;
}

function TestimonialCard({
  name,
  handle,
  avatar,
  content,
  metrics,
  verified = false,
}: TestimonialProps) {
  return (
    <div className="h-full">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <div className="relative">
          <img
            src={avatar}
            alt={name}
            className="w-16 h-16 rounded-full object-cover border-3 border-purple-200 shadow-lg"
          />
          {verified && (
            <div className="absolute -bottom-2 -right-2 w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
              <Verified className="w-4 h-4 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h4 className="font-bold text-gray-900 text-lg">{name}</h4>
          </div>
          <p className="text-gray-500 text-xs">{metrics.platform} Creator</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-700 mb-6 leading-relaxed text-lg font-medium">
        &quot;{content}&quot;
      </p>

      {/* Metrics */}
      <div className="flex items-center justify-between pt-6 border-t border-gray-200">
        <div className="flex items-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-500" />
            <span className="font-bold text-gray-900">{metrics.followers}</span>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-500" />
            <span className="font-bold text-green-600">{metrics.growth}</span>
          </div>
        </div>
        <div className="text-sm text-blue-600 bg-blue-100 px-4 py-2 rounded-full font-semibold">
          {metrics.platform}
        </div>
      </div>
    </div>
  );
}

function ViralPost({ delay = 0 }: { delay?: number }) {
  const [likes, setLikes] = useState(0);
  const [comments, setComments] = useState(0);
  const [shares, setShares] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      // Animate counters
      const animateCounter = (
        setter: (value: number) => void,
        target: number,
      ) => {
        let current = 0;
        const increment = target / 50;
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            setter(target);
            clearInterval(counter);
          } else {
            setter(Math.floor(current));
          }
        }, 30);
      };

      animateCounter(setLikes, 127000);
      setTimeout(() => animateCounter(setComments, 8400), 200);
      setTimeout(() => animateCounter(setShares, 15600), 400);
    }, delay);
  }, [delay]);

  return (
    <div className="glass-card p-6 hover-lift group">
      {/* Post Header */}
      <div className="flex items-center gap-3 mb-4">
        <img
          src="https://api.dicebear.com/7.x/avataaars/svg?seed=viral-creator"
          alt="Creator"
          className="w-10 h-10 rounded-full"
        />
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-white">@viral_creator</span>
            <Verified className="w-4 h-4 text-neon-blue" />
          </div>
          <span className="text-xs text-gray-400">2 hours ago</span>
        </div>
        <div className="bg-red-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
          🔥 VIRAL
        </div>
      </div>

      {/* Post Content */}
      <div className="aspect-video bg-gradient-to-br from-purple-600/20 to-blue-600/20 rounded-xl mb-4 relative overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center mb-2">
              <Play className="w-6 h-6 text-white ml-1" />
            </div>
            <p className="text-white text-sm font-medium">
              &quot;How I gained 50K followers in 30 days&quot;
            </p>
          </div>
        </div>
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm rounded-full px-2 py-1">
          <span className="text-white text-xs">1.2M views</span>
        </div>
      </div>

      {/* Engagement */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 text-pink-400">
            <Heart className="w-5 h-5" />
            <span className="font-medium">{likes.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-blue-400">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{comments.toLocaleString()}</span>
          </div>
          <div className="flex items-center gap-2 text-green-400">
            <Share2 className="w-5 h-5" />
            <span className="font-medium">{shares.toLocaleString()}</span>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-white/10">
        <p className="text-gray-300 text-sm">
          <span className="text-neon-blue font-medium">Pegasus AI</span> helped
          me create this viral hit in just 10 minutes! 🚀
        </p>
      </div>
    </div>
  );
}

function StatsCounter() {
  const [users, setUsers] = useState(0);
  const [content, setContent] = useState(0);
  const [revenue, setRevenue] = useState(0);

  useEffect(() => {
    const animateCounter = (
      setter: (value: number) => void,
      target: number,
      delay: number = 0,
    ) => {
      setTimeout(() => {
        let current = 0;
        const increment = target / 100;
        const counter = setInterval(() => {
          current += increment;
          if (current >= target) {
            setter(target);
            clearInterval(counter);
          } else {
            setter(Math.floor(current));
          }
        }, 20);
      }, delay);
    };

    animateCounter(setUsers, 50000, 0);
    animateCounter(setContent, 10000000, 300);
    animateCounter(setRevenue, 2500000, 600);
  }, []);

  return (
    <div className="text-center py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
        <div className="glass-card p-8">
          <div className="text-4xl font-bold gradient-text mb-2">
            {users.toLocaleString()}+
          </div>
          <div className="text-gray-300">Creators Empowered</div>
        </div>
        <div className="glass-card p-8">
          <div className="text-4xl font-bold gradient-text mb-2">
            {(content / 1000000).toFixed(1)}M+
          </div>
          <div className="text-gray-300">Viral Posts Created</div>
        </div>
        <div className="glass-card p-8">
          <div className="text-4xl font-bold gradient-text mb-2">
            ${(revenue / 1000000).toFixed(1)}M+
          </div>
          <div className="text-gray-300">Creator Revenue Generated</div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const testimonials = [
    {
      name: "Airrack",
      handle: "@airrack",
      avatar: "https://i.postimg.cc/Y9c2yFxd/airrack.jpg",
      content:
        "Pegasus AI revolutionized my YouTube content strategy. The viral prediction feature helped me plan challenges that hit 10M+ views. The content ideas are perfectly tailored for my audience and filming style.",
      metrics: {
        followers: "5.2M",
        growth: "+85%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Matti Haapoja",
      handle: "@mattihaapoja",
      avatar: "https://i.postimg.cc/yNRs9dzc/Matti-Haapoja.jpg",
      content:
        "The video editing content suggestions are genius. Pegasus helped me plan YouTube videos that filmmakers actually find valuable. My retention rate increased by 45%.",
      metrics: {
        followers: "1.8M",
        growth: "+75%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Mads Lewis",
      handle: "@madslewis",
      avatar: "https://i.postimg.cc/8zj1p4Ky/Mads-Lewis.jpg",
      content:
        "Pegasus understands Gen Z trends perfectly. My TikTok content hits different now - consistently getting 500K+ views and my Instagram engagement skyrocketed too.",
      metrics: {
        followers: "1.2M",
        growth: "+150%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Mango Street",
      handle: "@mangostreet",
      avatar: "https://i.postimg.cc/8z9TjvxT/Mango-Street.jpg",
      content:
        "The photography tutorial content planning is incredible. Pegasus helped us create YouTube series that our audience actually wants to watch. Our subscriber growth doubled.",
      metrics: {
        followers: "1.2M",
        growth: "+110%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Sorelle Amore",
      handle: "@sorelleamore",
      avatar: "https://i.postimg.cc/2y0DmL4R/Sorelle-Amore.jpg",
      content:
        "The creative entrepreneurship content strategy is perfect. Pegasus helped me balance photography tutorials with business advice on YouTube. My audience engagement is at an all-time high.",
      metrics: {
        followers: "1.1M",
        growth: "+105%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Hayden Hillier-Smith",
      handle: "@haydenhilliersmith",
      avatar: "https://i.postimg.cc/tJkXTMGc/Hayden-Hillier-Smith.jpg",
      content:
        "As a filmmaker, the AI understands cinematography trends better than most humans. Pegasus helped me optimize my YouTube uploads and my channel grew 40% faster than before.",
      metrics: {
        followers: "900K",
        growth: "+140%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Sean Tucker",
      handle: "@seantucker",
      avatar: "https://i.postimg.cc/1tZPKQ9T/Sean-Tucker.jpg",
      content:
        "The philosophical photography content planning is remarkable. Pegasus understands my niche and helped me create YouTube videos that truly connect with photographers on a deeper level.",
      metrics: {
        followers: "800K",
        growth: "+90%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Kara and Nate",
      handle: "@karaandnate",
      avatar: "https://i.postimg.cc/vHPYwkzg/Kara-and-Nate.jpg",
      content:
        "Pegasus helped us plan our travel content strategy better. The AI suggests destinations and video angles that our audience loves. Our engagement rate doubled since using the platform.",
      metrics: {
        followers: "800K",
        growth: "+95%",
        platform: "YouTube",
      },
      verified: true,
    },
  ];

  return (
    <section className="py-32 section-gradient relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="particles">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="particle"
              style={{
                left: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 8}s`,
                animationDuration: `${8 + Math.random() * 4}s`,
              }}
            />
          ))}
        </div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Premium Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-8 py-4 glass-premium mb-8 hover-lift">
            <Star className="w-6 h-6 text-yellow-500 mr-3 hover-float" />
            <span className="text-gray-800 text-base font-semibold">
              Success Stories from Real Creators
            </span>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-gray-900">
            Join the{" "}
            <span className="gradient-text-premium">Fame Revolution</span>
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-xl leading-relaxed">
            See how creators are transforming their lives and building
            million-dollar brands with Pegasus AI
          </p>
        </div>

        {/* Endless Scrolling Testimonials */}
        <div className="mb-20">
          <div className="overflow-hidden">
            <div className="scroll-left flex gap-8 py-8">
              {[
                ...testimonials,
                ...testimonials,
                ...testimonials,
                ...testimonials,
                ...testimonials,
              ].map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-96 glass-premium p-8 hover-lift"
                >
                  <TestimonialCard {...testimonial} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Premium FOMO Banner */}
        <div className="text-center">
          <div className="glass-premium p-12 max-w-4xl mx-auto hover-lift light-trail">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Join the Creator Community
            </h3>
            <p className="text-gray-700 mb-8 text-lg leading-relaxed">
              Join 50,000+ creators who are already building their influence
              with Pegasus AI. Start your creator journey today.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 text-base text-gray-600">
              <div className="flex items-center gap-3 glass-premium px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="font-semibold">No setup fees</span>
              </div>
              <div className="flex items-center gap-3 glass-premium px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-semibold">Cancel anytime</span>
              </div>
              <div className="flex items-center gap-3 glass-premium px-6 py-3 rounded-full">
                <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" />
                <span className="font-semibold">Results in 24-48 hours</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
