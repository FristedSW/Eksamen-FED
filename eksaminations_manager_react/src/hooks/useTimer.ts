import { useState, useEffect, useRef } from 'react';
import { playAlarmSound } from '../utils/audioUtils';

export const useTimer = (duration: number) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [isRunning, setIsRunning] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setIsRunning(true);
    setIsExpired(false);
    setTimeRemaining(duration);
    setStartTime(Date.now());
  };

  const stopTimer = () => {
    setIsRunning(false);
    setStartTime(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const resetTimer = () => {
    stopTimer();
    setTimeRemaining(duration);
    setIsExpired(false);
  };

  const getElapsedTime = (): number => {
    if (!startTime) return 0;
    return Math.floor((Date.now() - startTime) / 1000);
  };

  useEffect(() => {
    if (isRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsExpired(true);
            playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isRunning, timeRemaining]);

  return {
    timeRemaining,
    isRunning,
    isExpired,
    startTime,
    startTimer,
    stopTimer,
    resetTimer,
    getElapsedTime,
  };
}; 