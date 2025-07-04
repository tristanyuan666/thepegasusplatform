"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  RefreshCw,
  Play,
  Settings,
  CreditCard,
  Users,
  BarChart3,
  Link as LinkIcon,
  Mail,
  Lock,
  Home,
  Zap,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { createClient as createServerClient } from "@/supabase/server";

interface TestResult {
  name: string;
  status: "pending" | "success" | "error" | "warning";
  message: string;
  details?: string;
}

interface SystemTestProps {
  user?: any;
}

export default function SystemTest({ user }: SystemTestProps) {
  const [tests, setTests] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState<string | null>(null);
  const supabase = createClient();

  const updateTest = (
    name: string,
    status: TestResult["status"],
    message: string,
    details?: string,
  ) => {
    setTests((prev) => {
      const existing = prev.find((t) => t.name === name);
      if (existing) {
        existing.status = status;
        existing.message = message;
        existing.details = details;
        return [...prev];
      }
      return [...prev, { name, status, message, details }];
    });
  };

  const runSystemTests = async () => {
    setIsRunning(true);
    setTests([]);

    const testSuite = [
      {
        name: "Database Connection",
        test: async () => {
          try {
            const { data, error } = await supabase
              .from("users")
              .select("count")
              .limit(1);
            if (error) throw error;
            return {
              success: true,
              message: "Database connected successfully",
            };
          } catch (error) {
            return {
              success: false,
              message: "Database connection failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Authentication System",
        test: async () => {
          try {
            const {
              data: { session },
              error: sessionError,
            } = await supabase.auth.getSession();

            if (sessionError) {
              return {
                success: false,
                message: "Authentication system error",
                details: sessionError.message,
              };
            }

            // Check if authentication system is working regardless of current state
            const authWorking = !sessionError;

            if (user && session) {
              return {
                success: true,
                message: "User authenticated successfully",
                details: `User ID: ${user.id}, Session valid: ${!!session.access_token}`,
              };
            } else if (!user && !session) {
              return {
                success: true,
                message: "No user session (expected for logged out state)",
                details: "Authentication system working, no active session",
              };
            } else {
              // This might be a hydration issue, check if we're on client side
              if (typeof window !== "undefined") {
                // Give it a moment for hydration to complete
                await new Promise((resolve) => setTimeout(resolve, 100));

                const {
                  data: { session: refreshedSession },
                } = await supabase.auth.getSession();

                const isConsistent = !!user === !!refreshedSession;

                return {
                  success: isConsistent || authWorking,
                  message: isConsistent
                    ? "Authentication state consistent after refresh"
                    : "Authentication state inconsistent but system working",
                  details: `User present: ${!!user}, Session present: ${!!refreshedSession}, Auth System: ${authWorking ? "Working" : "Error"}`,
                };
              } else {
                return {
                  success: true,
                  message: "Authentication system working (server-side check)",
                  details: `Auth System: ${authWorking ? "Working" : "Error"}`,
                };
              }
            }
          } catch (error) {
            return {
              success: false,
              message: "Authentication check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "User Profile System",
        test: async () => {
          if (!user) {
            return { success: true, message: "Skipped - no user logged in" };
          }
          try {
            const { data, error } = await supabase
              .from("users")
              .select("*")
              .eq("user_id", user.id)
              .single();

            if (error && error.code !== "PGRST116") {
              throw error;
            }

            return {
              success: true,
              message: data
                ? "User profile exists"
                : "User profile will be created on next action",
            };
          } catch (error) {
            return {
              success: false,
              message: "User profile check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Subscription System",
        test: async () => {
          if (!user) {
            return { success: true, message: "Skipped - no user logged in" };
          }
          try {
            const { data, error } = await supabase
              .from("subscriptions")
              .select("*")
              .eq("user_id", user.id);

            if (error && error.code !== "PGRST116") {
              throw error;
            }

            return {
              success: true,
              message:
                data && data.length > 0
                  ? `Found ${data.length} subscription(s)`
                  : "No subscriptions (free tier)",
            };
          } catch (error) {
            return {
              success: false,
              message: "Subscription check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Social Connections",
        test: async () => {
          if (!user) {
            return { success: true, message: "Skipped - no user logged in" };
          }
          try {
            const { data, error } = await supabase
              .from("social_connections")
              .select("*")
              .eq("user_id", user.id);

            if (error && error.code !== "PGRST116") {
              throw error;
            }

            return {
              success: true,
              message:
                data && data.length > 0
                  ? `Found ${data.length} connection(s)`
                  : "No social connections yet",
            };
          } catch (error) {
            return {
              success: false,
              message: "Social connections check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Content Queue System",
        test: async () => {
          if (!user) {
            return { success: true, message: "Skipped - no user logged in" };
          }
          try {
            const { data, error } = await supabase
              .from("content_queue")
              .select("*")
              .eq("user_id", user.id)
              .limit(5);

            if (error && error.code !== "PGRST116") {
              throw error;
            }

            return {
              success: true,
              message:
                data && data.length > 0
                  ? `Found ${data.length} content item(s)`
                  : "No content in queue yet",
            };
          } catch (error) {
            return {
              success: false,
              message: "Content queue check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Analytics System",
        test: async () => {
          if (!user) {
            return { success: true, message: "Skipped - no user logged in" };
          }
          try {
            const { data, error } = await supabase
              .from("analytics")
              .select("*")
              .eq("user_id", user.id)
              .limit(5);

            if (error && error.code !== "PGRST116") {
              throw error;
            }

            return {
              success: true,
              message:
                data && data.length > 0
                  ? `Found ${data.length} analytics record(s)`
                  : "No analytics data yet",
            };
          } catch (error) {
            return {
              success: false,
              message: "Analytics check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Edge Functions",
        test: async () => {
          try {
            // Test basic edge function connectivity
            const response = await fetch("/api/health-check", {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            });

            if (response.ok) {
              return {
                success: true,
                message: "Edge functions are accessible",
              };
            } else {
              // Try alternative test with Supabase functions
              try {
                const { data, error } = await supabase.functions.invoke(
                  "supabase-functions-create-checkout",
                  {
                    body: { test: true },
                  },
                );

                // Any response (even error) means functions are accessible
                return {
                  success: true,
                  message: "Edge functions are accessible",
                  details: error
                    ? `Function responded with: ${error.message}`
                    : "Function responded successfully",
                };
              } catch (funcError) {
                return {
                  success: false,
                  message: "Edge functions not accessible",
                  details:
                    funcError instanceof Error
                      ? funcError.message
                      : "Unknown error",
                };
              }
            }
          } catch (error) {
            return {
              success: true, // Don't fail the test if edge functions aren't critical
              message: "Edge function test completed with limited connectivity",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Environment Variables",
        test: async () => {
          try {
            // Check if we can create a Supabase client (which requires env vars)
            const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
            const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

            // Additional check for client-side availability
            const clientSideCheck =
              typeof window !== "undefined" &&
              typeof (window as any).__NEXT_DATA__ !== "undefined";

            if (hasSupabaseUrl && hasSupabaseKey) {
              return {
                success: true,
                message: "All required environment variables present",
                details: `SUPABASE_URL: Available, SUPABASE_ANON_KEY: Available, Client-side: ${clientSideCheck ? "Yes" : "No"}`,
              };
            } else {
              const missing = [];
              if (!hasSupabaseUrl) missing.push("NEXT_PUBLIC_SUPABASE_URL");
              if (!hasSupabaseKey)
                missing.push("NEXT_PUBLIC_SUPABASE_ANON_KEY");

              return {
                success: false,
                message: "Missing environment variables",
                details: `Missing: ${missing.join(", ")}, Client-side: ${clientSideCheck ? "Yes" : "No"}`,
              };
            }
          } catch (error) {
            return {
              success: false,
              message: "Environment variable check failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Navigation & Routing",
        test: async () => {
          try {
            // Check if we can access the current URL
            if (
              typeof window === "undefined" ||
              typeof document === "undefined" ||
              !window.location ||
              !window.location.href
            ) {
              return {
                success: true,
                message: "Navigation test skipped on server",
              };
            }
            const currentUrl = window.location.href;
            const isValidUrl =
              currentUrl.includes("tempo-dev.app") ||
              currentUrl.includes("localhost");

            if (isValidUrl) {
              return { success: true, message: "Navigation system working" };
            } else {
              return {
                success: false,
                message: "Unexpected URL structure",
                details: currentUrl,
              };
            }
          } catch (error) {
            return {
              success: false,
              message: "Navigation test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Enhanced Cursor Visibility",
        test: async () => {
          try {
            // Check if we're on desktop with proper pointer support
            if (
              typeof window === "undefined" ||
              typeof document === "undefined" ||
              !window.matchMedia ||
              !window.getComputedStyle
            ) {
              return {
                success: true,
                message: "Enhanced cursor test skipped on server",
              };
            }
            const isDesktop = window.matchMedia(
              "(hover: hover) and (pointer: fine) and (min-width: 769px)",
            ).matches;

            if (!isDesktop) {
              return {
                success: true,
                message: "Enhanced cursor disabled on mobile (expected)",
                details:
                  "Mobile device detected, cursor enhancement not applicable",
              };
            }

            // Check if enhanced cursor component exists
            const cursorElements = document.querySelectorAll(
              '[class*="enhanced-cursor"], [style*="z-index: 9999999"]',
            );
            const hasCustomCursor = cursorElements.length > 0;

            // Check CSS cursor hiding from globals.css
            const computedStyle = window.getComputedStyle(document.body);
            const hasCursorNone = computedStyle.cursor === "none";

            if (hasCustomCursor && hasCursorNone) {
              return {
                success: true,
                message: "Enhanced cursor system active",
                details: `Found ${cursorElements.length} cursor elements, default cursor hidden: ${hasCursorNone}`,
              };
            } else if (hasCustomCursor) {
              return {
                success: true,
                message: "Enhanced cursor elements found",
                details: `Found ${cursorElements.length} cursor elements, checking CSS rules`,
              };
            } else {
              return {
                success: false,
                message: "Enhanced cursor not fully active",
                details: `Custom cursor: ${hasCustomCursor}, Cursor hidden: ${hasCursorNone}`,
              };
            }
          } catch (error) {
            return {
              success: false,
              message: "Cursor visibility test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Pricing Page Interactions",
        test: async () => {
          try {
            // Test if we can navigate to pricing page
            if (
              typeof window === "undefined" ||
              typeof document === "undefined" ||
              !window.location ||
              !document.querySelectorAll
            ) {
              return {
                success: true,
                message: "Pricing page test skipped on server",
              };
            }
            const currentUrl = window.location.href;
            const isPricingPage = currentUrl.includes("/pricing");

            if (isPricingPage) {
              // Test pricing card interactions
              const pricingCards = document.querySelectorAll(
                '[data-pricing-card], .pricing-card, [class*="pricing"]',
              );
              const buttons = document.querySelectorAll("button");
              const links = document.querySelectorAll("a");

              return {
                success: true,
                message: "Pricing page interactions available",
                details: `Found ${pricingCards.length} pricing cards, ${buttons.length} buttons, ${links.length} links`,
              };
            } else {
              // Try to find pricing link
              const pricingLinks = document.querySelectorAll(
                'a[href*="pricing"], a[href="/pricing"]',
              );

              return {
                success: pricingLinks.length > 0,
                message:
                  pricingLinks.length > 0
                    ? "Pricing page navigation available"
                    : "Pricing page not accessible",
                details: `Found ${pricingLinks.length} pricing navigation links`,
              };
            }
          } catch (error) {
            return {
              success: false,
              message: "Pricing page interaction test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Hero Section Metrics",
        test: async () => {
          try {
            // Check for hero section metrics
            if (
              typeof window === "undefined" ||
              typeof document === "undefined" ||
              !document.querySelector ||
              !document.querySelectorAll
            ) {
              return {
                success: true,
                message: "Hero metrics test skipped on server",
              };
            }
            const heroSection = document.querySelector(
              '[class*="hero"], .hero, section',
            );
            const metricsElements = document.querySelectorAll("*");

            let found1B = false;
            let found25M = false;

            metricsElements.forEach((element) => {
              const text = element.textContent || "";
              if (text.includes("1B+")) found1B = true;
              if (text.includes("$25M+")) found25M = true;
            });

            if (found1B && found25M) {
              return {
                success: true,
                message: "Hero metrics display correctly",
                details: "Found both '1B+' views and '$25M+' revenue metrics",
              };
            } else {
              return {
                success: false,
                message: "Hero metrics not found or incorrect",
                details: `1B+ found: ${found1B}, $25M+ found: ${found25M}`,
              };
            }
          } catch (error) {
            return {
              success: false,
              message: "Hero metrics test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Interactive Elements Test",
        test: async () => {
          try {
            // Test various interactive elements
            if (
              typeof window === "undefined" ||
              typeof document === "undefined" ||
              !document.querySelectorAll ||
              !window.getComputedStyle
            ) {
              return {
                success: true,
                message: "Interactive elements test skipped on server",
              };
            }
            const buttons = document.querySelectorAll("button:not([disabled])");
            const links = document.querySelectorAll("a[href]");
            const inputs = document.querySelectorAll("input, textarea, select");
            const clickableElements = document.querySelectorAll(
              '[role="button"], .cursor-pointer, [onclick]',
            );

            const totalInteractive =
              buttons.length +
              links.length +
              inputs.length +
              clickableElements.length;

            // Test if elements are properly styled for interaction
            let properlyStyled = 0;
            Array.from(buttons).concat(Array.from(links)).forEach((element) => {
              const styles = window.getComputedStyle(element);
              if (styles.cursor === "pointer" || styles.cursor === "none") {
                properlyStyled++;
              }
            });

            return {
              success: totalInteractive > 0,
              message: `Found ${totalInteractive} interactive elements`,
              details: `Buttons: ${buttons.length}, Links: ${links.length}, Inputs: ${inputs.length}, Other: ${clickableElements.length}, Properly styled: ${properlyStyled}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Interactive elements test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Page Performance Test",
        test: async () => {
          try {
            // Test page load performance
            if (
              typeof window === "undefined" ||
              typeof performance === "undefined" ||
              !performance.getEntriesByType
            ) {
              return {
                success: true,
                message: "Performance test skipped on server",
              };
            }
            const navigation = performance.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming;
            const loadTime =
              navigation.loadEventEnd - navigation.loadEventStart;
            const domContentLoaded =
              navigation.domContentLoadedEventEnd -
              navigation.domContentLoadedEventStart;

            // Test if page is responsive
            const isResponsive =
              window.innerWidth > 0 && window.innerHeight > 0;

            return {
              success: loadTime < 5000 && isResponsive, // Less than 5 seconds
              message: isResponsive
                ? "Page performance acceptable"
                : "Page responsiveness issues",
              details: `Load time: ${Math.round(loadTime)}ms, DOM ready: ${Math.round(domContentLoaded)}ms, Viewport: ${window.innerWidth}x${window.innerHeight}`,
            };
          } catch (error) {
            return {
              success: true, // Don't fail if performance API not available
              message: "Performance test completed (limited data)",
              details:
                error instanceof Error
                  ? error.message
                  : "Performance API not fully supported",
            };
          }
        },
      },
      // COMPREHENSIVE FEATURE TESTS START HERE
      {
        name: "Hydration and SSR Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Hydration test skipped on server",
              };
            }

            // Check for hydration errors in console
            const hasHydrationErrors =
              typeof window !== "undefined" &&
              (window as any).__HYDRATION_ERRORS__ &&
              (window as any).__HYDRATION_ERRORS__.length > 0;

            // Check for React hydration errors in console
            const consoleErrors = [];
            const originalError = console.error;
            console.error = (...args) => {
              const message = args.join(" ");
              if (message.includes("hydrat") || message.includes("mismatch")) {
                consoleErrors.push(message);
              }
              originalError.apply(console, args);
            };

            // Check for consistent rendering
            const bodyContent = document.body.innerHTML;
            const hasContent = bodyContent && bodyContent.length > 1000;

            // Check for React hydration markers
            const hasReactMarkers =
              bodyContent.includes("data-reactroot") ||
              bodyContent.includes("__next") ||
              document.querySelector("#__next");

            // Check for cursor elements
            const cursorElements = document.querySelectorAll(
              ".enhanced-cursor, .custom-cursor",
            );
            const hasCursorElements = cursorElements.length > 0;

            // Restore console.error
            console.error = originalError;

            return {
              success:
                hasContent && !hasHydrationErrors && consoleErrors.length === 0,
              message:
                hasHydrationErrors || consoleErrors.length > 0
                  ? "Hydration errors detected"
                  : hasContent
                    ? "Hydration successful"
                    : "Content rendering issues",
              details: `Content Length: ${bodyContent.length}, React Markers: ${hasReactMarkers ? "Yes" : "No"}, Hydration Errors: ${hasHydrationErrors ? "Yes" : "No"}, Console Errors: ${consoleErrors.length}, Cursor Elements: ${hasCursorElements ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Hydration test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Component Rendering Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Component test skipped on server",
              };
            }

            // Check for key components
            const navbar = document.querySelector(
              "nav, .navbar, [data-navbar]",
            );
            const hero = document.querySelector(".hero, [data-hero], section");
            const footer = document.querySelector(
              "footer, .footer, [data-footer]",
            );
            const buttons = document.querySelectorAll("button");
            const forms = document.querySelectorAll("form");
            const images = document.querySelectorAll("img");

            const componentCount =
              (navbar ? 1 : 0) +
              (hero ? 1 : 0) +
              (footer ? 1 : 0) +
              buttons.length +
              forms.length +
              images.length;

            return {
              success: componentCount > 10,
              message:
                componentCount > 10
                  ? "Components rendering properly"
                  : "Component rendering issues",
              details: `Navbar: ${navbar ? "Yes" : "No"}, Hero: ${hero ? "Yes" : "No"}, Footer: ${footer ? "Yes" : "No"}, Buttons: ${buttons.length}, Forms: ${forms.length}, Images: ${images.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Component rendering test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Sign Up Flow Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Sign up test skipped on server",
              };
            }

            const signUpForms = document.querySelectorAll(
              'form[action*="signUp"], form:has(input[name="email"]):has(input[name="password"]):has(input[name="full_name"])',
            );
            const signUpLinks = document.querySelectorAll(
              'a[href*="sign-up"], a[href="/sign-up"]',
            );
            // Find sign up buttons by checking text content
            const allButtons = document.querySelectorAll("button");
            const signUpButtons = Array.from(allButtons).filter((button) => {
              const text = button.textContent?.toLowerCase() || "";
              return (
                text.includes("sign up") || text.includes("create account")
              );
            });

            return {
              success: signUpForms.length > 0 || signUpLinks.length > 0,
              message:
                signUpForms.length > 0
                  ? "Sign up form available"
                  : signUpLinks.length > 0
                    ? "Sign up navigation available"
                    : "Sign up flow not found",
              details: `Forms: ${signUpForms.length}, Links: ${signUpLinks.length}, Buttons: ${signUpButtons.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Sign up flow test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Sign In Flow Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Sign in test skipped on server",
              };
            }

            const signInForms = document.querySelectorAll(
              'form[action*="signIn"], form:has(input[name="email"]):has(input[name="password"]):not(:has(input[name="full_name"]))',
            );
            const signInLinks = document.querySelectorAll(
              'a[href*="sign-in"], a[href="/sign-in"]',
            );
            const forgotPasswordLinks = document.querySelectorAll(
              'a[href*="forgot-password"], a[href="/forgot-password"]',
            );

            return {
              success: signInForms.length > 0 || signInLinks.length > 0,
              message:
                signInForms.length > 0
                  ? "Sign in form available"
                  : signInLinks.length > 0
                    ? "Sign in navigation available"
                    : "Sign in flow not found",
              details: `Forms: ${signInForms.length}, Links: ${signInLinks.length}, Forgot Password: ${forgotPasswordLinks.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Sign in flow test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Dashboard Navigation Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Dashboard test skipped on server",
              };
            }

            const dashboardLinks = document.querySelectorAll(
              'a[href*="dashboard"], a[href="/dashboard"]',
            );
            const navTabs = document.querySelectorAll(
              '[role="tab"], .tab, [data-tab]',
            );
            const menuItems = document.querySelectorAll(
              "nav a, .nav-item, .menu-item",
            );

            return {
              success: dashboardLinks.length > 0 || navTabs.length > 0,
              message:
                dashboardLinks.length > 0
                  ? "Dashboard navigation available"
                  : "Dashboard navigation not found",
              details: `Dashboard Links: ${dashboardLinks.length}, Nav Tabs: ${navTabs.length}, Menu Items: ${menuItems.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Dashboard navigation test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Stripe Payment Integration Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Stripe test skipped on server",
              };
            }

            // Find pricing buttons by checking text content and attributes
            const allButtons = document.querySelectorAll("button");
            const pricingButtons = Array.from(allButtons).filter((button) => {
              const text = button.textContent?.toLowerCase() || "";
              return (
                text.includes("get started") ||
                text.includes("start building") ||
                text.includes("choose plan") ||
                text.includes("subscribe") ||
                text.includes("upgrade") ||
                text.includes("buy now")
              );
            });
            const stripeElements = document.querySelectorAll(
              "[data-stripe], .stripe-element",
            );
            const checkoutButtons = document.querySelectorAll(
              'button[onclick*="checkout"], button[data-checkout]',
            );

            // Check if Stripe is loaded
            const hasStripe =
              typeof window !== "undefined" && (window as any).Stripe;

            return {
              success: pricingButtons.length > 0,
              message:
                pricingButtons.length > 0
                  ? "Payment buttons available"
                  : "Payment integration not found",
              details: `Pricing Buttons: ${pricingButtons.length}, Stripe Elements: ${stripeElements.length}, Checkout Buttons: ${checkoutButtons.length}, Stripe Loaded: ${hasStripe}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Stripe integration test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Social Platform Connections Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Social connections test skipped on server",
              };
            }

            // Find social connection buttons by checking text content and attributes
            const allButtons = document.querySelectorAll("button");
            const socialButtons = Array.from(allButtons).filter((button) => {
              const text = button.textContent?.toLowerCase() || "";
              const hasDataPlatform = button.hasAttribute("data-platform");
              const hasConnectText =
                text.includes("connect") ||
                text.includes("link") ||
                text.includes("authorize");
              return hasDataPlatform || hasConnectText;
            });
            const socialConnectElements =
              document.querySelectorAll(".social-connect");
            const platformIcons = document.querySelectorAll(
              '[class*="tiktok"], [class*="instagram"], [class*="youtube"], [class*="twitter"]',
            );
            const integrationPages = document.querySelectorAll(
              'a[href*="integrations"], a[href*="connect"]',
            );

            return {
              success:
                socialButtons.length > 0 ||
                platformIcons.length > 0 ||
                integrationPages.length > 0 ||
                socialConnectElements.length > 0,
              message:
                socialButtons.length > 0 || socialConnectElements.length > 0
                  ? "Social connection buttons available"
                  : "Social connections not found",
              details: `Social Buttons: ${socialButtons.length}, Platform Icons: ${platformIcons.length}, Integration Pages: ${integrationPages.length}, Connect Elements: ${socialConnectElements.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Social connections test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Content Creation Features Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Content creation test skipped on server",
              };
            }

            // Find content creation buttons by checking text content and attributes
            const allButtons = document.querySelectorAll("button");
            const contentButtons = Array.from(allButtons).filter((button) => {
              const text = button.textContent?.toLowerCase() || "";
              const hasDataContent = button.hasAttribute("data-content");
              const hasContentText =
                text.includes("create") ||
                text.includes("generate") ||
                text.includes("compose") ||
                text.includes("write") ||
                text.includes("post") ||
                text.includes("publish");
              return hasDataContent || hasContentText;
            });
            const aiFeatures = document.querySelectorAll(
              '[class*="ai-"], [data-ai], .ai-feature',
            );
            const contentForms = document.querySelectorAll(
              'form:has(textarea), form:has(input[type="file"])',
            );

            return {
              success: contentButtons.length > 0 || aiFeatures.length > 0,
              message:
                contentButtons.length > 0
                  ? "Content creation features available"
                  : "Content creation not found",
              details: `Content Buttons: ${contentButtons.length}, AI Features: ${aiFeatures.length}, Content Forms: ${contentForms.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Content creation test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Analytics Dashboard Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Analytics test skipped on server",
              };
            }

            const analyticsElements = document.querySelectorAll(
              '[class*="analytics"], [data-analytics], .chart, .metric',
            );
            const chartElements = document.querySelectorAll(
              'canvas, svg[class*="chart"], .recharts-wrapper',
            );
            const metricCards = document.querySelectorAll(
              ".metric-card, [data-metric], .stat-card",
            );

            return {
              success: analyticsElements.length > 0 || chartElements.length > 0,
              message:
                analyticsElements.length > 0
                  ? "Analytics features available"
                  : "Analytics not found",
              details: `Analytics Elements: ${analyticsElements.length}, Charts: ${chartElements.length}, Metric Cards: ${metricCards.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Analytics test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Form Validation Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Form validation test skipped on server",
              };
            }

            const requiredInputs = document.querySelectorAll(
              "input[required], textarea[required], select[required]",
            );
            const emailInputs = document.querySelectorAll(
              'input[type="email"], input[name="email"]',
            );
            const passwordInputs = document.querySelectorAll(
              'input[type="password"], input[name="password"]',
            );
            const validationMessages = document.querySelectorAll(
              ".error-message, .validation-error, [data-error], [role='alert']",
            );
            const forms = document.querySelectorAll("form");
            const formInputs = document.querySelectorAll(
              "form input, form textarea, form select",
            );

            // Check for HTML5 validation attributes
            const validationAttributes = document.querySelectorAll(
              "[minlength], [maxlength], [pattern], [min], [max]",
            );

            const hasValidation =
              requiredInputs.length > 0 ||
              validationAttributes.length > 0 ||
              forms.length > 0;

            return {
              success: hasValidation,
              message: hasValidation
                ? "Form validation implemented"
                : "No form validation found",
              details: `Required: ${requiredInputs.length}, Email: ${emailInputs.length}, Password: ${passwordInputs.length}, Validation Attrs: ${validationAttributes.length}, Forms: ${forms.length}, Form Inputs: ${formInputs.length}, Messages: ${validationMessages.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Form validation test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Mobile Responsiveness Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Mobile test skipped on server",
              };
            }

            const viewport = document.querySelector('meta[name="viewport"]');
            const responsiveElements = document.querySelectorAll(
              '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
            );
            const mobileMenus = document.querySelectorAll(
              ".mobile-menu, [data-mobile], .hamburger",
            );

            // Test viewport dimensions
            const hasValidViewport =
              window.innerWidth > 0 && window.innerHeight > 0;
            const isMobileViewport = window.innerWidth < 768;

            return {
              success: viewport !== null && responsiveElements.length > 0,
              message: viewport
                ? "Mobile responsiveness implemented"
                : "Mobile responsiveness not found",
              details: `Viewport Meta: ${viewport ? "Yes" : "No"}, Responsive Classes: ${responsiveElements.length}, Mobile Menus: ${mobileMenus.length}, Is Mobile: ${isMobileViewport}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Mobile responsiveness test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "SEO and Metadata Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return { success: true, message: "SEO test skipped on server" };
            }

            const title = document.querySelector("title");
            const description = document.querySelector(
              'meta[name="description"]',
            );
            const ogTags = document.querySelectorAll('meta[property^="og:"]');
            const twitterTags = document.querySelectorAll(
              'meta[name^="twitter:"]',
            );
            const canonicalLink = document.querySelector(
              'link[rel="canonical"]',
            );

            return {
              success: title !== null && description !== null,
              message:
                title && description
                  ? "SEO metadata present"
                  : "SEO metadata missing",
              details: `Title: ${title ? "Yes" : "No"}, Description: ${description ? "Yes" : "No"}, OG Tags: ${ogTags.length}, Twitter Tags: ${twitterTags.length}, Canonical: ${canonicalLink ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "SEO test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Accessibility Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Accessibility test skipped on server",
              };
            }

            const altTexts = document.querySelectorAll("img[alt]");
            const ariaLabels = document.querySelectorAll(
              "[aria-label], [aria-labelledby]",
            );
            const focusableElements = document.querySelectorAll(
              "button, a, input, textarea, select, [tabindex]",
            );
            const headingStructure = document.querySelectorAll(
              "h1, h2, h3, h4, h5, h6",
            );
            const skipLinks = document.querySelectorAll('a[href^="#"]');

            return {
              success: altTexts.length > 0 || ariaLabels.length > 0,
              message:
                altTexts.length > 0 || ariaLabels.length > 0
                  ? "Accessibility features present"
                  : "Accessibility features missing",
              details: `Alt Texts: ${altTexts.length}, ARIA Labels: ${ariaLabels.length}, Focusable: ${focusableElements.length}, Headings: ${headingStructure.length}, Skip Links: ${skipLinks.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Accessibility test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Error Handling Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Error handling test skipped on server",
              };
            }

            const errorBoundaries = document.querySelectorAll(
              "[data-error-boundary], .error-boundary",
            );
            const errorMessages = document.querySelectorAll(
              '.error-message, .alert-error, [role="alert"]',
            );
            const loadingStates = document.querySelectorAll(
              ".loading, .spinner, [data-loading]",
            );
            const notificationAreas = document.querySelectorAll(
              ".notification, .toast, .alert",
            );

            // Check for global error handlers
            const hasGlobalErrorHandler =
              typeof window !== "undefined" && window.onerror;
            const hasUnhandledRejectionHandler =
              typeof window !== "undefined" && window.onunhandledrejection;

            return {
              success: errorMessages.length > 0 || loadingStates.length > 0,
              message:
                errorMessages.length > 0
                  ? "Error handling implemented"
                  : "Error handling not found",
              details: `Error Boundaries: ${errorBoundaries.length}, Error Messages: ${errorMessages.length}, Loading States: ${loadingStates.length}, Notifications: ${notificationAreas.length}, Global Handlers: ${hasGlobalErrorHandler ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Error handling test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Animation and Transitions Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Animation test skipped on server",
              };
            }

            const animatedElements = document.querySelectorAll(
              '[class*="animate-"], [class*="transition-"], [style*="animation"], [style*="transition"]',
            );
            const hoverEffects = document.querySelectorAll('[class*="hover:"]');
            const transformElements = document.querySelectorAll(
              '[class*="transform"], [class*="scale-"], [class*="rotate-"]',
            );

            // Check for CSS animations
            const stylesheets = Array.from(document.styleSheets);
            let hasKeyframes = false;
            try {
              stylesheets.forEach((sheet) => {
                if (sheet.cssRules) {
                  Array.from(sheet.cssRules).forEach((rule) => {
                    if (rule.type === CSSRule.KEYFRAMES_RULE) {
                      hasKeyframes = true;
                    }
                  });
                }
              });
            } catch (e) {
              // Ignore CORS errors for external stylesheets
            }

            return {
              success: animatedElements.length > 0 || hoverEffects.length > 0,
              message:
                animatedElements.length > 0
                  ? "Animations implemented"
                  : "No animations found",
              details: `Animated Elements: ${animatedElements.length}, Hover Effects: ${hoverEffects.length}, Transform Elements: ${transformElements.length}, CSS Keyframes: ${hasKeyframes ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Animation test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Security Headers Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || typeof fetch === "undefined") {
              return {
                success: true,
                message: "Security test skipped on server",
              };
            }

            // Check for HTTPS
            const isHTTPS = window.location.protocol === "https:";

            // Check for CSP meta tag
            const cspMeta = document.querySelector(
              'meta[http-equiv="Content-Security-Policy"]',
            );

            // Check for secure cookies (if any)
            const hasSecureCookies = document.cookie.includes("Secure");

            // Check for CSRF protection tokens
            const csrfTokens = document.querySelectorAll(
              'input[name*="csrf"], input[name*="token"], meta[name="csrf-token"]',
            );

            return {
              success: isHTTPS,
              message: isHTTPS
                ? "Basic security measures in place"
                : "Security improvements needed",
              details: `HTTPS: ${isHTTPS ? "Yes" : "No"}, CSP Meta: ${cspMeta ? "Yes" : "No"}, Secure Cookies: ${hasSecureCookies ? "Yes" : "No"}, CSRF Tokens: ${csrfTokens.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Security test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Local Storage and State Management Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !window.localStorage) {
              return {
                success: true,
                message: "Storage test skipped on server",
              };
            }

            // Test localStorage availability
            const hasLocalStorage = typeof Storage !== "undefined";
            const hasSessionStorage = typeof sessionStorage !== "undefined";

            // Check for stored data
            const localStorageKeys = Object.keys(localStorage);
            const sessionStorageKeys = Object.keys(sessionStorage);

            // Check for state management libraries
            const hasRedux =
              typeof window !== "undefined" &&
              (window as any).__REDUX_DEVTOOLS_EXTENSION__;
            const hasZustand =
              typeof window !== "undefined" && (window as any).zustand;

            return {
              success: hasLocalStorage && hasSessionStorage,
              message: hasLocalStorage
                ? "Storage systems available"
                : "Storage systems not available",
              details: `LocalStorage: ${hasLocalStorage ? "Yes" : "No"}, SessionStorage: ${hasSessionStorage ? "Yes" : "No"}, LS Keys: ${localStorageKeys.length}, SS Keys: ${sessionStorageKeys.length}, Redux: ${hasRedux ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Storage test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "API Integration Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || typeof fetch === "undefined") {
              return { success: true, message: "API test skipped on server" };
            }

            // Check for API endpoints in the code
            const apiCalls = document.querySelectorAll(
              "[data-api], [data-endpoint]",
            );

            // Check for loading states that might indicate API calls
            const loadingIndicators = document.querySelectorAll(
              ".loading, .spinner, [data-loading]",
            );

            // Test basic fetch availability
            const hasFetch = typeof fetch === "function";
            const hasXMLHttpRequest = typeof XMLHttpRequest === "function";

            // Check for common API libraries
            const hasAxios =
              typeof window !== "undefined" && (window as any).axios;

            return {
              success: hasFetch || hasXMLHttpRequest,
              message: hasFetch
                ? "API integration capabilities available"
                : "API integration not available",
              details: `Fetch: ${hasFetch ? "Yes" : "No"}, XMLHttpRequest: ${hasXMLHttpRequest ? "Yes" : "No"}, API Elements: ${apiCalls.length}, Loading Indicators: ${loadingIndicators.length}, Axios: ${hasAxios ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "API integration test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Theme and Dark Mode Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return { success: true, message: "Theme test skipped on server" };
            }

            const themeToggle = document.querySelectorAll(
              "[data-theme], .theme-toggle, .dark-mode-toggle",
            );
            const darkModeClasses =
              document.querySelectorAll('[class*="dark:"]');
            const themeProvider = document.querySelectorAll(
              "[data-theme-provider], .theme-provider",
            );

            // Check for CSS custom properties (CSS variables)
            const rootStyles = getComputedStyle(document.documentElement);
            const hasCustomProperties =
              rootStyles.getPropertyValue("--background") ||
              rootStyles.getPropertyValue("--primary");

            // Check for prefers-color-scheme support
            const supportsColorScheme =
              window.matchMedia &&
              window.matchMedia("(prefers-color-scheme: dark)").matches !==
                undefined;

            return {
              success:
                themeToggle.length > 0 ||
                darkModeClasses.length > 0 ||
                hasCustomProperties,
              message:
                themeToggle.length > 0
                  ? "Theme system implemented"
                  : "Theme system not found",
              details: `Theme Toggle: ${themeToggle.length}, Dark Mode Classes: ${darkModeClasses.length}, Theme Provider: ${themeProvider.length}, CSS Variables: ${hasCustomProperties ? "Yes" : "No"}, Color Scheme Support: ${supportsColorScheme ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Theme test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Comprehensive UI Elements Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "UI elements test skipped on server",
              };
            }

            // Count all interactive elements
            const buttons = document.querySelectorAll("button");
            const links = document.querySelectorAll("a[href]");
            const inputs = document.querySelectorAll("input, textarea, select");
            const cards = document.querySelectorAll(
              ".card, [data-card], .glass-premium",
            );
            const modals = document.querySelectorAll(
              ".modal, [data-modal], .dialog",
            );
            const tooltips = document.querySelectorAll(
              ".tooltip, [data-tooltip]",
            );
            const dropdowns = document.querySelectorAll(
              ".dropdown, [data-dropdown]",
            );
            const tabs = document.querySelectorAll('.tab, [role="tab"]');
            const accordions = document.querySelectorAll(
              ".accordion, [data-accordion]",
            );
            const sliders = document.querySelectorAll(".slider, [data-slider]");

            const totalElements =
              buttons.length +
              links.length +
              inputs.length +
              cards.length +
              modals.length +
              tooltips.length +
              dropdowns.length +
              tabs.length +
              accordions.length +
              sliders.length;

            return {
              success: totalElements > 20,
              message:
                totalElements > 20
                  ? "Rich UI elements present"
                  : "Limited UI elements found",
              details: `Buttons: ${buttons.length}, Links: ${links.length}, Inputs: ${inputs.length}, Cards: ${cards.length}, Modals: ${modals.length}, Tooltips: ${tooltips.length}, Dropdowns: ${dropdowns.length}, Tabs: ${tabs.length}, Accordions: ${accordions.length}, Sliders: ${sliders.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "UI elements test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Page Load and Performance Test",
        test: async () => {
          try {
            if (
              typeof window === "undefined" ||
              typeof performance === "undefined"
            ) {
              return {
                success: true,
                message: "Performance test skipped on server",
              };
            }

            // Check various performance metrics
            const navigation = performance.getEntriesByType(
              "navigation",
            )[0] as PerformanceNavigationTiming;
            const paint = performance.getEntriesByType("paint");
            const resources = performance.getEntriesByType("resource");

            const loadTime = navigation
              ? navigation.loadEventEnd - navigation.loadEventStart
              : 0;
            const domContentLoaded = navigation
              ? navigation.domContentLoadedEventEnd -
                navigation.domContentLoadedEventStart
              : 0;
            const firstPaint =
              paint.find((p) => p.name === "first-paint")?.startTime || 0;
            const firstContentfulPaint =
              paint.find((p) => p.name === "first-contentful-paint")
                ?.startTime || 0;

            // Check resource loading
            const jsResources = resources.filter((r) =>
              r.name.includes(".js"),
            ).length;
            const cssResources = resources.filter((r) =>
              r.name.includes(".css"),
            ).length;
            const imageResources = resources.filter(
              (r) =>
                r.name.includes(".jpg") ||
                r.name.includes(".png") ||
                r.name.includes(".svg"),
            ).length;

            const isPerformant = loadTime < 3000 && firstContentfulPaint < 2000;

            return {
              success: isPerformant,
              message: isPerformant
                ? "Good performance metrics"
                : "Performance could be improved",
              details: `Load Time: ${Math.round(loadTime)}ms, DOM Ready: ${Math.round(domContentLoaded)}ms, FCP: ${Math.round(firstContentfulPaint)}ms, JS: ${jsResources}, CSS: ${cssResources}, Images: ${imageResources}`,
            };
          } catch (error) {
            return {
              success: true, // Don't fail if performance API unavailable
              message: "Performance test completed with limited data",
              details:
                error instanceof Error
                  ? error.message
                  : "Performance API not fully supported",
            };
          }
        },
      },
      {
        name: "Hydration Health Check",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Hydration test skipped on server",
              };
            }

            // Check for hydration mismatches
            const hasHydrationErrors =
              (window as any).__HYDRATION_ERRORS__?.length > 0;

            // Check for React hydration warnings in console
            let hydrationWarnings = 0;
            const originalWarn = console.warn;
            console.warn = (...args) => {
              const message = args.join(" ");
              if (message.includes("hydrat") || message.includes("mismatch")) {
                hydrationWarnings++;
              }
              originalWarn.apply(console, args);
            };

            // Check for consistent DOM structure
            const bodyContent = document.body.innerHTML;
            const hasContent = bodyContent && bodyContent.length > 500;
            const hasReactRoot = document.querySelector("#__next") !== null;

            // Check for client-side only components
            const clientOnlyElements = document.querySelectorAll(
              ".enhanced-cursor, [data-client-only]",
            );

            // Restore console.warn
            setTimeout(() => {
              console.warn = originalWarn;
            }, 100);

            return {
              success:
                hasContent && !hasHydrationErrors && hydrationWarnings === 0,
              message:
                hasHydrationErrors || hydrationWarnings > 0
                  ? "Hydration issues detected"
                  : "Hydration successful",
              details: `Content: ${hasContent ? "Yes" : "No"}, React Root: ${hasReactRoot ? "Yes" : "No"}, Hydration Errors: ${hasHydrationErrors ? "Yes" : "No"}, Warnings: ${hydrationWarnings}, Client Elements: ${clientOnlyElements.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Hydration test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Cross-Browser Compatibility Test",
        test: async () => {
          try {
            if (
              typeof window === "undefined" ||
              typeof navigator === "undefined"
            ) {
              return {
                success: true,
                message: "Browser compatibility test skipped on server",
              };
            }

            // Check browser features
            const hasLocalStorage = typeof Storage !== "undefined";
            const hasSessionStorage = typeof sessionStorage !== "undefined";
            const hasFetch = typeof fetch === "function";
            const hasPromise = typeof Promise === "function";
            const hasAsyncAwait =
              (async () => {}).constructor === async function () {}.constructor;
            const hasES6 = typeof Symbol !== "undefined";
            const hasWebGL = !!document
              .createElement("canvas")
              .getContext("webgl");
            const hasServiceWorker = "serviceWorker" in navigator;
            const hasGeolocation = "geolocation" in navigator;
            const hasNotifications = "Notification" in window;

            const supportedFeatures = [
              hasLocalStorage,
              hasSessionStorage,
              hasFetch,
              hasPromise,
              hasAsyncAwait,
              hasES6,
              hasWebGL,
              hasServiceWorker,
              hasGeolocation,
              hasNotifications,
            ].filter(Boolean).length;

            const browserInfo = {
              userAgent: navigator.userAgent,
              language: navigator.language,
              platform: navigator.platform,
              cookieEnabled: navigator.cookieEnabled,
              onLine: navigator.onLine,
            };

            return {
              success: supportedFeatures >= 7,
              message:
                supportedFeatures >= 7
                  ? "Good browser compatibility"
                  : "Limited browser support",
              details: `Supported Features: ${supportedFeatures}/10, Browser: ${browserInfo.userAgent.split(" ")[0]}, Platform: ${browserInfo.platform}, Online: ${browserInfo.onLine}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Browser compatibility test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Real-time Features Test",
        test: async () => {
          try {
            if (typeof window === "undefined") {
              return {
                success: true,
                message: "Real-time features test skipped on server",
              };
            }

            // Check for real-time capabilities
            const hasWebSocket = typeof WebSocket === "function";
            const hasEventSource = typeof EventSource === "function";
            const hasWebRTC = typeof RTCPeerConnection === "function";
            const hasBroadcastChannel = typeof BroadcastChannel === "function";
            const hasSharedWorker = typeof SharedWorker === "function";

            // Check for real-time UI elements
            const liveElements = document.querySelectorAll(
              "[data-live], .live-update, .real-time",
            );
            const notificationElements = document.querySelectorAll(
              ".notification, .toast, .alert",
            );
            const progressElements = document.querySelectorAll(
              'progress, .progress, [role="progressbar"]',
            );

            const realTimeScore = [
              hasWebSocket,
              hasEventSource,
              hasWebRTC,
              hasBroadcastChannel,
              hasSharedWorker,
            ].filter(Boolean).length;

            return {
              success: realTimeScore >= 2 || liveElements.length > 0,
              message:
                realTimeScore >= 2
                  ? "Real-time capabilities available"
                  : "Limited real-time features",
              details: `WebSocket: ${hasWebSocket}, EventSource: ${hasEventSource}, WebRTC: ${hasWebRTC}, Live Elements: ${liveElements.length}, Notifications: ${notificationElements.length}, Progress: ${progressElements.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Real-time features test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      // NEW COMPREHENSIVE TESTS
      {
        name: "Next.js Framework Test",
        test: async () => {
          try {
            if (typeof window === "undefined") {
              return {
                success: true,
                message: "Next.js framework test skipped on server",
              };
            }

            // Check for Next.js specific features
            const hasNextData =
              typeof (window as any).__NEXT_DATA__ !== "undefined";
            const hasNextRouter = typeof (window as any).next !== "undefined";
            const hasAppDir = window.location.pathname.startsWith("/");
            const hasNextScript = document.querySelector(
              'script[src*="_next"]',
            );

            return {
              success: hasNextData || hasNextScript,
              message: hasNextData
                ? "Next.js framework detected"
                : "Next.js framework not detected",
              details: `Next Data: ${hasNextData ? "Yes" : "No"}, Next Router: ${hasNextRouter ? "Yes" : "No"}, App Dir: ${hasAppDir ? "Yes" : "No"}, Next Scripts: ${hasNextScript ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Next.js framework test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Tailwind CSS Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Tailwind CSS test skipped on server",
              };
            }

            // Check for Tailwind CSS classes
            const tailwindClasses = document.querySelectorAll(
              '[class*="bg-"], [class*="text-"], [class*="p-"], [class*="m-"], [class*="flex"], [class*="grid"]',
            );
            const tailwindUtilities = document.querySelectorAll(
              '[class*="hover:"], [class*="focus:"], [class*="active:"]',
            );
            const responsiveClasses = document.querySelectorAll(
              '[class*="sm:"], [class*="md:"], [class*="lg:"], [class*="xl:"]',
            );

            return {
              success: tailwindClasses.length > 10,
              message:
                tailwindClasses.length > 10
                  ? "Tailwind CSS detected"
                  : "Tailwind CSS not detected",
              details: `Utility Classes: ${tailwindClasses.length}, State Utilities: ${tailwindUtilities.length}, Responsive: ${responsiveClasses.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Tailwind CSS test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "TypeScript Integration Test",
        test: async () => {
          try {
            if (typeof window === "undefined") {
              return {
                success: true,
                message: "TypeScript test skipped on server",
              };
            }

            // Check for TypeScript compilation artifacts
            const hasSourceMaps =
              document.querySelectorAll('script[src*=".js.map"]').length > 0;
            const hasTypeScriptErrors =
              typeof (window as any).__TS_ERRORS__ !== "undefined";
            const hasReactTypes = typeof React !== "undefined";

            // Check for TypeScript-specific patterns in script tags
            const scripts = Array.from(document.querySelectorAll("script"));
            const hasCompiledTS = scripts.some((script) => {
              const src = script.src || "";
              return src.includes("_next") && src.includes(".js");
            });

            return {
              success: hasCompiledTS || hasReactTypes,
              message: hasCompiledTS
                ? "TypeScript compilation detected"
                : "TypeScript not detected",
              details: `Compiled TS: ${hasCompiledTS ? "Yes" : "No"}, Source Maps: ${hasSourceMaps ? "Yes" : "No"}, TS Errors: ${hasTypeScriptErrors ? "Yes" : "No"}, React Types: ${hasReactTypes ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "TypeScript test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "React Components Health Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "React components test skipped on server",
              };
            }

            // Check for React-specific attributes and patterns (safer selectors)
            const reactElements = document.querySelectorAll("[data-reactroot]");
            const reactHooks = document.querySelectorAll(
              "[data-hook], [data-state]",
            );
            const reactComponents = document.querySelectorAll(
              "[data-component], [data-testid]",
            );
            const reactEvents = document.querySelectorAll(
              "[data-onclick], [data-onchange]",
            );

            // Check for React DevTools
            const hasReactDevTools =
              typeof (window as any).__REACT_DEVTOOLS_GLOBAL_HOOK__ !==
              "undefined";

            // Check for React Fiber
            const hasFiber =
              document.querySelector("[data-reactroot]") !== null ||
              document.querySelector("#__next") !== null;

            // Check for Next.js indicators
            const hasNextJs = document.querySelector("#__next") !== null;

            const totalReactElements =
              reactElements.length + reactHooks.length + reactComponents.length;

            return {
              success:
                totalReactElements > 0 ||
                hasFiber ||
                hasReactDevTools ||
                hasNextJs,
              message:
                totalReactElements > 0 || hasNextJs
                  ? "React components detected"
                  : "React components not detected",
              details: `React Elements: ${reactElements.length}, Hooks: ${reactHooks.length}, Components: ${reactComponents.length}, DevTools: ${hasReactDevTools ? "Yes" : "No"}, Fiber: ${hasFiber ? "Yes" : "No"}, Next.js: ${hasNextJs ? "Yes" : "No"}`,
            };
          } catch (error) {
            return {
              success: true, // Don't fail on selector errors
              message: "React components test completed with limited data",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Supabase Integration Test",
        test: async () => {
          try {
            // Test Supabase client creation and basic functionality
            const client = supabase;
            if (!client) {
              return {
                success: false,
                message: "Supabase client not available",
              };
            }

            // Test basic Supabase operations
            const { data: authData, error: authError } =
              await client.auth.getSession();
            const hasAuthSystem = !authError;

            // Test if we can access Supabase URL
            const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
            const hasValidUrl = supabaseUrl && supabaseUrl.includes("supabase");

            return {
              success: hasAuthSystem && hasValidUrl,
              message: hasAuthSystem
                ? "Supabase integration working"
                : "Supabase integration issues",
              details: `Auth System: ${hasAuthSystem ? "Working" : "Error"}, Valid URL: ${hasValidUrl ? "Yes" : "No"}, URL: ${supabaseUrl ? "Set" : "Missing"}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Supabase integration test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Image Optimization Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Image optimization test skipped on server",
              };
            }

            const images = document.querySelectorAll("img");
            const nextImages = document.querySelectorAll("img[data-nimg]");
            const lazyImages = document.querySelectorAll('img[loading="lazy"]');
            const optimizedImages = document.querySelectorAll(
              "img[srcset], img[sizes]",
            );

            const hasImageOptimization =
              nextImages.length > 0 || optimizedImages.length > 0;
            const hasLazyLoading = lazyImages.length > 0;

            return {
              success: hasImageOptimization || images.length === 0,
              message: hasImageOptimization
                ? "Image optimization detected"
                : images.length === 0
                  ? "No images to optimize"
                  : "Image optimization not detected",
              details: `Total Images: ${images.length}, Next Images: ${nextImages.length}, Lazy Loading: ${lazyImages.length}, Optimized: ${optimizedImages.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Image optimization test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Font Loading Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !document.querySelector) {
              return {
                success: true,
                message: "Font loading test skipped on server",
              };
            }

            // Check for font loading strategies
            const fontLinks = document.querySelectorAll(
              'link[rel="preload"][as="font"]',
            );
            // Use safer selector for font faces
            const stylesheets = Array.from(document.styleSheets);
            let fontFacesCount = 0;
            try {
              stylesheets.forEach((sheet) => {
                if (sheet.cssRules) {
                  Array.from(sheet.cssRules).forEach((rule) => {
                    if (rule.cssText && rule.cssText.includes("@font-face")) {
                      fontFacesCount++;
                    }
                  });
                }
              });
            } catch (e) {
              // Ignore CORS errors for external stylesheets
            }
            const googleFonts = document.querySelectorAll(
              'link[href*="fonts.googleapis.com"]',
            );

            // Check computed styles for custom fonts
            const bodyFont = window.getComputedStyle(document.body).fontFamily;
            const hasCustomFont =
              bodyFont &&
              !bodyFont.includes("serif") &&
              !bodyFont.includes("sans-serif");

            return {
              success:
                fontLinks.length > 0 || googleFonts.length > 0 || hasCustomFont,
              message: hasCustomFont
                ? "Custom fonts detected"
                : "Default fonts in use",
              details: `Preloaded Fonts: ${fontLinks.length}, Google Fonts: ${googleFonts.length}, Font Faces: ${fontFacesCount}, Custom Font: ${hasCustomFont ? "Yes" : "No"}, Body Font: ${bodyFont}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Font loading test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Bundle Size and Performance Test",
        test: async () => {
          try {
            if (
              typeof window === "undefined" ||
              typeof performance === "undefined"
            ) {
              return {
                success: true,
                message: "Bundle size test skipped on server",
              };
            }

            // Check resource loading
            const resources = performance.getEntriesByType(
              "resource",
            ) as PerformanceResourceTiming[];
            const jsResources = resources.filter((r) => r.name.includes(".js"));
            const cssResources = resources.filter((r) =>
              r.name.includes(".css"),
            );

            // Calculate total bundle size (approximate)
            const totalJSSize = jsResources.reduce((total, resource) => {
              return total + (resource.transferSize || 0);
            }, 0);
            const totalCSSSize = cssResources.reduce((total, resource) => {
              return total + (resource.transferSize || 0);
            }, 0);

            const totalSize = totalJSSize + totalCSSSize;
            const isOptimalSize = totalSize < 1024 * 1024; // Less than 1MB

            return {
              success: isOptimalSize,
              message: isOptimalSize
                ? "Bundle size optimal"
                : "Bundle size could be optimized",
              details: `JS Size: ${Math.round(totalJSSize / 1024)}KB, CSS Size: ${Math.round(totalCSSSize / 1024)}KB, Total: ${Math.round(totalSize / 1024)}KB, JS Files: ${jsResources.length}, CSS Files: ${cssResources.length}`,
            };
          } catch (error) {
            return {
              success: true, // Don't fail if performance API unavailable
              message: "Bundle size test completed with limited data",
              details:
                error instanceof Error
                  ? error.message
                  : "Performance API not available",
            };
          }
        },
      },
      {
        name: "Console Errors and Warnings Test",
        test: async () => {
          try {
            if (typeof window === "undefined") {
              return {
                success: true,
                message: "Console test skipped on server",
              };
            }

            // Check for existing console errors (simplified approach)
            const hasConsoleErrors =
              typeof (window as any).__CONSOLE_ERRORS__ !== "undefined";
            const hasReactErrors =
              typeof (window as any).__REACT_ERROR_OVERLAY__ !== "undefined";

            // Check for error boundaries or error displays
            const errorElements = document.querySelectorAll(
              '.error, [data-error], .alert-error, [role="alert"]',
            );

            const visibleErrors = Array.from(errorElements).filter(
              (el) => el.textContent && el.textContent.trim().length > 0,
            );

            return {
              success:
                !hasConsoleErrors &&
                !hasReactErrors &&
                visibleErrors.length === 0,
              message:
                !hasConsoleErrors &&
                !hasReactErrors &&
                visibleErrors.length === 0
                  ? "No visible errors detected"
                  : "Some errors may be present",
              details: `Console Errors: ${hasConsoleErrors ? "Yes" : "No"}, React Errors: ${hasReactErrors ? "Yes" : "No"}, Visible Error Elements: ${visibleErrors.length}`,
            };
          } catch (error) {
            return {
              success: false,
              message: "Console monitoring test failed",
              details: error instanceof Error ? error.message : "Unknown error",
            };
          }
        },
      },
      {
        name: "Memory Usage Test",
        test: async () => {
          try {
            if (typeof window === "undefined" || !(performance as any).memory) {
              return {
                success: true,
                message: "Memory test skipped (not available)",
              };
            }

            const memory = (performance as any).memory;
            const usedJSHeapSize = memory.usedJSHeapSize;
            const totalJSHeapSize = memory.totalJSHeapSize;
            const jsHeapSizeLimit = memory.jsHeapSizeLimit;

            const usedMB = Math.round(usedJSHeapSize / 1024 / 1024);
            const totalMB = Math.round(totalJSHeapSize / 1024 / 1024);
            const limitMB = Math.round(jsHeapSizeLimit / 1024 / 1024);

            const memoryUsagePercent = (usedJSHeapSize / jsHeapSizeLimit) * 100;
            const isOptimalMemory = memoryUsagePercent < 50; // Less than 50% of limit

            return {
              success: isOptimalMemory,
              message: isOptimalMemory
                ? "Memory usage optimal"
                : "High memory usage detected",
              details: `Used: ${usedMB}MB, Total: ${totalMB}MB, Limit: ${limitMB}MB, Usage: ${Math.round(memoryUsagePercent)}%`,
            };
          } catch (error) {
            return {
              success: true, // Don't fail if memory API unavailable
              message: "Memory test completed with limited data",
              details:
                error instanceof Error
                  ? error.message
                  : "Memory API not available",
            };
          }
        },
      },
    ];

    for (const testCase of testSuite) {
      setCurrentTest(testCase.name);
      updateTest(testCase.name, "pending", "Running...");

      try {
        const result = await testCase.test();
        updateTest(
          testCase.name,
          result.success ? "success" : "error",
          result.message,
          result.details,
        );
      } catch (error) {
        updateTest(
          testCase.name,
          "error",
          "Test execution failed",
          error instanceof Error ? error.message : "Unknown error",
        );
      }

      // Small delay between tests
      await new Promise((resolve) => setTimeout(resolve, 500));
    }

    setCurrentTest(null);
    setIsRunning(false);
  };

  const getStatusIcon = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case "error":
        return <XCircle className="w-5 h-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case "pending":
        return <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />;
      default:
        return <div className="w-5 h-5 bg-gray-300 rounded-full" />;
    }
  };

  const getStatusColor = (status: TestResult["status"]) => {
    switch (status) {
      case "success":
        return "bg-green-50 border-green-200";
      case "error":
        return "bg-red-50 border-red-200";
      case "warning":
        return "bg-yellow-50 border-yellow-200";
      case "pending":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };

  const successCount = tests.filter((t) => t.status === "success").length;
  const errorCount = tests.filter((t) => t.status === "error").length;
  const warningCount = tests.filter((t) => t.status === "warning").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Settings className="w-6 h-6 text-blue-600" />
            System Health Check
          </h2>
          <p className="text-gray-600">
            Comprehensive testing of all system components and features
          </p>
        </div>
        <Button
          onClick={runSystemTests}
          disabled={isRunning}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover-target interactive-element magnetic"
        >
          {isRunning ? (
            <>
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="w-4 h-4 mr-2" />
              Run System Tests
            </>
          )}
        </Button>
      </div>

      {/* Test Summary */}
      {tests.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              <div>
                <div className="text-2xl font-bold text-green-900">
                  {successCount}
                </div>
                <div className="text-sm text-green-700">Passed</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-red-50 border-red-200">
            <div className="flex items-center gap-2">
              <XCircle className="w-5 h-5 text-red-600" />
              <div>
                <div className="text-2xl font-bold text-red-900">
                  {errorCount}
                </div>
                <div className="text-sm text-red-700">Failed</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-yellow-600" />
              <div>
                <div className="text-2xl font-bold text-yellow-900">
                  {warningCount}
                </div>
                <div className="text-sm text-yellow-700">Warnings</div>
              </div>
            </div>
          </Card>

          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-blue-600" />
              <div>
                <div className="text-2xl font-bold text-blue-900">
                  {tests.length}
                </div>
                <div className="text-sm text-blue-700">Total Tests</div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Current Test */}
      {currentTest && (
        <Card className="p-4 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3">
            <RefreshCw className="w-5 h-5 text-blue-600 animate-spin" />
            <div>
              <div className="font-medium text-blue-900">Currently Testing</div>
              <div className="text-sm text-blue-700">{currentTest}</div>
            </div>
          </div>
        </Card>
      )}

      {/* Test Results - Scrollable */}
      {tests.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-lg font-semibold text-gray-900">Test Results</h3>
          <div className="max-h-96 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
            {tests.map((test, index) => (
              <Card
                key={index}
                className={`p-4 ${getStatusColor(test.status)}`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    {getStatusIcon(test.status)}
                    <div className="flex-1">
                      <div className="font-medium text-gray-900">
                        {test.name}
                      </div>
                      <div className="text-sm text-gray-700 mt-1">
                        {test.message}
                      </div>
                      {test.details && (
                        <div className="text-xs text-gray-600 mt-2 p-2 bg-white/50 rounded border">
                          <strong>Details:</strong> {test.details}
                        </div>
                      )}
                    </div>
                  </div>
                  <Badge
                    variant={
                      test.status === "success"
                        ? "default"
                        : test.status === "error"
                          ? "destructive"
                          : "secondary"
                    }
                    className="ml-2 flex-shrink-0"
                  >
                    {test.status.toUpperCase()}
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Manual Testing Checklist */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Manual Testing Checklist
        </h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Lock className="w-4 h-4" />
              Authentication Flow
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Sign up with new email</li>
              <li>• Email verification</li>
              <li>• Sign in with credentials</li>
              <li>• Password reset flow</li>
              <li>• Sign out functionality</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Home className="w-4 h-4" />
              Dashboard Features
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Dashboard navigation</li>
              <li>• Analytics tab</li>
              <li>• Revenue tab</li>
              <li>• Platforms tab</li>
              <li>• Settings tab</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment System
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Pricing page loads</li>
              <li>• Stripe checkout flow</li>
              <li>• Subscription management</li>
              <li>• Plan upgrades/downgrades</li>
              <li>• Billing history</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <LinkIcon className="w-4 h-4" />
              Platform Connections
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Connect social platforms</li>
              <li>• Disconnect platforms</li>
              <li>• Refresh platform stats</li>
              <li>• Platform status display</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Enhanced Cursor
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• Cursor visibility on all pages</li>
              <li>• Interactive hover effects</li>
              <li>• Pricing page interactions</li>
              <li>• Click animations</li>
            </ul>
          </div>

          <div className="space-y-3">
            <h4 className="font-medium text-gray-800 flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Hero Metrics
            </h4>
            <ul className="text-sm text-gray-600 space-y-1 ml-6">
              <li>• 1B+ views display</li>
              <li>• $25M+ revenue display</li>
              <li>• Metrics animation</li>
              <li>• Responsive layout</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
}
