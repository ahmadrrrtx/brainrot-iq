// api/generate-questions.js
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY, // Server-side only - no VITE_ prefix
});

export default async function handler(req, res) {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://brainrot-iq.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { difficulty = 'medium', count = 10 } = req.body || {};

  const prompt = `You are the ultimate Gen-Z/Alpha internet culture expert and quiz master. Generate ${count} multiple choice questions about current internet culture, memes, viral trends, brainrot content, and social media phenomena.

TOPIC CATEGORIES (mix all of these):
- TikTok trends, sounds, dances, and viral creators (2023-2024)
- YouTube memes, shorts trends, and viral moments  
- Twitter/X viral moments and trending topics
- Instagram reels trends
- Twitch/gaming culture memes (Kai Cenat, xQc, etc.)
- Gen-Z/Alpha slang (rizz, gyatt, slay, no cap, bussin, understood the assignment, etc.)
- Viral phrases ("skibidi", "sigma", "based", "NPC", "main character energy")
- Popular meme formats (wojak, chad, npc, liminal spaces, etc.)
- Anime that became mainstream meme culture
- Internet beef and drama moments
- Viral songs and audio clips from social media
- Speedrunning and gaming culture
- SoundCloud/hyperpop music culture
- Dark humor and absurdist meme formats

DIFFICULTY: ${difficulty}
- easy: Very mainstream, everyone who uses social media knows it
- medium: You need to be chronically online to know this
- hard: Only true brainrot masters would know this

RULES:
1. Make questions genuinely fun and funny
2. Use internet language naturally in questions
3. Wrong answers should be plausible but clearly wrong to those who know
4. Include specific years/events when relevant
5. Make it feel like a quiz between friends who are chronically online

Return ONLY a valid JSON array with exactly ${count} objects:
[
  {
    "question": "question text here",
    "options": ["correct answer", "wrong answer 2", "wrong answer 3", "wrong answer 4"],
    "answer": "correct answer",
    "explanation": "brief funny explanation why this is correct",
    "category": "category name",
    "emoji": "relevant emoji"
  }
]

IMPORTANT: Shuffle the options so correct answer isn't always first. Return ONLY the JSON array, no other text.`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: 'system',
          content: 'You are a brainrot quiz master. You only respond with valid JSON arrays. Never add markdown formatting, never add text before or after the JSON.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'llama-3.3-70b-versatile',
      temperature: 0.9,
      max_tokens: 4000,
      response_format: { type: 'json_object' },
    });

    let responseText = completion.choices[0]?.message?.content || '[]';
    
    // Parse the response
    let parsed;
    try {
      parsed = JSON.parse(responseText);
      // Handle if it returns {questions: [...]} format
      if (parsed.questions) parsed = parsed.questions;
      if (!Array.isArray(parsed)) parsed = Object.values(parsed)[0];
    } catch {
      // Try to extract JSON array from response
      const match = responseText.match(/\[[\s\S]*\]/);
      if (match) {
        parsed = JSON.parse(match[0]);
      } else {
        throw new Error('Invalid JSON response from AI');
      }
    }

    // Validate structure
    const validated = parsed.slice(0, count).map((q, i) => ({
      id: i + 1,
      question: q.question || 'Question unavailable',
      options: Array.isArray(q.options) ? q.options : ['A', 'B', 'C', 'D'],
      answer: q.answer || q.options?.[0] || 'A',
      explanation: q.explanation || 'No explanation available',
      category: q.category || 'Internet Culture',
      emoji: q.emoji || '🧠',
    }));

    return res.status(200).json({ questions: validated });
  } catch (error) {
    console.error('Groq API Error:', error);
    
    // Fallback questions if AI fails
    const fallbackQuestions = getFallbackQuestions(count);
    return res.status(200).json({ 
      questions: fallbackQuestions,
      fallback: true 
    });
  }
}

