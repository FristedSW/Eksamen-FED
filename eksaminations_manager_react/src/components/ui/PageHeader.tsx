import React from 'react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  children,
  className = '',
}) => {
  return (
    <div className={`px-4 py-6 ${className}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            {subtitle && (
              <p className="text-lg text-gray-600 mt-2">{subtitle}</p>
            )}
          </div>
          {children && (
            <div className="flex items-center space-x-4">
              {children}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 