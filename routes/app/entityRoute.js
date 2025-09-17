const express = require('express');
const router = express.Router();
const Shop = require('../../models/admin/Shop');
const CategoryType = require('../../models/admin/CategoryType');

// ✅ LIST All Shops with Pagination and Search
router.get('/shops', async (req, res) => {
  try {
    // Pagination params
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    // Search param
    const search = req.query.search || '';

    // Build where clause for search
    const where = search
      ? {
          name: { [require('sequelize').Op.like]: `%${search}%` }
        }
      : {};

    const { count, rows: shops } = await Shop.findAndCountAll({
      where,
      include: [{ model: CategoryType }],
      order: [['createdAt', 'DESC']],
      limit,
      offset
    });

    res.json({
      total: count,
      page,
      pageSize: limit,
      shops
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get one Shop by ID (for app)
router.get('/shops/:id', async (req, res) => {
  try {
    const shop = await Shop.findByPk(req.params.id, {
      include: [{ model: CategoryType }]
    });

    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.json(shop);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
