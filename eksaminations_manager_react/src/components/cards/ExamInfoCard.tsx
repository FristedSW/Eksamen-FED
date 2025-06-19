import React from 'react';
import { Exam } from '../../types';
import { Card } from '../ui/Card';

interface ExamInfoCardProps {
  exam: Exam;
  studentCount?: number;
  className?: string;
}

export const ExamInfoCard: React.FC<ExamInfoCardProps> = ({
  exam,
  studentCount,
  className = '',
}) => {
  return (
    <Card title="Exam Details" className={className}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div>
          <p className="text-sm text-gray-600">Course</p>
          <p className="font-semibold">{exam.courseName}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Term</p>
          <p className="font-semibold">{exam.examTerm}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-semibold">{exam.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Students</p>
          <p className="font-semibold">{studentCount || 0}</p>
        </div>
      </div>
    </Card>
  );
}; 