"use client";

import { useState, useEffect } from "react";
import { createClient } from "../../../supabase/client";
import { User } from "@supabase/supabase-js";
import PlatformConnections from "@/components/platform-connections";
import { FeatureAccess } from "@/utils/feature-access";
import { SocialConnection } from "@/utils/auth";
import LoadingSpinner from "@/components/loading-spinner";

export default function TestConnectionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [connections, setConnections] = useState<SocialConnection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const supabase = createClient();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Get current user
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        if (userError) throw userError;
        if (!currentUser) throw new Error("No user found");

        setUser(currentUser);

        // Get platform connections
        const { data: platformConnections, error: connectionsError } = await supabase
          .from("platform_connections")
          .select("*")
          .eq("user_id", currentUser.id)
          .eq("is_active", true);

        if (connectionsError) {
          console.warn("Platform connections error:", connectionsError);
          setConnections([]);
        } else {
          setConnections(platformConnections || []);
        }

      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const featureAccess: FeatureAccess = {
    hasAccess: (feature: string) => true, // Allow all features for testing
    getUsageLimit: (feature: string) => 1000,
    getCurrentUsage: (feature: string) => 0,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md">
          <h1 className="text-2xl font-bold text-red-600 mb-4">No User Found</h1>
          <p className="text-gray-600">Please log in to test the connection system.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Connection System Test</h1>
          <p className="text-gray-600">
            Test the new platform connection system. Try searching for usernames and connecting to different platforms.
          </p>
        </div>

        <PlatformConnections
          userId={user.id}
          connections={connections}
          featureAccess={featureAccess}
        />

        {/* Debug Information */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Debug Information</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-700 mb-2">Current Connections:</h3>
              <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
                {JSON.stringify(connections, null, 2)}
              </pre>
            </div>
            <div>
              <h3 className="font-medium text-gray-700 mb-2">User ID:</h3>
              <p className="text-sm text-gray-600">{user.id}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 