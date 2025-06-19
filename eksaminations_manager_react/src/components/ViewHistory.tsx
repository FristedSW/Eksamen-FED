import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Exam, Student, ExamSession, StudentWithSession } from '../types';

export const ViewHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [studentsWithSessions, setStudentsWithSessions] = useState<StudentWithSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadExamData();
  }, []);

  const loadExamData = async () => {
    const examIdParam = searchParams.get('examId');
    if (!examIdParam) {
      setError('No exam ID provided');
      setIsLoading(false);
      return;
    }

    try {
      const [exam, studentsData, sessionsData] = await Promise.all([
        api.getExam(examIdParam),
        api.getStudentsByExam(examIdParam),
        api.getExamSessionsByExam(examIdParam)
      ]);

      setSelectedExam(exam);
      setStudents(studentsData.sort((a, b) => a.order - b.order));
      setSessions(sessionsData);

      // Combine students with their sessions
      const studentsWithSessionsData = studentsData.map(student => {
        const session = sessionsData.find(s => s.studentId === student.id);
        return {
          ...student,
          session: session || undefined
        };
      });

      setStudentsWithSessions(studentsWithSessionsData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load exam data');
      console.error('Error loading exam data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateAverageGrade = (): string => {
    const completedSessions = sessions.filter(s => s.completed && s.grade);
    
    if (completedSessions.length === 0) return '-';
    
    const gradeValues = completedSessions.map(s => {
      switch (s.grade) {
        case '12': return 12;
        case '10': return 10;
        case '7': return 7;
        case '4': return 4;
        case '02': return 2;
        case '00': return 0;
        case '-3': return -3;
        default: return 0;
      }
    });

    const averageGradeValue = gradeValues.reduce((sum: number, grade: number) => sum + grade, 0) / gradeValues.length;
    
    // Return the actual average value, not a grade conversion
    return averageGradeValue.toFixed(1);
  };

  const getGradeDistribution = () => {
    const distribution = { '12': 0, '10': 0, '7': 0, '4': 0, '02': 0, '00': 0, '-3': 0 };
    sessions.forEach(session => {
      if (session.grade && distribution.hasOwnProperty(session.grade)) {
        distribution[session.grade as keyof typeof distribution]++;
      }
    });
    return distribution;
  };

  const getAverageExaminationTime = (): string => {
    const completedSessions = sessions.filter(s => s.completed && s.actualExaminationTime !== undefined);
    if (completedSessions.length === 0) return '0:00';
    
    const totalTimeInSeconds = completedSessions.reduce((sum, s) => {
      // Time is already stored in seconds, no conversion needed
      return sum + (s.actualExaminationTime || 0);
    }, 0);
    
    const averageSeconds = totalTimeInSeconds / completedSessions.length;
    return formatTimeFromSeconds(averageSeconds);
  };

  const convertTimeToSeconds = (time: number): number => {
    // Time is already stored in seconds, no conversion needed
    return time;
  };

  const formatTimeFromSeconds = (totalSeconds: number): string => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (error || !selectedExam) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-red-600 text-center mb-4">{error || 'Exam not found'}</p>
          <div className="text-center">
            <button
              onClick={() => navigate('/')}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const gradeDistribution = getGradeDistribution();
  const averageGrade = calculateAverageGrade();
  const averageTime = getAverageExaminationTime();

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Exam Results - {selectedExam.courseName}
          </h1>
        </div>
      </div>

      {/* Exam Details */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mx-4">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Exam Details</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-sm text-gray-600">Course</p>
            <p className="font-semibold">{selectedExam.courseName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Term</p>
            <p className="font-semibold">{selectedExam.examTerm}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Date</p>
            <p className="font-semibold">{selectedExam.date}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Status</p>
            <p className="font-semibold text-green-600">Completed</p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6 mx-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Class Average</h3>
          <div className="text-3xl font-bold text-green-600">{averageGrade}</div>
          <p className="text-sm text-gray-600 mt-1">
            {sessions.filter(s => s.completed).length} of {students.length} students
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Average Time</h3>
          <div className="text-3xl font-bold text-blue-600">{averageTime}</div>
          <p className="text-sm text-gray-600 mt-1">
            Target: {selectedExam.examinationTime} min
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Completion Rate</h3>
          <div className="text-3xl font-bold text-purple-600">
            {Math.round((sessions.filter(s => s.completed).length / students.length) * 100)}%
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {sessions.filter(s => s.completed).length} completed
          </p>
        </div>
      </div>

      {/* Grade Distribution */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6 mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Grade Distribution</h3>
        <div className="grid grid-cols-7 gap-4">
          {(['12', '10', '7', '4', '02', '00', '-3'] as const).map((grade) => (
            <div key={grade} className="text-center">
              <div className="text-2xl font-bold text-gray-800">{grade}</div>
              <div className="text-lg text-gray-600">{gradeDistribution[grade]}</div>
              <div className="text-sm text-gray-500">
                {students.length > 0 ? Math.round((gradeDistribution[grade] / students.length) * 100) : 0}%
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Student Results */}
      <div className="bg-white rounded-lg shadow-md flex-1 flex flex-col mx-4 mb-4">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">Student Results</h3>
        </div>
        {studentsWithSessions.length === 0 ? (
          <div className="p-6">
            <p className="text-gray-600">No students found for this exam.</p>
          </div>
        ) : (
          <div className="flex-1 overflow-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50 sticky top-0 z-10">
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Question
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Time Used
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {studentsWithSessions.map((student) => (
                  <tr key={student.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {student.order}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.studentId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.session?.questionNumber || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {student.session?.actualExaminationTime !== undefined 
                        ? formatTimeFromSeconds(convertTimeToSeconds(student.session.actualExaminationTime))
                        : '-'
                      }
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {student.session?.grade ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          student.session.grade === '12' ? 'bg-green-100 text-green-800' :
                          student.session.grade === '10' ? 'bg-blue-100 text-blue-800' :
                          student.session.grade === '7' ? 'bg-yellow-100 text-yellow-800' :
                          student.session.grade === '4' ? 'bg-orange-100 text-orange-800' :
                          student.session.grade === '02' ? 'bg-red-100 text-red-800' :
                          student.session.grade === '00' ? 'bg-gray-100 text-gray-800' :
                          'bg-red-200 text-red-900'
                        }`}>
                          {student.session.grade}
                        </span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs truncate">
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

      <div className="px-4 py-6">
        <button
          onClick={() => navigate('/')}
          className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}; 