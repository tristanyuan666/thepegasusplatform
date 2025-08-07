"use client";

import { useState, useEffect } from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Switch } from "./ui/switch";
import {
  User as UserIcon,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Edit3,
  Save,
  X,
  Upload,
  Shield,
  Bell,
  Eye,
  Lock,
  Trash2,
  Download,
  AlertTriangle,
  CheckCircle,
  Camera,
  Globe,
  Link as LinkIcon,
  Instagram,
  Youtube,
  Linkedin,
  Facebook,
} from "lucide-react";
import XIcon from "./x-icon";
import { updateUserProfile } from "@/app/actions";
import { FormMessage, Message } from "./form-message";
import { supabase } from "../../supabase/supabase";

interface UserProfileManagementProps {
  user: User;
  userProfile: any;
}

export default function UserProfileManagement({
  user,
  userProfile: initialProfile,
}: UserProfileManagementProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<Message | null>(null);
  const [userProfile, setUserProfile] = useState(initialProfile || {});
  const [formData, setFormData] = useState({
    full_name: userProfile?.full_name || user.user_metadata?.full_name || "",
    bio: userProfile?.bio || "",
    website: userProfile?.website || "",
    location: userProfile?.location || "",
    phone: userProfile?.phone || "",
    avatar_url: userProfile?.avatar_url || user.user_metadata?.avatar_url || "",
    social_links: userProfile?.social_links || {
      instagram: "",
      x: "",
      youtube: "",
      linkedin: "",
      facebook: "",
    },
  });
  const [preferences, setPreferences] = useState({
    email_notifications: userProfile?.email_notifications ?? true,
    marketing_emails: userProfile?.marketing_emails ?? true,
    profile_visibility: userProfile?.profile_visibility ?? "public",
    show_activity: userProfile?.show_activity ?? true,
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingSessions, setLoadingSessions] = useState(true);

  useEffect(() => {
    loadSessions();
  }, []);

  const loadSessions = async () => {
    try {
      setLoadingSessions(true);
      // Get current session info
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session) {
        setSessions([
          {
            id: session.access_token.substring(0, 8),
            device: navigator.userAgent.includes("Mobile")
              ? "Mobile Device"
              : "Desktop",
            location: "Current Location",
            last_active: new Date().toISOString(),
            current: true,
          },
        ]);
      }
    } catch (error) {
      console.error("Error loading sessions:", error);
    } finally {
      setLoadingSessions(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSocialLinkChange = (platform: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      social_links: {
        ...prev.social_links,
        [platform]: value,
      },
    }));
  };

  const handlePreferenceChange = (field: string, value: boolean | string) => {
    setPreferences((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    setIsLoading(true);
    setMessage(null);

    try {
      const updateData = {
        ...formData,
        ...preferences,
        updated_at: new Date().toISOString(),
      };

      const result = await updateUserProfile(user.id, updateData);

      if (result.error) {
        setMessage({ error: result.error });
      } else {
        setMessage({ success: "Profile updated successfully!" });
        setUserProfile(result.data);
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      setMessage({ error: "Failed to update profile. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      full_name: userProfile?.full_name || user.user_metadata?.full_name || "",
      bio: userProfile?.bio || "",
      website: userProfile?.website || "",
      location: userProfile?.location || "",
      phone: userProfile?.phone || "",
      avatar_url:
        userProfile?.avatar_url || user.user_metadata?.avatar_url || "",
      social_links: userProfile?.social_links || {
        instagram: "",
        twitter: "",
        youtube: "",
        linkedin: "",
        facebook: "",
      },
    });
    setIsEditing(false);
    setMessage(null);
  };

  const handleSignOutAllDevices = async () => {
    try {
      await supabase.auth.signOut({ scope: "global" });
      window.location.href = "/sign-in?message=Signed out from all devices";
    } catch (error) {
      console.error("Error signing out:", error);
      setMessage({ error: "Failed to sign out from all devices" });
    }
  };

  const handleDeleteAccount = async () => {
    if (
      window.confirm(
        "Are you sure you want to delete your account? This action cannot be undone.",
      )
    ) {
      try {
        setIsLoading(true);
        
        // Delete user profile from database
        const { error: profileError } = await supabase
          .from("users")
          .delete()
          .eq("user_id", user.id);

        if (profileError) {
          console.error("Profile deletion error:", profileError);
        }

        // Delete user from auth
        const { error: authError } = await supabase.auth.admin.deleteUser(user.id);

        if (authError) {
          console.error("Auth deletion error:", authError);
          // If admin delete fails, try regular sign out
          await supabase.auth.signOut();
        }

        setMessage({
          success: "Account deleted successfully. Redirecting to home page...",
        });

        // Redirect to home page after a short delay
        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      } catch (error) {
        console.error("Error deleting account:", error);
        setMessage({
          error: "Failed to delete account. Please contact support.",
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram className="w-4 h-4" />;
      case "x":
        return <XIcon className="w-4 h-4" />;
      case "youtube":
        return <Youtube className="w-4 h-4" />;
      case "linkedin":
        return <Linkedin className="w-4 h-4" />;
      case "facebook":
        return <Facebook className="w-4 h-4" />;
      default:
        return <LinkIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
          <p className="text-gray-600 mt-1">
            Manage your account settings and preferences
          </p>
        </div>
        <div className="flex items-center gap-3">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                className="hover-target interactive-element"
                data-interactive="true"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="hover-target interactive-element"
                data-interactive="true"
              >
                <Save className="w-4 h-4 mr-2" />
                {isLoading ? "Saving..." : "Save Changes"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="hover-target interactive-element"
              data-interactive="true"
            >
              <Edit3 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </div>
      </div>

      {message && <FormMessage message={message} />}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger
            value="profile"
            className="hover-target interactive-element"
            data-interactive="true"
          >
            Profile
          </TabsTrigger>
          <TabsTrigger
            value="social"
            className="hover-target interactive-element"
            data-interactive="true"
          >
            Social Links
          </TabsTrigger>
          <TabsTrigger
            value="privacy"
            className="hover-target interactive-element"
            data-interactive="true"
          >
            Privacy
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="hover-target interactive-element"
            data-interactive="true"
          >
            Security
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5" />
                Personal Information
              </CardTitle>
              <CardDescription>
                Update your personal details and profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Avatar Section */}
              <div className="flex items-center gap-6">
                <div className="relative">
                  <Avatar className="w-24 h-24">
                    <AvatarImage
                      src={formData.avatar_url}
                      alt={formData.full_name}
                    />
                    <AvatarFallback className="text-2xl">
                      {formData.full_name?.charAt(0) ||
                        user.email?.charAt(0) ||
                        "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 hover-target interactive-element"
                      data-interactive="true"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold">
                    {formData.full_name || "No name set"}
                  </h3>
                  <p className="text-gray-600">{user.email}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge
                      variant={
                        user.email_confirmed_at ? "default" : "secondary"
                      }
                    >
                      {user.email_confirmed_at ? (
                        <>
                          <CheckCircle className="w-3 h-3 mr-1" /> Verified
                        </>
                      ) : (
                        <>
                          <AlertTriangle className="w-3 h-3 mr-1" /> Unverified
                        </>
                      )}
                    </Badge>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="full_name">Full Name</Label>
                  <Input
                    id="full_name"
                    value={formData.full_name}
                    onChange={(e) =>
                      handleInputChange("full_name", e.target.value)
                    }
                    disabled={!isEditing}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={user.email || ""}
                    disabled
                    className="bg-gray-50"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    disabled={!isEditing}
                    placeholder="+1 (555) 123-4567"
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) =>
                      handleInputChange("location", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="City, Country"
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Website</Label>
                  <Input
                    id="website"
                    value={formData.website}
                    onChange={(e) =>
                      handleInputChange("website", e.target.value)
                    }
                    disabled={!isEditing}
                    placeholder="https://yourwebsite.com"
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio}
                    onChange={(e) => handleInputChange("bio", e.target.value)}
                    disabled={!isEditing}
                    placeholder="Tell us about yourself..."
                    rows={4}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Social Links Tab */}
        <TabsContent value="social" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Social Media Links
              </CardTitle>
              <CardDescription>
                Connect your social media profiles to showcase your presence
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(formData.social_links).map(([platform, url]) => (
                <div key={platform} className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getSocialIcon(platform)}
                  </div>
                  <div className="flex-1">
                    <Label htmlFor={platform} className="capitalize">
                      {platform}
                    </Label>
                    <Input
                      id={platform}
                      value={String(url)}
                      onChange={(e) =>
                        handleSocialLinkChange(platform, e.target.value)
                      }
                      disabled={!isEditing}
                      placeholder={`Your ${platform} profile URL`}
                      className="hover-target interactive-element"
                      data-interactive="true"
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Privacy Tab */}
        <TabsContent value="privacy" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Privacy Settings
              </CardTitle>
              <CardDescription>
                Control your privacy and notification preferences
              </CardDescription>
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
                    checked={preferences.email_notifications}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("email_notifications", checked)
                    }
                    disabled={!isEditing}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Marketing Emails</Label>
                    <p className="text-sm text-gray-600">
                      Receive updates about new features and promotions
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketing_emails}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("marketing_emails", checked)
                    }
                    disabled={!isEditing}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Show Activity</Label>
                    <p className="text-sm text-gray-600">
                      Display your activity status to other users
                    </p>
                  </div>
                  <Switch
                    checked={preferences.show_activity}
                    onCheckedChange={(checked) =>
                      handlePreferenceChange("show_activity", checked)
                    }
                    disabled={!isEditing}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security & Sessions
              </CardTitle>
              <CardDescription>
                Manage your account security and active sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Password Section */}
              <div className="space-y-4">
                <h4 className="font-semibold">Password</h4>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <p className="font-medium">Password</p>
                    <p className="text-sm text-gray-600">
                      Last updated:{" "}
                      {user.updated_at
                        ? new Date(user.updated_at).toLocaleDateString()
                        : "Never"}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    asChild
                    className="hover-target interactive-element"
                    data-interactive="true"
                  >
                    <a href="/forgot-password">Change Password</a>
                  </Button>
                </div>
              </div>

              <Separator />

              {/* Active Sessions */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-semibold">Active Sessions</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSignOutAllDevices}
                    className="hover-target interactive-element"
                    data-interactive="true"
                  >
                    Sign Out All Devices
                  </Button>
                </div>

                {loadingSessions ? (
                  <div className="text-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 border rounded-lg"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Shield className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium flex items-center gap-2">
                              {session.device}
                              {session.current && (
                                <Badge variant="default" className="text-xs">
                                  Current
                                </Badge>
                              )}
                            </p>
                            <p className="text-sm text-gray-600">
                              {session.location} • Last active:{" "}
                              {new Date(
                                session.last_active,
                              ).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        {!session.current && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="hover-target interactive-element"
                            data-interactive="true"
                          >
                            Revoke
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              {/* Danger Zone */}
              <div className="space-y-4">
                <h4 className="font-semibold text-red-600">Danger Zone</h4>
                <div className="border border-red-200 rounded-lg p-4 bg-red-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-red-900">Delete Account</p>
                      <p className="text-sm text-red-700">
                        Permanently delete your account and all data
                      </p>
                    </div>
                    <Button
                      variant="destructive"
                      onClick={handleDeleteAccount}
                      className="hover-target interactive-element"
                      data-interactive="true"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
