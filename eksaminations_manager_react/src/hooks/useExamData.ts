import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Exam, Student, ExamSession } from '../types';

interface UseExamDataProps {
  examId?: string;
}

export const useExamData = ({ examId }: UseExamDataProps) => {
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadSelectedExam = async (examIdParam: string) => {
    try {
      const exam = await api.getExam(examIdParam);
      setSelectedExam(exam);
    } catch (err) {
      setError('Failed to load exam');
      console.error('Error loading exam:', err);
    }
  };

  const loadStudents = async (examIdParam: string) => {
    try {
      const studentsData = await api.getStudentsByExam(examIdParam);
      setStudents(studentsData.sort((a, b) => a.order - b.order));
    } catch (err) {
      setError('Failed to load students');
      console.error('Error loading students:', err);
    }
  };

  const loadExamSessions = async (examIdParam: string) => {
    try {
      const sessionsData = await api.getExamSessionsByExam(examIdParam);
      setExamSessions(sessionsData);
    } catch (err) {
      setError('Failed to load exam sessions');
      console.error('Error loading exam sessions:', err);
    }
  };

  const startExam = async () => {
    if (!selectedExam || students.length === 0) return { shouldStart: false, nextStudentIndex: 0 };

    try {
      if (selectedExam.status === 'in-progress') {
        const completedStudentIds = examSessions
          .filter(s => s.completed)
          .map(s => s.studentId);
        
        const nextStudentIndex = students.findIndex(student => 
          !completedStudentIds.includes(student.id!)
        );
        
        if (nextStudentIndex !== -1) {
          setSelectedExam(prev => prev ? { ...prev, status: 'in-progress' } : null);
          return { shouldStart: true, nextStudentIndex };
        } else {
          // All students completed, mark exam as completed
          await api.updateExam(selectedExam.id!, { status: 'completed' });
          setSelectedExam(prev => prev ? { ...prev, status: 'completed' } : null);
          return { shouldStart: false, nextStudentIndex: 0 };
        }
      }

      await api.updateExam(selectedExam.id!, { status: 'in-progress' });
      setSelectedExam(prev => prev ? { ...prev, status: 'in-progress' } : null);
      return { shouldStart: true, nextStudentIndex: 0 };
    } catch (err) {
      setError('Failed to start exam');
      console.error('Error starting exam:', err);
      return { shouldStart: false, nextStudentIndex: 0 };
    }
  };

  const completeExam = async () => {
    if (!selectedExam) return;
    
    try {
      await api.updateExam(selectedExam.id!, { status: 'completed' });
      setSelectedExam(prev => prev ? { ...prev, status: 'completed' } : null);
    } catch (err) {
      setError('Failed to complete exam');
      console.error('Error completing exam:', err);
    }
  };

  const saveSession = async (sessionData: Omit<ExamSession, 'id'>) => {
    try {
      const newSession = await api.createExamSession(sessionData);
      setExamSessions(prev => [...prev, newSession]);
      return newSession;
    } catch (err) {
      setError('Failed to save session');
      console.error('Error saving session:', err);
      throw err;
    }
  };

  const getNextStudentIndex = () => {
    const completedStudentIds = examSessions
      .filter(s => s.completed)
      .map(s => s.studentId);
    
    return students.findIndex(student => 
      !completedStudentIds.includes(student.id!)
    );
  };

  useEffect(() => {
    if (examId) {
      loadSelectedExam(examId);
    } else {
      setIsLoading(false);
    }
  }, [examId]);

  useEffect(() => {
    if (selectedExam) {
      loadStudents(selectedExam.id!);
      loadExamSessions(selectedExam.id!);
    } else {
      setStudents([]);
      setExamSessions([]);
    }
  }, [selectedExam]);

  useEffect(() => {
    if (selectedExam && examSessions.length >= 0) {
      setIsLoading(false);
    }
  }, [selectedExam, students, examSessions]);

  return {
    selectedExam,
    students,
    examSessions,
    isLoading,
    error,
    startExam,
    completeExam,
    saveSession,
    getNextStudentIndex,
  };
}; 