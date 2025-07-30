"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Target,
  TrendingUp,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Brain,
  AlertCircle,
  CheckCircle,
  Loader2,
  User,
  UserCheck,
  UserPlus,
  UserX,
  Star,
  Sparkles,
  BarChart3,
  Lightbulb,
  Target as TargetIcon,
  Clock,
  Calendar,
  Hash,
  Zap,
  Award,
  Trophy,
  Crown,
  Gem,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PersonaBuilderProps {
  user: any;
  userProfile: any;
  hasFeatureAccess: (feature: string) => boolean;
}

interface Persona {
  id: string;
  name: string;
  age_range: string;
  gender: string;
  interests: string[];
  pain_points: string[];
  goals: string[];
  platform_preferences: string[];
  content_preferences: string[];
  engagement_style: string;
  buying_behavior: string;
  income_level: string;
  location: string;
  occupation: string;
  created_at: string;
  updated_at: string;
}

interface PersonaTemplate {
  id: string;
  name: string;
  description: string;
  niche: string;
  template: {
    age_range: string;
    interests: string[];
    pain_points: string[];
  goals: string[];
    platform_preferences: string[];
    content_preferences: string[];
    engagement_style: string;
    buying_behavior: string;
    income_level: string;
    occupation: string;
  };
}

export default function PersonaBuilder({
  user,
  userProfile,
  hasFeatureAccess,
}: PersonaBuilderProps) {
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [personaTemplates, setPersonaTemplates] = useState<PersonaTemplate[]>([]);
  const [currentPersona, setCurrentPersona] = useState<Partial<Persona>>({});
  const [isCreating, setIsCreating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [completionProgress, setCompletionProgress] = useState(0);
  
  const supabase = createClient();

  useEffect(() => {
    loadPersonas();
    loadPersonaTemplates();
  }, [user?.id]);

  useEffect(() => {
    calculateCompletionProgress();
  }, [currentPersona]);

  const loadPersonas = async () => {
    if (!user?.id) return;
    
    try {
      const { data, error } = await supabase
        .from("personas")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setPersonas(data || []);
    } catch (error) {
      console.error("Error loading personas:", error);
      setError("Failed to load personas");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPersonaTemplates = async () => {
    // Generate persona templates based on user's niche
    const templates: PersonaTemplate[] = [
      {
        id: "fitness-enthusiast",
        name: "Fitness Enthusiast",
        description: "Active individuals focused on health and wellness",
        niche: "fitness",
        template: {
          age_range: "18-35",
          interests: ["workout", "nutrition", "health", "fitness", "wellness"],
          pain_points: ["lack of motivation", "time constraints", "plateauing progress"],
          goals: ["build muscle", "lose weight", "improve fitness", "maintain health"],
          platform_preferences: ["instagram", "youtube", "tiktok"],
          content_preferences: ["workout videos", "nutrition tips", "transformation stories"],
          engagement_style: "motivational",
          buying_behavior: "value-conscious",
          income_level: "middle",
          occupation: "various",
        }
      },
      {
        id: "business-professional",
        name: "Business Professional",
        description: "Career-focused individuals seeking growth and success",
        niche: "business",
        template: {
          age_range: "25-45",
          interests: ["entrepreneurship", "career growth", "business", "leadership"],
          pain_points: ["work-life balance", "career stagnation", "stress management"],
          goals: ["career advancement", "skill development", "work-life balance"],
          platform_preferences: ["linkedin", "twitter", "youtube"],
          content_preferences: ["business tips", "leadership advice", "career insights"],
          engagement_style: "professional",
          buying_behavior: "quality-focused",
          income_level: "upper-middle",
          occupation: "professional",
        }
      },
      {
        id: "lifestyle-creator",
        name: "Lifestyle Creator",
        description: "Creative individuals sharing daily life and inspiration",
        niche: "lifestyle",
        template: {
          age_range: "18-30",
          interests: ["lifestyle", "creativity", "fashion", "beauty", "travel"],
          pain_points: ["comparison culture", "authenticity", "creative blocks"],
          goals: ["build community", "express creativity", "inspire others"],
          platform_preferences: ["instagram", "tiktok", "pinterest"],
          content_preferences: ["lifestyle content", "behind-the-scenes", "inspiration"],
          engagement_style: "authentic",
          buying_behavior: "trend-conscious",
          income_level: "middle",
          occupation: "creative",
        }
      },
      {
        id: "entertainment-seeker",
        name: "Entertainment Seeker",
        description: "People looking for fun and engaging content",
        niche: "entertainment",
        template: {
          age_range: "16-35",
          interests: ["entertainment", "comedy", "viral content", "trends"],
          pain_points: ["boredom", "stress relief", "escapism"],
          goals: ["entertainment", "stress relief", "connection"],
          platform_preferences: ["tiktok", "instagram", "youtube"],
          content_preferences: ["comedy", "viral trends", "entertainment"],
          engagement_style: "entertaining",
          buying_behavior: "impulse",
          income_level: "various",
          occupation: "various",
        }
      },
      {
        id: "education-learner",
        name: "Education Learner",
        description: "Knowledge seekers and lifelong learners",
        niche: "education",
        template: {
          age_range: "18-50",
          interests: ["learning", "education", "knowledge", "self-improvement"],
          pain_points: ["information overload", "time management", "retention"],
          goals: ["skill development", "knowledge acquisition", "personal growth"],
          platform_preferences: ["youtube", "linkedin", "twitter"],
          content_preferences: ["educational content", "tutorials", "insights"],
          engagement_style: "educational",
          buying_behavior: "research-driven",
          income_level: "middle-upper",
          occupation: "student/professional",
        }
      }
    ];

    // Filter based on user's niche
    const userNiche = userProfile?.niche || "lifestyle";
    const filteredTemplates = templates.filter(template => template.niche === userNiche);
    setPersonaTemplates(filteredTemplates);
  };

  const calculateCompletionProgress = () => {
    const requiredFields = [
      'name', 'age_range', 'gender', 'interests', 'pain_points', 
      'goals', 'platform_preferences', 'content_preferences'
    ];
    
    const completedFields = requiredFields.filter(field => {
      const value = currentPersona[field as keyof Persona];
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value && value.toString().trim() !== '';
    });
    
    const progress = (completedFields.length / requiredFields.length) * 100;
    setCompletionProgress(Math.round(progress));
  };

  const handleCreatePersona = async () => {
    if (!currentPersona.name?.trim()) {
      setError("Please enter a persona name");
      return;
    }

    if (completionProgress < 50) {
      setError("Please complete at least 50% of the persona details");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const { data, error } = await supabase
        .from("personas")
        .insert({
          user_id: user.id,
          ...currentPersona,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) throw error;

      // Add to local state
      setPersonas(prev => [data, ...prev]);
      
      // Clear form
      setCurrentPersona({});
      setSelectedTemplate(null);
      
      setSuccess("Persona created successfully!");
      setTimeout(() => setSuccess(null), 3000);
      
    } catch (error) {
      console.error("Error creating persona:", error);
      setError("Failed to create persona. Please try again.");
    } finally {
      setIsCreating(false);
    }
  };

  const handleUseTemplate = (template: PersonaTemplate) => {
    setCurrentPersona({
      name: template.name,
      ...template.template,
    });
    setSelectedTemplate(template.id);
    setActiveTab("create");
  };

  const handleDeletePersona = async (personaId: string) => {
    try {
      const { error } = await supabase
        .from("personas")
        .delete()
        .eq("id", personaId);

      if (error) throw error;
      
      // Remove from local state
      setPersonas(prev => prev.filter(persona => persona.id !== personaId));
    } catch (error) {
      console.error("Error deleting persona:", error);
      setError("Failed to delete persona");
    }
  };

  const addArrayItem = (field: keyof Persona, value: string) => {
    if (!value.trim()) return;
    
    setCurrentPersona(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[] || []), value.trim()]
    }));
  };

  const removeArrayItem = (field: keyof Persona, index: number) => {
    setCurrentPersona(prev => ({
      ...prev,
      [field]: (prev[field] as string[] || []).filter((_, i) => i !== index)
    }));
  };

  if (!hasFeatureAccess("persona_builder")) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Persona Builder Unavailable</h3>
            <p className="text-gray-600 mb-4">
              Upgrade your plan to access advanced persona building tools.
            </p>
            <Button onClick={() => window.location.href = "/pricing"}>
              Upgrade Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (isLoading) {
        return (
          <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">Persona Builder</h2>
          <div className="flex items-center gap-2">
            <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
            <span className="text-sm text-gray-600">Loading...</span>
            </div>
                    </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                  </div>
              </CardContent>
                </Card>
              ))}
            </div>
          </div>
        );
  }

        return (
          <div className="space-y-6">
      {/* Header */}
                  <div className="flex items-center justify-between">
                    <div>
          <h2 className="text-2xl font-bold text-gray-900">Persona Builder</h2>
          <p className="text-gray-600">Create detailed audience personas for better targeting</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="text-blue-600 border-blue-600">
            <Users className="w-3 h-3 mr-1" />
            AI-Powered
          </Badge>
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
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="create">Create</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="space-y-6">
          {/* Persona Creation Form */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="w-5 h-5 text-blue-600" />
                  Create New Persona
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Progress value={completionProgress} className="w-24 h-2" />
                  <span className="text-sm text-gray-600">{completionProgress}% complete</span>
                </div>
                    </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Basic Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="name">Persona Name</Label>
                    <Input
                      id="name"
                      value={currentPersona.name || ""}
                      onChange={(e) => setCurrentPersona(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., Fitness Enthusiast Sarah"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="age_range">Age Range</Label>
                    <Select 
                      value={currentPersona.age_range || ""} 
                      onValueChange={(value) => setCurrentPersona(prev => ({ ...prev, age_range: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select age range" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="16-25">16-25</SelectItem>
                        <SelectItem value="18-35">18-35</SelectItem>
                        <SelectItem value="25-45">25-45</SelectItem>
                        <SelectItem value="35-55">35-55</SelectItem>
                        <SelectItem value="45+">45+</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Select 
                      value={currentPersona.gender || ""} 
                      onValueChange={(value) => setCurrentPersona(prev => ({ ...prev, gender: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="non-binary">Non-binary</SelectItem>
                        <SelectItem value="all">All</SelectItem>
                      </SelectContent>
                    </Select>
            </div>
          </div>
            </div>

              {/* Interests */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Interests & Hobbies</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add interest..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('interests', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('interests', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(currentPersona.interests || []).map((interest, index) => (
                      <Badge key={index} variant="secondary" className="gap-1">
                        {interest}
                        <button
                          onClick={() => removeArrayItem('interests', index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>

              {/* Pain Points */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Pain Points & Challenges</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add pain point..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('pain_points', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('pain_points', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(currentPersona.pain_points || []).map((point, index) => (
                      <Badge key={index} variant="destructive" className="gap-1">
                        {point}
                        <button
                          onClick={() => removeArrayItem('pain_points', index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
              ))}
            </div>
          </div>
            </div>

              {/* Goals */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Goals & Aspirations</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add goal..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('goals', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('goals', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(currentPersona.goals || []).map((goal, index) => (
                      <Badge key={index} variant="default" className="gap-1">
                        {goal}
                        <button
                          onClick={() => removeArrayItem('goals', index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
              ))}
            </div>
          </div>
            </div>

              {/* Platform Preferences */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Platform Preferences</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {["instagram", "tiktok", "youtube", "twitter", "linkedin", "pinterest", "facebook", "snapchat"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={platform}
                        checked={(currentPersona.platform_preferences || []).includes(platform)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            addArrayItem('platform_preferences', platform);
                          } else {
                            const index = (currentPersona.platform_preferences || []).indexOf(platform);
                            if (index > -1) removeArrayItem('platform_preferences', index);
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={platform} className="text-sm capitalize">{platform}</Label>
                    </div>
                  ))}
            </div>
          </div>

              {/* Content Preferences */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Content Preferences</h4>
                <div className="space-y-2">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Add content preference..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addArrayItem('content_preferences', e.currentTarget.value);
                          e.currentTarget.value = '';
                        }
                      }}
                    />
                    <Button 
                      variant="outline" 
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        addArrayItem('content_preferences', input.value);
                        input.value = '';
                      }}
                    >
                      Add
                    </Button>
        </div>
                  <div className="flex flex-wrap gap-2">
                    {(currentPersona.content_preferences || []).map((pref, index) => (
                      <Badge key={index} variant="outline" className="gap-1">
                        {pref}
                        <button
                          onClick={() => removeArrayItem('content_preferences', index)}
                          className="ml-1 hover:text-red-600"
                        >
                          ×
                        </button>
                      </Badge>
          ))}
        </div>
                </div>
              </div>

              {/* Engagement Style */}
              <div className="space-y-4">
                <h4 className="font-semibold text-gray-900">Engagement Style</h4>
                <Select 
                  value={currentPersona.engagement_style || ""} 
                  onValueChange={(value) => setCurrentPersona(prev => ({ ...prev, engagement_style: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select engagement style" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="motivational">Motivational</SelectItem>
                    <SelectItem value="educational">Educational</SelectItem>
                    <SelectItem value="entertaining">Entertaining</SelectItem>
                    <SelectItem value="authentic">Authentic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="casual">Casual</SelectItem>
                  </SelectContent>
                </Select>
      </div>

              <Button 
                onClick={handleCreatePersona}
                disabled={isCreating || completionProgress < 50}
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isCreating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Creating Persona...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-4 h-4 mr-2" />
                    Create Persona
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="templates" className="space-y-6">
          {/* Persona Templates */}
          <Card>
            <CardHeader>
              <CardTitle>Persona Templates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {personaTemplates.map((template) => (
                  <div key={template.id} className="border border-gray-200 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline" className="text-xs">
                        {template.niche}
                      </Badge>
                    </div>
        <Button
          variant="outline"
                      size="sm"
                      onClick={() => handleUseTemplate(template)}
        >
                      Use Template
        </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="personas" className="space-y-6">
          {/* Personas List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Personas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {personas.map((persona) => (
                  <div key={persona.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-semibold text-gray-900">{persona.name}</h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {persona.age_range}
                          </Badge>
                          <Badge variant="outline" className="text-xs capitalize">
                            {persona.gender}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {persona.platform_preferences?.length || 0} platforms
                          </Badge>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeletePersona(persona.id)}
                        >
                          <UserX className="w-4 h-4" />
        </Button>
      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {persona.interests && persona.interests.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Interests</h5>
                          <div className="flex flex-wrap gap-1">
                            {persona.interests.slice(0, 5).map((interest, index) => (
                              <Badge key={index} variant="secondary" className="text-xs">
                                {interest}
                              </Badge>
                            ))}
                            {persona.interests.length > 5 && (
                              <span className="text-xs text-gray-500">
                                +{persona.interests.length - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                      
                      {persona.goals && persona.goals.length > 0 && (
                        <div>
                          <h5 className="text-sm font-medium text-gray-700 mb-1">Goals</h5>
                          <div className="flex flex-wrap gap-1">
                            {persona.goals.slice(0, 3).map((goal, index) => (
                              <Badge key={index} variant="default" className="text-xs">
                                {goal}
                              </Badge>
                            ))}
                            {persona.goals.length > 3 && (
                              <span className="text-xs text-gray-500">
                                +{persona.goals.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-3">
                      <Clock className="w-3 h-3" />
                      <span>Created {new Date(persona.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
