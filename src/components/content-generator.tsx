"use client";

import { useState, useRef } from "react";
import {
  Upload,
  Image as ImageIcon,
  Video,
  Type,
  Palette,
  Sparkles,
  Download,
  Play,
  Pause,
  RotateCcw,
  Zap,
  Wand2,
  Settings,
  Eye,
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ContentGeneratorProps {
  className?: string;
}

interface ContentElement {
  id: string;
  type: "text" | "image" | "video" | "audio";
  content: string;
  position: { x: number; y: number };
  size: { width: number; height: number };
  style: Record<string, any>;
}

const templates = [
  {
    id: "viral-hook",
    name: "Viral Hook",
    description: "Attention-grabbing opening",
    thumbnail: "/api/placeholder/300/200",
    category: "hooks",
  },
  {
    id: "story-time",
    name: "Story Time",
    description: "Personal narrative format",
    thumbnail: "/api/placeholder/300/200",
    category: "stories",
  },
  {
    id: "tutorial",
    name: "Tutorial",
    description: "Step-by-step guide",
    thumbnail: "/api/placeholder/300/200",
    category: "educational",
  },
  {
    id: "behind-scenes",
    name: "Behind the Scenes",
    description: "Authentic moments",
    thumbnail: "/api/placeholder/300/200",
    category: "lifestyle",
  },
];

const aiPrompts = [
  "Create a viral TikTok hook about productivity",
  "Generate an Instagram story about morning routine",
  "Write a YouTube short script about tech tips",
  "Create a LinkedIn post about career growth",
];

export default function ContentGenerator({
  className = "",
}: ContentGeneratorProps) {
  const [activeTab, setActiveTab] = useState("create");
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [elements, setElements] = useState<ContentElement[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string>("");
  const [contentFormat, setContentFormat] = useState<
    "faceless" | "avatar" | "vlog" | "hybrid"
  >("faceless");
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [voiceoverPreview, setVoiceoverPreview] = useState<string | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    files.forEach((file) => {
      if (file.type.startsWith("image/")) {
        addImageElement(file);
      } else if (file.type.startsWith("video/")) {
        addVideoElement(file);
      }
    });
  };

  const addImageElement = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newElement: ContentElement = {
        id: Date.now().toString(),
        type: "image",
        content: e.target?.result as string,
        position: { x: 50, y: 50 },
        size: { width: 200, height: 150 },
        style: {},
      };
      setElements((prev) => [...prev, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const addVideoElement = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const newElement: ContentElement = {
        id: Date.now().toString(),
        type: "video",
        content: e.target?.result as string,
        position: { x: 50, y: 50 },
        size: { width: 300, height: 200 },
        style: {},
      };
      setElements((prev) => [...prev, newElement]);
    };
    reader.readAsDataURL(file);
  };

  const addTextElement = () => {
    const newElement: ContentElement = {
      id: Date.now().toString(),
      type: "text",
      content: "Your text here...",
      position: { x: 100, y: 100 },
      size: { width: 200, height: 50 },
      style: {
        fontSize: "18px",
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
      },
    };
    setElements((prev) => [...prev, newElement]);
  };

  const generateAIContent = async (prompt: string) => {
    setIsGenerating(true);
    setGenerationLogs([]);

    // Simulate realistic AI generation with logs
    const logs = [
      "🤖 Analyzing viral trends...",
      "📊 Processing engagement patterns...",
      "✨ Generating hook variations...",
      "🎯 Optimizing for target audience...",
      "🔥 Finalizing viral content...",
    ];

    for (let i = 0; i < logs.length; i++) {
      setTimeout(() => {
        setGenerationLogs((prev) => [...prev, logs[i]]);
      }, i * 400);
    }

    setTimeout(() => {
      const mockContent = `🔥 ${prompt.split(" ").slice(0, 3).join(" ")} that will blow your mind!

✨ Here's what you need to know:
• Point 1: Game-changing insight
• Point 2: Actionable tip
• Point 3: Mind-blowing fact

💡 Try this today and watch your life transform!

#viral #trending #lifehacks #productivity`;

      setGeneratedContent(mockContent);
      setVoiceoverPreview("Generated voiceover ready for preview");
      setVideoPreview("Video assembly complete - ready for review");
      setIsGenerating(false);
      setGenerationLogs((prev) => [...prev, "✅ Content generation complete!"]);
    }, 2500);
  };

  const exportContent = () => {
    // Export functionality
    console.log("Exporting content...", elements);
  };

  return (
    <div className={`max-w-7xl mx-auto ${className}`}>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">
          Content Generator
        </h1>
        <p className="text-gray-300">
          Create viral content with AI-powered tools and drag-and-drop editing
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 bg-white/5 border border-white/10">
          <TabsTrigger
            value="create"
            className="data-[state=active]:bg-pegasus-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create
          </TabsTrigger>
          <TabsTrigger
            value="templates"
            className="data-[state=active]:bg-pegasus-primary"
          >
            <Palette className="w-4 h-4 mr-2" />
            Templates
          </TabsTrigger>
          <TabsTrigger
            value="ai-generate"
            className="data-[state=active]:bg-pegasus-primary"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            AI Generate
          </TabsTrigger>
          <TabsTrigger
            value="preview"
            className="data-[state=active]:bg-pegasus-primary"
          >
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </TabsTrigger>
        </TabsList>

        <TabsContent value="create" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Enhanced Tools Panel */}
            <div className="lg:col-span-1 space-y-4">
              {/* Content Format Selector */}
              <Card className="premium-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Content Format
                </h3>
                <div className="space-y-2">
                  {[
                    { id: "faceless", name: "Faceless", icon: "🎭" },
                    { id: "avatar", name: "Avatar", icon: "🤖" },
                    { id: "vlog", name: "Vlog Style", icon: "📹" },
                    { id: "hybrid", name: "Hybrid", icon: "✨" },
                  ].map((format) => (
                    <button
                      key={format.id}
                      onClick={() => setContentFormat(format.id as any)}
                      className={`w-full p-3 rounded-lg border-2 transition-all text-left ${
                        contentFormat === format.id
                          ? "border-blue-500 bg-blue-500/20 text-white"
                          : "border-gray-600 bg-gray-800/50 text-gray-300 hover:border-gray-500"
                      }`}
                    >
                      <span className="text-lg mr-2">{format.icon}</span>
                      <span className="font-medium">{format.name}</span>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Tools */}
              <Card className="premium-card p-6">
                <h3 className="text-lg font-semibold text-white mb-4">
                  Studio Tools
                </h3>
                <div className="space-y-3">
                  <Button
                    onClick={addTextElement}
                    className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    <Type className="w-4 h-4 mr-2" />
                    Add Text
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    <ImageIcon className="w-4 h-4 mr-2" />
                    Add Image
                  </Button>
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full justify-start bg-white/5 hover:bg-white/10 text-white border border-white/10"
                  >
                    <Video className="w-4 h-4 mr-2" />
                    Add Video
                  </Button>
                  <Button
                    onClick={() => setElements([])}
                    className="w-full justify-start bg-red-500/20 hover:bg-red-500/30 text-red-400 border border-red-500/30"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </div>
              </Card>

              {/* Generation Logs */}
              {generationLogs.length > 0 && (
                <Card className="premium-card p-4">
                  <h4 className="text-sm font-semibold text-white mb-3">
                    Generation Log
                  </h4>
                  <div className="space-y-1 max-h-32 overflow-y-auto">
                    {generationLogs.map((log, index) => (
                      <div
                        key={index}
                        className="text-xs text-gray-300 flex items-center gap-2"
                      >
                        <div className="w-1 h-1 bg-blue-400 rounded-full" />
                        {log}
                      </div>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Enhanced Studio Canvas */}
            <div className="lg:col-span-3 space-y-4">
              {/* Content Previews */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Script Preview */}
                <Card className="premium-card p-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Type className="w-4 h-4" />
                    Generated Script
                  </h4>
                  <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-300 h-24 overflow-y-auto">
                    {generatedContent || "No script generated yet..."}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 text-xs"
                    disabled={!generatedContent}
                  >
                    Edit Script
                  </Button>
                </Card>

                {/* Voiceover Preview */}
                <Card className="premium-card p-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    Voiceover
                  </h4>
                  <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-300 h-24 flex items-center justify-center">
                    {voiceoverPreview ? (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                        <div>Ready to play</div>
                      </div>
                    ) : (
                      "Generate content first..."
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 text-xs"
                    disabled={!voiceoverPreview}
                  >
                    Preview Audio
                  </Button>
                </Card>

                {/* Video Preview */}
                <Card className="premium-card p-4">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Video className="w-4 h-4" />
                    Video Assembly
                  </h4>
                  <div className="bg-gray-800/50 rounded p-3 text-xs text-gray-300 h-24 flex items-center justify-center">
                    {videoPreview ? (
                      <div className="text-center">
                        <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Video className="w-4 h-4 text-white" />
                        </div>
                        <div>Video ready</div>
                      </div>
                    ) : (
                      "Waiting for content..."
                    )}
                  </div>
                  <Button
                    size="sm"
                    className="w-full mt-2 text-xs"
                    disabled={!videoPreview}
                  >
                    Preview Video
                  </Button>
                </Card>
              </div>

              {/* Main Canvas */}
              <Card className="premium-card p-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-white">
                    Content Studio
                  </h3>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => generateAIContent("Create viral content")}
                      disabled={isGenerating}
                      className="premium-button text-sm"
                    >
                      {isGenerating ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Generating...
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Regenerate
                        </>
                      )}
                    </Button>
                    <Button
                      onClick={exportContent}
                      className="premium-button text-sm"
                      disabled={!generatedContent}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export
                    </Button>
                  </div>
                </div>
                <div
                  ref={canvasRef}
                  className="relative w-full h-96 bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border-2 border-dashed border-gray-600 overflow-hidden"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                >
                  {elements.length === 0 ? (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4" />
                        <p className="text-gray-400">
                          Drag and drop files here or use the tools panel
                        </p>
                      </div>
                    </div>
                  ) : (
                    elements.map((element) => (
                      <div
                        key={element.id}
                        className="absolute cursor-move border border-pegasus-primary/50 rounded"
                        style={{
                          left: element.position.x,
                          top: element.position.y,
                          width: element.size.width,
                          height: element.size.height,
                        }}
                      >
                        {element.type === "text" && (
                          <div
                            className="w-full h-full flex items-center justify-center p-2"
                            style={element.style}
                          >
                            {element.content}
                          </div>
                        )}
                        {element.type === "image" && (
                          <img
                            src={element.content}
                            alt="Content"
                            className="w-full h-full object-cover rounded"
                          />
                        )}
                        {element.type === "video" && (
                          <video
                            src={element.content}
                            className="w-full h-full object-cover rounded"
                            controls
                          />
                        )}
                      </div>
                    ))
                  )}
                </div>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`premium-card p-4 cursor-pointer transition-all duration-300 hover:scale-105 ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-pegasus-primary shadow-glow-primary"
                    : ""
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-700 rounded-lg mb-4 flex items-center justify-center">
                  <Play className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="font-semibold text-white mb-1">
                  {template.name}
                </h3>
                <p className="text-gray-400 text-sm mb-3">
                  {template.description}
                </p>
                <Button className="w-full premium-button text-sm">
                  Use Template
                </Button>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="ai-generate" className="mt-6">
          <div className="max-w-4xl mx-auto">
            <Card className="premium-card p-8">
              <div className="text-center mb-8">
                <Zap className="w-12 h-12 text-pegasus-primary mx-auto mb-4" />
                <h2 className="text-2xl font-bold text-white mb-2">
                  AI Content Generator
                </h2>
                <p className="text-gray-300">
                  Generate viral content with AI in seconds
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                {aiPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    onClick={() => generateAIContent(prompt)}
                    disabled={isGenerating}
                    className="p-4 h-auto text-left bg-white/5 hover:bg-white/10 text-white border border-white/10 justify-start"
                  >
                    <Sparkles className="w-5 h-5 mr-3 flex-shrink-0" />
                    <span className="text-sm">{prompt}</span>
                  </Button>
                ))}
              </div>

              {isGenerating && (
                <div className="text-center py-8">
                  <div className="inline-flex items-center gap-3 text-pegasus-primary">
                    <div className="w-6 h-6 border-2 border-pegasus-primary border-t-transparent rounded-full animate-spin" />
                    <span className="font-medium">
                      Generating viral content...
                    </span>
                  </div>
                </div>
              )}

              {generatedContent && !isGenerating && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold text-white mb-4">
                    Generated Content
                  </h3>
                  <div className="premium-card p-6">
                    <pre className="text-gray-300 whitespace-pre-wrap font-sans">
                      {generatedContent}
                    </pre>
                    <div className="flex gap-3 mt-6">
                      <Button className="premium-button">
                        <Download className="w-4 h-4 mr-2" />
                        Use Content
                      </Button>
                      <Button
                        variant="outline"
                        className="border-white/20 text-white hover:bg-white/10"
                      >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Regenerate
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-6">
          <div className="max-w-2xl mx-auto">
            <Card className="premium-card p-8">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Content Preview
                </h2>
                <p className="text-gray-300">
                  See how your content will look on different platforms
                </p>
              </div>

              <div className="space-y-6">
                {/* Mobile Preview */}
                <div
                  className="bg-black rounded-3xl p-4 mx-auto"
                  style={{ width: "300px", height: "600px" }}
                >
                  <div className="bg-gray-900 rounded-2xl h-full p-4 flex flex-col">
                    <div className="flex-1 bg-gradient-to-br from-gray-800 to-gray-700 rounded-xl flex items-center justify-center">
                      <Play className="w-12 h-12 text-gray-400" />
                    </div>
                    <div className="mt-4 text-center">
                      <p className="text-white text-sm font-medium">
                        Your viral content preview
                      </p>
                      <p className="text-gray-400 text-xs mt-1">
                        TikTok • Instagram • YouTube
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files || []);
          files.forEach((file) => {
            if (file.type.startsWith("image/")) {
              addImageElement(file);
            } else if (file.type.startsWith("video/")) {
              addVideoElement(file);
            }
          });
        }}
      />
    </div>
  );
}
