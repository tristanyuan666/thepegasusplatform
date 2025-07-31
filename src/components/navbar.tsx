"use client";

import Link from "next/link";
import { Button } from "./ui/button";
import {
  ChevronDown,
  User,
  Menu,
  X,
  Sparkles,
  Zap,
  DollarSign,
  HelpCircle,
  Settings,
  BarChart3,
  Calendar,
  Target,
  Palette,
  Brain,
  TrendingUp,
  Users,
  Globe,
  Smartphone,
  MessageCircle,
  Share2,
  Instagram,
  Youtube,
  MessageSquare,
  Facebook,
  Linkedin,
  ArrowRight,
  Lock,
} from "lucide-react";
import { Badge } from "./ui/badge";
import UserProfile from "./user-profile";
import PegasusLogo from "./pegasus-logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";

interface NavbarProps {
  user?: any;
}

export default function Navbar({ user = null }: NavbarProps) {
  const [currentUser, setCurrentUser] = useState(user);
  const supabase = createClient();

  useEffect(() => {
    if (!user) {
      const getUser = async () => {
        const {
          data: { user },
        } = await supabase.auth.getUser();
        setCurrentUser(user);
      };
      getUser();
    } else {
      setCurrentUser(user);
    }
  }, [user]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMounted]);

  // Original feature pages for non-subscribed users
  const originalFeaturesItems = [
    {
      title: "AI Content Generator",
      description: "Create viral content with AI",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      href: "/features/ai-content",
      feature: undefined,
    },
    {
      title: "Analytics Dashboard",
      description: "Track your growth metrics",
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      href: "/features/analytics",
      feature: undefined,
    },
    {
      title: "Content Scheduler",
      description: "Auto-schedule across platforms",
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      href: "/features/scheduler",
      feature: undefined,
    },
    {
      title: "Viral Score Predictor",
      description: "Predict content performance",
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      href: "/features/viral-predictor",
      feature: undefined,
    },
    {
      title: "Persona Builder",
      description: "Build your creator identity",
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      href: "/features/persona-builder",
      feature: undefined,
    },
    {
      title: "Growth Engine",
      description: "Optimize for maximum reach",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      href: "/features/growth-engine",
      feature: undefined,
    },
  ];

  // Original integration pages for non-subscribed users
  const originalIntegrationsItems = [
    {
      title: "TikTok",
      description: "Connect your TikTok account",
      icon: (
        <svg
          className="w-5 h-5 text-pink-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      href: "/integrations/tiktok",
      feature: undefined,
    },
    {
      title: "Instagram",
      description: "Sync with Instagram",
      icon: <Instagram className="w-5 h-5 text-purple-600" />,
      href: "/integrations/instagram",
      feature: undefined,
    },
    {
      title: "YouTube",
      description: "Manage YouTube content",
      icon: <Youtube className="w-5 h-5 text-red-600" />,
      href: "/integrations/youtube",
      feature: undefined,
    },
    {
      title: "X",
      description: "Post to X",
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      href: "/integrations/x",
      feature: undefined,
    },
    {
      title: "LinkedIn",
      description: "Professional networking",
      icon: <Linkedin className="w-5 h-5 text-blue-700" />,
      href: "/integrations/linkedin",
      feature: undefined,
    },
    {
      title: "Facebook",
      description: "Connect Facebook pages",
      icon: <Facebook className="w-5 h-5 text-blue-800" />,
      href: "/integrations/facebook",
      feature: undefined,
    },
  ];

  // Dashboard features for subscribed users
  const dashboardFeaturesItems = [
    {
      title: "AI Content Generator",
      description: "Create viral content with AI",
      icon: <Sparkles className="w-5 h-5 text-blue-600" />,
      href: "/content-hub",
      feature: "ai_content",
    },
    {
      title: "Analytics Dashboard",
      description: "Track your growth metrics",
      icon: <BarChart3 className="w-5 h-5 text-blue-600" />,
      href: "/dashboard?tab=analytics",
      feature: "analytics",
    },
    {
      title: "Content Scheduler",
      description: "Auto-schedule across platforms",
      icon: <Calendar className="w-5 h-5 text-blue-600" />,
      href: "/content-hub",
      feature: "ai_content",
    },
    {
      title: "Viral Score Predictor",
      description: "Predict content performance",
      icon: <Zap className="w-5 h-5 text-blue-600" />,
      href: "/dashboard?tab=analytics",
      feature: "advanced_analytics",
    },
    {
      title: "Persona Builder",
      description: "Build your creator identity",
      icon: <Brain className="w-5 h-5 text-blue-600" />,
      href: "/content-hub",
      feature: "ai_content",
    },
    {
      title: "Growth Engine",
      description: "Optimize for maximum reach",
      icon: <TrendingUp className="w-5 h-5 text-blue-600" />,
      href: "/dashboard?tab=analytics",
      feature: "advanced_analytics",
    },
  ];

  const dashboardIntegrationsItems = [
    {
      title: "TikTok",
      description: "Connect your TikTok account",
      icon: (
        <svg
          className="w-5 h-5 text-pink-600"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z" />
        </svg>
      ),
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
    {
      title: "Instagram",
      description: "Sync with Instagram",
      icon: <Instagram className="w-5 h-5 text-purple-600" />,
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
    {
      title: "YouTube",
      description: "Manage YouTube content",
      icon: <Youtube className="w-5 h-5 text-red-600" />,
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
    {
      title: "X",
      description: "Post to X",
      icon: <MessageSquare className="w-5 h-5 text-blue-600" />,
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
    {
      title: "LinkedIn",
      description: "Professional networking",
      icon: <Linkedin className="w-5 h-5 text-blue-700" />,
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
    {
      title: "Facebook",
      description: "Connect Facebook pages",
      icon: <Facebook className="w-5 h-5 text-blue-800" />,
      href: "/dashboard?tab=platforms",
      feature: "platforms",
    },
  ];

  // Determine if user has active subscription (for button logic)
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(false);
  const [userPlan, setUserPlan] = useState<string | null>(null);
  
  const checkSubscription = async () => {
    if (!currentUser) return;
    
    setIsLoadingSubscription(true);
    try {
      
      const { data, error } = await supabase
        .from("subscriptions")
        .select("*")
        .eq("user_id", currentUser.id)
        .eq("status", "active")
        .maybeSingle();
      
      if (error) {
        console.error("❌ Error checking subscription:", error);
      } else {

        setHasActiveSubscription(!!data);
        setUserPlan(data?.plan_name || null);
      }
    } catch (error) {
      console.error("❌ Exception checking subscription:", error);
    } finally {
      setIsLoadingSubscription(false);
    }
  };

  // Check if user has access to specific features based on plan
  const hasFeatureAccess = (feature: string): boolean => {
    if (!hasActiveSubscription || !userPlan) return false;
    
    const plan = userPlan.toLowerCase();
    
    switch (feature) {
      case "analytics":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "revenue":
        return ["influencer", "superstar"].includes(plan);
      case "platforms":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "ai_content":
        return ["creator", "influencer", "superstar"].includes(plan);
      case "advanced_analytics":
        return ["influencer", "superstar"].includes(plan);
      case "monetization":
        return ["influencer", "superstar"].includes(plan);
      case "team_collaboration":
        return ["superstar"].includes(plan);
      default:
        return false;
    }
  };

  useEffect(() => {
    checkSubscription();
  }, [currentUser]);

  // Force refresh subscription status after payment or navigation
  useEffect(() => {
    const handleUrlChange = () => {
      if (window.location.pathname === "/success" || window.location.pathname === "/dashboard") {

        // Add a small delay to ensure the webhook has processed
        setTimeout(() => {
          checkSubscription();
        }, 2000);
      }
    };
    
    // Also check on page load if we're on success or dashboard
    if (window.location.pathname === "/success" || window.location.pathname === "/dashboard") {
      
      setTimeout(() => {
        checkSubscription();
      }, 2000);
    }
    
    window.addEventListener("popstate", handleUrlChange);
    window.addEventListener("pushstate", handleUrlChange);
    window.addEventListener("replacestate", handleUrlChange);
    return () => {
      window.removeEventListener("popstate", handleUrlChange);
      window.removeEventListener("pushstate", handleUrlChange);
      window.removeEventListener("replacestate", handleUrlChange);
    };
  }, [currentUser]);

  // Determine which items to show based on subscription status
  const featuresItems = hasActiveSubscription ? dashboardFeaturesItems : originalFeaturesItems;
  const integrationsItems = hasActiveSubscription ? dashboardIntegrationsItems : originalIntegrationsItems;

  return (
    <nav
      className={`w-full fixed top-0 z-40 py-2 transition-all duration-300 ${
        isScrolled ? "glass-navbar scrolled" : "glass-navbar"
      }`}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 40,
        transform: "translateZ(0)",
        backfaceVisibility: "hidden",
      }}
    >
      <div className="container mx-auto px-6">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link
            href="/"
            prefetch
            className="hover:opacity-80 transition-all duration-300"
          >
            <PegasusLogo size="md" variant="full" />
          </Link>

          {/* Navigation Links - Desktop */}
          <div className="hidden lg:flex items-center gap-8">
            {/* Features Dropdown */}
            <DropdownMenu
              open={activeDropdown === "features"}
              onOpenChange={(open) =>
                setActiveDropdown(open ? "features" : null)
              }
            >
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group outline-none">
                Features
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "features" ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 p-4 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl z-50"
                align="start"
                style={{ zIndex: 9999 }}
              >
                <div className="grid gap-3">
                  {featuresItems.map((item, index) => {
                    // For non-subscribed users, always show feature pages
                    // For subscribed users, check feature access
                    const isLocked = hasActiveSubscription && !hasFeatureAccess(item.feature || "");
                    
                    return (
                      <Link
                        key={index}
                        href={isLocked ? "/pricing" : item.href}
                        className="block"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${
                          isLocked 
                            ? "opacity-60 hover:bg-gray-50" 
                            : "hover:bg-blue-50"
                        }`}>
                          <div className="mt-1">
                            {isLocked ? (
                              <Lock className="w-5 h-5 text-gray-500" />
                            ) : (
                              item.icon
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                              {item.title}
                              {isLocked && (
                                <Badge variant="outline" className="text-xs">
                                  {userPlan === "Creator" ? "Influencer+" : "Superstar"}
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <DropdownMenuSeparator className="my-3" />
                <Link href="/features" onClick={() => setActiveDropdown(null)}>
                  <div className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View All Features
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Integrations Dropdown */}
            <DropdownMenu
              open={activeDropdown === "integrations"}
              onOpenChange={(open) =>
                setActiveDropdown(open ? "integrations" : null)
              }
            >
              <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group outline-none">
                Integrations
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${
                    activeDropdown === "integrations" ? "rotate-180" : ""
                  }`}
                />
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-80 p-4 bg-white/95 backdrop-blur-md border border-gray-200 shadow-xl rounded-xl z-50"
                align="start"
                style={{ zIndex: 9999 }}
              >
                <div className="grid gap-3">
                  {integrationsItems.map((item, index) => {
                    // For non-subscribed users, always show integration pages
                    // For subscribed users, check feature access
                    const isLocked = hasActiveSubscription && !hasFeatureAccess(item.feature || "");
                    
                    return (
                      <Link
                        key={index}
                        href={isLocked ? "/pricing" : item.href}
                        className="block"
                        onClick={() => setActiveDropdown(null)}
                      >
                        <div className={`flex items-start gap-3 p-3 rounded-lg transition-colors cursor-pointer group ${
                          isLocked 
                            ? "opacity-60 hover:bg-gray-50" 
                            : "hover:bg-blue-50"
                        }`}>
                          <div className="mt-1">
                            {isLocked ? (
                              <Lock className="w-5 h-5 text-gray-500" />
                            ) : (
                              item.icon
                            )}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors flex items-center gap-2">
                              {item.title}
                              {isLocked && (
                                <Badge variant="outline" className="text-xs">
                                  {userPlan === "Creator" ? "Influencer+" : "Superstar"}
                                </Badge>
                              )}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {item.description}
                            </p>
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
                <DropdownMenuSeparator className="my-3" />
                <Link
                  href="/integrations"
                  onClick={() => setActiveDropdown(null)}
                >
                  <div className="flex items-center justify-center gap-2 p-2 text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
                    View All Integrations
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Pricing */}
            <Link
              href="/pricing"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group hover-target interactive-element pricing-nav pricing-link link"
              data-interactive="true"
              data-pricing-nav="true"
              data-pricing-link="true"
              data-link="true"
              data-testid="pricing-nav-link"
              aria-label="View Pricing Plans"
            >
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>

            {/* FAQ */}
            <Link
              href="/faq"
              className="text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors relative group hover-target interactive-element"
              data-interactive="true"
              aria-label="Frequently Asked Questions"
            >
              FAQ
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-300 group-hover:w-full"></span>
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 hover:text-blue-600"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </Button>
          </div>

          {/* Auth Buttons - Desktop */}
          <div className="hidden lg:flex gap-3 items-center">
            {currentUser ? (
              <>
                {hasActiveSubscription ? (
                  <Link href="/dashboard" aria-label="Go to Dashboard">
                    <Button
                      className="premium-button text-xs px-3 py-1.5 hover-target interactive-element button"
                      data-interactive="true"
                      data-button="true"
                    >
                      <span>Dashboard</span>
                    </Button>
                  </Link>
                ) : (
                  <div className="flex items-center gap-2">
                    <Link href="/pricing" aria-label="Get Started with Pricing">
                      <Button
                        className="premium-button text-xs px-3 py-1.5 hover-target interactive-element pricing-nav pricing-link button"
                        data-interactive="true"
                        data-pricing-nav="true"
                        data-pricing-link="true"
                        data-button="true"
                      >
                        <span>Get Started</span>
                      </Button>
                    </Link>
                    {process.env.NODE_ENV === "development" && (
                      <Button
                        onClick={checkSubscription}
                        disabled={isLoadingSubscription}
                        variant="outline"
                        size="sm"
                        className="text-xs"
                        title="Refresh subscription status"
                      >
                        {isLoadingSubscription ? "🔄" : "🔄"}
                      </Button>
                    )}
                  </div>
                )}
                <UserProfile />
              </>
            ) : (
              <>
                <Link
                  href="/sign-in"
                  className="px-3 py-1.5 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors hover-target interactive-element link"
                  data-interactive="true"
                  data-link="true"
                  aria-label="Sign In"
                >
                  Sign In
                </Link>
                <Link href="/sign-up" aria-label="Sign Up">
                  <Button
                    className="premium-button text-xs px-3 py-1.5 hover-target interactive-element pricing-nav pricing-link button"
                    data-interactive="true"
                    data-pricing-nav="true"
                    data-pricing-link="true"
                    data-button="true"
                  >
                    <span>Sign Up</span>
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-gray-200">
            <div className="flex flex-col space-y-4 pt-4">
              {/* Mobile Features */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900 px-3">
                  Features
                </div>
                {featuresItems.slice(0, 3).map((item, index) => {
                  const hasAccess = hasActiveSubscription ? hasFeatureAccess(item.feature || "") : true;
                  const isLocked = hasActiveSubscription && !hasAccess;
                  
                  return (
                    <Link
                      key={index}
                      href={isLocked ? "/pricing" : item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-500" />
                        ) : (
                          item.icon
                        )}
                        <span className="text-sm font-medium">{item.title}</span>
                        {isLocked && (
                          <Badge variant="outline" className="text-xs ml-auto">
                            {userPlan === "Creator" ? "Influencer+" : "Superstar"}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Integrations */}
              <div className="space-y-2">
                <div className="text-sm font-semibold text-gray-900 px-3">
                  Integrations
                </div>
                {integrationsItems.slice(0, 3).map((item, index) => {
                  const hasAccess = hasActiveSubscription ? hasFeatureAccess(item.feature || "") : true;
                  const isLocked = hasActiveSubscription && !hasAccess;
                  
                  return (
                    <Link
                      key={index}
                      href={isLocked ? "/pricing" : item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <div className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        {isLocked ? (
                          <Lock className="w-5 h-5 text-gray-500" />
                        ) : (
                          item.icon
                        )}
                        <span className="text-sm font-medium">{item.title}</span>
                        {isLocked && (
                          <Badge variant="outline" className="text-xs ml-auto">
                            {userPlan === "Creator" ? "Influencer+" : "Superstar"}
                          </Badge>
                        )}
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Mobile Navigation Links */}
              <Link
                href="/pricing"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors hover-target interactive-element pricing-nav pricing-link link"
                data-interactive="true"
                data-pricing-nav="true"
                data-pricing-link="true"
                data-link="true"
                data-testid="mobile-pricing-nav-link"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Pricing
              </Link>
              <Link
                href="/faq"
                className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-blue-600 transition-colors"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                FAQ
              </Link>

              {/* Mobile Auth Buttons */}
              <div className="flex flex-col gap-3 pt-4 border-t border-gray-200">
                {currentUser ? (
                  <>
                    {hasActiveSubscription ? (
                      <Link href="/dashboard" aria-label="Go to Dashboard">
                        <Button
                          className="w-full premium-button text-sm py-2 hover-target interactive-element"
                          data-interactive="true"
                        >
                          <span>Dashboard</span>
                        </Button>
                      </Link>
                    ) : (
                      <Link href="/pricing" aria-label="Get Started with Pricing">
                        <Button
                          className="w-full premium-button text-sm py-2 hover-target interactive-element button pricing-nav pricing-link"
                          data-interactive="true"
                          data-button="true"
                          data-pricing-nav="true"
                          data-pricing-link="true"
                        >
                          <span>Get Started</span>
                        </Button>
                      </Link>
                    )}
                    <div className="px-3">
                      <UserProfile />
                    </div>
                  </>
                ) : (
                  <>
                    <Link href="/sign-in" aria-label="Sign In">
                      <Button
                        variant="ghost"
                        className="w-full text-sm py-2 text-gray-700 hover:text-gray-900 hover-target interactive-element button"
                        data-interactive="true"
                        data-button="true"
                      >
                        Sign In
                      </Button>
                    </Link>
                    <Link href="/sign-up" aria-label="Sign Up">
                      <Button
                        className="w-full premium-button text-sm py-2 hover-target interactive-element button pricing-nav pricing-link"
                        data-interactive="true"
                        data-button="true"
                        data-pricing-nav="true"
                        data-pricing-link="true"
                      >
                        <span>Sign Up</span>
                      </Button>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
