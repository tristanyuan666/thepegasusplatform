"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";

export default function EmailVerifiedPage() {
  const searchParams = useSearchParams();
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const urlMessage = searchParams?.get("message");
    if (urlMessage) {
      setMessage(decodeURIComponent(urlMessage));
    } else {
      setMessage(
        "Email verified successfully! Choose your plan to get started.",
      );
    }
    setIsLoading(false);
  }, [searchParams]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          {/* Success Card */}
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>

            {/* Success Message */}
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              Email Verified Successfully!
            </h1>
            <p className="text-gray-600 mb-8 leading-relaxed">
              {message ||
                "Your email has been verified. You can now access all features of Pegasus AI."}
            </p>

            {/* CTA Buttons */}
            <div className="space-y-4">
              <Link href="/pricing">
                <Button
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-target interactive-element"
                  data-interactive="true"
                >
                  <Crown className="w-5 h-5 mr-2" />
                  Choose Your Plan
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>

              <Link href="/sign-in">
                <Button
                  variant="outline"
                  className="w-full py-3 rounded-xl hover-target interactive-element"
                  data-interactive="true"
                >
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>

            {/* Additional Info */}
            <div className="mt-8 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-center gap-2 text-sm text-gray-500">
                <Sparkles className="w-4 h-4 text-blue-500" />
                <span>Ready to create viral content with AI</span>
              </div>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span>Secure Platform</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                <span>50K+ Creators</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                <span>Premium AI</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
