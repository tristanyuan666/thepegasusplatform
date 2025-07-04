"use server";

import { encodedRedirect } from "@/utils/utils";
import { redirect } from "next/navigation";
import { createClient } from "../../supabase/server";

export const signUpAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const fullName = formData.get("full_name")?.toString() || "";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  // Password validation
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  try {
    const supabase = await createClient();

    console.log("Attempting to sign up user:", { email, fullName });

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          email: email,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://epic-raman6-4uxp6.view-3.tempo-dev.app"}/auth/callback?type=signup&redirect_to=/email-verified`,
      },
    });

    if (error) {
      console.error("Signup error:", error);

      // Handle specific Supabase auth errors
      if (
        error.message.includes("User already registered") ||
        error.message.includes("already registered") ||
        error.message.includes("already been registered")
      ) {
        return {
          error:
            "An account with this email already exists. Please sign in instead.",
        };
      }

      if (error.message.includes("Invalid email")) {
        return {
          error: "Please enter a valid email address",
        };
      }

      if (error.message.includes("Password should be at least")) {
        return {
          error: "Password must be at least 6 characters long",
        };
      }

      if (error.message.includes("Signup is disabled")) {
        return {
          error:
            "Account registration is currently disabled. Please contact support.",
        };
      }

      if (error.message.includes("Email rate limit exceeded")) {
        return {
          error:
            "Too many signup attempts. Please wait a few minutes before trying again.",
        };
      }

      // Generic error fallback
      return {
        error: error.message || "Failed to create account. Please try again.",
      };
    }

    if (!user) {
      console.error("No user returned from signup");
      return { error: "Account creation failed. Please try again." };
    }

    console.log("User signed up successfully:", {
      userId: user.id,
      email: user.email,
      confirmed: user.email_confirmed_at,
      identities: user.identities?.length || 0,
    });

    // Check if email confirmation is required
    if (!user.email_confirmed_at) {
      console.log("Email confirmation required for user:", user.email);
      // Redirect to sign-in page with success message about email verification
      redirect(
        "/sign-in?success=Account created successfully! Please check your email and click the verification link before signing in.",
      );
    } else {
      // Email already confirmed (shouldn't happen in most setups)
      console.log("Email already confirmed for user:", user.email);
      redirect(
        "/sign-in?success=Account created and verified successfully! You can now sign in.",
      );
    }
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      // This is expected redirect behavior, re-throw it without logging as error
      throw error;
    }
    console.error("Unexpected signup error:", error);
    return {
      error: "An unexpected error occurred during signup. Please try again.",
    };
  }
};

export const signInAction = async (formData: FormData) => {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  // Basic email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { error: "Please enter a valid email address" };
  }

  try {
    const supabase = await createClient();

    console.log("Attempting to sign in user:", { email });

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      console.error("Sign in error:", error);
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        code: error.__isAuthError ? "AuthError" : "Unknown",
      });

      // Handle specific Supabase auth errors with user-friendly messages
      if (
        error.message === "Email not confirmed" ||
        error.message.includes("email not confirmed") ||
        error.message.includes("not confirmed")
      ) {
        return {
          error:
            "Please verify your email address before signing in. Check your inbox for a verification link. If you didn't receive it, try signing up again.",
        };
      }

      // Enhanced handling for "Invalid login credentials"
      if (
        error.message === "Invalid login credentials" ||
        error.message.includes("invalid credentials") ||
        error.message.includes("Invalid email or password")
      ) {
        // Note: We can't check user verification status directly from client
        // Supabase sometimes returns "invalid credentials" for unverified emails

        return {
          error:
            "Invalid email or password. Please check your credentials and try again. If you just signed up, make sure you've verified your email address first.",
        };
      }

      if (
        error.message.includes("Email not found") ||
        error.message.includes("User not found")
      ) {
        return {
          error:
            "No account found with this email address. Please sign up first.",
        };
      }

      if (
        error.message.includes("Too many requests") ||
        error.message.includes("rate limit")
      ) {
        return {
          error:
            "Too many sign-in attempts. Please wait a few minutes before trying again.",
        };
      }

      if (error.message.includes("Invalid email")) {
        return {
          error: "Please enter a valid email address",
        };
      }

      if (error.message.includes("Signups not allowed")) {
        return {
          error: "Sign-in is currently disabled. Please contact support.",
        };
      }

      // Generic error fallback with more helpful message
      return {
        error: `Sign in failed: ${error.message}. If you just signed up, please verify your email first. Otherwise, check your credentials and try again.`,
      };
    }

    if (!data.user) {
      console.error("No user returned from sign in");
      return { error: "Sign in failed. Please try again." };
    }

    console.log("User signed in successfully:", {
      userId: data.user.id,
      email: data.user.email,
      emailConfirmed: data.user.email_confirmed_at,
    });

    // Ensure user profile exists - but don't block sign in if it fails
    try {
      const { error: profileError } = await supabase.from("users").upsert(
        {
          user_id: data.user.id,
          email: data.user.email,
          full_name:
            data.user.user_metadata?.full_name ||
            data.user.user_metadata?.name ||
            null,
          avatar_url: data.user.user_metadata?.avatar_url || null,
          token_identifier: data.user.id,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id" },
      );

      if (profileError) {
        console.error("Profile update error:", profileError);
        // Continue with sign in even if profile update fails
      } else {
        console.log("User profile updated successfully");
      }
    } catch (profileError) {
      console.error("Profile update exception:", profileError);
      // Continue with sign in even if profile update fails
    }

    // Check if user has active subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", data.user.id)
      .eq("status", "active")
      .single();

    if (subError && subError.code !== "PGRST116") {
      console.error("Subscription check error:", subError);
      // Continue with sign in even if subscription check fails
    }

    console.log("Subscription status:", { hasSubscription: !!subscription });

    // Redirect to pricing page if no active subscription, otherwise to dashboard
    if (!subscription) {
      redirect("/pricing?welcome=true");
    } else {
      redirect("/dashboard");
    }
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      // This is expected redirect behavior, re-throw it without logging as error
      throw error;
    }
    console.error("Unexpected sign in error:", error);
    return {
      error: "An unexpected error occurred during sign in. Please try again.",
    };
  }
};

