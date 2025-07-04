import Link from "next/link";
import { Sparkles, Heart } from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 border-t border-slate-800/50 relative overflow-hidden">
      {/* Premium Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-indigo-600/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/3 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 py-16 sm:py-20 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 sm:gap-12 mb-12 sm:mb-16">
          {/* Enhanced Brand Section */}
          <div className="sm:col-span-2 md:col-span-2">
            <div className="flex items-center gap-3 mb-4 sm:mb-6">
              <div className="w-10 sm:w-12 h-10 sm:h-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl flex items-center justify-center shadow-lg">
                <Sparkles className="w-5 sm:w-7 h-5 sm:h-7 text-white" />
              </div>
              <span className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                Pegasus
              </span>
            </div>
            <p className="text-gray-300 max-w-lg leading-relaxed text-base sm:text-lg mb-6 sm:mb-8">
              Transform into an influential content creator with our AI-powered
              platform. Build, grow, and monetize your social media presence
              with cutting-edge technology.
            </p>

            {/* Premium Stats */}
            <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  50K+
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">
                  Active Creators
                </div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  99.9%
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-xl sm:text-2xl font-bold text-white mb-1">
                  24/7
                </div>
                <div className="text-gray-400 text-xs sm:text-sm">Support</div>
              </div>
            </div>
          </div>

          {/* Enhanced Product Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full" />
              Product
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group hover-target interactive-element link"
                  data-interactive="true"
                  data-link="true"
                >
                  <span>Features</span>
                  <div className="w-0 group-hover:w-4 h-px bg-blue-500 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group hover-target interactive-element link pricing-nav pricing-link"
                  data-interactive="true"
                  data-link="true"
                  data-pricing-nav="true"
                  data-pricing-link="true"
                  data-testid="footer-pricing-link"
                >
                  <span>Pricing</span>
                  <div className="w-0 group-hover:w-4 h-px bg-blue-500 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/integrations"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                >
                  <span>Integrations</span>
                  <div className="w-0 group-hover:w-4 h-px bg-blue-500 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Enhanced Support Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-500 rounded-full" />
              Support
            </h3>
            <ul className="space-y-4">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group"
                >
                  <span>FAQ</span>
                  <div className="w-0 group-hover:w-4 h-px bg-cyan-500 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group hover-target interactive-element link pricing-nav pricing-link"
                  data-interactive="true"
                  data-link="true"
                  data-pricing-nav="true"
                  data-pricing-link="true"
                  data-testid="footer-get-started-link"
                >
                  <span>Get Started</span>
                  <div className="w-0 group-hover:w-4 h-px bg-cyan-500 transition-all duration-300" />
                </Link>
              </li>
              <li>
                <Link
                  href="/features"
                  className="text-gray-300 hover:text-white transition-all duration-300 hover:translate-x-1 flex items-center gap-2 group hover-target interactive-element link"
                  data-interactive="true"
                  data-link="true"
                >
                  <span>AI Features</span>
                  <div className="w-0 group-hover:w-4 h-px bg-cyan-500 transition-all duration-300" />
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Premium Bottom Section */}
        <div className="pt-6 sm:pt-8 border-t border-slate-700/50">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6">
            <div className="text-gray-400 text-center md:text-left flex flex-col sm:flex-row items-center gap-2 text-sm sm:text-base">
              <span>© {currentYear} Pegasus AI. All rights reserved.</span>
              <span className="flex items-center gap-2">
                Built with
                <Heart className="w-4 h-4 text-red-400" />
                for creators worldwide.
              </span>
            </div>

            {/* Premium Badge */}
            <div className="flex items-center gap-2 sm:gap-3 bg-gradient-to-r from-blue-600/10 to-cyan-600/10 px-4 sm:px-6 py-2 sm:py-3 rounded-full border border-blue-500/20">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span className="text-blue-400 font-semibold text-xs sm:text-sm">
                Premium AI Platform
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
