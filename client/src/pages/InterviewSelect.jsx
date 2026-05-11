/**
 * Interview Selection Page
 * ------------------------
 * Allows users to configure their interview session:
 *   - Interview type (HR / Technical / Aptitude)
 *   - Difficulty level (Easy / Medium / Hard)
 *   - Company filter (optional)
 *   - Start button
 */

import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import api from '../services/api';

const types = [
  { value: 'HR', icon: '🎯', color: 'from-violet-500 to-purple-600', desc: 'Behavioral & situational questions. Open-ended answers scored via keyword matching.' },
  { value: 'Technical', icon: '💻', color: 'from-cyan-500 to-blue-600', desc: 'MCQ questions on DSA, programming, web development, and CS fundamentals.' },
  { value: 'Aptitude', icon: '🧮', color: 'from-amber-500 to-orange-600', desc: 'Quantitative aptitude, logical reasoning, and analytical thinking MCQs.' },
];

const difficulties = [
  { value: 'Easy', color: 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400' },
  { value: 'Medium', color: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400' },
  { value: 'Hard', color: 'border-red-500 bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400' },
];

export default function InterviewSelect() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [selectedType, setSelectedType] = useState(searchParams.get('type') || '');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [selectedCompany, setSelectedCompany] = useState('All');
  const [companies, setCompanies] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch available companies
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const res = await api.get('/questions/companies');
        setCompanies(['All', ...(res.data.companies || [])]);
      } catch (err) {
        console.error('Failed to fetch companies:', err);
      }
    };
    fetchCompanies();
  }, []);

  const handleStart = () => {
    if (!selectedType || !selectedDifficulty) return;
    setLoading(true);
    const params = new URLSearchParams({ type: selectedType, difficulty: selectedDifficulty });
    if (selectedCompany !== 'All') params.set('company', selectedCompany);
    navigate(`/interview?${params.toString()}`);
  };

  const isReady = selectedType && selectedDifficulty;

  return (
    <div className="page-container">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center animate-slide-up">
          <h1 className="section-heading mb-2">Start Interview</h1>
          <p className="text-gray-500 dark:text-gray-400">Choose your interview type and difficulty to begin.</p>
        </div>

        {/* Step 1: Type */}
        <div className="animate-slide-up" style={{ animationDelay: '100ms' }}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500 text-white text-sm flex items-center justify-center font-bold">1</span>
            Select Interview Type
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {types.map((t) => (
              <button key={t.value} onClick={() => setSelectedType(t.value)} id={`type-${t.value.toLowerCase()}`}
                className={`glass-card p-6 text-left transition-all duration-300 hover:-translate-y-1 ${
                  selectedType === t.value ? 'ring-2 ring-brand-500 shadow-glow' : 'hover:shadow-lg'
                }`}>
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-2xl mb-3`}>
                  {t.icon}
                </div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{t.value}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Difficulty */}
        <div className="animate-slide-up" style={{ animationDelay: '200ms' }}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500 text-white text-sm flex items-center justify-center font-bold">2</span>
            Select Difficulty
          </h2>
          <div className="grid grid-cols-3 gap-4">
            {difficulties.map((d) => (
              <button key={d.value} onClick={() => setSelectedDifficulty(d.value)} id={`difficulty-${d.value.toLowerCase()}`}
                className={`p-4 rounded-xl border-2 font-semibold text-center transition-all duration-200 ${d.color} ${
                  selectedDifficulty === d.value ? 'ring-2 ring-brand-500 scale-105' : 'opacity-70 hover:opacity-100'
                }`}>
                {d.value}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Company (optional) */}
        <div className="animate-slide-up" style={{ animationDelay: '300ms' }}>
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <span className="w-7 h-7 rounded-lg bg-brand-500 text-white text-sm flex items-center justify-center font-bold">3</span>
            Company <span className="text-xs font-normal text-gray-400">(optional)</span>
          </h2>
          <div className="flex flex-wrap gap-2">
            {companies.map((c) => (
              <button key={c} onClick={() => setSelectedCompany(c)} id={`company-${c.toLowerCase()}`}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                  selectedCompany === c
                    ? 'bg-brand-500 text-white shadow-glow'
                    : 'bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-surface-800'
                }`}>
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <div className="text-center animate-slide-up pt-4" style={{ animationDelay: '400ms' }}>
          <button onClick={handleStart} disabled={!isReady || loading} id="start-interview-btn"
            className={`btn-primary text-lg px-12 py-4 ${!isReady ? 'opacity-50 cursor-not-allowed' : ''}`}>
            {loading ? 'Loading Questions...' : 'Start Interview →'}
          </button>
          {!isReady && (
            <p className="text-sm text-gray-400 mt-3">Please select a type and difficulty to continue.</p>
          )}
        </div>
      </div>
    </div>
  );
}
