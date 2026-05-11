/**
 * Timer Component
 * ---------------
 * Countdown timer for interview questions.
 * - Displays time remaining with a circular progress ring
 * - Changes color based on urgency (green → amber → red)
 * - Calls onTimeout when time runs out
 */

import { useState, useEffect, useRef } from 'react';

export default function Timer({ duration = 60, onTimeout, questionKey }) {
  const [timeLeft, setTimeLeft] = useState(duration);
  const intervalRef = useRef(null);

  // Reset timer when question changes
  useEffect(() => {
    setTimeLeft(duration);
  }, [questionKey, duration]);

  // Countdown logic
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, [questionKey, onTimeout, duration]);

  // Calculate progress percentage
  const progress = (timeLeft / duration) * 100;

  // Determine color based on remaining time
  const getColor = () => {
    if (timeLeft > 30) return { stroke: '#10b981', text: 'text-emerald-500' }; // Green
    if (timeLeft > 10) return { stroke: '#f59e0b', text: 'text-amber-500' };   // Amber
    return { stroke: '#ef4444', text: 'text-red-500' };                         // Red
  };

  const color = getColor();

  // SVG circle dimensions
  const size = 72;
  const strokeWidth = 4;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center" id="question-timer">
      {/* Background ring */}
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={strokeWidth}
          className="text-gray-200 dark:text-gray-700"
        />
        {/* Progress ring */}
        <circle
          cx={size / 2} cy={size / 2} r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          className="transition-all duration-1000 ease-linear"
        />
      </svg>
      {/* Time text */}
      <span className={`absolute text-lg font-bold ${color.text} ${timeLeft <= 10 ? 'animate-pulse' : ''}`}>
        {timeLeft}s
      </span>
    </div>
  );
}
