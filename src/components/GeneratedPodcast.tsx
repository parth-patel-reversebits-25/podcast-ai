import React, { useState } from "react";
import {
  ArrowLeft,
  Play,
  Pause,
  Download,
  Share2,
  Clock,
  Users,
  Tag,
  Calendar,
  FileText,
} from "lucide-react";
import { toast } from "react-hot-toast";
import { PodcastData } from "../App";
import { generateAudio } from "../services/ttsService";

interface GeneratedPodcastProps {
  podcast: PodcastData | null;
  onBackToGenerator: () => void;
}

const GeneratedPodcast: React.FC<GeneratedPodcastProps> = ({
  podcast,
  onBackToGenerator,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);

  if (!podcast) return null;

  const togglePlayback = () => {
    if (isPlaying) {
      // Stop current playback
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      setIsPlaying(false);
      setCurrentAudio(null);
    } else {
      if (audioUrl) {
        // Play existing audio
        const audio = new Audio(audioUrl);
        audio.onplay = () => {
          setIsPlaying(true);
          toast.success("Audio playback started");
        };
        audio.onended = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          toast.success("Audio playback completed");
        };
        audio.onerror = () => {
          setIsPlaying(false);
          setCurrentAudio(null);
          toast.error("Audio playback failed");
        };
        setCurrentAudio(audio);
        audio.play();
      } else {
        // Generate and play new audio
        generateAndPlayAudio();
      }
    }
  };

  const generateAndPlayAudio = async () => {
    setIsLoading(true);
    toast.loading("Generating high-quality audio...", {
      id: "audio-generation",
    });

    try {
      const audioBlob = await generateAudio(podcast.transcript);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

      const audio = new Audio(url);
      audio.onplay = () => {
        setIsPlaying(true);
        setIsLoading(false);
        toast.success("Audio playback started", { id: "audio-generation" });
      };
      audio.onended = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        toast.success("Audio playback completed");
      };
      audio.onerror = () => {
        setIsPlaying(false);
        setCurrentAudio(null);
        setIsLoading(false);
        toast.error("Audio playback failed");
      };

      setCurrentAudio(audio);
      audio.play();
    } catch (error) {
      setIsLoading(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Failed to generate audio. Please try again.";
      toast.error(errorMessage, { id: "audio-generation" });
    }
  };

  const handleDownload = () => {
    if (audioUrl) {
      // Download audio file
      const element = document.createElement("a");
      element.href = audioUrl;
      element.download = `${podcast.title.replace(/\s+/g, "_")}_podcast.mp3`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Audio download started");
    } else {
      // Download transcript
      const element = document.createElement("a");
      const file = new Blob([podcast.transcript], { type: "text/plain" });
      element.href = URL.createObjectURL(file);
      element.download = `${podcast.title.replace(/\s+/g, "_")}_transcript.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success("Transcript download started");
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: podcast.title,
          text: podcast.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Error sharing:", err);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="max-w-5xl mx-auto">
      <button
        onClick={onBackToGenerator}
        className="flex items-center space-x-3 text-gray-600 hover:text-gray-800 mb-8 px-4 py-2 rounded-xl hover:bg-gray-50 transition-all duration-300"
      >
        <ArrowLeft className="w-6 h-6" />
        <span className="font-medium">Back to Generator</span>
      </button>

      <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white p-10">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight">
                {podcast.title}
              </h1>
              <p className="text-blue-100 text-xl mb-6 leading-relaxed">
                {podcast.description}
              </p>

              <div className="flex flex-wrap gap-6 text-sm">
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <Clock className="w-4 h-4" />
                  <span className="font-medium">{podcast.duration}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <Users className="w-4 h-4" />
                  <span className="font-medium">
                    {podcast.speakers.length} speakers
                  </span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <Tag className="w-4 h-4" />
                  <span className="font-medium">{podcast.topic}</span>
                </div>
                <div className="flex items-center space-x-2 bg-white/20 px-3 py-2 rounded-full">
                  <Calendar className="w-4 h-4" />
                  <span className="font-medium">
                    {new Date(podcast.generatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="p-8 border-b border-gray-100 bg-gray-50/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={togglePlayback}
                className="flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 transform hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="w-7 h-7 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <Pause className="w-7 h-7" />
                ) : (
                  <Play className="w-7 h-7 ml-1" />
                )}
              </button>

              <div className="flex-1 max-w-lg">
                <div className="w-full bg-gray-200 rounded-full h-3 shadow-inner">
                  <div
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-3 rounded-full transition-all duration-1000 shadow-sm"
                    style={{ width: isPlaying ? "100%" : "0%" }}
                  ></div>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleDownload}
                className="flex items-center space-x-2 px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md"
              >
                <Download className="w-5 h-5" />
                <span className="font-medium">Download</span>
              </button>

              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-5 py-3 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-md"
              >
                <Share2 className="w-5 h-5" />
                <span className="font-medium">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Speakers */}
        <div className="p-8 border-b border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-5 flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Speakers
          </h3>
          <div className="flex flex-wrap gap-3">
            {podcast.speakers.map((speaker, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-purple-50 px-5 py-3 rounded-full border border-blue-100 hover:shadow-md transition-all duration-300"
              >
                <div className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
                <span className="text-sm font-semibold text-gray-700">
                  {speaker}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Transcript */}
        <div className="p-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-purple-600" />
            Transcript
          </h3>
          <div className="max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            <div className="prose prose-sm max-w-none">
              <div className="whitespace-pre-wrap text-gray-700 leading-relaxed text-base bg-gray-50 p-6 rounded-2xl border border-gray-100">
                {podcast.transcript}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneratedPodcast;
