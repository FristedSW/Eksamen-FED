import { Exam, Student, ExamSession } from '../types';

const API_BASE_URL = 'http://localhost:3001';

export const api = {
  // Exam endpoints
  async getExams(): Promise<Exam[]> {
    const response = await fetch(`${API_BASE_URL}/exams`);
    return response.json();
  },

  async getExam(id: string): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch exam ${id}: ${response.status} ${response.statusText}`);
    }
    return response.json();
  },

  async createExam(exam: Omit<Exam, 'id'>): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exam),
    });
    return response.json();
  },

  async updateExam(id: string, exam: Partial<Exam>): Promise<Exam> {
    const response = await fetch(`${API_BASE_URL}/exams/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(exam),
    });
    return response.json();
  },

  // Student endpoints
  async getStudentsByExam(examId: string): Promise<Student[]> {
    const response = await fetch(`${API_BASE_URL}/students?examId=${examId}`);
    return response.json();
  },

  async addStudent(student: Omit<Student, 'id'>): Promise<Student> {
    const response = await fetch(`${API_BASE_URL}/students`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(student),
    });
    return response.json();
  },

  // Exam Session endpoints
  async getExamSessionsByExam(examId: string): Promise<ExamSession[]> {
    const response = await fetch(`${API_BASE_URL}/examSessions?examId=${examId}`);
    return response.json();
  },

  async createExamSession(session: Omit<ExamSession, 'id'>): Promise<ExamSession> {
    const response = await fetch(`${API_BASE_URL}/examSessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    return response.json();
  },

  async updateExamSession(id: string, session: Partial<ExamSession>): Promise<ExamSession> {
    const response = await fetch(`${API_BASE_URL}/examSessions/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(session),
    });
    return response.json();
  },
}; 