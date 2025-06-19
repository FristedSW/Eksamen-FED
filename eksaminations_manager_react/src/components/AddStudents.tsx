import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Exam, Student } from '../types';

export const AddStudents: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [newStudent, setNewStudent] = useState({ studentId: '', name: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadSelectedExam();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadStudents(selectedExam.id!);
    } else {
      setStudents([]);
    }
  }, [selectedExam]);

  const loadSelectedExam = async () => {
    const examIdParam = searchParams.get('examId');
    if (!examIdParam) {
      setIsLoading(false);
      return;
    }

    try {
      const exam = await api.getExam(examIdParam);
      setSelectedExam(exam);
    } catch (err) {
      setError('Failed to load exam');
      console.error('Error loading exam:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadStudents = async (examId: string) => {
    try {
      const studentsData = await api.getStudentsByExam(examId);
      setStudents(studentsData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load students');
      console.error('Error loading students:', err);
    }
  };

  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExam || !newStudent.studentId || !newStudent.name) return;

    try {
      const student: Omit<Student, 'id'> = {
        examId: selectedExam.id!,
        studentId: newStudent.studentId,
        name: newStudent.name,
        order: students.length + 1,
      };

      await api.addStudent(student);
      setNewStudent({ studentId: '', name: '' });
      await loadStudents(selectedExam.id!);
    } catch (err) {
      setError('Failed to add student');
      console.error('Error adding student:', err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  return (
    <div className="w-[1280px] mx-auto h-[700px] px-4 py-6 text-base">
      <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
        <h1 className="text-lg font-bold text-gray-900 mb-6">
          {selectedExam ? `Add Students - ${selectedExam.courseName}` : 'Add Students'}
        </h1>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!selectedExam ? (
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-center">No exam selected. Please go back to the home page and select an exam.</p>
            <div className="mt-4 text-center">
              <button
                onClick={() => navigate('/')}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Exam Info */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Exam Details</h2>
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
                  <p className="text-sm text-gray-600">Students</p>
                  <p className="font-semibold">{students.length}</p>
                </div>
              </div>
            </div>

            {/* Add Student Form */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Add New Student</h2>
              <form onSubmit={handleAddStudent} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-medium text-gray-700 mb-2">
                    Student ID *
                  </label>
                  <input
                    type="text"
                    id="studentId"
                    value={newStudent.studentId}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, studentId: e.target.value }))}
                    required
                    placeholder="e.g., S001"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Student Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={newStudent.name}
                    onChange={(e) => setNewStudent(prev => ({ ...prev, name: e.target.value }))}
                    required
                    placeholder="e.g., John Doe"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="md:col-span-2">
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
                  >
                    Add Student
                  </button>
                </div>
              </form>
            </div>

            {/* Students List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Students ({students.length})
              </h2>
              {students.length === 0 ? (
                <p className="text-gray-600">No students added yet.</p>
              ) : (
                <div className="overflow-x-auto h-[300px] overflow-auto">
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
                        <tr key={student.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {student.order}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.studentId}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {student.name}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}

        <div className="mt-6">
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
}; 