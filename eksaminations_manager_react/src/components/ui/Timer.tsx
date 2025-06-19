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
        <div className="text-sm text-gray-600 mt-1 flex items-center justify-center">
          {isExpired ? (
            <>
              <i className="fas fa-exclamation-triangle mr-1"></i>
              Time Expired
            </>
          ) : isRunning ? (
            <>
              <i className="fas fa-clock mr-1"></i>
              Running
            </>
          ) : (
            <>
              <i className="fas fa-pause mr-1"></i>
              Ready
            </>
          )}
        </div>
      </div>
    </div>
  );
}; 