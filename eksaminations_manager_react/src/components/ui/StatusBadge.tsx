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

  return (
    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${colorClasses} ${className}`}>
      {text}
    </span>
  );
}; 