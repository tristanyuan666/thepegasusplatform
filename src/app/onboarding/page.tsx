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
import { Sparkles, Target, Users, TrendingUp, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

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
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
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
        const { data: profile, error: profileError } = await supabase
          .from("users")
          .select("onboarding_completed, full_name, niche, content_format, fame_goals, tone, follower_count")
          .eq("user_id", currentUser.id)
          .single();
        
        if (profileError && profileError.code !== "PGRST116") {
          console.error("Error checking onboarding status:", profileError);
          setError("Failed to load your profile. Please try again.");
          return;
        }
        
        if (profile?.onboarding_completed) {
          router.push("/dashboard");
          return;
        }
        
        // Pre-fill form with existing data if available
        if (profile) {
          setOnboardingData(prev => ({
            ...prev,
            full_name: profile.full_name || "",
            niche: profile.niche || "",
            content_format: profile.content_format || "",
            fame_goals: profile.fame_goals || "",
            tone: profile.tone || "",
            follower_count: profile.follower_count || "",
          }));
        }
      } catch (error) {
        console.error("Error checking user:", error);
        setError("Failed to load your account. Please try again.");
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
    // Clear any previous errors when user starts typing
    if (error) setError(null);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return onboardingData.full_name.trim().length > 0;
      case 2:
        return onboardingData.niche.trim().length > 0 && onboardingData.content_format.trim().length > 0;
      case 3:
        return onboardingData.tone.trim().length > 0;
      case 4:
        return onboardingData.fame_goals.trim().length > 0;
      case 5:
        return onboardingData.follower_count.trim().length > 0;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!validateStep(currentStep)) {
      setError("Please complete all required fields before continuing.");
      return;
    }
    
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
      setError(null);
    } else {
      handleSubmit();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      setError(null);
    }
  };

  const handleSubmit = async () => {
    if (!user) return;
    
    setIsSubmitting(true);
    setError(null);
    
    try {

      
      // Update user profile with onboarding data
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: onboardingData.full_name.trim(),
          niche: onboardingData.niche.trim(),
          content_format: onboardingData.content_format.trim(),
          fame_goals: onboardingData.fame_goals.trim(),
          tone: onboardingData.tone.trim(),
          follower_count: onboardingData.follower_count.trim(),
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (updateError) {
        console.error("Error updating user profile:", updateError);
        throw new Error("Failed to save your profile. Please try again.");
      }

      // Create onboarding completion record
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .upsert({
          user_id: user.id,
          step_1_completed: true,
          step_2_completed: true,
          step_3_completed: true,
          step_4_completed: true,
          step_5_completed: true,
          completed_at: new Date().toISOString(),
        });

      if (onboardingError) {
        console.error("Error creating onboarding record:", onboardingError);
        // Don't throw error here as the main profile update succeeded
      }

      setSuccess("Onboarding completed successfully!");
      
      // Redirect to dashboard after a short delay
      setTimeout(() => {
        router.push("/dashboard?onboarding=complete");
      }, 1500);
      
    } catch (error) {
      console.error("Error completing onboarding:", error);
      setError(error instanceof Error ? error.message : "Failed to complete onboarding. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading your profile...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!user) {
    return null; // Will redirect to sign-in
  }

  const progress = (currentStep / 5) * 100;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
        <div className="max-w-4xl mx-auto px-4 py-8">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Complete Your Profile</h1>
              <span className="text-sm text-gray-600">Step {currentStep} of 5</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <Alert className="mb-6 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-800">{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert className="mb-6 border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <Card className="shadow-lg">
            <CardContent className="p-8">
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Users className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Tell Us About Yourself</h2>
                    <p className="text-gray-600">Let's start with your basic information</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="full_name">Full Name *</Label>
                      <Input
                        id="full_name"
                        value={onboardingData.full_name}
                        onChange={(e) => handleInputChange("full_name", e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Content Preferences */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Target className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Content Style</h2>
                    <p className="text-gray-600">Help us understand your content preferences</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="niche">Content Niche *</Label>
                      <Select value={onboardingData.niche} onValueChange={(value) => handleInputChange("niche", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your niche" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="lifestyle">Lifestyle</SelectItem>
                          <SelectItem value="fitness">Fitness & Health</SelectItem>
                          <SelectItem value="fashion">Fashion & Beauty</SelectItem>
                          <SelectItem value="tech">Technology</SelectItem>
                          <SelectItem value="business">Business & Finance</SelectItem>
                          <SelectItem value="education">Education</SelectItem>
                          <SelectItem value="entertainment">Entertainment</SelectItem>
                          <SelectItem value="food">Food & Cooking</SelectItem>
                          <SelectItem value="travel">Travel</SelectItem>
                          <SelectItem value="gaming">Gaming</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <Label htmlFor="content_format">Preferred Content Format *</Label>
                      <Select value={onboardingData.content_format} onValueChange={(value) => handleInputChange("content_format", value)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select your preferred format" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="short-form">Short-form Videos</SelectItem>
                          <SelectItem value="long-form">Long-form Videos</SelectItem>
                          <SelectItem value="posts">Social Media Posts</SelectItem>
                          <SelectItem value="stories">Stories & Reels</SelectItem>
                          <SelectItem value="live">Live Streaming</SelectItem>
                          <SelectItem value="mixed">Mixed Content</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Brand Voice */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Sparkles className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Brand Voice</h2>
                    <p className="text-gray-600">Define how you want to communicate with your audience</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="tone">Brand Tone *</Label>
                    <Select value={onboardingData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your brand tone" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="authentic">Authentic & Relatable</SelectItem>
                        <SelectItem value="professional">Professional & Expert</SelectItem>
                        <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                        <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                        <SelectItem value="educational">Educational & Informative</SelectItem>
                        <SelectItem value="trendy">Trendy & Fashionable</SelectItem>
                        <SelectItem value="bold">Bold & Controversial</SelectItem>
                        <SelectItem value="calm">Calm & Mindful</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 4: Goals */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <TrendingUp className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Goals</h2>
                    <p className="text-gray-600">What do you want to achieve with your content?</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="fame_goals">Primary Goal *</Label>
                    <Select value={onboardingData.fame_goals} onValueChange={(value) => handleInputChange("fame_goals", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your primary goal" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="build-brand">Build Personal Brand (10K+ followers)</SelectItem>
                        <SelectItem value="monetize">Monetize Content ($1K+ monthly)</SelectItem>
                        <SelectItem value="become-expert">Become Industry Expert</SelectItem>
                        <SelectItem value="launch-business">Launch Business/Product</SelectItem>
                        <SelectItem value="build-community">Build Community (50K+ engaged)</SelectItem>
                        <SelectItem value="collaborate-brands">Collaborate with Brands</SelectItem>
                        <SelectItem value="creative-expression">Creative Expression</SelectItem>
                        <SelectItem value="career-opportunities">Career Opportunities</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Step 5: Current Status */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                      <CheckCircle className="w-8 h-8 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Current Status</h2>
                    <p className="text-gray-600">Help us understand your current reach</p>
                  </div>
                  
                  <div>
                    <Label htmlFor="follower_count">Current Follower Count *</Label>
                    <Select value={onboardingData.follower_count} onValueChange={(value) => handleInputChange("follower_count", value)}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Select your current follower count" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0-1000">0 - 1,000 followers</SelectItem>
                        <SelectItem value="1000-5000">1,000 - 5,000 followers</SelectItem>
                        <SelectItem value="5000-10000">5,000 - 10,000 followers</SelectItem>
                        <SelectItem value="10000-50000">10,000 - 50,000 followers</SelectItem>
                        <SelectItem value="50000-100000">50,000 - 100,000 followers</SelectItem>
                        <SelectItem value="100000+">100,000+ followers</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8">
                <Button
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1 || isSubmitting}
                >
                  Back
                </Button>
                
                <Button
                  onClick={handleNext}
                  disabled={!validateStep(currentStep) || isSubmitting}
                  className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : currentStep === 5 ? (
                    "Complete Setup"
                  ) : (
                    "Next"
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </>
  );
} 