export const forgotPasswordAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const supabase = await createClient();
  const callbackUrl = formData.get("callbackUrl")?.toString();

  if (!email) {
    return { error: "Email is required" };
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://epic-raman6-4uxp6.view-3.tempo-dev.app"}/auth/callback?type=recovery&redirect_to=/dashboard/reset-password`,
  });

  if (error) {
    return { error: "Could not reset password" };
  }

  if (callbackUrl) {
    try {
      redirect(callbackUrl);
    } catch (error) {
      // Check if this is a redirect error (which is expected)
      if (
        error &&
        typeof error === "object" &&
        "digest" in error &&
        typeof error.digest === "string" &&
        error.digest.includes("NEXT_REDIRECT")
      ) {
        // This is expected redirect behavior, re-throw it without logging as error
        throw error;
      }
      console.error("Unexpected redirect error:", error);
    }
    return;
  }

  return { success: "Check your email for a link to reset your password." };
};

export const resetPasswordAction = async (formData: FormData) => {
  const supabase = await createClient();

  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;

  if (!password || !confirmPassword) {
    return { error: "Password and confirm password are required" };
  }

  if (password !== confirmPassword) {
    return { error: "Passwords do not match" };
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long" };
  }

  try {
    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    if (error) {
      console.error("Password update error:", error);
      return { error: error.message || "Password update failed" };
    }

    return { success: "Password updated successfully" };
  } catch (error) {
    console.error("Unexpected password update error:", error);
    return { error: "An unexpected error occurred. Please try again." };
  }
};

export const signOutAction = async () => {
  try {
    const supabase = await createClient();
    await supabase.auth.signOut();
    redirect("/sign-in");
  } catch (error) {
    // Check if this is a redirect error (which is expected)
    if (
      error &&
      typeof error === "object" &&
      "digest" in error &&
      typeof error.digest === "string" &&
      error.digest.includes("NEXT_REDIRECT")
    ) {
      // This is expected redirect behavior, re-throw it without logging as error
      throw error;
    }
    console.error("Unexpected sign out error:", error);
    // Fallback redirect
    redirect("/sign-in");
  }
};

export const checkUserSubscription = async (userId: string) => {
  const supabase = await createClient();

  const { data: subscription, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  if (error) {
    return false;
  }

  return !!subscription;
};

export const updateUserProfile = async (userId: string, profileData: any) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({
      ...profileData,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const completeOnboarding = async (
  userId: string,
  onboardingData: any,
) => {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("users")
    .update({
      niche: onboardingData.niche,
      tone: onboardingData.tone,
      content_format: onboardingData.contentFormat,
      fame_goals: onboardingData.fameGoals,
      onboarding_completed: true,
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId)
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  return { data };
};

export const getUserDashboardData = async (userId: string) => {
  const supabase = await createClient();

  // Get user profile
  const { data: userProfile, error: profileError } = await supabase
    .from("users")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (profileError) {
    return { error: profileError.message };
  }

  // Get subscription data
  const { data: subscription, error: subscriptionError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .single();

  // Get social connections
  const { data: socialConnections, error: connectionsError } = await supabase
    .from("social_connections")
    .select("*")
    .eq("user_id", userId)
    .eq("is_active", true);

  // Get recent content
  const { data: recentContent, error: contentError } = await supabase
    .from("content_queue")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(5);

  // Get analytics data (last 30 days)
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: analytics, error: analyticsError } = await supabase
    .from("analytics")
    .select("*")
    .eq("user_id", userId)
    .gte("date", thirtyDaysAgo.toISOString().split("T")[0])
    .order("date", { ascending: true });

  return {
    userProfile,
    subscription: subscriptionError ? null : subscription,
    socialConnections: connectionsError ? [] : socialConnections || [],
    recentContent: contentError ? [] : recentContent || [],
    analytics: analyticsError ? [] : analytics || [],
  };
};

export const syncUserSubscriptionStatus = async (
  userId: string,
  subscriptionData: any,
) => {
  const supabase = await createClient();

  // Update or create subscription record
  const { data, error } = await supabase
    .from("subscriptions")
    .upsert(
      {
        user_id: userId,
        stripe_id: subscriptionData.id,
        price_id: subscriptionData.items?.data[0]?.price?.id,
        status: subscriptionData.status,
        current_period_start: subscriptionData.current_period_start,
        current_period_end: subscriptionData.current_period_end,
        cancel_at_period_end: subscriptionData.cancel_at_period_end,
        amount: subscriptionData.items?.data[0]?.price?.unit_amount,
        currency: subscriptionData.currency,
        interval: subscriptionData.items?.data[0]?.price?.recurring?.interval,
        plan_name:
          subscriptionData.items?.data[0]?.price?.nickname || "Unknown Plan",
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id" },
    )
    .select()
    .single();

  if (error) {
    return { error: error.message };
  }

  // Update user's subscription field for quick access
  await supabase
    .from("users")
    .update({
      subscription:
        subscriptionData.status === "active" ? "active" : "inactive",
      updated_at: new Date().toISOString(),
    })
    .eq("user_id", userId);

  return { data };
};
