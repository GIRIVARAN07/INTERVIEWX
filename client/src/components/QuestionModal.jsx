/**
 * Question Modal
 * --------------
 * Form to create or edit interview questions.
 */

import { useState, useEffect } from 'react';
import api from '../services/api';

export default function QuestionModal({ isOpen, onClose, onSuccess, question }) {
  const [formData, setFormData] = useState({
    text: '',
    type: 'HR',
    difficulty: 'Medium',
    company: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    keywords: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || '',
        type: question.type || 'HR',
        difficulty: question.difficulty || 'Medium',
        company: question.company || '',
        options: question.options && question.options.length ? question.options : ['', '', '', ''],
        correctAnswer: question.correctAnswer || '',
        keywords: question.keywords ? question.keywords.join(', ') : '',
      });
    }
  }, [question]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        ...formData,
        keywords: formData.keywords.split(',').map(k => k.trim()).filter(k => k),
        // Only include options/correctAnswer for MCQ types
        options: formData.type === 'HR' ? undefined : formData.options,
        correctAnswer: formData.type === 'HR' ? undefined : formData.correctAnswer,
      };

      if (question) {
        await api.put(`/admin/questions/${question._id}`, payload);
      } else {
        await api.post('/admin/questions', payload);
      }
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save question.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-2xl max-h-[90vh] overflow-y-auto p-8 shadow-2xl">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">{question ? 'Edit Question' : 'Add New Question'}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl">✕</button>
        </div>

        {error && (
          <div className="mb-6 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 text-sm border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Question Type</label>
              <select
                className="input-field"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="HR">HR (Open-ended)</option>
                <option value="Technical">Technical (MCQ)</option>
                <option value="Aptitude">Aptitude (MCQ)</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Difficulty</label>
              <select
                className="input-field"
                value={formData.difficulty}
                onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                required
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Question Text</label>
            <textarea
              className="input-field min-h-[100px]"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Enter the question text..."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Company (Optional)</label>
            <input
              type="text"
              className="input-field"
              value={formData.company}
              onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              placeholder="e.g. Google, Amazon, TCS"
            />
          </div>

          {formData.type === 'HR' ? (
            <div>
              <label className="block text-sm font-medium mb-1">Keywords for Evaluation (Comma separated)</label>
              <input
                type="text"
                className="input-field"
                value={formData.keywords}
                onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                placeholder="e.g. leadership, teamwork, conflict, resolution"
                required
              />
              <p className="text-xs text-gray-500 mt-1">Users get points for including these keywords in their HR answers.</p>
            </div>
          ) : (
            <div className="space-y-4 p-4 bg-gray-50 dark:bg-surface-800 rounded-2xl">
              <p className="text-sm font-bold">MCQ Options</p>
              {formData.options.map((opt, idx) => (
                <div key={idx} className="flex gap-2 items-center">
                  <span className="text-xs font-bold w-6">{idx + 1}.</span>
                  <input
                    type="text"
                    className="input-field"
                    value={opt}
                    onChange={(e) => {
                      const newOpts = [...formData.options];
                      newOpts[idx] = e.target.value;
                      setFormData({ ...formData, options: newOpts });
                    }}
                    placeholder={`Option ${idx + 1}`}
                    required
                  />
                </div>
              ))}
              <div className="mt-4">
                <label className="block text-sm font-medium mb-1">Correct Answer (must match one option exactly)</label>
                <input
                  type="text"
                  className="input-field"
                  value={formData.correctAnswer}
                  onChange={(e) => setFormData({ ...formData, correctAnswer: e.target.value })}
                  placeholder="Paste the correct option text here"
                  required
                />
              </div>
            </div>
          )}

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-primary flex-1"
              disabled={loading}
            >
              {loading ? 'Saving...' : 'Save Question'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
