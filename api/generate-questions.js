// api/generate-questions.js
// Uses fetch directly - no groq-sdk needed, avoids dependency issues

export default async function handler(req, res) {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const GROQ_API_KEY = process.env.GROQ_API_KEY;

  if (!GROQ_API_KEY) {
    console.error('GROQ_API_KEY not set in environment');
    // Return fallback questions instead of erroring
    return res.status(200).json({
      questions: getFallbackQuestions(10),
      fallback: true,
      reason: 'API key not configured'
    });
  }

  const { difficulty = 'medium', count = 10 } = req.body || {};

  const difficultyDescriptions = {
    easy: 'very mainstream viral content that any social media user would know',
    medium: 'content you need to be chronically online to know - TikTok heavy users, meme culture',
    hard: 'deep cut internet culture only true brainrot masters would know - very niche viral moments'
  };

  const systemPrompt = `You are a brainrot quiz master who creates JSON quiz questions about internet culture. You ONLY respond with valid JSON. Never add markdown, never add text outside the JSON array.`;

  const userPrompt = `Create exactly ${count} multiple choice quiz questions about internet culture, memes, and viral content.

Difficulty: ${difficulty} - ${difficultyDescriptions[difficulty] || difficultyDescriptions.medium}

Topics to cover (mix them):
- TikTok trends, viral dances, sounds (2022-2024)
- Gen-Z and Gen-Alpha slang (rizz, gyatt, skibidi, sigma, based, NPC, slay, bussin, no cap, understood the assignment, main character, touch grass, ratio, mid, W, L, rent free, ate, left no crumbs, it's giving, lowkey, highkey, periodt)
- Viral meme formats and characters (wojak, chad, NPC TikTok trend, Grimace shake, etc.)
- YouTube and Twitch culture (Kai Cenat, xQc, MrBeast, Skibidi Toilet by DaFuq!?Boom!)
- Twitter/X viral moments
- Viral songs used in memes (STAY, Cupid, Running Up That Hill, etc.)
- Gaming meme culture (Among Us, Minecraft, Fortnite memes)
- Anime that became mainstream meme culture

Rules:
1. Questions must be fun and use internet language naturally
2. Wrong answers must be believable but clearly wrong to those who know
3. Shuffle options so correct answer is not always first
4. Keep explanations short and funny (max 15 words)
5. Only return the JSON array, nothing else

Return ONLY this JSON structure (array of ${count} objects):
[{"question":"string","options":["string","string","string","string"],"answer":"string","explanation":"string","category":"string","emoji":"string"}]`;

  try {
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama-3.3-70b-versatile',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.85,
        max_tokens: 3500,
        top_p: 0.9,
        stream: false,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Groq API error:', response.status, errorText);
      throw new Error(`Groq API returned ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error('Empty response from Groq');
    }

    // Parse JSON from response
    let questions = parseQuestionsFromResponse(content, count);

    if (!questions || questions.length === 0) {
      throw new Error('Failed to parse questions');
    }

    return res.status(200).json({ questions, fallback: false });

  } catch (error) {
    console.error('Question generation failed:', error.message);
    // Always return fallback questions so app never breaks
    return res.status(200).json({
      questions: getFallbackQuestions(count),
      fallback: true,
      reason: error.message
    });
  }
}

function parseQuestionsFromResponse(content, count) {
  try {
    // Try direct parse first
    const parsed = JSON.parse(content);
    if (Array.isArray(parsed)) {
      return validateAndCleanQuestions(parsed, count);
    }
    // If object with questions key
    if (parsed.questions && Array.isArray(parsed.questions)) {
      return validateAndCleanQuestions(parsed.questions, count);
    }
  } catch {
    // Try to extract array from content
    const arrayMatch = content.match(/\[[\s\S]*?\]/);
    if (arrayMatch) {
      try {
        const parsed = JSON.parse(arrayMatch[0]);
        if (Array.isArray(parsed)) {
          return validateAndCleanQuestions(parsed, count);
        }
      } catch {
        // ignore
      }
    }
  }
  return null;
}

function validateAndCleanQuestions(questions, count) {
  return questions
    .filter(q => q && q.question && Array.isArray(q.options) && q.options.length >= 2 && q.answer)
    .slice(0, count)
    .map((q, i) => ({
      id: i + 1,
      question: String(q.question).trim(),
      options: q.options.map(o => String(o).trim()).slice(0, 4),
      answer: String(q.answer).trim(),
      explanation: String(q.explanation || 'Internet culture is deep fr').trim(),
      category: String(q.category || 'Internet Culture').trim(),
      emoji: String(q.emoji || '🧠').trim(),
    }));
}

function getFallbackQuestions(count) {
  const allQuestions = [
    {
      id: 1,
      question: "What does 'rizz' mean in Gen-Z slang? ✨",
      options: ["Natural charm and charisma", "Being angry or upset", "Feeling very tired", "A type of hairstyle"],
      answer: "Natural charm and charisma",
      explanation: "Rizz = charisma. W rizz = great charm!",
      category: "Gen-Z Slang",
      emoji: "✨"
    },
    {
      id: 2,
      question: "Skibidi Toilet was created by which YouTube channel? 🚽",
      options: ["DaFuq!?Boom!", "MrBeast", "PewDiePie", "Markiplier"],
      answer: "DaFuq!?Boom!",
      explanation: "DaFuq!?Boom! made it on YouTube - Gen Alpha's show!",
      category: "Viral Content",
      emoji: "🚽"
    },
    {
      id: 3,
      question: "What does 'no cap' mean? 🧢",
      options: ["For real, not lying", "Remove your hat", "No internet signal", "Starting an argument"],
      answer: "For real, not lying",
      explanation: "Cap = lie. No cap = no lie = fr fr!",
      category: "Gen-Z Slang",
      emoji: "🧢"
    },
    {
      id: 4,
      question: "What is 'NPC behavior' on the internet? 🤖",
      options: ["Acting without original thought like a game character", "Playing video games all day", "Being very intelligent", "Going viral on TikTok"],
      answer: "Acting without original thought like a game character",
      explanation: "NPC = Non-Player Character - mindless follower!",
      category: "Internet Culture",
      emoji: "🤖"
    },
    {
      id: 5,
      question: "What does 'understood the assignment' mean? 📝",
      options: ["Someone absolutely nailed what was expected", "Finishing homework early", "Understanding a complex meme", "Being teacher's pet"],
      answer: "Someone absolutely nailed what was expected",
      explanation: "They ate! Left no crumbs. Did it perfectly!",
      category: "Gen-Z Slang",
      emoji: "💅"
    },
    {
      id: 6,
      question: "What does 'based' mean in internet culture? 😎",
      options: ["Confidently yourself despite others' opinions", "Living in a basement", "Having a solid foundation", "Playing bass guitar"],
      answer: "Confidently yourself despite others' opinions",
      explanation: "Based = authentic self-expression. From Lil B!",
      category: "Internet Culture",
      emoji: "😎"
    },
    {
      id: 7,
      question: "What does 'touch grass' tell someone to do? 🌿",
      options: ["Go outside and experience real life", "Start a garden hobby", "Play Minecraft survival", "Do more exercise"],
      answer: "Go outside and experience real life",
      explanation: "You're too online! Go touch actual grass outside!",
      category: "Internet Slang",
      emoji: "🌿"
    },
    {
      id: 8,
      question: "What is a 'W' in internet slang? 🏆",
      options: ["A win or victory", "Something weird", "A wrong answer", "Waving goodbye"],
      answer: "A win or victory",
      explanation: "W = Win, L = Loss. Simple math fr!",
      category: "Internet Slang",
      emoji: "🏆"
    },
    {
      id: 9,
      question: "What does 'it's giving...' mean on TikTok? ✨",
      options: ["Something has a certain vibe or energy", "Donating to charity", "A cooking tutorial intro", "Feeling generous today"],
      answer: "Something has a certain vibe or energy",
      explanation: "It's giving main character! It's giving villain era!",
      category: "TikTok Culture",
      emoji: "✨"
    },
    {
      id: 10,
      question: "What is 'main character energy'? 🌟",
      options: ["Acting like you're the protagonist of life", "Having lots of physical energy", "Being main in a video game", "Leading a friend group"],
      answer: "Acting like you're the protagonist of life",
      explanation: "Living like you're in a movie. Delulu but make it cute!",
      category: "TikTok Culture",
      emoji: "🌟"
    },
    {
      id: 11,
      question: "What does 'sigma male' mean in meme culture? 🐺",
      options: ["A lone wolf who doesn't follow social hierarchies", "The leader of a friend group", "Someone who works out", "A very smart person"],
      answer: "A lone wolf who doesn't follow social hierarchies",
      explanation: "Sigma = lone wolf. Above alpha in the meme hierarchy!",
      category: "Meme Culture",
      emoji: "🐺"
    },
    {
      id: 12,
      question: "What does 'delulu' mean in Gen-Z slang? 💭",
      options: ["Delusional, living in your own fantasy", "Very dull or boring", "Delicious food", "Dedicated to a goal"],
      answer: "Delusional, living in your own fantasy",
      explanation: "Delulu = delusional. 'Delulu is the solulu' is the saying!",
      category: "Gen-Z Slang",
      emoji: "💭"
    },
  ];

  return allQuestions.slice(0, Math.min(count, allQuestions.length));
}
