"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  User,
  Target,
  Palette,
  CheckCircle,
  ArrowRight,
  Upload,
  Sparkles,
  Trophy,
  Star,
  Zap,
  Crown,
  Flame,
  Rocket,
  TrendingUp,
  Award,
  Users,
  BarChart3,
  DollarSign,
  Globe,
  Video,
  Camera,
  Mic,
  PenTool,
  Heart,
  MessageCircle,
  Share2,
  Play,
  Calendar,
  Settings,
  Lock,
  Unlock,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface OnboardingFlowProps {
  user: any;
}

// Pegasus-specific content niches optimized for viral growth
const pegasusNiches = [
  "Lifestyle & Personal Development",
  "Fitness & Wellness",
  "Business & Entrepreneurship", 
  "Technology & Innovation",
  "Fashion & Beauty",
  "Food & Cooking",
  "Travel & Adventure",
  "Education & Learning",
  "Entertainment & Comedy",
  "Gaming & Esports",
  "Music & Arts",
  "Sports & Athletics",
  "Parenting & Family",
  "Finance & Investing",
  "Health & Medical",
  "Automotive & Cars",
  "Pets & Animals",
  "Home & DIY",
  "Science & Discovery",
  "Social Issues & Activism",
];

// Pegasus-specific content formats optimized for virality
const pegasusContentFormats = [
  "Short-form Videos (TikTok/Reels/Shorts)",
  "Long-form Videos (YouTube)",
  "Carousel Posts (Instagram)",
  "Story Content (24h)",
  "Live Streaming",
  "Podcast Content",
  "Educational Threads",
  "Behind-the-scenes",
  "Tutorial/How-to",
  "Reaction Content",
  "Challenge Videos",
  "Collaboration Content",
  "Q&A Sessions",
  "Product Reviews",
  "Day-in-the-life",
  "Trending Topics",
];

// Pegasus-specific brand voices for maximum engagement
const pegasusBrandVoices = [
  "Authentic & Relatable",
  "Professional & Expert",
  "Humorous & Entertaining", 
  "Inspirational & Motivational",
  "Educational & Informative",
  "Trendy & Fashionable",
  "Bold & Controversial",
  "Calm & Mindful",
  "Energetic & Dynamic",
  "Mysterious & Intriguing",
  "Friendly & Approachable",
  "Luxury & Premium",
  "Minimalist & Clean",
  "Storytelling & Narrative",
  "Data-driven & Analytical",
  "Creative & Artistic",
];

// Pegasus-specific fame goals with clear metrics
const pegasusFameGoals = [
  "Build Personal Brand (10K+ followers)",
  "Monetize Content ($1K+ monthly)",
  "Become Industry Expert",
  "Launch Business/Product",
  "Build Community (50K+ engaged)",
  "Collaborate with Brands",
  "Create Educational Content",
  "Entertain & Inspire",
  "Share Knowledge & Skills",
  "Build Network & Connections",
  "Achieve Financial Freedom",
  "Make Social Impact",
  "Creative Expression",
  "Career Opportunities",
  "Influence & Leadership",
  "Legacy Building",
];

