const express = require('express');
const router = express.Router();
const vonage = require('../utils/vonageClient');
const User = require('../models/User');
const Role = require('../models/Role');
const OTP = require('../models/app/Otp');

// const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

const generateOTP = '123456'; // For testing purposes, fixed OTP

router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;
  const role = req.baseUrl.includes('/user') ? 'user' : 'shop';
  const otp = generateOTP;
  const from = "VonageOTP"; // Sender ID
  const to = "+919809664605";
  const text = `Your OTP code is: ${otp}`;


   if (!phoneNumber )  {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
     // 1. Find role
    const userRole = await Role.findOne({ where: { name: role } });
    if (!userRole) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // 2. Find or create user
    let user = await User.findOne({ where: { number: phoneNumber, roleId: userRole.id } });
    if (!user) {
      user = await User.create({ number: phoneNumber, roleId: userRole.id });
    }

    // 3. Create OTP linked to phone number
    await OTP.create({
      userId: user.id,
      otp,
      expiresAt,
    });
    
   // 4. Send SMS via Vonage
    const response = await vonage.sms.send({ to, from, text });
    console.log("Vonage response:", response);

    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
    res.json({ message: 'OTP generated and saved successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Database error', error });
  }
});

module.exports = router;
