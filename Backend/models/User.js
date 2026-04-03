const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: { sparse: true },
    lowercase: true,
    trim: true,
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: true,
    minlength: 6
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
}, { timestamps: true });

// Hash password and ensure email is lowercase before saving
userSchema.pre('save', async function() {
  // Ensure email is lowercase
  if (this.email) {
    this.email = this.email.toLowerCase().trim();
  }

  // Only hash password if it's modified or new
  if (!this.isModified('password')) {
    return;
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    console.error('Pre-save password hashing error:', error);
    throw error;
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(passwordToMatch) {
  try {
    return await bcrypt.compare(passwordToMatch, this.password);
  } catch (error) {
    console.error('Password comparison error:', error);
    return false;
  }
};

// Remove password from JSON response
userSchema.methods.toJSON = function() {
  const user = this.toObject();
  delete user.password;
  return user;
};

module.exports = mongoose.model('User', userSchema);