import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Facebook, ArrowRight, Share2, Users, BarChart3 } from "lucide-react";
import Link from "next/link";

export default function FacebookIntegrationPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Section */}
      <section className="py-24 bg-gradient-to-br from-blue-50 to-white relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-6 py-3 bg-white/60 backdrop-blur-sm rounded-full mb-8 shadow-lg border border-white/30">
              <Facebook className="w-5 h-5 text-blue-800 mr-3" />
              <span className="text-gray-800 text-sm font-semibold">
                Facebook Integration
              </span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Connect Your{" "}
              <span className="bg-gradient-to-r from-blue-800 to-blue-900 bg-clip-text text-transparent">
                Facebook Pages
              </span>
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto leading-relaxed mb-12">
              Seamlessly manage your Facebook pages, posts, and stories with
              AI-powered content creation and analytics.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/pricing"
                className="bg-gradient-to-r from-blue-800 to-blue-900 text-white px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 hover-target interactive-element"
                data-interactive="true"
              >
                Get Started
                <ArrowRight className="w-4 h-4 ml-2 inline" />
              </Link>
              <Link
                href="/integrations"
                className="border border-gray-300 text-gray-700 px-8 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all duration-300 hover-target interactive-element"
                data-interactive="true"
              >
                View All Integrations
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-700 to-blue-800 rounded-lg flex items-center justify-center mb-6">
                <Share2 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Page Management
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Create and schedule Facebook posts, stories, and live videos with
                AI-generated content and optimal timing.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-800 to-blue-900 rounded-lg flex items-center justify-center mb-6">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Community Engagement
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Monitor likes, comments, and shares with detailed
                analytics and community insights.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-900 to-blue-950 rounded-lg flex items-center justify-center mb-6">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Page Analytics
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Track page performance, reach, and engagement with
                comprehensive analytics and insights.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
} 