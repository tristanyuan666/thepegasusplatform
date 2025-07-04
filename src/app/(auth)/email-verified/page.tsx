import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles, Crown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";

interface EmailVerifiedPageProps {
  searchParams: Promise<{ message?: string; plan?: string }>;
}

export default async function EmailVerifiedPage({
  searchParams,
}: EmailVerifiedPageProps) {
  const params = await searchParams;
  const message =
    params.message || "Your email has been verified successfully!";
  const suggestedPlan = params.plan || "influencer";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-white flex items-center justify-center p-4">
        <Card className="max-w-lg w-full p-8 text-center shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          {/* Success Icon */}
          <div className="mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-blue-500" />
              <h1 className="text-3xl font-bold text-gray-900">
                Email Verified!
              </h1>
              <Sparkles className="w-5 h-5 text-blue-500" />
            </div>
            <p className="text-gray-600 text-lg">
              {decodeURIComponent(message)}
            </p>
          </div>

          {/* Welcome Message */}
          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Crown className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-900">
                Welcome to Pegasus!
              </h2>
            </div>
            <p className="text-gray-700 mb-4">
              Your account is now verified and ready to transform your social
              media presence with AI-powered tools.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-blue-600">50K+</div>
                <div className="text-xs text-gray-600">Creators</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">1B+</div>
                <div className="text-xs text-gray-600">Views</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">$25M+</div>
                <div className="text-xs text-gray-600">Revenue</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-4">
            <Button
              asChild
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold py-3 shadow-lg hover-target interactive-element"
              data-interactive="true"
            >
              <Link
                href={`/pricing?verified=true&recommended=${suggestedPlan}`}
                className="flex items-center justify-center gap-2"
                aria-label="Choose your plan"
              >
                <Zap className="w-5 h-5" />
                Choose Your Plan & Start Creating
                <ArrowRight className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="w-full border-2 border-blue-200 hover:border-blue-300 hover:bg-blue-50 font-semibold py-3 hover-target interactive-element"
              data-interactive="true"
            >
              <Link
                href="/sign-in"
                className="flex items-center justify-center gap-2"
                aria-label="Sign in to your account"
              >
                Sign In to Your Account
                <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </div>

          {/* Additional Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
              <CheckCircle className="w-4 h-4 text-green-500" />
              <span>Email verified successfully</span>
            </div>
            <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-3">
              <Zap className="w-4 h-4 text-blue-500" />
              <span>Account ready for premium features</span>
            </div>
            <p className="text-xs text-gray-400">
              Need help? Contact our support team at{" "}
              <a
                href="mailto:support@pegasus.ai"
                className="text-blue-600 hover:underline hover-target interactive-element"
                data-interactive="true"
              >
                support@pegasus.ai
              </a>
            </p>
          </div>
        </Card>
      </div>
    </>
  );
}
