import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: React.ReactNode;
  subtitle?: string;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  title,
  subtitle,
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      {(title || subtitle) && (
        <div className="mb-4">
          {title && (
            <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
          )}
          {subtitle && (
            <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
      )}
      {children}
    </div>
  );
}; 