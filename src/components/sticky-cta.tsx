"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, X } from "lucide-react";
import { createClient } from "../../supabase/client";

export default function StickyCTA() {
  const [isVisible, setIsVisible] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [hasSubscription, setHasSubscription] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkUserStatus = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setUser(user);

        if (user) {
          // Check if user has active subscription
          const { data: subscription, error: subError } = await supabase
            .from("subscriptions")
            .select("*")
            .eq("user_id", user.id)
            .eq("status", "active")
            .maybeSingle();

          if (!subError && subscription) {
            setHasSubscription(true);
          } else {
            setHasSubscription(false);
          }
        }
      } catch (error) {
        console.error("Error checking user status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUserStatus();
  }, [supabase]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      
      // Show CTA when user has scrolled 50% of the page
      if (scrollY > (documentHeight - windowHeight) * 0.5) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleDismiss = () => {
    setIsVisible(false);
  };

  const getDashboardHref = () => {
    if (isLoading) return "/pricing";
    
    if (!user) {
      return "/pricing";
    } else if (hasSubscription) {
      return "/dashboard";
    } else {
      return "/pricing";
    }
  };

  if (!isVisible) return null;

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
          href={getDashboardHref()}
          className="group/btn bg-gradient-to-r from-neon-blue to-neon-purple text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-300 hover:shadow-glow-blue flex items-center gap-2"
        >
          <span>{!user ? "Get Started" : hasSubscription ? "Go to Dashboard" : "Choose Plan"}</span>
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
