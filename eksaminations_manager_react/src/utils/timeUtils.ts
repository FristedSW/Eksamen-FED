export const formatTimeFromSeconds = (totalSeconds: number): string => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
};

export const convertTimeToSeconds = (time: number): number => {
  // Time is already stored in seconds, no conversion needed
  return time;
};

export const calculateAverageTime = (sessions: any[], examinationTime: number): string => {
  const completedSessions = sessions.filter(s => s.completed && s.actualExaminationTime !== undefined);
  
  if (completedSessions.length === 0) return '0:00';
  
  const totalTimeInSeconds = completedSessions.reduce((sum, s) => {
    return sum + (s.actualExaminationTime || 0);
  }, 0);
  
  const averageSeconds = totalTimeInSeconds / completedSessions.length;
  return formatTimeFromSeconds(averageSeconds);
}; 