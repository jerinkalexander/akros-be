const express = require('express');
const router = express.Router();
const OTP = require('../models/Otp');
const PhoneNumber = require('../models/PhoneNumber');

router.post('/verify-otp', async (req, res) => {
  const { phoneNumber, otp } = req.body;

  if (!phoneNumber || !otp) {
    return res.status(400).json({ message: 'Phone number and OTP are required.' });
  }

  try {
    // Find the phone number entry
    const phone = await PhoneNumber.findOne({ where: { number: phoneNumber } });

    if (!phone) {
      return res.status(404).json({ message: 'Phone number not found.' });
    }

    // Find latest OTP for that phoneNumberId
    const latestOtp = await OTP.findOne({
      where: { phoneNumberId: phone.id },
      order: [['createdAt', 'DESC']],
    });

    if (!latestOtp) {
      return res.status(404).json({ message: 'No OTP found for this number.' });
    }

    // Check OTP match and expiry
    const now = new Date();
    if (latestOtp.otp !== otp) {
      return res.status(401).json({ message: 'Invalid OTP.' });
    }

    if (now > latestOtp.expiresAt) {
      return res.status(410).json({ message: 'OTP expired.' });
    }

    // ✅ Success
    res.status(200).json({ message: 'OTP verified successfully.' });
  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

module.exports = router;
