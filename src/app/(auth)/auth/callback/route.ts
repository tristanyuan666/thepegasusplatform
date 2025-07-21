import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/supabase/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/";
  const redirect_to = searchParams.get("redirect_to");
  const type = searchParams.get("type"); // signup, recovery, etc.

  // Use production domain consistently
  const currentDomain = process.env.NEXT_PUBLIC_BASE_URL || "https://thepegasus.ca";

  console.log("Auth callback received:", {
    code: code ? "present" : "missing",
    next,
    redirect_to,
    type,
    origin,
    currentDomain,
  });

  if (code) {
    const supabase = await createClient();
    try {
      const { data, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code);

      console.log("Code exchange result:", {
        hasData: !!data,
        hasUser: !!data?.user,
        hasSession: !!data?.session,
        error: exchangeError?.message,
      });

      if (exchangeError) {
        console.error("Code exchange error:", exchangeError);

        // Handle specific OAuth errors more gracefully
        if (exchangeError.message.includes("Invalid login credentials")) {
          return NextResponse.redirect(
            new URL(
              `/sign-in?error=${encodeURIComponent(
                "Invalid credentials. Please check your login details and try again.",
              )}`,
              currentDomain,
            ),
          );
        } else if (exchangeError.message.includes("Email not confirmed")) {
          return NextResponse.redirect(
            new URL(
              `/sign-in?error=${encodeURIComponent(
                "Please verify your email address before signing in.",
              )}`,
              currentDomain,
            ),
          );
        } else {
          return NextResponse.redirect(
            new URL(
              `/sign-in?error=${encodeURIComponent(
                "Authentication failed. Please try signing in again.",
              )}`,
              currentDomain,
            ),
          );
        }
      }

      if (!data.user) {
        console.error("No user data after code exchange");
        return NextResponse.redirect(
          new URL(
            `/sign-in?error=${encodeURIComponent(
              "Authentication failed. Please try again.",
            )}`,
            currentDomain,
          ),
        );
      }

      console.log("User authenticated successfully:", {
        userId: data.user.id,
        email: data.user.email,
        emailConfirmed: data.user.email_confirmed_at,
      });

      // Ensure user profile exists
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
          console.error("Profile upsert error:", profileError);
          // Continue with authentication even if profile update fails
        } else {
          console.log("User profile updated successfully");
        }
      } catch (profileError) {
        console.error("Profile upsert exception:", profileError);
        // Continue with authentication even if profile update fails
      }

      // Check if user has active subscription for redirect logic
      try {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("*")
          .eq("user_id", data.user.id)
          .eq("status", "active")
          .single();

        console.log("Subscription check:", {
          hasSubscription: !!subscription,
          subError: subError?.message,
          type,
          redirect_to,
        });

        // Check for selected plan in session/cookies or redirect_to parameter
        const selectedPlan = redirect_to?.includes("plan=")
          ? new URL(redirect_to, currentDomain).searchParams.get("plan")
          : null;

        // Check if there's a specific redirect_to parameter
        if (redirect_to) {
          console.log("Redirecting to specified redirect_to:", redirect_to);
          return NextResponse.redirect(new URL(redirect_to, currentDomain));
        }

        // Default redirect to pricing page after email verification
        console.log(
          "Email verification successful, redirecting to pricing page",
        );
        return NextResponse.redirect(
          new URL(
            `/pricing?verified=true&message=${encodeURIComponent("✅ Email verified successfully! Choose your plan to get started.")}&success=true`,
            currentDomain,
          ),
        );
      } catch (subError) {
        console.error("Subscription check error:", subError);
        // Continue with default redirect
      }

      // Fallback redirect logic
      console.log("Redirecting to default next:", next);
      return NextResponse.redirect(new URL(next, currentDomain));
    } catch (error) {
      console.error("Auth callback error:", error);
      return NextResponse.redirect(
        new URL(
          `/sign-in?error=${encodeURIComponent(
            "Authentication failed. Please try again.",
          )}`,
          currentDomain,
        ),
      );
    }
  }

  // No code parameter, check if this is a direct verification link
  const verificationCode = searchParams.get("code");
  if (!verificationCode) {
    console.log("No verification code, redirecting to sign-in");
    return NextResponse.redirect(
      new URL(
        `/sign-in?message=${encodeURIComponent(
          "Please check your email and click the verification link.",
        )}`,
        currentDomain,
      ),
    );
  }

  console.log("No code parameter, redirecting to sign-in");
  return NextResponse.redirect(
    new URL(
      `/sign-in?error=${encodeURIComponent(
        "Authentication failed. Please try again.",
      )}`,
      currentDomain,
    ),
  );
}
