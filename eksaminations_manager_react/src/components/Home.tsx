import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Exam, Student, ExamSession, StudentWithSession, ExamHistory } from '../types';

export const Home: React.FC = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examStudents, setExamStudents] = useState<{ [key: string]: Student[] }>({});
  const [examSessions, setExamSessions] = useState<{ [key: string]: ExamSession[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const examsData = await api.getExams();
      setExams(examsData);
      
      // Load students and sessions for each exam
      const studentsMap: { [key: string]: Student[] } = {};
      const sessionsMap: { [key: string]: ExamSession[] } = {};
      
      for (const exam of examsData) {
        try {
          const [students, sessions] = await Promise.all([
            api.getStudentsByExam(exam.id!),
            api.getExamSessionsByExam(exam.id!)
          ]);
          studentsMap[exam.id!] = students;
          sessionsMap[exam.id!] = sessions;
        } catch (err) {
          console.error(`Failed to load data for exam ${exam.id}:`, err);
          studentsMap[exam.id!] = [];
          sessionsMap[exam.id!] = [];
        }
      }
      setExamStudents(studentsMap);
      setExamSessions(sessionsMap);
    } catch (err) {
      console.error('Error loading exams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'created': return 'bg-blue-100 text-blue-800';
      case 'in-progress': return 'bg-yellow-100 text-yellow-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'created': return 'Ready';
      case 'in-progress': return 'In Progress';
      case 'completed': return 'Completed';
      default: return status;
    }
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

  const calculateAverageGrade = (examId: string): string => {
    const sessions = examSessions[examId] || [];
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

  const calculateAverageTime = (examId: string): string => {
    const sessions = examSessions[examId] || [];
    const completedSessions = sessions.filter(s => s.completed && s.actualExaminationTime !== undefined);
    
    if (completedSessions.length === 0) return '0:00';
    
    const totalTimeInSeconds = completedSessions.reduce((sum, s) => {
      // Time is already stored in seconds, no conversion needed
      return sum + (s.actualExaminationTime || 0);
    }, 0);
    
    const averageSeconds = totalTimeInSeconds / completedSessions.length;
    return formatTimeFromSeconds(averageSeconds);
  };

  const activeExams = exams.filter(exam => exam.status !== 'completed');
  const completedExams = exams.filter(exam => exam.status === 'completed');

  return (
    <div className="h-full flex flex-col">
      <div className="px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Exam Management System</h1>
        </div>
      </div>

      {/* Tabs with Create Exam Button */}
      <div className="bg-white rounded-lg shadow-md w-[1280px] mx-auto h-[500px] mb-4">
        {/* Tab Headers with Create Button */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('active')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'active'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Active Exams ({activeExams.length})
              </button>
              <button
                onClick={() => setActiveTab('history')}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'history'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                History ({completedExams.length})
              </button>
            </nav>
            <Link
              to="/create-exam"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors text-sm font-medium"
            >
              Create Exam
            </Link>
          </div>
        </div>

        {/* Tab Content */}
        <div className="h-full overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-32">
              <div className="text-lg text-gray-600">Loading exams...</div>
            </div>
          ) : activeTab === 'active' ? (
            // Active Exams Tab
            activeExams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No active exams found.</p>
                <Link
                  to="/create-exam"
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
                >
                  Create Your First Exam
                </Link>
              </div>
            ) : (
              <div className="h-full overflow-auto w-full">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
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
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {activeExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{exam.courseName}</div>
                          <div className="text-sm text-gray-500">{exam.numberOfQuestions} questions • {exam.examinationTime} min</div>
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
                          {examStudents[exam.id!]?.length || 0} students
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(exam.status)}`}>
                            {getStatusText(exam.status)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                          {exam.status === 'created' && (
                            <>
                              <Link
                                to={`/add-students?examId=${exam.id}`}
                                className="text-green-600 hover:text-green-900 bg-green-100 hover:bg-green-200 px-3 py-1 rounded-md transition-colors"
                              >
                                Add Students
                              </Link>
                              <Link
                                to={`/start-exam?examId=${exam.id}`}
                                className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                              >
                                Start Exam
                              </Link>
                            </>
                          )}
                          {exam.status === 'in-progress' && (
                            <Link
                              to={`/start-exam?examId=${exam.id}`}
                              className="text-blue-600 hover:text-blue-900 bg-blue-100 hover:bg-blue-200 px-3 py-1 rounded-md transition-colors"
                            >
                              Continue Exam
                            </Link>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          ) : (
            // History Tab
            completedExams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No completed exams found.</p>
              </div>
            ) : (
              <div className="h-full overflow-x-auto">
                <table className="w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50 sticky top-0 z-10">
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
                        Average Grade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200 h-[350px] overflow-y-auto block w-full">
                    {completedExams.map((exam) => (
                      <tr key={exam.id} className="hover:bg-gray-50 table w-full">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{exam.courseName}</div>
                          <div className="text-sm text-gray-500">{exam.numberOfQuestions} questions • {exam.examinationTime} min</div>
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
                          {examStudents[exam.id!]?.length || 0} students
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {calculateAverageGrade(exam.id!)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <Link
                            to={`/history?examId=${exam.id}`}
                            className="text-orange-600 hover:text-orange-900 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-md transition-colors"
                          >
                            View Results
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}; 