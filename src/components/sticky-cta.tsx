"use client";

import { useState, useEffect } from "react";
import { ArrowRight, X, Sparkles } from "lucide-react";
import Link from "next/link";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const windowHeight = window.innerHeight;

      // Show CTA after scrolling past the hero section
      if (scrollPosition > windowHeight * 0.8 && !isDismissed) {
        setIsVisible(true);
      } else if (scrollPosition <= windowHeight * 0.8) {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  if (!isVisible || isDismissed) return null;

  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 animate-slide-up">
      <div className="glass-card px-6 py-4 flex items-center gap-4 shadow-2xl hover-lift group">
        {/* Icon */}
        <div className="p-2 rounded-lg bg-gradient-to-r from-neon-blue to-neon-purple">
          <Sparkles className="w-5 h-5 text-white" />
        </div>

        {/* Content */}
        <div className="flex-1">
          <p className="text-white font-medium text-sm">
            Ready to become famous?
          </p>
          <p className="text-gray-300 text-xs">
            Join 50K+ creators building their empire
          </p>
        </div>

        {/* CTA Button */}
        <Link
          href="/dashboard"
          className="group/btn bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-glow-blue flex items-center gap-2"
        >
          <span>Start Now</span>
          <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
        </Link>

        {/* Dismiss Button */}
        <button
          onClick={handleDismiss}
          className="text-gray-400 hover:text-white transition-colors p-1"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
