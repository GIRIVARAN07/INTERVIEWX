/**
 * Attempts Routes
 * ---------------
 * POST /api/attempts      — Submit a completed interview attempt
 * GET  /api/attempts      — Get all attempts for the logged-in user
 * GET  /api/attempts/:id  — Get a single attempt by ID
 *
 * Scoring Logic:
 *   - MCQ (Technical/Aptitude): Exact match with correctAnswer
 *   - Open-ended (HR): Keyword matching — checks if user's answer
 *     contains any of the defined keywords (case-insensitive)
 */

const express = require('express');
const Attempt = require('../models/Attempt');
const Question = require('../models/Question');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

/**
 * Scores a single answer based on question type.
 * MCQ: exact match (case-insensitive) with correctAnswer
 * Open-ended: keyword matching — counts matched keywords and
 * considers it correct if at least 2 keywords match (or 1 if fewer exist)
 */
function scoreAnswer(question, userAnswer) {
  if (!userAnswer || userAnswer.trim() === '') {
    return false;
  }

  const answer = userAnswer.trim().toLowerCase();

  if (question.isOpenEnded && question.keywords && question.keywords.length > 0) {
    // Keyword matching for HR open-ended questions
    const matchedKeywords = question.keywords.filter((kw) =>
      answer.includes(kw.toLowerCase())
    );
    // Require at least 2 keyword matches, or 1 if there are fewer than 2 keywords
    const threshold = Math.min(2, question.keywords.length);
    return matchedKeywords.length >= threshold;
  } else {
    // MCQ: exact match (case-insensitive)
    return answer === question.correctAnswer.trim().toLowerCase();
  }
}

/**
 * @route   POST /api/attempts
 * @desc    Submit an interview attempt with answers for scoring
 * @access  Protected
 *
 * Expected body:
 * {
 *   type: "HR" | "Technical" | "Aptitude",
 *   difficulty: "Easy" | "Medium" | "Hard",
 *   answers: [
 *     { questionId: "...", userAnswer: "..." },
 *     ...
 *   ]
 * }
 */
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { type, difficulty, answers } = req.body;

    // Validate required fields
    if (!type || !difficulty || !answers || !Array.isArray(answers)) {
      return res.status(400).json({
        message: 'Please provide type, difficulty, and answers array.',
      });
    }

    // Fetch the actual questions from the DB for scoring
    const questionIds = answers.map((a) => a.questionId);
    const questions = await Question.find({ _id: { $in: questionIds } });

    // Build a map for quick lookup
    const questionMap = {};
    questions.forEach((q) => {
      questionMap[q._id.toString()] = q;
    });

    // Score each answer
    let correctCount = 0;
    const scoredAnswers = answers.map((ans) => {
      const question = questionMap[ans.questionId];
      if (!question) {
        return {
          questionId: ans.questionId,
          question: 'Question not found',
          userAnswer: ans.userAnswer || '',
          correctAnswer: 'N/A',
          isCorrect: false,
        };
      }

      const isCorrect = scoreAnswer(question, ans.userAnswer);
      if (isCorrect) correctCount++;

      return {
        questionId: question._id,
        question: question.question,
        userAnswer: ans.userAnswer || '',
        correctAnswer: question.correctAnswer,
        isCorrect,
      };
    });

    // Calculate percentage score
    const totalQuestions = answers.length;
    const score = totalQuestions > 0
      ? Math.round((correctCount / totalQuestions) * 100)
      : 0;

    // Save the attempt
    const attempt = await Attempt.create({
      userId: req.user.id,
      type,
      difficulty,
      score,
      totalQuestions,
      correctCount,
      answers: scoredAnswers,
    });

    res.status(201).json({
      message: 'Attempt submitted successfully!',
      attempt: {
        id: attempt._id,
        type: attempt.type,
        difficulty: attempt.difficulty,
        score: attempt.score,
        totalQuestions: attempt.totalQuestions,
        correctCount: attempt.correctCount,
        answers: attempt.answers,
        createdAt: attempt.createdAt,
      },
    });
  } catch (error) {
    console.error('Submit attempt error:', error);
    res.status(500).json({ message: 'Server error. Please try again later.' });
  }
});

/**
 * @route   GET /api/attempts
 * @desc    Get all attempts for the currently logged-in user
 * @access  Protected
 */
router.get('/', authMiddleware, async (req, res) => {
  try {
    const attempts = await Attempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 }) // Most recent first
      .select('-answers'); // Exclude detailed answers for list view

    res.json({ attempts });
  } catch (error) {
    console.error('Fetch attempts error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

/**
 * @route   GET /api/attempts/:id
 * @desc    Get a single attempt with full details (including answers)
 * @access  Protected
 */
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const attempt = await Attempt.findOne({
      _id: req.params.id,
      userId: req.user.id, // Ensure user can only see their own attempts
    });

    if (!attempt) {
      return res.status(404).json({ message: 'Attempt not found.' });
    }

    res.json({ attempt });
  } catch (error) {
    console.error('Fetch attempt error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
});

module.exports = router;
