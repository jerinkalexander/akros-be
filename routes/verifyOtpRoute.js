const express = require('express');
const router = express.Router();
const OTP = require('../models/app/Otp');
const User = require('../models/User');
const UserToken = require('../models/UserToken');
const { generateToken } = require('../utils/jwt');

router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required' });
  }

  try {
    // Find phone number
    const user = await User.findOne({ where: { number: phoneNumber } });
    if (!user) {
      return res.status(404).json({ message: 'Phone number not found' });
    }

    // Find OTP
    const otpRecord = await OTP.findOne({
      where: {
        userId: user.id,
        otp,
        expiresAt: { [require('sequelize').Op.gt]: new Date() }
      }
    });

    if (!otpRecord) {
      return res.status(401).json({ message: 'Invalid or expired OTP' });
    }

    // Generate JWT token
    const token = generateToken({ userId: user.id, phoneNumber: user.number });

    // Save token in user_tokens table
    await UserToken.create({ userId: user.id, token });

    res.json({ message: 'OTP verified successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
});

module.exports = router;