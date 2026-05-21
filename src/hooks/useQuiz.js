// src/hooks/useQuiz.js
import { useState, useCallback, useRef } from 'react';
import { QUIZ_CONFIG } from '../constants';
import { calculateScore } from '../utils';
import { db } from '../supabase';

const API_BASE = '/api';

const INITIAL_STATE = {
  status: 'idle',
  questions: [],
  currentIndex: 0,
  answers: {},
  timeData: {},
  results: null,
  error: null,
  difficulty: 'medium',
  playerName: '',
  streak: 0,
  maxStreak: 0,
};

export function useQuiz() {
  const [state, setState] = useState(INITIAL_STATE);
  const startTimeRef = useRef(null);
  const questionStartTimeRef = useRef(null);

  const setPartialState = useCallback((updates) => {
    setState(prev => ({ ...prev, ...updates }));
  }, []);

  const generateQuestions = useCallback(async (difficulty = 'medium', playerName = '') => {
    setPartialState({
      status: 'loading',
      error: null,
      difficulty,
      playerName,
      questions: [],
      answers: {},
      timeData: {},
      currentIndex: 0,
      results: null,
      streak: 0,
      maxStreak: 0,
    });

    try {
      const response = await fetch(`${API_BASE}/generate-questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ difficulty, count: QUIZ_CONFIG.totalQuestions }),
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`);
      }

      const data = await response.json();

      if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
        throw new Error('No questions received');
      }

      startTimeRef.current = Date.now();
      questionStartTimeRef.current = Date.now();

      setPartialState({
        status: 'active',
        questions: data.questions,
        currentIndex: 0,
      });

      return { success: true, fallback: data.fallback || false };
    } catch (error) {
      console.error('generateQuestions error:', error);
      setPartialState({
        status: 'error',
        error: error.message || 'Failed to load questions. Please try again.',
      });
      return { success: false, error: error.message };
    }
  }, [setPartialState]);

  const answerQuestion = useCallback((answer) => {
    setState(prev => {
      if (prev.status !== 'active') return prev;

      const timeTaken = questionStartTimeRef.current
        ? Math.round((Date.now() - questionStartTimeRef.current) / 1000)
        : QUIZ_CONFIG.timePerQuestion;

      const currentQuestion = prev.questions[prev.currentIndex];
      const isCorrect = answer === currentQuestion?.answer;
      const newStreak = isCorrect ? prev.streak + 1 : 0;
      const newMaxStreak = Math.max(prev.maxStreak, newStreak);

      const newAnswers = { ...prev.answers, [prev.currentIndex]: answer };
      const newTimeData = { ...prev.timeData, [prev.currentIndex]: timeTaken };

      const isLastQuestion = prev.currentIndex >= prev.questions.length - 1;

      if (isLastQuestion) {
        const scoreData = calculateScore(
          Object.values(newAnswers),
          prev.questions,
          newTimeData,
          prev.difficulty
        );

        const totalTimeTaken = startTimeRef.current
          ? Math.round((Date.now() - startTimeRef.current) / 1000)
          : 0;

        const finalResults = {
          ...scoreData,
          playerName: prev.playerName,
          difficulty: prev.difficulty,
          totalTimeTaken,
          maxStreak: newMaxStreak,
          completedAt: new Date().toISOString(),
        };

        // Submit to leaderboard async
        if (prev.playerName && db) {
          db.submitScore({
            name: prev.playerName,
            score: scoreData.correctCount,
            total: prev.questions.length,
            difficulty: prev.difficulty,
            timeTaken: totalTimeTaken,
            tier: `${scoreData.percentage}%`,
          }).catch(console.error);
        }

        return {
          ...prev,
          answers: newAnswers,
          timeData: newTimeData,
          status: 'finished',
          results: finalResults,
          streak: newStreak,
          maxStreak: newMaxStreak,
        };
      }

      questionStartTimeRef.current = Date.now();

      return {
        ...prev,
        answers: newAnswers,
        timeData: newTimeData,
        currentIndex: prev.currentIndex + 1,
        streak: newStreak,
        maxStreak: newMaxStreak,
      };
    });
  }, []);

  const timeOut = useCallback(() => {
    answerQuestion(null);
  }, [answerQuestion]);

  const resetQuiz = useCallback(() => {
    setState(INITIAL_STATE);
    startTimeRef.current = null;
    questionStartTimeRef.current = null;
  }, []);

  const currentQuestion = state.questions[state.currentIndex] || null;
  const progress = state.questions.length > 0
    ? (state.currentIndex / state.questions.length) * 100
    : 0;

  return {
    status: state.status,
    questions: state.questions,
    currentQuestion,
    currentIndex: state.currentIndex,
    answers: state.answers,
    results: state.results,
    error: state.error,
    difficulty: state.difficulty,
    playerName: state.playerName,
    streak: state.streak,
    maxStreak: state.maxStreak,
    progress,
    generateQuestions,
    answerQuestion,
    timeOut,
    resetQuiz,
    isLoading: state.status === 'loading',
    isActive: state.status === 'active',
    isFinished: state.status === 'finished',
    isError: state.status === 'error',
    isIdle: state.status === 'idle',
    totalQuestions: state.questions.length,
  };
}
