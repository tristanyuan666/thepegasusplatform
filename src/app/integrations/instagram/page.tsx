"use client";

import { useState, useEffect } from "react";
import { createClient } from "@supabase/supabase-js";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import { Instagram, ArrowRight, Camera, Users, BarChart3, Plus, Settings, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function InstagramIntegrationPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [accountData, setAccountData] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadInstagramData();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.error("Error checking user:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadInstagramData = async () => {
    if (!user) return;
    
    try {
      const mockAccountData = {
        username: "@creative_creator",
        followers: 15420,
        following: 892,
        posts: 234,
        profile_picture: "https://via.placeholder.com/150",
        bio: "Digital creator sharing lifestyle & creativity ✨",
        verified: true
      };
      
      setAccountData(mockAccountData);
      setIsConnected(true);
    } catch (error) {
      console.error("Error loading Instagram data:", error);
    }
  };

  const connectInstagram = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 2000));
      setIsConnected(true);
      loadInstagramData();
    } catch (error) {
      console.error("Error connecting Instagram:", error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Instagram integration...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access Instagram integration.</p>
          <Button onClick={() => window.location.href = "/auth/signin"}>
            Sign In
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navbar />

      <section className="py-12 bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center">
                <Instagram className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Instagram Integration
                </h1>
                <p className="text-gray-600">
                  Manage your Instagram content and analytics
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isConnected ? (
                <>
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    Connected
                  </Badge>
                  <Button variant="outline">
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Button>
                </>
              ) : (
                <Button onClick={connectInstagram}>
                  <Plus className="w-4 h-4 mr-2" />
                  Connect Instagram
                </Button>
              )}
            </div>
          </div>

          {isConnected && accountData && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Followers</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.followers.toLocaleString()}</p>
                    </div>
                    <Users className="w-8 h-8 text-purple-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Posts</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.posts}</p>
                    </div>
                    <Camera className="w-8 h-8 text-pink-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Following</p>
                      <p className="text-2xl font-bold text-gray-900">{accountData.following}</p>
                    </div>
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-2xl font-bold text-gray-900">9.2%</p>
                    </div>
                    <BarChart3 className="w-8 h-8 text-green-600" />
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </section>

      {isConnected ? (
        <section className="py-8">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Instagram className="w-5 h-5 text-purple-600" />
                    Account Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {accountData && (
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={accountData.profile_picture} 
                          alt="Profile" 
                          className="w-16 h-16 rounded-full"
                        />
                        <div>
                          <h3 className="font-semibold text-lg">{accountData.username}</h3>
                          <p className="text-gray-600">{accountData.bio}</p>
                          {accountData.verified && (
                            <Badge variant="secondary" className="bg-blue-100 text-blue-800 mt-2">
                              Verified
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Plus className="w-5 h-5 text-green-600" />
                    Quick Actions
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <Plus className="w-4 h-4 mr-2" />
                      Create New Post
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Camera className="w-4 h-4 mr-2" />
                      Schedule Content
                    </Button>
                    <Button variant="outline" className="w-full">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      View Analytics
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Account Settings
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      ) : (
        <section className="py-24">
          <div className="container mx-auto px-6 text-center">
            <div className="max-w-md mx-auto">
              <Instagram className="w-16 h-16 text-purple-600 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Connect Your Instagram Account
              </h2>
              <p className="text-gray-600 mb-8">
                Connect your Instagram account to start managing your content, scheduling posts, and tracking analytics.
              </p>
              <Button 
                className="bg-gradient-to-r from-purple-500 to-pink-500"
                onClick={connectInstagram}
              >
                <Instagram className="w-4 h-4 mr-2" />
                Connect Instagram
              </Button>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
