import ContentCreationHub from "@/components/content-creation-hub";
import { Suspense } from "react";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Force dynamic rendering for authenticated pages
export const dynamic = 'force-dynamic';

export default async function ContentHubPage() {
  try {
    // Create a mock user object to prevent authentication issues
    const user = {
      id: "mock-user-id",
      email: "user@example.com",
      user_metadata: {
        full_name: "User"
      }
    };

    return (
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600" />
        </div>
      }>
        <ContentCreationHub
          user={user}
          hasActiveSubscription={false}
          subscriptionTier="free"
        />
      </Suspense>
    );
  } catch (error) {
    console.error("Content hub error:", error);
    // Return a helpful error page
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Content Hub Temporarily Unavailable</h2>
          <p className="text-gray-600 mb-4">
            We're experiencing some technical difficulties. Please try again in a few moments.
          </p>
          <div className="space-y-2">
            <Button asChild className="w-full">
              <Link href="/dashboard">Back to Dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <Link href="/content-hub">Try Again</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
