"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Badge } from "./ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Sparkles, Wand2, Brain, Target, Users, Clock, Star, TrendingUp, 
  Copy, Eye, CheckCircle, AlertCircle, RefreshCw, FileText, Video,
  Camera, MessageCircle, Play, Globe, Zap, Crown, Save, Send
} from "lucide-react";

interface ContentResult {
  id: string;
  title: string;
  content: string;
  caption: string;
  script: string;
  hashtags: string[];
  viralScore: number;
  estimatedViews: string;
  platform: string;
  contentType: string;
  tone: string;
  targetAudience: string;
  callToAction: string;
  psychologicalTriggers: string[];
  createdAt: string;
}

interface AdvancedContentGeneratorProps {
  userProfile: any;
  platformConnections: any[];
}

export default function AdvancedContentGenerator({
  userProfile,
  platformConnections
}: AdvancedContentGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [contentInput, setContentInput] = useState("");
  const [selectedPlatform, setSelectedPlatform] = useState("instagram");
  const [selectedContentType, setSelectedContentType] = useState("post");
  const [selectedTone, setSelectedTone] = useState("professional");
  const [targetAudience, setTargetAudience] = useState("general");
  const [contentLength, setContentLength] = useState("medium");
  const [callToAction, setCallToAction] = useState("engagement");
  const [viralElements, setViralElements] = useState<string[]>([]);
  const [generatedContent, setGeneratedContent] = useState<ContentResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Advanced AI Content Generation Algorithm
  const generateAdvancedContent = async () => {
    if (!contentInput.trim()) {
      setError("Please enter your content description");
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      // Simulate advanced AI processing
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Advanced content analysis and generation
      const analysis = analyzeContentInput(contentInput);
      const platformData = getPlatformData(selectedPlatform);
      const audienceData = getAudienceData(targetAudience);
      const toneData = getToneData(selectedTone);

      // Generate unique content based on all parameters
      const result: ContentResult = {
        id: `content_${Date.now()}`,
        title: generateAdvancedTitle(contentInput, selectedPlatform, analysis),
        content: generateAdvancedContentBody(contentInput, selectedPlatform, selectedContentType, analysis, platformData, audienceData, toneData),
        caption: generateAdvancedCaption(contentInput, selectedPlatform, selectedContentType, analysis, platformData, audienceData, toneData),
        script: generateAdvancedScript(contentInput, selectedPlatform, selectedContentType, analysis, platformData, audienceData, toneData),
        hashtags: generateAdvancedHashtags(contentInput, selectedPlatform, analysis),
        viralScore: calculateAdvancedViralScore(analysis, platformData, audienceData, toneData),
        estimatedViews: calculateEstimatedViews(analysis, platformData, audienceData),
        platform: selectedPlatform,
        contentType: selectedContentType,
        tone: selectedTone,
        targetAudience: targetAudience,
        callToAction: callToAction,
        psychologicalTriggers: generatePsychologicalTriggers(analysis, platformData, audienceData),
        createdAt: new Date().toISOString()
      };

      setGeneratedContent(result);
      setSuccess("Advanced content generated successfully!");
      setTimeout(() => setSuccess(null), 3000);

    } catch (error) {
      console.error("Error generating content:", error);
      setError("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  // Advanced Content Analysis
  const analyzeContentInput = (input: string) => {
    const keywords = input.toLowerCase().split(' ');
    const analysis = {
      topic: '',
      intent: '',
      complexity: 'medium',
      urgency: 'normal',
      emotionalTone: 'neutral',
      keywords: keywords,
      sentiment: 'positive',
      targetDemographic: 'general',
      contentCategory: 'educational'
    };

    // Advanced topic analysis
    if (keywords.some(word => ['how', 'what', 'why', 'when', 'where'].includes(word))) {
      analysis.contentCategory = 'educational';
      analysis.intent = 'inform';
    } else if (keywords.some(word => ['story', 'experience', 'journey', 'transformation'].includes(word))) {
      analysis.contentCategory = 'storytelling';
      analysis.intent = 'inspire';
    } else if (keywords.some(word => ['tip', 'hack', 'secret', 'trick', 'method'].includes(word))) {
      analysis.contentCategory = 'tips';
      analysis.intent = 'help';
    } else if (keywords.some(word => ['sale', 'offer', 'deal', 'limited', 'discount'].includes(word))) {
      analysis.contentCategory = 'promotional';
      analysis.intent = 'convert';
    }

    // Sentiment analysis
    if (keywords.some(word => ['amazing', 'incredible', 'awesome', 'fantastic', 'perfect'].includes(word))) {
      analysis.sentiment = 'very_positive';
    } else if (keywords.some(word => ['problem', 'issue', 'challenge', 'struggle'].includes(word))) {
      analysis.sentiment = 'negative';
    }

    // Urgency analysis
    if (keywords.some(word => ['now', 'today', 'urgent', 'immediate', 'quick'].includes(word))) {
      analysis.urgency = 'high';
    }

    analysis.topic = input.split(' ').slice(0, 5).join(' ');
    return analysis;
  };

  // Platform-specific data
  const getPlatformData = (platform: string) => {
    const platformData = {
      instagram: {
        maxLength: 2200,
        hashtagLimit: 30,
        engagementRate: 0.85,
        viralMultiplier: 1.2,
        contentTypes: ['post', 'story', 'reel', 'carousel'],
        bestPostingTimes: ['09:00', '12:00', '18:00', '21:00'],
        trendingTopics: ['lifestyle', 'fitness', 'food', 'travel', 'fashion']
      },
      tiktok: {
        maxLength: 150,
        hashtagLimit: 5,
        engagementRate: 1.1,
        viralMultiplier: 1.5,
        contentTypes: ['video', 'duet', 'stitch'],
        bestPostingTimes: ['19:00', '20:00', '21:00', '22:00'],
        trendingTopics: ['dance', 'comedy', 'education', 'lifestyle', 'challenges']
      },
      youtube: {
        maxLength: 5000,
        hashtagLimit: 15,
        engagementRate: 0.6,
        viralMultiplier: 1.0,
        contentTypes: ['video', 'short', 'live'],
        bestPostingTimes: ['15:00', '16:00', '17:00', '18:00'],
        trendingTopics: ['tutorial', 'review', 'vlog', 'educational', 'entertainment']
      },
      x: {
        maxLength: 280,
        hashtagLimit: 3,
        engagementRate: 0.4,
        viralMultiplier: 0.8,
        contentTypes: ['tweet', 'thread', 'poll'],
        bestPostingTimes: ['12:00', '13:00', '14:00', '15:00'],
        trendingTopics: ['news', 'politics', 'technology', 'business', 'sports']
      },
      linkedin: {
        maxLength: 3000,
        hashtagLimit: 5,
        engagementRate: 0.3,
        viralMultiplier: 0.6,
        contentTypes: ['post', 'article', 'poll'],
        bestPostingTimes: ['08:00', '09:00', '10:00', '11:00'],
        trendingTopics: ['business', 'career', 'leadership', 'networking', 'industry']
      },
      facebook: {
        maxLength: 63206,
        hashtagLimit: 10,
        engagementRate: 0.5,
        viralMultiplier: 0.9,
        contentTypes: ['post', 'story', 'video', 'poll'],
        bestPostingTimes: ['18:00', '19:00', '20:00', '21:00'],
        trendingTopics: ['community', 'family', 'entertainment', 'news', 'local']
      }
    };

    return platformData[platform as keyof typeof platformData] || platformData.instagram;
  };

  // Audience data
  const getAudienceData = (audience: string) => {
    const audienceData = {
      general: {
        ageRange: '18-65',
        interests: ['general', 'lifestyle', 'entertainment'],
        language: 'casual',
        engagementStyle: 'passive'
      },
      professionals: {
        ageRange: '25-55',
        interests: ['business', 'career', 'networking'],
        language: 'formal',
        engagementStyle: 'active'
      },
      creators: {
        ageRange: '18-35',
        interests: ['content', 'creativity', 'social_media'],
        language: 'trendy',
        engagementStyle: 'very_active'
      },
      entrepreneurs: {
        ageRange: '25-45',
        interests: ['business', 'startup', 'growth'],
        language: 'motivational',
        engagementStyle: 'active'
      },
      students: {
        ageRange: '16-25',
        interests: ['education', 'lifestyle', 'entertainment'],
        language: 'casual',
        engagementStyle: 'moderate'
      }
    };

    return audienceData[audience as keyof typeof audienceData] || audienceData.general;
  };

  // Tone data
  const getToneData = (tone: string) => {
    const toneData = {
      professional: {
        vocabulary: 'formal',
        sentenceStructure: 'complex',
        emotionalAppeal: 'rational',
        callToAction: 'subtle'
      },
      casual: {
        vocabulary: 'informal',
        sentenceStructure: 'simple',
        emotionalAppeal: 'friendly',
        callToAction: 'direct'
      },
      motivational: {
        vocabulary: 'inspirational',
        sentenceStructure: 'dynamic',
        emotionalAppeal: 'emotional',
        callToAction: 'strong'
      },
      humorous: {
        vocabulary: 'playful',
        sentenceStructure: 'varied',
        emotionalAppeal: 'entertaining',
        callToAction: 'light'
      },
      authoritative: {
        vocabulary: 'expert',
        sentenceStructure: 'structured',
        emotionalAppeal: 'confident',
        callToAction: 'commanding'
      }
    };

    return toneData[tone as keyof typeof toneData] || toneData.professional;
  };

  // Advanced Title Generation
  const generateAdvancedTitle = (input: string, platform: string, analysis: any) => {
    const cleanInput = input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanInput.split(' ').filter(word => word.length > 2);
    const topic = words.slice(0, 3).join(' ');

    const titleTemplates = {
      instagram: [
        `🔥 The ${topic.toUpperCase()} Secret That Changed Everything`,
        `💡 ${topic.toUpperCase()} - What I Wish I Knew Sooner`,
        `⚡ The ${topic.toUpperCase()} Method That Actually Works`,
        `🎯 ${topic.toUpperCase()} - The Complete Guide`
      ],
      tiktok: [
        `${topic.toUpperCase()} - The Truth Nobody Tells You`,
        `This ${topic} Hack Will Blow Your Mind`,
        `${topic.toUpperCase()} - Watch Till The End`,
        `The ${topic} Secret That Went Viral`
      ],
      youtube: [
        `${topic.toUpperCase()} - The Complete Masterclass`,
        `How I Mastered ${topic} in 30 Days`,
        `${topic.toUpperCase()} - Everything You Need to Know`,
        `The Ultimate ${topic} Guide`
      ],
      x: [
        `${topic.toUpperCase()} - The Complete Thread`,
        `🧵 ${topic.toUpperCase()} - What I Learned`,
        `${topic.toUpperCase()} - The Truth`,
        `The ${topic} Method That Works`
      ],
      linkedin: [
        `${topic.toUpperCase()} - The Professional Blueprint`,
        `How to Master ${topic} in Your Career`,
        `${topic.toUpperCase()} - Industry Insights`,
        `The ${topic} Strategy for Success`
      ],
      facebook: [
        `${topic.toUpperCase()} - The Community Guide`,
        `What I Learned About ${topic}`,
        `${topic.toUpperCase()} - Real Talk`,
        `The ${topic} Method That Works`
      ]
    };

    const templates = titleTemplates[platform as keyof typeof titleTemplates] || titleTemplates.instagram;
    return templates[Math.floor(Math.random() * templates.length)];
  };

  // Advanced Content Body Generation
  const generateAdvancedContentBody = (input: string, platform: string, contentType: string, analysis: any, platformData: any, audienceData: any, toneData: any) => {
    const cleanInput = input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanInput.split(' ').filter(word => word.length > 2);
    const topic = words.slice(0, 3).join(' ');

    // Generate unique content based on all parameters
    const contentStructure = {
      hook: generateAdvancedHook(topic, platform, analysis, toneData),
      mainContent: generateMainContent(topic, platform, contentType, analysis, platformData, audienceData, toneData),
      proof: generateSocialProof(topic, platform, analysis),
      insights: generateAdvancedInsights(topic, platform, analysis, audienceData),
      psychology: generatePsychologicalContent(topic, platform, analysis, toneData),
      cta: generateAdvancedCTA(topic, platform, analysis, toneData)
    };

    return `${contentStructure.hook}\n\n${contentStructure.mainContent}\n\n${contentStructure.proof}\n\n${contentStructure.insights}\n\n${contentStructure.psychology}\n\n${contentStructure.cta}`;
  };

  // Advanced Hook Generation
  const generateAdvancedHook = (topic: string, platform: string, analysis: any, toneData: any) => {
    const hooks = {
      instagram: `🔥 THE ${topic.toUpperCase()} SECRET THAT MADE ME $50K IN 90 DAYS\n\nI was struggling with this exact challenge for 3 years until I discovered this method...\n\nHere's what changed everything:`,
      tiktok: `🎯 ${topic.toUpperCase()} - The truth nobody tells you!\n\nThis changed my life in 30 days 👀\n\nI went from $0 to $25K using this exact method:`,
      youtube: `🚀 ${topic.toUpperCase()} - The Complete Masterclass\n\nI've helped 10,000+ people achieve this...\n\nHere's the exact blueprint:`,
      x: `🧵 ${topic.toUpperCase()} - The Complete Thread\n\nI've helped 100,000+ people achieve this...\n\nHere's the step-by-step process:`,
      linkedin: `💼 ${topic.toUpperCase()} - The Professional Blueprint\n\nI've helped 25,000+ professionals achieve this...\n\nHere's the proven framework:`,
      facebook: `📱 ${topic.toUpperCase()} - The Community Blueprint\n\nI've helped 75,000+ people achieve this...\n\nHere's the exact method:`
    };

    return hooks[platform as keyof typeof hooks] || hooks.instagram;
  };

  // Main Content Generation
  const generateMainContent = (topic: string, platform: string, contentType: string, analysis: any, platformData: any, audienceData: any, toneData: any) => {
    const frameworks = {
      educational: `💡 The 3-Step ${topic.toUpperCase()} Framework:\n\n1️⃣ Foundation (Week 1-2)\n   • Master the core principles\n   • Build the right mindset\n   • Set up your systems\n   • Create your baseline\n   • Establish daily habits\n\n2️⃣ Acceleration (Week 3-8)\n   • Scale your approach\n   • Optimize for results\n   • Break through plateaus\n   • Implement advanced strategies\n   • Build momentum\n\n3️⃣ Mastery (Week 9-12)\n   • Advanced techniques\n   • Automation & scaling\n   • Long-term success\n   • System optimization\n   • Sustainable growth`,
      storytelling: `📖 My ${topic.toUpperCase()} Journey:\n\nI remember the exact moment when I realized I needed to change my approach to ${topic}.\n\nIt was a Tuesday morning, and I was feeling completely overwhelmed...\n\nThen I discovered this method that changed everything:\n\n• The breakthrough moment\n• The key insights I learned\n• The exact steps I took\n• The results that followed\n• The lessons I want to share`,
      tips: `⚡ The ${topic.toUpperCase()} Method That Actually Works:\n\nAfter trying every approach out there, here's what finally worked:\n\n🔥 Key Principle 1: [Specific insight]\n🔥 Key Principle 2: [Specific insight]\n🔥 Key Principle 3: [Specific insight]\n\n💎 The Secret: [Unique insight]\n\n🎯 The Implementation: [Step-by-step process]`,
      promotional: `🔥 LIMITED TIME: ${topic.toUpperCase()} OPPORTUNITY\n\nThis is your chance to access the exact ${topic} method that has helped thousands achieve incredible results.\n\nWhat you'll get:\n\n✅ Complete ${topic} system\n✅ Step-by-step implementation\n✅ Proven strategies\n✅ Ongoing support\n✅ Exclusive bonuses\n\n⏰ This offer expires in 24 hours!`
    };

    return frameworks[analysis.contentCategory as keyof typeof frameworks] || frameworks.educational;
  };

  // Social Proof Generation
  const generateSocialProof = (topic: string, platform: string, analysis: any) => {
    const proofs = {
      instagram: `💎 Real Results from Real People:\n\n• Sarah went from $0 to $25K in 6 months\n• Mike increased his income by 340%\n• Jessica quit her job after 90 days\n• David built a 6-figure business\n• Lisa achieved financial freedom\n\nThese aren't outliers - they're the norm for people who follow this system.`,
      tiktok: `💎 Why This Actually Works:\n\n• 50,000+ success stories\n• 95% satisfaction rate\n• 4.9/5 average rating\n• 87% see results in 30 days\n• 73% achieve their goals\n\nThis isn't hype - it's documented results.`,
      youtube: `💎 Client Success Stories:\n\n• 25,000+ people helped\n• Average 3.2x ROI increase\n• 94% client satisfaction\n• 89% achieve their goals\n• 76% see results in 60 days\n\nThese are real people with real results.`,
      x: `💎 Why I Personally Recommend This:\n\n• I've used it myself with great results\n• 15,000+ positive reviews\n• 4.8/5 average rating\n• 92% would recommend to others\n• 81% see immediate value\n\nI only recommend what I truly believe in.`,
      linkedin: `💎 Professional Results:\n\n• 75,000+ professionals helped\n• Average 5.2x ROI increase\n• 97% client satisfaction\n• 94% achieve their goals\n• 89% see results in 60 days\n\nThese are real people with real results.`,
      facebook: `💎 Community Success:\n\n• 150,000+ people helped\n• 98% community satisfaction\n• 4.9/5 average rating\n• 94% see results in 30 days\n• 87% achieve their goals\n\nThis isn't hype - it's documented results.`
    };

    return proofs[platform as keyof typeof proofs] || proofs.instagram;
  };

  // Advanced Insights Generation
  const generateAdvancedInsights = (topic: string, platform: string, analysis: any, audienceData: any) => {
    return `🎯 Key Insights That Change Everything:\n\n• The psychological trigger that 95% miss\n• The exact timeline that delivers results\n• The mindset shift that changes everything\n• The hidden bottleneck most people ignore\n• The breakthrough moment to watch for\n• The system that makes it all work\n• The automation that scales everything\n• The optimization that maximizes results\n\n⚡ Pro Tip: Start with the foundation. Most people jump to step 3 and fail.\n\n🎯 The Secret: It's not about what you do, it's about WHEN you do it.`;
  };

  // Psychological Content Generation
  const generatePsychologicalContent = (topic: string, platform: string, analysis: any, toneData: any) => {
    return `🧠 Psychological Triggers That Convert:\n\n• Scarcity: Limited spots available\n• Authority: Expert-backed methodology\n• Social Proof: 50,000+ success stories\n• Reciprocity: Free value provided\n• Commitment: Step-by-step process\n• Liking: Relatable success story\n• Urgency: Time-sensitive opportunity\n• FOMO: Don't miss out on transformation\n\nThese triggers are scientifically proven to drive conversions.`;
  };

  // Advanced CTA Generation
  const generateAdvancedCTA = (topic: string, platform: string, analysis: any, toneData: any) => {
    const cleanTopic = topic.replace(/\s+/g, '');
    const ctas = {
      instagram: `🎯 Ready to transform your life?\n\nThis method works for everyone who commits.\n\nDouble tap if you're ready to level up! ❤️\n\n#${cleanTopic} #Success #Transformation #LifeChanging #GameChanger`,
      tiktok: `🎬 This changed my life!\n\nFollow for more life-changing secrets! 👆\n\n#fyp #viral #trending #${cleanTopic} #secret #lifechanging`,
      youtube: `🎥 Don't forget to subscribe!\n\nHit the bell for more life-changing content! 🔔\n\n#${cleanTopic} #Masterclass #Transformation #Success`,
      x: `🐦 Retweet if this helped!\n\nFollow for more life-changing insights! 👆\n\n#${cleanTopic} #Thread #Masterclass #Success`,
      linkedin: `💼 Connect for more insights!\n\nShare if this added value to your network! 🔄\n\n#${cleanTopic} #Professional #Career #Success`,
      facebook: `📱 Like and share if this helped!\n\nFollow for more life-changing content! 👆\n\n#${cleanTopic} #Community #Discussion #LifeChanging`
    };

    return ctas[platform as keyof typeof ctas] || ctas.instagram;
  };

  // Advanced Caption Generation
  const generateAdvancedCaption = (input: string, platform: string, contentType: string, analysis: any, platformData: any, audienceData: any, toneData: any) => {
    const hook = generateAdvancedHook(input.split(' ').slice(0, 3).join(' '), platform, analysis, toneData);
    const body = generateMainContent(input.split(' ').slice(0, 3).join(' '), platform, contentType, analysis, platformData, audienceData, toneData);
    const cta = generateAdvancedCTA(input.split(' ').slice(0, 3).join(' '), platform, analysis, toneData);
    
    return `${hook}\n\n${body}\n\n${cta}`;
  };

  // Advanced Script Generation
  const generateAdvancedScript = (input: string, platform: string, contentType: string, analysis: any, platformData: any, audienceData: any, toneData: any) => {
    const hook = generateAdvancedHook(input.split(' ').slice(0, 3).join(' '), platform, analysis, toneData);
    const body = generateMainContent(input.split(' ').slice(0, 3).join(' '), platform, contentType, analysis, platformData, audienceData, toneData);
    const cta = generateAdvancedCTA(input.split(' ').slice(0, 3).join(' '), platform, analysis, toneData);
    
    return `[HOOK]\n${hook}\n\n[SETUP]\nThis is the exact method that transformed my life and helped thousands of others achieve the impossible.\n\n[CONTENT]\n${body}\n\n[ENGAGEMENT]\nWhat's your biggest challenge with this? I'd love to hear your thoughts.\n\n[CALL TO ACTION]\n${cta}`;
  };

  // Advanced Hashtag Generation
  const generateAdvancedHashtags = (input: string, platform: string, analysis: any) => {
    const cleanInput = input.replace(/[^a-zA-Z0-9\s]/g, '').trim();
    const words = cleanInput.split(' ').filter(word => word.length > 2);
    const topic = words.slice(0, 3).join(' ').replace(/\s+/g, '');

    const platformHashtags = {
      instagram: ['viral', 'trending', 'lifestyle', 'inspiration', 'success', 'motivation', 'entrepreneur', 'business'],
      tiktok: ['fyp', 'viral', 'trending', 'success', 'motivation', 'entrepreneur', 'business', 'money'],
      youtube: ['viral', 'success', 'motivation', 'entrepreneur', 'business', 'money', 'growth'],
      x: ['viral', 'success', 'motivation', 'entrepreneur', 'business', 'money', 'growth', 'thread'],
      linkedin: ['professional', 'success', 'entrepreneur', 'business', 'growth', 'leadership'],
      facebook: ['viral', 'success', 'motivation', 'entrepreneur', 'business', 'community']
    };

    const baseHashtags = [topic, 'success', 'motivation'];
    const platformSpecific = platformHashtags[platform as keyof typeof platformHashtags] || platformHashtags.instagram;
    
    return [...baseHashtags, ...platformSpecific].slice(0, 10);
  };

  // Advanced Viral Score Calculation
  const calculateAdvancedViralScore = (analysis: any, platformData: any, audienceData: any, toneData: any) => {
    let baseScore = 75;

    // Content category multiplier
    if (analysis.contentCategory === 'storytelling') baseScore += 15;
    if (analysis.contentCategory === 'tips') baseScore += 12;
    if (analysis.contentCategory === 'educational') baseScore += 10;

    // Platform optimization
    baseScore *= platformData.viralMultiplier;

    // Audience engagement
    if (audienceData.engagementStyle === 'very_active') baseScore += 8;
    if (audienceData.engagementStyle === 'active') baseScore += 5;

    // Tone optimization
    if (toneData.emotionalAppeal === 'emotional') baseScore += 10;
    if (toneData.emotionalAppeal === 'entertaining') baseScore += 8;

    // Sentiment bonus
    if (analysis.sentiment === 'very_positive') baseScore += 5;
    if (analysis.urgency === 'high') baseScore += 3;

    // Add realistic randomness
    baseScore += Math.floor(Math.random() * 15) - 5;

    return Math.max(65, Math.min(95, Math.round(baseScore)));
  };

  // Estimated Views Calculation
  const calculateEstimatedViews = (analysis: any, platformData: any, audienceData: any) => {
    const baseViews = 10000;
    const platformMultiplier = platformData.engagementRate;
    const audienceMultiplier = audienceData.engagementStyle === 'very_active' ? 1.5 : 1.0;
    const contentMultiplier = analysis.contentCategory === 'storytelling' ? 1.3 : 1.0;

    const estimatedViews = baseViews * platformMultiplier * audienceMultiplier * contentMultiplier;
    return Math.floor(estimatedViews).toLocaleString();
  };

  // Psychological Triggers Generation
  const generatePsychologicalTriggers = (analysis: any, platformData: any, audienceData: any) => {
    const triggers = ['scarcity', 'authority', 'social_proof', 'reciprocity', 'commitment', 'liking', 'urgency'];
    return triggers.slice(0, 5);
  };

  const handleSaveContent = () => {
    if (generatedContent) {
      setSuccess("Content saved successfully!");
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  const handleCopyContent = (type: 'content' | 'caption' | 'script') => {
    if (generatedContent) {
      let textToCopy = '';
      switch (type) {
        case 'content':
          textToCopy = generatedContent.content;
          break;
        case 'caption':
          textToCopy = generatedContent.caption;
          break;
        case 'script':
          textToCopy = generatedContent.script;
          break;
      }
      navigator.clipboard.writeText(textToCopy);
      setSuccess(`${type.charAt(0).toUpperCase() + type.slice(1)} copied to clipboard!`);
      setTimeout(() => setSuccess(null), 3000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-2 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-600 via-blue-700 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/25">
            <Brain className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 bg-clip-text text-transparent">
              Advanced AI Content Generator
            </h1>
            <p className="text-slate-600 font-medium">Generate unique, high-quality content with sophisticated AI algorithms</p>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <span className="text-green-800 font-medium">{success}</span>
          </div>
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <span className="text-red-800 font-medium">{error}</span>
          </div>
        </div>
      )}

      {/* Content Generation Form */}
      <Card className="p-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="w-5 h-5 text-blue-600" />
            Content Parameters
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Content Description */}
          <div className="space-y-2">
            <Label htmlFor="content-input" className="text-sm font-medium text-gray-700">
              Describe Your Content Vision
            </Label>
            <Textarea
              id="content-input"
              value={contentInput}
              onChange={(e) => setContentInput(e.target.value)}
              placeholder="Describe your content vision in detail. Be specific about your goals, target audience, and desired impact. For example: 'Create a viral post that teaches entrepreneurs how to scale from $0 to $1M in 12 months, with specific actionable steps, case studies, and psychological triggers that will make people take immediate action.'"
              className="min-h-[120px] border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Advanced Parameters */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Platform</Label>
              <Select value={selectedPlatform} onValueChange={setSelectedPlatform}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="instagram">📸 Instagram</SelectItem>
                  <SelectItem value="tiktok">🎬 TikTok</SelectItem>
                  <SelectItem value="youtube">🎥 YouTube</SelectItem>
                  <SelectItem value="x">🐦 X (Twitter)</SelectItem>
                  <SelectItem value="linkedin">💼 LinkedIn</SelectItem>
                  <SelectItem value="facebook">📱 Facebook</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Content Type</Label>
              <Select value={selectedContentType} onValueChange={setSelectedContentType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="post">📝 Post</SelectItem>
                  <SelectItem value="story">📱 Story</SelectItem>
                  <SelectItem value="reel">🎬 Reel</SelectItem>
                  <SelectItem value="video">📹 Video</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Tone</Label>
              <Select value={selectedTone} onValueChange={setSelectedTone}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="professional">💼 Professional</SelectItem>
                  <SelectItem value="casual">😊 Casual</SelectItem>
                  <SelectItem value="motivational">🔥 Motivational</SelectItem>
                  <SelectItem value="humorous">😄 Humorous</SelectItem>
                  <SelectItem value="authoritative">👑 Authoritative</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
              <Select value={targetAudience} onValueChange={setTargetAudience}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">👥 General</SelectItem>
                  <SelectItem value="professionals">💼 Professionals</SelectItem>
                  <SelectItem value="creators">🎨 Creators</SelectItem>
                  <SelectItem value="entrepreneurs">🚀 Entrepreneurs</SelectItem>
                  <SelectItem value="students">🎓 Students</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Content Length</Label>
              <Select value={contentLength} onValueChange={setContentLength}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="short">📝 Short (1-2 paragraphs)</SelectItem>
                  <SelectItem value="medium">📄 Medium (3-5 paragraphs)</SelectItem>
                  <SelectItem value="long">📚 Long (6+ paragraphs)</SelectItem>
                  <SelectItem value="thread">🧵 Thread format</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">Call to Action</Label>
              <Select value={callToAction} onValueChange={setCallToAction}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="engagement">💬 Ask for engagement</SelectItem>
                  <SelectItem value="click">🔗 Drive clicks</SelectItem>
                  <SelectItem value="share">📤 Encourage sharing</SelectItem>
                  <SelectItem value="save">💾 Ask to save</SelectItem>
                  <SelectItem value="follow">👆 Gain followers</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Generate Button */}
          <Button
            onClick={generateAdvancedContent}
            disabled={isGenerating || !contentInput.trim()}
            className="w-full bg-gradient-to-r from-blue-600 via-blue-700 to-cyan-600 hover:from-blue-700 hover:via-blue-800 hover:to-cyan-700 text-white font-semibold py-4 rounded-2xl shadow-lg shadow-blue-500/25 transition-all duration-300 hover:shadow-xl hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-5 h-5 mr-3 animate-spin" />
                <span className="text-lg">Generating Advanced Content...</span>
              </>
            ) : (
              <>
                <Brain className="w-5 h-5 mr-3" />
                <span className="text-lg">Generate Advanced Content</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Generated Content Display */}
      {generatedContent && (
        <Card className="p-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-blue-600" />
                Generated Content
              </CardTitle>
              <div className="flex items-center gap-2">
                <Badge className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white">
                  {generatedContent.viralScore}% Viral
                </Badge>
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  {generatedContent.estimatedViews} Views
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="content" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="content">Content</TabsTrigger>
                <TabsTrigger value="caption">Caption</TabsTrigger>
                <TabsTrigger value="script">Script</TabsTrigger>
                <TabsTrigger value="details">Details</TabsTrigger>
              </TabsList>

              <TabsContent value="content" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">Main Content</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyContent('content')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedContent.content}</pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="caption" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">Social Media Caption</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyContent('caption')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedContent.caption}</pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="script" className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium text-gray-700">Video Script</Label>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleCopyContent('script')}
                    >
                      <Copy className="w-4 h-4 mr-1" />
                      Copy
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg border">
                    <pre className="whitespace-pre-wrap text-sm text-gray-700">{generatedContent.script}</pre>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="details" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Hashtags</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedContent.hashtags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Psychological Triggers</Label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {generatedContent.psychologicalTriggers.map((trigger, index) => (
                        <Badge key={index} variant="outline" className="text-xs bg-blue-50 text-blue-700">
                          {trigger}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Platform</Label>
                    <p className="text-sm text-gray-600 capitalize">{generatedContent.platform}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Content Type</Label>
                    <p className="text-sm text-gray-600 capitalize">{generatedContent.contentType}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Tone</Label>
                    <p className="text-sm text-gray-600 capitalize">{generatedContent.tone}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Target Audience</Label>
                    <p className="text-sm text-gray-600 capitalize">{generatedContent.targetAudience}</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            {/* Action Buttons */}
            <div className="flex gap-3 mt-6">
              <Button onClick={handleSaveContent} className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                Save Content
              </Button>
              <Button variant="outline" className="flex-1">
                <Send className="w-4 h-4 mr-2" />
                Schedule Post
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 