"use client";

import { useState, useEffect } from "react";
import { Zap, TrendingUp, Target, Flame, Star } from "lucide-react";

interface ViralScoreMeterProps {
  score: number;
  size?: "sm" | "md" | "lg";
  showDetails?: boolean;
  animated?: boolean;
  className?: string;
}

export default function ViralScoreMeter({
  score,
  size = "md",
  showDetails = true,
  animated = true,
  className = "",
}: ViralScoreMeterProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [glowIntensity, setGlowIntensity] = useState(0);

  const sizeClasses = {
    sm: "w-16 h-16",
    md: "w-24 h-24",
    lg: "w-32 h-32",
  };

  const textSizes = {
    sm: "text-xs",
    md: "text-sm",
    lg: "text-base",
  };

  const scoreSizes = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  useEffect(() => {
    if (animated) {
      let current = 0;
      const increment = score / 60;
      const timer = setInterval(() => {
        current += increment;
        if (current >= score) {
          setAnimatedScore(score);
          clearInterval(timer);
        } else {
          setAnimatedScore(Math.floor(current));
        }
      }, 30);

      return () => clearInterval(timer);
    } else {
      setAnimatedScore(score);
    }
  }, [score, animated]);

  useEffect(() => {
    // Pulsing glow effect based on score
    const glowTimer = setInterval(() => {
      setGlowIntensity((prev) => (prev + 1) % 100);
    }, 50);

    return () => clearInterval(glowTimer);
  }, []);

  const getScoreColor = (score: number) => {
    if (score >= 90)
      return {
        color: "#10B981",
        gradient: "from-green-400 to-emerald-500",
        glow: "shadow-green-500/50",
      };
    if (score >= 80)
      return {
        color: "#F59E0B",
        gradient: "from-yellow-400 to-orange-500",
        glow: "shadow-yellow-500/50",
      };
    if (score >= 60)
      return {
        color: "#3B82F6",
        gradient: "from-blue-400 to-blue-600",
        glow: "shadow-blue-500/50",
      };
    if (score >= 40)
      return {
        color: "#8B5CF6",
        gradient: "from-purple-400 to-purple-600",
        glow: "shadow-purple-500/50",
      };
    return {
      color: "#EF4444",
      gradient: "from-red-400 to-red-600",
      glow: "shadow-red-500/50",
    };
  };

  const getScoreLabel = (score: number) => {
    if (score >= 90) return { text: "Viral Ready!", icon: Flame };
    if (score >= 80) return { text: "High Potential", icon: Star };
    if (score >= 60) return { text: "Good Reach", icon: TrendingUp };
    if (score >= 40) return { text: "Moderate", icon: Target };
    return { text: "Needs Work", icon: Zap };
  };

  const scoreData = getScoreColor(animatedScore);
  const scoreLabel = getScoreLabel(animatedScore);
  const Icon = scoreLabel.icon;

  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDasharray = circumference;
  const strokeDashoffset =
    circumference - (animatedScore / 100) * circumference;

  return (
    <div className={`flex flex-col items-center ${className}`}>
      {/* Circular Progress Meter */}
      <div className={`relative ${sizeClasses[size]} mb-4`}>
        {/* Glow effect */}
        <div
          className={`absolute inset-0 rounded-full blur-md ${scoreData.glow} transition-all duration-300`}
          style={{
            opacity: animated ? Math.sin(glowIntensity * 0.1) * 0.3 + 0.4 : 0.4,
            transform: `scale(${1 + Math.sin(glowIntensity * 0.1) * 0.1})`,
          }}
        />

        {/* SVG Circle */}
        <svg
          className={`${sizeClasses[size]} transform -rotate-90`}
          viewBox="0 0 100 100"
        >
          {/* Background circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke="rgba(156, 163, 175, 0.2)"
            strokeWidth="8"
            fill="none"
          />

          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="45"
            stroke={`url(#gradient-${score})`}
            strokeWidth="8"
            fill="none"
            strokeLinecap="round"
            strokeDasharray={strokeDasharray}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
            style={{
              filter: `drop-shadow(0 0 8px ${scoreData.color}66)`,
            }}
          />

          {/* Gradient definition */}
          <defs>
            <linearGradient
              id={`gradient-${score}`}
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor={scoreData.color} stopOpacity="0.8" />
              <stop offset="100%" stopColor={scoreData.color} stopOpacity="1" />
            </linearGradient>
          </defs>
        </svg>

        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div
            className={`${scoreSizes[size]} font-bold text-gray-900 leading-none`}
          >
            {animatedScore}
          </div>
          <div className={`${textSizes[size]} text-gray-500 font-medium`}>
            VIRAL
          </div>
        </div>
      </div>

      {/* Score details */}
      {showDetails && (
        <div className="text-center">
          <div className={`flex items-center gap-2 mb-2 ${textSizes[size]}`}>
            <Icon
              className={`w-4 h-4 ${
                scoreData.color === "#10B981"
                  ? "text-green-500"
                  : scoreData.color === "#F59E0B"
                    ? "text-yellow-500"
                    : scoreData.color === "#3B82F6"
                      ? "text-blue-500"
                      : scoreData.color === "#8B5CF6"
                        ? "text-purple-500"
                        : "text-red-500"
              }`}
            />
            <span className="font-semibold text-gray-900">
              {scoreLabel.text}
            </span>
          </div>
          <div className={`${textSizes[size]} text-gray-600`}>
            {animatedScore >= 80
              ? "Ready to go viral!"
              : animatedScore >= 60
                ? "Good engagement expected"
                : animatedScore >= 40
                  ? "Moderate reach likely"
                  : "Consider optimizing content"}
          </div>
        </div>
      )}
    </div>
  );
}

// Compact version for inline use
export function ViralScoreBadge({
  score,
  className = "",
}: {
  score: number;
  className?: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "bg-green-100 text-green-700 border-green-200";
    if (score >= 60) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (score >= 40) return "bg-blue-100 text-blue-700 border-blue-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

  return (
    <div
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getScoreColor(score)} ${className}`}
    >
      <Zap className="w-3 h-3" />
      <span>{score}% viral</span>
    </div>
  );
}
