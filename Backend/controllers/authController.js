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

module.exports = {
  login,
  seedUsers
};


