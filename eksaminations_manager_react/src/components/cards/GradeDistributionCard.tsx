import React from 'react';
import { Card } from '../ui/Card';
import { GRADES } from '../../utils/gradeUtils';

interface GradeDistributionCardProps {
  distribution: { [key: string]: number };
  totalStudents: number;
  className?: string;
}

export const GradeDistributionCard: React.FC<GradeDistributionCardProps> = ({
  distribution,
  totalStudents,
  className = '',
}) => {
  return (
    <Card title="Grade Distribution" className={className}>
      <div className="grid grid-cols-7 gap-4">
        {GRADES.map((grade) => (
          <div key={grade} className="text-center">
            <div className="text-2xl font-bold text-gray-800">{grade}</div>
            <div className="text-lg text-gray-600">{distribution[grade] || 0}</div>
            <div className="text-sm text-gray-500">
              {totalStudents > 0 ? Math.round(((distribution[grade] || 0) / totalStudents) * 100) : 0}%
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}; 