import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Student } from '../types';

export const useStudents = (examId?: string) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const loadStudents = async (examId: string) => {
    try {
      setIsLoading(true);
      setError('');
      const studentsData = await api.getStudentsByExam(examId);
      setStudents(studentsData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load students');
      console.error('Error loading students:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const addStudent = async (studentData: Omit<Student, 'id'>) => {
    try {
      const newStudent = await api.addStudent(studentData);
      setStudents(prev => [...prev, newStudent].sort((a, b) => a.order - b.order));
      return newStudent;
    } catch (err) {
      setError('Failed to add student');
      throw err;
    }
  };

  useEffect(() => {
    if (examId) {
      loadStudents(examId);
    }
  }, [examId]);

  return {
    students,
    isLoading,
    error,
    loadStudents,
    addStudent,
  };
}; 