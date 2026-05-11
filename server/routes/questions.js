/**
 * Questions Routes
 * ----------------
 * GET /api/questions            — Fetch randomized questions (with filters)
 * GET /api/questions/companies  — List all available company tags
 *
 * Query Parameters for GET /api/questions:
 *   - type:       "HR" | "Technical" | "Aptitude" (required)
 *   - difficulty: "Easy" | "Medium" | "Hard" (optional, defaults to all)
 *   - company:    Company name filter (optional)
 *   - count:      Number of questions to return (optional, defaults to 10)
 */

const express = require('express');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/questions
 * @desc    Fetch randomized questions based on type, difficulty, company
 * @access  Protected
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { type, difficulty, company, count = 10 } = req.query;

    // Type is required
    if (!type || !['HR', 'Technical', 'Aptitude'].includes(type)) {
      return res.status(400).json({
        message: 'Please provide a valid type: HR, Technical, or Aptitude.',
      });
    }

    // Build query filter
    const filter = { type };
    if (difficulty && ['Easy', 'Medium', 'Hard'].includes(difficulty)) {
      filter.difficulty = difficulty;
    }
    if (company && company !== 'All') {
      filter.company = company;
    }

    // Use MongoDB $sample to get random questions
    const limit = Math.min(parseInt(count), 20); // Cap at 20 questions
    const questions = await Question.aggregate([
      { $match: filter },
      { $sample: { size: limit } },
    ]);

    if (questions.length === 0) {
      return res.status(404).json({
        message: 'No questions found for the selected criteria.',
      });
    }

    res.json({ questions, total: questions.length });
  } catch (error) {
    console.error('Fetch questions error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

/**
 * @route   GET /api/questions/companies
 * @desc    Get list of all unique company tags in the database
 * @access  Protected
 */
router.get('/companies', authMiddleware, async (req, res) => {
  try {
    const companies = await Question.distinct('company');
    res.json({ companies: companies.sort() });
  } catch (error) {
    console.error('Fetch companies error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