function getFallbackQuestions(count) {
  const questions = [
    {
      id: 1,
      question: "What does 'rizz' mean in Gen-Z slang? 🎯",
      options: ["Natural charm and charisma", "Being angry", "Feeling tired", "A type of food"],
      answer: "Natural charm and charisma",
      explanation: "Rizz = W rizz = charisma. Popularized by Kai Cenat!",
      category: "Gen-Z Slang",
      emoji: "✨"
    },
    {
      id: 2,
      question: "Which phrase became synonymous with sigma male culture? 🐺",
      options: ["Sigma grindset", "Alpha mode", "Beta blocked", "Delta force"],
      answer: "Sigma grindset",
      explanation: "The sigma grindset meme took over the internet in 2021-2022",
      category: "Meme Culture",
      emoji: "😤"
    },
    {
      id: 3,
      question: "What is 'NPC behavior' referring to online? 🤖",
      options: ["Acting like a background character with no original thoughts", "Playing video games", "Being very smart", "Going viral on TikTok"],
      answer: "Acting like a background character with no original thoughts",
      explanation: "NPC = Non-Player Character from video games, applied to people who follow trends mindlessly",
      category: "Internet Slang",
      emoji: "🤖"
    },
    {
      id: 4,
      question: "What does 'no cap' mean? 🧢",
      options: ["For real, not lying", "Remove your hat", "No internet connection", "Starting a fight"],
      answer: "For real, not lying",
      explanation: "Cap = lie, so No Cap = no lie = for real fr fr",
      category: "Gen-Z Slang",
      emoji: "🧢"
    },
    {
      id: 5,
      question: "Skibidi Toilet originated from which platform? 🚽",
      options: ["YouTube", "TikTok", "Instagram", "Twitter"],
      answer: "YouTube",
      explanation: "DaFuq!?Boom! created Skibidi Toilet on YouTube and it became Gen Alpha's defining content",
      category: "Viral Content",
      emoji: "🚽"
    },
    {
      id: 6,
      question: "What is 'understood the assignment' referring to? 📝",
      options: ["Someone did something perfectly or exceeded expectations", "Completing homework", "Understanding a meme", "Being in school"],
      answer: "Someone did something perfectly or exceeded expectations",
      explanation: "Popularized by Tay Money's song, means someone absolutely nailed it",
      category: "Gen-Z Slang",
      emoji: "💅"
    },
    {
      id: 7,
      question: "What does 'based' mean in internet culture? 🏆",
      options: ["Being confidently yourself despite what others think", "Living in a basement", "Having a good foundation", "Playing bass guitar"],
      answer: "Being confidently yourself despite what others think",
      explanation: "Based originated from Lil B 'the BasedGod' and evolved to mean authentic self-expression",
      category: "Internet Culture",
      emoji: "😎"
    },
    {
      id: 8,
      question: "What is a 'W' in internet slang? 🏆",
      options: ["A win or victory", "Weird behavior", "Wrong answer", "White flag"],
      answer: "A win or victory",
      explanation: "W = Win, L = Loss. Taking an L or getting a W are standard internet vocabulary now",
      category: "Internet Slang",
      emoji: "🏆"
    },
    {
      id: 9,
      question: "What does 'main character energy' mean? ✨",
      options: ["Acting like you're the protagonist of life", "Being the main character in a video game", "Having lots of energy", "Being very popular"],
      answer: "Acting like you're the protagonist of life",
      explanation: "Main character energy = living life like you're in a movie/show as the protagonist",
      category: "TikTok Culture",
      emoji: "🌟"
    },
    {
      id: 10,
      question: "What is 'touch grass' telling someone to do? 🌿",
      options: ["Go outside and experience real life", "Play Minecraft", "Start a garden", "Exercise more"],
      answer: "Go outside and experience real life",
      explanation: "Touch grass = you're too online, go outside and touch actual grass (real life)",
      category: "Internet Culture",
      emoji: "🌿"
    },
  ];
  return questions.slice(0, count);
}
