const express = require('express');
const User = require('../models/User');
const Question = require('../models/Question');
const Attempt = require('../models/Attempt');
const authMiddleware = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

const router = express.Router();

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware);
router.use(adminAuth);

/**
 * @route   GET /api/admin/stats
 * @desc    Get system-wide statistics
 */
router.get('/stats', async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalQuestions = await Question.countDocuments();
    const totalAttempts = await Attempt.countDocuments();
    
    // Get attempts by type
    const attemptsByType = await Attempt.aggregate([
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    res.json({
      totalUsers,
      totalQuestions,
      totalAttempts,
      attemptsByType
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching stats.' });
  }
});

/**
 * @route   GET /api/admin/users
 * @desc    Get all registered users
 */
router.get('/users', async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching users.' });
  }
});

/**
 * @route   GET /api/admin/questions
 * @desc    Get all questions for management
 */
router.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find().sort({ createdAt: -1 });
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching questions.' });
  }
});

/**
 * @route   POST /api/admin/questions
 * @desc    Create a new interview question
 */
router.post('/questions', async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   PUT /api/admin/questions/:id
 * @desc    Update an existing question
 */
router.put('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

/**
 * @route   DELETE /api/admin/questions/:id
 * @desc    Delete a question
 */
router.delete('/questions/:id', async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error deleting question.' });
  }
});

module.exports = router;
