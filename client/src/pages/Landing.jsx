/**
 * Landing Page
 * ------------
 * Hero landing page for unauthenticated users with:
 *   - Animated hero section with gradient text
 *   - Feature cards with icons
 *   - Call-to-action buttons
 */

import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const features = [
  { icon: '🎯', title: 'HR Interviews', desc: 'Practice behavioral and situational questions with keyword-based evaluation.' },
  { icon: '💻', title: 'Technical MCQs', desc: 'Test your knowledge of DSA, web development, databases, and more.' },
  { icon: '🧮', title: 'Aptitude Tests', desc: 'Sharpen your quantitative, logical, and analytical reasoning skills.' },
  { icon: '⏱️', title: 'Timed Sessions', desc: '60-second timer per question simulates real interview pressure.' },
  { icon: '📊', title: 'Performance Analytics', desc: 'Track your progress with detailed charts and attempt history.' },
  { icon: '🏢', title: 'Company Questions', desc: 'Practice with questions from Google, Amazon, TCS, Infosys & more.' },
];

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-brand-500/20 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-brand-700/20 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-400/10 rounded-full blur-3xl" />
        </div>

        <div className="relative max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300 text-sm font-medium mb-8 animate-fade-in">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            Free & Open for All Students
          </div>

          {/* Headline */}
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 animate-slide-up">
            <span className="bg-gradient-to-r from-brand-500 via-brand-600 to-purple-600 dark:from-brand-400 dark:via-brand-500 dark:to-purple-400 bg-clip-text text-transparent">
              Ace Your Next
            </span>
            <br />
            <span className="text-gray-900 dark:text-white">Interview</span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-10 animate-slide-up" style={{ animationDelay: '100ms' }}>
            Practice HR, Technical, and Aptitude interviews with timed sessions,
            instant scoring, and detailed performance analytics — completely free.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn-primary text-lg px-8 py-4" id="hero-dashboard-btn">
                Go to Dashboard →
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn-primary text-lg px-8 py-4" id="hero-register-btn">
                  Get Started Free →
                </Link>
                <Link to="/login" className="btn-secondary text-lg px-8 py-4" id="hero-login-btn">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-lg mx-auto mt-16 animate-fade-in" style={{ animationDelay: '400ms' }}>
            {[
              { value: '60+', label: 'Questions' },
              { value: '3', label: 'Categories' },
              { value: '100%', label: 'Free' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <p className="text-3xl font-bold text-brand-600 dark:text-brand-400">{stat.value}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-surface-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="section-heading mb-4">Everything You Need</h2>
            <p className="text-gray-600 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              A complete interview preparation platform designed for college placements.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div
                key={f.title}
                className="glass-card p-6 hover:shadow-glow hover:-translate-y-1 transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 text-center border-t border-gray-200 dark:border-gray-800">
        <p className="text-sm text-gray-500 dark:text-gray-400">
          © 2025 InterviewX. Built for students, by students. 🎓
        </p>
      </footer>
    </div>
  );
}
