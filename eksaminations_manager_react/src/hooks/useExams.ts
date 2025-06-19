import { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Exam, Student, ExamSession } from '../types';

export const useExams = () => {
  const [exams, setExams] = useState<Exam[]>([]);
  const [examStudents, setExamStudents] = useState<{ [key: string]: Student[] }>({});
  const [examSessions, setExamSessions] = useState<{ [key: string]: ExamSession[] }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadExams = async () => {
    try {
      setIsLoading(true);
      setError('');
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
      setError('Error loading exams');
      console.error('Error loading exams:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const createExam = async (examData: Omit<Exam, 'id'>) => {
    try {
      const newExam = await api.createExam(examData);
      setExams(prev => [...prev, newExam]);
      return newExam;
    } catch (err) {
      setError('Failed to create exam');
      throw err;
    }
  };

  const updateExam = async (id: string, examData: Partial<Exam>) => {
    try {
      const updatedExam = await api.updateExam(id, examData);
      setExams(prev => prev.map(exam => exam.id === id ? updatedExam : exam));
      return updatedExam;
    } catch (err) {
      setError('Failed to update exam');
      throw err;
    }
  };

  useEffect(() => {
    loadExams();
  }, []);

  return {
    exams,
    examStudents,
    examSessions,
    isLoading,
    error,
    loadExams,
    createExam,
    updateExam,
  };
}; 