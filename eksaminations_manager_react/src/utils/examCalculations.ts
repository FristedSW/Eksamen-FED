import { ExamSession } from '../types';

export const calculateAverageGrade = (sessions: ExamSession[]): string => {
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
  return averageGradeValue.toFixed(1);
};

export const getGradeDistribution = (sessions: ExamSession[]) => {
  const distribution = { '12': 0, '10': 0, '7': 0, '4': 0, '02': 0, '00': 0, '-3': 0 };
  sessions.forEach(session => {
    if (session.grade && distribution.hasOwnProperty(session.grade)) {
      distribution[session.grade as keyof typeof distribution]++;
    }
  });
  return distribution;
};

export const getAverageExaminationTime = (sessions: ExamSession[]): string => {
  const completedSessions = sessions.filter(s => s.completed && s.actualExaminationTime !== undefined);
  if (completedSessions.length === 0) return '0:00';
  
  const totalTimeInSeconds = completedSessions.reduce((sum, s) => {
    return sum + (s.actualExaminationTime || 0);
  }, 0);
  
  const averageSeconds = totalTimeInSeconds / completedSessions.length;
  return formatTimeFromSeconds(averageSeconds);
};

export const formatTimeFromSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const getCompletionRate = (sessions: ExamSession[], totalStudents: number): number => {
  const completedSessions = sessions.filter(s => s.completed);
  return Math.round((completedSessions.length / totalStudents) * 100);
};

export const getNextStudentIndex = (students: any[], sessions: ExamSession[]): number => {
  const completedStudentIds = sessions
    .filter(s => s.completed)
    .map(s => s.studentId);
  
  return students.findIndex(student => 
    !completedStudentIds.includes(student.id!)
  );
}; 