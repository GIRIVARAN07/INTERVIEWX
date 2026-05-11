/**
 * Results Page
 * ------------
 * Shows the results of a completed interview attempt:
 *   - Animated score display with feedback tier
 *   - Summary stats
 *   - Detailed question-by-question review
 *   - Retry and dashboard buttons
 */

import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import ResultCard from '../components/ResultCard';
import api from '../services/api';

export default function Results() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [attempt, setAttempt] = useState(null);
  const [loading, setLoading] = useState(true);
  const [displayScore, setDisplayScore] = useState(0);

  // Fetch attempt details
  useEffect(() => {
    const fetchAttempt = async () => {
      try {
        const res = await api.get(`/attempts/${id}`);
        setAttempt(res.data.attempt);
      } catch (err) {
        console.error('Failed to fetch attempt:', err);
        navigate('/dashboard');
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, [id, navigate]);

  // Animate score counter
  useEffect(() => {
    if (!attempt) return;
    const target = attempt.score;
    const duration = 1500;
    const steps = 60;
    const increment = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setDisplayScore(target);
        clearInterval(timer);
      } else {
        setDisplayScore(Math.round(current));
      }
    }, duration / steps);
    return () => clearInterval(timer);
  }, [attempt]);

  // Get feedback tier
  const getFeedback = (score) => {
    if (score > 80) return { label: 'Excellent!', emoji: '🎯', color: 'text-emerald-500', bg: 'bg-emerald-50 dark:bg-emerald-950/30', border: 'border-emerald-200 dark:border-emerald-800', msg: 'Outstanding performance! You\'re interview-ready.' };
    if (score >= 50) return { label: 'Good Job!', emoji: '👍', color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-950/30', border: 'border-amber-200 dark:border-amber-800', msg: 'Solid effort! A bit more practice and you\'ll ace it.' };
    return { label: 'Keep Practicing', emoji: '📚', color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-950/30', border: 'border-red-200 dark:border-red-800', msg: 'Don\'t give up! Review the answers and try again.' };
  };

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!attempt) return null;

  const feedback = getFeedback(attempt.score);

  return (
    <div className="page-container">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Score Display */}
        <div className={`glass-card p-8 text-center animate-scale-in ${feedback.bg} border ${feedback.border}`}>
          <span className="text-6xl mb-4 block">{feedback.emoji}</span>
          <p className={`text-6xl font-extrabold ${feedback.color} mb-2`}>{displayScore}%</p>
          <h1 className={`text-2xl font-bold ${feedback.color} mb-2`}>{feedback.label}</h1>
          <p className="text-gray-600 dark:text-gray-400">{feedback.msg}</p>

          {/* Stats row */}
          <div className="flex items-center justify-center gap-8 mt-6 pt-6 border-t border-gray-200/50 dark:border-gray-700/50">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attempt.correctCount}</p>
              <p className="text-xs text-gray-500">Correct</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attempt.totalQuestions - attempt.correctCount}</p>
              <p className="text-xs text-gray-500">Incorrect</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{attempt.totalQuestions}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up">
          <Link to="/interview/select" className="btn-primary" id="retry-btn">
            🔄 Try Again
          </Link>
          <Link to="/dashboard" className="btn-secondary" id="back-dashboard-btn">
            📊 Back to Dashboard
          </Link>
        </div>

        {/* Detailed Review */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📝 Detailed Review</h2>
          <div className="space-y-4">
            {attempt.answers?.map((result, index) => (
              <ResultCard key={index} result={result} index={index} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
