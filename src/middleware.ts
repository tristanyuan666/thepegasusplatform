import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  });

  try {
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return req.cookies.getAll().map(({ name, value }) => ({
              name,
              value,
            }));
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) => {
              req.cookies.set(name, value);
              res = NextResponse.next({
                request: {
                  headers: req.headers,
                },
              });
              res.cookies.set(name, value, options);
            });
          },
        },
      },
    );

    // Refresh session if expired - required for Server Components
    let user = null;
    let error = null;

    try {
      const result = await supabase.auth.getUser();
      user = result.data?.user || null;
      error = result.error;
    } catch (authError) {
      console.warn("Auth check failed in middleware:", authError);
      error = authError;
    }

    // Protected routes - require authentication AND active subscription
    const protectedRoutes = [
      "/dashboard",
      "/content-hub",
    ];

    // Feature and integration pages are accessible to all users
    // The FeatureAccessControl component will handle access control
    const featureRoutes = [
      "/features",
      "/integrations",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route),
    );

    if (isProtectedRoute && (error || !user)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // For protected routes, also check subscription status
    if (isProtectedRoute && user) {
      try {
        // First check for active subscription
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (subError) {
          console.warn("Subscription check failed in middleware:", subError);
          // If we can't check subscription, redirect to pricing to be safe
          return NextResponse.redirect(new URL("/pricing", req.url));
        }

        if (!subscription) {
          // Check if user has any subscription record (even if not active)
          const { data: anySubscription } = await supabase
            .from("subscriptions")
            .select("status")
            .eq("user_id", user.id)
            .maybeSingle();
          
          if (anySubscription) {
            console.log("User has subscription record, allowing access despite status");
            // User has paid, allow access
          } else {
            // User doesn't have any subscription, redirect to pricing
            return NextResponse.redirect(new URL("/pricing", req.url));
          }
        }
      } catch (subError) {
        console.warn("Subscription check failed in middleware:", subError);
        // If we can't check subscription, redirect to pricing to be safe
        return NextResponse.redirect(new URL("/pricing", req.url));
      }
    }

    // Redirect authenticated users from auth pages to dashboard
    const authPages = ["/sign-in", "/sign-up"];
    const isAuthPage = authPages.includes(req.nextUrl.pathname);

    if (isAuthPage && !error && user) {
      // Check if user has active subscription before redirecting to dashboard
      try {
        const { data: subscription, error: subError } = await supabase
          .from("subscriptions")
          .select("status")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!subError && subscription) {
          return NextResponse.redirect(new URL("/dashboard", req.url));
        } else {
          // User doesn't have active subscription, redirect to pricing
          return NextResponse.redirect(new URL("/pricing", req.url));
        }
      } catch (subError) {
        console.warn("Subscription check failed in middleware:", subError);
        // If we can't check subscription, redirect to pricing to be safe
        return NextResponse.redirect(new URL("/pricing", req.url));
      }
    }
  } catch (error) {
    console.warn("Middleware auth error:", error);
    // Silently handle auth errors to prevent middleware crashes
  }

  return res;
}

// Ensure the middleware is only called for relevant paths
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public (public files)
     * - api/payments/webhook (webhook endpoints)
     * - tempobook (storyboard files)
     */
    "/((?!_next/static|_next/image|favicon.ico|public|api/payments/webhook|tempobook).*)",
  ],
};
