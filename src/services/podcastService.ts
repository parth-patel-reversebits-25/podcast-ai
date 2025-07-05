import OpenAI from 'openai';
import { PodcastData } from '../App';

interface GeneratePodcastRequest {
  topic: string;
  context: string;
  personalities: string[];
  duration: string;
  podcastStyle?: string;
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: In production, API calls should be made from backend
});

const generateSpeakerNames = (personalities: string[], topic: string): string[] => {
  return personalities.map((personality, index) => {
    // Extract the name from personality templates (e.g., "Shah Rukh Khan style - ..." -> "Shah Rukh Khan")
    if (personality.includes(' style')) {
      const name = personality.split(' style')[0].trim();
      return name;
    }
    
    // For expert roles or custom personalities, use a generic speaker name
    return `Speaker ${index + 1}`;
  });
};

const createPodcastPrompt = (request: GeneratePodcastRequest, speakers: string[]): string => {
  const styleInstructions = {
    'Joe Rogan Style': 'Create a conversational, long-form discussion with curious questioning, philosophical tangents, and casual but deep exploration of topics. Use "dude", "man", and casual language. Include moments of wonder and genuine curiosity.',
    'NPR Style': 'Create a professional, well-researched discussion with balanced perspectives, structured storytelling, and authoritative but accessible language. Focus on informative content with clear explanations.',
    'TED Talk Style': 'Create an educational, inspiring discussion with expert insights, actionable takeaways, and motivational language. Focus on solutions and positive outcomes.',
    'Comedy Podcast Style': 'Create a light-hearted discussion with humor, entertaining banter, and funny observations while still being informative. Include jokes and casual commentary.',
    'Interview Style': 'Create a structured Q&A format with focused questions, expert responses, and professional dialogue. Maintain clear interviewer-interviewee dynamics.',
    'Debate Style': 'Create a discussion with multiple perspectives, constructive disagreement, and balanced arguments. Include challenging questions and different viewpoints.'
  };

  const styleInstruction = styleInstructions[request.podcastStyle as keyof typeof styleInstructions] || styleInstructions['Joe Rogan Style'];

  return `Generate a ${request.duration}-minute podcast transcript in the style of "${request.podcastStyle}".

TOPIC: ${request.topic}

CONTEXT: ${request.context}

SPEAKERS:
${speakers.map((speaker, index) => `- ${speaker}: ${request.personalities[index]}`).join('\n')}

STYLE INSTRUCTIONS: ${styleInstruction}

REQUIREMENTS:
1. Create natural, engaging dialogue between the speakers
2. Include speaker names in brackets like [Speaker Name]:
3. Make the conversation feel authentic and spontaneous
4. Include appropriate reactions, questions, and follow-ups
5. Ensure the content is informative and engaging
6. Target approximately ${Math.floor(parseInt(request.duration) * 150)} words (150 words per minute)
7. Include natural conversation elements like "um", "you know", laughter, etc.
8. Make sure each speaker has a distinct voice and perspective
9. Cover the topic comprehensively within the time limit
10. End with a natural conclusion

Generate the complete transcript now:`;
};

