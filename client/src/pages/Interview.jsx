/**
 * Interview Page
 * ---------------
 * The main interview session experience:
 *   - Fetches randomized questions from the API
 *   - Displays questions one-by-one with a 60s timer
 *   - Auto-advances on timeout
 *   - Submits all answers at the end for scoring
 *   - Redirects to results page
 */

import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Timer from '../components/Timer';
import QuestionCard from '../components/QuestionCard';
import api from '../services/api';

export default function Interview() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const type = searchParams.get('type');
  const difficulty = searchParams.get('difficulty');
  const company = searchParams.get('company');

  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Fetch questions on mount
  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const params = { type, difficulty, count: 10 };
        if (company) params.company = company;
        const res = await api.get('/questions', { params });
        setQuestions(res.data.questions || []);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load questions.');
      } finally {
        setLoading(false);
      }
    };

    if (!type || !difficulty) {
      navigate('/interview/select');
      return;
    }
    fetchQuestions();
  }, [type, difficulty, company, navigate]);

  const currentQuestion = questions[currentIndex];
  const isLastQuestion = currentIndex === questions.length - 1;

  // Handle answer selection
  const handleAnswer = (answer) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion._id]: answer,
    }));
  };

  // Move to next question or submit
  const handleNext = useCallback(() => {
    if (isLastQuestion) {
      handleSubmit();
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [isLastQuestion, currentIndex, questions]);

  // Timer timeout handler
  const handleTimeout = useCallback(() => {
    handleNext();
  }, [handleNext]);

  // Submit all answers
  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const formattedAnswers = questions.map((q) => ({
        questionId: q._id,
        userAnswer: answers[q._id] || '',
      }));

      const res = await api.post('/attempts', {
        type,
        difficulty,
        answers: formattedAnswers,
      });

      // Navigate to results page with attempt ID
      navigate(`/results/${res.data.attempt.id}`, { replace: true });
    } catch (err) {
      setError('Failed to submit answers. Please try again.');
      setSubmitting(false);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Loading questions...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="glass-card p-8 text-center max-w-md">
          <span className="text-4xl mb-4 block">😕</span>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Oops!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">{error}</p>
          <button onClick={() => navigate('/interview/select')} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Submitting state
  if (submitting) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 font-medium">Submitting your answers...</p>
        </div>
      </div>
    );
  }

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto">
        {/* Header with type badge and timer */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <span className="badge-brand">{type}</span>
            <span className={`badge ${difficulty === 'Easy' ? 'badge-green' : difficulty === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
              {difficulty}
            </span>
          </div>
          <Timer
            duration={60}
            onTimeout={handleTimeout}
            questionKey={currentIndex}
          />
        </div>

        {/* Question Card */}
        <QuestionCard
          question={currentQuestion}
          questionNumber={currentIndex + 1}
          totalQuestions={questions.length}
          selectedAnswer={answers[currentQuestion._id] || ''}
          onAnswer={handleAnswer}
        />

        {/* Navigation buttons */}
        <div className="flex items-center justify-between mt-6">
          <button
            onClick={() => setCurrentIndex((prev) => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            id="prev-question-btn"
          >
            ← Previous
          </button>

          <span className="text-sm text-gray-500 dark:text-gray-400">
            {currentIndex + 1} / {questions.length}
          </span>

          {isLastQuestion ? (
            <button onClick={handleSubmit} className="btn-primary bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700" id="submit-interview-btn">
              Submit ✓
            </button>
          ) : (
            <button onClick={handleNext} className="btn-primary" id="next-question-btn">
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
