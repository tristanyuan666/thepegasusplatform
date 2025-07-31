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
  Twitter,
  Linkedin,
  Youtube,
  Tiktok
} from "lucide-react";
import Link from "next/link";

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
  testimonials?: {
    name: string;
    role: string;
    content: string;
    avatar?: string;
  }[];
  pricing?: {
    plan: string;
    price: string;
    features: string[];
    popular?: boolean;
  }[];
  platform?: string;
}

const platformIcons: { [key: string]: React.ReactNode } = {
  instagram: <Instagram className="w-6 h-6" />,
  facebook: <Facebook className="w-6 h-6" />,
  twitter: <Twitter className="w-6 h-6" />,
  linkedin: <Linkedin className="w-6 h-6" />,
  youtube: <Youtube className="w-6 h-6" />,
  tiktok: <Tiktok className="w-6 h-6" />,
};

export default function PremiumFeatureIntro({
  featureName,
  featureDescription,
  requiredPlan,
  icon,
  heroImage,
  features,
  benefits,
  testimonials,
  pricing,
  platform
}: PremiumFeatureIntroProps) {
  const [user, setUser] = useState<any>(null);
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [hasActiveSubscription, setHasActiveSubscription] = useState(false);
  const [subscriptionTier, setSubscriptionTier] = useState<string>("free");
  const supabase = createClient();

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 via-purple-600/5 to-pink-600/10"></div>
        <div className="relative container mx-auto px-6 py-20">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-8">
                <div className="flex items-center gap-3">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                    {icon || <Sparkles className="w-6 h-6 text-white" />}
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
                      <span className="text-gray-700 font-medium">4.9/5 rating</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      <span className="text-gray-700 font-medium">10K+ users</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-5 h-5 text-green-600" />
                      <span className="text-gray-700 font-medium">98% success rate</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button 
                    asChild 
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-4 px-8 text-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    <Link href={getStartedHref!}>
                      {isUpgrade 
                        ? "Upgrade Now"
                        : !user 
                          ? "Start Free Trial"
                          : "Get Started"
                      }
                      <ArrowRight className="w-5 h-5 ml-2" />
                    </Link>
                  </Button>
                  
                  {!user && (
                    <Button variant="outline" asChild size="lg" className="py-4 px-8 text-lg">
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
                  <div className="w-full h-96 bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl shadow-2xl flex items-center justify-center">
                    <div className="text-center">
                      <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        {icon || <Sparkles className="w-12 h-12 text-white" />}
                      </div>
                      <h3 className="text-xl font-semibold text-gray-700">{featureName}</h3>
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
              Everything you need to succeed
            </h2>
            <p className="text-xl text-gray-600">
              Powerful tools designed for modern creators and businesses
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-8 text-center hover:shadow-lg transition-shadow duration-200 border-0 shadow-sm">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
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
              Why creators choose us
            </h2>
            <p className="text-xl text-gray-600">
              Join thousands of successful creators who've transformed their social media presence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center">
                {benefit.stat && (
                  <div className="text-4xl font-bold text-blue-600 mb-2">
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

      {/* Testimonials Section */}
      {testimonials && testimonials.length > 0 && (
        <section className="py-20 bg-white">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Loved by creators worldwide
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    {testimonial.avatar ? (
                      <img 
                        src={testimonial.avatar} 
                        alt={testimonial.name}
                        className="w-12 h-12 rounded-full"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold">
                          {testimonial.name.charAt(0)}
                        </span>
                      </div>
                    )}
                    <div>
                      <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                      <p className="text-sm text-gray-600">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="text-gray-600 leading-relaxed italic">
                    "{testimonial.content}"
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Pricing Section */}
      {pricing && pricing.length > 0 && (
        <section className="py-20 bg-gradient-to-br from-slate-50 to-blue-50">
          <div className="container mx-auto px-6">
            <div className="max-w-4xl mx-auto text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Choose your plan
              </h2>
              <p className="text-xl text-gray-600">
                Start free, upgrade when you're ready
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {pricing.map((plan, index) => (
                <Card key={index} className={`p-8 ${plan.popular ? 'ring-2 ring-blue-500 shadow-xl' : 'shadow-lg'}`}>
                  {plan.popular && (
                    <Badge className="mb-4 bg-blue-600 text-white">Most Popular</Badge>
                  )}
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.plan}</h3>
                    <div className="text-4xl font-bold text-gray-900 mb-2">{plan.price}</div>
                    <p className="text-gray-600">per month</p>
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plan.popular ? 'bg-gradient-to-r from-blue-600 to-purple-600' : 'bg-gray-900'}`}
                    size="lg"
                  >
                    Get Started
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto text-center text-white">
            <h2 className="text-3xl lg:text-4xl font-bold mb-6">
              Ready to transform your {platform ? platform : 'social media'} presence?
            </h2>
            <p className="text-xl text-blue-100 mb-8">
              Join thousands of creators who've already taken their content to the next level
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                asChild 
                className="bg-white text-blue-600 hover:bg-gray-100 font-semibold py-4 px-8 text-lg"
                size="lg"
              >
                <Link href={getStartedHref!}>
                  {isUpgrade 
                    ? "Upgrade Now"
                    : !user 
                      ? "Start Free Trial"
                      : "Get Started"
                  }
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>
              </Button>
              
              {!user && (
                <Button variant="outline" asChild size="lg" className="py-4 px-8 text-lg border-white text-white hover:bg-white hover:text-blue-600">
                  <Link href="/sign-up">
                    Create Account
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
} 