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
      name: "Sarah Chen",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&fit=crop&crop=face",
      content:
        "Pegasus helped me grow my fitness content from 2K to 50K followers in 6 months. The AI suggestions really improved my content quality and I started getting consistent engagement. It's been a game-changer for my fitness brand.",
      metrics: {
        followers: "52K",
        growth: "+180%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Marcus Johnson",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face",
      content:
        "Started using Pegasus 4 months ago for my finance content. The AI helps me create better posts and I've seen steady growth. My best post got 180K views and helped me land some brand partnerships. Really happy with the results.",
      metrics: {
        followers: "34K",
        growth: "+120%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Emma Rodriguez",
      handle: "lifestyle_emma",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&fit=crop&crop=face",
      content:
        "The persona builder helped me find my content style and voice. My YouTube channel has grown from 8K to 45K subscribers over the past year. The content planning features are really useful for staying consistent.",
      metrics: {
        followers: "45K",
        growth: "+150%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Alex Thompson",
      handle: "techreview_alex",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&fit=crop&crop=face",
      content:
        "Pegasus saved me 20+ hours per week on content creation. The automation is incredible - it schedules posts at optimal times and even responds to comments. My tech reviews now reach millions instead of hundreds.",
      metrics: {
        followers: "73K",
        growth: "+190%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Jessica Park",
      handle: "jessicacooks",
      avatar:
        "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&q=80&fit=crop&crop=face",
      content:
        "The monetization insights are pure gold. Pegasus identified brand partnership opportunities I never would have found. I've secured deals with 3 major food brands worth $45K total this quarter.",
      metrics: {
        followers: "94K",
        growth: "+260%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "David Kim",
      handle: "davidtech",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&q=80&fit=crop&crop=face",
      content:
        "The analytics dashboard is like having a crystal ball for content performance. It predicted my viral video 3 days before I posted it. Now I consistently create content that gets 100K+ views.",
      metrics: {
        followers: "112K",
        growth: "+310%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Riley Martinez",
      handle: "creativeriles",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&fit=crop&crop=face",
      content:
        "The AI content suggestions are spot-on for my creative niche. I've tripled my engagement rate and my posts consistently hit the explore page. Pegasus understands my brand better than I do sometimes.",
      metrics: {
        followers: "89K",
        growth: "+245%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Jordan Blake",
      handle: "jordanfitpro",
      avatar:
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80&fit=crop&crop=face",
      content:
        "From 500 to 75K followers in 8 months using Pegasus. The viral score predictor helped me identify which content would perform best. My fitness coaching business has exploded thanks to this platform.",
      metrics: {
        followers: "75K",
        growth: "+320%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Maya Patel",
      handle: "techwithmaya",
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80&fit=crop&crop=face",
      content:
        "As a tech reviewer, staying relevant is crucial. Pegasus helps me create content that resonates with my audience and keeps me ahead of trends. My subscriber growth has been phenomenal.",
      metrics: {
        followers: "156K",
        growth: "+280%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Carlos Rodriguez",
      handle: "carloscreatess",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&fit=crop&crop=face",
      content:
        "The content scheduling and optimization features saved me countless hours. I can focus on creating while Pegasus handles the strategy. My engagement rates have never been higher.",
      metrics: {
        followers: "67K",
        growth: "+195%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Zoe Williams",
      handle: "zoelifestyle",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80&fit=crop&crop=face",
      content:
        "Pegasus transformed my lifestyle brand completely. The AI understands my aesthetic and helps me create cohesive content that my audience loves. Brand partnerships started flowing in after just 3 months.",
      metrics: {
        followers: "134K",
        growth: "+410%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Tyler Chen",
      handle: "tylertechtalks",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face",
      content:
        "The analytics insights are incredible. Pegasus showed me exactly when and what to post for maximum reach. My tech content now regularly gets featured and I've built a loyal community.",
      metrics: {
        followers: "98K",
        growth: "+265%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Sophia Martinez",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80&fit=crop&crop=face",
      content:
        "The content scheduling feature is incredible. I can plan weeks ahead and the AI optimizes posting times for maximum reach. My engagement has doubled since I started using Pegasus.",
      metrics: {
        followers: "87K",
        growth: "+220%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "James Wilson",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80&fit=crop&crop=face",
      content:
        "As a travel blogger, staying consistent was my biggest challenge. Pegasus changed everything - now I create content that resonates with my audience and my follower count keeps growing.",
      metrics: {
        followers: "63K",
        growth: "+175%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Isabella Garcia",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&q=80&fit=crop&crop=face",
      content:
        "The viral score predictor is amazing! It helped me identify which posts would perform best. My cooking videos now consistently get over 500K views and I've built a loyal community.",
      metrics: {
        followers: "142K",
        growth: "+380%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Michael Brown",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face",
      content:
        "Pegasus transformed my business content strategy. The AI understands my niche perfectly and helps me create posts that drive real engagement and leads for my consulting business.",
      metrics: {
        followers: "78K",
        growth: "+195%",
        platform: "LinkedIn",
      },
      verified: true,
    },
    {
      name: "Olivia Taylor",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80&fit=crop&crop=face",
      content:
        "The analytics insights are incredible. I can see exactly what my audience wants and when they're most active. My fashion content now reaches millions and brands are reaching out to me.",
      metrics: {
        followers: "156K",
        growth: "+290%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Daniel Lee",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80&fit=crop&crop=face",
      content:
        "From zero to 100K subscribers in 8 months! The content suggestions are spot-on and the scheduling automation saves me hours every week. Best investment I've made for my channel.",
      metrics: {
        followers: "103K",
        growth: "+450%",
        platform: "YouTube",
      },
      verified: true,
    },
    {
      name: "Ava Johnson",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80&fit=crop&crop=face",
      content:
        "The persona builder helped me find my unique voice in the wellness space. My content now feels authentic and my audience engagement has skyrocketed. Pegasus is a game-changer.",
      metrics: {
        followers: "91K",
        growth: "+235%",
        platform: "TikTok",
      },
      verified: true,
    },
    {
      name: "Ethan Davis",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&q=80&fit=crop&crop=face",
      content:
        "The monetization features are incredible. Pegasus helped me identify brand partnership opportunities and optimize my content for maximum revenue. I've tripled my income this year.",
      metrics: {
        followers: "124K",
        growth: "+315%",
        platform: "Instagram",
      },
      verified: true,
    },
    {
      name: "Mia Rodriguez",
      handle: "",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80&fit=crop&crop=face",
      content:
        "As a fitness influencer, consistency was key. Pegasus helps me maintain a steady flow of engaging content and my community has grown beyond my wildest dreams. The results speak for themselves.",
      metrics: {
        followers: "167K",
        growth: "+340%",
        platform: "TikTok",
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
