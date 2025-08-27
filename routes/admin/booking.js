const express = require('express');
const router = express.Router();
const Booking = require('../../models/app/Booking');
const Entity = require('../../models/admin/Entity');

// ✅ Admin: Get all bookings 
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.findAll({
      include: [{ model: Entity }],
      order: [['createdAt', 'DESC']]
    });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: Get single booking by ID
router.get('/:id', async (req, res) => {
  try {
    const booking = await Booking.findOne({
      where: { id: req.params.id },
      include: [{ model: Entity }]
    });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Admin: Delete booking by ID
router.delete('/:id' , async (req, res) => {
  try {
    const booking = await Booking.findByPk(req.params.id);

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    await booking.destroy();
    res.json({ message: 'Booking deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
