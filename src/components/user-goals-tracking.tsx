"use client";

import { useState, useEffect } from "react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import {
  Target,
  Plus,
  Trophy,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Eye,
  Heart,
  Share2,
  Star,
  Zap,
  CheckCircle,
  Clock,
  Edit,
  Trash2,
  Flag,
  Award,
  Crown,
  Flame,
  Rocket,
  BarChart3,
  LineChart,
} from "lucide-react";
import { createClient } from "../../supabase/client";
import { UserGoal } from "@/utils/auth";

interface UserGoalsTrackingProps {
  userId: string;
  userProfile?: any;
  hasActiveSubscription: boolean;
}

interface Goal extends UserGoal {
  progress: number;
  daysLeft: number;
  onTrack: boolean;
  milestones: Milestone[];
}

interface Milestone {
  id: string;
  title: string;
  target: number;
  achieved: boolean;
  achievedAt?: string;
  reward?: string;
}

interface GoalTemplate {
  id: string;
  title: string;
  description: string;
  type: string;
  suggestedTarget: number;
  timeframe: number; // days
  icon: React.ReactNode;
  difficulty: "beginner" | "intermediate" | "advanced";
  category: string;
}

const goalTemplates: GoalTemplate[] = [
  {
    id: "followers",
    title: "Gain Followers",
    description: "Grow your follower count across all platforms",
    type: "followers",
    suggestedTarget: 1000,
    timeframe: 30,
    icon: <Users className="w-5 h-5" />,
    difficulty: "beginner",
    category: "growth",
  },
  {
    id: "engagement",
    title: "Boost Engagement Rate",
    description: "Increase your average engagement rate",
    type: "engagement_rate",
    suggestedTarget: 5,
    timeframe: 30,
    icon: <Heart className="w-5 h-5" />,
    difficulty: "intermediate",
    category: "engagement",
  },
  {
    id: "revenue",
    title: "Monthly Revenue",
    description: "Reach your monthly revenue target",
    type: "revenue",
    suggestedTarget: 1000,
    timeframe: 30,
    icon: <DollarSign className="w-5 h-5" />,
    difficulty: "advanced",
    category: "monetization",
  },
  {
    id: "posts",
    title: "Content Consistency",
    description: "Post consistently for a set period",
    type: "posts_count",
    suggestedTarget: 30,
    timeframe: 30,
    icon: <Calendar className="w-5 h-5" />,
    difficulty: "beginner",
    category: "consistency",
  },
  {
    id: "views",
    title: "Total Views",
    description: "Reach a specific number of total views",
    type: "total_views",
    suggestedTarget: 100000,
    timeframe: 60,
    icon: <Eye className="w-5 h-5" />,
    difficulty: "intermediate",
    category: "reach",
  },
  {
    id: "viral",
    title: "Viral Content",
    description: "Create content that reaches viral status",
    type: "viral_posts",
    suggestedTarget: 1,
    timeframe: 90,
    icon: <Zap className="w-5 h-5" />,
    difficulty: "advanced",
    category: "viral",
  },
];

