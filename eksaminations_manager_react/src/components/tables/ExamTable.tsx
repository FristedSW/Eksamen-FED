import React from 'react';
import { Link } from 'react-router-dom';
import { Exam } from '../../types';
import { StatusBadge } from '../ui/StatusBadge';
import { Button } from '../ui/Button';

interface ExamTableProps {
  exams: Exam[];
  studentCounts: { [key: string]: number };
  averageGrades?: { [key: string]: string };
  onViewResults?: (examId: string) => void;
}

export const ExamTable: React.FC<ExamTableProps> = ({
  exams,
  studentCounts,
  averageGrades,
  onViewResults,
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Course
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Term
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Start Time
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Students
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            {averageGrades && (
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Average Grade
              </th>
            )}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {exams.map((exam) => (
            <tr key={exam.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{exam.courseName}</div>
                <div className="text-sm text-gray-500">
                  {exam.numberOfQuestions} questions • {exam.examinationTime} min
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exam.examTerm}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exam.date}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exam.startTime}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {studentCounts[exam.id!] || 0} students
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <StatusBadge status={exam.status} />
              </td>
              {averageGrades && (
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                    {averageGrades[exam.id!] || '-'}
                  </span>
                </td>
              )}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                {exam.status === 'created' && (
                  <>
                    <Link to={`/add-students?examId=${exam.id}`}>
                      <Button variant="success" size="sm">
                        <i className="fas fa-user-plus mr-1"></i>
                        Add Students
                      </Button>
                    </Link>
                    <Link to={`/start-exam?examId=${exam.id}`}>
                      <Button variant="primary" size="sm">
                        <i className="fas fa-play mr-1"></i>
                        Start Exam
                      </Button>
                    </Link>
                  </>
                )}
                {exam.status === 'in-progress' && (
                  <Link to={`/start-exam?examId=${exam.id}`}>
                    <Button variant="primary" size="sm">
                      <i className="fas fa-arrow-right mr-1"></i>
                      Continue
                    </Button>
                  </Link>
                )}
                {exam.status === 'completed' && onViewResults && (
                  <Button 
                    variant="warning" 
                    size="sm" 
                    onClick={() => onViewResults(exam.id!)}
                  >
                    <i className="fas fa-chart-bar mr-1"></i>
                    View Results
                  </Button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 