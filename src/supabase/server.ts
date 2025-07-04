import { createServerClient, createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Client-side
    return createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    );
  }

  // Server-side - use dynamic import for cookies
  const { cookies } = require("next/headers");

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          try {
            return cookies().getAll();
          } catch (error) {
            console.warn("Failed to get cookies:", error);
            return [];
          }
        },
        setAll(cookiesToSet: any[]) {
          try {
            const cookieStore = cookies();
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options);
            });
          } catch (error) {
            console.warn("Failed to set cookies:", error);
          }
        },
      },
    },
  );
};
