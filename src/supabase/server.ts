import { createServerClient, createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Check if environment variables are available
  if (!supabaseUrl || !supabaseAnonKey) {
    // Return a mock client for build time
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      }),
      functions: {
        invoke: async () => ({ data: null, error: null }),
      },
    } as any;
  }

  // Check if we're in a browser environment
  if (typeof window !== "undefined") {
    // Client-side
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
  }

  // Server-side - use dynamic import for cookies
  try {
    const { cookies } = require("next/headers");

    return createServerClient(supabaseUrl, supabaseAnonKey, {
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
    });
  } catch (error) {
    console.warn("Failed to create server client:", error);
    // Return a mock client as fallback
    return {
      auth: {
        getUser: async () => ({ data: { user: null }, error: null }),
        getSession: async () => ({ data: { session: null }, error: null }),
      },
      from: () => ({
        select: () => ({ eq: () => ({ single: async () => ({ data: null, error: null }) }) }),
        insert: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }),
        update: () => ({ eq: () => ({ select: () => ({ single: async () => ({ data: null, error: null }) }) }) }),
      }),
      functions: {
        invoke: async () => ({ data: null, error: null }),
      },
    } as any;
  }
};
