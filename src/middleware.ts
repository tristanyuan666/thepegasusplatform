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

    // Protected routes - require authentication
    const protectedRoutes = [
      "/dashboard",
      "/features/ai-content",
      "/features/analytics",
      "/features/growth-engine",
      "/features/persona-builder",
      "/features/scheduler",
      "/features/viral-predictor",
      "/integrations",
    ];

    const isProtectedRoute = protectedRoutes.some((route) =>
      req.nextUrl.pathname.startsWith(route),
    );

    if (isProtectedRoute && (error || !user)) {
      return NextResponse.redirect(new URL("/sign-in", req.url));
    }

    // Redirect authenticated users from auth pages to dashboard
    const authPages = ["/sign-in", "/sign-up"];
    const isAuthPage = authPages.includes(req.nextUrl.pathname);

    if (isAuthPage && !error && user) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
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
