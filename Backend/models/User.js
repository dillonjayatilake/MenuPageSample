const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['customer', 'chef', 'admin'],
    default: 'customer'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password and ensure email is lowercase before saving
userSchema.pre('save', async function(next) {
  try {
    // Ensure email is lowercase
    if (this.email) {
      this.email = this.email.toLowerCase();
    }

    // Only hash password if it's modified or new
    if (!this.isModified('password')) {
      return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    console.error('Pre-save error:', error);
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(passwordToMatch) {
  return await bcrypt.compare(passwordToMatch, this.password);
};

module.exports = mongoose.model('User', userSchema);
