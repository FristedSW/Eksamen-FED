import React from 'react';
import { Student } from '../../types';
import { Card } from '../ui/Card';

interface StudentCardProps {
  student: Student;
  className?: string;
}

export const StudentCard: React.FC<StudentCardProps> = ({
  student,
  className = '',
}) => {
  return (
    <Card className={`${className}`}>
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{student.name}</h3>
          <p className="text-sm text-gray-600">ID: {student.studentId}</p>
        </div>
        <div className="text-right">
          <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
            {student.order}
          </span>
        </div>
      </div>
    </Card>
  );
}; 