export const generatePodcast = async (request: GeneratePodcastRequest): Promise<PodcastData> => {
  const speakers = generateSpeakerNames(request.personalities, request.topic);
  
  try {
    const prompt = createPodcastPrompt(request, speakers);

    // Generate transcript using OpenAI
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an expert podcast script writer who creates engaging, natural-sounding conversations between multiple speakers. Your transcripts should feel authentic and capture the essence of real podcast discussions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: Math.min(4000, parseInt(request.duration) * 200), // Adjust tokens based on duration
      temperature: 0.8, // Higher creativity for more natural conversations
    });

    const transcript = completion.choices[0]?.message?.content || 'Failed to generate transcript';

    // Generate title and description
    const titleCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a compelling podcast episode title for a ${request.podcastStyle} discussion about "${request.topic}". Make it engaging and clickable. Return only the title, no quotes.`
        }
      ],
      max_tokens: 100,
      temperature: 0.7,
    });

    const descriptionCompletion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "user",
          content: `Generate a compelling 1-2 sentence podcast episode description for a discussion about "${request.topic}" in ${request.podcastStyle}. Make it engaging and informative. Return only the description.`
        }
      ],
      max_tokens: 150,
      temperature: 0.7,
    });

    const title = titleCompletion.choices[0]?.message?.content?.trim() || `${request.topic}: Expert Discussion`;
    const description = descriptionCompletion.choices[0]?.message?.content?.trim() || `An engaging discussion about ${request.topic.toLowerCase()} with expert insights and analysis.`;

    return {
      id: Date.now().toString(),
      title,
      description,
      duration: `${request.duration} minutes`,
      transcript,
      speakers: speakers,
      topic: request.topic,
      context: request.context,
      personalities: request.personalities,
      generatedAt: new Date().toISOString(),
    };
  } catch (error) {
    console.error('Error generating podcast:', error);
    
    // Check if it's a quota error and provide specific feedback
    if (error instanceof Error && error.message.includes('429')) {
      console.warn('OpenAI API quota exceeded. Using enhanced mock data instead.');
    }
    
    // Enhanced fallback with more realistic mock data
    const mockTranscript = generateMockTranscript(request, speakers);
    
    return {
      id: Date.now().toString(),
      title: generateMockTitle(request.topic, request.podcastStyle),
      description: generateMockDescription(request.topic, request.podcastStyle),
      duration: `${request.duration} minutes`,
      transcript: mockTranscript,
      speakers: speakers,
      topic: request.topic,
      context: request.context,
      personalities: request.personalities,
      generatedAt: new Date().toISOString(),
    };
  }
};

const generateMockTitle = (topic: string, style?: string): string => {
  const titles = [
    `Deep Dive: ${topic}`,
    `Understanding ${topic}: Expert Insights`,
    `The Future of ${topic}`,
    `${topic}: What You Need to Know`,
    `Exploring ${topic} with Industry Leaders`,
    `${topic} Unpacked: A Comprehensive Discussion`
  ];
  return titles[Math.floor(Math.random() * titles.length)];
};

const generateMockDescription = (topic: string, style?: string): string => {
  const descriptions = [
    `Join our expert panel as they dive deep into ${topic.toLowerCase()}, exploring its implications and future potential.`,
    `An insightful discussion about ${topic.toLowerCase()} featuring industry experts and thought leaders.`,
    `Discover the latest trends and developments in ${topic.toLowerCase()} through engaging expert conversation.`,
    `Our hosts break down the complexities of ${topic.toLowerCase()} in this comprehensive discussion.`
  ];
  return descriptions[Math.floor(Math.random() * descriptions.length)];
};

const generateMockTranscript = (request: GeneratePodcastRequest, speakers: string[]): string => {
  const styleDialogues = {
    'Joe Rogan Style': {
      opening: `[${speakers[0]}]: Alright, we're live! Today we're diving into ${request.topic}, and man, this is something I've been thinking about a lot lately. ${request.context}`,
      response: `[${speakers[1]}]: Dude, absolutely! You know what's crazy about this? Most people don't realize how deep this rabbit hole goes.`,
      followup: `[${speakers[0]}]: That's exactly what I'm talking about! It's like, when you really start looking into it, everything connects, you know?`,
      insight: `[${speakers[1]}]: One hundred percent. And here's the thing that blows my mind...`,
      conclusion: `[${speakers[0]}]: This has been incredible, man. Where can people learn more about this?`
    },
    'NPR Style': {
      opening: `[${speakers[0]}]: I'm ${speakers[0].split(' ')[0]}, and this is our discussion on ${request.topic}. ${request.context}`,
      response: `[${speakers[1]}]: Thank you for having me. This is indeed a critical issue that deserves our attention.`,
      followup: `[${speakers[0]}]: Can you help our listeners understand why this matters right now?`,
      insight: `[${speakers[1]}]: Certainly. The research shows several key factors at play here...`,
      conclusion: `[${speakers[0]}]: Thank you for this enlightening conversation about ${request.topic}.`
    },
    'TED Talk Style': {
      opening: `[${speakers[0]}]: Welcome to today's exploration of ${request.topic}. ${request.context} What if I told you this could change everything?`,
      response: `[${speakers[1]}]: That's exactly the mindset we need. This isn't just theory - it's actionable insight that can transform how we approach this challenge.`,
      followup: `[${speakers[0]}]: What's the first step people can take today?`,
      insight: `[${speakers[1]}]: Here's what I've learned from working with hundreds of organizations...`,
      conclusion: `[${speakers[0]}]: The future starts with understanding. Thank you for joining us on this journey.`
    }
  };

  const style = request.podcastStyle || 'Joe Rogan Style';
  const dialogue = styleDialogues[style as keyof typeof styleDialogues] || styleDialogues['Joe Rogan Style'];

  return `${dialogue.opening}

${dialogue.response}

${dialogue.followup}

${dialogue.insight}

[${speakers[0]}]: That's fascinating. How do you see this evolving over the next few years?

[${speakers[1]}]: Well, based on current trends and what we're seeing in the research, I think we're at a pivotal moment. The next 2-3 years will be crucial.

[${speakers[0]}]: What should people be watching for?

[${speakers[1]}]: The key indicators are going to be adoption rates, regulatory responses, and how quickly the technology matures. These will tell us everything we need to know about the trajectory.

[${speakers[0]}]: Any final thoughts for our listeners?

[${speakers[1]}]: Stay curious, stay informed, and don't be afraid to engage with these concepts. The future belongs to those who understand and adapt.

${dialogue.conclusion}

[${speakers[1]}]: Thanks for having me. This was a great conversation.`;
};