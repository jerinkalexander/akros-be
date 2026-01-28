const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../../models/User');
const Role = require('../../models/Role');

// ✅ Admin Registration/Setup - POST /admin/register
// Creates or updates admin user with phone number and password
router.post('/', async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;

    // Validate input
    if (!phoneNumber || !password) {
      return res.status(400).json({ error: 'Phone number and password are required' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long' });
    }

    // Get admin role
    const adminRole = await Role.findOne({ where: { name: 'admin' } });
    if (!adminRole) {
      return res.status(500).json({ error: 'Admin role not found. Please run role seeder first.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Check if admin user exists
    const existingAdmin = await User.findOne({ where: { number: phoneNumber } });

    if (existingAdmin) {
      // Update existing user
      existingAdmin.password = hashedPassword;
      existingAdmin.roleId = adminRole.id;
      await existingAdmin.save();

      return res.status(200).json({
        message: 'Admin user registered successfully',
        user: {
          id: existingAdmin.id,
          phoneNumber: existingAdmin.number,
          role: adminRole.name
        }
      });
    }

    // Create new admin user
    const newAdmin = await User.create({
      number: phoneNumber,
      password: hashedPassword,
      roleId: adminRole.id
    });

    res.status(201).json({
      message: 'Admin user created successfully',
      user: {
        id: newAdmin.id,
        phoneNumber: newAdmin.number,
        role: adminRole.name
      }
    });
  } catch (err) {
    console.error('Error in admin registration:', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
