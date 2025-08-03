"use client";

import Link from "next/link";
import { createClient } from "../../supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { 
  UserCircle, 
  Home, 
  BarChart3, 
  DollarSign, 
  Settings, 
  Target,
  LogOut,
  Crown
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  user_id: string;
  full_name: string;
  email: string;
  plan: string;
  plan_status: string;
  plan_billing: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

interface Subscription {
  stripe_id: string;
  user_id: string;
  plan_name: string;
  billing_cycle: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

type DashboardTab = "home" | "analytics" | "revenue" | "platforms" | "settings";

interface DashboardNavbarProps {
  user: User;
  userProfile: UserProfile;
  subscription: Subscription | null;
  activeTab: DashboardTab;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardNavbar({
  user,
  userProfile,
  subscription,
  activeTab,
  hasFeatureAccess,
}: DashboardNavbarProps) {
  const [isMounted, setIsMounted] = useState(false);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleSignOut = async () => {
    try {
      await supabase.auth.signOut();
      if (typeof window !== "undefined") {
        window.location.href = "/";
      }
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const getPlanColor = (plan: string | null) => {
    if (!plan) return "bg-gray-100 text-gray-800";
    
    switch (plan.toLowerCase()) {
      case "creator":
        return "bg-blue-100 text-blue-800";
      case "influencer":
        return "bg-blue-100 text-blue-800";
      case "superstar":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (!isMounted) {
    return (
      <nav className="w-full border-b border-gray-200 bg-white py-4">
        <div className="container mx-auto px-4 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link href="/" className="text-xl font-bold">
              Logo
            </Link>
          </div>
          <div className="flex gap-4 items-center">
            <Button variant="ghost" size="icon">
              <UserCircle className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="w-full border-b border-gray-200 bg-white py-2 md:py-4">
      <div className="container mx-auto px-3 md:px-4 flex justify-between items-center">
        {/* Logo */}
        <div className="flex items-center gap-2 md:gap-4">
          <Link
            href="/"
            className="text-base md:text-xl font-bold hover-target interactive-element"
            data-interactive="true"
          >
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-5 h-5 md:w-8 md:h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs md:text-sm">P</span>
              </div>
              <span className="gradient-text-primary hidden sm:inline">Pegasus</span>
            </div>
          </Link>
        </div>

        {/* Navigation Tabs - Hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex items-center gap-1">
          <Link href="/dashboard?tab=home">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              size="sm"
              className="hover-target interactive-element"
              data-interactive="true"
            >
              <Home className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>
          
          {hasFeatureAccess("analytics") && (
            <Link href="/dashboard?tab=analytics">
              <Button
                variant={activeTab === "analytics" ? "default" : "ghost"}
                size="sm"
                className="hover-target interactive-element"
                data-interactive="true"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytics
              </Button>
            </Link>
          )}
          
          {hasFeatureAccess("revenue") && (
            <Link href="/dashboard?tab=revenue">
              <Button
                variant={activeTab === "revenue" ? "default" : "ghost"}
                size="sm"
                className="hover-target interactive-element"
                data-interactive="true"
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Revenue
              </Button>
            </Link>
          )}
          
          {hasFeatureAccess("platforms") && (
            <Link href="/dashboard?tab=platforms">
              <Button
                variant={activeTab === "platforms" ? "default" : "ghost"}
                size="sm"
                className="hover-target interactive-element"
                data-interactive="true"
              >
                <Target className="h-4 w-4 mr-2" />
                Platforms
              </Button>
            </Link>
          )}
          
          <Link href="/dashboard?tab=settings">
            <Button
              variant={activeTab === "settings" ? "default" : "outline"}
              size="sm"
              className="hover-target interactive-element text-gray-700 hover:text-blue-600 border-gray-300 hover:border-blue-300"
              data-interactive="true"
            >
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
          </Link>
        </div>

        {/* User Menu */}
        <div className="flex gap-2 md:gap-4 items-center">
          {/* Plan Badge - Hidden on mobile */}
          {subscription && subscription.plan_name && (
            <Badge className={`${getPlanColor(subscription.plan_name)} hidden md:flex`}>
              <Crown className="w-3 h-3 mr-1" />
              <span className="hidden lg:inline">{subscription.plan_name} ({subscription.billing_cycle})</span>
              <span className="lg:hidden">{subscription.plan_name}</span>
            </Badge>
          )}
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="hover-target interactive-element w-7 h-7 md:w-10 md:h-10"
                data-interactive="true"
              >
                <UserCircle className="h-4 w-4 md:h-6 md:w-6" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="px-2 py-1.5">
                <p className="text-sm font-medium">{userProfile.full_name || user.email || 'User'}</p>
                <p className="text-xs text-gray-500">{user.email || 'No email'}</p>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href="/"
                  className="hover-target interactive-element"
                  data-interactive="true"
                >
                  <Home className="h-4 w-4 mr-2" />
                  Back to Home
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </nav>
  );
}
