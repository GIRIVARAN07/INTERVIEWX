/**
 * Theme Context
 * -------------
 * Provides dark/light mode toggle functionality.
 * Theme preference is persisted in localStorage.
 * Adds/removes 'dark' class on <html> element for Tailwind dark mode.
 */

import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Initialize theme from localStorage or default to 'dark'
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem('interviewx-theme');
    return saved ? saved === 'dark' : true; // Default to dark mode
  });

  // Apply theme class to <html> element whenever it changes
  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('interviewx-theme', isDark ? 'dark' : 'light');
  }, [isDark]);

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
