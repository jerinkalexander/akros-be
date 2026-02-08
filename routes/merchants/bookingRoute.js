const express = require('express');
const router = express.Router();
const Booking = require('../../models/app/Booking');
const Shop = require('../../models/admin/Shop');
const BookingStatus = require('../../models/bookingstatus');
const User = require('../../models/User');
const auth = require('../../middleware/auth');

// Get all bookings for shops owned by logged-in merchant
router.get('/', auth, async (req, res) => {
  try {
    const merchantId = req.user.userId;

    const bookings = await Booking.findAll({
      include: [
        {
          model: Shop,
          where: { ownerId: merchantId },
          attributes: ['id', 'name', 'ownerId']
        },
        {
          model: BookingStatus,
          attributes: ['id', 'name']
        },
        {
          model: User,
          attributes: ['id', 'number']
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ count: bookings.length, data: bookings });
  } catch (err) {
    console.error('Error fetching merchant bookings:', err);
    res.status(500).json({ error: err.message });
  }
});

// Get single booking for merchant's shop
router.get('/:id', auth, async (req, res) => {
  try {
    const merchantId = req.user.userId;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [
        {
          model: Shop,
          where: { ownerId: merchantId },
          attributes: ['id', 'name', 'ownerId']
        },
        { model: BookingStatus, attributes: ['id', 'name'] },
        { model: User, attributes: ['id', 'number'] }
      ]
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found or not authorized' });

    res.status(200).json(booking);
  } catch (err) {
    console.error('Error fetching booking:', err);
    res.status(500).json({ error: err.message });
  }
});

// Accept a booking (set status to 'confirmed')
router.post('/:id/accept', auth, async (req, res) => {
  try {
    const merchantId = req.user.userId;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [{ model: Shop, where: { ownerId: merchantId } }]
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found or not authorized' });

    const confirmed = await BookingStatus.findOne({ where: { name: 'confirmed' } });
    if (!confirmed) return res.status(500).json({ error: 'Confirmed status not found' });

    booking.statusId = confirmed.id;
    await booking.save();

    res.status(200).json({ message: 'Booking accepted', data: booking });
  } catch (err) {
    console.error('Error accepting booking:', err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking (set status to 'cancelled')
router.post('/:id/cancel', auth, async (req, res) => {
  try {
    const merchantId = req.user.userId;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [{ model: Shop, where: { ownerId: merchantId } }]
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found or not authorized' });

    const cancelled = await BookingStatus.findOne({ where: { name: 'cancelled' } });
    if (!cancelled) return res.status(500).json({ error: 'Cancelled status not found' });

    booking.statusId = cancelled.id;
    await booking.save();

    res.status(200).json({ message: 'Booking cancelled', data: booking });
  } catch (err) {
    console.error('Error cancelling booking:', err);
    res.status(500).json({ error: err.message });
  }
});

// Cancel a booking (set status to 'completed')
router.post('/:id/complete', auth, async (req, res) => {
  try {
    const merchantId = req.user.userId;
    const bookingId = req.params.id;

    const booking = await Booking.findOne({
      where: { id: bookingId },
      include: [{ model: Shop, where: { ownerId: merchantId } }]
    });

    if (!booking) return res.status(404).json({ error: 'Booking not found or not authorized' });

    const completed = await BookingStatus.findOne({ where: { name: 'completed' } });
    if (!completed) return res.status(500).json({ error: 'Completed status not found' });

    booking.statusId = completed.id;
    await booking.save();

    res.status(200).json({ message: 'Booking completed', data: booking });
  } catch (err) {
    console.error('Error completing booking:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
