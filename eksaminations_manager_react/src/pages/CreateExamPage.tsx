import React, { useState } from 'react';
import { useExams } from '../hooks/useExams';
import { CreateExamForm, PageHeader } from '../components';

export const CreateExamPage: React.FC = () => {
  const { createExam } = useExams();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (examData: any) => {
    setIsSubmitting(true);
    try {
      await createExam(examData);
    } catch (err) {
      console.error('Error creating exam:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <PageHeader 
        title={
          <span className="flex items-center">
            <i className="fas fa-plus-circle mr-2"></i>
            Create New Exam
          </span>
        } 
      />
      <CreateExamForm onSubmit={handleSubmit} isLoading={isSubmitting} />
    </div>
  );
}; 