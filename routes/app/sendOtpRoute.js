const express = require('express');
const router = express.Router();

const PhoneNumber = require('../../models/app/PhoneNumber');
const OTP = require('../../models/app/Otp');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

router.post('/send-otp', async (req, res) => {
  const { phoneNumber } = req.body;

  if (!phoneNumber) {
    return res.status(400).json({ message: 'Phone number is required' });
  }

  const otp = generateOTP();
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

  try {
    // 1. Find or create phone number
    let phone = await PhoneNumber.findOne({ where: { number: phoneNumber } });

    if (!phone) {
      phone = await PhoneNumber.create({ number: phoneNumber });
    }

    // 2. Create OTP linked to phone number
    await OTP.create({
      phoneNumberId: phone.id,
      otp,
      expiresAt,
    });

    console.log(`Generated OTP for ${phoneNumber}: ${otp}`);
    res.json({ message: 'OTP generated and saved successfully.' });
  } catch (error) {
    console.error('Error generating OTP:', error);
    res.status(500).json({ message: 'Database error', error });
  }
});

module.exports = router;
