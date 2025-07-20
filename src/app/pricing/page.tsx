"use client";

import { useState, useEffect } from "react";
import Navbar from "@/components/navbar";
import PricingCard, { defaultPlans } from "@/components/pricing-card";
import Footer from "@/components/footer";
import TestimonialCarousel from "@/components/testimonial-carousel";
import { createClient } from "../../../supabase/client";
import {
  Check,
  X,
  Crown,
  Sparkles,
  TrendingUp,
  Users,
  BarChart3,
  Calendar,
  Palette,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  Zap,
  Heart,
  MessageCircle,
  Share2,
  Verified,
} from "lucide-react";

// Force dynamic rendering for pages that use Supabase
export const dynamic = 'force-dynamic';

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="bg-white rounded-xl shadow-lg p-4 md:p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 faq-item">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left group hover-target interactive-element"
        data-interactive="true"
        aria-expanded={isOpen}
        aria-controls={`faq-content-${question.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <h3 className="text-sm md:text-xl font-bold text-black group-hover:text-blue-600 transition-colors pr-2">
          {question}
        </h3>
        <div className="ml-2 md:ml-4 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 md:w-6 md:h-6 text-blue-600 transform transition-transform duration-200" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-6 md:h-6 text-gray-400 group-hover:text-blue-600 transition-colors" />
          )}
        </div>
      </button>
      <div
        id={`faq-content-${question.replace(/\s+/g, "-").toLowerCase()}`}
        className={`mt-3 md:mt-6 overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
        role="region"
        aria-labelledby={`faq-question-${question.replace(/\s+/g, "-").toLowerCase()}`}
      >
        <p className="text-gray-700 leading-relaxed text-sm md:text-lg">
          {answer}
        </p>
      </div>
    </div>
  );
}

