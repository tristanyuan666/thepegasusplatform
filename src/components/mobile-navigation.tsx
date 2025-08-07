"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  Home,
  BarChart3,
  DollarSign,
  Target,
  Settings,
} from "lucide-react";

interface MobileNavigationProps {
  activeTab: string;
  hasFeatureAccess: (feature: string) => boolean;
}

const navigationItems = [
  {
    name: "Home",
    href: "/dashboard?tab=home",
    icon: Home,
    feature: "home",
  },
  {
    name: "Analytics",
    href: "/dashboard?tab=analytics",
    icon: BarChart3,
    feature: "analytics",
  },
  {
    name: "Revenue",
    href: "/dashboard?tab=revenue",
    icon: DollarSign,
    feature: "revenue",
  },
  {
    name: "Platforms",
    href: "/dashboard?tab=platforms",
    icon: Target,
    feature: "platforms",
  },
  {
    name: "Settings",
    href: "/dashboard?tab=settings",
    icon: Settings,
    feature: "settings",
  },
];

export default function MobileNavigation({
  activeTab,
  hasFeatureAccess,
}: MobileNavigationProps) {
  const pathname = usePathname();

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-2 py-2 md:hidden z-50">
      <div className="grid grid-cols-5 gap-1">
        {navigationItems.map((item) => {
          const isActive = activeTab === item.name.toLowerCase();
          const hasAccess = hasFeatureAccess(item.feature);

          if (!hasAccess) {
            return (
              <div
                key={item.name}
                className="flex flex-col items-center gap-1 p-2 rounded-lg opacity-50 cursor-not-allowed"
              >
                <item.icon className="w-5 h-5 text-gray-400" />
                <span className="text-xs font-medium text-gray-400 leading-tight">{item.name}</span>
              </div>
            );
          }

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
              data-mobile-nav="true"
              data-nav-item={item.name.toLowerCase()}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium leading-tight">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
} 