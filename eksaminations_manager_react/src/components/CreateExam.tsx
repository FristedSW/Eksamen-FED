import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { Exam } from '../types';

export const CreateExam: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    examTerm: '',
    courseName: '',
    date: '',
    numberOfQuestions: 1,
    examinationTime: 15,
    startTime: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseInt(value) || 0 : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      const newExam: Omit<Exam, 'id'> = {
        ...formData,
        status: 'created',
      };

      await api.createExam(newExam);
      navigate('/');
    } catch (err) {
      setError('Failed to create exam. Please try again.');
      console.error('Error creating exam:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Exam</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-red-800">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Exam Term */}
          <div>
            <label htmlFor="examTerm" className="block text-sm font-medium text-gray-700 mb-2">
              Exam Term *
            </label>
            <input
              type="text"
              id="examTerm"
              name="examTerm"
              value={formData.examTerm}
              onChange={handleInputChange}
              required
              placeholder="e.g., Summer 25"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Course Name */}
          <div>
            <label htmlFor="courseName" className="block text-sm font-medium text-gray-700 mb-2">
              Course Name *
            </label>
            <input
              type="text"
              id="courseName"
              name="courseName"
              value={formData.courseName}
              onChange={handleInputChange}
              required
              placeholder="e.g., Web Development"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Date */}
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
              Date *
            </label>
            <input
              type="date"
              id="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
              Start Time *
            </label>
            <input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Number of Questions */}
          <div>
            <label htmlFor="numberOfQuestions" className="block text-sm font-medium text-gray-700 mb-2">
              Number of Questions *
            </label>
            <input
              type="number"
              id="numberOfQuestions"
              name="numberOfQuestions"
              value={formData.numberOfQuestions}
              onChange={handleInputChange}
              required
              min="1"
              max="100"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Examination Time */}
          <div>
            <label htmlFor="examinationTime" className="block text-sm font-medium text-gray-700 mb-2">
              Examination Time (minutes) *
            </label>
            <input
              type="number"
              id="examinationTime"
              name="examinationTime"
              value={formData.examinationTime}
              onChange={handleInputChange}
              required
              min="1"
              max="180"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/')}
            className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? 'Creating...' : 'Create Exam'}
          </button>
        </div>
      </form>
    </div>
  );
}; 