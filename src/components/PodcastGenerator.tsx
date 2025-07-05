import React, { useState } from "react";
import { toast } from "react-hot-toast";
import {
  Sparkles,
  Plus,
  X,
  Loader2,
  Mic,
  Users,
  Clock,
  Zap,
} from "lucide-react";
import { PodcastData } from "../App";
import { generatePodcast } from "../services/podcastService";

interface PodcastGeneratorProps {
  onPodcastGenerated: (podcast: PodcastData) => void;
  isGenerating: boolean;
  setIsGenerating: (generating: boolean) => void;
}

const topicCategories = [
  {
    name: "Technology",
    topics: [
      "Artificial Intelligence and Machine Learning",
      "Blockchain and Cryptocurrency",
      "Cybersecurity and Privacy",
      "Future of Work and Automation",
      "Virtual Reality and Metaverse",
      "Quantum Computing Revolution",
    ],
  },
  {
    name: "Science",
    topics: [
      "Climate Change and Environmental Solutions",
      "Space Exploration and Astronomy",
      "Biotechnology and Gene Editing",
      "Renewable Energy Technologies",
      "Medical Breakthroughs and Healthcare",
      "Ocean Conservation and Marine Biology",
    ],
  },
  {
    name: "Economics & Business",
    topics: [
      "Global Economic Trends",
      "Startup Culture and Entrepreneurship",
      "Sustainable Business Practices",
      "Digital Marketing Revolution",
      "Supply Chain Innovation",
      "Financial Technology (FinTech)",
    ],
  },
  {
    name: "Society & Culture",
    topics: [
      "Social Media Impact on Society",
      "Mental Health Awareness",
      "Education System Reform",
      "Cultural Diversity and Inclusion",
      "Urban Planning and Smart Cities",
      "Food Security and Agriculture",
    ],
  },
];

const podcastStyles = [
  {
    name: "Joe Rogan Style",
    description:
      "Long-form conversational, curious questioning, deep dives into topics",
    characteristics: "Casual, inquisitive, philosophical tangents",
  },
  {
    name: "NPR Style",
    description:
      "Professional journalism, well-researched, balanced perspectives",
    characteristics: "Informative, authoritative, structured storytelling",
  },
  {
    name: "TED Talk Style",
    description:
      "Educational, inspiring, expert insights with actionable takeaways",
    characteristics: "Motivational, expert-driven, solution-focused",
  },
  {
    name: "Comedy Podcast Style",
    description:
      "Light-hearted discussion with humor, entertaining while informative",
    characteristics: "Funny, relatable, casual banter with insights",
  },
  {
    name: "Interview Style",
    description: "Structured Q&A format with expert guests and deep expertise",
    characteristics: "Professional, focused, expert knowledge sharing",
  },
  {
    name: "Debate Style",
    description:
      "Multiple perspectives, constructive disagreement, balanced arguments",
    characteristics: "Analytical, challenging, multiple viewpoints",
  },
];

const podcastHostTemplates = [
  "Joe Rogan style - Deep, conversational with curious questioning and casual exploration",
  "Lex Fridman style - Thoughtful, technical, with philosophical undertones",
  "Tim Ferriss style - Analytical, detailed, focused on extracting actionable insights",
  "Sam Harris style - Philosophical, measured, with deep intellectual discourse",
  "Alex Cooper style - Energetic, engaging, with modern cultural insights",
  "Dax Shepard style - Casual, humorous, with personal anecdotes and empathy",
  "Marc Maron style - Intense, personal, with deep emotional exploration",
  "Terry Gross style - Professional, warm, with masterful interviewing",
  "Guy Raz style - Narrative-driven, engaging storytelling with business focus",
  "Ezra Klein style - Analytical, policy-focused, with structured discussion",
];

const expertPersonalities = [
  "Curious interviewer who asks probing questions",
  "Expert scientist with deep technical knowledge",
  "Skeptical journalist who challenges assumptions",
  "Enthusiastic advocate for the topic",
  "Practical business executive with real-world experience",
  "Academic researcher with theoretical insights",
  "Industry veteran with historical perspective",
  "Young innovator with fresh ideas",
  "Policy maker focused on regulations and ethics",
  "Consumer advocate representing public interests",
];

