import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { api } from '../services/api';
import { Exam, Student, ExamSession } from '../types';

export const StartExam: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [currentSession, setCurrentSession] = useState<ExamSession | null>(null);
  const [questionNumber, setQuestionNumber] = useState<number | null>(null);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [notes, setNotes] = useState('');
  const [grade, setGrade] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [examSessions, setExamSessions] = useState<ExamSession[]>([]);
  const [showSummary, setShowSummary] = useState(false);
  const [currentStudentSummary, setCurrentStudentSummary] = useState<{
    name: string;
    studentId: string;
    questionNumber: number;
    timeUsed: string;
    grade: string;
    notes: string;
  } | null>(null);
  const [timeExpired, setTimeExpired] = useState(false);
  
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const grades = ['12', '10', '7', '4', '02', '00', '-3'];

  useEffect(() => {
    loadSelectedExam();
  }, []);

  useEffect(() => {
    if (selectedExam) {
      loadStudents(selectedExam.id!);
      loadExamSessions(selectedExam.id!);
    } else {
      setStudents([]);
      setExamSessions([]);
    }
  }, [selectedExam]);

  const playAlarmSound = () => {
    try {
      // Create audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      // Create oscillator for alarm sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Set alarm sound properties
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.3);
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.4);
      oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.5);
      
      // Set volume
      gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1);
      
      // Start and stop the alarm
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 1);
    } catch (error) {
      console.error('Failed to play alarm sound:', error);
      // Fallback to the original audio element
      if (audioRef.current) {
        audioRef.current.play().catch(console.error);
      }
    }
  };

  useEffect(() => {
    if (isTimerRunning && timeRemaining > 0) {
      timerRef.current = setTimeout(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            setTimeExpired(true);
            // Play alarm sound when time is up
            playAlarmSound();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [isTimerRunning, timeRemaining]);

  useEffect(() => {
    setTimeExpired(false);
  }, [currentStudentIndex, isExamStarted]);

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

  const loadExamSessions = async (examId: string) => {
    try {
      const sessionsData = await api.getExamSessionsByExam(examId);
      setExamSessions(sessionsData);
    } catch (err) {
      setError('Failed to load exam sessions');
      console.error('Error loading exam sessions:', err);
    }
  };

  const startExam = async () => {
    if (!selectedExam || students.length === 0) return;

    try {
      if (selectedExam.status === 'in-progress') {
        const completedStudentIds = examSessions
          .filter(s => s.completed)
          .map(s => s.studentId);
        
        const nextStudentIndex = students.findIndex(student => 
          !completedStudentIds.includes(student.id!)
        );
        
        if (nextStudentIndex !== -1) {
          setCurrentStudentIndex(nextStudentIndex);
          setIsExamStarted(true);
          return;
        }
      }

      await api.updateExam(selectedExam.id!, { status: 'in-progress' });
      setIsExamStarted(true);
      setCurrentStudentIndex(0);
      setSelectedExam(prev => prev ? { ...prev, status: 'in-progress' } : null);
    } catch (err) {
      setError('Failed to start exam');
      console.error('Error starting exam:', err);
    }
  };

  const drawQuestion = () => {
    if (!selectedExam) return;
    
    const randomQuestion = Math.floor(Math.random() * selectedExam.numberOfQuestions) + 1;
    setQuestionNumber(randomQuestion);
  };

  const startExamination = () => {
    if (!selectedExam || !questionNumber || timeExpired) return;
    setIsTimerRunning(true);
    setTimeRemaining(selectedExam.examinationTime * 60);
    setTimerStartTime(Date.now());
  };

  const endExamination = () => {
    setIsTimerRunning(false);
    setTimerStartTime(null);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
  };

  const saveGrade = async () => {
    if (!selectedExam || !grade || currentStudentIndex >= students.length) return;

    const currentStudent = students[currentStudentIndex];
    let actualTimeUsedInSeconds = 0;
    
    if (timerStartTime) {
      const currentTime = Date.now();
      actualTimeUsedInSeconds = Math.floor((currentTime - timerStartTime) / 1000);
    } else {
      const totalTimeInSeconds = selectedExam.examinationTime * 60;
      actualTimeUsedInSeconds = totalTimeInSeconds - timeRemaining;
    }

    const minutes = Math.floor(actualTimeUsedInSeconds / 60);
    const seconds = actualTimeUsedInSeconds % 60;
    const timeUsedFormatted = `${minutes}:${seconds.toString().padStart(2, '0')}`;

    setCurrentStudentSummary({
      name: currentStudent.name,
      studentId: currentStudent.studentId,
      questionNumber: questionNumber!,
      timeUsed: timeUsedFormatted,
      grade: grade,
      notes: notes
    });
    setShowSummary(true);
  };

  const confirmAndContinue = async () => {
    if (!selectedExam || !currentStudentSummary || currentStudentIndex >= students.length) return;

    const currentStudent = students[currentStudentIndex];
    let actualTimeUsedInSeconds = 0;
    
    if (timerStartTime) {
      const currentTime = Date.now();
      actualTimeUsedInSeconds = Math.floor((currentTime - timerStartTime) / 1000);
    } else {
      const totalTimeInSeconds = selectedExam.examinationTime * 60;
      actualTimeUsedInSeconds = totalTimeInSeconds - timeRemaining;
    }

    try {
      const session: Omit<ExamSession, 'id'> = {
        examId: selectedExam.id!,
        studentId: currentStudent.id!,
        questionNumber: currentStudentSummary.questionNumber,
        actualExaminationTime: actualTimeUsedInSeconds,
        notes: currentStudentSummary.notes,
        grade: currentStudentSummary.grade as '12' | '10' | '7' | '4' | '02' | '00' | '-3',
        completed: true,
      };

      await api.createExamSession(session);
      
      if (currentStudentIndex + 1 < students.length) {
        setCurrentStudentIndex(prev => prev + 1);
        setQuestionNumber(null);
        setNotes('');
        setGrade('');
        setIsTimerRunning(false);
        setTimeRemaining(0);
        setTimerStartTime(null);
        setShowSummary(false);
        setCurrentStudentSummary(null);
      } else {
        await api.updateExam(selectedExam.id!, { status: 'completed' });
        setShowSummary(false);
        setCurrentStudentSummary(null);
        alert('Exam completed! All students have been examined.');
        navigate('/');
      }
    } catch (err) {
      setError('Failed to save grade');
      console.error('Error saving grade:', err);
    }
  };

  const goBackToEdit = () => {
    setShowSummary(false);
    setCurrentStudentSummary(null);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const currentStudent = students[currentStudentIndex];

  return (
    <div className="w-[1280px] mx-auto h-[700px] px-4 py-6 text-sm">
      <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Start Exam</h1>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-md text-sm">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        {!isExamStarted ? (
          <>
            {!selectedExam ? (
              <div className="bg-white rounded-lg shadow-md p-3 text-sm">
                <p className="text-gray-600 text-center">No exam selected. Please go back to the home page and select an exam.</p>
                <div className="mt-3 text-center">
                  <button
                    onClick={() => navigate('/')}
                    className="px-3 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-sm"
                  >
                    Back to Home
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-3 text-sm">
                <h2 className="text-base font-semibold text-gray-800 mb-3">Exam Details</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                  <div>
                    <p className="text-xs text-gray-600">Course</p>
                    <p className="font-semibold">{selectedExam.courseName}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Questions</p>
                    <p className="font-semibold">{selectedExam.numberOfQuestions}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Time Limit</p>
                    <p className="font-semibold">{selectedExam.examinationTime} min</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Students</p>
                    <p className="font-semibold">{students.length}</p>
                  </div>
                </div>
                <button
                  onClick={startExam}
                  disabled={students.length === 0}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-sm font-semibold"
                >
                  {students.length === 0 ? 'No Students Added' : 'Start Exam'}
                </button>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md p-3 mb-4 w-full">
              <div className="flex justify-between items-center mb-3">
                <h2 className="text-base font-semibold text-gray-800">
                  Student {currentStudentIndex + 1} of {students.length}
                </h2>
                <div className="text-xs text-gray-600">
                  {selectedExam?.courseName} - {selectedExam?.examTerm}
                </div>
              </div>
              {currentStudent && (
                <div className="bg-blue-50 p-2 rounded-lg">
                  <p className="text-base font-semibold text-blue-900">
                    {currentStudent.name} ({currentStudent.studentId})
                  </p>
                </div>
              )}
            </div>

            {isTimerRunning && (
              <div className="bg-white rounded-lg shadow-md p-3 mb-4 w-full">
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Time Remaining</h3>
                  <div className={`text-2xl font-bold ${timeRemaining <= 60 ? 'text-red-600' : 'text-green-600'}`}>
                    {formatTime(timeRemaining)}
                  </div>
                  {timeRemaining <= 60 && (
                    <p className="text-red-600 font-semibold mt-1 text-xs">Time is running out!</p>
                  )}
                </div>
              </div>
            )}

            {!questionNumber && (
              <div className="bg-white rounded-lg shadow-md p-3 mb-4 w-full">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Draw Question</h3>
                <button
                  onClick={drawQuestion}
                  className="w-full bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 transition-colors text-sm font-semibold"
                >
                  Draw Question
                </button>
              </div>
            )}

            {questionNumber && (
              <div className="bg-white rounded-lg shadow-md p-3 mb-4 w-full">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Question</h3>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">{questionNumber}</div>
                  <p className="text-xs text-gray-600">Question {questionNumber} of {selectedExam?.numberOfQuestions}</p>
                </div>
                {!isTimerRunning && timeRemaining === 0 && !timeExpired && (
                  <div className="mt-2">
                    <button
                      onClick={startExamination}
                      className="w-full bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 transition-colors text-sm font-semibold"
                    >
                      Start Examination
                    </button>
                  </div>
                )}
                {timeExpired && (
                  <div className="mt-2 text-center text-red-600 font-semibold text-xs">
                    Time is up! Please end the examination and save the result.
                  </div>
                )}
              </div>
            )}

            {questionNumber && (
              <div className="bg-white rounded-lg shadow-md p-3 mb-4 w-full">
                <h3 className="text-base font-semibold text-gray-800 mb-2">Notes & Grade</h3>
                <div className="mb-2">
                  <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={3}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                    placeholder="Enter notes about the student's performance..."
                  />
                </div>
                <div className="mb-2">
                  <label htmlFor="grade" className="block text-xs font-medium text-gray-700 mb-1">
                    Grade
                  </label>
                  <select
                    id="grade"
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">Select grade...</option>
                    {grades.map(g => (
                      <option key={g} value={g}>{g}</option>
                    ))}
                  </select>
                </div>
                <div className="flex space-x-2">
                  {isTimerRunning && (
                    <button
                      onClick={endExamination}
                      className="flex-1 bg-red-600 text-white px-2 py-1 rounded-md hover:bg-red-700 transition-colors text-sm"
                    >
                      End Examination
                    </button>
                  )}
                  {!isTimerRunning && grade && (
                    <button
                      onClick={saveGrade}
                      className="flex-1 bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition-colors text-sm"
                    >
                      Save & Continue
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        <div className="mt-4">
          <button
            onClick={() => navigate('/')}
            className="px-3 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors text-sm"
          >
            Back to Home
          </button>
        </div>

        {showSummary && currentStudentSummary && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div>
                  <p className="text-sm text-gray-600">Student</p>
                  <p className="font-semibold">{currentStudentSummary.name} ({currentStudentSummary.studentId})</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Question</p>
                  <p className="font-semibold">{currentStudentSummary.questionNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Time Used</p>
                  <p className="font-semibold">{currentStudentSummary.timeUsed}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Grade</p>
                  <p className="font-semibold">{currentStudentSummary.grade}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Notes</p>
                  <p className="font-semibold">{currentStudentSummary.notes || 'No notes'}</p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={goBackToEdit}
                  className="flex-1 px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Go Back & Edit
                </button>
                <button
                  onClick={confirmAndContinue}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  {currentStudentIndex + 1 < students.length ? 'Save & Next Student' : 'Complete Exam'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}; 