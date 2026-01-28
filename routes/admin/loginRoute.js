const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Role = require('../../models/Role');
const { generateToken } = require('../../utils/jwt');

// ✅ Admin Login - POST /admin/login
router.post('/', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validate input
    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    // Find admin user
    const admin = await User.findOne({
      where: { number: phoneNumber },
      include: [{ model: Role }]
    });

    if (!admin) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if user is admin
    if (admin.Role.name !== 'admin') {
      return res.status(403).json({ error: 'Only admin users can login here' });
    }

    // Check if password exists in database
    if (!admin.password) {
      return res.status(401).json({ error: 'Admin user password not set. Please contact administrator to reset password.' });
    }

    // Check password
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate token
    const token = generateToken({
      userId: admin.id,
      phoneNumber: admin.number,
      role: admin.Role.name
    });

    res.status(200).json({
      message: 'Login successful',
      token,
      user: {
        id: admin.id,
        phoneNumber: admin.number,
        role: admin.Role.name
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
