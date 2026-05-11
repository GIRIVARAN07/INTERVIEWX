/**
 * Question Model
 * --------------
 * Stores interview questions for HR, Technical, and Aptitude categories.
 *
 * Fields:
 *   - type:          Category of the question (HR / Technical / Aptitude)
 *   - difficulty:    Difficulty level (Easy / Medium / Hard)
 *   - company:       Company tag (e.g. "Google", "TCS", "General")
 *   - question:      The question text
 *   - options:       Array of 4 MCQ options (for Technical/Aptitude)
 *   - correctAnswer: The correct answer string
 *   - keywords:      Array of keywords for keyword-matching (HR open-ended)
 *   - isOpenEnded:   Whether the question expects a free-text answer
 */

const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
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
  company: {
    type: String,
    default: 'General',
    trim: true,
  },
  question: {
    type: String,
    required: true,
  },
  options: {
    type: [String],
    default: [], // Empty for open-ended HR questions
  },
  correctAnswer: {
    type: String,
    required: true,
  },
  keywords: {
    type: [String],
    default: [], // Used for keyword-matching on HR questions
  },
  isOpenEnded: {
    type: Boolean,
    default: false,
  },
});

// Index for efficient querying by type and difficulty
questionSchema.index({ type: 1, difficulty: 1 });

module.exports = mongoose.model('Question', questionSchema);
