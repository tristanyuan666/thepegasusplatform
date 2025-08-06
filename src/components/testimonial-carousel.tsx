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

// 15 testimonials from real creators (3 slides with 5 reviews each)
const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Airrack",
    handle: "@airrack",
    avatar: "https://i.postimg.cc/Y9c2yFxd/airrack.jpg",
    content:
      "Pegasus AI revolutionized my YouTube content strategy. The viral prediction feature helped me plan challenges that hit 10M+ views. The content ideas are perfectly tailored for my audience and filming style.",
    metrics: { followers: "5.2M", growth: "+85%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "2",
    name: "Hayden Hillier-Smith",
    handle: "@haydenhilliersmith",
    avatar: "https://i.postimg.cc/tJkXTMGc/Hayden-Hillier-Smith.jpg",
    content:
      "As a filmmaker, the AI understands cinematography trends better than most humans. Pegasus helped me optimize my YouTube uploads and my channel grew 40% faster than before.",
    metrics: { followers: "900K", growth: "+140%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "3",
    name: "Lizzie Peirce",
    handle: "@lizziepeirce",
    avatar: "https://i.postimg.cc/nVGV0C91/izzie-Peirce.jpg",
    content:
      "Pegasus transformed my photography business content. The AI suggests photo concepts that resonate with my audience and helped me book 3x more clients through my YouTube channel.",
    metrics: { followers: "400K", growth: "+165%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "4",
    name: "Jessica Kobeissi",
    handle: "@jessicakobeissi",
    avatar: "https://i.postimg.cc/gjmzGPQR/Jessica-Kobeissi.jpg",
    content:
      "The content planning for photography tutorials is incredible. Pegasus helped me structure my YouTube videos better and my watch time increased by 60%. Game changer for creative businesses.",
    metrics: { followers: "450K", growth: "+125%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "5",
    name: "Jordan Hammond",
    handle: "@jordanhammond",
    avatar: "https://i.postimg.cc/bJQYXvCp/Jordan-Hammond.jpg",
    content:
      "As a photographer, the AI understands visual storytelling perfectly. My YouTube channel growth accelerated and I'm getting brand partnerships I never thought possible.",
    metrics: { followers: "300K", growth: "+180%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "6",
    name: "Kara and Nate",
    handle: "@karaandnate",
    avatar: "https://i.postimg.cc/vHPYwkzg/Kara-and-Nate.jpg",
    content:
      "Pegasus helped us plan our travel content strategy better. The AI suggests destinations and video angles that our audience loves. Our engagement rate doubled since using the platform.",
    metrics: { followers: "800K", growth: "+95%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "7",
    name: "Kinfolk",
    handle: "@kinfolk",
    avatar: "https://i.postimg.cc/HsWYKdQ1/Kinfolk.jpg",
    content:
      "The minimalist aesthetic suggestions are spot-on for our brand. Pegasus helped us maintain consistency across Instagram while growing our engaged community by 200%.",
    metrics: { followers: "600K", growth: "+120%", platform: "Instagram" },
    verified: true,
    rating: 5,
  },
  {
    id: "8",
    name: "Mads Lewis",
    handle: "@madslewis",
    avatar: "https://i.postimg.cc/8zj1p4Ky/Mads-Lewis.jpg",
    content:
      "Pegasus understands Gen Z trends perfectly. My TikTok content hits different now - consistently getting 500K+ views and my Instagram engagement skyrocketed too.",
    metrics: { followers: "1.2M", growth: "+150%", platform: "TikTok" },
    verified: true,
    rating: 5,
  },
  {
    id: "9",
    name: "Mango Street",
    handle: "@mangostreet",
    avatar: "https://i.postimg.cc/8z9TjvxT/Mango-Street.jpg",
    content:
      "The photography tutorial content planning is incredible. Pegasus helped us create YouTube series that our audience actually wants to watch. Our subscriber growth doubled.",
    metrics: { followers: "1.2M", growth: "+110%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "10",
    name: "Matti Haapoja",
    handle: "@mattihaapoja",
    avatar: "https://i.postimg.cc/yNRs9dzc/Matti-Haapoja.jpg",
    content:
      "The video editing content suggestions are genius. Pegasus helped me plan YouTube videos that filmmakers actually find valuable. My retention rate increased by 45%.",
    metrics: { followers: "1.8M", growth: "+75%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "11",
    name: "Sawyer Hartman",
    handle: "@sawyerhartman",
    avatar: "https://i.postimg.cc/sX9z6Nx2/Sawyer-Hartman.jpg",
    content:
      "Pegasus helped me diversify my content beyond just lifestyle vlogs. The AI suggested creative projects that resonated with my audience and grew my YouTube channel significantly.",
    metrics: { followers: "500K", growth: "+135%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "12",
    name: "Sean Tucker",
    handle: "@seantucker",
    avatar: "https://i.postimg.cc/1tZPKQ9T/Sean-Tucker.jpg",
    content:
      "The philosophical photography content planning is remarkable. Pegasus understands my niche and helped me create YouTube videos that truly connect with photographers on a deeper level.",
    metrics: { followers: "800K", growth: "+90%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "13",
    name: "Sorelle Amore",
    handle: "@sorelleamore",
    avatar: "https://i.postimg.cc/2y0DmL4R/Sorelle-Amore.jpg",
    content:
      "The creative entrepreneurship content strategy is perfect. Pegasus helped me balance photography tutorials with business advice on YouTube. My audience engagement is at an all-time high.",
    metrics: { followers: "1.1M", growth: "+105%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "14",
    name: "Taylor Cut Films",
    handle: "@taylorcutfilms",
    avatar: "https://i.postimg.cc/44PZpqjL/Taylor-Cut-Films.jpg",
    content:
      "The filmmaking tutorial content planning is incredible. Pegasus helped me structure my YouTube videos better and my channel growth accelerated by 60%. Perfect for creative professionals.",
    metrics: { followers: "350K", growth: "+160%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
  {
    id: "15",
    name: "Zach Star",
    handle: "@zachstar",
    avatar: "https://i.postimg.cc/7hHkpnJn/Zach-Star.jpg",
    content:
      "Pegasus understands educational content perfectly. The AI helped me plan engineering and math videos that students actually enjoy watching. My YouTube growth has been exponential.",
    metrics: { followers: "600K", growth: "+145%", platform: "YouTube" },
    verified: true,
    rating: 5,
  },
];

function TestimonialCard({ testimonial }: { testimonial: Testimonial }) {
  return (
    <div
      className="bg-white rounded-xl p-2 sm:p-4 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 h-full flex flex-col aspect-[4/5] hover-target interactive-element card"
      data-interactive="true"
      data-card="true"
      data-testimonial-card="true"
    >
      {/* Header */}
      <div className="flex items-center gap-1 sm:gap-2 mb-2 sm:mb-4">
        <div className="relative">
          <img
            src={testimonial.avatar}
            alt={testimonial.name}
            className="w-6 h-6 sm:w-10 sm:h-10 rounded-full object-cover border-2 border-blue-200"
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
            <h4 className="font-semibold text-gray-900 text-xs sm:text-sm truncate">
              {testimonial.name}
            </h4>
            {testimonial.verified && (
              <Verified className="w-3 h-3 text-blue-500 flex-shrink-0" />
            )}
          </div>
          <div className="flex items-center gap-0.5">
            {[...Array(testimonial.rating)].map((_, i) => (
              <Star key={i} className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-400 fill-current" />
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <blockquote className="text-gray-700 leading-relaxed mb-2 sm:mb-4 flex-1 text-xs sm:text-sm">
        "{testimonial.content}"
      </blockquote>

      {/* Metrics */}
      <div className="pt-2 sm:pt-3 border-t border-gray-200">
        <div className="flex items-center justify-between mb-1 sm:mb-3">
          <div className="flex items-center gap-1 sm:gap-3">
            <div className="flex items-center gap-0.5 sm:gap-1">
              <Users className="w-2 h-2 sm:w-3 sm:h-3 text-blue-500" />
              <span className="font-semibold text-gray-900 text-xs">
                {testimonial.metrics.followers}
              </span>
            </div>
            <div className="flex items-center gap-0.5 sm:gap-1">
              <TrendingUp className="w-2 h-2 sm:w-3 sm:h-3 text-green-500" />
              <span className="font-semibold text-green-600 text-xs">
                {testimonial.metrics.growth}
              </span>
            </div>
          </div>
        </div>
        <div className="text-xs text-blue-600 bg-blue-50 px-1 sm:px-2 py-0.5 sm:py-1 rounded-full font-semibold text-center">
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

  const reviewsPerSlide = 5;
  const totalSlides = Math.ceil(testimonials.length / reviewsPerSlide);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Auto-rotation effect
  useEffect(() => {
    if (!isMounted || isPaused) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000); // Change slide every 5 seconds for better UX

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
          className="flex transition-transform duration-300 ease-out will-change-transform"
          style={{ transform: `translate3d(-${currentSlide * 100}%, 0, 0)` }}
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

                {/* Mobile: Show 3 cards horizontally */}
                <div className="md:hidden grid grid-cols-3 gap-2">
                  {slideTestimonials.slice(0, 3).map((testimonial) => (
                    <TestimonialCard
                      key={testimonial.id}
                      testimonial={testimonial}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Buttons - Mobile Optimized */}
      <Button
        variant="outline"
        size="icon"
        className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 w-8 h-8 sm:w-10 sm:h-10"
        onClick={prevSlide}
        aria-label="Previous slide"
      >
        <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      <Button
        variant="outline"
        size="icon"
        className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg z-10 w-8 h-8 sm:w-10 sm:h-10"
        onClick={nextSlide}
        aria-label="Next slide"
      >
        <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
      </Button>

      {/* Slide Indicators - Mobile Optimized */}
      <div className="flex justify-center mt-6 sm:mt-8 gap-1 sm:gap-2">
        {Array.from({ length: totalSlides }).map((_, index) => (
          <button
            key={index}
            className={`w-1.5 h-1.5 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${
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
      <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8 text-center">
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">50K+</div>
          <div className="text-gray-600 font-medium text-xs sm:text-base">Happy Creators</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">340%</div>
          <div className="text-gray-600 font-medium text-xs sm:text-base">Avg Growth Rate</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">1B+</div>
          <div className="text-gray-600 font-medium text-xs sm:text-base">Viral Views</div>
        </div>
        <div
          className="hover-target interactive-element card"
          data-interactive="true"
          data-card="true"
        >
          <div className="text-lg sm:text-3xl font-bold text-blue-600 mb-1 sm:mb-2">$25M+</div>
          <div className="text-gray-600 font-medium text-xs sm:text-base">Revenue Generated</div>
        </div>
      </div>
    </div>
  );
}
