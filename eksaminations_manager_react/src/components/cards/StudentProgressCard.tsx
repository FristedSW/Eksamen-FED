import React from 'react';
import { Student } from '../../types';
import { Card } from '../ui/Card';

interface StudentProgressCardProps {
  currentStudent: Student;
  currentIndex: number;
  totalStudents: number;
  courseName?: string;
  examTerm?: string;
  className?: string;
}

export const StudentProgressCard: React.FC<StudentProgressCardProps> = ({
  currentStudent,
  currentIndex,
  totalStudents,
  courseName,
  examTerm,
  className = '',
}) => {
  return (
    <Card className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-base font-semibold text-gray-800">
          Student {currentIndex + 1} of {totalStudents}
        </h2>
        <div className="text-xs text-gray-600">
          {courseName} - {examTerm}
        </div>
      </div>
      <div className="bg-blue-50 p-2 rounded-lg">
        <p className="text-base font-semibold text-blue-900">
          {currentStudent.name} ({currentStudent.studentId})
        </p>
      </div>
    </Card>
  );
}; 