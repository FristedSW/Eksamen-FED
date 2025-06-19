import React from 'react';
import { getStatusColor, getStatusText } from '../../utils/statusUtils';

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  className = '',
}) => {
  const colorClasses = getStatusColor(status);
  const text = getStatusText(status);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'created':
        return 'fas fa-plus-circle';
      case 'in-progress':
        return 'fas fa-play-circle';
      case 'completed':
        return 'fas fa-check-circle';
      default:
        return 'fas fa-circle';
    }
  };

  return (
    <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${colorClasses} ${className}`}>
      <i className={`${getStatusIcon(status)} mr-1`}></i>
      {text}
    </span>
  );
}; 