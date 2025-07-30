"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  User,
  CreditCard,
  Bell,
  Shield,
  Globe,
  Save,
  Edit,
  X,
  CheckCircle,
  AlertCircle,
  Calendar,
  Crown,
  Settings,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
  Download,
  Upload,
  Trash2,
  Key,
  Smartphone,
  Monitor,
  Tablet,
  Wifi,
  WifiOff,
  Clock,
  Activity,
  Zap,
  Target,
  TrendingUp,
  Users,
  BarChart3,
  FileText,
  Image,
  Video,
  Music,
  Hash,
  Star,
  Award,
  Trophy,
  Gift,
  Sparkles,
  LogOut,
} from "lucide-react";
import { createClient } from "../../supabase/client";

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  full_name: string | null;
  plan: string | null;
  plan_status: string | null;
  plan_billing: string | null;
  is_active: boolean;
  niche: string | null;
  tone: string | null;
  content_format: string | null;
  fame_goals: string | null;
  follower_count: string | null;
  viral_score: number;
  monetization_forecast: number;
  onboarding_completed: boolean;
  created_at: string;
  updated_at: string | null;
  bio?: string | null;
  website?: string | null;
  location?: string | null;
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

interface DashboardSettingsProps {
  userProfile: UserProfile;
  subscription: Subscription | null;
  onProfileUpdate: () => void;
  hasFeatureAccess: (feature: string) => boolean;
}

interface DeviceSession {
  id: string;
  device: string;
  location: string;
  last_active: string;
  is_current: boolean;
  ip_address: string;
  user_agent: string;
}

interface NotificationSettings {
  email_notifications: boolean;
  push_notifications: boolean;
  marketing_emails: boolean;
  content_reminders: boolean;
  analytics_reports: boolean;
  billing_alerts: boolean;
  security_alerts: boolean;
}

interface PrivacySettings {
  profile_visibility: "public" | "private" | "followers";
  show_activity: boolean;
  show_followers: boolean;
  show_analytics: boolean;
  allow_messaging: boolean;
  data_collection: boolean;
}

const NICHE_OPTIONS = [
  { value: "lifestyle", label: "Lifestyle", icon: "🌟" },
  { value: "fitness", label: "Fitness & Health", icon: "💪" },
  { value: "beauty", label: "Beauty & Fashion", icon: "💄" },
  { value: "tech", label: "Technology", icon: "💻" },
  { value: "gaming", label: "Gaming", icon: "🎮" },
  { value: "education", label: "Education", icon: "📚" },
  { value: "entertainment", label: "Entertainment", icon: "🎬" },
  { value: "business", label: "Business & Finance", icon: "💼" },
  { value: "food", label: "Food & Cooking", icon: "🍳" },
  { value: "travel", label: "Travel", icon: "✈️" },
  { value: "other", label: "Other", icon: "🎯" }
];

const CONTENT_FORMAT_OPTIONS = [
  { value: "short-form", label: "Short-form Videos (TikTok, Reels)", icon: "📱" },
  { value: "long-form", label: "Long-form Videos (YouTube)", icon: "📺" },
  { value: "posts", label: "Social Media Posts", icon: "📝" },
  { value: "stories", label: "Stories & Live Content", icon: "📸" },
  { value: "mixed", label: "Mixed Content", icon: "🎨" }
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional", icon: "👔" },
  { value: "casual", label: "Casual & Friendly", icon: "😊" },
  { value: "humorous", label: "Humorous & Entertaining", icon: "😂" },
  { value: "educational", label: "Educational & Informative", icon: "📖" },
  { value: "inspirational", label: "Inspirational & Motivational", icon: "✨" },
  { value: "authentic", label: "Authentic & Personal", icon: "💝" }
];

const FAME_GOALS_OPTIONS = [
  { value: "build-brand", label: "Build Personal Brand", icon: "🏆" },
  { value: "monetize", label: "Monetize Content", icon: "💰" },
  { value: "become-expert", label: "Become Industry Expert", icon: "🎓" },
  { value: "launch-business", label: "Launch Business", icon: "🚀" },
  { value: "community", label: "Build Community", icon: "👥" },
  { value: "influence", label: "Influence & Impact", icon: "🌟" }
];

