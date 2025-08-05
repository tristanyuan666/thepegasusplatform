"use client";

import { useState } from "react";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  MessageCircle,
  Mail,
  Phone,
} from "lucide-react";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}

function FAQItem({ question, answer, isOpen, onToggle }: FAQItemProps) {
  return (
    <div className="glass-premium p-3 md:p-6 hover-lift transition-all duration-300">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between text-left"
      >
        <h3 className="text-sm md:text-lg font-semibold text-gray-900 pr-2">
          {question}
        </h3>
        <div className="ml-2 md:ml-4 flex-shrink-0">
          {isOpen ? (
            <ChevronUp className="w-4 h-4 md:w-5 md:h-5 text-blue-600" />
          ) : (
            <ChevronDown className="w-4 h-4 md:w-5 md:h-5 text-gray-400" />
          )}
        </div>
      </button>
      <div
        className={`mt-2 md:mt-4 overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="text-gray-600 leading-relaxed text-xs md:text-base">
          {answer}
        </p>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How does Pegasus AI work?",
          answer:
            "Pegasus AI uses advanced artificial intelligence to help you create viral content, build your personal brand, and grow your social media presence. Our platform analyzes trends, generates content ideas, and provides tools for scheduling and analytics.",
        },
        {
          question: "What social platforms do you support?",
          answer:
            "We support all major social media platforms including TikTok, Instagram, YouTube, X, LinkedIn, and Facebook. Our Influencer and Superstar plans include access to all platforms.",
        },
        {
          question: "Do I need any technical skills to use Pegasus?",
          answer:
            "Not at all! Pegasus is designed to be user-friendly and intuitive. Our AI handles the complex work while you focus on your creative vision. We also provide comprehensive tutorials and support.",
        },
      ],
    },
    {
      category: "AI Content Generation",
      questions: [
        {
          question: "How does the AI content generator work?",
          answer:
            "Our AI analyzes your niche, audience, and trending topics to create personalized content that resonates with your followers. It can generate scripts, captions, hashtags, and even suggest optimal posting times.",
        },
        {
          question: "Can I customize the AI-generated content?",
          answer:
            "Absolutely! All AI-generated content can be fully customized to match your voice and brand. You have complete control over the final output before publishing.",
        },
        {
          question: "How accurate is the viral score predictor?",
          answer:
            "Our viral score predictor has an 87% accuracy rate based on analyzing millions of posts. It considers factors like timing, hashtags, content type, and audience engagement patterns.",
        },
      ],
    },
    {
      category: "Pricing & Billing",
      questions: [
        {
          question: "What are your pricing plans?",
          answer:
            "We offer three premium plans: Creator ($39.99/month), Influencer ($59.99/month - Most Popular), and Superstar ($99.99/month). Annual plans are available at $383.99, $575.99, and $959.99 respectively, offering significant savings.",
        },
        {
          question: "Can I cancel my subscription anytime?",
          answer:
            "Yes, you can cancel your subscription at any time. There are no long-term contracts or cancellation fees. Your access will continue until the end of your current billing period.",
        },
        {
          question: "How flexible are the subscription plans?",
          answer:
            "Our subscription plans are designed for maximum flexibility. You can upgrade, downgrade, or cancel at any time without penalties or long-term commitments.",
        },
        {
          question: "What is your refund policy?",
          answer:
            "We do not provide refunds for any payments made. All sales are final. However, you can cancel your subscription at any time and your access will continue until the end of your current billing period. This policy helps us maintain fair pricing and continue developing our platform.",
        },
      ],
    },
    {
      category: "Features & Tools",
      questions: [
        {
          question: "What is the Persona Builder?",
          answer:
            "The Persona Builder helps you create a unique influencer identity with AI-guided onboarding, niche selection, and brand personality development. It's designed to help you stand out in your market.",
        },
        {
          question: "How does auto-scheduling work?",
          answer:
            "Our smart scheduler analyzes your audience's activity patterns and automatically posts your content at optimal times for maximum engagement across all your connected social platforms.",
        },
        {
          question: "Can I track my growth and analytics?",
          answer:
            "Yes! Our Fame Dashboard provides real-time analytics, growth tracking, viral score predictions, and detailed insights to help you optimize your content strategy.",
        },
      ],
    },
    {
      category: "Support & Security",
      questions: [
        {
          question: "How does the AI content generation work?",
          answer:
            "Our AI analyzes your niche, audience behavior, and trending topics to generate personalized content that resonates with your followers. The system learns from your preferences and improves over time.",
        },
        {
          question: "Is my data secure?",
          answer:
            "Absolutely. We use enterprise-grade security with bank-level encryption to protect your data. Your content and personal information are always kept secure and private.",
        },
        {
          question: "How do I connect my social media accounts?",
          answer:
            "Connecting your accounts is simple and secure. We use official APIs from each platform and only request the minimum permissions needed to provide our services.",
        },
      ],
    },
  ];

  const filteredFAQs = faqs.map((category) => ({
    ...category,
    questions: category.questions.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase()),
    ),
  }));

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
              <HelpCircle className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Frequently Asked Questions
              </span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              How Can We{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Help You?
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Find answers to common questions about Pegasus AI and how our
              platform can help you become a successful content creator.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for answers..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-white border border-gray-200 rounded-xl text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 shadow-lg"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Content */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            {filteredFAQs.map((category, categoryIndex) => (
              <div key={categoryIndex} className="mb-12">
                {category.questions.length > 0 && (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">
                      {category.category}
                    </h2>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        return (
                          <FAQItem
                            key={globalIndex}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openFAQ === globalIndex}
                            onToggle={() =>
                              setOpenFAQ(
                                openFAQ === globalIndex ? null : globalIndex,
                              )
                            }
                          />
                        );
                      })}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
