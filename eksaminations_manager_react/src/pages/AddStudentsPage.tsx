import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { useStudents } from '../hooks/useStudents';
import { 
  AddStudentForm, 
  StudentTable, 
  Card, 
  Button, 
  ExamInfoCard, 
  LoadingSpinner
} from '../components';

export const AddStudentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const examId = searchParams.get('examId');
  const { students, addStudent, isLoading: studentsLoading } = useStudents(examId || undefined);

  useEffect(() => {
    loadSelectedExam();
  }, []);

  const loadSelectedExam = async () => {
    if (!examId) {
      setIsLoading(false);
      return;
    }

    try {
      const exam = await api.getExam(examId);
      setSelectedExam(exam);
    } catch (err) {
      setError('Failed to load exam');
      console.error('Error loading exam:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddStudent = async (studentData: any) => {
    if (!selectedExam) return;
    
    try {
      await addStudent({
        ...studentData,
        examId: selectedExam.id,
      });
    } catch (err) {
      console.error('Error adding student:', err);
      throw err;
    }
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading..." />;
  }

  return (
    <div className="w-[1280px] mx-auto h-[700px] px-4 py-6 text-base">
      <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-lg font-bold text-gray-900 flex items-center">
            <i className="fas fa-user-plus mr-2"></i>
            {selectedExam ? `Add Students - ${selectedExam.courseName}` : 'Add Students'}
          </h1>
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
            className="mr-2"
          >
            <i className="fas fa-arrow-left mr-2"></i>
            Back to Home
          </Button>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!selectedExam ? (
          <Card>
            <p className="text-gray-600 text-center">No exam selected. Please go back to the home page and select an exam.</p>
            <div className="mt-4 text-center">
              <Button
                variant="secondary"
                onClick={() => navigate('/')}
              >
                Back to Home
              </Button>
            </div>
          </Card>
        ) : (
          <>
            {/* Exam Info */}
            <ExamInfoCard 
              exam={selectedExam} 
              studentCount={students.length} 
              className="mb-6" 
            />

            {/* Add Student Form */}
            <div className="mb-6">
              <AddStudentForm
                onSubmit={handleAddStudent}
                currentStudentCount={students.length}
                isLoading={studentsLoading}
              />
            </div>

            {/* Students List */}
            <Card title={`Students (${students.length})`}>
              {students.length === 0 ? (
                <p className="text-gray-600">No students added yet.</p>
              ) : (
                <div className="h-[300px] overflow-auto">
                  <StudentTable students={students} />
                </div>
              )}
            </Card>
          </>
        )}
      </div>
    </div>
  );
}; 