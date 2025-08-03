"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Instagram,
  Youtube,
  Facebook,
  Linkedin,
  Music,
  CheckCircle,
  X,
  ExternalLink,
  RefreshCw,
  AlertCircle,
  Users,
  TrendingUp,
  Calendar,
  Key,
  Eye,
  EyeOff,
  Loader2,
  Settings,
  Info
} from "lucide-react";
import XIcon from "./x-icon";
import PlatformConnections from "./platform-connections";
import { createClient } from "../../supabase/client";
import { SocialConnection } from "@/utils/auth";
import { FeatureAccess } from "@/utils/feature-access";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
  plan_status: string | null;
  plan_billing: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string | null;
}

interface Subscription {
  stripe_id: string;
  user_id: string;
  plan_name: string;
  billing_cycle: string;
  status: string;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
}

interface PlatformConnection {
  id: string;
  user_id: string;
  platform: string;
  platform_user_id: string;
  platform_username: string;
  access_token: string;
  refresh_token: string;
  is_active: boolean;
  connected_at: string;
  last_sync: string;
  follower_count?: number;
  manual_credentials?: any;
  connection_type?: string;
}

interface DashboardPlatformsProps {
  userProfile: UserProfile;
  subscription: Subscription | null;
  platformConnections: PlatformConnection[];
  onConnectionsUpdate: () => void;
  hasFeatureAccess: (feature: string) => boolean;
}

// Convert PlatformConnection to SocialConnection for the PlatformConnections component
const convertToSocialConnections = (connections: PlatformConnection[]): SocialConnection[] => {
  return connections.map(conn => ({
    id: conn.id,
    user_id: conn.user_id,
    platform: conn.platform,
    platform_user_id: conn.platform_user_id,
    platform_username: conn.platform_username,
    username: conn.platform_username,
    follower_count: conn.follower_count || 0,
    is_active: conn.is_active,
    created_at: conn.connected_at,
    updated_at: conn.last_sync,
  }));
};

// Mock feature access for now
const mockFeatureAccess: FeatureAccess = {
  aiPersonaBuilder: true,
  aiPosts: { enabled: true, limit: null },
  socialPlatforms: { enabled: true, limit: null },
  analytics: { basic: true, advanced: true },
  support: { email: true, priority: true },
  viralScorePredictor: true,
  advancedAIContent: true,
  autoScheduling: true,
  customBranding: true,
  apiAccess: true,
  whiteLabel: true,
  dedicatedManager: true,
  customIntegrations: true,
  advancedMonetization: true,
  teamCollaboration: true,
  priorityFeatureRequests: true,
  strategyCalls: true,
  customAITraining: true,
  revenueOptimization: true,
};

export default function DashboardPlatforms({
  userProfile,
  subscription,
  platformConnections,
  onConnectionsUpdate,
  hasFeatureAccess,
}: DashboardPlatformsProps) {
  const [localConnections, setLocalConnections] = useState<SocialConnection[]>([]);

  // Convert platform connections to social connections
  useEffect(() => {
    setLocalConnections(convertToSocialConnections(platformConnections));
  }, [platformConnections]);

  // Handle connection updates from PlatformConnections component
  const handleConnectionsUpdate = (updatedConnections: SocialConnection[]) => {
    setLocalConnections(updatedConnections);
    // Notify parent component
    onConnectionsUpdate();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Platform Connections</h1>
          <p className="text-gray-600 mt-2">
            Connect your social media accounts to track performance and analytics
          </p>
        </div>
      </div>

      {/* Connection Status Overview */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Connection Overview</h3>
            <p className="text-gray-600">
              {localConnections.filter(conn => conn.is_active).length} platforms connected
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-medium text-gray-700">
              {localConnections
                .filter(conn => conn.is_active)
                .reduce((sum, conn) => sum + (conn.follower_count || 0), 0)
                .toLocaleString()} total followers
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700">Active Platforms</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {localConnections.filter(conn => conn.is_active).length}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700">Total Followers</span>
            </div>
            <p className="text-2xl font-bold text-gray-900">
              {localConnections
                .filter(conn => conn.is_active)
                .reduce((sum, conn) => sum + (conn.follower_count || 0), 0)
                .toLocaleString()}
            </p>
          </div>

          <div className="bg-white rounded-lg p-4 border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-4 h-4 text-purple-600" />
              <span className="text-sm font-medium text-gray-700">Last Sync</span>
            </div>
            <p className="text-sm text-gray-600">
              {localConnections.filter(conn => conn.is_active).length > 0
                ? "Recently updated"
                : "No connections"}
            </p>
          </div>
        </div>
      </Card>

      {/* Platform Connections Component */}
      <PlatformConnections
        userId={userProfile.user_id}
        connections={localConnections}
        featureAccess={mockFeatureAccess}
        onConnectionsUpdate={handleConnectionsUpdate}
      />

      {/* Help Section */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
          <Info className="w-5 h-5 text-blue-600" />
          How Platform Connections Work
        </h3>
        <p className="text-gray-600 mb-4">
          Connect your social media accounts by entering usernames. Multiple users can connect to the same account - 
          this is useful for managing shared accounts or collaborating with teams. Your data is used to provide 
          personalized analytics and content recommendations.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" size="sm">
            <ExternalLink className="w-4 h-4 mr-2" />
            View Documentation
          </Button>
          <Button variant="outline" size="sm">
            Contact Support
          </Button>
        </div>
      </Card>
    </div>
  );
} 