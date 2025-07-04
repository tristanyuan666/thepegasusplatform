import Link from "next/link";
import { CheckCircle, ArrowRight, Sparkles, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface ConfirmedPageProps {
  searchParams: Promise<{ message?: string }>;
}

export default async function ConfirmedPage({
  searchParams,
}: ConfirmedPageProps) {
  const params = await searchParams;
  const message =
    params.message || "Your email has been confirmed successfully!";

  return (
    <div className="min-h-screen premium-white-bg">
      <Navbar />

      {/* Hero Section with Premium Styling */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-20 right-10 w-96 h-96 bg-blue-300/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="container mx-auto px-6 relative z-10 flex items-center justify-center min-h-[80vh]">
          <Card className="max-w-lg w-full glass-premium p-12 text-center hover-lift shadow-premium-lg">
            <div className="mb-8">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <div className="inline-flex items-center px-6 py-3 glass-premium mb-6 hover-lift">
                <Sparkles className="w-4 h-4 text-green-600 mr-2" />
                <span className="text-gray-800 text-sm font-semibold">
                  Account Verified
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Welcome to{" "}
                <span className="gradient-text-premium">Pegasus!</span>
              </h1>
              <p className="text-gray-600 text-lg leading-relaxed">
                {decodeURIComponent(message)}
              </p>
            </div>

            <div className="space-y-6">
              <p className="text-gray-500">
                Your account is now verified and ready to use. Start building
                your influence empire today!
              </p>

              <div className="space-y-4">
                <Button
                  asChild
                  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover-target interactive-element"
                  data-interactive="true"
                >
                  <Link
                    href="/pricing"
                    className="flex items-center justify-center gap-2"
                  >
                    <Crown className="w-5 h-5" />
                    Choose Your Plan
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>

                <Button
                  asChild
                  variant="outline"
                  className="w-full border-2 border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-xl transition-all duration-300 hover-target interactive-element"
                  data-interactive="true"
                >
                  <Link
                    href="/sign-in"
                    className="flex items-center justify-center gap-2"
                  >
                    Continue to Sign In
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>

              <div className="pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-400 mb-4">
                  Ready to start creating viral content?
                </p>
                <div className="flex flex-wrap justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full" />
                    <span>AI Content Generator</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full" />
                    <span>Multi-Platform Publishing</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-purple-500 rounded-full" />
                    <span>Growth Analytics</span>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
}
