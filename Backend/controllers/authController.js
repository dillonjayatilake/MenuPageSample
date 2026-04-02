const jwt = require('jsonwebtoken');
const User = require('../models/User');

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Find user by email in MongoDB
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password using the schema method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, confirmPassword, role } = req.body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: 'Passwords do not match' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    // Only allow chef and admin roles
    if (!['chef', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role. Only chef and admin can register' });
    }

    // Check if user already exists
    try {
      const existingUser = await User.findOne({ email: email.toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ message: 'Email already registered' });
      }
    } catch (dbError) {
      console.error('Database error checking existing user:', dbError);
      return res.status(500).json({ error: 'Database error: ' + dbError.message });
    }

    // Create new user
    try {
      const newUser = new User({
        name,
        email: email.toLowerCase(),
        password,
        role
      });

      console.log('Saving new user:', { name, email: newUser.email, role });
      await newUser.save();
      console.log('User saved successfully');

      // Create token
      const token = jwt.sign(
        {
          id: newUser._id,
          email: newUser.email,
          role: newUser.role
        },
        process.env.JWT_SECRET || 'your-secret-key',
        { expiresIn: '1d' }
      );

      // Send response
      res.status(201).json({
        token,
        user: {
          id: newUser._id,
          email: newUser.email,
          name: newUser.name,
          role: newUser.role
        },
        message: 'Account created successfully'
      });
    } catch (saveError) {
      console.error('Error saving user:', saveError);
      res.status(500).json({ error: 'Error creating user: ' + saveError.message });
    }
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: error.message });
  }
};

const seedUsers = async (req, res) => {
  try {
    // Check if users already exist
    const existingUsers = await User.countDocuments();
    if (existingUsers > 0) {
      return res.status(400).json({ message: 'Users already exist in the database' });
    }

    // Create initial users
    const newUsers = await User.insertMany([
      {
        name: 'John Customer',
        email: 'customer@test.com',
        password: '123456',
        role: 'customer'
      },
      {
        name: 'Chef Cook',
        email: 'chef@test.com',
        password: '123456',
        role: 'chef'
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: '123456',
        role: 'admin'
      }
    ]);

    res.json({ message: 'Users seeded successfully', users: newUsers });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const resetDatabase = async (req, res) => {
  try {
    // Drop the User collection and recreate it
    await User.collection.dropIndex('email_1');
    console.log('Email index dropped');
    
    // Clear all users
    await User.deleteMany({});
    console.log('All users deleted');
    
    res.json({ message: 'Database reset successfully' });
  } catch (error) {
    console.error('Reset error:', error);
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login,
  signup,
  seedUsers,
  resetDatabase
};


