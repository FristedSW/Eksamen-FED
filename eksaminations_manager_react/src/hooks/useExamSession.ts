import { useState, useEffect, useRef } from 'react';
import { api } from '../services/api';
import { ExamSession } from '../types';

interface UseExamSessionProps {
  examinationTime: number;
}

interface ExamSessionState {
  isTimerRunning: boolean;
  timeRemaining: number;
  timerStartTime: number | null;
  timeExpired: boolean;
  questionNumber: number | null;
  notes: string;
  grade: string;
  showSummary: boolean;
  examinationEnded: boolean;
  currentStudentSummary: {
    name: string;
    studentId: string;
    questionNumber: number;
    timeUsed: string;
    grade: string;
    notes: string;
  } | null;
}

export const useExamSession = ({ examinationTime }: UseExamSessionProps) => {
  const [state, setState] = useState<ExamSessionState>({
    isTimerRunning: false,
    timeRemaining: 0,
    timerStartTime: null,
    timeExpired: false,
    questionNumber: null,
    notes: '',
    grade: '',
    showSummary: false,
    examinationEnded: false,
    currentStudentSummary: null,
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const playAlarmSound = () => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.5);
      
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
    }
  };

  useEffect(() => {
    if (state.isTimerRunning && state.timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setState(prev => {
          if (prev.timeRemaining <= 1) {
            playAlarmSound();
            return {
              ...prev,
              isTimerRunning: false,
              timeRemaining: 0,
              timeExpired: true,
            };
          }
          return {
            ...prev,
            timeRemaining: prev.timeRemaining - 1,
          };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [state.isTimerRunning, state.timeRemaining]);

  const drawQuestion = (totalQuestions: number) => {
    const randomQuestion = Math.floor(Math.random() * totalQuestions) + 1;
    setState(prev => ({ ...prev, questionNumber: randomQuestion }));
  };

  const startExamination = () => {
    if (state.timeExpired || state.examinationEnded) return;
    
    setState(prev => ({
      ...prev,
      isTimerRunning: true,
      timeRemaining: examinationTime * 60,
      timerStartTime: Date.now(),
    }));
  };

  const endExamination = () => {
    setState(prev => ({
      ...prev,
      isTimerRunning: false,
      timerStartTime: null,
      examinationEnded: true,
    }));
  };

  const setNotes = (notes: string) => {
    setState(prev => ({ ...prev, notes }));
  };

  const setGrade = (grade: string) => {
    setState(prev => ({ ...prev, grade }));
  };

  const resetSession = () => {
    setState(prev => ({
      ...prev,
      questionNumber: null,
      notes: '',
      grade: '',
      timeRemaining: 0,
      timerStartTime: null,
      timeExpired: false,
      examinationEnded: false,
    }));
  };

  const showSummary = (summary: ExamSessionState['currentStudentSummary']) => {
    setState(prev => ({
      ...prev,
      showSummary: true,
      currentStudentSummary: summary,
    }));
  };

  const hideSummary = () => {
    setState(prev => ({
      ...prev,
      showSummary: false,
      currentStudentSummary: null,
    }));
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getActualExaminationTime = () => {
    return state.timerStartTime 
      ? Math.floor((Date.now() - state.timerStartTime) / 1000)
      : 0;
  };

  return {
    ...state,
    drawQuestion,
    startExamination,
    endExamination,
    setNotes,
    setGrade,
    resetSession,
    showStudentSummary: showSummary,
    hideSummary,
    formatTime,
    getActualExaminationTime,
  };
}; 