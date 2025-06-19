import React from 'react';
import { Student } from '../../types';

interface StudentTableProps {
  students: Student[];
  className?: string;
}

export const StudentTable: React.FC<StudentTableProps> = ({
  students,
  className = '',
}) => {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Order
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Student ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Name
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <tr key={student.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                  {student.order}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {student.studentId}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {student.name}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}; 