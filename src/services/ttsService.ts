import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Note: In production, API calls should be made from backend
});

const MAX_CHARACTERS = 4096;

// Voice mapping for different personality types
interface VoiceConfig {
  voice: "alloy" | "echo" | "fable" | "onyx" | "nova" | "shimmer";
  speed: number;
}

const getVoiceForPersonality = (personality: string): VoiceConfig => {
  // Default configuration
  const defaultConfig: VoiceConfig = { voice: "alloy", speed: 1.0 };

  // Convert to lowercase for easier matching
  const personalityLower = personality.toLowerCase();

  // Popular Podcast Hosts
  if (personalityLower.includes("joe rogan")) {
    return { voice: "onyx", speed: 1.1 }; // Deep, conversational voice
  }
  if (personalityLower.includes("lex fridman")) {
    return { voice: "onyx", speed: 0.9 }; // Thoughtful, measured voice
  }
  if (personalityLower.includes("tim ferriss")) {
    return { voice: "echo", speed: 1.0 }; // Clear, analytical voice
  }
  if (personalityLower.includes("sam harris")) {
    return { voice: "fable", speed: 0.95 }; // Calm, philosophical voice
  }
  if (personalityLower.includes("alex cooper")) {
    return { voice: "nova", speed: 1.1 }; // Energetic, engaging female voice
  }
  if (personalityLower.includes("dax shepard")) {
    return { voice: "echo", speed: 1.15 }; // Energetic, casual voice
  }
  if (personalityLower.includes("marc maron")) {
    return { voice: "echo", speed: 1.2 }; // Fast-paced, intense voice
  }
  if (personalityLower.includes("terry gross")) {
    return { voice: "nova", speed: 0.95 }; // Professional, warm female voice
  }
  if (personalityLower.includes("guy raz")) {
    return { voice: "fable", speed: 1.0 }; // Storytelling voice
  }
  if (personalityLower.includes("ezra klein")) {
    return { voice: "echo", speed: 1.05 }; // Analytical, clear voice
  }

  // Expert roles
  if (
    personalityLower.includes("scientist") ||
    personalityLower.includes("researcher")
  ) {
    return { voice: "echo", speed: 0.95 }; // Clear, precise voice
  }
  if (personalityLower.includes("journalist")) {
    return { voice: "fable", speed: 1.0 }; // Professional, neutral voice
  }
  if (
    personalityLower.includes("expert") ||
    personalityLower.includes("executive")
  ) {
    return { voice: "onyx", speed: 1.0 }; // Authoritative voice
  }
  if (personalityLower.includes("interviewer")) {
    return { voice: "echo", speed: 1.0 }; // Clear, engaging voice
  }
  if (personalityLower.includes("host")) {
    return { voice: "fable", speed: 1.0 }; // Balanced, professional voice
  }

  return defaultConfig;
};

// Function to split text into chunks while preserving sentence boundaries
const splitTextIntoChunks = (text: string, maxLength: number): string[] => {
  if (text.length <= maxLength) {
    return [text];
  }

  const chunks: string[] = [];
  let currentChunk = "";

  // Split by sentences first to avoid cutting mid-sentence
  const sentences = text.split(/(?<=[.!?])\s+/);

  for (const sentence of sentences) {
    // If a single sentence is too long, we need to split it further
    if (sentence.length > maxLength) {
      // If we have a current chunk, save it first
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = "";
      }

      // Split the long sentence by words
      const words = sentence.split(" ");
      let wordChunk = "";

      for (const word of words) {
        if ((wordChunk + " " + word).length > maxLength) {
          if (wordChunk.trim()) {
            chunks.push(wordChunk.trim());
          }
          wordChunk = word;
        } else {
          wordChunk = wordChunk ? wordChunk + " " + word : word;
        }
      }

      if (wordChunk.trim()) {
        currentChunk = wordChunk;
      }
    } else {
      // Check if adding this sentence would exceed the limit
      if ((currentChunk + " " + sentence).length > maxLength) {
        if (currentChunk.trim()) {
          chunks.push(currentChunk.trim());
        }
        currentChunk = sentence;
      } else {
        currentChunk = currentChunk ? currentChunk + " " + sentence : sentence;
      }
    }
  }

  // Add the last chunk if it exists
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }

  return chunks;
};

// Function to concatenate multiple ArrayBuffers
const concatenateArrayBuffers = (buffers: ArrayBuffer[]): ArrayBuffer => {
  const totalLength = buffers.reduce(
    (sum, buffer) => sum + buffer.byteLength,
    0
  );
  const result = new Uint8Array(totalLength);
  let offset = 0;

  for (const buffer of buffers) {
    result.set(new Uint8Array(buffer), offset);
    offset += buffer.byteLength;
  }

  return result.buffer;
};

export const generateAudio = async (
  text: string,
  personality?: string
): Promise<Blob> => {
  try {
    // Get voice configuration based on personality
    const voiceConfig = personality
      ? getVoiceForPersonality(personality)
      : { voice: "alloy", speed: 1.0 };

    // Split text into chunks if it's too long
    const textChunks = splitTextIntoChunks(text, MAX_CHARACTERS);
    const audioBuffers: ArrayBuffer[] = [];

    // Generate audio for each chunk
    for (const chunk of textChunks) {
      const response = await openai.audio.speech.create({
        model: "tts-1-hd", // High quality TTS model
        voice: voiceConfig.voice,
        input: chunk,
        response_format: "mp3",
        speed: voiceConfig.speed,
      });

      // Convert the response to an ArrayBuffer
      const arrayBuffer = await response.arrayBuffer();
      audioBuffers.push(arrayBuffer);
    }

    // Concatenate all audio buffers into a single buffer
    const combinedBuffer = concatenateArrayBuffers(audioBuffers);
    return new Blob([combinedBuffer], { type: "audio/mpeg" });
  } catch (error) {
    console.error("Error generating audio:", error);

    // Check if it's a quota error
    if (
      error instanceof Error &&
      (error.message.includes("429") || error.message.includes("quota"))
    ) {
      throw new Error(
        "OpenAI API quota exceeded. Please check your plan and billing details at https://platform.openai.com/account/billing"
      );
    }

    // Check for other API errors
    if (error instanceof Error && error.message.includes("401")) {
      throw new Error(
        "Invalid OpenAI API key. Please check your API key configuration."
      );
    }

    if (error instanceof Error && error.message.includes("403")) {
      throw new Error(
        "Access denied. Please check your OpenAI API permissions."
      );
    }

    throw new Error("Failed to generate audio. Please try again later.");
  }
};
