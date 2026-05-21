import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import NameModal from "../components/NameModal";
import Timer from "../components/Timer";
import LoadingScreen from "../components/LoadingScreen";
import { useSound } from "../hooks/useSound";
import { storage } from "../utils";
import {
  PLAYER_NAME_KEY,
  PLAYER_ID_KEY,
  QUIZ_CONFIG,
  ANSWER_LETTERS,
  LOADING_MESSAGES,
} from "../constants";

// ─── Groq AI prompt ───────────────────────
const buildPrompt = (name) => `You are a Gen-Z internet culture expert generating questions for the "Brainrot IQ Test".

Player name: ${name}

Generate EXACTLY ${QUIZ_CONFIG.totalQuestions} multiple-choice questions testing knowledge of:
- Gen-Z slang (rizz, gyatt, slay, based, cope, mewing, looksmaxxing, etc.)
- Internet culture (sigma, NPC, ohio, skibidi, ratio, no cap, bussin)
- Viral memes and trends (2020-2024)
- Brainrot vocabulary and expressions
- TikTok/YouTube/Twitter culture

STRICT RULES:
1. Each question must have exactly 4 options labeled 0, 1, 2, 3
2. Exactly ONE correct answer per question
3. Questions must be fun, punchy, and 15 words max
4. Wrong answers must be plausible but clearly wrong to someone who knows
5. Vary difficulty: 3 easy, 4 medium, 3 hard
6. Reference ${name} in at least 2 questions for personalization
7. NEVER repeat similar questions

Return ONLY valid JSON with zero markdown, zero explanation:
{
  "questions": [
    {
      "question": "What does 'no cap' mean in Gen-Z speak?",
      "options": ["I'm lying", "I'm serious/truthful", "I don't care", "That's boring"],
      "correctAnswer": 1,
      "difficulty": "easy",
      "category": "slang"
    }
  ]
}`;

