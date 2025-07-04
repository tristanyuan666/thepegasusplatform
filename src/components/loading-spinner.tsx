"use client";

import { Sparkles, Zap, Crown } from "lucide-react";
import { cn } from "@/lib/utils";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "default" | "premium" | "minimal";
  text?: string;
  className?: string;
}

const sizeClasses = {
  sm: "w-4 h-4",
  md: "w-6 h-6",
  lg: "w-8 h-8",
  xl: "w-12 h-12",
};

const textSizeClasses = {
  sm: "text-sm",
  md: "text-base",
  lg: "text-lg",
  xl: "text-xl",
};

export default function LoadingSpinner({
  size = "md",
  variant = "default",
  text,
  className,
}: LoadingSpinnerProps) {
  if (variant === "premium") {
    return (
      <div
        className={cn(
          "flex flex-col items-center justify-center gap-4",
          className,
        )}
      >
        <div className="relative">
          {/* Outer ring */}
          <div
            className={cn(
              "animate-spin rounded-full border-4 border-blue-200",
              sizeClasses[size],
            )}
          >
            <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 animate-spin" />
          </div>

          {/* Inner sparkle */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles
              className={cn(
                "text-blue-600 animate-pulse",
                size === "sm"
                  ? "w-2 h-2"
                  : size === "md"
                    ? "w-3 h-3"
                    : size === "lg"
                      ? "w-4 h-4"
                      : "w-6 h-6",
              )}
            />
          </div>
        </div>

        {text && (
          <div
            className={cn(
              "text-gray-600 font-medium animate-pulse",
              textSizeClasses[size],
            )}
          >
            {text}
          </div>
        )}
      </div>
    );
  }

  if (variant === "minimal") {
    return (
      <div className={cn("flex items-center justify-center", className)}>
        <div
          className={cn(
            "animate-spin rounded-full border-2 border-gray-300 border-t-blue-600",
            sizeClasses[size],
          )}
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3",
        className,
      )}
    >
      <div className="relative">
        <div
          className={cn(
            "animate-spin rounded-full border-3 border-blue-200",
            sizeClasses[size],
          )}
        >
          <div className="absolute inset-0 rounded-full border-3 border-transparent border-t-blue-600" />
        </div>
      </div>

      {text && (
        <div className={cn("text-gray-700 font-medium", textSizeClasses[size])}>
          {text}
        </div>
      )}
    </div>
  );
}

// Specialized loading components
export function PageLoader({ text = "Loading..." }: { text?: string }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <LoadingSpinner
        size="lg"
        variant="premium"
        text={text}
        className="text-center"
      />
    </div>
  );
}

export function ComponentLoader({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-12">
      <LoadingSpinner size="md" variant="default" text={text} />
    </div>
  );
}

export function ButtonLoader() {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>Loading...</span>
    </div>
  );
}

export function InlineLoader({ size = "sm" }: { size?: "sm" | "md" }) {
  return (
    <LoadingSpinner size={size} variant="minimal" className="inline-flex" />
  );
}

export function ButtonLoadingSpinner({
  text = "Loading...",
}: {
  text?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      <span>{text}</span>
    </div>
  );
}