export default function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar_url: "",
    niche: "",
    brand_voice: "",
    content_format: "",
    fame_goals: "",
    bio: "",
    target_audience: "",
    content_schedule: "",
  });
  const supabase = createClient();
  const router = useRouter();

  const handleFileUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from("avatars").getPublicUrl(filePath);

      setFormData((prev) => ({ ...prev, avatar_url: data.publicUrl }));
    } catch (error) {
      console.error("Error uploading avatar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = () => {
    if (currentStep < 5) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Update user profile with Pegasus-specific data
      const { error: userError } = await supabase
        .from("users")
        .update({
          ...formData,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (userError) throw userError;

      // Create Pegasus onboarding record
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
          pegasus_profile: {
            niche: formData.niche,
            brand_voice: formData.brand_voice,
            content_format: formData.content_format,
            fame_goals: formData.fame_goals,
            target_audience: formData.target_audience,
            content_schedule: formData.content_schedule,
          }
        });

      if (onboardingError) throw onboardingError;

      // Redirect to the actual dashboard (not onboarding)
      window.location.href = "/dashboard?onboarding=complete";
    } catch (error) {
      console.error("Error completing onboarding:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return true; // Avatar is optional
      case 2:
        return formData.niche && formData.content_format;
      case 3:
        return formData.brand_voice;
      case 4:
        return formData.fame_goals;
      case 5:
        return formData.target_audience;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Premium animated background */}
      <div className="absolute inset-0">
        {/* Floating elements */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Subtle gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-blue-100/30 to-indigo-100/30 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-indigo-100/30 to-blue-100/30 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-blue-50/20 to-indigo-50/20 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-5xl w-full relative z-10">
        {/* Premium Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4, 5].map((step) => {
              const icons = [User, Target, Palette, Trophy, Rocket];
              const Icon = icons[step - 1];
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              const colors = [
                "from-blue-500 to-indigo-500",
                "from-indigo-500 to-blue-600",
                "from-blue-600 to-indigo-600",
                "from-indigo-600 to-blue-700",
                "from-blue-700 to-indigo-700",
              ];

              return (
                <div key={step} className="flex flex-col items-center">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 transition-all duration-300 ${
                      isCompleted
                        ? `bg-gradient-to-r ${colors[step - 1]} text-white shadow-lg`
                        : isCurrent
                        ? `bg-gradient-to-r ${colors[step - 1]} text-white shadow-lg scale-110`
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <span
                    className={`text-xs font-medium ${
                      isCurrent ? "text-blue-600" : isCompleted ? "text-gray-600" : "text-gray-400"
                    }`}
                  >
                    Step {step}
                  </span>
                </div>
              );
            })}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-500 h-2 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        <Card className="bg-white p-8 md:p-12 rounded-2xl shadow-2xl border border-gray-200">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/50 via-transparent to-blue-50/50" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-500" />

          {/* Premium achievement badges */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            {currentStep > 1 && (
              <div className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Star className="w-4 h-4" />
                Profile Created!
              </div>
            )}
            {currentStep > 2 && (
              <div className="bg-gradient-to-r from-indigo-500 to-blue-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Zap className="w-4 h-4" />
                Niche Selected!
              </div>
            )}
            {currentStep > 3 && (
              <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Crown className="w-4 h-4" />
                Voice Defined!
              </div>
            )}
            {currentStep > 4 && (
              <div className="bg-gradient-to-r from-indigo-600 to-blue-700 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Trophy className="w-4 h-4" />
                Goals Set!
              </div>
            )}
          </div>

          <div className="relative z-10">
            {/* Step 1: Premium Profile Setup */}
            {currentStep === 1 && (
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                  🚀 Welcome to{" "}
                  <span className="bg-gradient-to-r from-blue-500 to-indigo-500 bg-clip-text text-transparent">
                    Pegasus
                  </span>
                </h2>

                <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                  Let's build your{" "}
                  <span className="text-blue-500 font-semibold">
                    viral creator empire
                  </span>{" "}
                  and unlock your fame potential!
                </p>

                {/* Premium stats preview */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <Users className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-500">0</div>
                    <div className="text-sm text-gray-500">Followers</div>
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500/20 to-blue-500/20 rounded-xl p-6 border border-indigo-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-indigo-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-indigo-500">0</div>
                    <div className="text-sm text-gray-500">Viral Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <DollarSign className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-500">$0</div>
                    <div className="text-sm text-gray-500">Earnings</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      {formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-blue-500 shadow-2xl"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-gray-200/50 backdrop-blur-sm border-4 border-gray-300 flex items-center justify-center">
                          <User className="w-12 h-12 text-gray-400" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full p-3 cursor-pointer hover:scale-110 transition-transform shadow-lg">
                        <Upload className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-gray-500 text-lg">
                      Upload your profile picture (optional)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Pegasus-Specific Content Preferences */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-indigo-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Target className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    🎯 Choose Your{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                      Viral Niche
                    </span>
                  </h2>

                  <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                    Select your{" "}
                    <span className="text-indigo-400 font-semibold">
                      content focus
                    </span>{" "}
                    to unlock Pegasus viral strategies
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <Label className="text-gray-700 mb-4 block text-lg font-semibold">
                      What's your primary niche?
                    </Label>
                    <Select
                      value={formData.niche}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, niche: value }))
                      }
                    >
                      <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-800 h-14 text-lg rounded-lg">
                        <SelectValue placeholder="Select your viral niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 border-gray-300">
                        {pegasusNiches.map((niche) => (
                          <SelectItem
                            key={niche}
                            value={niche}
                            className="text-gray-800 hover:bg-gray-200"
                          >
                            {niche}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-4 block text-lg font-semibold">
                      Preferred content format for virality?
                    </Label>
                    <Select
                      value={formData.content_format}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          content_format: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-800 h-14 text-lg rounded-lg">
                        <SelectValue placeholder="Select content format" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 border-gray-300">
                        {pegasusContentFormats.map((format) => (
                          <SelectItem
                            key={format}
                            value={format}
                            className="text-gray-800 hover:bg-gray-200"
                          >
                            {format}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Pegasus Brand Voice */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Palette className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    ✨ Define Your{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Brand Voice
                    </span>
                  </h2>

                  <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                    Choose your{" "}
                    <span className="text-blue-500 font-semibold">
                      communication style
                    </span>{" "}
                    to maximize engagement and virality
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {pegasusBrandVoices.map((voice) => (
                    <button
                      key={voice}
                      onClick={() => setFormData((prev) => ({ ...prev, brand_voice: voice }))}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        formData.brand_voice === voice
                          ? "border-blue-500 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white shadow-lg shadow-blue-500/25"
                          : "border-gray-300 bg-gray-100/50 backdrop-blur-sm text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-semibold text-lg">{voice}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Pegasus Fame Goals */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-indigo-600 to-blue-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    🏆 Set Your{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-blue-400 bg-clip-text text-transparent">
                      Fame Goals
                    </span>
                  </h2>

                  <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                    Define your{" "}
                    <span className="text-indigo-400 font-semibold">
                      success targets
                    </span>{" "}
                    and unlock your Pegasus potential
                  </p>

                  {/* Premium preview dashboard */}
                  <div className="bg-gradient-to-r from-gray-100/50 to-gray-50/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-gray-200 shadow-xl">
                    <div className="text-lg text-gray-600 mb-4 flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      🎯 Your Pegasus Dashboard Preview
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-500">
                          100K+
                        </div>
                        <div className="text-gray-600">Followers</div>
                      </div>
                      <div className="bg-gradient-to-r from-indigo-500/20 to-blue-500/20 rounded-lg p-4 border border-indigo-500/30">
                        <div className="text-2xl font-bold text-indigo-500">
                          95%
                        </div>
                        <div className="text-gray-600">Viral Score</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-indigo-500/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-500">
                          $10K
                        </div>
                        <div className="text-gray-600">Monthly</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {pegasusFameGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, fame_goals: goal }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        formData.fame_goals === goal
                          ? "border-blue-500 bg-gradient-to-r from-blue-500/20 to-indigo-500/20 text-white shadow-lg shadow-blue-500/25"
                          : "border-gray-300 bg-gray-100/50 backdrop-blur-sm text-gray-600 hover:border-gray-300"
                      }`}
                    >
                      <span className="font-semibold text-lg">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 5: Target Audience */}
            {currentStep === 5 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Rocket className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Globe className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                    🎯 Define Your{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-indigo-400 bg-clip-text text-transparent">
                      Target Audience
                    </span>
                  </h2>

                  <p className="text-gray-600 mb-10 text-lg md:text-xl leading-relaxed">
                    Identify your{" "}
                    <span className="text-blue-500 font-semibold">
                      ideal followers
                    </span>{" "}
                    to maximize engagement and growth
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label className="text-gray-700 mb-4 block text-lg font-semibold">
                      Who is your target audience?
                    </Label>
                    <Textarea
                      value={formData.target_audience}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          target_audience: e.target.value,
                        }))
                      }
                      placeholder="e.g., Young professionals aged 25-35 interested in personal development and career growth..."
                      className="bg-gray-100 border-gray-300 text-gray-800 h-24 text-lg rounded-lg"
                    />
                  </div>

                  <div>
                    <Label className="text-gray-700 mb-4 block text-lg font-semibold">
                      Preferred content posting schedule?
                    </Label>
                    <Select
                      value={formData.content_schedule}
                      onValueChange={(value) =>
                        setFormData((prev) => ({
                          ...prev,
                          content_schedule: value,
                        }))
                      }
                    >
                      <SelectTrigger className="bg-gray-100 border-gray-300 text-gray-800 h-14 text-lg rounded-lg">
                        <SelectValue placeholder="Select posting frequency" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-100 border-gray-300">
                        <SelectItem value="daily" className="text-gray-800 hover:bg-gray-200">
                          Daily (High Growth)
                        </SelectItem>
                        <SelectItem value="2-3_per_week" className="text-gray-800 hover:bg-gray-200">
                          2-3 times per week (Balanced)
                        </SelectItem>
                        <SelectItem value="weekly" className="text-gray-800 hover:bg-gray-200">
                          Weekly (Quality Focus)
                        </SelectItem>
                        <SelectItem value="flexible" className="text-gray-800 hover:bg-gray-200">
                          Flexible (As Inspired)
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex justify-between mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-gray-300 text-gray-600 hover:bg-gray-100 bg-gray-100/50 backdrop-blur-sm px-8 py-3 text-lg rounded-lg"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-blue-500/25 px-8 py-3 text-lg font-semibold rounded-lg"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-gray-400 border-t-gray-400 rounded-full animate-spin" />
                    <span>🚀 Launching Your Pegasus Empire...</span>
                  </div>
                ) : currentStep === 5 ? (
                  <div className="flex items-center gap-3">
                    <Rocket className="w-6 h-6" />
                    <span>🎉 Launch My Empire!</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Continue Journey</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                )}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
        .animate-shimmer {
          animation: shimmer 2s infinite;
        }
        @keyframes slide-in-right {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out;
        }
      `}</style>
    </div>
  );
}
