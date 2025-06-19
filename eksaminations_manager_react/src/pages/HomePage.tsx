import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useExams } from '../hooks/useExams';
import { calculateAverageGrade } from '../utils/gradeUtils';
import { ErrorMessage } from '../components/ui/ErrorMessage';
import { PageHeader } from '../components/ui/PageHeader';
import { Button } from '../components/ui/Button';
import { TabNavigation } from '../components/ui/TabNavigation';
import { LoadingSpinner } from '../components/ui/LoadingSpinner';
import { ExamTable } from '../components/tables/ExamTable';


export const HomePage: React.FC = () => {
  const { exams, examStudents, examSessions, isLoading, error } = useExams();
  const [activeTab, setActiveTab] = useState<'active' | 'history'>('active');

  const activeExams = exams.filter(exam => exam.status !== 'completed');
  const completedExams = exams.filter(exam => exam.status === 'completed');

  const studentCounts = Object.fromEntries(
    Object.entries(examStudents).map(([examId, students]) => [examId, students.length])
  );

  const averageGrades = Object.fromEntries(
    Object.entries(examSessions).map(([examId, sessions]) => [
      examId, 
      calculateAverageGrade(sessions)
    ])
  );

  const handleViewResults = (examId: string) => {
    window.location.href = `/history?examId=${examId}`;
  };

  const tabs = [
    { id: 'active', label: 'Active Exams', count: activeExams.length },
    { id: 'history', label: 'History', count: completedExams.length }
  ];

  if (error) {
    return <ErrorMessage message={error} />;
  }

  return (
    <div className="h-full flex flex-col">
      <PageHeader 
        title="Exam Management System"
        children={
          <Link to="/create-exam">
            <Button variant="primary" size="sm">
              <i className="fas fa-plus mr-2"></i>
              Create Exam
            </Button>
          </Link>
        }
      />

      {/* Tabs with Create Exam Button */}
      <div className="bg-white rounded-lg shadow-md w-[1280px] mx-auto h-[500px] mb-4">
        {/* Tab Headers */}
        <div className="border-b border-gray-200">
          <div className="flex justify-between items-center px-6">
            <TabNavigation
              tabs={tabs}
              activeTab={activeTab}
              onTabChange={(tabId) => setActiveTab(tabId as 'active' | 'history')}
            />
          </div>
        </div>

        {/* Tab Content */}
        <div className="h-full overflow-hidden">
          {isLoading ? (
            <LoadingSpinner message="Loading exams..." />
          ) : activeTab === 'active' ? (
            // Active Exams Tab
            activeExams.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600 mb-4">No active exams found.</p>
                <Link to="/create-exam">
                  <Button variant="primary">
                    Create Your First Exam
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="h-full overflow-auto w-full">
                <ExamTable
                  exams={activeExams}
                  studentCounts={studentCounts}
                />
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
                <ExamTable
                  exams={completedExams}
                  studentCounts={studentCounts}
                  averageGrades={averageGrades}
                  onViewResults={handleViewResults}
                />
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}; 