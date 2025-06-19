import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  className?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  message = 'Loading...',
  className = '',
}) => {
  return (
    <div className={`flex justify-center items-center h-64 ${className}`}>
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <div className="text-lg text-gray-600">{message}</div>
      </div>
    </div>
  );
}; 