const express = require('express');
const router = express.Router();
const Booking = require('../../models/app/Booking');
const Shop = require('../../models/admin/Shop');
const BookingStatus = require('../../models/bookingstatus');
const { Op } = require('sequelize');
const auth = require('../../middleware/auth'); // Sets req.user (e.g., users.id)

// ✅ Create a booking (for logged-in user)
router.post('/', auth, async (req, res) => {
  try {
    const { shopId, bookingDate, bookingTime, duration, note } = req.body;

    // Check if Shop exists
    const shop = await Shop.findByPk(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Get the default status (pending)
    const defaultStatus = await BookingStatus.findOne({ where: { name: 'pending' } });
    if (!defaultStatus) {
      return res.status(500).json({ error: 'Default booking status not found' });
    }

    // Prevent duplicate bookings: same shop, same date, same time, same user
    const cancelledStatus = await BookingStatus.findOne({ where: { name: 'cancelled' } });
    const conflictWhere = {
      shopId,
      userId: req.user.userId,
      bookingDate,
      bookingTime
    };
    if (cancelledStatus) {
      conflictWhere.statusId = { [Op.ne]: cancelledStatus.id };
    }

    const existing = await Booking.findOne({ where: conflictWhere });
    if (existing) {
      return res.status(409).json({ error: 'This slot is already booked by you' });
    }

    // Create booking with logged-in user's ID and default status
    const booking = await Booking.create({
      shopId,
      userId: req.user.userId,
      bookingDate,
      bookingTime,
      duration,
      statusId: defaultStatus.id,
      note
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});


// ✅ Get all bookings of logged-in user
router.get('/', auth, async (req, res) => {
  try {
    // Base where clause for user
    const where = { userId: req.user.userId };

    // Optional: show only upcoming bookings when ?upcoming=true
    const upcomingParam = (req.query.upcoming || '').toString().toLowerCase();
    if (upcomingParam === 'true' || upcomingParam === '1' || upcomingParam === 'yes') {
      const now = new Date();
      const dateOnly = now.toISOString().slice(0, 10); // YYYY-MM-DD (UTC)
      const pad = (n) => (n < 10 ? '0' + n : '' + n);
      const timeNow = `${pad(now.getHours())}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

      where[Op.or] = [
        { bookingDate: { [Op.gt]: dateOnly } },
        { [Op.and]: [{ bookingDate: dateOnly }, { bookingTime: { [Op.gte]: timeNow } }] }
      ];
    }

    const bookings = await Booking.findAll({
      where,
      include: [{ model: Shop }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get a single booking (by ID) of logged-in user
router.get('/:id', auth, async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: {
        id: req.params.id,
        userId: req.user.userId   // Ensures booking belongs to this user
      },
      include: [{ model: Shop }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found or not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Cancel a booking (only if it belongs to logged-in user)
router.put('/:id', auth, async (req, res) => {
  try {
    const bookingId = req.params.id;
    const userId = req.user.userId; // Set by your auth middleware

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

    // Instead of deleting, set status to 'cancelled'
    const cancelledStatus = await BookingStatus.findOne({ where: { name: 'cancelled' } });
    if (!cancelledStatus) {
      return res.status(500).json({ error: 'Cancelled status not found' });
    }

    booking.statusId = cancelledStatus.id;
    await booking.save();

    res.json({ message: 'Booking cancelled successfully', data: booking });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
module.exports = router;
