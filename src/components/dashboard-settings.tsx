"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Camera,
  Mail,
  Phone,
  MapPin
} from "lucide-react";

interface User {
  id: string;
  email?: string;
}

interface UserProfile {
  id: string;
  user_id: string;
  email: string | null;
  name: string | null;
  full_name: string | null;
  avatar_url: string | null;
  subscription: string | null;
  niche: string | null;
  tone: string | null;
  content_format: string | null;
  fame_goals: string | null;
  follower_count: number | null;
  viral_score: number | null;
  monetization_forecast: number | null;
  onboarding_completed: boolean | null;
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
  user: User;
  userProfile: UserProfile;
  subscription: Subscription | null;
  onProfileUpdate: (profile: UserProfile) => void;
  hasFeatureAccess: (feature: string) => boolean;
}

export default function DashboardSettings({
  user,
  userProfile,
  subscription,
  onProfileUpdate,
  hasFeatureAccess,
}: DashboardSettingsProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    full_name: userProfile.full_name || "",
    email: userProfile.email || user.email || "",
    niche: userProfile.niche || "",
    tone: userProfile.tone || "",
    content_format: userProfile.content_format || "",
    fame_goals: userProfile.fame_goals || "",
  });

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedProfile = {
        ...userProfile,
        full_name: formData.full_name,
        email: formData.email,
        niche: formData.niche,
        tone: formData.tone,
        content_format: formData.content_format,
        fame_goals: formData.fame_goals,
        updated_at: new Date().toISOString(),
      };
      
      onProfileUpdate(updatedProfile);
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving profile:", error);
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString();
  };

  const getPlanColor = (plan: string) => {
    switch (plan.toLowerCase()) {
      case "creator":
        return "bg-blue-100 text-blue-800";
      case "influencer":
        return "bg-purple-100 text-purple-800";
      case "superstar":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Account Settings
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your profile and account preferences
            </p>
          </div>
          <div className="text-right">
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <Settings className="w-3 h-3 mr-1" />
              Settings
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {/* Avatar */}
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center">
                    {userProfile.avatar_url ? (
                      <img 
                        src={userProfile.avatar_url} 
                        alt="Profile" 
                        className="w-20 h-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-8 h-8 text-gray-400" />
                    )}
                  </div>
                  <div>
                    <Button variant="outline" size="sm">
                      <Camera className="w-4 h-4 mr-2" />
                      Change Photo
                    </Button>
                  </div>
                </div>

                {/* Form Fields */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      value={formData.full_name}
                      onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      disabled={!isEditing}
                      placeholder="Enter your email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="niche">Content Niche</Label>
                    <Input
                      id="niche"
                      value={formData.niche}
                      onChange={(e) => setFormData({ ...formData, niche: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Fitness, Tech, Lifestyle"
                    />
                  </div>
                  <div>
                    <Label htmlFor="tone">Content Tone</Label>
                    <Input
                      id="tone"
                      value={formData.tone}
                      onChange={(e) => setFormData({ ...formData, tone: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Professional, Casual, Humorous"
                    />
                  </div>
                  <div>
                    <Label htmlFor="content_format">Preferred Format</Label>
                    <Input
                      id="content_format"
                      value={formData.content_format}
                      onChange={(e) => setFormData({ ...formData, content_format: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., Videos, Posts, Stories"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fame_goals">Fame Goals</Label>
                    <Input
                      id="fame_goals"
                      value={formData.fame_goals}
                      onChange={(e) => setFormData({ ...formData, fame_goals: e.target.value })}
                      disabled={!isEditing}
                      placeholder="e.g., 100K followers, Brand deals"
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-4">
                  {isEditing ? (
                    <>
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
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Cancel
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Profile
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Subscription Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Subscription Details
              </CardTitle>
            </CardHeader>
            <CardContent>
              {subscription ? (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Badge className={getPlanColor(subscription.plan_name)}>
                        {subscription.plan_name}
                      </Badge>
                      <div>
                        <p className="font-medium">{subscription.billing_cycle} Plan</p>
                        <p className="text-sm text-gray-600">
                          Status: {subscription.status}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Next billing</p>
                      <p className="font-medium">
                        {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <p className="text-sm font-medium text-blue-600">Current Period</p>
                      <p className="text-sm text-gray-600">
                        {formatDate(subscription.current_period_start)} - {formatDate(subscription.current_period_end)}
                      </p>
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <p className="text-sm font-medium text-green-600">Auto-renewal</p>
                      <p className="text-sm text-gray-600">
                        {subscription.cancel_at_period_end ? "Cancels at period end" : "Active"}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button variant="outline" className="flex-1">
                      Manage Subscription
                    </Button>
                    <Button variant="outline" className="flex-1">
                      View Billing History
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No active subscription</p>
                  <p className="text-sm">Upgrade to access premium features</p>
                  <Button className="mt-4">
                    View Plans
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle>Account Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Member since</span>
                  <span className="text-sm font-medium">
                    {new Date(userProfile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Followers</span>
                  <span className="text-sm font-medium">
                    {userProfile.follower_count?.toLocaleString() || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Viral Score</span>
                  <span className="text-sm font-medium">
                    {userProfile.viral_score || "0"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Onboarding</span>
                  <span className="text-sm font-medium">
                    {userProfile.onboarding_completed ? "Complete" : "Incomplete"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Bell className="w-4 h-4 mr-2" />
                  Notification Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Shield className="w-4 h-4 mr-2" />
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Globe className="w-4 h-4 mr-2" />
                  Language & Region
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-blue-600" />
                Profile Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Keep your profile updated</p>
                    <p className="text-sm text-gray-600">Accurate information helps with content recommendations</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-green-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Set clear goals</p>
                    <p className="text-sm text-gray-600">Define your fame goals to get personalized insights</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-purple-600 rounded-full mt-2"></div>
                  <div>
                    <p className="font-medium">Choose your niche wisely</p>
                    <p className="text-sm text-gray-600">A focused niche helps build a loyal audience</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
} 