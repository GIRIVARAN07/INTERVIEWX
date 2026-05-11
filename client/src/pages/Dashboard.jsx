/**
 * Dashboard Page
 * --------------
 * Main user dashboard showing:
 *   - Welcome message
 *   - Stats cards (total attempts, average score, best score)
 *   - Performance chart
 *   - Recent attempts table
 *   - Quick-start interview buttons
 */

import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import PerformanceChart from '../components/PerformanceChart';
import api from '../services/api';

export default function Dashboard() {
  const { user } = useAuth();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttempts = async () => {
      try {
        const res = await api.get('/attempts');
        setAttempts(res.data.attempts || []);
      } catch (err) {
        console.error('Failed to fetch attempts:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttempts();
  }, []);

  // Calculate stats
  const totalAttempts = attempts.length;
  const avgScore = totalAttempts > 0 ? Math.round(attempts.reduce((s, a) => s + a.score, 0) / totalAttempts) : 0;
  const bestScore = totalAttempts > 0 ? Math.max(...attempts.map((a) => a.score)) : 0;

  const interviewTypes = [
    { type: 'HR', icon: '🎯', color: 'from-violet-500 to-purple-600', desc: 'Behavioral questions' },
    { type: 'Technical', icon: '💻', color: 'from-cyan-500 to-blue-600', desc: 'DSA & CS fundamentals' },
    { type: 'Aptitude', icon: '🧮', color: 'from-amber-500 to-orange-600', desc: 'Quantitative reasoning' },
  ];

  if (loading) {
    return (
      <div className="page-container flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Welcome */}
        <div className="animate-slide-up">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
            Welcome back, <span className="bg-gradient-to-r from-brand-500 to-brand-700 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">{user?.name}</span> 👋
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2">Here's your interview preparation overview.</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-slide-up" style={{ animationDelay: '100ms' }}>
          {[
            { label: 'Total Attempts', value: totalAttempts, icon: '📝', color: 'text-brand-600 dark:text-brand-400' },
            { label: 'Average Score', value: `${avgScore}%`, icon: '📊', color: 'text-emerald-600 dark:text-emerald-400' },
            { label: 'Best Score', value: `${bestScore}%`, icon: '🏆', color: 'text-amber-600 dark:text-amber-400' },
          ].map((s) => (
            <div key={s.label} className="stat-card">
              <span className="text-3xl mb-2 block">{s.icon}</span>
              <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Start */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">🚀 Quick Start</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {interviewTypes.map((t) => (
              <Link key={t.type} to={`/interview/select?type=${t.type}`}
                className="glass-card p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 group" id={`quick-start-${t.type.toLowerCase()}`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-3 group-hover:scale-110 transition-transform`}>
                  {t.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white">{t.type} Interview</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{t.desc}</p>
              </Link>
            ))}
          </div>
        </div>

        {/* Performance Chart */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <PerformanceChart attempts={attempts} />
        </div>

        {/* Recent Attempts */}
        <div className="animate-slide-up" style={{ animationDelay: '400ms' }}>
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">📋 Recent Attempts</h2>
          {attempts.length === 0 ? (
            <div className="glass-card p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No attempts yet. Start your first interview!</p>
              <Link to="/interview/select" className="btn-primary">Start Now</Link>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left" id="attempts-table">
                  <thead className="bg-gray-50 dark:bg-surface-800 text-xs uppercase text-gray-500 dark:text-gray-400">
                    <tr>
                      <th className="px-6 py-3">Type</th>
                      <th className="px-6 py-3">Difficulty</th>
                      <th className="px-6 py-3">Score</th>
                      <th className="px-6 py-3">Date</th>
                      <th className="px-6 py-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                    {attempts.slice(0, 10).map((a) => (
                      <tr key={a._id} className="hover:bg-gray-50 dark:hover:bg-surface-800 transition-colors">
                        <td className="px-6 py-4 font-medium text-gray-900 dark:text-white">{a.type}</td>
                        <td className="px-6 py-4">
                          <span className={`badge ${a.difficulty === 'Easy' ? 'badge-green' : a.difficulty === 'Medium' ? 'badge-amber' : 'badge-red'}`}>
                            {a.difficulty}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`font-bold ${a.score > 80 ? 'text-emerald-600 dark:text-emerald-400' : a.score >= 50 ? 'text-amber-600 dark:text-amber-400' : 'text-red-600 dark:text-red-400'}`}>
                            {a.score}%
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 dark:text-gray-400">
                          {new Date(a.createdAt).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4">
                          <Link to={`/results/${a._id}`} className="text-brand-600 dark:text-brand-400 hover:underline text-sm font-medium">
                            View Details
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
