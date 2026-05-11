/**
 * InterviewX — Server Entry Point
 * ================================
 * Express.js server that provides REST API endpoints for:
 *   - User authentication (register/login)
 *   - Interview questions (randomized fetch)
 *   - Attempt submission and history
 *
 * Environment variables (loaded from .env):
 *   - PORT:       Server port (default 5000)
 *   - MONGO_URI:  MongoDB Atlas connection string
 *   - JWT_SECRET: Secret key for JWT signing
 */

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Import route handlers
const authRoutes = require('./routes/auth');
const questionRoutes = require('./routes/questions');
const attemptRoutes = require('./routes/attempts');

// Initialize Express app
const app = express();

// ────────────────────────────────────────────────────────────
// Middleware
// ────────────────────────────────────────────────────────────

// Enable CORS for all origins (adjust in production)
app.use(cors());

// Parse incoming JSON request bodies
app.use(express.json());

// ────────────────────────────────────────────────────────────
// API Routes
// ────────────────────────────────────────────────────────────

app.use('/api/auth', authRoutes);
app.use('/api/questions', questionRoutes);
app.use('/api/attempts', attemptRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'InterviewX API is running 🚀' });
});

// 404 handler for undefined routes
app.use((req, res) => {
  res.status(404).json({ message: 'Route not found.' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ message: 'Internal server error.' });
});

// ────────────────────────────────────────────────────────────
// Start Server
// ────────────────────────────────────────────────────────────

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB(); // Connect to MongoDB first
  app.listen(PORT, () => {
    console.log(`🚀 InterviewX server running on port ${PORT}`);
    console.log(`📡 API available at http://localhost:${PORT}/api`);
  });
};

startServer();
