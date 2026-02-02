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

// DELETE /admin/merchants/:id - soft-delete a merchant user
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, { include: [Role] });
    if (!user) return res.status(404).json({ error: 'User not found' });

    // ensure the user is a merchant
    if (!user.Role || user.Role.name !== 'merchant') {
      return res.status(400).json({ error: 'User is not a merchant' });
    }

    await user.destroy(); // soft-delete thanks to paranoid:true
    res.status(200).json({ message: 'Merchant soft-deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});
