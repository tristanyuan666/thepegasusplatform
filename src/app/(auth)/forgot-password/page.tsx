import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";

"use client";

import { useState, useEffect } from "react";
import { FormMessage, Message } from "@/components/form-message";
import { SubmitButton } from "@/components/submit-button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { SmtpMessage } from "../smtp-message";
import { forgotPasswordAction } from "@/app/actions";
import Navbar from "@/components/navbar";

interface ForgotPasswordProps {
  searchParams: Promise<Message & { success?: string; error?: string }>;
}

export default function ForgotPasswordPage({ searchParams }: ForgotPasswordProps) {
  const [message, setMessage] = useState<Message | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Handle URL parameters for success and error messages
  useEffect(() => {
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

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    setMessage(null);

    // Client-side validation
    const email = formData.get("email") as string;
    if (!email) {
      setMessage({ error: "Email is required" });
      setIsLoading(false);
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setMessage({ error: "Please enter a valid email address" });
      setIsLoading(false);
      return;
    }

    try {
      const result = await forgotPasswordAction(formData);
      if (result?.error) {
        setMessage({ error: result.error });
      } else if (result?.success) {
        setMessage({ success: result.success });
      }
    } catch (error) {
      console.error("Forgot password error:", error);
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
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-semibold tracking-tight">
              Reset Password
            </h1>
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                className="text-primary font-medium hover:underline transition-all"
                href="/sign-in"
              >
                Sign in
              </Link>
            </p>
          </div>

          <form action={handleSubmit} className="flex flex-col space-y-6">
            {message && (
              <div className="space-y-2">
                <FormMessage message={message} />
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full"
                />
              </div>
            </div>

            <SubmitButton
              pendingText="Sending reset link..."
              disabled={isLoading}
              className="w-full hover-target interactive-element"
            >
              Reset Password
            </SubmitButton>
          </form>
        </div>
        <SmtpMessage />
      </div>
    </>
  );
}
