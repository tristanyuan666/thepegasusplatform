"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BarChart3,
  Calendar,
  DollarSign,
  Home,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Zap,
  Crown,
  Target,
  Link as LinkIcon,
  MessageCircle,
  Bell,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string;
  description?: string;
}

const navigationItems: NavigationItem[] = [
  {
    name: "Dashboard",
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions",
  },
  {
    name: "Analytics",
    href: "/dashboard?tab=analytics",
    icon: BarChart3,
    description: "Performance metrics and insights",
  },
  {
    name: "Content Hub",
    href: "/content-hub",
    icon: Sparkles,
    description: "AI content creation tools",
  },
  {
    name: "Social Platforms",
    href: "/social-hub",
    icon: LinkIcon,
    description: "Connect your social accounts",
  },
  {
    name: "Monetization",
    href: "/dashboard?tab=monetization",
    icon: DollarSign,
    description: "Revenue tracking and opportunities",
  },
  {
    name: "Growth Engine",
    href: "/dashboard?tab=growth",
    icon: TrendingUp,
    description: "Audience growth strategies",
  },
  {
    name: "Settings",
    href: "/dashboard?tab=settings",
    icon: Settings,
    description: "Account and subscription settings",
  },
];

interface DashboardNavigationProps {
  className?: string;
  variant?: "sidebar" | "tabs" | "mobile";
}

export default function DashboardNavigation({
  className,
  variant = "sidebar",
}: DashboardNavigationProps) {
  const pathname = usePathname();

  if (variant === "tabs") {
    return (
      <div className={cn("border-b border-gray-200 bg-white", className)}>
        <div className="container mx-auto px-6">
          <nav className="flex space-x-8 overflow-x-auto">
            {navigationItems.map((item) => {
              const isActive =
                pathname === item.href ||
                (item.href.includes("tab=") &&
                  typeof window !== "undefined" &&
                  window.location.search.includes(item.href.split("tab=")[1]));

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap transition-colors hover-target interactive-element",
                    isActive
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300",
                  )}
                  data-interactive="true"
                  data-dashboard-nav="true"
                  data-nav-item={item.name.toLowerCase().replace(" ", "-")}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                  {item.badge && (
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    );
  }

  if (variant === "mobile") {
    return (
      <div
        className={cn("bg-white border-t border-gray-200 px-4 py-2", className)}
      >
        <div className="grid grid-cols-4 gap-1">
          {navigationItems.slice(0, 4).map((item) => {
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex flex-col items-center gap-1 p-2 rounded-lg transition-colors hover-target interactive-element",
                  isActive
                    ? "bg-blue-50 text-blue-600"
                    : "text-gray-500 hover:text-gray-700 hover:bg-gray-50",
                )}
                data-interactive="true"
                data-dashboard-nav="true"
                data-nav-item={item.name.toLowerCase().replace(" ", "-")}
              >
                <item.icon className="w-5 h-5" />
                <span className="text-xs font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  // Sidebar variant
  return (
    <nav className={cn("space-y-2", className)}>
      {navigationItems.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 group hover-target interactive-element",
              isActive
                ? "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-50",
            )}
            data-interactive="true"
            data-dashboard-nav="true"
            data-nav-item={item.name.toLowerCase().replace(" ", "-")}
          >
            <item.icon
              className={cn(
                "w-5 h-5 transition-colors",
                isActive
                  ? "text-blue-600"
                  : "text-gray-400 group-hover:text-gray-600",
              )}
            />
            <div className="flex-1">
              <div className="font-medium">{item.name}</div>
              {item.description && (
                <div className="text-xs text-gray-500 mt-0.5">
                  {item.description}
                </div>
              )}
            </div>
            {item.badge && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
          </Link>
        );
      })}
    </nav>
  );
}

// Quick action buttons for dashboard
export function DashboardQuickActions() {
  const quickActions = [
    {
      name: "Create Content",
      href: "/content-hub",
      icon: Sparkles,
      color: "from-blue-500 to-blue-600",
    },
    {
      name: "View Analytics",
      href: "/dashboard?tab=analytics",
      icon: BarChart3,
      color: "from-green-500 to-green-600",
    },
    {
      name: "Manage Platforms",
      href: "/dashboard?tab=platforms",
      icon: LinkIcon,
      color: "from-purple-500 to-purple-600",
    },
    {
      name: "Upgrade Plan",
      href: "/pricing",
      icon: Crown,
      color: "from-yellow-500 to-yellow-600",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {quickActions.map((action) => (
        <Link
          key={action.name}
          href={action.href}
          className="group p-4 bg-white rounded-xl border border-gray-200 hover:shadow-md transition-all duration-200 hover-target interactive-element"
          data-interactive="true"
          data-dashboard-action="true"
          data-action={action.name.toLowerCase().replace(" ", "-")}
        >
          <div
            className={`w-12 h-12 bg-gradient-to-r ${action.color} rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}
          >
            <action.icon className="w-6 h-6 text-white" />
          </div>
          <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
            {action.name}
          </h3>
        </Link>
      ))}
    </div>
  );
}
