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
  EyeOff
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

const NICHE_OPTIONS = [
  { value: "lifestyle", label: "Lifestyle" },
  { value: "fitness", label: "Fitness & Health" },
  { value: "beauty", label: "Beauty & Fashion" },
  { value: "tech", label: "Technology" },
  { value: "gaming", label: "Gaming" },
  { value: "education", label: "Education" },
  { value: "entertainment", label: "Entertainment" },
  { value: "business", label: "Business & Finance" },
  { value: "food", label: "Food & Cooking" },
  { value: "travel", label: "Travel" },
  { value: "other", label: "Other" }
];

const CONTENT_FORMAT_OPTIONS = [
  { value: "short-form", label: "Short-form Videos (TikTok, Reels)" },
  { value: "long-form", label: "Long-form Videos (YouTube)" },
  { value: "posts", label: "Social Media Posts" },
  { value: "stories", label: "Stories & Live Content" },
  { value: "mixed", label: "Mixed Content" }
];

const TONE_OPTIONS = [
  { value: "professional", label: "Professional" },
  { value: "casual", label: "Casual & Friendly" },
  { value: "humorous", label: "Humorous & Entertaining" },
  { value: "educational", label: "Educational & Informative" },
  { value: "inspirational", label: "Inspirational & Motivational" },
  { value: "authentic", label: "Authentic & Personal" }
];

const FOLLOWER_COUNT_OPTIONS = [
  { value: "less-than-5k", label: "Less than 5K" },
  { value: "5k-50k", label: "5K - 50K" },
  { value: "50k-500k", label: "50K - 500K" },
  { value: "500k-plus", label: "500K+" }
];

