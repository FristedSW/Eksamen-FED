import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Exam } from '../../types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface CreateExamFormProps {
  onSubmit: (examData: Omit<Exam, 'id'>) => Promise<void>;
  isLoading?: boolean;
}

export const CreateExamForm: React.FC<CreateExamFormProps> = ({
  onSubmit,
  isLoading = false,
}) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examTerm: '',
    courseName: '',
    date: '',
    numberOfQuestions: 1,
    examinationTime: 15,
    startTime: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.examTerm.trim()) {
      newErrors.examTerm = 'Exam term is required';
    }
    if (!formData.courseName.trim()) {
      newErrors.courseName = 'Course name is required';
    }
    if (!formData.date) {
      newErrors.date = 'Date is required';
    }
    if (!formData.startTime) {
      newErrors.startTime = 'Start time is required';
    }
    if (formData.numberOfQuestions < 1) {
      newErrors.numberOfQuestions = 'Number of questions must be at least 1';
    }
    if (formData.examinationTime < 1) {
      newErrors.examinationTime = 'Examination time must be at least 1 minute';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      const newExam: Omit<Exam, 'id'> = {
        ...formData,
        status: 'created',
      };

      await onSubmit(newExam);
      navigate('/');
    } catch (err) {
      console.error('Error creating exam:', err);
    }
  };

  return (
    <Card title="Create New Exam">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Input
            label="Exam Term *"
            name="examTerm"
            value={formData.examTerm}
            onChange={handleInputChange}
            placeholder="e.g., Summer 25"
            error={errors.examTerm}
            required
          />

          <Input
            label="Course Name *"
            name="courseName"
            value={formData.courseName}
            onChange={handleInputChange}
            placeholder="e.g., Web Development"
            error={errors.courseName}
            required
          />

          <Input
            label="Date *"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleInputChange}
            error={errors.date}
            required
          />

          <Input
            label="Start Time *"
            name="startTime"
            type="time"
            value={formData.startTime}
            onChange={handleInputChange}
            error={errors.startTime}
            required
          />

          <Input
            label="Number of Questions *"
            name="numberOfQuestions"
            type="number"
            value={formData.numberOfQuestions}
            onChange={handleInputChange}
            min="1"
            max="100"
            error={errors.numberOfQuestions}
            required
          />

          <Input
            label="Examination Time (minutes) *"
            name="examinationTime"
            type="number"
            value={formData.examinationTime}
            onChange={handleInputChange}
            min="1"
            max="180"
            error={errors.examinationTime}
            required
          />
        </div>

        <div className="flex justify-end space-x-4">
          <Button
            type="button"
            variant="secondary"
            onClick={() => navigate('/')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Exam'}
          </Button>
        </div>
      </form>
    </Card>
  );
}; 