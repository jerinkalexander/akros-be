const express = require('express');
const router = express.Router();
const UserProfile = require('../../models/app/UserProfile');
const PhoneNumber = require('../../models/app/PhoneNumber');

router.post('/user-profile', async (req, res) => {
  try {
    const { name, carNumber, email, place, phoneNumberId } = req.body;

    if (!name || !carNumber || !phoneNumberId) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    const phoneRecord = await PhoneNumber.findByPk(phoneNumberId);
    if (!phoneRecord) {
      return res.status(404).json({ message: 'Phone number not found' });
    }

    const record = await UserProfile.create({
      name,
      carNumber,
      email,
      place,
      phoneNumberId
    });

    res.status(201).json({ message: 'Data saved successfully', data: record });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
