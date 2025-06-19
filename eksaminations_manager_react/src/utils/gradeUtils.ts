export const calculateAverageGrade = (sessions: any[]): string => {
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

export const getGradeDistribution = (sessions: any[]) => {
  const distribution = { '12': 0, '10': 0, '7': 0, '4': 0, '02': 0, '00': 0, '-3': 0 };
  sessions.forEach(session => {
    if (session.grade && distribution.hasOwnProperty(session.grade)) {
      distribution[session.grade as keyof typeof distribution]++;
    }
  });
  return distribution;
};

export const GRADES = ['12', '10', '7', '4', '02', '00', '-3'] as const; 