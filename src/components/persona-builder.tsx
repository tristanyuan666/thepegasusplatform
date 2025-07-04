"use client";

import { useState } from "react";
import {
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Target,
  Palette,
  TrendingUp,
  Users,
  Camera,
  Video,
  Music,
  Gamepad2,
  Utensils,
  Dumbbell,
  BookOpen,
  Briefcase,
  Heart,
  Zap,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";

interface PersonaBuilderProps {
  onComplete?: (persona: PersonaData) => void;
  className?: string;
}

interface PersonaData {
  niche: string;
  style: string;
  goals: string[];
  targetAudience: string;
  contentTypes: string[];
  personality: string;
}

const niches = [
  {
    id: "lifestyle",
    name: "Lifestyle",
    icon: <Heart className="w-6 h-6" />,
    color: "from-pink-500 to-rose-500",
  },
  {
    id: "fitness",
    name: "Fitness & Health",
    icon: <Dumbbell className="w-6 h-6" />,
    color: "from-green-500 to-emerald-500",
  },
  {
    id: "tech",
    name: "Technology",
    icon: <Zap className="w-6 h-6" />,
    color: "from-blue-500 to-cyan-500",
  },
  {
    id: "business",
    name: "Business",
    icon: <Briefcase className="w-6 h-6" />,
    color: "from-purple-500 to-indigo-500",
  },
  {
    id: "education",
    name: "Education",
    icon: <BookOpen className="w-6 h-6" />,
    color: "from-yellow-500 to-orange-500",
  },
  {
    id: "food",
    name: "Food & Cooking",
    icon: <Utensils className="w-6 h-6" />,
    color: "from-red-500 to-pink-500",
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: <Gamepad2 className="w-6 h-6" />,
    color: "from-indigo-500 to-purple-500",
  },
  {
    id: "music",
    name: "Music",
    icon: <Music className="w-6 h-6" />,
    color: "from-purple-500 to-pink-500",
  },
];

const styles = [
  {
    id: "professional",
    name: "Professional",
    description: "Clean, authoritative, expert-focused",
  },
  {
    id: "casual",
    name: "Casual & Fun",
    description: "Relaxed, friendly, approachable",
  },
  {
    id: "inspirational",
    name: "Inspirational",
    description: "Motivating, uplifting, aspirational",
  },
  {
    id: "educational",
    name: "Educational",
    description: "Informative, detailed, teaching-focused",
  },
  {
    id: "entertaining",
    name: "Entertaining",
    description: "Humorous, engaging, personality-driven",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Premium, sophisticated, exclusive",
  },
];

const goals = [
  "Build brand awareness",
  "Generate leads",
  "Increase sales",
  "Grow followers",
  "Establish thought leadership",
  "Create community",
  "Drive website traffic",
  "Launch products",
];

const contentTypes = [
  { id: "video", name: "Short Videos", icon: <Video className="w-5 h-5" /> },
  { id: "photo", name: "Photos", icon: <Camera className="w-5 h-5" /> },
  { id: "carousel", name: "Carousels", icon: <Users className="w-5 h-5" /> },
  { id: "stories", name: "Stories", icon: <Sparkles className="w-5 h-5" /> },
];

export default function PersonaBuilder({
  onComplete,
  className = "",
}: PersonaBuilderProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [persona, setPersona] = useState<PersonaData>({
    niche: "",
    style: "",
    goals: [],
    targetAudience: "",
    contentTypes: [],
    personality: "",
  });

  const steps = [
    "Choose Your Niche",
    "Define Your Style",
    "Set Your Goals",
    "Target Audience",
    "Content Types",
    "Personality",
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete?.(persona);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const updatePersona = (field: keyof PersonaData, value: any) => {
    setPersona((prev) => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof PersonaData, item: string) => {
    const currentArray = persona[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter((i) => i !== item)
      : [...currentArray, item];
    updatePersona(field, newArray);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Choose Your Niche
              </h2>
              <p className="text-gray-300">
                What topic will you create content about?
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {niches.map((niche) => (
                <Card
                  key={niche.id}
                  className={`premium-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    persona.niche === niche.id
                      ? "ring-2 ring-pegasus-primary shadow-glow-primary"
                      : ""
                  }`}
                  onClick={() => updatePersona("niche", niche.id)}
                >
                  <div className="text-center space-y-3">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl bg-gradient-to-r ${niche.color} flex items-center justify-center text-white`}
                    >
                      {niche.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {niche.name}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Define Your Style
              </h2>
              <p className="text-gray-300">
                How do you want to present yourself?
              </p>
            </div>
            <div className="grid gap-4">
              {styles.map((style) => (
                <Card
                  key={style.id}
                  className={`premium-card p-6 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    persona.style === style.id
                      ? "ring-2 ring-pegasus-primary shadow-glow-primary"
                      : ""
                  }`}
                  onClick={() => updatePersona("style", style.id)}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-white mb-1">
                        {style.name}
                      </h3>
                      <p className="text-gray-400 text-sm">
                        {style.description}
                      </p>
                    </div>
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        persona.style === style.id
                          ? "bg-pegasus-primary border-pegasus-primary"
                          : "border-gray-400"
                      }`}
                    />
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Set Your Goals
              </h2>
              <p className="text-gray-300">
                What do you want to achieve? (Select multiple)
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {goals.map((goal) => (
                <Card
                  key={goal}
                  className={`premium-card p-4 cursor-pointer transition-all duration-300 hover:scale-[1.02] ${
                    persona.goals.includes(goal)
                      ? "ring-2 ring-pegasus-primary shadow-glow-primary"
                      : ""
                  }`}
                  onClick={() => toggleArrayItem("goals", goal)}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-white font-medium">{goal}</span>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center ${
                        persona.goals.includes(goal)
                          ? "bg-pegasus-primary border-pegasus-primary"
                          : "border-gray-400"
                      }`}
                    >
                      {persona.goals.includes(goal) && (
                        <svg
                          className="w-3 h-3 text-white"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Target Audience
              </h2>
              <p className="text-gray-300">Describe your ideal audience</p>
            </div>
            <div className="max-w-2xl mx-auto">
              <textarea
                className="premium-input w-full h-32 resize-none"
                placeholder="e.g., Young professionals aged 25-35 interested in productivity and career growth..."
                value={persona.targetAudience}
                onChange={(e) =>
                  updatePersona("targetAudience", e.target.value)
                }
              />
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Content Types
              </h2>
              <p className="text-gray-300">
                What types of content will you create?
              </p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {contentTypes.map((type) => (
                <Card
                  key={type.id}
                  className={`premium-card p-6 cursor-pointer transition-all duration-300 hover:scale-105 ${
                    persona.contentTypes.includes(type.id)
                      ? "ring-2 ring-pegasus-primary shadow-glow-primary"
                      : ""
                  }`}
                  onClick={() => toggleArrayItem("contentTypes", type.id)}
                >
                  <div className="text-center space-y-3">
                    <div
                      className={`w-12 h-12 mx-auto rounded-xl flex items-center justify-center ${
                        persona.contentTypes.includes(type.id)
                          ? "bg-pegasus-primary text-white"
                          : "bg-gray-700 text-gray-300"
                      }`}
                    >
                      {type.icon}
                    </div>
                    <h3 className="font-semibold text-white text-sm">
                      {type.name}
                    </h3>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                Your Personality
              </h2>
              <p className="text-gray-300">
                Describe your unique voice and personality
              </p>
            </div>
            <div className="max-w-2xl mx-auto">
              <textarea
                className="premium-input w-full h-32 resize-none"
                placeholder="e.g., Energetic and motivational, with a touch of humor. I love sharing personal stories and connecting with my audience..."
                value={persona.personality}
                onChange={(e) => updatePersona("personality", e.target.value)}
              />
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0:
        return persona.niche !== "";
      case 1:
        return persona.style !== "";
      case 2:
        return persona.goals.length > 0;
      case 3:
        return persona.targetAudience.trim() !== "";
      case 4:
        return persona.contentTypes.length > 0;
      case 5:
        return persona.personality.trim() !== "";
      default:
        return false;
    }
  };

  return (
    <div className={`max-w-4xl mx-auto ${className}`}>
      {/* Progress Bar */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold text-white">Persona Builder</h1>
          <span className="text-sm text-gray-400">
            Step {currentStep + 1} of {steps.length}
          </span>
        </div>
        <div className="w-full bg-gray-800 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-pegasus-primary to-neon-purple h-2 rounded-full transition-all duration-500"
            style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step}
              className={`text-xs ${
                index <= currentStep ? "text-pegasus-primary" : "text-gray-500"
              }`}
            >
              {step}
            </span>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] mb-8">{renderStep()}</div>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!canProceed()}
          className="premium-button flex items-center gap-2"
        >
          {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
