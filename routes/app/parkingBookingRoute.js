const express = require('express');
const router = express.Router();
const ParkingBooking = require('../../models/app/ParkingBooking');
const Parking = require('../../models/admin/Parking');
const BookingStatus = require('../../models/bookingstatus');
const auth = require('../../middleware/auth'); // Sets req.user (e.g., users.id)

// ✅ Create a parking booking (for logged-in user)
router.post('/', auth, async (req, res) => {
  try {
    const { parkingId, bookingDate, bookingTime, duration, note } = req.body;

    // Check if Parking exists
    const parking = await Parking.findByPk(parkingId);
    if (!parking) {
      return res.status(404).json({ error: 'Parking not found' });
    }

    // Calculate total amount based on parking rates and duration
    let totalAmount = 0;
    if (duration && parking.hourlyRate) {
      totalAmount = duration * parseFloat(parking.hourlyRate);
    } else if (parking.dailyRate) {
      totalAmount = parseFloat(parking.dailyRate);
    }

    // Get the default status (pending)
    const defaultStatus = await BookingStatus.findOne({ where: { name: 'pending' } });
    if (!defaultStatus) {
      return res.status(500).json({ error: 'Default booking status not found' });
    }

    // Create parking booking with logged-in user's ID and default status
    const parkingBooking = await ParkingBooking.create({
      parkingId,
      userId: req.user.userId,
      bookingDate,
      bookingTime,
      duration,
      totalAmount,
      statusId: defaultStatus.id,
      note
    });

    res.status(201).json(parkingBooking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// ✅ Get all parking bookings of logged-in user
router.get('/', auth, async (req, res) => {
  try {
    const parkingBookings = await ParkingBooking.findAll({
      where: { userId: req.user.userId },
      include: [{ model: Parking }],
      order: [['createdAt', 'DESC']]
    });

    res.json(parkingBookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get a single parking booking (by ID) of logged-in user
router.get('/:id', auth, async (req, res) => {
  try {
    const parkingBooking = await ParkingBooking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId   // Ensures booking belongs to this user
      },
      include: [{ model: Parking }]
    });

    if (!parkingBooking) {
      return res.status(404).json({ error: 'Parking booking not found or not authorized' });
    }

    res.json(parkingBooking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a parking booking (only if it belongs to logged-in user)
router.delete('/:id', auth, async (req, res) => {
  try {
    const parkingBookingId = req.params.id;
    const userId = req.user.userId;

    // Check if parking booking exists and belongs to the user
    const parkingBooking = await ParkingBooking.findOne({
      where: {
        id: parkingBookingId,
        userId: userId
      }
    });

    if (!parkingBooking) {
      return res.status(404).json({ error: 'Parking booking not found or not authorized' });
    }

    await parkingBooking.destroy(); // Delete the parking booking
    res.json({ message: 'Parking booking deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
