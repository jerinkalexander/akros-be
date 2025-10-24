const express = require('express');
const router = express.Router();
const UserProfile = require('../models/app/Profile');
const PhoneNumber = require('../models/User');
const UserDevice = require('../models/UserDevice');
const UserLocation = require('../models/app/UserLocation');
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
      userId: phoneNumberId
    });

    res.status(201).json({ message: 'Data saved successfully', data: record });
  } catch (error) {
    console.error('Error saving data:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user-profile', async (req, res) => {
  try {
    // Assuming auth middleware sets req.user with userId
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const profile = await UserProfile.findOne({
      where: { userId: userId },
      include: [{ model: PhoneNumber, as: 'user' }]
    });

    if (!profile) {
      return res.status(404).json({ message: 'User profile not found' });
    }

    res.status(200).json({ data: profile });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.post('/user-device-token', async (req, res) => {
  try {
    const { userId, deviceType, pushToken } = req.body;

    if (!userId || !deviceType || !pushToken) {
      return res.status(400).json({ message: 'Required fields missing' });
    }

    if (!['ios', 'android'].includes(deviceType)) {
      return res.status(400).json({ message: 'Invalid device type' });
    }

    const newDevice = await UserDevice.create({
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

router.post('/user-location', async (req, res) => {
  try {
    const { latitude, longitude, locationName } = req.body;
    const userId = req.user ? req.user.userId : null;

    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    if (!latitude || !longitude) {
      return res.status(400).json({ message: 'Latitude and longitude are required' });
    }

    // Check if this exact location already exists for the user
    const existingLocation = await UserLocation.findOne({
      where: {
        userId,
        latitude,
        longitude
      }
    });

    if (existingLocation) {
      // Update location name if different
      if (locationName && locationName !== existingLocation.locationName) {
        await existingLocation.update({ locationName });
      }
      return res.status(200).json({ message: 'Location already exists', data: existingLocation });
    }

    // Create new location
    const location = await UserLocation.create({
      latitude,
      longitude,
      locationName,
      userId
    });

    res.status(201).json({ message: 'Location saved successfully', data: location });
  } catch (error) {
    console.error('Error saving user location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user-locations', async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const locations = await UserLocation.findAll({
      where: { userId },
      include: [{ model: PhoneNumber, as: 'user' }],
      order: [['createdAt', 'DESC']] // Order by creation date
    });

    res.status(200).json({ data: locations });
  } catch (error) {
    console.error('Error fetching user locations:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/user-location', async (req, res) => {
  try {
    const userId = req.user ? req.user.userId : null;
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const location = await UserLocation.findOne({
      where: { userId },
      include: [{ model: PhoneNumber, as: 'user' }],
      order: [['createdAt', 'DESC']]
    });

    if (!location) {
      return res.status(404).json({ message: 'User location not found' });
    }

    res.status(200).json({ data: location });
  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
