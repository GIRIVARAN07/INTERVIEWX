/**
 * ResultCard Component
 * --------------------
 * Displays a single answer result with question, user answer, correct answer, and status icon.
 */

export default function ResultCard({ result, index }) {
  const { question, userAnswer, correctAnswer, isCorrect } = result;

  return (
    <div
      className={`p-5 rounded-xl border-2 transition-all duration-300 animate-fade-in ${
        isCorrect
          ? 'border-emerald-200 dark:border-emerald-800 bg-emerald-50/50 dark:bg-emerald-950/20'
          : 'border-red-200 dark:border-red-800 bg-red-50/50 dark:bg-red-950/20'
      }`}
      style={{ animationDelay: `${index * 50}ms` }}
      id={`result-card-${index}`}
    >
      <div className="flex items-start justify-between mb-3">
        <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">Q{index + 1}</span>
        <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
      </div>
      <p className="font-medium text-gray-900 dark:text-white mb-4 leading-relaxed">{question}</p>
      <div className="space-y-2">
        <div className="flex items-start gap-2">
          <span className="text-xs font-semibold text-gray-400 mt-0.5 w-24 flex-shrink-0">Your answer:</span>
          <span className={`text-sm font-medium ${isCorrect ? 'text-emerald-700 dark:text-emerald-400' : 'text-red-700 dark:text-red-400'}`}>
            {userAnswer || '(No answer provided)'}
          </span>
        </div>
        {!isCorrect && (
          <div className="flex items-start gap-2">
            <span className="text-xs font-semibold text-gray-400 mt-0.5 w-24 flex-shrink-0">Correct:</span>
            <span className="text-sm text-emerald-700 dark:text-emerald-400 font-medium">{correctAnswer}</span>
          </div>
        )}
      </div>
    </div>
  );
}
