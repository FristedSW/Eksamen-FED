export interface Exam {
  id?: string;
  examTerm: string;
  courseName: string;
  date: string;
  numberOfQuestions: number;
  examinationTime: number;
  startTime: string;
  status: 'created' | 'in-progress' | 'completed';
}

export interface Student {
  id?: string;
  examId: string;
  studentId: string;
  name: string;
  order: number;
}

export interface ExamSession {
  id?: string;
  examId: string;
  studentId: string;
  questionNumber?: number;
  actualExaminationTime?: number;
  notes?: string;
  grade?: '12' | '10' | '7' | '4' | '02' | '00' | '-3';
  completed: boolean;
}

export interface ExamWithStudents extends Exam {
  students: Student[];
}

export interface StudentWithSession extends Student {
  session?: ExamSession;
}

export interface ExamHistory {
  exam: Exam;
  students: StudentWithSession[];
  averageGrade: string;
} 