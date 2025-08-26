const express = require('express');
const router = express.Router();
const Booking = require('../../models/app/Booking');
const Entity = require('../../models/admin/Entity');
const auth = require('../../middleware/auth'); // Sets req.user (e.g., phone_numbers.id)


// ✅ Create a booking (for logged-in phone number)
router.post('/bookings', auth, async (req, res) => {
  try {
    const { entityId, userName, userContact, bookingDate, bookingTime, note } = req.body;

    // Check if Entity exists
    const entity = await Entity.findByPk(entityId);
    if (!entity) {
      return res.status(404).json({ error: 'Entity not found' });
    }

    // Create booking with logged-in user's phone_number ID
    const booking = await Booking.create({
      entityId,
      userId: req.user.id,  // userId is phone_numbers.id
      userName,
      userContact,
      bookingDate,
      bookingTime,
      note
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Get all bookings of logged-in phone number
router.get('/bookings', auth, async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      where: { userId: req.user.id },
      include: [{ model: Entity }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get a single booking (by ID) of logged-in phone number
router.get('/bookings/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.id   // Ensures booking belongs to this phone_number
      },
      include: [{ model: Entity }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Delete a booking (only if it belongs to logged-in user)
router.delete('/bookings/:id', auth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.id; // Set by your auth middleware from x-user-id

    // Check if booking exists and belongs to the user
    const booking = await Booking.findOne({
      where: {
        id: bookingId,
        userId: userId
      }
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not authorized' });
    }

    await booking.destroy(); // Delete the booking
    res.json({ message: 'Booking deleted successfully' });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
