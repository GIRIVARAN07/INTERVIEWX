/**
 * ThemeToggle Component
 * ---------------------
 * A sleek toggle button for switching between dark and light modes.
 * Displays a sun/moon icon based on the current theme.
 */

import { useTheme } from '../contexts/ThemeContext';

export default function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      id="theme-toggle-btn"
      onClick={toggleTheme}
      className="relative p-2 rounded-xl bg-gray-100 dark:bg-surface-700 hover:bg-gray-200 dark:hover:bg-surface-800 transition-all duration-300 group"
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {/* Sun icon (shown in dark mode → click to go light) */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${isDark ? 'text-amber-400 rotate-0 scale-100' : 'text-gray-400 rotate-90 scale-0 absolute'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>

      {/* Moon icon (shown in light mode → click to go dark) */}
      <svg
        className={`w-5 h-5 transition-all duration-300 ${!isDark ? 'text-brand-600 rotate-0 scale-100' : 'text-gray-400 -rotate-90 scale-0 absolute'}`}
        fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
      </svg>
    </button>
  );
}