export default function UserGoalsTracking({
  userId,
  userProfile,
  hasActiveSubscription,
}: UserGoalsTrackingProps) {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<GoalTemplate | null>(
    null,
  );
  const [customGoal, setCustomGoal] = useState({
    title: "",
    type: "",
    target: "",
    timeframe: "30",
    description: "",
  });
  const [achievements, setAchievements] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    loadGoals();
    loadAchievements();
  }, []);

  const loadGoals = async () => {
    try {
      const { data, error } = await supabase
        .from("user_goals")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      // Transform goals and calculate progress
      const transformedGoals: Goal[] = (data || []).map((goal: UserGoal) => {
        const targetDate = goal.target_date ? new Date(goal.target_date) : null;
        const now = new Date();
        const daysLeft = targetDate
          ? Math.ceil(
              (targetDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24),
            )
          : 0;
        const progress =
          goal.target_value > 0
            ? Math.min((goal.current_value / goal.target_value) * 100, 100)
            : 0;
        const onTrack =
          progress >= (targetDate ? (1 - daysLeft / 30) * 100 : 50); // Simple on-track calculation

        // Generate milestones
        const milestones: Milestone[] = [
          {
            id: "1",
            title: "25% Complete",
            target: goal.target_value * 0.25,
            achieved: goal.current_value >= goal.target_value * 0.25,
            achievedAt:
              goal.current_value >= goal.target_value * 0.25
                ? new Date().toISOString()
                : undefined,
          },
          {
            id: "2",
            title: "50% Complete",
            target: goal.target_value * 0.5,
            achieved: goal.current_value >= goal.target_value * 0.5,
            achievedAt:
              goal.current_value >= goal.target_value * 0.5
                ? new Date().toISOString()
                : undefined,
          },
          {
            id: "3",
            title: "75% Complete",
            target: goal.target_value * 0.75,
            achieved: goal.current_value >= goal.target_value * 0.75,
            achievedAt:
              goal.current_value >= goal.target_value * 0.75
                ? new Date().toISOString()
                : undefined,
          },
          {
            id: "4",
            title: "Goal Complete!",
            target: goal.target_value,
            achieved: goal.is_achieved,
            achievedAt: goal.is_achieved ? new Date().toISOString() : undefined,
            reward: "🎉 Achievement Unlocked!",
          },
        ];

        return {
          ...goal,
          progress,
          daysLeft,
          onTrack,
          milestones,
        };
      });

      setGoals(transformedGoals);
    } catch (error) {
      console.error("Error loading goals:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAchievements = async () => {
    try {
      // Mock achievements data
      const mockAchievements = [
        {
          id: "1",
          title: "First 100 Followers",
          description: "Reached your first 100 followers milestone",
          icon: "🎯",
          achievedAt: "2024-01-15",
          category: "growth",
        },
        {
          id: "2",
          title: "Consistent Creator",
          description: "Posted content for 7 days straight",
          icon: "📅",
          achievedAt: "2024-01-20",
          category: "consistency",
        },
        {
          id: "3",
          title: "Engagement Master",
          description: "Achieved 10% engagement rate",
          icon: "❤️",
          achievedAt: "2024-01-25",
          category: "engagement",
        },
      ];
      setAchievements(mockAchievements);
    } catch (error) {
      console.error("Error loading achievements:", error);
    }
  };

  const createGoal = async () => {
    try {
      const goalData = selectedTemplate
        ? {
            user_id: userId,
            goal_type: selectedTemplate.type,
            target_value: selectedTemplate.suggestedTarget,
            current_value: 0,
            target_date: new Date(
              Date.now() + selectedTemplate.timeframe * 24 * 60 * 60 * 1000,
            ).toISOString(),
            is_achieved: false,
          }
        : {
            user_id: userId,
            goal_type: customGoal.type,
            target_value: parseInt(customGoal.target),
            current_value: 0,
            target_date: new Date(
              Date.now() + parseInt(customGoal.timeframe) * 24 * 60 * 60 * 1000,
            ).toISOString(),
            is_achieved: false,
          };

      const { error } = await supabase.from("user_goals").insert(goalData);

      if (error) throw error;

      await loadGoals();
      setIsDialogOpen(false);
      setSelectedTemplate(null);
      setCustomGoal({
        title: "",
        type: "",
        target: "",
        timeframe: "30",
        description: "",
      });
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  };

  const updateGoalProgress = async (goalId: string, newValue: number) => {
    try {
      const { error } = await supabase
        .from("user_goals")
        .update({
          current_value: newValue,
          updated_at: new Date().toISOString(),
        })
        .eq("id", goalId);

      if (error) throw error;
      await loadGoals();
    } catch (error) {
      console.error("Error updating goal:", error);
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      const { error } = await supabase
        .from("user_goals")
        .delete()
        .eq("id", goalId);

      if (error) throw error;
      await loadGoals();
    } catch (error) {
      console.error("Error deleting goal:", error);
    }
  };

  const getGoalIcon = (goalType: string) => {
    const template = goalTemplates.find((t) => t.type === goalType);
    return template?.icon || <Target className="w-5 h-5" />;
  };

  const getProgressColor = (progress: number, onTrack: boolean) => {
    if (progress >= 100) return "bg-green-500";
    if (onTrack) return "bg-blue-500";
    return "bg-yellow-500";
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "text-green-600 bg-green-100";
      case "intermediate":
        return "text-yellow-600 bg-yellow-100";
      case "advanced":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-3 text-blue-600">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="font-medium">Loading your goals...</span>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-6 h-6 text-blue-600" />
            Goals & Achievements
          </h2>
          <p className="text-gray-600">
            Track your progress and celebrate your wins
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Set New Goal
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Set a New Goal</DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Goal Templates */}
              <div>
                <Label className="text-base font-medium mb-4 block">
                  Choose a Goal Template
                </Label>
                <div className="grid grid-cols-2 gap-3">
                  {goalTemplates.map((template) => (
                    <div
                      key={template.id}
                      onClick={() => setSelectedTemplate(template)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        selectedTemplate?.id === template.id
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div className="text-blue-600">{template.icon}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {template.title}
                          </h4>
                          <Badge
                            className={`${getDifficultyColor(template.difficulty)} border-0 text-xs`}
                          >
                            {template.difficulty}
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">
                        {template.description}
                      </p>
                      <div className="mt-2 text-xs text-gray-500">
                        Target: {template.suggestedTarget.toLocaleString()} in{" "}
                        {template.timeframe} days
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Goal Form */}
              <div className="border-t pt-6">
                <Label className="text-base font-medium mb-4 block">
                  Or Create a Custom Goal
                </Label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="goal-title">Goal Title</Label>
                    <Input
                      id="goal-title"
                      value={customGoal.title}
                      onChange={(e) =>
                        setCustomGoal((prev) => ({
                          ...prev,
                          title: e.target.value,
                        }))
                      }
                      placeholder="Enter goal title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-type">Goal Type</Label>
                    <Select
                      value={customGoal.type}
                      onValueChange={(value) =>
                        setCustomGoal((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="followers">Followers</SelectItem>
                        <SelectItem value="engagement_rate">
                          Engagement Rate
                        </SelectItem>
                        <SelectItem value="revenue">Revenue</SelectItem>
                        <SelectItem value="posts_count">Posts Count</SelectItem>
                        <SelectItem value="total_views">Total Views</SelectItem>
                        <SelectItem value="custom">Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="goal-target">Target Value</Label>
                    <Input
                      id="goal-target"
                      type="number"
                      value={customGoal.target}
                      onChange={(e) =>
                        setCustomGoal((prev) => ({
                          ...prev,
                          target: e.target.value,
                        }))
                      }
                      placeholder="Enter target value"
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal-timeframe">Timeframe (days)</Label>
                    <Select
                      value={customGoal.timeframe}
                      onValueChange={(value) =>
                        setCustomGoal((prev) => ({ ...prev, timeframe: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="7">1 Week</SelectItem>
                        <SelectItem value="30">1 Month</SelectItem>
                        <SelectItem value="60">2 Months</SelectItem>
                        <SelectItem value="90">3 Months</SelectItem>
                        <SelectItem value="180">6 Months</SelectItem>
                        <SelectItem value="365">1 Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={createGoal} className="flex-1">
                  Create Goal
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Goals Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Target className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Active Goals</h3>
              <p className="text-sm text-gray-600">Currently tracking</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {goals.filter((g) => !g.is_achieved).length}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-100 rounded-lg">
              <Trophy className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Completed</h3>
              <p className="text-sm text-gray-600">Goals achieved</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {goals.filter((g) => g.is_achieved).length}
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <Award className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Achievements</h3>
              <p className="text-sm text-gray-600">Milestones unlocked</p>
            </div>
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {achievements.length}
          </div>
        </Card>
      </div>

      {/* Active Goals */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Active Goals</h3>
        {goals.filter((g) => !g.is_achieved).length === 0 ? (
          <Card className="p-8 text-center">
            <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No active goals
            </h3>
            <p className="text-gray-600 mb-4">
              Set your first goal to start tracking your progress
            </p>
            <Button
              onClick={() => setIsDialogOpen(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Set Your First Goal
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {goals
              .filter((g) => !g.is_achieved)
              .map((goal) => (
                <Card key={goal.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="text-blue-600">
                        {getGoalIcon(goal.goal_type)}
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">
                          {goal.goal_type
                            .replace("_", " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>
                            {goal.current_value.toLocaleString()} /{" "}
                            {goal.target_value.toLocaleString()}
                          </span>
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {goal.daysLeft > 0
                              ? `${goal.daysLeft} days left`
                              : "Overdue"}
                          </span>
                          <Badge
                            className={`${goal.onTrack ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"} border-0`}
                          >
                            {goal.onTrack ? "On Track" : "Behind"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteGoal(goal.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {goal.progress.toFixed(1)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${getProgressColor(goal.progress, goal.onTrack)}`}
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="grid grid-cols-4 gap-2">
                    {goal.milestones.map((milestone, index) => (
                      <div
                        key={milestone.id}
                        className={`text-center p-2 rounded-lg border ${
                          milestone.achieved
                            ? "bg-green-50 border-green-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-6 h-6 mx-auto mb-1 rounded-full flex items-center justify-center ${
                            milestone.achieved ? "bg-green-500" : "bg-gray-300"
                          }`}
                        >
                          {milestone.achieved ? (
                            <CheckCircle className="w-4 h-4 text-white" />
                          ) : (
                            <span className="text-xs text-white font-bold">
                              {index + 1}
                            </span>
                          )}
                        </div>
                        <div className="text-xs font-medium text-gray-700">
                          {milestone.title}
                        </div>
                        {milestone.reward && milestone.achieved && (
                          <div className="text-xs text-green-600 mt-1">
                            {milestone.reward}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
          </div>
        )}
      </div>

      {/* Recent Achievements */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">
          Recent Achievements
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {achievements.slice(0, 3).map((achievement) => (
            <Card
              key={achievement.id}
              className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200"
            >
              <div className="flex items-center gap-3">
                <div className="text-2xl">{achievement.icon}</div>
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {achievement.title}
                  </h4>
                  <p className="text-sm text-gray-600">
                    {achievement.description}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    Achieved on{" "}
                    {new Date(achievement.achievedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Completed Goals */}
      {goals.filter((g) => g.is_achieved).length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Completed Goals
          </h3>
          <div className="grid gap-4">
            {goals
              .filter((g) => g.is_achieved)
              .map((goal) => (
                <Card
                  key={goal.id}
                  className="p-4 bg-green-50 border-green-200"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-green-500 rounded-full">
                      <Trophy className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {goal.goal_type
                          .replace("_", " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase())}
                      </h4>
                      <p className="text-sm text-gray-600">
                        Achieved {goal.target_value.toLocaleString()}{" "}
                        {goal.goal_type.replace("_", " ")}
                      </p>
                    </div>
                    <div className="ml-auto">
                      <Badge className="bg-green-100 text-green-700 border-0">
                        ✅ Completed
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
