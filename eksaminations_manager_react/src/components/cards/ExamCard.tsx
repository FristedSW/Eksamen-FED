import React from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../../types';
import { Card } from '../ui/Card';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface ExamCardProps {
  exam: Exam;
  studentCount: number;
  averageGrade?: string;
  onViewResults?: () => void;
}

export const ExamCard: React.FC<ExamCardProps> = ({
  exam,
  studentCount,
  averageGrade,
  onViewResults,
}) => {
  return (
    <Card className="hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{exam.courseName}</h3>
          <p className="text-sm text-gray-600">{exam.examTerm}</p>
        </div>
        <StatusBadge status={exam.status} />
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-600">Date</p>
          <p className="font-medium">{exam.date}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Start Time</p>
          <p className="font-medium">{exam.startTime}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Questions</p>
          <p className="font-medium">{exam.numberOfQuestions}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Duration</p>
          <p className="font-medium">{exam.examinationTime} min</p>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {studentCount} students
          {averageGrade && (
            <span className="ml-2 text-green-600 font-medium">
              Avg: {averageGrade}
            </span>
          )}
        </div>
        
        <div className="flex space-x-2">
          {exam.status === 'created' && (
            <>
              <Link to={`/add-students?examId=${exam.id}`}>
                <Button variant="success" size="sm">Add Students</Button>
              </Link>
              <Link to={`/start-exam?examId=${exam.id}`}>
                <Button variant="primary" size="sm">Start Exam</Button>
              </Link>
            </>
          )}
          {exam.status === 'in-progress' && (
            <Link to={`/start-exam?examId=${exam.id}`}>
              <Button variant="primary" size="sm">Continue</Button>
            </Link>
          )}
          {exam.status === 'completed' && onViewResults && (
            <Button variant="warning" size="sm" onClick={onViewResults}>
              View Results
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}; 