import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';

interface QuestionCardProps {
  questionNumber?: number | null;
  totalQuestions?: number;
  onDrawQuestion?: () => void;
  onStartExamination?: () => void;
  isTimerRunning?: boolean;
  timeExpired?: boolean;
  examinationEnded?: boolean;
  className?: string;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  questionNumber,
  totalQuestions,
  onDrawQuestion,
  onStartExamination,
  isTimerRunning = false,
  timeExpired = false,
  examinationEnded = false,
  className = '',
}) => {
  return (
    <Card title="Question" className={`w-full ${className}`}>
      {!questionNumber ? (
        <Button
          onClick={onDrawQuestion}
          variant="primary"
          className="w-full"
        >
          Draw Question
        </Button>
      ) : (
        <div className="text-center">
          <div className="text-4xl font-bold text-blue-600 mb-2">{questionNumber}</div>
          <p className="text-xs text-gray-600">Question {questionNumber} of {totalQuestions}</p>
          {!isTimerRunning && !timeExpired && !examinationEnded && (
            <div className="mt-2">
              <Button
                onClick={onStartExamination}
                variant="success"
                className="w-full"
              >
                Start Examination
              </Button>
            </div>
          )}
          {timeExpired && (
            <div className="mt-2 text-center text-red-600 font-semibold text-xs">
              Time is up! Please end the examination and save the result.
            </div>
          )}
        </div>
      )}
    </Card>
  );
}; 