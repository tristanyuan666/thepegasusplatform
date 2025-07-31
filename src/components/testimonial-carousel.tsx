"use client";

import { useState, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Star,
  Verified,
  Users,
  TrendingUp,
} from "lucide-react";
import { Button } from "./ui/button";

interface Testimonial {
  id: string;
  name: string;
  handle: string;
  avatar: string;
  content: string;
  metrics: {
    followers: string;
    growth: string;
    platform: string;
  };
  verified: boolean;
  rating: number;
}

// 25 testimonials for 5 slides with 5 reviews each
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Jordan Martinez",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
    content:
      "Pegasus AI helped me scale my lifestyle content from 200K to 800K followers in 6 months. The content suggestions are spot-on for my audience!",
    metrics: { followers: "847K", growth: "+320%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "2",
    name: "Taylor Johnson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&q=80",
    content:
      "The AI content generator understands beauty trends perfectly. My engagement rate doubled and I'm getting brand deals I never thought possible!",
    metrics: { followers: "1.2M", growth: "+180%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "3",
    name: "Casey Thompson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
    content:
      "As a photographer, the visual content suggestions from Pegasus are incredible. My content grew from 500K to 900K followers this year!",
    metrics: { followers: "923K", growth: "+85%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "4",
    name: "Riley Anderson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&q=80",
    content:
      "The viral prediction feature is scary accurate! 8 out of 10 posts I created based on AI suggestions hit over 1M views. This platform is a game-changer.",
    metrics: { followers: "1.1M", growth: "+95%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "5",
    name: "Morgan Davis",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&q=80",
    content:
      "Pegasus helped me diversify my content beyond makeup. The AI suggested lifestyle and fashion content that my audience loves. Revenue up 400%!",
    metrics: { followers: "1.8M", growth: "+150%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "6",
    name: "Alex Rivera",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
    content:
      "The finance content templates are perfect for my niche. My content went from 100K to 750K followers, and my course sales increased by 300%!",
    metrics: { followers: "756K", growth: "+650%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "7",
    name: "Sam Wilson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
    content:
      "The minimalism and productivity content suggestions are incredible. My channel hit 1M subscribers and my podcast downloads tripled!",
    metrics: { followers: "1.0M", growth: "+120%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "8",
    name: "Jamie Chen",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1489424731084-a5d8b219a5bb?w=150&q=80",
    content:
      "Pegasus AI revolutionized my fitness content strategy. The workout video suggestions helped me grow from 800K to 1.5M subscribers in 8 months!",
    metrics: { followers: "1.5M", growth: "+87%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "9",
    name: "Blake Parker",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&q=80",
    content:
      "The business and creative content AI is spot-on. My following grew to 500K and I'm booking speaking gigs left and right!",
    metrics: { followers: "523K", growth: "+200%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "10",
    name: "Avery Kim",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&q=80",
    content:
      "The lifestyle and travel content suggestions are amazing! My content grew from 300K to 900K followers, and brand partnerships increased 500%!",
    metrics: { followers: "912K", growth: "+204%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "11",
    name: "Dakota Smith",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&q=80",
    content:
      "The AI helped me pivot from gaming to tech reviews seamlessly. My subscriber count doubled in just 4 months with better engagement rates!",
    metrics: { followers: "678K", growth: "+145%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "12",
    name: "Phoenix Lee",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&q=80",
    content:
      "My cooking content went viral thanks to Pegasus AI's recipe suggestions. From 50K to 400K followers in 3 months - incredible growth!",
    metrics: { followers: "423K", growth: "+746%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "13",
    name: "River Brown",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&q=80",
    content:
      "The fashion content AI understands trends before they hit mainstream. My engagement is through the roof with 2M+ views per post!",
    metrics: { followers: "890K", growth: "+234%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "14",
    name: "Sage Miller",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&q=80",
    content:
      "Pet content creation became so much easier with AI suggestions. My dog's account now has more followers than most humans!",
    metrics: { followers: "1.3M", growth: "+567%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "15",
    name: "Rowan Taylor",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1552058544-f2b08422138a?w=150&q=80",
    content:
      "DIY and craft content suggestions helped me build a community of makers. My tutorials now get 500K+ views consistently!",
    metrics: { followers: "734K", growth: "+189%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "16",
    name: "Ember Wilson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&q=80",
    content:
      "Music production content became my niche thanks to AI insights. From bedroom producer to 600K followers sharing beats and tutorials!",
    metrics: { followers: "612K", growth: "+298%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "17",
    name: "Storm Garcia",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=150&q=80",
    content:
      "Comedy skits suggested by the AI hit different. My content went from 20K to 800K followers with content that actually makes people laugh!",
    metrics: { followers: "834K", growth: "+4070%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "18",
    name: "Ocean Martinez",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1463453091185-61582044d556?w=150&q=80",
    content:
      "Plant care and gardening content flourished with AI guidance. My green thumb content now reaches 1M+ plant parents every month!",
    metrics: { followers: "567K", growth: "+223%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "19",
    name: "Sky Anderson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1607746882042-944635dfe10e?w=150&q=80",
    content:
      "Book reviews and reading content got a major boost from AI suggestions. My account now influences thousands of reading choices!",
    metrics: { followers: "445K", growth: "+312%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "20",
    name: "Luna Rodriguez",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&q=80",
    content:
      "Art tutorials and speed painting videos took off with AI content planning. My creative process videos now inspire 700K+ artists worldwide!",
    metrics: { followers: "723K", growth: "+267%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "21",
    name: "Sage Thompson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=150&q=80",
    content:
      "The travel content AI helped me turn my wanderlust into a profitable brand. My travel vlogs now fund my adventures around the world!",
    metrics: { followers: "892K", growth: "+245%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "22",
    name: "River Kim",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=150&q=80",
    content:
      "Tech review content became my specialty with AI guidance. My honest reviews now influence millions of purchasing decisions!",
    metrics: { followers: "1.4M", growth: "+189%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "23",
    name: "Phoenix Davis",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1521119989659-a83eee488004?w=150&q=80",
    content:
      "Home decor and interior design content flourished with AI insights. My design tips now inspire thousands of home makeovers!",
    metrics: { followers: "678K", growth: "+156%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "24",
    name: "Ocean Wilson",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=150&q=80",
    content:
      "Parenting content got a major boost from AI suggestions. My parenting hacks and tips now help millions of families worldwide!",
    metrics: { followers: "1.1M", growth: "+278%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
  {
    id: "25",
    name: "Storm Lee",
    handle: "",
    avatar:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=150&q=80",
    content:
      "Educational content creation became effortless with AI. My science explanations now make complex topics accessible to millions!",
    metrics: { followers: "956K", growth: "+234%", platform: "Creator" },
    verified: true,
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="bg-white rounded-xl p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col aspect-[4/5] hover-target interactive-element card"
      data-interactive="true"
      data-card="true"
      data-testimonial-card="true"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
            loading="lazy"
          />
          {testimonial.verified && (
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <Verified className="w-2.5 h-2.5 text-white" />
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1 mb-1">
            <h4 className="font-semibold text-gray-900 text-sm truncate">
              {testimonial.name}
            </h4>
            {testimonial.verified && (
              <Verified className="w-3 h-3 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-3 h-3 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <blockquote className="text-gray-700 leading-relaxed mb-4 flex-1 text-sm">
        "{testimonial.content}"
      </blockquote>

      {/* Metrics */}
      <div className="pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Users className="w-3 h-3 text-blue-500" />
              <span className="font-semibold text-gray-900 text-xs">
                {testimonial.metrics.followers}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-green-500" />
              <span className="font-semibold text-green-600 text-xs">
                {testimonial.metrics.growth}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-full font-semibold text-center">
          {testimonial.metrics.platform}
        </div>
      </div>
    </div>
  );
}

export default function TestimonialCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isMounted, setIsMounted] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const totalSlides = 5;
  const reviewsPerSlide = 5;

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!isMounted || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 4000); // Change slide every 4 seconds

    return () => clearInterval(interval);
  }, [isMounted, isPaused, totalSlides]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const goToSlide = (slideIndex: number) => {
    setCurrentSlide(slideIndex);
  };

  // Get testimonials for current slide
  const getCurrentSlideTestimonials = () => {
    const startIndex = currentSlide * reviewsPerSlide;
    return testimonials.slice(startIndex, startIndex + reviewsPerSlide);
  };

  if (!isMounted) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {testimonials.slice(0, 5).map((testimonial) => (
            <TestimonialCard key={testimonial.id} testimonial={testimonial} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div
      className="max-w-7xl mx-auto relative"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Carousel Container */}
      <div className="relative overflow-hidden">
        {/* Slides */}
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {Array.from({ length: totalSlides }).map((_, slideIndex) => {
            const slideTestimonials = testimonials.slice(
              slideIndex * reviewsPerSlide,
              (slideIndex + 1) * reviewsPerSlide,
            );

            return (
              <div key={slideIndex} className="w-full flex-shrink-0">
                {/* Desktop: 5 cards in a row */}
                <div className="hidden lg:grid lg:grid-cols-5 gap-4">
                  {slideTestimonials.map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>

                {/* Tablet: 3 cards in a row */}
                <div className="hidden md:grid md:grid-cols-3 lg:hidden gap-4">
                  {slideTestimonials.slice(0, 3).map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>

                {/* Mobile: 1 card */}
                <div className="md:hidden">
                  <TestimonialCard testimonial={slideTestimonials[0]} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-5 h-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="w-5 h-5" />
      </Button>

      {/* Slide Indicators */}
      <div className="flex justify-center mt-8 gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-blue-600 scale-110"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => goToSlide(index)}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Stats Summary */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">50K+</div>
          <div className="text-gray-600 font-medium">Happy Creators</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">340%</div>
          <div className="text-gray-600 font-medium">Avg Growth Rate</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">1B+</div>
          <div className="text-gray-600 font-medium">Viral Views</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-3xl font-bold text-blue-600 mb-2">$25M+</div>
          <div className="text-gray-600 font-medium">Revenue Generated</div>
        </div>
      </div>
    </div>
  );
}