export default function DashboardSettings({
  userProfile,
  subscription,
  onProfileUpdate,
  hasFeatureAccess,
}: DashboardSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [deviceSessions, setDeviceSessions] = useState<DeviceSession[]>([]);
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    email_notifications: true,
    push_notifications: true,
    marketing_emails: false,
    content_reminders: true,
    analytics_reports: true,
    billing_alerts: true,
    security_alerts: true,
  });
  const [privacySettings, setPrivacySettings] = useState<PrivacySettings>({
    profile_visibility: "public",
    show_activity: true,
    show_followers: true,
    show_analytics: false,
    allow_messaging: true,
    data_collection: true,
  });
  
  const supabase = createClient();

  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || "",
    niche: userProfile?.niche || "lifestyle",
    tone: userProfile?.tone || "authentic",
    content_format: userProfile?.content_format || "mixed",
    fame_goals: userProfile?.fame_goals || "build-brand",
    bio: userProfile?.bio || "",
    website: userProfile?.website || "",
    location: userProfile?.location || "",
  });

  useEffect(() => {
    loadDeviceSessions();
    loadSettings();
  }, []);

  const loadDeviceSessions = async () => {
    if (!userProfile?.user_id) return;
    
    try {
      // Load real device sessions from database
      const { data: sessionsData, error } = await supabase
        .from("user_sessions")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .order("last_active", { ascending: false });

      if (error) throw error;

      // Transform database data to match interface
      const realSessions: DeviceSession[] = (sessionsData || []).map((session: any) => ({
        id: session.id,
        device: session.device_type || "Unknown Device",
        location: session.location || "Unknown Location",
        last_active: session.last_active,
        is_current: session.is_current || false,
        ip_address: session.ip_address || "Unknown",
        user_agent: session.user_agent || "Unknown Browser"
      }));

      setDeviceSessions(realSessions);
    } catch (error) {
      console.error("Error loading device sessions:", error);
      // Fallback to empty array if error
      setDeviceSessions([]);
    }
  };

  const loadSettings = async () => {
    try {
      // Load user settings from database
      const { data: settings, error } = await supabase
        .from("user_settings")
        .select("*")
        .eq("user_id", userProfile.user_id)
        .single();

      if (settings) {
        setNotificationSettings(settings.notifications || notificationSettings);
        setPrivacySettings(settings.privacy || privacySettings);
      }
    } catch (error) {
      console.error("Error loading settings:", error);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (field: keyof NotificationSettings, value: boolean) => {
    setNotificationSettings(prev => ({ ...prev, [field]: value }));
  };

  const handlePrivacyChange = (field: keyof PrivacySettings, value: boolean | string) => {
    setPrivacySettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      // Validate required fields
      if (!formData.full_name.trim()) {
        throw new Error("Full name is required");
      }

      // Update user profile
      const { error: profileError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          niche: formData.niche,
          tone: formData.tone,
          content_format: formData.content_format,
          fame_goals: formData.fame_goals,
          bio: formData.bio,
          website: formData.website,
          location: formData.location,
          updated_at: new Date().toISOString(),
        })
        .eq("user_id", userProfile.user_id);

      if (profileError) throw profileError;

      // Try to update settings table if it exists, but don't fail if it doesn't
      try {
        const { error: settingsError } = await supabase
          .from("user_settings")
          .upsert({
            user_id: userProfile.user_id,
            notifications: notificationSettings,
            privacy: privacySettings,
            updated_at: new Date().toISOString(),
          });

        if (settingsError) {
          console.warn("Settings table not available:", settingsError);
          // Continue without settings table
        }
      } catch (settingsError) {
        console.warn("Settings table not available:", settingsError);
        // Continue without settings table
      }

      setSuccess("Settings saved successfully!");
      setIsEditing(false);
      onProfileUpdate();
      
      setTimeout(() => setSuccess(null), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
      setError(error instanceof Error ? error.message : "Failed to save settings");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile?.full_name || "",
      niche: userProfile?.niche || "lifestyle",
      tone: userProfile?.tone || "authentic",
      content_format: userProfile?.content_format || "mixed",
      fame_goals: userProfile?.fame_goals || "build-brand",
      bio: userProfile?.bio || "",
      website: userProfile?.website || "",
      location: userProfile?.location || "",
    });
    setIsEditing(false);
    setError(null);
    setSuccess(null);
  };

  const handleUpgradePlan = async () => {
    window.location.href = "/pricing";
  };

  const handleManageBilling = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("create-portal-session", {
        body: { user_id: userProfile.user_id }
      });

      if (error) {
        console.error("Billing portal error:", error);
        // Fallback to pricing page
        window.location.href = "/pricing";
        return;
      }
      
      if (data?.url) {
        window.location.href = data.url;
      } else {
        // Fallback to pricing page
        window.location.href = "/pricing";
      }
    } catch (error) {
      console.error("Error creating billing portal:", error);
      // Fallback to pricing page instead of showing error
      window.location.href = "/pricing";
    }
  };

  const handleSignOutAllDevices = async () => {
    if (window.confirm("Are you sure you want to sign out from all devices?")) {
      try {
        await supabase.auth.signOut({ scope: "global" });
        window.location.href = "/sign-in?message=Signed out from all devices";
      } catch (error) {
        console.error("Error signing out:", error);
        setError("Failed to sign out from all devices");
      }
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        // In a real app, you'd call a server action to delete the account
        setError("Account deletion is not implemented yet. Please contact support.");
      } catch (error) {
        console.error("Error deleting account:", error);
        setError("Failed to delete account");
      }
    }
  };

  const getPlanColor = (plan: string | null) => {
    switch (plan?.toLowerCase()) {
      case "creator": return "text-blue-600 bg-blue-100";
      case "influencer": return "text-purple-600 bg-purple-100";
      case "superstar": return "text-yellow-600 bg-yellow-100";
      default: return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPlanPrice = (plan: string | null, billing: string | null) => {
    const prices = {
      creator: { monthly: 29.99, yearly: 299.99 },
      influencer: { monthly: 59.99, yearly: 599.99 },
      superstar: { monthly: 99.99, yearly: 959.99 },
    };
    
    const planPrices = prices[plan?.toLowerCase() as keyof typeof prices];
    if (!planPrices) return null;
    
    return billing === "yearly" ? planPrices.yearly : planPrices.monthly;
  };

  if (!hasFeatureAccess("settings")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Settings Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access advanced settings.
            </p>
            <Button onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
          <p className="text-gray-600">Manage your account preferences and security</p>
        </div>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Save Changes
                  </>
                )}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
            >
              <Edit className="w-4 h-4 mr-2" />
              Edit Settings
            </Button>
          )}
        </div>
      </div>

      {/* Success/Error Alerts */}
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert className="border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">{success}</AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5 h-12 bg-gray-50 border border-gray-200 rounded-lg p-1">
          <TabsTrigger 
            value="profile" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <User className="w-4 h-4" />
            <span className="font-medium">Profile</span>
          </TabsTrigger>
          <TabsTrigger 
            value="notifications" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <Bell className="w-4 h-4" />
            <span className="font-medium">Notifications</span>
          </TabsTrigger>
          <TabsTrigger 
            value="privacy" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <Shield className="w-4 h-4" />
            <span className="font-medium">Privacy</span>
          </TabsTrigger>
          <TabsTrigger 
            value="security" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <Lock className="w-4 h-4" />
            <span className="font-medium">Security</span>
          </TabsTrigger>
          <TabsTrigger 
            value="billing" 
            className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm data-[state=active]:text-blue-600 rounded-md transition-all duration-200"
          >
            <CreditCard className="w-4 h-4" />
            <span className="font-medium">Billing</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-blue-600" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Enter your full name"
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    disabled={!isEditing}
                    placeholder="City, Country"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange("bio", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Tell us about yourself..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  value={formData.website}
                  onChange={(e) => handleInputChange("website", e.target.value)}
                  disabled={!isEditing}
                  placeholder="https://yourwebsite.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="niche">Niche</Label>
                  <Select
                    value={formData.niche}
                    onValueChange={(value) => handleInputChange("niche", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {NICHE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="tone">Content Tone</Label>
                  <Select
                    value={formData.tone}
                    onValueChange={(value) => handleInputChange("tone", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="content_format">Content Format</Label>
                  <Select
                    value={formData.content_format}
                    onValueChange={(value) => handleInputChange("content_format", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_FORMAT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="fame_goals">Fame Goals</Label>
                  <Select
                    value={formData.fame_goals}
                    onValueChange={(value) => handleInputChange("fame_goals", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FAME_GOALS_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          <span className="flex items-center gap-2">
                            <span>{option.icon}</span>
                            {option.label}
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-blue-600" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Email Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Receive notifications about your account activity
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.email_notifications}
                    onCheckedChange={(checked) => handleNotificationChange("email_notifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Push Notifications</Label>
                    <p className="text-sm text-gray-600">
                      Get real-time updates on your device
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.push_notifications}
                    onCheckedChange={(checked) => handleNotificationChange("push_notifications", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features and offers
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.marketing_emails}
                    onCheckedChange={(checked) => handleNotificationChange("marketing_emails", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Content Reminders</Label>
                    <p className="text-sm text-gray-600">
                      Get reminded about scheduled content
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.content_reminders}
                    onCheckedChange={(checked) => handleNotificationChange("content_reminders", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Analytics Reports</Label>
                    <p className="text-sm text-gray-600">
                      Weekly performance reports
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.analytics_reports}
                    onCheckedChange={(checked) => handleNotificationChange("analytics_reports", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Billing Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Payment and subscription notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.billing_alerts}
                    onCheckedChange={(checked) => handleNotificationChange("billing_alerts", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Security Alerts</Label>
                    <p className="text-sm text-gray-600">
                      Login and security notifications
                    </p>
                  </div>
                  <Switch
                    checked={notificationSettings.security_alerts}
                    onCheckedChange={(checked) => handleNotificationChange("security_alerts", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="privacy" className="space-y-6">
          {/* Privacy Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-blue-600" />
                Privacy Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label>Profile Visibility</Label>
                  <Select
                    value={privacySettings.profile_visibility}
                    onValueChange={(value) => handlePrivacyChange("profile_visibility", value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="public">Public</SelectItem>
                      <SelectItem value="followers">Followers Only</SelectItem>
                      <SelectItem value="private">Private</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Activity</Label>
                    <p className="text-sm text-gray-600">
                      Display your recent activity to others
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_activity}
                    onCheckedChange={(checked) => handlePrivacyChange("show_activity", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Followers</Label>
                    <p className="text-sm text-gray-600">
                      Display your follower count publicly
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_followers}
                    onCheckedChange={(checked) => handlePrivacyChange("show_followers", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Analytics</Label>
                    <p className="text-sm text-gray-600">
                      Share your performance metrics
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.show_analytics}
                    onCheckedChange={(checked) => handlePrivacyChange("show_analytics", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Allow Messaging</Label>
                    <p className="text-sm text-gray-600">
                      Let others send you direct messages
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.allow_messaging}
                    onCheckedChange={(checked) => handlePrivacyChange("allow_messaging", checked)}
                    disabled={!isEditing}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Data Collection</Label>
                    <p className="text-sm text-gray-600">
                      Allow us to collect usage data for improvements
                    </p>
                  </div>
                  <Switch
                    checked={privacySettings.data_collection}
                    onCheckedChange={(checked) => handlePrivacyChange("data_collection", checked)}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-600" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Active Sessions</h4>
                  <div className="space-y-3">
                    {deviceSessions.map((session) => (
                      <div key={session.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            {session.is_current ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <Monitor className="w-4 h-4 text-gray-400" />
                            )}
                            <span className="font-medium">{session.device}</span>
                          </div>
                          <div className="text-sm text-gray-600">
                            {session.location} • {session.ip_address}
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {session.is_current ? "Current" : formatDate(new Date(session.last_active).getTime() / 1000)}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={handleSignOutAllDevices}
                    className="w-full"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out All Devices
                  </Button>

                  <Button
                    variant="outline"
                    onClick={handleDeleteAccount}
                    className="w-full text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="space-y-6">
          {/* Billing Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Billing & Subscription
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Crown className="w-5 h-5 text-yellow-600" />
                        <span className="font-semibold text-gray-900">{subscription.plan_name}</span>
                        <Badge className={getPlanColor(subscription.plan_name)}>
                          {subscription.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600">
                        {subscription.billing_cycle} billing • ${getPlanPrice(subscription.plan_name, subscription.billing_cycle)}/month
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next billing</p>
                      <p className="font-medium">{formatDate(subscription.current_period_end)}</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      onClick={handleManageBilling}
                      className="flex-1"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Billing
                    </Button>
                    <Button
                      onClick={handleUpgradePlan}
                      variant="outline"
                      className="flex-1"
                    >
                      <TrendingUp className="w-4 h-4 mr-2" />
                      Upgrade Plan
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <Crown className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                  <p className="text-gray-600 mb-4">
                    Upgrade to unlock premium features and advanced analytics
                  </p>
                  <Button onClick={handleUpgradePlan}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
} 