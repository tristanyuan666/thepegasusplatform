"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { 
  Lock, 
  Sparkles, 
  ArrowRight, 
  Crown, 
  Zap,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Users,
  Target,
  BarChart3,
  Play,
  Camera,
  MessageCircle,
  Share2,
  Globe,
  Smartphone,
  Video,
  Hash,
  Brain,
  Palette,
  Music,
  FileText,
  Plus,
  Settings,
  Instagram,
  Facebook,
  Linkedin,
  Youtube
} from "lucide-react";
import XIcon from "./x-icon";
import Link from "next/link";
import Navbar from "./navbar";
import Footer from "./footer";

interface PremiumFeatureIntroProps {
  featureName: string;
  featureDescription: string;
  requiredPlan?: "creator" | "influencer" | "superstar";
  icon?: React.ReactNode;
  heroImage?: string;
  features: {
    title: string;
    description: string;
    icon: React.ReactNode;
  }[];
  benefits: {
    title: string;
    description: string;
    stat?: string;
  }[];
  platform?: string;
  platformColor?: string;
  platformGradient?: string;
}

const platformIcons: { [key: string]: React.ReactNode } = {
  instagram: <Instagram className="w-6 h-6" />,
  facebook: <Facebook className="w-6 h-6" />,
  x: <XIcon className="w-6 h-6" />,
  linkedin: <Linkedin className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  tiktok: <Video className="w-6 h-6" />,
};

const platformThemes: { [key: string]: { color: string; gradient: string } } = {
  instagram: { color: "text-pink-600", gradient: "from-pink-500 to-purple-600" },
  facebook: { color: "text-blue-600", gradient: "from-blue-500 to-blue-700" },
  x: { color: "text-blue-600", gradient: "from-blue-500 to-blue-700" },
  linkedin: { color: "text-blue-700", gradient: "from-blue-600 to-blue-800" },
  youtube: { color: "text-red-600", gradient: "from-red-500 to-red-700" },
  tiktok: { color: "text-pink-600", gradient: "from-pink-500 to-purple-600" },
};