const PodcastGenerator: React.FC<PodcastGeneratorProps> = ({
  onPodcastGenerated,
  isGenerating,
  setIsGenerating,
}) => {
  const [formData, setFormData] = useState({
    selectedCategory: "",
    topic: "",
    customTopic: "",
    context: "",
    personalities: [
      "Joe Rogan style - Deep, conversational with curious questioning and casual exploration",
      "Subject matter expert with deep knowledge",
    ],
    duration: "15",
    podcastStyle: "Joe Rogan Style",
    useCustomTopic: false,
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleCategoryChange = (category: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedCategory: category,
      topic: "",
      useCustomTopic: false,
    }));
  };

  const handleTopicSelect = (topic: string) => {
    setFormData((prev) => ({
      ...prev,
      topic: topic,
      useCustomTopic: false,
    }));
  };

  const handlePersonalityChange = (index: number, value: string) => {
    const newPersonalities = [...formData.personalities];
    newPersonalities[index] = value;
    setFormData((prev) => ({
      ...prev,
      personalities: newPersonalities,
    }));
  };

  const addPersonality = () => {
    if (formData.personalities.length < 4) {
      setFormData((prev) => ({
        ...prev,
        personalities: [...prev.personalities, ""],
      }));
    }
  };

  const removePersonality = (index: number) => {
    if (formData.personalities.length > 1) {
      setFormData((prev) => ({
        ...prev,
        personalities: prev.personalities.filter((_, i) => i !== index),
      }));
    }
  };

  const addPersonalityTemplate = (template: string) => {
    if (formData.personalities.length < 4) {
      setFormData((prev) => ({
        ...prev,
        personalities: [...prev.personalities, template],
      }));
    }
  };

  const generateContextSuggestion = () => {
    const finalTopic = formData.useCustomTopic
      ? formData.customTopic
      : formData.topic;
    if (!finalTopic) return;

    const suggestions = [
      `Explore the latest developments in ${finalTopic.toLowerCase()}, discussing current trends, challenges, and future implications for society and industry.`,
      `Dive deep into ${finalTopic.toLowerCase()} from multiple perspectives, examining both opportunities and potential risks while providing actionable insights.`,
      `Analyze the impact of ${finalTopic.toLowerCase()} on everyday life, featuring expert opinions, real-world examples, and practical applications.`,
      `Investigate the cutting-edge research and innovations in ${finalTopic.toLowerCase()}, discussing breakthrough discoveries and their potential to transform our world.`,
    ];

    const randomSuggestion =
      suggestions[Math.floor(Math.random() * suggestions.length)];
    setFormData((prev) => ({
      ...prev,
      context: randomSuggestion,
    }));
    toast.success("Context suggestion generated!");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const finalTopic = formData.useCustomTopic
      ? formData.customTopic
      : formData.topic;

    if (!finalTopic.trim()) {
      toast.error("Please select or enter a topic");
      return;
    }

    if (!formData.context.trim()) {
      toast.error("Please provide context for the podcast");
      return;
    }

    const validPersonalities = formData.personalities.filter((p) => p.trim());
    if (validPersonalities.length === 0) {
      toast.error("Please add at least one personality");
      return;
    }

    setIsGenerating(true);

    try {
      toast.loading("AI is crafting your podcast script...", {
        id: "generating",
      });

      const podcast = await generatePodcast({
        topic: finalTopic,
        context: formData.context,
        personalities: validPersonalities,
        duration: formData.duration,
        podcastStyle: formData.podcastStyle,
      });

      toast.success("Podcast script generated successfully!", {
        id: "generating",
      });
      onPodcastGenerated(podcast);
    } catch (error) {
      toast.error("Failed to generate podcast. Please try again.", {
        id: "generating",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedCategoryTopics =
    topicCategories.find((cat) => cat.name === formData.selectedCategory)
      ?.topics || [];

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-10 border border-gray-100 hover:shadow-3xl transition-all duration-500">
      <div className="text-center mb-8 relative">
        <h2 className="text-3xl font-bold text-gray-800 mb-3">
          AI Podcast Script Generator
        </h2>
        <p className="text-gray-600 text-lg">
          Create engaging podcast scripts with AI-powered conversation
          generation
        </p>
        <div className="mt-4 p-4 bg-blue-50 rounded-xl border border-blue-200">
          <p className="text-sm text-blue-700 font-medium">
            📋 Follow the numbered steps below to create your podcast. Each step
            guides you through the process!
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Topic Selection */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-2 flex items-center">
            <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              1
            </div>
            Choose Your Topic Category
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Select a category first, then pick a specific topic, or create your
            own custom topic
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {topicCategories.map((category) => (
              <button
                key={category.name}
                type="button"
                onClick={() => handleCategoryChange(category.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.selectedCategory === category.name
                    ? "border-blue-500 bg-blue-50 text-blue-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isGenerating}
              >
                <h3 className="font-semibold mb-1">{category.name}</h3>
                <p className="text-sm text-gray-500">
                  {category.topics.length} topics
                </p>
              </button>
            ))}
          </div>

          {selectedCategoryTopics.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-gray-700 mb-3">
                Select a specific topic:
              </h4>
              <div className="grid md:grid-cols-2 gap-3">
                {selectedCategoryTopics.map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => handleTopicSelect(topic)}
                    className={`p-3 rounded-lg border text-left transition-all duration-300 ${
                      formData.topic === topic && !formData.useCustomTopic
                        ? "border-blue-500 bg-blue-50 text-blue-700"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    disabled={isGenerating}
                  >
                    <span className="text-sm font-medium">{topic}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center space-x-3 mb-4">
            <input
              type="checkbox"
              id="customTopic"
              checked={formData.useCustomTopic}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  useCustomTopic: e.target.checked,
                  topic: "",
                }))
              }
              className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
              disabled={isGenerating}
            />
            <label
              htmlFor="customTopic"
              className="text-sm font-medium text-gray-700"
            >
              Use custom topic instead
            </label>
          </div>

          {formData.useCustomTopic && (
            <input
              type="text"
              value={formData.customTopic}
              onChange={(e) => handleInputChange("customTopic", e.target.value)}
              placeholder="Enter your custom topic..."
              className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white"
              disabled={isGenerating}
            />
          )}
        </div>

        {/* Podcast Style Selection */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-2 flex items-center">
            <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              2
            </div>
            Podcast Style
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Choose how you want your podcast conversation to sound and feel
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {podcastStyles.map((style) => (
              <button
                key={style.name}
                type="button"
                onClick={() => handleInputChange("podcastStyle", style.name)}
                className={`p-4 rounded-xl border-2 transition-all duration-300 text-left ${
                  formData.podcastStyle === style.name
                    ? "border-purple-500 bg-purple-50 text-purple-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isGenerating}
              >
                <h3 className="font-semibold mb-2">{style.name}</h3>
                <p className="text-xs text-gray-600 mb-2">
                  {style.description}
                </p>
                <p className="text-xs text-gray-500 italic">
                  {style.characteristics}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Context */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <div>
              <label className="block text-lg font-bold text-gray-800 flex items-center">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
                  3
                </div>
                Podcast Context & Direction *
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Describe what you want covered, key points, target audience,
                etc.
              </p>
            </div>
            <button
              type="button"
              onClick={generateContextSuggestion}
              className="flex items-center space-x-2 px-3 py-2 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-all duration-300"
              disabled={isGenerating}
            >
              <Zap className="w-4 h-4" />
              <span>Generate Suggestion</span>
            </button>
          </div>
          <textarea
            value={formData.context}
            onChange={(e) => handleInputChange("context", e.target.value)}
            placeholder="Describe what you want the podcast to cover, key points to discuss, specific angles to explore, target audience, etc."
            rows={4}
            className="w-full px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500 resize-vertical"
            disabled={isGenerating}
          />
        </div>

        {/* Speaker Personalities */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-2 flex items-center">
            <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              4
            </div>
            Speaker Personalities *
          </label>
          <p className="text-xs text-gray-500 mb-4">
            Quick add from templates below or manually enter custom
            personalities
          </p>

          {/* Personality Templates */}
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-4">
              Quick Add Personality Templates:
            </h4>

            {/* Podcast Hosts Section */}
            <div className="mb-6">
              <h5 className="text-sm font-bold text-blue-600 mb-3 flex items-center">
                🎙️ Popular Podcast Hosts
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {podcastHostTemplates.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addPersonalityTemplate(template)}
                    className="px-3 py-2 text-xs bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-all duration-300 border border-blue-200 text-left"
                    disabled={
                      isGenerating || formData.personalities.length >= 4
                    }
                  >
                    + {template.split(" style")[0]}
                  </button>
                ))}
              </div>
            </div>

            {/* Expert Roles Section */}
            <div className="mb-4">
              <h5 className="text-sm font-bold text-gray-600 mb-3 flex items-center">
                👨‍💼 Expert Roles
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                {expertPersonalities.map((template, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => addPersonalityTemplate(template)}
                    className="px-3 py-2 text-xs bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-all duration-300 border border-gray-200 text-left"
                    disabled={
                      isGenerating || formData.personalities.length >= 4
                    }
                  >
                    + {template}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            {formData.personalities.map((personality, index) => (
              <div key={index} className="flex items-center space-x-3 group">
                <div className="flex items-center space-x-2 flex-1">
                  <Users className="w-5 h-5 text-orange-500" />
                  <input
                    type="text"
                    value={personality}
                    onChange={(e) =>
                      handlePersonalityChange(index, e.target.value)
                    }
                    placeholder={`Speaker ${index + 1} personality and role...`}
                    className="flex-1 px-5 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all duration-300 bg-gray-50 hover:bg-white text-gray-800 placeholder-gray-500"
                    disabled={isGenerating}
                  />
                </div>
                {formData.personalities.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removePersonality(index)}
                    className="p-3 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all duration-300 opacity-0 group-hover:opacity-100"
                    disabled={isGenerating}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}

            {formData.personalities.length < 4 && (
              <button
                type="button"
                onClick={addPersonality}
                className="flex items-center space-x-2 px-5 py-3 text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-all duration-300 border border-orange-200 hover:border-orange-300"
                disabled={isGenerating}
              >
                <Plus className="w-4 h-4" />
                <span>Add Another Speaker</span>
              </button>
            )}
          </div>
        </div>

        {/* Duration */}
        <div>
          <label className="block text-lg font-bold text-gray-800 mb-2 flex items-center">
            <div className="w-8 h-8 bg-indigo-500 text-white rounded-full flex items-center justify-center mr-3 text-sm font-bold">
              5
            </div>
            Episode Duration
          </label>
          <p className="text-xs text-gray-500 mb-3">
            Longer episodes need more detailed context for better results
          </p>
          <div className="grid grid-cols-5 gap-3">
            {["5", "10", "15", "20", "30"].map((duration) => (
              <button
                key={duration}
                type="button"
                onClick={() => handleInputChange("duration", duration)}
                className={`p-3 rounded-xl border-2 transition-all duration-300 text-center ${
                  formData.duration === duration
                    ? "border-indigo-500 bg-indigo-50 text-indigo-700"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
                disabled={isGenerating}
              >
                <Clock className="w-5 h-5 mx-auto mb-1" />
                <span className="text-sm font-medium">{duration}m</span>
              </button>
            ))}
          </div>
        </div>

        <button
          type="submit"
          disabled={isGenerating}
          className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-5 px-8 rounded-2xl font-bold text-lg shadow-2xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-[1.02] hover:shadow-3xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none relative"
        >
          <div className="absolute left-6 top-1/2 transform -translate-y-1/2">
            <div className="w-8 h-8 bg-white/20 text-white rounded-full flex items-center justify-center text-sm font-bold">
              6
            </div>
          </div>
          {isGenerating ? (
            <div className="flex items-center justify-center space-x-3 ml-8">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>AI is Writing Your Podcast Script...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center space-x-3 ml-8">
              <Sparkles className="w-6 h-6" />
              <span>Generate AI Podcast Script</span>
            </div>
          )}
        </button>
      </form>
    </div>
  );
};

export default PodcastGenerator;
