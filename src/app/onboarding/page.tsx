"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Sparkles, Target, Users, TrendingUp, CheckCircle } from "lucide-react";

interface OnboardingData {
  full_name: string;
  niche: string;
  content_format: string;
  fame_goals: string;
  tone: string;
  follower_count: string;
}

export default function OnboardingPage() {
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [onboardingData, setOnboardingData] = useState<OnboardingData>({
    full_name: "",
    niche: "",
    content_format: "",
    fame_goals: "",
    tone: "",
    follower_count: "",
  });
  
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser();
        if (!currentUser) {
          router.push("/sign-in");
          return;
        }
        setUser(currentUser);
        
        // Check if user already completed onboarding
        const { data: profile } = await supabase
          .from("users")
          .select("onboarding_completed")
          .eq("user_id", currentUser.id)
          .single();
        
        if (profile?.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
      } catch (error) {
        console.error("Error checking user:", error);
        router.push("/sign-in");
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, [supabase, router]);

  const handleInputChange = (field: keyof OnboardingData, value: string | number) => {
    setOnboardingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    try {
      console.log("Submitting onboarding data:", onboardingData);
      
      // Update user profile with onboarding data
      const { error } = await supabase
        .from("users")
        .update({
          full_name: onboardingData.full_name,
          niche: onboardingData.niche,
          content_format: onboardingData.content_format,
          fame_goals: onboardingData.fame_goals,
          tone: onboardingData.tone,
          follower_count: onboardingData.follower_count,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (error) {
        console.error("Database error:", error);
        throw error;
      }

      console.log("Onboarding completed successfully");
      
      // Redirect to dashboard
      router.push("/dashboard");
    } catch (error) {
      console.error("Error saving onboarding data:", error);
      alert("Failed to save onboarding data. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    {
      title: "Welcome to Pegasus!",
      description: "Let's get to know you and set up your creator profile",
      icon: Sparkles,
    },
    {
      title: "Your Content Niche",
      description: "Tell us about your content focus and audience",
      icon: Target,
    },
    {
      title: "Your Goals",
      description: "What do you want to achieve with your content?",
      icon: TrendingUp,
    },
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Navbar />
      
      <div className="container mx-auto px-4 py-24">
        <div className="max-w-2xl mx-auto">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                  currentStep > index + 1 ? "bg-green-500 text-white" :
                  currentStep === index + 1 ? "bg-blue-600 text-white" :
                  "bg-gray-200 text-gray-600"
                }`}>
                  {currentStep > index + 1 ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : (
                    <step.icon className="w-6 h-6" />
                  )}
                </div>
                {index < steps.length - 1 && (
                  <div className={`w-16 h-1 mx-2 ${
                    currentStep > index + 1 ? "bg-green-500" : "bg-gray-200"
                  }`} />
                )}
              </div>
            ))}
          </div>

          <Card className="shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-900">
                {steps[currentStep - 1].title}
              </CardTitle>
              <CardDescription className="text-lg text-gray-600">
                {steps[currentStep - 1].description}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep === 1 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={onboardingData.full_name}
                      onChange={(e) => handleInputChange("full_name", e.target.value)}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="follower_count">Current Follower Count</Label>
                    <Select value={onboardingData.follower_count} onValueChange={(value) => handleInputChange("follower_count", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your follower count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="less-than-5k">Less than 5K</SelectItem>
                        <SelectItem value="5k-50k">5K - 50K</SelectItem>
                        <SelectItem value="50k-500k">50K - 500K</SelectItem>
                        <SelectItem value="500k-plus">500K+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="niche">Content Niche</Label>
                    <Select value={onboardingData.niche} onValueChange={(value) => handleInputChange("niche", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="lifestyle">Lifestyle</SelectItem>
                        <SelectItem value="fitness">Fitness & Health</SelectItem>
                        <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                        <SelectItem value="tech">Technology</SelectItem>
                        <SelectItem value="gaming">Gaming</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="entertainment">Entertainment</SelectItem>
                        <SelectItem value="business">Business & Finance</SelectItem>
                        <SelectItem value="food">Food & Cooking</SelectItem>
                        <SelectItem value="travel">Travel</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="content_format">Preferred Content Format</Label>
                    <Select value={onboardingData.content_format} onValueChange={(value) => handleInputChange("content_format", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select content format" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="short-form">Short-form Videos (TikTok, Reels)</SelectItem>
                        <SelectItem value="long-form">Long-form Videos (YouTube)</SelectItem>
                        <SelectItem value="posts">Social Media Posts</SelectItem>
                        <SelectItem value="stories">Stories & Live Content</SelectItem>
                        <SelectItem value="mixed">Mixed Content</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="tone">Content Tone</Label>
                    <Select value={onboardingData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select your tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="professional">Professional</SelectItem>
                        <SelectItem value="casual">Casual & Friendly</SelectItem>
                        <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                        <SelectItem value="educational">Educational & Informative</SelectItem>
                        <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fame_goals">What are your main goals?</Label>
                    <Textarea
                      id="fame_goals"
                      value={onboardingData.fame_goals}
                      onChange={(e) => handleInputChange("fame_goals", e.target.value)}
                      placeholder="e.g., Build a community, monetize content, become an influencer, share knowledge..."
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <div className="flex justify-between pt-6">
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Previous
                  </Button>
                )}
                {currentStep < 3 ? (
                  <Button
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="ml-auto"
                  >
                    Next
                  </Button>
                ) : (
                  <Button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="ml-auto"
                  >
                    {isSubmitting ? "Setting up..." : "Complete Setup"}
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
} 