import React from 'react';
import { Button } from '../ui/Button';

interface StudentSummary {
  name: string;
  studentId: string;
  questionNumber: number;
  timeUsed: string;
  grade: string;
  notes: string;
}

interface StudentSummaryModalProps {
  summary: StudentSummary | null;
  currentIndex: number;
  totalStudents: number;
  onGoBack: () => void;
  onConfirm: () => void;
  isVisible: boolean;
}

export const StudentSummaryModal: React.FC<StudentSummaryModalProps> = ({
  summary,
  currentIndex,
  totalStudents,
  onGoBack,
  onConfirm,
  isVisible,
}) => {
  if (!isVisible || !summary) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Student Summary</h3>
        
        <div className="space-y-3 mb-6">
          <div>
            <p className="text-sm text-gray-600">Student</p>
            <p className="font-semibold">{summary.name} ({summary.studentId})</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Question</p>
            <p className="font-semibold">{summary.questionNumber}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Time Used</p>
            <p className="font-semibold">{summary.timeUsed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Grade</p>
            <p className="font-semibold">{summary.grade}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Notes</p>
            <p className="font-semibold">{summary.notes || 'No notes'}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Button
            onClick={onGoBack}
            variant="secondary"
            className="flex-1"
          >
            Go Back & Edit
          </Button>
          <Button
            onClick={onConfirm}
            variant="success"
            className="flex-1"
          >
            {currentIndex + 1 < totalStudents ? 'Save & Next Student' : 'Complete Exam'}
          </Button>
        </div>
      </div>
    </div>
  );
}; 