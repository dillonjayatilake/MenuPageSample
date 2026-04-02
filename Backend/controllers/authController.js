const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// Temporary users database (replace with MongoDB User model later)
const users = [
  { id: 1, email: 'customer@test.com', name: 'John', password: bcrypt.hashSync('123456', 10), role: 'customer' },
  { id: 2, email: 'chef@test.com', name: 'Chef', password: bcrypt.hashSync('123456', 10), role: 'chef' },
];

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Find user by email
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Compare password
    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1d' }
    );

    // Send response
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  login
};