// ─── Quiz Header ─────────────────────────
function QuizHeader({ currentIndex, total, progress, playerName }) {
  return (
    <div className="mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="text-xl">🧠</div>
          <div>
            <div className="text-white font-semibold text-sm">{playerName}</div>
            <div className="text-white/40 text-xs">Brainrot Test</div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-white/60 text-sm font-medium">
            Question <span className="text-purple-300 font-bold">{currentIndex + 1}</span>
            <span className="text-white/30">/{total}</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

// ─── Question Card ─────────────────────────
function QuestionCard({ question, options, selectedAnswer, isAnswered, onAnswer, timeLeft }) {
  const [animKey, setAnimKey] = useState(0);

  useEffect(() => {
    setAnimKey((prev) => prev + 1);
  }, [question]);

  return (
    <div key={animKey} className="animate-fade-up">
      {/* Question */}
      <div className="glass-card p-6 mb-4">
        <div className="flex items-start justify-between gap-4">
          <p className="text-white font-semibold text-lg leading-snug flex-1">{question}</p>
          <Timer timeLeft={timeLeft} />
        </div>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {options.map((option, idx) => {
          let className = "option-btn";
          if (isAnswered) {
            if (idx === selectedAnswer?.correct) className += " correct";
            else if (idx === selectedAnswer?.selected && !selectedAnswer?.isCorrect)
              className += " incorrect";
          }

          return (
            <button
              key={idx}
              onClick={() => !isAnswered && onAnswer(idx)}
              disabled={isAnswered}
              className={className}
              style={{ animationDelay: `${idx * 60}ms` }}
            >
              <div className="flex items-center gap-3">
                <span className="option-letter">{ANSWER_LETTERS[idx]}</span>
                <span>{option}</span>
                {isAnswered && idx === selectedAnswer?.correct && (
                  <span className="ml-auto text-green-400">✓</span>
                )}
                {isAnswered && idx === selectedAnswer?.selected && !selectedAnswer?.isCorrect && (
                  <span className="ml-auto text-red-400">✗</span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

// ─── MAIN QUIZ ────────────────────────────
export default function Quiz() {
  const navigate = useNavigate();
  const { sounds } = useSound();
  const [playerName, setPlayerName] = useState(storage.get(PLAYER_NAME_KEY, ""));
  const [playerId] = useState(storage.get(PLAYER_ID_KEY, ""));
  const [showModal, setShowModal] = useState(!storage.get(PLAYER_NAME_KEY, ""));
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.timePerQuestion);
  const timerRef = useRef(null);

  // ─── Fetch Questions ─────────────────────
  const fetchQuestions = useCallback(async (name) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            {
              role: "system",
              content:
                "You are a JSON-only API. You ONLY output valid JSON. No markdown, no explanation, no backticks. Pure JSON only.",
            },
            {
              role: "user",
              content: buildPrompt(name),
            },
          ],
          temperature: 0.85,
          max_tokens: 2500,
          top_p: 1,
          stream: false,
        }),
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      let raw = data.choices?.[0]?.message?.content?.trim() || "";

      // Clean markdown if any
      raw = raw.replace(/```json\n?/gi, "").replace(/```\n?/gi, "").trim();

      const parsed = JSON.parse(raw);
      if (!parsed.questions || !Array.isArray(parsed.questions)) {
        throw new Error("Invalid question format");
      }

      const validated = parsed.questions
        .filter(
          (q) =>
            q.question &&
            Array.isArray(q.options) &&
            q.options.length === 4 &&
            typeof q.correctAnswer === "number"
        )
        .slice(0, QUIZ_CONFIG.totalQuestions);

      if (validated.length < 3) throw new Error("Not enough valid questions");

      setQuestions(validated);
      setCurrentIndex(0);
      setAnswers([]);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } catch (err) {
      console.error("Quiz fetch error:", err);
      setError(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  // ─── Timer ───────────────────────────────
  const startTimer = useCallback(() => {
    clearInterval(timerRef.current);
    setTimeLeft(QUIZ_CONFIG.timePerQuestion);
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        if (prev <= 5) sounds.tick();
        return prev - 1;
      });
    }, 1000);
  }, [sounds]);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
  }, []);

  // Start timer when question changes
  useEffect(() => {
    if (questions.length > 0 && !isAnswered) {
      startTimer();
    }
    return () => clearInterval(timerRef.current);
  }, [currentIndex, questions.length]);

  // ─── Handle timeout ───────────────────────
  const handleTimeout = useCallback(() => {
    if (isAnswered) return;
    stopTimer();
    sounds.incorrect();
    setSelectedAnswer({ selected: -1, correct: questions[currentIndex]?.correctAnswer, isCorrect: false });
    setIsAnswered(true);
    setAnswers((prev) => [
      ...prev,
      {
        questionIndex: currentIndex,
        selectedAnswer: -1,
        correctAnswer: questions[currentIndex]?.correctAnswer,
        isCorrect: false,
        timedOut: true,
        timeSpent: QUIZ_CONFIG.timePerQuestion,
      },
    ]);
  }, [isAnswered, questions, currentIndex, stopTimer, sounds]);

  // ─── Handle answer ────────────────────────
  const handleAnswer = useCallback(
    (idx) => {
      if (isAnswered) return;
      stopTimer();

      const currentQ = questions[currentIndex];
      const isCorrect = idx === currentQ.correctAnswer;

      if (isCorrect) sounds.correct();
      else sounds.incorrect();

      setSelectedAnswer({
        selected: idx,
        correct: currentQ.correctAnswer,
        isCorrect,
      });
      setIsAnswered(true);
      setAnswers((prev) => [
        ...prev,
        {
          questionIndex: currentIndex,
          selectedAnswer: idx,
          correctAnswer: currentQ.correctAnswer,
          isCorrect,
          timeSpent: QUIZ_CONFIG.timePerQuestion - timeLeft,
        },
      ]);
    },
    [isAnswered, questions, currentIndex, stopTimer, sounds, timeLeft]
  );

  // ─── Next question ────────────────────────
  const handleNext = useCallback(() => {
    sounds.click();
    if (currentIndex >= questions.length - 1) {
      // Quiz complete
      const score = [...answers, ...[]].filter((a) => a.isCorrect).length;
      const allAnswers = answers;
      const correctCount = allAnswers.filter((a) => a.isCorrect).length;

      navigate("/results", {
        state: {
          answers,
          questions,
          playerName,
          playerId,
          score: correctCount,
          total: questions.length,
        },
      });
    } else {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
      setTimeLeft(QUIZ_CONFIG.timePerQuestion);
    }
  }, [answers, currentIndex, questions, navigate, playerName, playerId, sounds]);

  // ─── On name confirm ─────────────────────
  const handleNameConfirm = (name, id) => {
    setPlayerName(name);
    setShowModal(false);
    fetchQuestions(name);
  };

  // Initial load
  useEffect(() => {
    if (playerName && questions.length === 0 && !isLoading) {
      fetchQuestions(playerName);
    }
  }, [playerName]);

  // ─── Render ───────────────────────────────
  if (showModal) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <NameModal onConfirm={handleNameConfirm} />
      </div>
    );
  }

  if (isLoading) {
    return <LoadingScreen message={`Cooking up questions for ${playerName}... 🧠`} />;
  }

  if (error) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card p-10 max-w-md w-full text-center">
          <div className="text-5xl mb-4">😵</div>
          <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
          <p className="text-white/50 text-sm mb-6">{error}</p>
          <button
            onClick={() => fetchQuestions(playerName)}
            className="btn-neon w-full"
          >
            Try Again ⚡
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return <LoadingScreen message="Initializing brainrot detector..." />;
  }

  const currentQ = questions[currentIndex];
  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <QuizHeader
          currentIndex={currentIndex}
          total={questions.length}
          progress={progress}
          playerName={playerName}
        />

        {/* Question */}
        <QuestionCard
          question={currentQ.question}
          options={currentQ.options}
          selectedAnswer={selectedAnswer}
          isAnswered={isAnswered}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
        />

        {/* Answer feedback & Next button */}
        {isAnswered && (
          <div className="mt-6 animate-fade-up">
            {/* Feedback */}
            <div className={`glass-card p-4 mb-4 flex items-center gap-3 ${
              selectedAnswer?.isCorrect
                ? "border-green-500/30 bg-green-500/5"
                : "border-red-500/30 bg-red-500/5"
            }`}>
              <span className="text-2xl">
                {selectedAnswer?.isCorrect ? "✅" : selectedAnswer?.timedOut ? "⏰" : "❌"}
              </span>
              <div>
                <p className={`font-semibold text-sm ${
                  selectedAnswer?.isCorrect ? "text-green-300" : "text-red-300"
                }`}>
                  {selectedAnswer?.isCorrect
                    ? "Correct! You actually know things 🔥"
                    : selectedAnswer?.timedOut
                    ? "Time's up! Skill issue detected ⏰"
                    : "Nah that's not it chief ❌"}
                </p>
                {!selectedAnswer?.isCorrect && selectedAnswer?.correct >= 0 && (
                  <p className="text-white/50 text-xs mt-0.5">
                    Correct answer: {currentQ.options[selectedAnswer.correct]}
                  </p>
                )}
              </div>
            </div>

            {/* Score tracker */}
            <div className="flex items-center justify-between mb-4 px-1">
              <span className="text-white/40 text-sm">
                ✅ {answers.filter((a) => a.isCorrect).length} correct
              </span>
              <span className="text-white/40 text-sm">
                {currentIndex < questions.length - 1
                  ? `${questions.length - currentIndex - 1} left`
                  : "Last question!"}
              </span>
            </div>

            <button
              onClick={handleNext}
              className="btn-neon w-full flex items-center justify-center gap-2 text-base"
            >
              {currentIndex >= questions.length - 1 ? (
                <>See My Results 🏆</>
              ) : (
                <>Next Question →</>
              )}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
