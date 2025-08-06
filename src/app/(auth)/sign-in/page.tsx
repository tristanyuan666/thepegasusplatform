"use client";

import React, { useState, useEffect } from "react";
import { signInAction } from "@/app/actions";
import { FormMessage, Message } from "@/components/form-message";
import Navbar from "@/components/navbar";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  ValidatedInput,
  validationRules,
  useFormValidation,
} from "@/components/form-validation";
import SocialLogin from "@/components/social-login";
import Link from "next/link";

interface LoginProps {
  searchParams: Promise<Message & { error?: string; success?: string }>;
}

export default function SignInPage({ searchParams }: LoginProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [savedEmail, setSavedEmail] = useState("");

  const { values, errors, setValue, setFieldTouched, validateForm } =
    useFormValidation(
      { email: "", password: "" },
      {
        email: validationRules.email,
        password: { required: true, minLength: 1 },
      },
    );

  // Handle URL parameters for success and error messages
  React.useEffect(() => {
    const getParams = async () => {
      const params = await searchParams;
      const urlMessage = params.error
        ? { error: decodeURIComponent(params.error) }
        : params.success
          ? { success: decodeURIComponent(params.success) }
          : params;

      if (
        "error" in urlMessage ||
        "success" in urlMessage ||
        "message" in urlMessage
      ) {
        setMessage(urlMessage);
      }
    };
    getParams();
  }, [searchParams]);

  // Load saved email on component mount
  React.useEffect(() => {
    const savedEmail = localStorage.getItem("remember_email");
    if (savedEmail) {
      setSavedEmail(savedEmail);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    // Client-side validation
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("remember_me") === "on";

    if (!email || !password) {
      setMessage({ error: "Email and password are required" });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ error: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    // Store remember me preference
    if (rememberMe) {
      localStorage.setItem("remember_email", email);
    } else {
      localStorage.removeItem("remember_email");
    }

    try {
      const result = await signInAction(formData);
      if (result?.error) {
        setMessage({ error: result.error });
      }
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage({ error: "An unexpected error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-8">
        <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 shadow-sm">
          <form action={handleSubmit} className="flex flex-col space-y-6">
            <div className="space-y-2 text-center">
              <h1 className="text-3xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link
                  className="text-primary font-medium hover:underline transition-all"
                  href="/sign-up"
                >
                  Sign up
                </Link>
              </p>
            </div>

            {message && (
              <div className="space-y-2">
                <FormMessage message={message} />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email *
                </Label>
                <ValidatedInput
                  type="email"
                  name="email"
                  placeholder="you@example.com"
                  value={values.email || savedEmail}
                  onChange={(value) => setValue("email", value)}
                  onBlur={() => setFieldTouched("email")}
                  rules={validationRules.email}
                  disabled={isLoading}
                  autoComplete="email"
                  aria-label="Email address"
                />
                <div
                  id="email_error"
                  className="text-xs text-red-600 hidden"
                  role="alert"
                >
                  Please enter a valid email address
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Password *
                  </Label>
                  <Link
                    className="text-xs text-muted-foreground hover:text-foreground hover:underline transition-all hover-target interactive-element"
                    href="/forgot-password"
                    data-interactive="true"
                    aria-label="Forgot Password"
                  >
                    Forgot Password?
                  </Link>
                </div>
                <ValidatedInput
                  type="password"
                  name="password"
                  placeholder="Your password"
                  value={values.password}
                  onChange={(value) => setValue("password", value)}
                  onBlur={() => setFieldTouched("password")}
                  rules={{ required: true, minLength: 1 }}
                  disabled={isLoading}
                  autoComplete="current-password"
                  aria-label="Password"
                />
                <div
                  id="password_error"
                  className="text-xs text-red-600 hidden"
                  role="alert"
                >
                  Password is required
                </div>
              </div>
            </div>

            {/* Remember Me Checkbox */}
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="remember_me"
                name="remember_me"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2 hover-target interactive-element"
                data-interactive="true"
              />
              <Label
                htmlFor="remember_me"
                className="text-xs sm:text-sm text-gray-700 cursor-pointer hover-target interactive-element"
                data-interactive="true"
              >
                Remember me
              </Label>
            </div>

            <SubmitButton
              className="w-full hover-target interactive-element"
              pendingText="Signing in..."
              disabled={isLoading}
              data-interactive="true"
              data-auth-button="true"
              data-signin-button="true"
              aria-label="Sign in"
            >
              Sign in
            </SubmitButton>

            <div className="text-center text-sm text-muted-foreground">
              <p>Having trouble signing in?</p>
              <p className="mt-1">
                Make sure you've verified your email address first.
              </p>
            </div>
          </form>

          {/* Social Login */}
          <SocialLogin redirectTo="/dashboard" />
        </div>
      </div>
    </>
  );
}
