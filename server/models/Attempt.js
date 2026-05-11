/**
 * Attempt Model
 * -------------
 * Records each interview attempt made by a user.
 * Stores the score, answers given, and metadata for the dashboard/history.
 *
 * Fields:
 *   - userId:         Reference to the User who took the interview
 *   - type:           Interview type (HR / Technical / Aptitude)
 *   - difficulty:     Difficulty level
 *   - score:          Percentage score (0–100)
 *   - totalQuestions:  Number of questions in the session
 *   - correctCount:   Number of correctly answered questions
 *   - answers:        Array of answer objects with question details
 *   - createdAt:      Auto-generated timestamp
 */

const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Question',
    required: true,
  },
  question: {
    type: String,
    required: true,
  },
  userAnswer: {
    type: String,
    default: '', // Empty string if user skipped/timed out
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  isCorrect: {
    type: Boolean,
    required: true,
  },
}, { _id: false });

const attemptSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    required: true,
    enum: ['HR', 'Technical', 'Aptitude'],
  },
  difficulty: {
    type: String,
    required: true,
    enum: ['Easy', 'Medium', 'Hard'],
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
  },
  totalQuestions: {
    type: Number,
    required: true,
  },
  correctCount: {
    type: Number,
    required: true,
  },
  answers: [answerSchema],
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

// Index for fetching user's attempts efficiently
attemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);

// Index for fetching user's attempts efficiently
attemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model('Attempt', attemptSchema);
