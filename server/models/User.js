/**
 * User Model
 * ----------
 * Stores registered user information.
 * Passwords are automatically hashed before saving using bcryptjs.
 *
 * Fields:
 *   - name:      User's full name
 *   - email:     Unique email address (used for login)
 *   - password:  Hashed password (bcrypt, 10 salt rounds)
 *   - createdAt: Auto-generated timestamp
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
  },
}, {
  timestamps: true, // Adds createdAt and updatedAt
});

/**
 * Pre-save hook: Hash the password before saving to the database.
 * Only hashes if the password field has been modified (avoids re-hashing on update).
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

/**
 * Instance method: Compare a plain-text password with the hashed password.
 * Used during login to verify credentials.
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
