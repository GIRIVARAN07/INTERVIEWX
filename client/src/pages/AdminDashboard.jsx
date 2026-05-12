/**
 * Admin Dashboard
 * ---------------
 * Central management hub for administrators to:
 *   - Monitor system-wide stats
 *   - Manage users
 *   - Add/Edit/Delete interview questions
 */

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import QuestionModal from '../components/QuestionModal';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('stats'); // 'stats', 'users', 'questions'
  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      if (activeTab === 'stats') {
        const res = await api.get('/admin/stats');
        setStats(res.data);
      } else if (activeTab === 'users') {
        const res = await api.get('/admin/users');
        setUsers(res.data);
      } else if (activeTab === 'questions') {
        const res = await api.get('/admin/questions');
        setQuestions(res.data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch data.');
      if (err.response?.status === 403) navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await api.delete(`/admin/questions/${id}`);
      setQuestions(questions.filter(q => q._id !== id));
    } catch (err) {
      alert('Failed to delete question.');
    }
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setIsModalOpen(true);
  };

  const handleAddQuestion = () => {
    setEditingQuestion(null);
    setIsModalOpen(true);
  };

  return (
    <div className="page-container">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Admin Control Center</h1>
          <p className="text-gray-500 dark:text-gray-400">Manage the InterviewX ecosystem</p>
        </div>
        <div className="flex gap-2 p-1 bg-gray-100 dark:bg-surface-800 rounded-xl self-start">
          {[
            { id: 'stats', label: '📊 Stats', icon: '📊' },
            { id: 'users', label: '👥 Users', icon: '👥' },
            { id: 'questions', label: '❓ Questions', icon: '❓' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-surface-700 text-brand-600 dark:text-brand-400 shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-500 rounded-full animate-spin" />
        </div>
      ) : (
        <div className="animate-fade-in">
          {activeTab === 'stats' && stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard title="Total Users" value={stats.totalUsers} icon="👥" color="blue" />
              <StatCard title="Total Questions" value={stats.totalQuestions} icon="❓" color="purple" />
              <StatCard title="Total Attempts" value={stats.totalAttempts} icon="📝" color="emerald" />
              
              <div className="md:col-span-3 glass-card p-6 mt-4">
                <h3 className="text-lg font-bold mb-4">Attempts by Type</h3>
                <div className="flex flex-wrap gap-4">
                  {stats.attemptsByType.map(item => (
                    <div key={item._id} className="p-4 rounded-2xl bg-gray-50 dark:bg-surface-800 flex-1 min-w-[150px]">
                      <p className="text-sm text-gray-500 dark:text-gray-400">{item._id}</p>
                      <p className="text-2xl font-bold text-brand-600">{item.count}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="glass-card overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 dark:bg-surface-800 border-b border-gray-200 dark:border-gray-800">
                    <th className="p-4 font-semibold text-sm">Name</th>
                    <th className="p-4 font-semibold text-sm">Email</th>
                    <th className="p-4 font-semibold text-sm">Joined</th>
                    <th className="p-4 font-semibold text-sm">Role</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {users.map(user => (
                    <tr key={user._id} className="hover:bg-gray-50/50 dark:hover:bg-surface-800/50 transition-colors">
                      <td className="p-4 text-sm font-medium">{user.name}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">{user.email}</td>
                      <td className="p-4 text-sm text-gray-500 dark:text-gray-400">
                        {new Date(user.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                          user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'questions' && (
            <div>
              <div className="flex justify-end mb-4">
                <button onClick={handleAddQuestion} className="btn-primary flex items-center gap-2">
                  <span>➕</span> Add New Question
                </button>
              </div>
              <div className="space-y-4">
                {questions.map(q => (
                  <div key={q._id} className="glass-card p-4 flex items-center justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold px-2 py-0.5 bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 rounded">
                          {q.type}
                        </span>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          q.difficulty === 'Easy' ? 'bg-emerald-100 text-emerald-700' : 
                          q.difficulty === 'Medium' ? 'bg-amber-100 text-amber-700' : 
                          'bg-red-100 text-red-700'
                        }`}>
                          {q.difficulty}
                        </span>
                        {q.company && (
                          <span className="text-xs font-bold px-2 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 rounded">
                            🏢 {q.company}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900 dark:text-white font-medium truncate">{q.text}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEditQuestion(q)} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors" title="Edit">
                        ✏️
                      </button>
                      <button onClick={() => handleDeleteQuestion(q._id)} className="p-2 hover:bg-red-50 dark:hover:bg-red-900/20 text-red-600 rounded-lg transition-colors" title="Delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <QuestionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={() => {
            setIsModalOpen(false);
            fetchData();
          }}
          question={editingQuestion}
        />
      )}
    </div>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div className="glass-card p-6 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl bg-${color}-50 dark:bg-${color}-900/20 text-${color}-600`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      </div>
    </div>
  );
}
