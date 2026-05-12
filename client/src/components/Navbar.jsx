/**
 * Navbar Component
 * ----------------
 * Fixed top navigation bar with:
 *   - Logo / brand name
 *   - Navigation links (Dashboard, Start Interview)
 *   - Theme toggle (dark/light)
 *   - User menu with logout
 *   - Mobile responsive hamburger menu
 */

import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import ThemeToggle from './ThemeToggle';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  // Check if a path is active for styling
  const isActive = (path) => location.pathname === path;

  const navLinkClass = (path) =>
    `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400'
        : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700'
    }`;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-surface-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to={isAuthenticated ? '/dashboard' : '/'} className="flex items-center gap-2 group" id="navbar-logo">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center shadow-md group-hover:shadow-glow transition-shadow">
              <span className="text-white font-bold text-sm">IX</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-800 dark:from-brand-400 dark:to-brand-600 bg-clip-text text-transparent">
              InterviewX
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className={navLinkClass('/dashboard')} id="nav-dashboard">
                  Dashboard
                </Link>
                <Link to="/interview/select" className={navLinkClass('/interview/select')} id="nav-start-interview">
                  Start Interview
                </Link>
                {(user?.role === 'admin' || user?.email === 'admin@gmail.com') && (
                  <Link to="/admin" className={navLinkClass('/admin')} id="nav-admin">
                    Admin
                  </Link>
                )}
                <div className="w-px h-6 bg-gray-200 dark:bg-gray-700 mx-2" />
                <ThemeToggle />
                <div className="flex items-center gap-3 ml-2">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                    <span className="text-white text-sm font-semibold">
                      {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                    </span>
                  </div>
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300 hidden lg:block">
                    {user?.name}
                  </span>
                  <button onClick={handleLogout} className="btn-secondary !px-4 !py-2 !text-xs" id="nav-logout-btn">
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <ThemeToggle />
                <Link to="/login" className={navLinkClass('/login')} id="nav-login">
                  Login
                </Link>
                <Link to="/register" className="btn-primary !px-4 !py-2 !text-sm" id="nav-register">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <button
              id="mobile-menu-btn"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors"
            >
              {isMobileMenuOpen ? (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden animate-slide-down border-t border-gray-200/50 dark:border-gray-800/50 bg-white/95 dark:bg-surface-900/95 backdrop-blur-xl">
          <div className="px-4 py-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="flex items-center gap-3 px-4 py-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-brand-400 to-brand-600 flex items-center justify-center">
                    <span className="text-white font-semibold">{user?.name?.charAt(0)?.toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                </div>
                <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors">
                  📊 Dashboard
                </Link>
                <Link to="/interview/select" onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors">
                  🎯 Start Interview
                </Link>
                {(user?.role === 'admin' || user?.email === 'admin@gmail.com') && (
                  <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)}
                    className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors">
                    🛡️ Admin Panel
                  </Link>
                )}
                <hr className="border-gray-200 dark:border-gray-700 my-2" />
                <button onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors">
                  🚪 Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-surface-700 transition-colors">
                  Login
                </Link>
                <Link to="/register" onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-4 py-3 rounded-xl btn-primary text-center">
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
