import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  Button, 
  Card, 
  Timer, 
  LoadingSpinner, 
  ErrorMessage,
  StudentProgressCard,
  QuestionCard,
  NotesGradeForm,
  StudentSummaryModal
} from '../components';
import { useExamData } from '../hooks/useExamData';
import { useExamSession } from '../hooks/useExamSession';

export const StartExam: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const examId = searchParams.get('examId') || undefined;
  
  const {
    selectedExam,
    students,
    isLoading,
    error,
    startExam: startExamData,
    completeExam,
    saveSession,
  } = useExamData({ examId });

  const [currentStudentIndex, setCurrentStudentIndex] = useState(0);
  const [isExamStarted, setIsExamStarted] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const {
    isTimerRunning,
    timeRemaining,
    timeExpired,
    questionNumber,
    notes,
    grade,
    showSummary: isSummaryVisible,
    currentStudentSummary,
    examinationEnded,
    drawQuestion,
    startExamination,
    endExamination,
    setNotes,
    setGrade,
    resetSession,
    showStudentSummary,
    hideSummary,
    formatTime,
    getActualExaminationTime,
  } = useExamSession({ 
    examinationTime: selectedExam?.examinationTime || 0 
  });

  const handleStartExam = async () => {
    if (students.length === 0) {
      setLocalError('Please add students before starting the exam');
      return;
    }
    
    setLocalError(null); // Clear any previous local errors
    const result = await startExamData();
    if (result?.shouldStart) {
      setIsExamStarted(true);
      setCurrentStudentIndex(result.nextStudentIndex);
    } else if (result && !result.shouldStart) {
      // Exam is already completed, navigate to home
      navigate('/');
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedExam || !currentStudent || !grade) return;

    try {
      const actualExaminationTime = getActualExaminationTime();

      const sessionData = {
        examId: selectedExam.id!,
        studentId: currentStudent.id!,
        questionNumber: questionNumber!,
        actualExaminationTime,
        grade: grade as '12' | '10' | '7' | '4' | '02' | '00' | '-3',
        notes,
        completed: true,
        startTime: Date.now(),
        endTime: Date.now()
      };

      await saveSession(sessionData);
      
      showStudentSummary({
        name: currentStudent.name,
        studentId: currentStudent.studentId,
        questionNumber: questionNumber!,
        timeUsed: formatTime(actualExaminationTime),
        grade,
        notes
      });
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleConfirmAndContinue = async () => {
    hideSummary();
    resetSession();
    
    if (currentStudentIndex + 1 < students.length) {
      setCurrentStudentIndex(currentStudentIndex + 1);
    } else {
      await completeExam();
      navigate('/');
    }
  };

  const handleGoBackToEdit = () => {
    hideSummary();
  };

  if (isLoading) {
    return <LoadingSpinner message="Loading exam..." />;
  }

  const displayError = localError || error;

  if (displayError) {
    return <ErrorMessage message={displayError} onBack={() => navigate('/')} />;
  }

  const currentStudent = students[currentStudentIndex];

  return (
    <div className="w-[1280px] mx-auto h-[700px] px-4 py-6 text-sm">
      <div className="bg-white rounded-lg shadow-md p-4 h-full overflow-auto">
        <h1 className="text-lg font-bold text-gray-900 mb-4">Start Exam</h1>

        {!isExamStarted ? (
          <>
            {!selectedExam ? (
              <Card>
                <p className="text-gray-600 text-center">No exam selected. Please go back to the home page and select an exam.</p>
                <div className="mt-3 text-center">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/')}
                  >
                    Back to Home
                  </Button>
                </div>
              </Card>
            ) : (
              <Card>
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
                
                {students.length === 0 && (
                  <div className="mb-4 p-3 bg-yellow-50 border border-yellow-200 rounded-md">
                    <p className="text-yellow-800 text-sm mb-2">
                      ⚠️ No students added yet. Please add students before starting the exam.
                    </p>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => navigate(`/add-students?examId=${selectedExam.id}`)}
                    >
                      Add Students
                    </Button>
                  </div>
                )}
                
                <Button
                  onClick={handleStartExam}
                  disabled={students.length === 0}
                  variant="primary"
                  className="w-full"
                >
                  {students.length === 0 ? 'No Students Added' : 'Start Exam'}
                </Button>
              </Card>
            )}
          </>
        ) : (
          <>
            <StudentProgressCard
              currentStudent={currentStudent}
              currentIndex={currentStudentIndex}
              totalStudents={students.length}
              courseName={selectedExam?.courseName}
              examTerm={selectedExam?.examTerm}
              className="mb-4"
            />

            {isTimerRunning && (
              <Card className="mb-4 w-full">
                <div className="text-center">
                  <h3 className="text-base font-semibold text-gray-800 mb-1">Time Remaining</h3>
                  <Timer 
                    timeRemaining={timeRemaining}
                    isRunning={isTimerRunning}
                    isExpired={timeExpired}
                    className="text-2xl font-bold"
                  />
                  {timeRemaining <= 60 && (
                    <p className="text-red-600 font-semibold mt-1 text-xs">Time is running out!</p>
                  )}
                </div>
              </Card>
            )}

            <QuestionCard
              questionNumber={questionNumber}
              totalQuestions={selectedExam?.numberOfQuestions}
              onDrawQuestion={() => drawQuestion(selectedExam?.numberOfQuestions || 0)}
              onStartExamination={startExamination}
              isTimerRunning={isTimerRunning}
              timeExpired={timeExpired}
              examinationEnded={examinationEnded}
              className="mb-4"
            />

            {questionNumber && (
              <NotesGradeForm
                notes={notes}
                grade={grade}
                onNotesChange={setNotes}
                onGradeChange={setGrade}
                onEndExamination={endExamination}
                onSaveGrade={handleSaveGrade}
                isTimerRunning={isTimerRunning}
                canSave={!!grade}
                className="mb-4"
              />
            )}
          </>
        )}

        <div className="mt-4">
          <Button
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Back to Home
          </Button>
        </div>

        <StudentSummaryModal
          summary={currentStudentSummary}
          currentIndex={currentStudentIndex}
          totalStudents={students.length}
          onGoBack={handleGoBackToEdit}
          onConfirm={handleConfirmAndContinue}
          isVisible={isSummaryVisible}
        />
      </div>
    </div>
  );
}; 