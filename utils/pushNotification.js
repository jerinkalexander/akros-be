const admin = require('firebase-admin');
const path = require('path');

// Initialize Firebase Admin SDK
// The service account JSON file path should be set in environment variable FIREBASE_SERVICE_ACCOUNT_PATH
// Example: export FIREBASE_SERVICE_ACCOUNT_PATH=./path/to/serviceAccountKey.json
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;

if (!serviceAccountPath) {
  console.error('FIREBASE_SERVICE_ACCOUNT_PATH environment variable is not set. Firebase Admin SDK will not be initialized.');
} else {
  try {
    const serviceAccount = require(path.resolve(serviceAccountPath));
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin SDK initialized successfully.');
  } catch (error) {
    console.error('Failed to initialize Firebase Admin SDK:', error);
  }
}

// Function to send push notification to a user
async function sendPushNotification(userId, title, body) {
  try {
    const UserDevice = require('../models/UserDevice');

    // Get all active device tokens for the user
    const devices = await UserDevice.findAll({
      where: {
        userId: userId,
        isActive: true
      }
    });

    if (devices.length === 0) {
      throw new Error('No active devices found for the user');
    }

    const tokens = devices.map(device => device.pushToken);

    // Prepare the message payload
    const payload = {
      notification: {
        title: title,
        body: body
      }
    };

    // Send the notification to all devices
    const response = await admin.messaging().sendToDevice(tokens, payload);

    console.log('Push notification sent successfully:', response);
    return { success: true, message: 'Push notification sent', response };
  } catch (error) {
    console.error('Error sending push notification:', error);
    throw error;
  }
}

module.exports = {
  sendPushNotification
};
