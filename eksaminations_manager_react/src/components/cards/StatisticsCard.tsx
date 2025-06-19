import React from 'react';
import { Card } from '../ui/Card';

interface StatisticsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  color?: 'green' | 'blue' | 'purple' | 'red' | 'yellow' | 'orange';
  className?: string;
}

export const StatisticsCard: React.FC<StatisticsCardProps> = ({
  title,
  value,
  subtitle,
  color = 'green',
  className = '',
}) => {
  const colorClasses = {
    green: 'text-green-600',
    blue: 'text-blue-600',
    purple: 'text-purple-600',
    red: 'text-red-600',
    yellow: 'text-yellow-600',
    orange: 'text-orange-600',
  };

  return (
    <Card className={className}>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
      <div className={`text-3xl font-bold ${colorClasses[color]}`}>{value}</div>
      {subtitle && (
        <p className="text-sm text-gray-600 mt-1">{subtitle}</p>
      )}
    </Card>
  );
}; 