export default function PremiumFeatureIntro({
  featureName,
  featureDescription,
  requiredPlan,
  icon,
  heroImage,
  features,
  benefits,
  platform
}: PremiumFeatureIntroProps) {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const supabase = createClient();

  const platformTheme = platform ? platformThemes[platform] : { color: "text-blue-600", gradient: "from-blue-500 to-purple-600" };

  useEffect(() => {
    checkUserStatus();
  }, []);

  const checkUserStatus = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: subscriptionData } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", user.id)
          .eq("status", "active")
          .single();

        setSubscription(subscriptionData);
        setHasActiveSubscription(!!subscriptionData);
        
        if (subscriptionData) {
          const planName = subscriptionData.plan_name?.toLowerCase();
          if (planName?.includes("superstar")) setSubscriptionTier("superstar");
          else if (planName?.includes("influencer")) setSubscriptionTier("influencer");
          else if (planName?.includes("creator")) setSubscriptionTier("creator");
          else setSubscriptionTier("free");
        }
      }
    } catch (error) {
      console.error("Error checking user status:", error);
    } finally {
      setLoading(false);
    }
  };

  const hasFeatureAccess = () => {
    if (!hasActiveSubscription) return false;
    if (!requiredPlan) return true;
    
    const tierOrder = { creator: 1, influencer: 2, superstar: 3 };
    const userTier = tierOrder[subscriptionTier as keyof typeof tierOrder] || 0;
    const requiredTier = tierOrder[requiredPlan];
    
    return userTier >= requiredTier;
  };

  const getGetStartedHref = () => {
    if (!user) {
      return "/sign-in";
    } else if (!hasActiveSubscription) {
      return "/pricing";
    } else if (!hasFeatureAccess()) {
      return `/pricing?upgrade=${requiredPlan}`;
    } else {
      return null;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // If user has access, redirect to the actual feature
  if (user && hasActiveSubscription && hasFeatureAccess()) {
    // Redirect to the actual feature page
    window.location.href = platform ? `/integrations/${platform}` : `/features/${featureName.toLowerCase().replace(/\s+/g, '-')}`;
    return null;
  }

  const getStartedHref = getGetStartedHref();
  const isUpgrade = user && hasActiveSubscription && !hasFeatureAccess();

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-white to-blue-50"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${platformTheme.gradient} rounded-2xl shadow-lg`}>
                    {icon || <Sparkles className="w-8 h-8 text-white" />}
                  </div>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800 font-medium">
                    {platform ? `${platform.charAt(0).toUpperCase() + platform.slice(1)} Integration` : 'Premium Feature'}
                  </Badge>
                </div>
                
                <div className="space-y-6">
                  <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                    {featureName}
                  </h1>
                  <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                    {featureDescription}
                  </p>
                  
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500 fill-current" />
                      <span className="text-gray-700 font-medium">Enterprise-grade</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">Trusted by 50K+ creators</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-medium">340% average growth</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    className={`bg-gradient-to-r ${platformTheme.gradient} hover:opacity-90 text-white font-semibold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200`}
                    size="lg"
                  >
                    <Link href={getStartedHref!}>
                      {isUpgrade 
                        ? "Upgrade Plan"
                        : !user 
                          ? "Get Started"
                          : "Access Feature"
                      }
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  
                  {!user && (
                    <Button variant="outline" asChild size="lg" className="py-4 px-8 text-lg border-2">
                      <Link href="/sign-up">
                        Create Account
                      </Link>
                    </Button>
                  )}
                </div>
              </div>

              <div className="relative">
                {heroImage ? (
                  <img 
                    src={heroImage} 
                    alt={featureName}
                    className="w-full h-auto rounded-2xl shadow-2xl"
                  />
                ) : (
                  <div className={`w-full h-96 bg-gradient-to-br ${platformTheme.gradient} rounded-2xl shadow-2xl flex items-center justify-center`}>
                    <div className="text-center text-white">
                      <div className="w-24 h-24 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {icon || <Sparkles className="w-12 h-12" />}
                      </div>
                      <h3 className="text-xl font-semibold">{featureName}</h3>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Professional-grade tools for serious creators
            </h2>
            <p className="text-xl text-gray-600">
              Advanced AI-powered features designed to maximize your social media success
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
                <div className={`w-16 h-16 bg-gradient-to-r ${platformTheme.gradient} rounded-2xl flex items-center justify-center mx-auto mb-6`}>
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
              Join the elite creators who've already transformed their results
            </h2>
            <p className="text-xl text-gray-600">
              See why 50,000+ creators choose our platform to build their influence and grow their audience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                {benefit.stat && (
                  <div className={`text-4xl font-bold ${platformTheme.color} mb-2`}>
                    {benefit.stat}
                  </div>
                )}
                <h3 className="text-xl font-semibold text-gray-900 mb-4">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-4xl mx-auto">
            <div className="inline-flex items-center px-6 py-3 glass-premium mb-8 hover-lift">
              <Sparkles className="w-5 h-5 text-blue-600 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Ready to Go Viral?
              </span>
            </div>
            <h2 className="text-5xl font-bold text-black mb-8">
              Start Building Your{" "}
              <span className="bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
                Content Empire
              </span>
            </h2>
            <p className="text-2xl text-black mb-12 leading-relaxed">
              Join 50,000+ creators who are already using AI to create viral
              content and build their influence. Start your journey today.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <Button 
                asChild 
                className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white font-bold text-xl rounded-2xl shadow-xl hover-lift overflow-hidden transition-all duration-300"
                size="lg"
              >
                <Link href={getStartedHref!}>
                  <span className="relative z-10 flex items-center gap-3">
                    <Crown className="w-6 h-6" />
                    {isUpgrade 
                      ? "Upgrade Plan"
                      : !user 
                        ? "Get Started Now"
                        : "Access Feature"
                    }
                    <ArrowRight className="w-6 h-6" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </Link>
              </Button>
              
              {!user && (
                <Button variant="outline" asChild size="lg" className="py-6 px-8 text-lg border-2">
                  <Link href="/sign-up">
                    Create Account
                  </Link>
                </Button>
              )}
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-8 mt-16 text-sm text-gray-600">
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <TrendingUp className="w-4 h-4 text-blue-500" />
                <span>340% Average Growth Rate</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Users className="w-4 h-4 text-blue-500" />
                <span>50,000+ Active Creators</span>
              </div>
              <div className="flex items-center gap-2 hover:text-blue-600 transition-colors">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>AI-Powered Content Creation</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 