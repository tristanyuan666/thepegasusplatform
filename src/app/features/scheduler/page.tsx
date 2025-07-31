"use client";

import { Calendar, Sparkles, Zap, Target, TrendingUp, Users, BarChart3, Brain, Globe, Camera, Video, Play, FileText, CheckCircle, Star, Clock, Activity, PieChart } from "lucide-react";
import PremiumFeatureIntro from "@/components/premium-feature-intro";

export default function SchedulerPage() {
  return (
    <PremiumFeatureIntro
      featureName="Content Scheduler"
      featureDescription="Schedule and automate your social media content across all platforms with AI-powered optimization. Post at the perfect times, maintain consistency, and grow your audience while you focus on creating amazing content."
      requiredPlan="creator"
      icon={<Calendar className="w-6 h-6 text-white" />}
      features={[
        {
          title: "AI-Optimized Scheduling",
          description: "Automatically schedule posts at the best times when your audience is most active",
          icon: <Brain className="w-8 h-8 text-blue-600" />
        },
        {
          title: "Multi-Platform Publishing",
          description: "Schedule content across Instagram, TikTok, YouTube, X, LinkedIn, and more",
          icon: <Globe className="w-8 h-8 text-purple-600" />
        },
        {
          title: "Content Calendar",
          description: "Visual calendar interface to plan and organize your content strategy",
          icon: <Calendar className="w-8 h-8 text-green-600" />
        },
        {
          title: "Bulk Scheduling",
          description: "Schedule weeks or months of content in advance with bulk upload features",
          icon: <Clock className="w-8 h-8 text-orange-600" />
        },
        {
          title: "Performance Tracking",
          description: "Track how scheduled posts perform and optimize your timing strategy",
          icon: <BarChart3 className="w-8 h-8 text-indigo-600" />
        },
        {
          title: "Auto-Reposting",
          description: "Automatically repost your best-performing content to maximize reach",
          icon: <Zap className="w-8 h-8 text-pink-600" />
        }
      ]}
      benefits={[
        {
          title: "Consistent Posting",
          description: "Maintain a consistent posting schedule that keeps your audience engaged",
          stat: "100%"
        },
        {
          title: "Time Savings",
          description: "Save hours every week by automating your content scheduling",
          stat: "8hrs/week"
        },
        {
          title: "Better Engagement",
          description: "Post at optimal times to maximize engagement and reach",
          stat: "45%"
        }
      ]}
    />
  );
}
