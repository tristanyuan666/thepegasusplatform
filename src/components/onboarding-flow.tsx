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
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { useRouter } from "next/navigation";

interface OnboardingFlowProps {
  user: any;
}

const niches = [
  "Fitness & Health",
  "Business & Finance",
  "Technology",
  "Lifestyle",
  "Food & Cooking",
  "Travel",
  "Fashion & Beauty",
  "Education",
  "Entertainment",
  "Gaming",
  "Music",
  "Art & Design",
  "Sports",
  "Parenting",
  "DIY & Crafts",
  "Other",
];

const tones = [
  "Professional",
  "Casual & Friendly",
  "Humorous",
  "Inspirational",
  "Educational",
  "Trendy",
  "Authentic",
  "Bold & Edgy",
  "Minimalist",
  "Storytelling",
];

const contentFormats = [
  "Short Videos (TikTok/Reels)",
  "Long-form Videos (YouTube)",
  "Images & Carousels",
  "Text Posts",
  "Stories",
  "Live Streams",
  "Podcasts",
  "Mixed Content",
];

const fameGoals = [
  "Build Personal Brand",
  "Grow Business",
  "Become an Influencer",
  "Share Knowledge",
  "Monetize Content",
  "Build Community",
  "Creative Expression",
  "Career Opportunities",
];

