"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { cn } from "@/lib/utils";

interface CursorPosition {
  x: number;
  y: number;
}

interface EnhancedCursorProps {
  className?: string;
}

export default function EnhancedCursor({ className }: EnhancedCursorProps) {
  const [position, setPosition] = useState<CursorPosition>({
    x: -100,
    y: -100,
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [isClicking, setIsClicking] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const mountedRef = useRef(false);

  // Memoize the desktop check function to prevent unnecessary re-renders
  const checkDesktop = useCallback(() => {
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !window.matchMedia
    ) {
      return false;
    }

    try {
      const mediaQuery = window.matchMedia(
        "(hover: hover) and (pointer: fine) and (min-width: 769px)",
      );
      return mediaQuery?.matches ?? false;
    } catch (error) {
      return false;
    }
  }, []);

  useEffect(() => {
    // Prevent multiple mounts
    if (mountedRef.current) return;
    mountedRef.current = true;

    // Set mounted state first
    setIsMounted(true);

    // Only run on client side with comprehensive checks
    if (
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !window?.matchMedia
    ) {
      return;
    }

    // Use requestAnimationFrame for better timing
    let rafId: number;
    let mediaQueryCleanup: (() => void) | undefined;
    let initTimeout: NodeJS.Timeout;

    const initializeCursor = () => {
      // Wait for complete hydration and DOM ready
      const waitForHydration = () => {
        return new Promise<void>((resolve) => {
          const checkReady = () => {
            try {
              if (
                document?.readyState === "complete" &&
                (window as any)?.__HYDRATION_COMPLETE__ &&
                document?.body
              ) {
                resolve();
              } else {
                setTimeout(checkReady, 100);
              }
            } catch (error) {
              console.debug("Hydration check error:", error);
              setTimeout(checkReady, 200);
            }
          };
          checkReady();
        });
      };

      initTimeout = setTimeout(async () => {
        try {
          await waitForHydration();

          if (typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
            rafId = requestAnimationFrame(() => {
              try {
                // Check if desktop and set initial state
                const isDesktopDevice = checkDesktop();
                setIsDesktop(isDesktopDevice);

                if (isDesktopDevice) {
                  // Set initial cursor position off-screen
                  setPosition({
                    x: -100,
                    y: -100,
                  });
                  setIsVisible(false);
                }

                // Set up media query listener with null checks
                if (window?.matchMedia) {
                  const mediaQuery = window.matchMedia(
                    "(hover: hover) and (pointer: fine) and (min-width: 769px)",
                  );

                  const handleMediaChange = () => {
                    try {
                      const isDesktopNow = checkDesktop();
                      setIsDesktop(isDesktopNow);
                      if (!isDesktopNow) {
                        setIsVisible(false);
                      }
                    } catch (error) {
                      console.debug("Media change error:", error);
                    }
                  };

                  if (mediaQuery?.addEventListener) {
                    mediaQuery.addEventListener("change", handleMediaChange);
                    mediaQueryCleanup = () => {
                      try {
                        if (mediaQuery?.removeEventListener) {
                          mediaQuery.removeEventListener(
                            "change",
                            handleMediaChange,
                          );
                        }
                      } catch (error) {
                        console.debug("Media query cleanup error:", error);
                      }
                    };
                  }
                }
              } catch (error) {
                // Silently handle initialization errors
                console.debug("Cursor initialization error:", error);
              }
            });
          }
        } catch (error) {
          console.debug("Cursor hydration wait error:", error);
        }
      }, 1500); // Reduced wait time

      return () => {
        if (initTimeout) clearTimeout(initTimeout);
      };
    };

    const cleanup = initializeCursor();

    return () => {
      mountedRef.current = false;
      if (cleanup) cleanup();
      if (rafId && typeof window !== "undefined" && typeof window.cancelAnimationFrame === "function") {
        cancelAnimationFrame(rafId);
      }
      if (mediaQueryCleanup) {
        mediaQueryCleanup();
      }
      if (initTimeout) {
        clearTimeout(initTimeout);
      }
    };
  }, [checkDesktop]);

  useEffect(() => {
    if (
      !isMounted ||
      !isDesktop ||
      typeof window === "undefined" ||
      typeof document === "undefined" ||
      !window.requestAnimationFrame
    ) {
      return;
    }

    let animationFrameId: number;
    let isMoving = false;

    // Add cursor-hidden class to document element with null check
    if (document?.documentElement) {
      document.documentElement.classList.add("cursor-hidden");
    }

    const updateCursorPosition = (e: MouseEvent) => {
      if (!isMoving && typeof window !== "undefined" && typeof window.requestAnimationFrame === "function") {
        isMoving = true;
        animationFrameId = requestAnimationFrame(() => {
          setPosition({ x: e.clientX, y: e.clientY });
          setIsVisible(true);
          isMoving = false;
        });
      }
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target || typeof window === "undefined" || !window.getComputedStyle)
        return;

      try {
        const isInteractive =
          target.tagName === "BUTTON" ||
          target.tagName === "A" ||
          target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.role === "button" ||
          target.classList?.contains("cursor-pointer") ||
          !!target.closest("button") ||
          !!target.closest("a") ||
          !!target.closest('[role="button"]') ||
          !!target.closest(".cursor-pointer") ||
          !!target.closest("[data-pricing-card]") ||
          !!target.closest("[data-interactive]") ||
          !!target.closest(".pricing-card") ||
          !!target.closest(".hover-target") ||
          !!target.closest(".interactive-element") ||
          !!target.closest("[data-pricing-button]") ||
          !!target.closest(".magnetic") ||
          target.hasAttribute("data-interactive") ||
          window.getComputedStyle(target).cursor === "pointer";

        setIsHovering(isInteractive);
      } catch (error) {
        // Silently handle mouse over errors
      }
    };

    const handleMouseDown = () => {
      setIsClicking(true);
    };

    const handleMouseUp = () => {
      setIsClicking(false);
    };

    const handleVisibilityChange = () => {
      if (!document.hidden) {
        setIsVisible(true);
      }
    };

    const handleFocus = () => {
      setIsVisible(true);
    };

    try {
      document.addEventListener("mousemove", updateCursorPosition, {
        passive: true,
      });
      document.addEventListener("mouseenter", handleMouseEnter, {
        passive: true,
      });
      document.addEventListener("mouseleave", handleMouseLeave, {
        passive: true,
      });
      document.addEventListener("mouseover", handleMouseOver, {
        passive: true,
      });
      document.addEventListener("mousedown", handleMouseDown, {
        passive: true,
      });
      document.addEventListener("mouseup", handleMouseUp, { passive: true });
      document.addEventListener("visibilitychange", handleVisibilityChange);
      window.addEventListener("focus", handleFocus);
    } catch (error) {
      // Silently handle event listener errors
    }

    return () => {
      try {
        // Remove cursor-hidden class with null checks
        if (typeof document !== "undefined" && document?.documentElement) {
          document.documentElement.classList.remove("cursor-hidden");
        }

        if (animationFrameId && window.cancelAnimationFrame) {
          cancelAnimationFrame(animationFrameId);
        }
        if (typeof document !== "undefined") {
          document.removeEventListener("mousemove", updateCursorPosition);
          document.removeEventListener("mouseenter", handleMouseEnter);
          document.removeEventListener("mouseleave", handleMouseLeave);
          document.removeEventListener("mouseover", handleMouseOver);
          document.removeEventListener("mousedown", handleMouseDown);
          document.removeEventListener("mouseup", handleMouseUp);
          document.removeEventListener(
            "visibilitychange",
            handleVisibilityChange,
          );
        }
        if (typeof window !== "undefined") {
          window.removeEventListener("focus", handleFocus);
        }
      } catch (error) {
        // Silently handle cleanup errors
      }
    };
  }, [isMounted, isDesktop]);

  // Don't render anything on server or mobile - prevent hydration mismatch
  if (!isMounted || !isDesktop) {
    return null;
  }

  // Additional safety check for SSR
  if (typeof window === "undefined") {
    return null;
  }

  return (
    <>
      {/* Main cursor ring */}
      <div
        className={cn(
          "enhanced-cursor custom-cursor fixed pointer-events-none transition-all duration-150 ease-out",
          "w-8 h-8 rounded-full border-2 border-blue-500/80 bg-blue-500/10",
          "backdrop-blur-sm shadow-lg shadow-blue-500/30",
          "transform -translate-x-1/2 -translate-y-1/2",
          isVisible ? "opacity-100 visible" : "opacity-0 invisible",
          isHovering &&
            "scale-150 border-blue-600 bg-blue-600/20 shadow-blue-600/50",
          isClicking && "scale-75",
          className,
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999999,
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          perspective: 1000,
          position: "fixed",
          display: isVisible ? "block" : "none",
        }}
      />

      {/* Inner cursor dot */}
      <div
        className={cn(
          "enhanced-cursor custom-cursor fixed pointer-events-none transition-all duration-200 ease-out",
          "w-2 h-2 rounded-full bg-blue-500/60",
          "transform -translate-x-1/2 -translate-y-1/2",
          isVisible ? "opacity-100 visible" : "opacity-0 invisible",
          isHovering && "scale-150 bg-blue-600/80",
          isClicking && "scale-50",
        )}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          zIndex: 9999998,
          willChange: "transform, opacity",
          backfaceVisibility: "hidden",
          perspective: 1000,
          position: "fixed",
          display: isVisible ? "block" : "none",
        }}
      />
    </>
  );
}

// Hook to use enhanced cursor
export function useEnhancedCursor() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || typeof window === "undefined" || !window.matchMedia) {
      return;
    }

    try {
      // Check if user prefers reduced motion
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      if (mediaQuery) {
        setIsEnabled(!mediaQuery.matches);

        const handleChange = (e: MediaQueryListEvent) => {
          setIsEnabled(!e.matches);
        };

        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener("change", handleChange);
          return () => {
            if (mediaQuery.removeEventListener) {
              mediaQuery.removeEventListener("change", handleChange);
            }
          };
        }
      }
    } catch (error) {
      setIsEnabled(false);
    }
  }, [isMounted]);

  return { isEnabled: isMounted && isEnabled };
}
