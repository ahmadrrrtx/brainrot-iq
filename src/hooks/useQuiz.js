import { useState, useCallback, useRef } from "react";
import { QUIZ_CONFIG } from "../constants";

export const useQuiz = () => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(QUIZ_CONFIG.timePerQuestion);
  const [totalTime, setTotalTime] = useState(0);
  const timerRef = useRef(null);
  const startTimeRef = useRef(null);

  const startTimer = useCallback((onTimeout) => {
    clearInterval(timerRef.current);
    setTimeLeft(QUIZ_CONFIG.timePerQuestion);
    startTimeRef.current = Date.now();

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  const stopTimer = useCallback(() => {
    clearInterval(timerRef.current);
    const elapsed = Math.round((Date.now() - (startTimeRef.current || Date.now())) / 1000);
    setTotalTime((prev) => prev + elapsed);
  }, []);

  const submitAnswer = useCallback(
    (answerIndex) => {
      if (isAnswered) return;
      stopTimer();
      setSelectedAnswer(answerIndex);
      setIsAnswered(true);

      const currentQ = questions[currentIndex];
      const isCorrect = answerIndex === currentQ?.correctAnswer;

      setAnswers((prev) => [
        ...prev,
        {
          questionIndex: currentIndex,
          selectedAnswer: answerIndex,
          correctAnswer: currentQ?.correctAnswer,
          isCorrect,
          timeSpent: QUIZ_CONFIG.timePerQuestion - timeLeft,
        },
      ]);
    },
    [isAnswered, questions, currentIndex, stopTimer, timeLeft]
  );

  const nextQuestion = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    }
  }, [currentIndex, questions.length]);

  const reset = useCallback(() => {
    clearInterval(timerRef.current);
    setQuestions([]);
    setCurrentIndex(0);
    setAnswers([]);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setIsLoading(false);
    setError(null);
    setTimeLeft(QUIZ_CONFIG.timePerQuestion);
    setTotalTime(0);
  }, []);

  const score = answers.filter((a) => a.isCorrect).length;
  const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
  const isComplete = questions.length > 0 && currentIndex >= questions.length - 1 && isAnswered;

  return {
    questions,
    setQuestions,
    currentIndex,
    answers,
    selectedAnswer,
    isAnswered,
    isLoading,
    setIsLoading,
    error,
    setError,
    timeLeft,
    totalTime,
    score,
    percentage,
    isComplete,
    startTimer,
    stopTimer,
    submitAnswer,
    nextQuestion,
    reset,
    currentQuestion: questions[currentIndex] || null,
    progress: questions.length > 0 ? ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100 : 0,
  };
};
