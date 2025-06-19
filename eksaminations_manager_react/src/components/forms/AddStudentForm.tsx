import React, { useState } from 'react';
import { Student } from '../../types';
import { Card } from '../ui/Card';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface AddStudentFormProps {
  onSubmit: (studentData: Omit<Student, 'id'>) => Promise<void>;
  currentStudentCount: number;
  isLoading?: boolean;
}

export const AddStudentForm: React.FC<AddStudentFormProps> = ({
  onSubmit,
  currentStudentCount,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.studentId.trim()) {
      newErrors.studentId = 'Student ID is required';
    }
    if (!formData.name.trim()) {
      newErrors.name = 'Student name is required';
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
      const newStudent: Omit<Student, 'id'> = {
        examId: '', // This will be set by the parent component
        studentId: formData.studentId,
        name: formData.name,
        order: currentStudentCount + 1,
      };

      await onSubmit(newStudent);
      setFormData({ studentId: '', name: '' });
    } catch (err) {
      console.error('Error adding student:', err);
    }
  };

  return (
    <Card title="Add New Student" subtitle={`Current students: ${currentStudentCount}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Student ID *"
            name="studentId"
            value={formData.studentId}
            onChange={handleInputChange}
            placeholder="e.g., S001"
            error={errors.studentId}
            required
          />
          <Input
            label="Student Name *"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g., John Doe"
            error={errors.name}
            required
          />
        </div>
        <div className="md:col-span-2">
          <Button
            type="submit"
            variant="success"
            disabled={isLoading}
            className="w-full"
          >
            <i className="fas fa-user-plus mr-2"></i>
            {isLoading ? 'Adding...' : 'Add Student'}
          </Button>
        </div>
      </form>
    </Card>
  );
}; 