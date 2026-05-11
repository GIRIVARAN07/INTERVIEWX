/**
 * QuestionCard Component
 * ----------------------
 * Displays a single interview question with:
 *   - Question text and number
 *   - MCQ options (clickable cards) OR text area for open-ended
 *   - Visual feedback for selected option
 */

export default function QuestionCard({ question, questionNumber, totalQuestions, selectedAnswer, onAnswer }) {
  const isOpenEnded = question.isOpenEnded;

  return (
    <div className="glass-card p-6 sm:p-8 animate-fade-in" id="question-card">
      {/* Question header */}
      <div className="flex items-center justify-between mb-6">
        <span className="badge-brand">
          Question {questionNumber} of {totalQuestions}
        </span>
        <span className="badge-brand">
          {question.type} • {question.difficulty}
        </span>
      </div>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full mb-6 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-brand-500 to-brand-600 rounded-full transition-all duration-500"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question text */}
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 dark:text-white mb-8 leading-relaxed">
        {question.question}
      </h2>

      {/* Answer area */}
      {isOpenEnded ? (
        /* Open-ended text area (for HR questions) */
        <div>
          <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
            Type your answer below:
          </label>
          <textarea
            id="open-ended-answer"
            className="input-field min-h-[150px] resize-y"
            placeholder="Write your response here..."
            value={selectedAnswer || ''}
            onChange={(e) => onAnswer(e.target.value)}
            maxLength={2000}
          />
          <p className="text-xs text-gray-400 mt-2 text-right">
            {(selectedAnswer || '').length}/2000 characters
          </p>
        </div>
      ) : (
        /* MCQ options */
        <div className="space-y-3">
          {question.options?.map((option, index) => {
            const isSelected = selectedAnswer === option;
            const optionLetter = String.fromCharCode(65 + index); // A, B, C, D

            return (
              <button
                key={index}
                id={`option-${index}`}
                onClick={() => onAnswer(option)}
                className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 group
                  ${isSelected
                    ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/50 shadow-glow'
                    : 'border-gray-200 dark:border-gray-700 hover:border-brand-300 dark:hover:border-brand-600 hover:bg-gray-50 dark:hover:bg-surface-800'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span
                    className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors
                    ${isSelected
                      ? 'bg-brand-500 text-white'
                      : 'bg-gray-100 dark:bg-surface-700 text-gray-600 dark:text-gray-300 group-hover:bg-brand-100 dark:group-hover:bg-brand-900'
                    }`}
                  >
                    {optionLetter}
                  </span>
                  <span className={`text-base ${isSelected ? 'text-brand-700 dark:text-brand-300 font-medium' : 'text-gray-700 dark:text-gray-200'}`}>
                    {option}
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
