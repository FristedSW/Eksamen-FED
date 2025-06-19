import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Exam, Student, ExamSession, StudentWithSession } from '../types';
import { 
  Button, 
  Card,
  LoadingSpinner, 
  PageHeader,
  StatisticsCard,
  GradeDistributionCard,
  ResultsTable,
  ExamInfoCard
} from '../components';
import { 
  calculateAverageGrade, 
  getGradeDistribution, 
  getAverageExaminationTime,
  getCompletionRate 
} from '../utils/examCalculations';

export const ViewHistory: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [sessions, setSessions] = useState<ExamSession[]>([]);
  const [studentsWithSessions, setStudentsWithSessions] = useState<StudentWithSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExamData = useCallback(async () => {
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
  }, [searchParams]);

  useEffect(() => {
    loadExamData();
  }, [loadExamData]);

  if (isLoading) {
    return <LoadingSpinner message="Loading exam data..." />;
  }

  if (error || !selectedExam) {
    return (
      <div className="w-[1280px] mx-auto px-4 py-6">
        <Card>
          <p className="text-red-600 text-center mb-4">{error || 'Exam not found'}</p>
          <div className="text-center">
            <Button
              variant="secondary"
              onClick={() => navigate('/')}
            >
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  const gradeDistribution = getGradeDistribution(sessions);
  const averageGrade = calculateAverageGrade(sessions);
  const averageTime = getAverageExaminationTime(sessions);
  const completionRate = getCompletionRate(sessions, students.length);
  const completedSessions = sessions.filter(s => s.completed);

  return (
    <div className="w-[1280px] mx-auto h-[700px] px-4 py-6">
      <div className="bg-white rounded-lg shadow-md p-6 h-full overflow-auto">
        <div className="space-y-6">
          <PageHeader 
            title={`Exam Results - ${selectedExam.courseName}`}
            children={
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            }
          />

          {/* Exam Details */}
          <ExamInfoCard 
            exam={selectedExam}
            studentCount={students.length}
          />

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatisticsCard
              title="Class Average"
              value={averageGrade}
              subtitle={`${completedSessions.length} of ${students.length} students`}
              color="green"
            />
            
            <StatisticsCard
              title="Average Time"
              value={averageTime}
              subtitle={`Target: ${selectedExam.examinationTime} min`}
              color="blue"
            />
            
            <StatisticsCard
              title="Completion Rate"
              value={`${completionRate}%`}
              subtitle={`${completedSessions.length} completed`}
              color="purple"
            />
          </div>

          {/* Grade Distribution */}
          <GradeDistributionCard
            distribution={gradeDistribution}
            totalStudents={students.length}
          />

          {/* Student Results */}
          <div className="bg-white rounded-lg shadow border border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800">Student Results</h3>
            </div>
            <div className="h-[400px]">
              <ResultsTable students={studentsWithSessions} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 