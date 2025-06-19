import React from 'react';
import { formatTimeFromSeconds } from '../../utils/timeUtils';

interface TimerProps {
  timeRemaining: number;
  isRunning: boolean;
  isExpired: boolean;
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  isRunning,
  isExpired,
  className = '',
}) => {
  const getTimerColor = () => {
    if (isExpired) return 'text-red-600';
    if (timeRemaining <= 60) return 'text-yellow-600';
    return 'text-blue-600';
  };

  const getTimerBg = () => {
    if (isExpired) return 'bg-red-100';
    if (timeRemaining <= 60) return 'bg-yellow-100';
    return 'bg-blue-100';
  };

  return (
    <div className={`text-center ${className}`}>
      <div className={`inline-block px-6 py-4 rounded-lg ${getTimerBg()}`}>
        <div className={`text-4xl font-bold ${getTimerColor()}`}>
          {formatTimeFromSeconds(timeRemaining)}
        </div>
        <div className="text-sm text-gray-600 mt-1">
          {isExpired ? 'Time Expired' : isRunning ? 'Running' : 'Ready'}
        </div>
      </div>
    </div>
  );
}; 