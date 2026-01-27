const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Role = require('../../models/Role');

// ✅ GET all merchant role users
router.get('/', async (req, res) => {
  try {
    const merchants = await User.findAll({
      include: [
        {
          model: Role,
          where: { name: 'merchant' }
        }
      ]
    });

    if (merchants.length === 0) {
      return res.status(200).json({
        message: 'No merchants found',
        data: []
      });
    }

    res.status(200).json({
      message: 'Merchants retrieved successfully',
      count: merchants.length,
      data: merchants
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
