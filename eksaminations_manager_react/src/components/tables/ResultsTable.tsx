import React from 'react';
import { StudentWithSession } from '../../types';
import { formatTimeFromSeconds } from '../../utils/timeUtils';

interface ResultsTableProps {
  students: StudentWithSession[];
  className?: string;
}

export const ResultsTable: React.FC<ResultsTableProps> = ({
  students,
  className = '',
}) => {
  const getGradeBadgeClass = (grade: string) => {
    switch (grade) {
      case '12': return 'bg-green-100 text-green-800';
      case '10': return 'bg-blue-100 text-blue-800';
      case '7': return 'bg-yellow-100 text-yellow-800';
      case '4': return 'bg-orange-100 text-orange-800';
      case '02': return 'bg-red-100 text-red-800';
      case '00': return 'bg-gray-100 text-gray-800';
      case '-3': return 'bg-red-200 text-red-900';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={`w-full h-full ${className}`}>
      {students.length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-600">No students found for this exam.</p>
        </div>
      ) : (
        <div className="relative h-full overflow-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 sticky top-0 z-10">
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Order
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Student ID
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Name
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Question
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Time Used
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Grade
                </th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider bg-gray-50">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-4 py-2 whitespace-nowrap text-sm font-medium text-gray-900">
                    {student.order}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {student.studentId}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {student.name}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {student.session?.questionNumber || '-'}
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">
                    {student.session?.actualExaminationTime !== undefined 
                      ? formatTimeFromSeconds(student.session.actualExaminationTime)
                      : '-'
                    }
                  </td>
                  <td className="px-4 py-2 whitespace-nowrap">
                    {student.session?.grade ? (
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getGradeBadgeClass(student.session.grade)}`}>
                        {student.session.grade}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </td>
                  <td className="px-4 py-2 text-sm text-gray-900">
                    <div className="truncate max-w-[200px]">
                      {student.session?.notes || '-'}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}; 