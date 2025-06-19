import React from 'react';
import { Button } from './Button';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onBack?: () => void;
  className?: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onBack,
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center h-64 ${className}`}>
      <div className="text-center">
        <div className="text-lg text-red-600 mb-4">{message}</div>
        <div className="flex justify-center space-x-4">
          {onRetry && (
            <Button variant="primary" onClick={onRetry}>
              Try Again
            </Button>
          )}
          {onBack && (
            <Button variant="secondary" onClick={onBack}>
              Go Back
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}; 