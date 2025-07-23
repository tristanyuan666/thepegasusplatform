"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  User, 
  Settings, 
  CreditCard, 
  Bell, 
  Shield, 
  Globe, 
  Save,
  Edit,
  CheckCircle,
  AlertCircle,
  Calendar,
  DollarSign,
  Zap
} from "lucide-react";

interface DashboardSettingsProps {
  userProfile: any;
  subscription: any;
  onProfileUpdate: () => void;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardSettings({ 
  userProfile, 
  subscription, 
  onProfileUpdate,
  hasFeatureAccess 
}: DashboardSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [profileData, setProfileData] = useState({
    full_name: userProfile?.full_name || "",
    niche: userProfile?.niche || "",
    content_format: userProfile?.content_format || "",
    fame_goals: userProfile?.fame_goals || "",
    tone: userProfile?.tone || "",
    follower_count: userProfile?.follower_count || "",
  });

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // In production, this would update the database
      console.log("Saving profile data:", profileData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setIsEditing(false);
      onProfileUpdate();
      alert("Profile updated successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Failed to save profile. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getPlanFeatures = (planName: string) => {
    const plan = planName?.toLowerCase();
    switch (plan) {
      case "creator":
        return ["AI Content Generator", "Basic Analytics", "2 Platform Connections", "50 Posts/Month"];
      case "influencer":
        return ["AI Content Generator", "Advanced Analytics", "Unlimited Platforms", "Unlimited Posts", "Revenue Tracking", "Viral Predictor"];
      case "superstar":
        return ["Everything in Influencer", "Custom Branding", "API Access", "Dedicated Manager", "Team Collaboration", "White Label"];
      default:
        return ["Basic Features"];
    }
  };

  const getNextBillingDate = () => {
    if (!subscription?.current_period_end) return "N/A";
    return new Date(subscription.current_period_end * 1000).toLocaleDateString();
  };

  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Update your personal information and content preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Personal Information</h3>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={profileData.full_name}
                  onChange={(e) => handleInputChange("full_name", e.target.value)}
                  disabled={!isEditing}
                  placeholder="Enter your full name"
                />
              </div>

              <div>
                <Label htmlFor="follower_count">Follower Count</Label>
                <Select 
                  value={profileData.follower_count} 
                  onValueChange={(value) => handleInputChange("follower_count", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your follower count" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="less-than-5k">Less than 5K</SelectItem>
                    <SelectItem value="5k-50k">5K - 50K</SelectItem>
                    <SelectItem value="50k-500k">50K - 500K</SelectItem>
                    <SelectItem value="500k-plus">500K+</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="niche">Content Niche</Label>
                <Select 
                  value={profileData.niche} 
                  onValueChange={(value) => handleInputChange("niche", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your niche" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="lifestyle">Lifestyle</SelectItem>
                    <SelectItem value="fitness">Fitness & Health</SelectItem>
                    <SelectItem value="beauty">Beauty & Fashion</SelectItem>
                    <SelectItem value="tech">Technology</SelectItem>
                    <SelectItem value="gaming">Gaming</SelectItem>
                    <SelectItem value="education">Education</SelectItem>
                    <SelectItem value="entertainment">Entertainment</SelectItem>
                    <SelectItem value="business">Business & Finance</SelectItem>
                    <SelectItem value="food">Food & Cooking</SelectItem>
                    <SelectItem value="travel">Travel</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="content_format">Preferred Content Format</Label>
                <Select 
                  value={profileData.content_format} 
                  onValueChange={(value) => handleInputChange("content_format", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select content format" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="short-form">Short-form Videos (TikTok, Reels)</SelectItem>
                    <SelectItem value="long-form">Long-form Videos (YouTube)</SelectItem>
                    <SelectItem value="posts">Social Media Posts</SelectItem>
                    <SelectItem value="stories">Stories & Live Content</SelectItem>
                    <SelectItem value="mixed">Mixed Content</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tone">Content Tone</Label>
                <Select 
                  value={profileData.tone} 
                  onValueChange={(value) => handleInputChange("tone", value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select your tone" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual & Friendly</SelectItem>
                    <SelectItem value="humorous">Humorous & Entertaining</SelectItem>
                    <SelectItem value="educational">Educational & Informative</SelectItem>
                    <SelectItem value="inspirational">Inspirational & Motivational</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="fame_goals">Content Goals</Label>
              <Textarea
                id="fame_goals"
                value={profileData.fame_goals}
                onChange={(e) => handleInputChange("fame_goals", e.target.value)}
                disabled={!isEditing}
                placeholder="Describe your content goals and what you want to achieve..."
                rows={3}
              />
            </div>

            {isEditing && (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={isSaving}
                >
                  {isSaving ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <Save className="w-4 h-4 mr-2" />
                  )}
                  {isSaving ? "Saving..." : "Save Changes"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setProfileData({
                      full_name: userProfile?.full_name || "",
                      niche: userProfile?.niche || "",
                      content_format: userProfile?.content_format || "",
                      fame_goals: userProfile?.fame_goals || "",
                      tone: userProfile?.tone || "",
                      follower_count: userProfile?.follower_count || "",
                    });
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Subscription Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5 text-green-600" />
            Subscription Management
          </CardTitle>
          <CardDescription>
            Manage your subscription plan and billing information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscription ? (
              <>
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <div>
                      <h3 className="font-medium text-green-900">
                        {subscription.plan_name} Plan
                      </h3>
                      <p className="text-sm text-green-700">
                        {subscription.billing_cycle} billing • {subscription.status}
                      </p>
                    </div>
                  </div>
                  <Badge variant="default" className="bg-green-100 text-green-800">
                    Active
                  </Badge>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Next Billing</span>
                    </div>
                    <p className="text-lg font-semibold">{getNextBillingDate()}</p>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-gray-500" />
                      <span className="text-sm font-medium">Plan Price</span>
                    </div>
                    <p className="text-lg font-semibold">
                      ${subscription.amount ? (subscription.amount / 100).toFixed(2) : "N/A"}/{subscription.billing_cycle}
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-medium">Your Plan Features:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {getPlanFeatures(subscription.plan_name).map((feature, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Zap className="w-4 h-4 text-blue-600" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button variant="outline">
                    Manage Billing
                  </Button>
                  <Button variant="outline">
                    Upgrade Plan
                  </Button>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No Active Subscription</h3>
                <p className="text-gray-600 mb-4">
                  Subscribe to a plan to unlock all features and tools
                </p>
                <Button>View Plans</Button>
              </div>
            )}
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
          <CardDescription>
            Manage your account preferences and security settings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">Email Notifications</h4>
                  <p className="text-sm text-gray-600">Manage your notification preferences</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">Privacy Settings</h4>
                  <p className="text-sm text-gray-600">Control your data and privacy</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Manage
              </Button>
            </div>

            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <Globe className="w-5 h-5 text-gray-500" />
                <div>
                  <h4 className="font-medium">Language & Region</h4>
                  <p className="text-sm text-gray-600">Set your preferred language and timezone</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 