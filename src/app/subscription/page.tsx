"use client";

import { useEffect, useState } from "react";
import { createClient } from "../../../supabase/client";
import { User } from "@supabase/supabase-js";

export default function SubscriptionPage() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const supabase = createClient();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { user }, error } = await supabase.auth.getUser();
        setUser(user);
      } catch (error) {
        console.error("Error checking user:", error);
      } finally {
        setLoading(false);
      }
    };

    checkUser();
  }, [supabase]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center max-w-md">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Subscription Management</h1>
        <p className="text-gray-600 mb-4">
          {user ? `Welcome, ${user.email}` : "Please sign in"}
        </p>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Creator Plan</h2>
          <p className="text-2xl font-bold text-blue-600 mb-2">$39.99/month</p>
          <p className="text-gray-600">$383.99/year (20% off)</p>
        </div>
      </div>
    </div>
  );
}
