const express = require('express');
const router = express.Router();
const UserProfile = require('../models/app/Profile');
const PhoneNumber = require('../models/User');
const UserDevice = require('../models/UserDevice');
const { sendPushNotification } = require('../utils/pushNotification');

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

router.post('/user-device-token', async (req, res) => {
  try {
    const { id, userId, deviceType, pushToken } = req.body;

    if (!id || !userId || !deviceType || !pushToken) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    if (!['ios', 'android'].includes(deviceType)) {
      return res.status(400).json({ message: 'Invalid device type' });
    }

    const newDevice = await UserDevice.create({
      id,
      userId,
      deviceType,
      pushToken,
      isActive: true
    });

    res.status(201).json({ message: 'User device token saved successfully', data: newDevice });
  } catch (error) {
    console.error('Error saving user device token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/send-push-notification', async (req, res) => {
  try {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      return res.status(400).json({ message: 'Required fields missing: userId, title, body' });
    }

    const result = await sendPushNotification(userId, title, body);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error in send-push-notification endpoint:', error);
    res.status(500).json({ message: 'Failed to send push notification', error: error.message });
  }
});

module.exports = router;