export default function OnboardingFlow({ user }: OnboardingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    avatar_url: "",
    niche: "",
    tone: "",
    content_format: "",
    fame_goals: "",
    bio: "",
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
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      // Update user profile
      const { error: userError } = await supabase
        .from("users")
        .update({
          ...formData,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", user.id);

      if (userError) throw userError;

      // Create onboarding record
      const { error: onboardingError } = await supabase
        .from("user_onboarding")
        .upsert({
          user_id: user.id,
          step_1_completed: true,
          step_2_completed: true,
          step_3_completed: true,
          step_4_completed: true,
          completed_at: new Date().toISOString(),
        });

      if (onboardingError) throw onboardingError;

      // Redirect to dashboard after successful completion
      router.push("/dashboard");
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
        return formData.tone;
      case 4:
        return formData.fame_goals;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-cyan-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        {/* Floating particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-cyan-400/40 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Gradient orbs */}
        <div className="absolute top-20 left-20 w-96 h-96 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-r from-blue-500/20 to-slate-500/20 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "1.5s" }}
        />
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-r from-cyan-400/10 to-blue-400/10 rounded-full blur-2xl animate-pulse"
          style={{ animationDelay: "3s" }}
        />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Enhanced Progress Bar */}
        <div className="mb-12">
          <div className="flex items-center justify-between mb-8">
            {[1, 2, 3, 4].map((step) => {
              const icons = [User, Palette, Sparkles, Trophy];
              const Icon = icons[step - 1];
              const isCompleted = step < currentStep;
              const isCurrent = step === currentStep;
              const colors = [
                "from-cyan-500 to-blue-500",
                "from-blue-500 to-slate-600",
                "from-slate-600 to-cyan-600",
                "from-cyan-600 to-blue-600",
              ];

              return (
                <div key={step} className="flex flex-col items-center relative">
                  {/* Connection line */}
                  {step < 4 && (
                    <div className="absolute top-8 left-16 w-24 md:w-32 h-0.5 bg-gradient-to-r from-slate-600 to-slate-700">
                      <div
                        className={`h-full bg-gradient-to-r from-cyan-500 to-blue-500 transition-all duration-1000 ${
                          step < currentStep ? "w-full" : "w-0"
                        }`}
                      />
                    </div>
                  )}

                  <div
                    className={`flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full border-4 transition-all duration-700 transform relative overflow-hidden ${
                      isCompleted
                        ? `bg-gradient-to-r ${colors[step - 1]} border-cyan-400 text-white scale-110 shadow-2xl shadow-cyan-500/50`
                        : isCurrent
                          ? `bg-gradient-to-r ${colors[step - 1]} border-blue-400 text-white scale-110 shadow-2xl shadow-blue-500/50 animate-pulse`
                          : "border-slate-600 text-slate-400 bg-slate-800/50 backdrop-blur-sm"
                    }`}
                  >
                    {/* Shimmer effect for active/completed steps */}
                    {(isCompleted || isCurrent) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
                    )}

                    {isCompleted ? (
                      <CheckCircle className="w-8 h-8 md:w-10 md:h-10 animate-bounce" />
                    ) : (
                      <Icon className="w-8 h-8 md:w-10 md:h-10" />
                    )}
                  </div>

                  <div className="mt-4 text-center">
                    <div
                      className={`text-sm md:text-base font-bold transition-colors ${
                        isCompleted || isCurrent
                          ? "text-white"
                          : "text-slate-500"
                      }`}
                    >
                      Step {step}
                    </div>
                    <div
                      className={`text-xs md:text-sm transition-colors ${
                        isCompleted || isCurrent
                          ? "text-cyan-300"
                          : "text-slate-600"
                      }`}
                    >
                      {["Profile", "Niche", "Style", "Goals"][step - 1]}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Enhanced XP-style progress bar */}
          <div className="relative">
            <div className="w-full bg-slate-800/50 backdrop-blur-sm rounded-full h-6 border-2 border-slate-700 shadow-inner">
              <div
                className="bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-600 h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden shadow-lg"
                style={{ width: `${(currentStep / 4) * 100}%` }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
            </div>
            <div className="absolute -top-10 left-0 text-white text-sm font-bold flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                Creator Level Progress: {Math.round((currentStep / 4) * 100)}%
              </span>
            </div>
          </div>
        </div>

        <Card className="bg-slate-900/80 backdrop-blur-xl border-slate-700/50 p-8 md:p-12 relative overflow-hidden shadow-2xl">
          {/* Card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-slate-800/50 via-transparent to-cyan-900/20" />
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-cyan-500" />

          {/* Achievement badges */}
          <div className="absolute top-6 right-6 flex flex-col gap-2">
            {currentStep > 1 && (
              <div className="bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Star className="w-4 h-4" />
                Profile Started!
              </div>
            )}
            {currentStep > 2 && (
              <div className="bg-gradient-to-r from-blue-500 to-slate-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Zap className="w-4 h-4" />
                Niche Expert!
              </div>
            )}
            {currentStep > 3 && (
              <div className="bg-gradient-to-r from-slate-600 to-cyan-600 text-white px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 animate-bounce shadow-lg">
                <Crown className="w-4 h-4" />
                Style Master!
              </div>
            )}
          </div>

          <div className="relative z-10">
            {/* Step 1: Profile Setup */}
            {currentStep === 1 && (
              <div className="text-center">
                <div className="relative mb-8">
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                    <User className="w-12 h-12 md:w-16 md:h-16 text-white" />
                  </div>
                  <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                    <Rocket className="w-6 h-6 text-white" />
                  </div>
                </div>

                <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                  🚀 Welcome to{" "}
                  <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                    Pegasus!
                  </span>
                </h2>

                <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed">
                  Let's build your{" "}
                  <span className="text-cyan-400 font-semibold">
                    viral creator profile
                  </span>{" "}
                  and start your fame journey!
                </p>

                {/* Enhanced stats preview */}
                <div className="grid grid-cols-3 gap-6 mb-10">
                  <div className="bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-xl p-6 border border-cyan-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <Users className="w-8 h-8 text-cyan-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-cyan-400">0</div>
                    <div className="text-sm text-slate-400">Followers</div>
                  </div>
                  <div className="bg-gradient-to-br from-blue-500/20 to-slate-500/20 rounded-xl p-6 border border-blue-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <Zap className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-blue-400">0</div>
                    <div className="text-sm text-slate-400">Viral Score</div>
                  </div>
                  <div className="bg-gradient-to-br from-slate-500/20 to-cyan-500/20 rounded-xl p-6 border border-slate-500/30 backdrop-blur-sm hover:scale-105 transition-transform">
                    <DollarSign className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                    <div className="text-3xl font-bold text-slate-400">$0</div>
                    <div className="text-sm text-slate-400">Earnings</div>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="flex flex-col items-center">
                    <div className="relative mb-6">
                      {formData.avatar_url ? (
                        <img
                          src={formData.avatar_url}
                          alt="Avatar"
                          className="w-32 h-32 rounded-full object-cover border-4 border-cyan-500 shadow-2xl"
                        />
                      ) : (
                        <div className="w-32 h-32 rounded-full bg-slate-700/50 backdrop-blur-sm border-4 border-slate-600 flex items-center justify-center">
                          <User className="w-12 h-12 text-slate-400" />
                        </div>
                      )}
                      <label className="absolute bottom-0 right-0 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full p-3 cursor-pointer hover:scale-110 transition-transform shadow-lg">
                        <Upload className="w-5 h-5 text-white" />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </label>
                    </div>
                    <p className="text-slate-400 text-lg">
                      Upload your profile picture (optional)
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Content Preferences */}
            {currentStep === 2 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-blue-500 to-slate-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Palette className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    🎨 Choose Your{" "}
                    <span className="bg-gradient-to-r from-blue-400 to-slate-400 bg-clip-text text-transparent">
                      Niche
                    </span>
                  </h2>

                  <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed">
                    Select your{" "}
                    <span className="text-blue-400 font-semibold">
                      content focus
                    </span>{" "}
                    to unlock targeted viral strategies
                  </p>
                </div>

                <div className="space-y-8">
                  <div>
                    <Label className="text-white mb-4 block text-lg font-semibold">
                      What's your niche?
                    </Label>
                    <Select
                      value={formData.niche}
                      onValueChange={(value) =>
                        setFormData((prev) => ({ ...prev, niche: value }))
                      }
                    >
                      <SelectTrigger className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-white h-14 text-lg">
                        <SelectValue placeholder="Select your niche" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {niches.map((niche) => (
                          <SelectItem
                            key={niche}
                            value={niche}
                            className="text-white hover:bg-slate-700"
                          >
                            {niche}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-white mb-4 block text-lg font-semibold">
                      Preferred content format?
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
                      <SelectTrigger className="bg-slate-800/50 backdrop-blur-sm border-slate-600 text-white h-14 text-lg">
                        <SelectValue placeholder="Select content format" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        {contentFormats.map((format) => (
                          <SelectItem
                            key={format}
                            value={format}
                            className="text-white hover:bg-slate-700"
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

            {/* Step 3: Tone & Style */}
            {currentStep === 3 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-slate-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Sparkles className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Flame className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    ✨ Define Your{" "}
                    <span className="bg-gradient-to-r from-slate-400 to-cyan-400 bg-clip-text text-transparent">
                      Voice
                    </span>
                  </h2>

                  <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed">
                    Choose your{" "}
                    <span className="text-slate-400 font-semibold">
                      communication style
                    </span>{" "}
                    to connect with your audience
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {tones.map((tone) => (
                    <button
                      key={tone}
                      onClick={() => setFormData((prev) => ({ ...prev, tone }))}
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        formData.tone === tone
                          ? "border-cyan-500 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-cyan-500/25"
                          : "border-slate-600 bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="font-semibold text-lg">{tone}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Step 4: Fame Goals */}
            {currentStep === 4 && (
              <div>
                <div className="text-center mb-10">
                  <div className="relative mb-8">
                    <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-r from-cyan-600 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse shadow-2xl">
                      <Trophy className="w-12 h-12 md:w-16 md:h-16 text-white" />
                    </div>
                    <div className="absolute -top-4 -right-4 w-12 h-12 bg-gradient-to-r from-cyan-400 to-blue-400 rounded-full flex items-center justify-center animate-bounce shadow-lg">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                  </div>

                  <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
                    🏆 Set Your{" "}
                    <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Goals
                    </span>
                  </h2>

                  <p className="text-slate-300 mb-10 text-lg md:text-xl leading-relaxed">
                    Define your{" "}
                    <span className="text-cyan-400 font-semibold">
                      success targets
                    </span>{" "}
                    and unlock your fame potential
                  </p>

                  {/* Enhanced preview dashboard */}
                  <div className="bg-gradient-to-r from-slate-800/50 to-slate-700/50 backdrop-blur-sm rounded-xl p-6 mb-8 border border-slate-600 shadow-xl">
                    <div className="text-lg text-slate-400 mb-4 flex items-center justify-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      🎯 Your Future Dashboard Preview
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg p-4 border border-cyan-500/30">
                        <div className="text-2xl font-bold text-cyan-400">
                          10K+
                        </div>
                        <div className="text-slate-400">Followers</div>
                      </div>
                      <div className="bg-gradient-to-r from-blue-500/20 to-slate-500/20 rounded-lg p-4 border border-blue-500/30">
                        <div className="text-2xl font-bold text-blue-400">
                          85%
                        </div>
                        <div className="text-slate-400">Viral Score</div>
                      </div>
                      <div className="bg-gradient-to-r from-slate-500/20 to-cyan-500/20 rounded-lg p-4 border border-slate-500/30">
                        <div className="text-2xl font-bold text-slate-400">
                          $2.5K
                        </div>
                        <div className="text-slate-400">Monthly</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  {fameGoals.map((goal) => (
                    <button
                      key={goal}
                      onClick={() =>
                        setFormData((prev) => ({ ...prev, fame_goals: goal }))
                      }
                      className={`p-6 rounded-xl border-2 transition-all duration-300 text-left hover:scale-105 ${
                        formData.fame_goals === goal
                          ? "border-cyan-500 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-white shadow-lg shadow-cyan-500/25"
                          : "border-slate-600 bg-slate-800/50 backdrop-blur-sm text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <span className="font-semibold text-lg">{goal}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Enhanced Navigation */}
            <div className="flex justify-between mt-12">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
                disabled={currentStep === 1}
                className="border-slate-600 text-slate-300 hover:bg-slate-800 bg-slate-800/50 backdrop-blur-sm px-8 py-3 text-lg"
              >
                Previous
              </Button>

              <Button
                onClick={handleNext}
                disabled={!isStepValid() || isLoading}
                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-cyan-500/25 px-8 py-3 text-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-3">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>🚀 Launching Your Fame Journey...</span>
                  </div>
                ) : currentStep === 4 ? (
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6" />
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