export default function DashboardSettings({
  userProfile,
  subscription,
  onProfileUpdate,
  hasFeatureAccess,
}: DashboardSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [isManagingBilling, setIsManagingBilling] = useState(false);
  const supabase = createClient();

  // Form state
  const [formData, setFormData] = useState({
    full_name: userProfile.full_name || "",
    niche: userProfile.niche || "",
    content_format: userProfile.content_format || "",
    tone: userProfile.tone || "",
    fame_goals: userProfile.fame_goals || "",
    follower_count: userProfile.follower_count || "",
    email_notifications: true,
    privacy_public: false,
    language: "en",
    timezone: "UTC"
  });

  // Update form data when userProfile changes
  useEffect(() => {
    setFormData({
      full_name: userProfile.full_name || "",
      niche: userProfile.niche || "",
      content_format: userProfile.content_format || "",
      tone: userProfile.tone || "",
      fame_goals: userProfile.fame_goals || "",
      follower_count: userProfile.follower_count || "",
      email_notifications: true,
      privacy_public: false,
      language: "en",
      timezone: "UTC"
    });
  }, [userProfile]);

  // Clear messages after 5 seconds
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null);
        setSuccess(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, success]);

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);
    setSuccess(null);

    try {
      const { error: updateError } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          niche: formData.niche,
          content_format: formData.content_format,
          tone: formData.tone,
          fame_goals: formData.fame_goals,
          follower_count: formData.follower_count,
          updated_at: new Date().toISOString()
        })
        .eq("user_id", userProfile.user_id);

      if (updateError) throw updateError;

      setSuccess("Profile updated successfully!");
      setIsEditing(false);
      onProfileUpdate();
    } catch (err) {
      console.error("Profile update error:", err);
      setError(`Failed to update profile: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile.full_name || "",
      niche: userProfile.niche || "",
      content_format: userProfile.content_format || "",
      tone: userProfile.tone || "",
      fame_goals: userProfile.fame_goals || "",
      follower_count: userProfile.follower_count || "",
      email_notifications: true,
      privacy_public: false,
      language: "en",
      timezone: "UTC"
    });
    setIsEditing(false);
    setError(null);
  };

  const handleUpgradePlan = async () => {
    setIsUpgrading(true);
    try {
      // Redirect to pricing page for upgrade
      window.location.href = "/pricing";
    } catch (err) {
      console.error("Upgrade error:", err);
      setError("Failed to redirect to upgrade page");
    } finally {
      setIsUpgrading(false);
    }
  };

  const handleManageBilling = async () => {
    setIsManagingBilling(true);
    try {
      // For demo purposes, show a success message
      // In production, this would call the Stripe billing portal
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess("Billing portal would open here in production. For demo, you can manage your subscription through the dashboard.");
    } catch (err) {
      console.error("Billing portal error:", err);
      setError("Failed to open billing portal");
    } finally {
      setIsManagingBilling(false);
    }
  };

  const getPlanColor = (plan: string | null) => {
    if (!plan) return "bg-gray-100 text-gray-800";
    
    switch (plan.toLowerCase()) {
      case "creator":
        return "bg-blue-100 text-blue-800";
      case "influencer":
        return "bg-blue-100 text-blue-800";
      case "superstar":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPlanPrice = (plan: string | null, billing: string | null) => {
    if (!plan) return "N/A";
    
    const prices = {
      creator: { monthly: 29, yearly: 290 },
      influencer: { monthly: 59, yearly: 590 },
      superstar: { monthly: 99, yearly: 990 }
    };
    
    const planPrices = prices[plan.toLowerCase() as keyof typeof prices];
    if (!planPrices) return "N/A";
    
    const price = billing === "yearly" ? planPrices.yearly : planPrices.monthly;
    return `$${price}/${billing === "yearly" ? "year" : "month"}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Update your personal information and content preferences
          </p>
        </div>
      </div>

      {/* Error/Success Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}

      {/* Personal Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEditing ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) => handleInputChange("full_name", e.target.value)}
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <Label htmlFor="follower_count">Follower Count</Label>
                  <Select value={formData.follower_count} onValueChange={(value) => handleInputChange("follower_count", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your follower count" />
                    </SelectTrigger>
                    <SelectContent>
                      {FOLLOWER_COUNT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="niche">Content Niche</Label>
                  <Select value={formData.niche} onValueChange={(value) => handleInputChange("niche", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {NICHE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="content_format">Preferred Content Format</Label>
                  <Select value={formData.content_format} onValueChange={(value) => handleInputChange("content_format", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select content format" />
                    </SelectTrigger>
                    <SelectContent>
                      {CONTENT_FORMAT_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="tone">Content Tone</Label>
                  <Select value={formData.tone} onValueChange={(value) => handleInputChange("tone", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {TONE_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div>
                <Label htmlFor="fame_goals">Content Goals</Label>
                <Textarea
                  id="fame_goals"
                  value={formData.fame_goals}
                  onChange={(e) => handleInputChange("fame_goals", e.target.value)}
                  placeholder="Describe your content goals and what you want to achieve..."
                  rows={3}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSave} disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button variant="outline" onClick={handleCancel}>
                  <X className="w-4 h-4 mr-2" />
                  Cancel
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Full Name</Label>
                  <p className="text-sm text-gray-900 font-medium">{userProfile.full_name || "Not set"}</p>
                </div>
                <div>
                  <Label>Follower Count</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {userProfile.follower_count ? 
                      FOLLOWER_COUNT_OPTIONS.find(opt => opt.value === userProfile.follower_count)?.label : 
                      "Not set"
                    }
                  </p>
                </div>
                <div>
                  <Label>Content Niche</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {userProfile.niche ? 
                      NICHE_OPTIONS.find(opt => opt.value === userProfile.niche)?.label : 
                      "Not set"
                    }
                  </p>
                </div>
                <div>
                  <Label>Preferred Content Format</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {userProfile.content_format ? 
                      CONTENT_FORMAT_OPTIONS.find(opt => opt.value === userProfile.content_format)?.label : 
                      "Not set"
                    }
                  </p>
                </div>
                <div>
                  <Label>Content Tone</Label>
                  <p className="text-sm text-gray-900 font-medium">
                    {userProfile.tone ? 
                      TONE_OPTIONS.find(opt => opt.value === userProfile.tone)?.label : 
                      "Not set"
                    }
                  </p>
                </div>
              </div>
              <div>
                <Label>Content Goals</Label>
                <p className="text-sm text-gray-900 font-medium">
                  {userProfile.fame_goals || "Not set"}
                </p>
              </div>
              <Button onClick={() => setIsEditing(true)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-blue-600" />
            Subscription Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900">
                {subscription?.plan_name || userProfile.plan || "No Plan"} Plan
              </h3>
              <p className="text-sm text-gray-600">
                {subscription?.billing_cycle || userProfile.plan_billing || "monthly"} billing • {subscription?.status || userProfile.plan_status || "inactive"}
              </p>
            </div>
            <Badge className={getPlanColor(subscription?.plan_name || userProfile.plan)}>
              {subscription?.status === "active" || userProfile.is_active ? "Active" : "Inactive"}
            </Badge>
          </div>

          {subscription && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <Label>Next Billing</Label>
                <p className="text-gray-900 font-medium">
                  {formatDate(subscription.current_period_end)}
                </p>
              </div>
              <div>
                <Label>Plan Price</Label>
                <p className="text-gray-900 font-medium">
                  {getPlanPrice(subscription.plan_name, subscription.billing_cycle)}
                </p>
              </div>
            </div>
          )}

          <div className="space-y-2">
            <h4 className="font-medium text-gray-900">Your Plan Features:</h4>
            <ul className="space-y-1 text-sm text-gray-600">
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                AI Content Generator
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Advanced Analytics
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Unlimited Platforms
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Unlimited Posts
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Revenue Tracking
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                Viral Predictor
              </li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleManageBilling} 
              disabled={isManagingBilling || !subscription}
              variant="outline"
            >
              {isManagingBilling ? (
                <>
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <CreditCard className="w-4 h-4 mr-2" />
                  Manage Billing
                </>
              )}
            </Button>
            <Button 
              onClick={handleUpgradePlan} 
              disabled={isUpgrading}
                              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
            >
              {isUpgrading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Loading...
                </>
              ) : (
                <>
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </>
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Account Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-blue-600" />
            Account Settings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Email Notifications</h4>
                <p className="text-sm text-gray-600">Manage your notification preferences</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSuccess("Email notification settings would open here in production.")}
              >
                <Bell className="w-4 h-4 mr-2" />
                Configure
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Privacy Settings</h4>
                <p className="text-sm text-gray-600">Control your data and privacy</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSuccess("Privacy settings would open here in production.")}
              >
                <Shield className="w-4 h-4 mr-2" />
                Manage
              </Button>
            </div>
            
            <Separator />
            
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-900">Language & Region</h4>
                <p className="text-sm text-gray-600">Set your preferred language and timezone</p>
              </div>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setSuccess("Language and region settings would open here in production.")}
              >
                <Globe className="w-4 h-4 mr-2" />
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 