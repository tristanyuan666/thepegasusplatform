"use client";

import { useState } from "react";
import { createClient } from "../../supabase/client";
import { Button } from "./ui/button";

interface SocialLoginProps {
  redirectTo?: string;
}

export default function SocialLogin({
  redirectTo = "/dashboard",
}: SocialLoginProps) {
  const [isLoading, setIsLoading] = useState<"google" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleLogin = async () => {
    setIsLoading("google");
    setError(null);

    try {
      const supabase = createClient();
      // Get current domain dynamically
      const currentDomain =
        typeof window !== "undefined"
          ? window.location.origin
          : "https://thepegasus.ca";



      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${currentDomain}/auth/callback?redirect_to=${redirectTo}`,
          queryParams: {
            access_type: "offline",
            prompt: "consent",
            hd: "", // Allow any domain
          },
        },
      });

      if (error) {
        console.error("Google login error:", error);

        // More specific error handling for Google OAuth
        if (error.message.includes("Invalid login credentials")) {
          setError(
            "Please check your Google account credentials and try again.",
          );
        } else if (error.message.includes("Email not confirmed")) {
          setError("Please verify your email address first.");
        } else if (
          error.message.includes("provider is not enabled") ||
          error.message.includes("Unsupported provider")
        ) {
          setError(
            "🔧 Google sign-in is currently being configured. Please use email sign-in for now, or try again in a few minutes.",
          );
        } else if (error.message.includes("validation_failed")) {
          setError(
            "⚠️ Google OAuth is not fully configured yet. Please use email sign-in while we complete the setup.",
          );
        } else {
          setError(
            "🚫 Google sign-in temporarily unavailable. Please use email sign-in instead.",
          );
        }
      } else if (data?.url) {
        // OAuth initiated successfully, user will be redirected

        // The browser will redirect to Google's OAuth page
      }
    } catch (error) {
      console.error("Google login error:", error);
      setError(
        "An error occurred during Google sign-in. Please try email sign-in instead.",
      );
    } finally {
      // Reset loading state after a delay to allow for potential redirects
      setTimeout(() => setIsLoading(null), 3000);
    }
  };

  // Google sign-in removed as requested
  return null;
}
