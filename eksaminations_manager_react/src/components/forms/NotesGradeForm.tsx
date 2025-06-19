import React from 'react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { GRADES } from '../../utils/gradeUtils';

interface NotesGradeFormProps {
  notes: string;
  grade: string;
  onNotesChange: (notes: string) => void;
  onGradeChange: (grade: string) => void;
  onEndExamination?: () => void;
  onSaveGrade?: () => void;
  isTimerRunning?: boolean;
  canSave?: boolean;
  className?: string;
}

export const NotesGradeForm: React.FC<NotesGradeFormProps> = ({
  notes,
  grade,
  onNotesChange,
  onGradeChange,
  onEndExamination,
  onSaveGrade,
  isTimerRunning = false,
  canSave = false,
  className = '',
}) => {
  return (
    <Card title={
      <span className="flex items-center">
        <i className="fas fa-sticky-note mr-2"></i>
        Notes & Grade
      </span>
    } className={`w-full ${className}`}>
      <div className="mb-2">
        <label htmlFor="notes" className="block text-xs font-medium text-gray-700 mb-1">
          <i className="fas fa-edit mr-1"></i>
          Notes
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          placeholder="Enter notes about the student's performance..."
        />
      </div>
      <div className="mb-2">
        <label htmlFor="grade" className="block text-xs font-medium text-gray-700 mb-1">
          <i className="fas fa-star mr-1"></i>
          Grade
        </label>
        <select
          id="grade"
          value={grade}
          onChange={(e) => onGradeChange(e.target.value)}
          className="w-full px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">Select grade...</option>
          {GRADES.map(g => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="flex space-x-2">
        {isTimerRunning && onEndExamination && (
          <Button
            onClick={onEndExamination}
            variant="danger"
            className="flex-1"
          >
            <i className="fas fa-stop mr-2"></i>
            End Examination
          </Button>
        )}
        {!isTimerRunning && canSave && onSaveGrade && (
          <Button
            onClick={onSaveGrade}
            variant="success"
            className="flex-1"
          >
            <i className="fas fa-save mr-2"></i>
            Save & Continue
          </Button>
        )}
      </div>
    </Card>
  );
}; 