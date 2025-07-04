"use client";

import Image from "next/image";
import { useState } from "react";

interface PegasusLogoProps {
  size?: "sm" | "md" | "lg" | "xl";
  variant?: "full" | "icon" | "text";
  className?: string;
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-20 w-20",
};

const textSizeClasses = {
  sm: "text-lg",
  md: "text-xl",
  lg: "text-2xl",
  xl: "text-3xl",
};

export default function PegasusLogo({
  size = "md",
  variant = "full",
  className = "",
}: PegasusLogoProps) {
  const [imageError, setImageError] = useState(false);

  // Fallback icon component
  const FallbackIcon = () => (
    <div
      className={`${sizeClasses[size]} bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg ${className}`}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        className="w-3/4 h-3/4 text-white"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M12 2L15.09 8.26L22 9L17 14.74L18.18 21.02L12 17.77L5.82 21.02L7 14.74L2 9L8.91 8.26L12 2Z"
          fill="currentColor"
        />
        <path
          d="M12 6L13.5 10.5L18 11L15 14.5L15.75 19L12 16.5L8.25 19L9 14.5L6 11L10.5 10.5L12 6Z"
          fill="url(#pegasus-gradient)"
        />
        <defs>
          <linearGradient
            id="pegasus-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#1d8ff2" />
            <stop offset="50%" stopColor="#0ea5e9" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );

  if (variant === "text") {
    return (
      <span
        className={`${textSizeClasses[size]} font-medium gradient-text-primary ${className}`}
        style={{ fontFamily: "Satoshi, Inter, system-ui, sans-serif" }}
      >
        Pegasus
      </span>
    );
  }

  if (variant === "icon") {
    return imageError ? (
      <FallbackIcon />
    ) : (
      <div className={`${sizeClasses[size]} relative ${className}`}>
        <Image
          src="https://i.imgur.com/b19J8mY.png"
          alt="Pegasus Logo"
          fill
          className="object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    );
  }

  // Full variant
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {imageError ? (
        <FallbackIcon />
      ) : (
        <div className={`${sizeClasses[size]} relative`}>
          <Image
            src="https://i.imgur.com/b19J8mY.png"
            alt="Pegasus Logo"
            fill
            className="object-contain"
            onError={() => setImageError(true)}
          />
        </div>
      )}
      <span
        className={`${textSizeClasses[size]} font-medium tracking-tight`}
        style={{
          fontFamily: "Satoshi, Inter, system-ui, sans-serif",
          color: "#1d8ff2",
        }}
      >
        Pegasus
      </span>
    </div>
  );
}