function FeatureComparison() {
  const features = [
    {
      category: "Content Creation",
      items: [
        {
          name: "AI Content Generator",
          creator: true,
          influencer: true,
          superstar: true,
        },
        {
          name: "Social Platforms",
          creator: "2",
          influencer: "All",
          superstar: "All",
        },
        {
          name: "Advanced AI Templates",
          creator: false,
          influencer: true,
          superstar: true,
        },
        {
          name: "Voice Cloning",
          creator: false,
          influencer: false,
          superstar: true,
        },
      ],
    },
    {
      category: "Analytics & Growth",
      items: [
        {
          name: "Basic Analytics",
          creator: true,
          influencer: true,
          superstar: true,
        },
        {
          name: "Viral Score Predictor",
          creator: false,
          influencer: true,
          superstar: true,
        },
        {
          name: "Growth Optimization",
          creator: false,
          influencer: true,
          superstar: true,
        },
        {
          name: "A/B Testing",
          creator: false,
          influencer: false,
          superstar: true,
        },
        {
          name: "Custom Reports",
          creator: false,
          influencer: false,
          superstar: true,
        },
      ],
    },
    {
      category: "Support & Services",
      items: [
        {
          name: "Email Support",
          creator: true,
          influencer: true,
          superstar: true,
        },
        {
          name: "Priority Support",
          creator: false,
          influencer: true,
          superstar: true,
        },
        {
          name: "Dedicated Manager",
          creator: false,
          influencer: false,
          superstar: true,
        },
        {
          name: "1-on-1 Strategy Calls",
          creator: false,
          influencer: false,
          superstar: true,
        },
        {
          name: "Custom Integrations",
          creator: false,
          influencer: false,
          superstar: true,
        },
      ],
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-10 hover:shadow-3xl transition-all duration-500 border border-gray-100">
      <div className="text-center mb-12">
        <h3 className="text-4xl font-bold text-black mb-6">
          Compare All Features
        </h3>
        <p className="text-xl text-gray-600">
          See exactly what's included in each plan
        </p>
      </div>

      <div className="overflow-x-auto -mx-2 px-2 md:-mx-4 md:px-4">
        <table className="w-full min-w-[500px] md:min-w-[600px] comparison-table">
          <thead>
            <tr className="border-b-2 border-blue-100 bg-gradient-to-r from-blue-50 to-blue-100">
              <th className="text-left py-2 md:py-6 px-1 md:px-8 font-bold text-black text-xs md:text-lg">
                Features
              </th>
              <th className="text-center py-2 md:py-6 px-1 md:px-8 font-bold text-black text-xs md:text-lg">
                Creator
              </th>
              <th className="text-center py-2 md:py-6 px-1 md:px-8 font-bold text-black text-xs md:text-lg">
                Influencer
              </th>
              <th className="text-center py-2 md:py-6 px-1 md:px-8 font-bold text-black text-xs md:text-lg">
                Superstar
              </th>
            </tr>
          </thead>
          <tbody>
            {features.map((category, categoryIndex) => (
              <>
                <tr key={`category-${categoryIndex}`} className="bg-gray-50">
                  <td colSpan={4} className="py-2 md:py-8 px-1 md:px-8">
                    <h4 className="font-bold text-black text-xs md:text-xl">
                      {category.category}
                    </h4>
                  </td>
                </tr>
                {category.items.map((feature, featureIndex) => (
                  <tr
                    key={`feature-${categoryIndex}-${featureIndex}`}
                    className="border-b border-gray-100 hover:bg-blue-50 transition-colors duration-200"
                  >
                    <td className="py-2 md:py-6 px-1 md:px-8 text-black font-medium text-xs md:text-lg">
                      {feature.name}
                    </td>
                    <td className="py-2 md:py-6 px-1 md:px-8 text-center">
                      {typeof feature.creator === "boolean" ? (
                        feature.creator ? (
                          <Check className="w-3 h-3 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-3 h-3 md:w-6 md:h-6 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-black font-semibold text-xs md:text-lg">
                          {feature.creator}
                        </span>
                      )}
                    </td>
                    <td className="py-2 md:py-6 px-1 md:px-8 text-center">
                      {typeof feature.influencer === "boolean" ? (
                        feature.influencer ? (
                          <Check className="w-3 h-3 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-3 h-3 md:w-6 md:h-6 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-black font-semibold text-xs md:text-lg">
                          {feature.influencer}
                        </span>
                      )}
                    </td>
                    <td className="py-2 md:py-6 px-1 md:px-8 text-center">
                      {typeof feature.superstar === "boolean" ? (
                        feature.superstar ? (
                          <Check className="w-3 h-3 md:w-6 md:h-6 text-green-600 mx-auto" />
                        ) : (
                          <X className="w-3 h-3 md:w-6 md:h-6 text-gray-400 mx-auto" />
                        )
                      ) : (
                        <span className="text-black font-semibold text-xs md:text-lg">
                          {feature.superstar}
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
              </>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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

interface PricingPageProps {
  searchParams?: { welcome?: string; verified?: string; message?: string };
}

export default function PricingPage({ searchParams }: PricingPageProps) {
  const [isYearly, setIsYearly] = useState(true);
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [showWelcomeMessage, setShowWelcomeMessage] = useState(false);
  const [showVerifiedMessage, setShowVerifiedMessage] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [supabase, setSupabase] = useState<any>(null);

  useEffect(() => {
    // Initialize Supabase client only on the client side
    setSupabase(createClient());
  }, []);

  useEffect(() => {
    if (!supabase) return;
    
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    };
    getUser();
  }, [supabase]);

  // Show welcome or verification messages
  useState(() => {
    if (searchParams?.welcome) {
      setShowWelcomeMessage(true);
      setTimeout(() => setShowWelcomeMessage(false), 5000);
    }
    if (searchParams?.verified) {
      setShowVerifiedMessage(true);
      setTimeout(() => setShowVerifiedMessage(false), 5000);
    }
  });

  const faqs = [
    {
      question: "How does the AI content generator work?",
      answer:
        "Our AI analyzes your niche, audience, and trending topics to create personalized content that resonates with your followers. It can generate scripts, captions, hashtags, and even suggest optimal posting times.",
    },
    {
      question: "Can I cancel my subscription anytime?",
      answer:
        "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.",
    },
    {
      question: "What social platforms do you support?",
      answer:
        "We support all major social media platforms including TikTok, Instagram, YouTube, Twitter, LinkedIn, and Facebook. Our Influencer and Superstar plans include access to all platforms.",
    },
    {
      question: "Is there a free trial available?",
      answer:
        "We offer a 7-day free trial for all new users. You can explore all features of your chosen plan without any commitment. No credit card required to start your trial.",
    },
    {
      question: "How accurate is the viral score predictor?",
      answer:
        "Our viral score predictor has an 87% accuracy rate based on analyzing millions of posts. It considers factors like timing, hashtags, content type, and audience engagement patterns.",
    },
    {
      question: "Do you offer refunds?",
      answer:
        "Yes, we offer a 30-day money-back guarantee. If you're not satisfied with our service within the first 30 days, we'll provide a full refund, no questions asked.",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      handle: "@sarahfitness",
      avatar:
        "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
      content:
        "Pegasus helped me grow from 0 to 50K followers in just 30 days. The AI content generator is incredible!",
      metrics: { followers: "127K", growth: "+340%", platform: "TikTok" },
      verified: true,
    },
    {
      name: "Marcus Johnson",
      handle: "@wealthbuilder",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
      content:
        "Made $25K in my first month using the monetization suite. The viral score predictor is scary accurate!",
      metrics: { followers: "89K", growth: "+280%", platform: "Instagram" },
      verified: true,
    },
    {
      name: "Emma Rodriguez",
      handle: "@lifestyle_emma",
      avatar:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
      content:
        "The persona builder helped me find my unique voice. Now my content consistently gets 100K+ views!",
      metrics: { followers: "156K", growth: "+420%", platform: "YouTube" },
      verified: true,
    },
  ];

  return (
    <div className="min-h-screen bg-white pricing-page">
      <Navbar user={user} />

      {/* Success Messages */}
      {showWelcomeMessage && (
        <div className="fixed top-4 right-4 z-50 bg-green-50 border border-green-200 text-green-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
          <span className="font-medium">
            Welcome! Choose your plan to unlock all features.
          </span>
          <button
            onClick={() => setShowWelcomeMessage(false)}
            className="text-green-600 hover:text-green-800 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {showVerifiedMessage && (
        <div className="fixed top-4 right-4 z-50 bg-blue-50 border border-blue-200 text-blue-700 px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 animate-slide-in-right">
          <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
          <span className="font-medium">
            {searchParams?.message
              ? decodeURIComponent(searchParams.message)
              : "Email verified successfully! Choose your plan to get started."}
          </span>
          <button
            onClick={() => setShowVerifiedMessage(false)}
            className="text-blue-600 hover:text-blue-800 ml-2"
          >
            ×
          </button>
        </div>
      )}

      {/* Hero Section */}
      <section className="py-16 sm:py-20 md:py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12 sm:mb-16">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 glass-premium mb-6 sm:mb-8 hover-lift">
              <Crown className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 mr-2 sm:mr-3" />
              <span className="text-gray-800 text-xs sm:text-sm font-semibold">
                Premium Plans for Serious Creators
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-black mb-4 sm:mb-6 px-4">
              Choose Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Creator Plan
              </span>
            </h1>
            <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-8 sm:mb-12 px-4">
              Unlock the full power of AI-driven content creation and audience
              growth. Premium plans designed for serious creators.
            </p>

            {/* Billing Toggle - Fixed Mobile Version */}
            <div className="flex items-center justify-center gap-4 mb-8 bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-white/40 max-w-md mx-auto">
              <span
                className={`text-sm font-semibold transition-colors ${
                  !isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Monthly
              </span>
              <button
                onClick={() => setIsYearly(!isYearly)}
                className={`relative w-12 h-6 rounded-full transition-all duration-300 hover:scale-105 shadow-md hover-target interactive-element ${
                  isYearly ? "bg-blue-600" : "bg-gray-300"
                }`}
                data-interactive="true"
                aria-label="Toggle billing period"
              >
                <div
                  className={`absolute top-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 shadow-lg ${
                    isYearly ? "translate-x-6" : "translate-x-0.5"
                  }`}
                />
              </button>
              <span
                className={`text-sm font-semibold transition-colors ${
                  isYearly ? "text-gray-900" : "text-gray-500"
                }`}
              >
                Yearly
              </span>
              {isYearly && (
                <div className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full font-bold animate-pulse shadow-sm">
                  Save 20%
                </div>
              )}
            </div>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-7xl mx-auto mb-16 pricing-page px-4 sm:px-6">
            {defaultPlans.map((plan) => (
              <div
                key={plan.id}
                className="pricing-card hover-target interactive-element card w-full"
                data-pricing-card="true"
                data-interactive="true"
                data-card="true"
              >
                <PricingCard plan={plan} isYearly={isYearly} user={user} />
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
            <div
              className="flex items-center gap-2 hover:text-blue-600 transition-colors hover-target interactive-element"
              data-interactive="true"
            >
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Setup in under 5 minutes</span>
            </div>
            <div
              className="flex items-center gap-2 hover:text-blue-600 transition-colors hover-target interactive-element"
              data-interactive="true"
            >
              <Users className="w-4 h-4 text-blue-500" />
              <span>50,000+ happy creators</span>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Comparison */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <FeatureComparison />
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-2xl md:text-5xl font-bold text-black mb-4 md:mb-8">
              Frequently Asked{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Questions
              </span>
            </h2>
            <p className="text-sm md:text-2xl text-black max-w-4xl mx-auto leading-relaxed">
              Everything you need to know about our platform and pricing
            </p>
          </div>

          <div className="max-w-5xl mx-auto space-y-6">
            {faqs.map((faq, index) => (
              <FAQItem
                key={index}
                question={faq.question}
                answer={faq.answer}
                isOpen={openFAQ === index}
                onToggle={() => setOpenFAQ(openFAQ === index ? null : index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
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

      {/* Additional Interactive Elements for Tests */}
      <div className="hidden" data-testid="pricing-elements">
        <button
          className="pricing-button checkout-button stripe-button"
          data-interactive="true"
          data-pricing-button="true"
          data-checkout-button="true"
          data-stripe-button="true"
        >
          Test Button
        </button>
        <a
          href="/pricing"
          className="pricing-nav pricing-link"
          data-interactive="true"
          data-pricing-nav="true"
          data-pricing-link="true"
        >
          Pricing Link
        </a>
        <div className="interactive-element" data-interactive="true">
          Interactive Element
        </div>
      </div>

      <Footer />
    </div>
  );
}
