"use client";

import { useEffect, useRef, useState } from "react";

// Extend Window interface for TypeScript
declare global {
  interface Window {
    __TEMPO_INITIALIZED__?: boolean;
    __TEMPO_INIT_PROMISE__?: Promise<void>;
    __HYDRATION_COMPLETE__?: boolean;
    __TEMPO_INIT_ATTEMPTS__?: number;
  }
}

export function TempoInit() {
  const initRef = useRef(false);
  const mountedRef = useRef(false);
  const [isClient, setIsClient] = useState(false);
  const [hydrationComplete, setHydrationComplete] = useState(false);

  // Ensure we're on the client side
  useEffect(() => {
    if (mountedRef.current) return;
    mountedRef.current = true;
    setIsClient(true);
  }, []);

  // Mark hydration as complete with multiple checks
  useEffect(() => {
    if (!isClient || typeof window === "undefined") return;

    const markHydrationComplete = () => {
      if (!window.__HYDRATION_COMPLETE__) {
        window.__HYDRATION_COMPLETE__ = true;
        setHydrationComplete(true);
      }
    };

    // Multiple ways to detect hydration completion
    if (document.readyState === "complete") {
      markHydrationComplete();
    } else {
      const handleLoad = () => {
        setTimeout(markHydrationComplete, 100);
      };

      const handleDOMContentLoaded = () => {
        setTimeout(markHydrationComplete, 50);
      };

      window.addEventListener("load", handleLoad);
      document.addEventListener("DOMContentLoaded", handleDOMContentLoaded);

      // Fallback timeout
      const fallbackTimeout = setTimeout(markHydrationComplete, 2000);

      return () => {
        window.removeEventListener("load", handleLoad);
        document.removeEventListener(
          "DOMContentLoaded",
          handleDOMContentLoaded,
        );
        clearTimeout(fallbackTimeout);
      };
    }
  }, [isClient]);

  useEffect(() => {
    // Only run on client side after hydration
    if (!isClient || !hydrationComplete || typeof window === "undefined")
      return;

    // Prevent multiple initializations
    if (initRef.current) return;
    initRef.current = true;

    // If already initialized or initializing, skip
    if (window.__TEMPO_INITIALIZED__ || window.__TEMPO_INIT_PROMISE__) {
      return;
    }

    // Prevent too many initialization attempts
    if (!window.__TEMPO_INIT_ATTEMPTS__) {
      window.__TEMPO_INIT_ATTEMPTS__ = 0;
    }

    if (window.__TEMPO_INIT_ATTEMPTS__ >= 3) {
      console.debug("TempoInit: Maximum initialization attempts reached");
      return;
    }

    window.__TEMPO_INIT_ATTEMPTS__++;

    const init = async () => {
      try {
        // Check if we should initialize TempoDevtools
        const shouldInit =
          typeof document !== "undefined" &&
          typeof navigator !== "undefined" &&
          window.location &&
          document.body &&
          (process.env.NODE_ENV === "development" ||
            process.env.NEXT_PUBLIC_TEMPO === "true" ||
            window.location.hostname.includes("tempo-dev.app")) &&
          !window.__TEMPO_INITIALIZED__;

        if (!shouldInit) {
          console.debug("TempoInit: Conditions not met for initialization");
          return;
        }

        // Additional delay for complete React hydration
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Dynamic import with comprehensive error handling
        try {
          console.debug("TempoInit: Attempting to import tempo-devtools");

          const tempoModule = await import("tempo-devtools").catch((error) => {
            console.debug("TempoDevtools import failed:", error);
            return null;
          });

          if (
            tempoModule?.TempoDevtools &&
            typeof tempoModule.TempoDevtools.init === "function" &&
            !window.__TEMPO_INITIALIZED__
          ) {
            console.debug("TempoInit: Initializing TempoDevtools");
            await tempoModule.TempoDevtools.init();
            window.__TEMPO_INITIALIZED__ = true;
            console.debug("TempoDevtools initialized successfully");
          } else {
            console.debug(
              "TempoInit: TempoDevtools module not available or already initialized",
            );
          }
        } catch (importError) {
          console.debug("TempoDevtools import error:", importError);
        }
      } catch (error) {
        console.debug("TempoInit initialization error:", error);
      } finally {
        // Clear the promise reference
        if (window.__TEMPO_INIT_PROMISE__) {
          delete window.__TEMPO_INIT_PROMISE__;
        }
      }
    };

    // Store the initialization promise to prevent multiple calls
    window.__TEMPO_INIT_PROMISE__ = init();

    return () => {
      initRef.current = false;
    };
  }, [isClient, hydrationComplete]);

  return null;
}
